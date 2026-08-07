/**
 * Ribbit Image Pipeline — Step 2c: submit scenes to the Gemini Batch API.
 *
 * Replaces the AI Studio browser loop. The playground blocks automated
 * generation ("permission denied") after a handful of requests, so anything
 * bulk has to go through the paid API. Batch is half the interactive price:
 * ~$0.0168 per 1024x1024 image, so the whole 1,236-image library is ~$21.
 *
 * Jobs are chunked one-per-folder (b4, b5, e1 …). A folder is 10–40 images,
 * which keeps each responses file small enough to download comfortably and
 * means a failure costs you one folder, not the whole library.
 *
 * Usage:
 *   node submit-batch.js --todo                 # what would be submitted, with cost. Writes nothing.
 *   node submit-batch.js --test                 # ONE image, real submit. Do this first.
 *   node submit-batch.js b4                     # submit one folder
 *   node submit-batch.js b4 b5 --submit         # several
 *   node submit-batch.js --all --submit         # everything outstanding
 *   node submit-batch.js b2 b3 --force --submit # regenerate scenes that already have an image
 *
 * Without --submit (or --test) this is a dry run: it builds the JSONL and
 * prices the job but never calls the API.
 *
 * Needs: GEMINI_API_KEY in the environment, on a key with billing enabled.
 * These image models have no free tier — an unbilled key will 403.
 *
 * Job records land in batches/api/<folder>.job.json. Collect with:
 *   node collect-batch.js
 */

const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const REPO = path.join(DIR, '..');
const MANIFEST = path.join(DIR, 'manifest.json');
const JOBS = path.join(DIR, 'batches', 'api');

const MODEL = 'gemini-3.1-flash-lite-image';
const API = 'https://generativelanguage.googleapis.com';
const USD_PER_IMAGE = 0.0168;          // batch rate: 1,120 output tokens @ $15/M
const INLINE_LIMIT = 20 * 1024 * 1024; // API caps inline requests at 20MB

const args = process.argv.slice(2);
const SUBMIT = args.includes('--submit');
const TEST = args.includes('--test');
const FORCE = args.includes('--force');
const ALL = args.includes('--all');
const TODO = args.includes('--todo');
const wanted = args.filter(a => !a.startsWith('--'));

/**
 * The style and no-text preamble. Kept verbatim from ribbit-image-daily so the
 * API output matches the 44 images already in the app.
 *
 * "ABSOLUTELY NO TEXT" earns its shouting: without it the model letters
 * whiteboards, book spines and shop signs, and any image with text in it has to
 * be thrown away.
 */
const PREAMBLE = `Create ONE single illustration. Not a grid, not a storyboard, not multiple panels — one complete picture filling the whole frame.

ABSOLUTELY NO TEXT. No words, letters, numbers, captions, labels, titles, signage, panel numbers or writing of any kind, anywhere in the frame. Any surface that would normally carry writing must be blank.

Style: classic early-reader school storybook illustration in the manner of Oxford Reading Tree, for ages 5-8. Soft watercolour with clean outlines, expressive faces, gentle colours, detailed but uncluttered background. Realistic proportions with slight cartoon warmth. No anime features.`;

/**
 * Optional hand-written visual descriptions, keyed "<storyId>_<n>".
 * The manifest only carries the story sentence ("I sit at my desk"), and the
 * model illustrates a described picture far better than a quoted sentence.
 * Anything not overridden falls back to the sentence itself.
 */
function loadOverrides() {
  const p = path.join(DIR, 'scene-descriptions.json');
  if (!fs.existsSync(p)) return {};
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch (e) { console.log(`⚠ scene-descriptions.json is not valid JSON (${e.message}) — ignoring it.`); return {}; }
}

function buildPrompt(story, scene, overrides) {
  let guide = story.prompt.slice(story.prompt.indexOf('Character consistency guide:'));
  // The manifest's guide ends with its own Mood block; drop it so we don't emit
  // two competing Mood lines, and keep the canonical one from the daily skill.
  const mood = guide.search(/\n+Mood:/);
  if (mood !== -1) guide = guide.slice(0, mood).trimEnd();
  const described = overrides[`${story.storyId}_${scene.n}`];
  const sceneLine = described
    ? described
    : `Illustrate this moment: "${scene.text}" — draw what is happening, not the words.`;
  return `${PREAMBLE}\n\n${guide}\n\nScene: ${sceneLine}\n\nMood: gentle, wholesome, cosy.`;
}

