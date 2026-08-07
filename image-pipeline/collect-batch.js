/**
 * Ribbit Image Pipeline — Step 2d: collect finished Gemini batch jobs.
 *
 * Polls the jobs submitted by submit-batch.js and writes the returned images
 * into drop/_inbox/ as <storyId>_<scene>.png — exactly the naming ingest.js
 * already sweeps, so nothing downstream changes:
 *
 *   node collect-batch.js && node ingest.js && node patch-stories.js
 *
 * Usage:
 *   node collect-batch.js            # one pass over every uncollected job
 *   node collect-batch.js b4         # just one
 *   node collect-batch.js --watch    # poll every 60s until all jobs settle
 *   node collect-batch.js --status   # show states, download nothing
 *
 * Needs: GEMINI_API_KEY (same key that submitted the jobs).
 */

const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const JOBS = path.join(DIR, 'batches', 'api');
const INBOX = path.join(DIR, 'drop', '_inbox');
const API = 'https://generativelanguage.googleapis.com';
const POLL_MS = 60_000;

const args = process.argv.slice(2);
const WATCH = args.includes('--watch');
const STATUS = args.includes('--status');
const only = args.filter(a => !a.startsWith('--'));

/** Key from the environment, or from image-pipeline/.env (gitignored). */
function key() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  const envFile = path.join(DIR, '.env');
  if (fs.existsSync(envFile)) {
    const m = fs.readFileSync(envFile, 'utf8').match(/^\s*GEMINI_API_KEY\s*=\s*"?([^"\r\n]+)"?/m);
    if (m) return m[1].trim();
  }
  console.error(`GEMINI_API_KEY not found. Put it in ${envFile} or export it.`);
  process.exit(1);
}

async function api(url) {
  const res = await fetch(url, { headers: { 'x-goog-api-key': key() } });
  const body = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}\n${body.slice(0, 400)}`);
  return body ? JSON.parse(body) : {};
}

/**
 * The docs describe the finished-job payload slightly differently in different
 * places (dest.fileName vs output.responsesFile), so rather than bet on one
 * path, walk the object for the first "files/…" string that isn't the input.
 */
function findResponsesFile(job, inputFile) {
  let found = null;
  (function walk(node) {
    if (found || !node) return;
    if (typeof node === 'string') {
      if (node.startsWith('files/') && node !== inputFile) found = node;
      return;
    }
    if (typeof node === 'object') for (const v of Object.values(node)) walk(v);
  })(job);
  return found;
}

function stateOf(job) {
  return (job.metadata && job.metadata.state) || job.state || 'UNKNOWN';
}

/** Pull the first inline image out of a GenerateContentResponse. */
function imageFrom(response) {
  const parts =
    response &&
    response.candidates &&
    response.candidates[0] &&
    response.candidates[0].content &&
    response.candidates[0].content.parts;
  if (!Array.isArray(parts)) return null;
  for (const p of parts) {
    const d = p.inlineData || p.inline_data;
    if (d && d.data) return d;
  }
  return null;
}

async function collect(record, file) {
  const job = await api(`${API}/v1beta/${record.jobName}`);
  const state = stateOf(job);

  if (state !== 'JOB_STATE_SUCCEEDED') {
    const failed = state === 'JOB_STATE_FAILED' || state === 'JOB_STATE_CANCELLED' || state === 'JOB_STATE_EXPIRED';
    console.log(`${failed ? '✗' : '·'}  ${record.label.padEnd(8)} ${state}`);
    if (failed && job.error) console.log(`     ${JSON.stringify(job.error).slice(0, 300)}`);
    return { settled: failed, wrote: 0 };
  }
  if (STATUS) { console.log(`✓  ${record.label.padEnd(8)} ${state} (ready to collect)`); return { settled: true, wrote: 0 }; }

  const responsesFile = findResponsesFile(job, record.inputFile);
  if (!responsesFile) {
    console.log(`✗  ${record.label} succeeded but no responses file was found in the job payload.`);
    return { settled: true, wrote: 0 };
  }

  const res = await fetch(`${API}/download/v1beta/${responsesFile}:download?alt=media`, {
    headers: { 'x-goog-api-key': key() },
  });
  if (!res.ok) throw new Error(`download failed: ${res.status} ${await res.text()}`);
  const text = await res.text();

  fs.mkdirSync(INBOX, { recursive: true });
  let wrote = 0, errored = 0;

  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    let row;
    try { row = JSON.parse(line); } catch { continue; }

    const k = row.key || (row.metadata && row.metadata.key);
    if (!k) continue;

    if (row.error || row.status) {
      console.log(`   ✗ ${k} — ${JSON.stringify(row.error || row.status).slice(0, 200)}`);
      errored++;
      continue;
    }

    const img = imageFrom(row.response);
    if (!img) { console.log(`   ✗ ${k} — no image in response`); errored++; continue; }

    const ext = (img.mimeType || img.mime_type || 'image/png').includes('jpeg') ? 'jpg' : 'png';
    fs.writeFileSync(path.join(INBOX, `${k}.${ext}`), Buffer.from(img.data, 'base64'));
    wrote++;
  }

  console.log(`✓  ${record.label.padEnd(8)} ${wrote} image(s) → drop/_inbox/${errored ? `  (${errored} failed)` : ''}`);

  record.collectedAt = new Date().toISOString();
  record.collected = wrote;
  record.errored = errored;
  fs.writeFileSync(file, JSON.stringify(record, null, 2));

  return { settled: true, wrote };
}

async function pass() {
  if (!fs.existsSync(JOBS)) { console.log('No jobs yet — run submit-batch.js first.'); return { pending: 0, wrote: 0 }; }

  const files = fs.readdirSync(JOBS)
    .filter(n => n.endsWith('.job.json'))
    .filter(n => (only.length ? only.includes(n.replace('.job.json', '')) : true));

  if (!files.length) { console.log('No matching job records in batches/api/.'); return { pending: 0, wrote: 0 }; }

  let pending = 0, wrote = 0;
  for (const name of files) {
    const file = path.join(JOBS, name);
    const record = JSON.parse(fs.readFileSync(file, 'utf8'));

    if (record.collectedAt && !STATUS) { console.log(`·  ${record.label.padEnd(8)} already collected`); continue; }

    try {
      const r = await collect(record, file);
      wrote += r.wrote;
      if (!r.settled) pending++;
    } catch (err) {
      console.log(`✗  ${record.label} — ${err.message}`);
    }
  }
  return { pending, wrote };
}

(async () => {
  let total = 0;
  for (;;) {
    const { pending, wrote } = await pass();
    total += wrote;
    if (!WATCH || !pending || STATUS) break;
    console.log(`\n${pending} job(s) still running — checking again in ${POLL_MS / 1000}s.\n`);
    await new Promise(r => setTimeout(r, POLL_MS));
  }
  if (total) {
    console.log(`\nWrote ${total} image(s) into drop/_inbox/.`);
    console.log('Next:  node ingest.js --dry   then   node ingest.js && node patch-stories.js');
    console.log('Review before shipping: reject any image with text in it, or where the child, country or season has drifted.');
  }
})().catch(err => {
  console.error('Unexpected error:', err.message);
  process.exit(1);
});
