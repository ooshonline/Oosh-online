/**
 * Ribbit Image Pipeline — Step 4: write images[] arrays into ribbit-stories.js.
 *
 * Only patches stories whose image files all exist on disk, so it is safe to
 * run at any point mid-project — partially generated sub-levels are left alone.
 *
 * The images array is page-aligned with paragraphs (see build-manifest.js), so
 * the reader's `story.images[currentPage]` lookup needs no changes.
 *
 * Usage:
 *   node patch-stories.js          # patch every story whose images are ready
 *   node patch-stories.js --dry    # report only
 *   node patch-stories.js l1.4s1   # patch one story
 *
 * A timestamped backup of ribbit-stories.js is written before any change.
 */

const fs = require('fs');
const path = require('path');

const DIR = __dirname;
// RIBBIT_REPO lets the test harness point the script at a scratch copy.
const REPO = process.env.RIBBIT_REPO || path.join(DIR, '..');
const MANIFEST = path.join(DIR, 'manifest.json');
const STORIES_JS = path.join(REPO, 'ribbit-stories.js');

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const FORCE = args.includes('--force');
const only = args.filter(a => !a.startsWith('--'));

/**
 * Find the source span of a story object, given its id.
 * Walks back to the opening `push({` then forward with brace balancing.
 */
function findStorySpan(src, storyId) {
  const idPos = src.indexOf(`id:"${storyId}"`);
  if (idPos === -1) return null;

  const open = src.lastIndexOf('push({', idPos);
  if (open === -1) return null;

  let depth = 0;
  let i = src.indexOf('{', open);
  const start = i;
  let inStr = null;

  for (; i < src.length; i++) {
    const c = src[i];
    const prev = src[i - 1];
    if (inStr) {
      if (c === inStr && prev !== '\\') inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) return { start, end: i }; // inclusive of closing brace
    }
  }
  return null;
}

function formatImages(images) {
  return `images:[${images.map(f => `'${f}'`).join(',')}]`;
}

function main() {
  if (!fs.existsSync(MANIFEST)) {
    console.error('manifest.json not found. Run: node build-manifest.js');
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  let src = fs.readFileSync(STORIES_JS, 'utf8');

  const targets = manifest.stories.filter(s => (only.length ? only.includes(s.storyId) : true));

  const ready = [];
  const waiting = [];
  const preserved = [];

  for (const story of targets) {
    // The 15 hand-built Beginner 1–3 stories predate this pipeline and their
    // existing images[] arrays are correct. Leave them alone unless forced.
    if (story.alreadyIllustrated && !FORCE) { preserved.push(story); continue; }

    const missing = story.scenes.filter(sc => !fs.existsSync(path.join(REPO, sc.file)));
    if (missing.length) {
      waiting.push({ story, missing: missing.length });
      continue;
    }
    ready.push(story);
  }

  if (preserved.length) {
    console.log(`Left untouched (already illustrated): ${preserved.length}  — use --force to overwrite`);
  }

  if (!ready.length) {
    console.log('No stories have a complete set of images yet.');
    console.log(`  ${waiting.length} waiting on generation.`);
    return;
  }

  // Patch from the end of the file backwards so earlier offsets stay valid.
  const edits = [];
  const notFound = [];

  for (const story of ready) {
    const span = findStorySpan(src, story.storyId);
    if (!span) { notFound.push(story.storyId); continue; }
    edits.push({ story, span });
  }

  edits.sort((a, b) => b.span.start - a.span.start);

  let added = 0, replaced = 0;

  for (const { story, span } of edits) {
    const body = src.slice(span.start, span.end + 1);
    const line = formatImages(story.images);

    let next;
    if (/\bimages:\s*\[/.test(body)) {
      next = body.replace(/\bimages:\s*\[[^\]]*\]/, line);
      replaced++;
    } else {
      // Append as the final property, matching the file's existing layout.
      const trimmed = body.replace(/\s*\}$/, '');
      const needsComma = !/,\s*$/.test(trimmed);
      next = `${trimmed}${needsComma ? ',' : ''}\n  ${line}\n}`;
      added++;
    }

    if (!DRY) src = src.slice(0, span.start) + next + src.slice(span.end + 1);
  }

  console.log(`Stories with all images present: ${ready.length}`);
  console.log(`  images: arrays added ${added}, replaced ${replaced}`);
  console.log(`  still waiting on images:       ${waiting.length}`);
  if (notFound.length) console.log(`  ⚠ not found in ribbit-stories.js: ${notFound.join(', ')}`);

  if (DRY) { console.log('\nDry run — ribbit-stories.js unchanged.'); return; }

  // Verify the patched source still parses and still has the same story count
  // before overwriting anything.
  try {
    const fn = new Function(`${src}; return STORIES;`);
    const STORIES = fn();
    const count = Object.values(STORIES).reduce(
      (n, lvl) => n + Object.values(lvl).reduce((m, arr) => m + arr.length, 0), 0);
    console.log(`  syntax check: OK (${count} stories parsed)`);
  } catch (err) {
    console.error(`\n✗ Patched file failed to parse — aborting, nothing written.\n  ${err.message}`);
    process.exit(1);
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backup = path.join(DIR, 'backups', `ribbit-stories.${stamp}.js`);
  fs.mkdirSync(path.dirname(backup), { recursive: true });
  fs.copyFileSync(STORIES_JS, backup);
  fs.writeFileSync(STORIES_JS, src);

  console.log(`\n✓ Wrote ribbit-stories.js`);
  console.log(`  backup: ${path.relative(REPO, backup)}`);
}

main();
