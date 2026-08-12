/**
 * Ribbit Image Pipeline — Step 2: build the manifest.
 *
 * Joins prompts.json (from "Images to Use.xlsx") to ribbit-stories.js (the app)
 * and works out, for every story, how many images to generate and which reader
 * page each one belongs to.
 *
 * The app renders `story.images[currentPage]`, so the images array must be the
 * same length as `paragraphs` and index-aligned with it. Two story shapes exist:
 *
 *   FINE   — paragraphs are shorter than spreadsheet steps (e.g. "Bedtime":
 *            9 one-sentence pages, 4 planned images). One image covers several
 *            pages; the images array repeats the same file across them.
 *   COARSE — paragraphs are longer than spreadsheet steps (e.g. "My Pet Fish":
 *            2 big pages, 5 planned images). Generating 5 would waste 3, so the
 *            paragraph becomes the unit and we generate 2.
 *
 * Prompts are rebuilt from the spreadsheet's own template so the image count
 * and the per-image scene breakdown always match what we actually need.
 *
 * Usage:  node build-manifest.js
 * Output: manifest.json  (+ unmatched.json if anything failed to join)
 */

const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const REPO = path.join(DIR, '..');
const PROMPTS = path.join(DIR, 'prompts.json');
const STORIES_JS = path.join(REPO, 'ribbit-stories.js');
const OVERRIDES = path.join(DIR, 'character-guides.json');
const OUT = path.join(DIR, 'manifest.json');

const LEVELS = {
  'Beginner': { id: 1, prefix: 'b' },
  'Elementary': { id: 2, prefix: 'e' },
  'Pre-Intermediate': { id: 3, prefix: 'p' },
  'Intermediate': { id: 4, prefix: 'i' },
  'Upper-Intermediate': { id: 5, prefix: 'u' },
  'Advanced': { id: 6, prefix: 'a' },
};

// ─── Prompt template ──────────────────────────────────────────────────────────
// Lifted verbatim from the spreadsheet's own wording; only the counts and the
// scene breakdown are generated, so the house style stays exactly as written.