/**
 * One JSONL line per image. `key` is what collect-batch.js names the file from,
 * so it has to match ingest.js's <storyId>_<scene> routing exactly.
 */
function buildRequest(story, scene, overrides) {
  return {
    key: `${story.storyId}_${scene.n}`,
    request: {
      contents: [{ parts: [{ text: buildPrompt(story, scene, overrides) }] }],
      generation_config: {
        response_modalities: ['IMAGE'],
        image_config: { aspect_ratio: '1:1', image_size: '1K' },
      },
    },
  };
}

function load() {
  if (!fs.existsSync(MANIFEST)) {
    console.error('manifest.json not found. Run: node build-manifest.js');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
}

/**
 * Key from the environment, or from image-pipeline/.env (gitignored).
 * The file matters for scheduled runs, which don't inherit an interactive shell.
 */
function key() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;

  const envFile = path.join(DIR, '.env');
  if (fs.existsSync(envFile)) {
    const m = fs.readFileSync(envFile, 'utf8').match(/^\s*GEMINI_API_KEY\s*=\s*"?([^"\r\n]+)"?/m);
    if (m) return m[1].trim();
  }

  console.error('GEMINI_API_KEY not found.\n');
  console.error('Set it either way — the .env file is what unattended/scheduled runs use:');
  console.error(`  echo 'GEMINI_API_KEY=your-key-here' > "${envFile}"`);
  console.error('  export GEMINI_API_KEY="your-key-here"');
  console.error('\nThe key needs billing enabled — these image models have no free tier.');
  process.exit(1);
}

async function api(url, opts = {}) {
  const res = await fetch(url, {
    ...opts,
    headers: { 'x-goog-api-key': key(), ...(opts.headers || {}) },
  });
  const body = await res.text();
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}\n${body.slice(0, 600)}`);
  }
  return body ? JSON.parse(body) : {};
}

/** Resumable upload of the JSONL, per the File API. Returns "files/…". */
async function uploadJsonl(buf, displayName) {
  const start = await fetch(`${API}/upload/v1beta/files`, {
    method: 'POST',
    headers: {
      'x-goog-api-key': key(),
      'X-Goog-Upload-Protocol': 'resumable',
      'X-Goog-Upload-Command': 'start',
      'X-Goog-Upload-Header-Content-Length': String(buf.length),
      'X-Goog-Upload-Header-Content-Type': 'application/jsonl',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ file: { display_name: displayName } }),
  });
  if (!start.ok) throw new Error(`upload start failed: ${start.status} ${await start.text()}`);

  const target = start.headers.get('x-goog-upload-url');
  if (!target) throw new Error('upload start returned no X-Goog-Upload-URL header');

  const done = await fetch(target, {
    method: 'POST',
    headers: {
      'Content-Length': String(buf.length),
      'X-Goog-Upload-Offset': '0',
      'X-Goog-Upload-Command': 'upload, finalize',
    },
    body: buf,
  });
  if (!done.ok) throw new Error(`upload finalize failed: ${done.status} ${await done.text()}`);

  const out = JSON.parse(await done.text());
  const name = out.file && out.file.name;
  if (!name) throw new Error(`upload returned no file name: ${JSON.stringify(out).slice(0, 300)}`);
  return name;
}

async function submitJob(requests, label) {
  const jsonl = Buffer.from(requests.map(r => JSON.stringify(r)).join('\n') + '\n', 'utf8');

  fs.mkdirSync(JOBS, { recursive: true });
  const jsonlPath = path.join(JOBS, `${label}.jsonl`);
  fs.writeFileSync(jsonlPath, jsonl);

  if (jsonl.length > INLINE_LIMIT) {
    // Not fatal — we upload as a file anyway — but worth knowing the job is unusual.
    console.log(`   note: ${label} JSONL is ${(jsonl.length / 1024 / 1024).toFixed(1)}MB`);
  }

  const fileName = await uploadJsonl(jsonl, `ribbit-${label}`);
  const job = await api(`${API}/v1beta/models/${MODEL}:batchGenerateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      batch: { display_name: `ribbit-${label}`, input_config: { file_name: fileName } },
    }),
  });

  const record = {
    label,
    jobName: job.name,
    model: MODEL,
    inputFile: fileName,
    count: requests.length,
    keys: requests.map(r => r.key),
    estimatedUsd: +(requests.length * USD_PER_IMAGE).toFixed(2),
    submittedAt: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(JOBS, `${label}.job.json`), JSON.stringify(record, null, 2));
  return record;
}

