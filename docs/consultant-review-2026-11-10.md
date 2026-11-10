# Ribbit Reading App: consultant review and action list

_2026-11-10 · Written for Opus 5.5 sessions to execute. Kyle has the short version in chat._

## How this review was done

Walked `ribbit-reading-app-v3.html` at 375×812 (night theme, the state left on the test machine):
landing → home → library → Level 3 → sub-level 1 → story modal → reader → World Journey. Read the
reader, cover and header code, and counted illustration coverage straight from `ribbit-stories.js`.

### Illustration coverage today

| Set | Stories | With illustrations |
|---|---|---|
| Level 1 | 75 | 75 |
| Level 2 | 80 | 80 |
| Level 3 | 56 | 50 |
| Level 4 | 52 | 40 |
| Level 5 | 50 | 0 |
| Level 6 | 50 | 0 |
| World Journey | 52 | 0 |
| **Total** | **415** | **245 (59%)** |

### The headline finding

**The app hides the pictures it already has.** Every story card (library grid, search results, home
Continue card, Today's Pick, Read Later, the start modal) shows an emoji on a gradient, even for the
245 stories with finished illustrations. Only the reader and the vocab recap use `story.images`.
Fixing that is the cheapest, biggest visual upgrade available, and it needs no new art.

---

## Ground rules for every task below

These come from `CLAUDE.md` and `TODO.md`. Read both before starting.

- Edit `ribbit-reading-app-v3.html` only. Never touch `ribbit-reading-app.html`.
- One change per commit; stage files by name (never `git add -A`); bump the `?v=YYYYMMDD`
  cache-bust on the three `<script>` tags when deploying.
- Every new UI string goes into both `UI_STRINGS.en` and `UI_STRINGS.ja`. New copy is American English.
- Relative paths only (the app is served at `ribbitpond.com/read/`). localStorage keys use the `rbt_` prefix.
- Do **not** remove the DEV unlock overrides in `destLocked()` / `subLevelAvailable()` except as part of G12.
- Verify every change in a browser at 375px **and** 820px, in light **and** night theme, before committing.
- Anything touching `/api/me`, login, cookies or subscriptions is supervised work: stop and ask Kyle.
- Existing British spellings in stories stay as they are.

---

## Phase 0: Do first (Kyle + housekeeping)

### 0.1 Rotate the exposed GitHub token — KYLE
`Documents/Claude/Research/ribbit-context.md` (Deployment section, ~line 142) contains a GitHub
personal access token in plain text inside a `git remote set-url` command. Kyle should revoke it at
github.com → Settings → Developer settings → Tokens, and switch to the macOS keychain credential
helper (`gh auth login` sets this up). Opus: once Kyle confirms, delete that line and replace the
section with "`git push origin master` (credentials come from the keychain)".

### 0.2 Refresh `Research/ribbit-context.md`
It still says "feature complete" and lists the github.io URL, and names Etna/Glacial as the fonts.
Update: live URL `https://ribbitpond.com/read/`; actual fonts are **Baloo 2** (headings) and
**Nunito Sans** (body); story count 363 main + 52 Journey; screen keys (`world`, not `journey`);
image coverage table above. Keep it short.

### 0.3 Image backlog file
Write a small Node script `image-pipeline/coverage.js` that loads `ribbit-stories.js` in a `vm`
context and writes `image-pipeline/missing-images.csv` with columns
`storyId, level, title, pages, hasImages, genre, blurb`. Run it, commit both. This becomes the
single to-do list for Kyle's image work and lets later tasks check coverage in one command.

---

## Phase 1: Use the pictures we already have (highest impact)

### 1.1 Story covers from illustrations
- Add one helper, e.g. `storyCoverHTML(story, size)`: if `story.cover` or `story.images?.[0]` exists,
  render `<img src loading="lazy" decoding="async" alt="">` with `object-fit:cover` inside the
  existing cover box; otherwise fall back to today's emoji + `GENRE_CARD_GRADIENTS` + `GENRE_TEXTURE`.
- Use it everywhere a story cover appears: sub-level story grid, library search results, home
  Continue Reading card, Today's Pick, Read Later list, story start modal header, World Journey
  story list, Daily rec.
- Keep the level badge overlaid. Respect `--cover-dim` in night theme.
- **Acceptance:** Level 1–4 cards show pictures; Level 5–6 and Journey cards look exactly as now;
  no layout shift (set `aspect-ratio` on the box); no 404s in console.

### 1.2 Cover thumbnails
Full pages are ~135 KB each (`images/` is 148 MB). Loading a grid of six would pull ~800 KB.
Extend the image pipeline to output `images/thumbs/<same-name>.webp` at 480px wide, quality ~70,
for the first image of each story only (~245 files). Point 1.1's helper at the thumb with a
fallback to the full image via `onerror`. Commit the thumbs (they sit under `images/`, so the
ribbitpond allowlist already serves them).

### 1.3 Reader illustration framing
At 375px the square illustration sits between two flat yellow bands (the level gradient). Replace
the bands with a blurred, darkened copy of the same image as the backdrop (`background: url(img)
center/cover; filter: blur(24px) brightness(.85)` on a pseudo-element), so every page looks
intentional. In night theme reduce brightness further. Check B1 (no cropping) still holds.

### 1.4 Long pages: shrink the picture as the learner scrolls
On many L3+ pages the text runs below the fold (300 pages need internal scrolling). When the text
area scrolls, collapse the illustration from full height to a ~96px banner with a CSS transition
(IntersectionObserver or a scroll listener on the text container). Tap the banner to expand again.

---

## Phase 2: Visual polish

### 2.1 Level cards (Library root)
Each card is a large gradient with a ~16px icon in the middle: it reads as empty. Short term, scale
the level icon to 64px and add a subtle pattern. Long term, use the `canva-image-gen` skill to make
six level hero illustrations (Ribbit on a lily pad / pond / stream / river / waterfall / ocean) at
`images/levels/level-N.webp`, wired with an `<img>` that falls back to the icon. Also: the Level 6
card sits lower than Level 5 in the grid (taller card) — align the grid rows (`align-items:stretch`
and fixed subtitle line count).

### 2.2 One consistent header
On Home the header holds a square logo, "Ribbit", streak, XP, a large 🐸 emoji avatar and a
language pill. On World Journey the same content wraps onto three rows at 375px. Redesign once:
logo + wordmark left; streak and XP pills; a 36px avatar using `assets/brand/ribbit-avatar.png`
(not the emoji); move the language switch into Profile/Settings (keep a small globe icon button if
Kyle wants it on screen). The screen title goes on its own row below. Must not wrap at 320px.

### 2.3 One Ribbit, not three
The mascot appears as a raster logo with a white square background (landing), a 🐸 emoji (header,
celebration), and an SVG (World Journey empty state). Pick the illustrated Ribbit everywhere:
transparent PNG/WebP on the landing screen, avatar in the header, and the Priority 1 mascot poses
already scoped in `docs/image-opportunities.md` (cheer, empty states) via `canva-image-gen`.

### 2.4 Home screen focus
Home has a Continue card, goal ring, Today's Pick, then **seven** equal Quick Link tiles, and the
journey path at the bottom. Four of the seven duplicate the bottom nav (Library, Cards, Rewards,
Profile/Progress). Proposed order: Continue Reading (with cover, from 1.1) → goal ring merged with
streak into one compact row → Today's Pick (with cover) → Your Journey path (moved up, it's the
best motivator) → at most four tiles: Find My Pond, World Journey, Quests, Flash Cards due.
Remove tiles that duplicate the bottom nav.

