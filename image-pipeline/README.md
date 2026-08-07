# Ribbit Image Pipeline

Turns the prompts in `Images to Use.xlsx` into illustrations wired into the app.

Built for the free route: generate in the [AI Studio playground](https://aistudio.google.com/),
download, drop, run two commands. No API key, no billing, no rush — the pipeline
keeps track of what's done so it can be picked up and put down across weeks.

## Status

**1,236 images across 315 stories.** 33 already exist (Beginner 1–3).
Run `node emit-batch.js --list` for a live count.

## One-time setup

```bash
cd image-pipeline
npm install sharp
```

## The loop

**1 — Pick a batch.** Sub-levels are the unit; each is 10–35 images.

```bash
node emit-batch.js --todo     # what's left
node emit-batch.js b4         # emit prompts for Beginner 4
```

This writes `batches/b4/` — one `.txt` per story plus a `CHECKLIST.md` — and
creates the matching `drop/<storyId>/` folders.

**2 — Generate.** Paste each prompt into AI Studio. It returns the whole
sequence for that story in one turn, so a 5-story sub-level is 5 requests, not 20.

**3 — Drop.** Download the images and put them in `drop/<storyId>/`, **in
generation order**. Filenames don't matter; the script sorts naturally and falls
back to modified time.

**4 — Ingest and patch.**

```bash
node ingest.js --dry    # check the mapping first
node ingest.js          # rename + compress to WebP q78 → images/<folder>/
node patch-stories.js   # write images[] into ribbit-stories.js
```

`patch-stories.js` only touches stories whose images are *all* present, verifies
the result still parses before writing, and backs up `ribbit-stories.js` first.
Half-finished batches are safe to leave sitting.

## Files

| File | Purpose |
|---|---|
| `extract-prompts.py` | `Images to Use.xlsx` → `prompts.json`. Run once, or after editing the sheet. |
| `build-manifest.js` | Joins prompts to the app's stories → `manifest.json`. The source of truth. |
| `character-guides.json` | Hand-written character descriptions that override the spreadsheet's. |
| `emit-batch.js` | Emits a batch of prompts + checklist; also the progress report. |
| `ingest.js` | Drop folder → compressed WebP in `images/`. |
| `patch-stories.js` | Writes `images[]` arrays into `ribbit-stories.js`. |

## Two things worth knowing

**Images are page-aligned, not scene-aligned.** The reader does
`story.images[currentPage]`, so `images[]` must be exactly as long as
`paragraphs[]`. Where one illustration covers several pages, the filename simply
repeats. `build-manifest.js` works this out per story:

- *fine* (180 stories) — paragraphs are shorter than the spreadsheet's steps, so
  one image spans two or three pages. "Bedtime" is 4 images across 9 pages.
- *coarse* (135 stories) — paragraphs are longer than the steps, so generating
  one per step would waste most of them. The paragraph becomes the unit instead.
  "My Pet Fish" is 2 images, not the 5 the sheet planned.

**The spreadsheet's character guides are auto-generated and mostly wrong.** They
derive "Main character" from the title, giving `Main character: Bedtime` and
`Main character: Camping trip`, and the settings are often wrong too — Lunch Time
was tagged "home or a neighbourhood street" when it's a school lunch hall.
Consistency is the thing that makes or breaks a set, so write a real guide into
`character-guides.json` before generating a sub-level. Beginner 4 is done as a
worked example: five stories, one continuous day, one recurring child described
identically in all five.

## Not covered by the spreadsheet

- Advanced sub-levels 3–10 (40 stories) — no prompts written yet.
- All 52 World Journey stories.
- "The Chess Club" (Elementary 6) — the sheet's text no longer matches the app's.