// ─── Select the work ──────────────────────────────────────────────────────────

const manifest = load();
const overrides = loadOverrides();

/** Scenes still missing their image (or every scene, with --force). */
function pending(story) {
  return story.scenes.filter(sc => FORCE || !fs.existsSync(path.join(REPO, sc.file)));
}

const folders = new Map();
for (const story of manifest.stories) {
  // Named folders always win. --all/--todo/--test only widen the net when no
  // folder was named — otherwise `b2 b3 --todo` would silently price everything.
  if (!ALL && wanted.length && !wanted.includes(story.folder)) continue;
  const scenes = pending(story);
  if (!scenes.length) continue;
  if (!folders.has(story.folder)) folders.set(story.folder, []);
  for (const sc of scenes) folders.get(story.folder).push(buildRequest(story, sc, overrides));
}

if (!folders.size) {
  console.log(FORCE ? 'No stories matched.' : 'Nothing outstanding — every selected scene already has an image.');
  process.exit(0);
}

// ─── Report ───────────────────────────────────────────────────────────────────

let total = 0;
console.log('folder   images   est. cost');
console.log('─'.repeat(34));
for (const [folder, reqs] of folders) {
  total += reqs.length;
  console.log(`${folder.padEnd(8)} ${String(reqs.length).padStart(6)}   $${(reqs.length * USD_PER_IMAGE).toFixed(2)}`);
}
console.log('─'.repeat(34));
console.log(`${'total'.padEnd(8)} ${String(total).padStart(6)}   $${(total * USD_PER_IMAGE).toFixed(2)}   (batch rate, ${MODEL})`);

if (TODO) {
  console.log('\n--todo only. Nothing written, nothing submitted.');
  process.exit(0);
}

// ─── Submit ───────────────────────────────────────────────────────────────────

(async () => {
  if (TEST) {
    const first = [...folders.values()][0][0];
    console.log(`\nTest job — ONE image (${first.key}), about $${USD_PER_IMAGE.toFixed(4)}.`);
    console.log('This is the cheap way to confirm the model accepts batch jobs and');
    console.log('that image_config gives back 1024x1024 before spending the full $21.\n');
    const rec = await submitJob([first], 'test');
    console.log(`✓ submitted ${rec.jobName}`);
    console.log('\nNext:  node collect-batch.js');
    return;
  }

  if (!SUBMIT) {
    // Still write the JSONL so it can be eyeballed before spending anything.
    fs.mkdirSync(JOBS, { recursive: true });
    for (const [folder, reqs] of folders) {
      fs.writeFileSync(path.join(JOBS, `${folder}.jsonl`), reqs.map(r => JSON.stringify(r)).join('\n') + '\n');
    }
    console.log(`\nDry run — wrote ${folders.size} JSONL file(s) to batches/api/, submitted nothing.`);
    console.log('Check one, then re-run with --test (one image) or --submit (all of it).');
    return;
  }

  console.log('');
  for (const [folder, reqs] of folders) {
    try {
      const rec = await submitJob(reqs, folder);
      console.log(`✓ ${folder}: ${rec.count} image(s) → ${rec.jobName}`);
    } catch (err) {
      console.log(`✗ ${folder}: ${err.message}`);
    }
  }
  console.log('\nJobs run asynchronously (24h SLA, usually much faster).');
  console.log('Next:  node collect-batch.js');
})().catch(err => {
  console.error('Unexpected error:', err.message);
  process.exit(1);
});