### 2.5 Sub-level screen
After tapping a level, ~70% of the screen is empty and stories only appear after a second tap.
Show the current sub-level's stories directly under the path (the active node selected by default),
and let tapping another node swap the list in place. Fix X13 (padlocks drawn while dev-unlock is
on): the lock icon should honour `subLevelAvailable()`.

### 2.6 Story card status
Cards show only title and level. Add: a tick + star score when done, a thin progress bar when in
progress, "3 min" read time. Allow two title lines. Use existing state (`state.completed`, scores).

### 2.7 Story start modal
Show the `blurb` under the title (it's in every story and never displayed here). Fix the double
icon on "Save for later" (SVG bookmark **and** 🏷️ emoji). Check the START button in night theme:
pale mint with white text fails contrast — use `--primary` with `#151515` text.

### 2.8 World Journey cards
All 13 destination cards share the same grey-green gradient with a faded emoji. Interim: give each
destination its own two-tone gradient (from its flag or landmark) and full-opacity art. Then wire
the destination hero art planned in `docs/image-opportunities.md` (`destArt()` helper with
fallback, same pattern as `badgeArt()`).

### 2.9 Emoji as UI icons
Quick-link tiles, modal meta ("📄 5 pages", "🔊 Audio") and buttons still use emoji, which render
differently per device and look like clip-art next to the monochrome `ICONS` set. Swap UI emoji
for `icon()` calls. Keep emoji only as story-content fallbacks.

### 2.10 Japanese typography
No Japanese font is loaded, so `ja` strings fall back to the system font next to Baloo 2. Add
`M PLUS Rounded 1c` (weights 500/700/800, Google Fonts, `display=swap`) and apply it with
`:lang(ja)` / when `state.uiLang==='ja'` (set `<html lang>` accordingly). Check page weight; subset
if needed. The audience is Japanese families, so this is noticeable.

### 2.11 Open bugs already logged that affect looks
B-muted (`var(--muted)` undefined), B-recap-dark (week recap ignores night theme), U10 (night-theme
celebrations), U11 (journey-only genre colours). Each is small; batch them through the normal routine.

---

## Phase 3: Functionality that would make it feel premium

### 3.1 Signpost tappable words
Learners can't see which words have definitions. Add a soft dotted underline to vocab words in the
reader (toggle in the "Aa" panel, default on for L1–3). Fix B-vocab-keys at the same time so the
underline is honest (lowercase lookup, accented letters, inflected keys).

### 3.2 Recorded narration (biggest perceived-quality jump after covers)
Web Speech voices vary wildly by device, and many Japanese family iPads have poor English voices.
Pilot: generate narration for Level 1 (75 short stories) with a warm, clear voice via the ElevenLabs
connector, saved as `assets/audio/<storyId>_<page>.mp3`, with word timings for highlighting.
Reader uses the mp3 when present, falls back to TTS. Check file weight and the ribbitpond allowlist
(`assets/` is already allowed). Get Kyle's sign-off on the voice and the cost before generating
beyond the pilot.

### 3.3 Parent view (commercial lever)
Parents pay; nothing in the app speaks to them. Add a "保護者の方へ / For parents" screen from
Profile: minutes read this week, stories finished, words learned, quiz accuracy, current level with
Eiken equivalent, and a suggested next step. Real data only. Reuse the share-card generator for a
weekly report image. This also supports M7 later.

### 3.4 Flashcards with the story picture and sentence
F12 already scoped: on the card back show the source sentence with 🔊, plus the illustration from
that page when it exists. Pictures make words stick, and the data is already there.

### 3.5 Install as an app (PWA)
There is no web manifest or service worker. Add `manifest.webmanifest` (name, icons, theme colour,
`display: standalone`, `start_url: ./`) and a small service worker that caches the app shell and
the current level's images. Check with Kyle first: both are new top-level files, so the webstore's
`vercel.json` routes and `next.config.mjs` allowlist must be updated (supervised) or they'll 404 on
ribbitpond.com.

### 3.6 Read-aloud practice
"Record myself" button on a reader page: `MediaRecorder` → play back next to the model audio. No
speech recognition, no upload, nothing stored off-device. Speaking is the gap Japanese parents
worry about most. Medium build; do after 3.2.

### 3.7 Pathway system (G12)
Still the prerequisite for a real launch: it replaces the DEV unlock and fixes the padlock
confusion. Already specced in `TODO.md`; leave its scheduling to Kyle.

---

## Phase 4: Image production plan (Kyle's work in progress)

Recommended order and scope, to finish sooner without losing quality:

1. **Finish Levels 3–4** (6 + 12 stories). This completes the fully illustrated tier up to B1 /
   age 13, which is where pictures matter most.
2. **World Journey: one cover per story + one hero per destination** (52 + 13 images), not full
   page sets. Journey is the most "attractive" feature in screenshots and marketing.
3. **Levels 5–6: one cover per story** (100 images), not five pages each. Teen learners at B2–C1
   read text-led pages; a strong cover gives the library its colour. That's ~100 images instead of
   ~500.
4. Use `missing-images.csv` (task 0.3) as the queue and `_review_sheet.html` for Kyle's approval
   pass. Respect the 6 unwanted rerolls listed at the top of `TODO.md`.
5. Every new image gets a thumb (task 1.2) at ingest time.

---

## Suggested order for Opus sessions

1. 0.2, 0.3 (docs + coverage script) · 0.1 when Kyle has rotated the token
2. 1.1 + 1.2 (covers and thumbs) — ship as soon as verified
3. 1.3, 2.7, 2.6
4. 2.2 + 2.3 (header and mascot together)
5. 2.4, 2.5
6. 2.1, 2.8 (needs Canva art; wire with fallbacks so they can ship before the art)
7. 2.9, 2.10, 2.11
8. 3.1, 3.4
9. 3.3 (parent view)
10. 3.2 pilot (needs Kyle's voice sign-off) · 3.5 (needs supervised webstore change) · 3.6
