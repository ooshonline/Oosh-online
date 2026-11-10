#!/usr/bin/env node
// Story cover thumbnails.
//
// For every story (main + World Journey) with illustrations, takes its first page
// image and writes a 480px-wide WebP to images/thumbs/<same sub-path>. The app's
// storyCoverImg() helper loads these on cards and falls back to the full image if a
// thumb is missing, so it's safe to run any time new art is ingested.
//
// Usage (from the app folder):  node image-pipeline/make-thumbs.js [--force]
// Needs cwebp (brew install webp).

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const force = process.argv.includes('--force');

const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(
  fs.readFileSync(path.join(ROOT, 'ribbit-stories.js'), 'utf8') +
    ';this.__S=STORIES;this.__J=typeof JOURNEY_STORIES!=="undefined"?JOURNEY_STORIES:{};',
  ctx
);

const stories = [];
const walk = (o) => {
  if (Array.isArray(o)) o.forEach(walk);
  else if (o && o.paragraphs) stories.push(o);
  else if (o && typeof o === 'object') Object.values(o).forEach(walk);
};
walk(ctx.__S);
walk(ctx.__J);

let made = 0, skipped = 0, missing = 0;
for (const s of stories) {
  const src = s.images && s.images.find(Boolean);
  if (!src) continue;
  const srcPath = path.join(ROOT, src);
  if (!fs.existsSync(srcPath)) { console.warn(`missing source for ${s.id}: ${src}`); missing++; continue; }
  const out = path.join(ROOT, src.replace(/^images\//, 'images/thumbs/'));
  if (!force && fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(srcPath).mtimeMs) { skipped++; continue; }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  execFileSync('cwebp', ['-quiet', '-q', '70', '-resize', '480', '0', '-metadata', 'none', srcPath, '-o', out]);
  made++;
}
console.log(`thumbs: ${made} made, ${skipped} up to date, ${missing} missing sources`);
