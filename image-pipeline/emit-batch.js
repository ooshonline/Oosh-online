/**
 * Ribbit Image Pipeline — Step 2b: emit a batch of prompts to work through.
 *
 * Writes one ready-to-paste .txt per story into batches/<folder>/, creates the
 * matching empty drop folders, and generates a checklist to tick off across
 * however many sessions the batch takes.
 *
 * Usage:
 *   node emit-batch.js b4            # one sub-level
 *   node emit-batch.js b4 b5 b6      # several
 *   node emit-batch.js --list        # show every folder and its image count
 *   node emit-batch.js --todo        # folders with no images generated yet
 */

const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const REPO = path.join(DIR, '..');
const MANIFEST = path.join(DIR, 'manifest.json');

const args = process.argv.slice(2);

function load() {
  if (!fs.existsSync(MANIFEST)) {
    console.error('manifest.json not found. Run: node build-manifest.js');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
}

function summarise(manifest) {
  const folders = new Map();
  for (const s of manifest.stories) {
    if (!folders.has(s.folder)) folders.set(s.folder, { level: s.level, stories: 0, images: 0, done: 0 });
    const f = folders.get(s.folder);
    f.stories++;
    f.images += s.imageCount;
    f.done += s.scenes.filter(sc => fs.existsSync(path.join(REPO, sc.file))).length;
  }
  return folders;
}

// --next: print the single next unstarted story as JSON. Used by the daily skill.
if (args.includes('--next')) {
  const manifest = load();
  const next = manifest.stories.find(s =>
    !s.alreadyIllustrated && s.scenes.some(sc => !fs.existsSync(path.join(REPO, sc.file))));
  if (!next) { console.log(JSON.stringify({ done: true })); process.exit(0); }
  console.log(JSON.stringify({
    done: false,
    storyId: next.storyId,
    title: next.title,
    level: next.level,
    folder: next.folder,
    imageCount: next.imageCount,
    guide: next.prompt.slice(next.prompt.indexOf('Character consistency guide:')),
    scenes: next.scenes.map(sc => ({ n: sc.n, text: sc.text, file: sc.file })),
  }, null, 1));
  process.exit(0);
}

if (args.includes('--list') || args.includes('--todo') || args.length === 0) {
  const manifest = load();
  const folders = summarise(manifest);
  const todoOnly = args.includes('--todo');

  console.log('folder  level                  stories  images  generated');
  console.log('─'.repeat(60));
  let ti = 0, td = 0;
  for (const [name, f] of folders) {
    ti += f.images; td += f.done;
    if (todoOnly && f.done >= f.images) continue;
    const bar = f.done >= f.images ? '✓ done' : `${f.done}/${f.images}`;
    console.log(`${name.padEnd(7)} ${f.level.padEnd(22)} ${String(f.stories).padStart(7)} ${String(f.images).padStart(7)}  ${bar}`);
  }
  console.log('─'.repeat(60));
  console.log(`total: ${td} / ${ti} images generated (${((td / ti) * 100).toFixed(1)}%)`);
  if (args.length === 0) console.log('\nTo emit a batch:  node emit-batch.js b4');
  process.exit(0);
}

// ─── Emit ─────────────────────────────────────────────────────────────────────

const manifest = load();
const wanted = args.filter(a => !a.startsWith('--'));

for (const folder of wanted) {
  const stories = manifest.stories.filter(s => s.folder === folder);
  if (!stories.length) {
    console.log(`✗ ${folder} — no stories with that folder. Try: node emit-batch.js --list`);
    continue;
  }

  const outDir = path.join(DIR, 'batches', folder);
  fs.mkdirSync(outDir, { recursive: true });

  const lines = [
    `# Batch ${folder} — ${stories[0].level}`,
    '',
    `${stories.length} stories · ${stories.reduce((n, s) => n + s.imageCount, 0)} images`,
    '',
    'For each story: paste the prompt into AI Studio, download the images it',
    'returns, and drop them into the matching folder below **in order**.',
    '',
    '| ✓ | Story | Images | Prompt file | Drop into |',
    '|---|-------|--------|-------------|-----------|',
  ];

  for (const s of stories) {
    const file = `${s.storyId}_${s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.txt`;
    fs.writeFileSync(path.join(outDir, file), s.prompt + '\n');
    fs.mkdirSync(path.join(DIR, 'drop', s.storyId), { recursive: true });
    lines.push(`| [ ] | ${s.title} | ${s.imageCount} | \`batches/${folder}/${file}\` | \`drop/${s.storyId}/\` |`);
  }

  lines.push(
    '',
    '## When the batch is done',
    '',
    '```bash',
    'cd image-pipeline',
    'node ingest.js          # rename + compress into images/' + folder + '/',
    'node patch-stories.js   # write images[] into ribbit-stories.js',
    '```',
    ''
  );

  fs.writeFileSync(path.join(outDir, 'CHECKLIST.md'), lines.join('\n'));
  console.log(`✓ ${folder}: ${stories.length} prompt files → batches/${folder}/  (checklist included)`);
}
