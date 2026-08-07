/**
 * Ribbit Image Pipeline — Step 3: ingest downloaded images.
 *
 * You generate a story's images in AI Studio and download them. Drop them into
 *   image-pipeline/drop/<storyId>/
 * in the order they were generated (AI Studio's own filenames sort correctly,
 * but the script falls back to file modified time if they don't).
 *
 * This script renames them to the manifest's target filenames, compresses to
 * WebP at quality 78 (same setting as the original compress-images.js), and
 * writes them into the app's images/ folder.
 *
 * Usage:
 *   node ingest.js              # ingest everything waiting in drop/
 *   node ingest.js l1.4s1       # ingest one story
 *   node ingest.js --dry        # report what would happen, change nothing
 *
 * Prerequisite: npm install sharp
 */

const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const REPO = path.join(DIR, '..');
const DROP = path.join(DIR, 'drop');
const MANIFEST = path.join(DIR, 'manifest.json');
const QUALITY = 78;
const EXT = /\.(png|jpe?g|webp)$/i;

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const only = args.filter(a => !a.startsWith('--'));

/**
 * Prefer a local install, but fall back to the copy that already lives in
 * image-compression-workspace so there's nothing new to install.
 * Only needed for real runs — a dry run never touches an image.
 */
let sharp = null;
let sharpChecked = false;
function loadSharp() {
  if (sharpChecked) return sharp;
  sharpChecked = true;
  for (const id of ['sharp', path.join(REPO, 'image-compression-workspace', 'node_modules', 'sharp')]) {
    try { sharp = require(id); return sharp; } catch { /* try next */ }
  }
  return null;
}

/**
 * Convert to WebP q78 at original size. Prefers sharp; falls back to convert.py
 * (Pillow) when sharp's native binary doesn't match the platform — which happens
 * when a Linux session uses the macOS sharp installed in image-compression-workspace.
 */
async function toWebp(src, dest) {
  const s = loadSharp();
  if (s) { await s(src).webp({ quality: QUALITY }).toFile(dest); return 'sharp'; }

  const { execFileSync } = require('child_process');
  execFileSync('python3', [path.join(DIR, 'convert.py'), src, dest], { stdio: 'pipe' });
  return 'pillow';
}

/**
 * Chrome saves every download to one folder, so images arrive in drop/_inbox/
 * already named <storyId>_<scene>.<ext> (set via the download attribute at
 * generation time). Sweep them into their per-story folders before ingesting.
 * This makes routing depend on the filename rather than on drop order.
 */
function sweepInbox() {
  const inbox = path.join(DROP, '_inbox');
  if (!fs.existsSync(inbox)) return { moved: 0, unrecognised: [] };

  const files = fs.readdirSync(inbox).filter(n => EXT.test(n));
  let moved = 0;
  const unrecognised = [];

  for (const name of files) {
    // e.g. "l1.4s1_2.png" → story l1.4s1, scene 2. Chrome may append " (1)".
    const m = name.match(/^(l\d+\.\d+s\d+)_(\d+)(?:\s*\(\d+\))?\.[a-z]+$/i);
    if (!m) { unrecognised.push(name); continue; }
    const [, storyId, scene] = m;

    const destDir = path.join(DROP, storyId);
    const dest = path.join(destDir, `${storyId}_${String(scene).padStart(2, '0')}${path.extname(name)}`);

    if (DRY) { console.log(`   would move _inbox/${name} → ${storyId}/${path.basename(dest)}`); moved++; continue; }
    fs.mkdirSync(destDir, { recursive: true });
    fs.renameSync(path.join(inbox, name), dest);
    moved++;
  }
  return { moved, unrecognised };
}

function listImages(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter(e => e.isFile() && EXT.test(e.name))
    .map(e => {
      const full = path.join(dir, e.name);
      return { name: e.name, full, mtime: fs.statSync(full).mtimeMs };
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }) || a.mtime - b.mtime);
}

async function main() {
  if (!fs.existsSync(MANIFEST)) {
    console.error('manifest.json not found. Run: node build-manifest.js');
    process.exit(1);
  }
  if (!fs.existsSync(DROP)) {
    console.log(`Nothing to do — ${path.relative(REPO, DROP)} does not exist yet.`);
    return;
  }

  const swept = sweepInbox();
  if (swept.moved) console.log(`Swept ${swept.moved} file(s) out of _inbox into story folders.`);
  if (swept.unrecognised.length) {
    console.log(`⚠ ${swept.unrecognised.length} file(s) in _inbox don't match <storyId>_<scene>.<ext> and were left alone:`);
    swept.unrecognised.slice(0, 8).forEach(n => console.log(`   ${n}`));
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const byId = new Map(manifest.stories.map(s => [s.storyId, s]));

  const folders = fs
    .readdirSync(DROP, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name)
    .filter(n => !n.startsWith('_'))                       // _inbox is a staging area, not a story
    .filter(n => (only.length ? only.includes(n) : true));

  if (!folders.length) {
    console.log('No story folders waiting in drop/.');
    return;
  }

  let ok = 0, skipped = 0, failed = 0;

  for (const storyId of folders) {
    const story = byId.get(storyId);
    if (!story) {
      console.log(`✗  ${storyId} — not in manifest (is the folder name a story id?)`);
      failed++;
      continue;
    }

    const files = listImages(path.join(DROP, storyId));
    const want = story.imageCount;

    if (files.length === 0) { skipped++; continue; }
    if (files.length !== want) {
      console.log(`✗  ${storyId} "${story.title}" — found ${files.length} image(s), expected ${want}. Skipped.`);
      failed++;
      continue;
    }

    console.log(`\n${storyId} · ${story.title}  (${want} image${want === 1 ? '' : 's'})`);

    for (let i = 0; i < want; i++) {
      const src = files[i].full;
      const dest = path.join(REPO, story.scenes[i].file);

      if (DRY) {
        console.log(`   would write ${files[i].name} → ${story.scenes[i].file}`);
        continue;
      }

      try {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        const before = fs.statSync(src).size;
        await toWebp(src, dest);
        const after = fs.statSync(dest).size;
        const saved = (((before - after) / before) * 100).toFixed(0);
        console.log(
          `   ✓ ${files[i].name.padEnd(28)} → ${path.basename(dest).padEnd(30)} ` +
          `${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB (−${saved}%)`
        );
        ok++;
      } catch (err) {
        console.log(`   ✗ ${files[i].name} — ${err.message}`);
        failed++;
      }
    }
  }

  console.log(`\n${'─'.repeat(64)}`);
  console.log(DRY ? 'Dry run — nothing written.' : `Ingested ${ok} image(s). ${failed} failed, ${skipped} folder(s) empty.`);
  if (!DRY && ok > 0) console.log('Next:  node patch-stories.js');
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