function buildPrompt({ n, scenes, guide, mood }) {
  const plural = n === 1 ? 'illustration' : 'illustrations';
  const sceneLines = scenes
    .map((s, i) => `- Image ${i + 1}: ${s}`)
    .join('\n');

  return `Create ${n} warm, child-friendly ${plural} in the style of classic early-reader school storybooks similar to Oxford Reading Tree. The images should look like professionally illustrated children's reading book pages for ages 5–8. Use soft watercolor or lightly textured digital painting with clean outlines, expressive faces, gentle colors, and detailed but uncluttered backgrounds. The characters must remain visually consistent across all ${n} images.

Important style requirements:
- Generate exactly ${n} sequential images that show the story progressing
- Same characters, clothing, hairstyles, and colors in every image
- Bright, welcoming classroom, home, or outdoor environments
- Diverse facial expressions that clearly show emotions
- Simple, easy-to-understand actions for young readers
- Realistic proportions with slightly cartoon-like warmth
- No exaggerated anime features
- Landscape orientation
- High detail suitable for print in a children's reading app
- Keep the composition clear so the scene matches the story instantly
- Avoid text, captions, labels, or speech bubbles in the image

Image structure — one image per numbered scene below, in order:
${sceneLines}

For each image:
1. Show clear visual progression between scenes
2. Keep character appearance fully consistent
3. Slightly vary camera angles and composition for visual interest
4. Keep backgrounds supportive but not distracting
5. Make the sequence feel like pages from a real children's reading book

${guide}
Mood:
${mood}`;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function norm(s) {
  return String(s)
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^a-z0-9' ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function slug(title) {
  return String(title)
    .toLowerCase()
    .replace(/[‘’']/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function parseLevel(label) {
  const m = String(label).match(/^(.*?)\s+(\d+)$/);
  if (!m) return null;
  const meta = LEVELS[m[1].trim()];
  if (!meta) return null;
  return { levelId: meta.id, prefix: meta.prefix, subNum: parseInt(m[2], 10) };
}

/**
 * Sub-level array index. All levels are 0-indexed.
 * Note: Research/ribbit-context.md claims Level 6 is 1-indexed. That is stale —
 * STORIES[6] uses keys 0–9 like every other level (verified 2026-08-04).
 */
function subIndex(levelId, subNum) {
  return subNum - 1;
}

/**
 * b2/b3 (Beginner 2/3) originally illustrated at the spreadsheet's coarser step
 * granularity — 2 images for 4-paragraph stories, 3 for 6-paragraph stories.
 * images[] ended up shorter than paragraphs[], so illustrations vanished partway
 * through the story. Force these onto one image per paragraph instead of letting
 * mapStepsToParagraphs bind them to the shorter step-based "fine" set.
 */
const FORCE_PER_PAGE = new Set([
  'l1.2s1', 'l1.2s2', 'l1.2s3', 'l1.2s4', 'l1.2s5',
  'l1.3s1', 'l1.3s2', 'l1.3s3', 'l1.3s4', 'l1.3s5',
]);

function loadStories() {
  const src = fs.readFileSync(STORIES_JS, 'utf8');
  const fn = new Function(
    `${src}; return { STORIES, JOURNEY_STORIES: typeof JOURNEY_STORIES !== 'undefined' ? JOURNEY_STORIES : {} };`
  );
  return fn();
}

/** Pull the bespoke "Character consistency guide" / "Mood" tail out of a prompt. */
function splitTail(prompt) {
  const gi = prompt.indexOf('Character consistency guide:');
  const mi = prompt.indexOf('Mood:');
  if (gi === -1 || mi === -1) return { guide: '', mood: '' };
  return {
    guide: prompt.slice(gi, mi).trim() + '\n',
    mood: prompt.slice(mi + 'Mood:'.length).trim(),
  };
}

/**
 * Try to express each spreadsheet step as a whole number of app paragraphs.
 * Returns an array of paragraph-index arrays, or null if they don't line up.
 */
function mapStepsToParagraphs(steps, paragraphs) {
  const result = [];
  let p = 0;
  for (const step of steps) {
    const target = norm(step.text);
    let acc = '';
    const idx = [];
    while (p < paragraphs.length) {
      const next = norm(paragraphs[p]);
      acc = acc ? `${acc} ${next}` : next;
      idx.push(p);
      p++;
      if (acc === target) break;
      if (acc.length > target.length) return null;
    }
    if (acc !== target) return null;
    result.push(idx);
  }
  while (p < paragraphs.length) result[result.length - 1].push(p++);
  return result;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const prompts = JSON.parse(fs.readFileSync(PROMPTS, 'utf8'));
  const { STORIES } = loadStories();
  const overrides = fs.existsSync(OVERRIDES)
    ? JSON.parse(fs.readFileSync(OVERRIDES, 'utf8'))
    : {};

  const entries = [];
  const problems = [];
  const shapes = { fine: 0, coarse: 0 };

  // Track which app stories we've already claimed, so duplicate titles across
  // sub-levels don't both bind to the same story object.
  const claimed = new Set();

  for (const row of prompts) {
    const lv = parseLevel(row.level);
    if (!lv) { problems.push({ level: row.level, title: row.title, why: 'unknown level label' }); continue; }

    const bucket = (STORIES[lv.levelId] || {})[subIndex(lv.levelId, lv.subNum)];
    if (!bucket) { problems.push({ level: row.level, title: row.title, why: 'no stories at this sub-level' }); continue; }

    const story = bucket.find(s => norm(s.title) === norm(row.title) && !claimed.has(s.id));
    if (!story) { problems.push({ level: row.level, title: row.title, why: 'title not found in this sub-level' }); continue; }
    claimed.add(story.id);

    const paras = story.paragraphs;
    const mapping = FORCE_PER_PAGE.has(story.id) ? null : mapStepsToParagraphs(row.steps, paras);

    // Decide the scene unit.
    let scenes, pageMap;
    if (mapping) {
      shapes.fine++;
      scenes = row.steps.map(s => s.text);
      pageMap = mapping;                       // scene i covers these pages
    } else {
      shapes.coarse++;
      scenes = paras.slice();
      pageMap = paras.map((_, i) => [i]);      // one scene per page
    }

    const folder = `${lv.prefix}${lv.subNum}`;
    const base = slug(row.title);
    const { guide, mood } = splitTail(row.prompt);
    const finalGuide = overrides[story.id] || guide;

    // images[] must be page-aligned and paragraphs.length long.
    const images = new Array(paras.length).fill(null);
    const files = scenes.map((_, i) => `images/${folder}/${folder}_${base}_${i + 1}.webp`);
    pageMap.forEach((pages, i) => pages.forEach(pg => { images[pg] = files[i]; }));

    entries.push({
      storyId: story.id,
      level: row.level,
      levelId: lv.levelId,
      subIndex: subIndex(lv.levelId, lv.subNum),
      folder,
      title: row.title,
      shape: mapping ? 'fine' : 'coarse',
      imageCount: scenes.length,
      paragraphCount: paras.length,
      alreadyIllustrated: Array.isArray(story.images),
      prompt: buildPrompt({ n: scenes.length, scenes, guide: finalGuide, mood }),
      scenes: scenes.map((text, i) => ({
        n: i + 1,
        text,
        pages: pageMap[i],
        file: files[i],
      })),
      images, // ready to paste straight into ribbit-stories.js
    });
  }

  const manifest = {
    generated: new Date().toISOString(),
    storyCount: entries.length,
    imageCount: entries.reduce((n, e) => n + e.imageCount, 0),
    stories: entries,
  };
  fs.writeFileSync(OUT, JSON.stringify(manifest, null, 1));

  console.log(`Wrote ${path.relative(REPO, OUT)}`);
  console.log(`  matched stories:  ${entries.length} / ${prompts.length}`);
  console.log(`  shapes:           ${shapes.fine} fine, ${shapes.coarse} coarse`);
  console.log(`  images to make:   ${manifest.imageCount}`);
  console.log(`  already done:     ${entries.filter(e => e.alreadyIllustrated).length} stories`);

  if (problems.length) {
    console.log(`\n  ${problems.length} unmatched (written to unmatched.json):`);
    for (const p of problems.slice(0, 20)) console.log(`   - ${p.level} · ${p.title}: ${p.why}`);
    if (problems.length > 20) console.log(`   ... and ${problems.length - 20} more`);
    fs.writeFileSync(path.join(DIR, 'unmatched.json'), JSON.stringify(problems, null, 1));
  } else {
    console.log('\n  All stories matched cleanly.');
    fs.writeFileSync(path.join(DIR, 'unmatched.json'), '[]\n');
  }
}

main();
