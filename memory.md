# Ribbit Reading App 2 — Session Memory

## Current Cycle

**Cycle 1 — COMPLETE**
- ✅ Functionality (2026-07-06, Session 1)
- ✅ UI (2026-07-07, Session 3)
- ✅ UX (2026-07-08, Session 5)
- ✅ Content (2026-07-09, Session 6)
- ✅ Gamification (2026-07-14, Session 8)

**Cycle 2 — COMPLETE**
- ✅ Functionality (2026-07-14, Session 9)
- ✅ UI (2026-07-21, automated)
- ✅ UX (2026-07-22, automated)
- ✅ Content (2026-07-23, automated)
- ✅ Gamification (2026-07-23, automated)

**Cycle 3 — IN PROGRESS**
- ✅ Functionality (2026-07-24, automated)
- ✅ UI (2026-07-24, manual session run 2/3)
- Remaining: UX, Content, Gamification

---

## Session Log

### 2026-07-24 — UI Pillar (~20 min, run 2 of 3, manual session)

**Pillar: UI** — Cycle 3.

**Commit f564d4f — DEPLOYED LIVE.**

- **style: star ratings on completed library story cards** — `storyStarCount(score)` helper
  (score≥0.8→3★, ≥0.5→2★, else 1★). `renderLibraryTierStories()` now renders a `.story-stars`
  row of gold `xp-xp-star` icons below the title for completed stories. Unread stories show
  nothing; the green check badge is unchanged. `.story-stars{display:flex;gap:1px;padding:3px 0 0}`
  CSS added. Verified: 3/2/1 star counts correct for scores 1.0/0.6/0.3; no console errors; LIVE.

**Cycle 3 next pillar: UX.**

---

### 2026-07-24 — Functionality Pillar (~25 min, run 1 of 3, manual session)

**Pillar: Functionality** — Cycle 3.

**Commit a5dc7a2 — DEPLOYED LIVE.**

- **feature: above-level word highlighting in reader** — `makeWordTappable()` now calls
  `getChallengeLevel(clean, currentLevelId())` for every non-vocab word. Words above the
  story's CEFR level get `.challenge-word` (1.5px dashed `#F9AD3B` orange underline). Uses
  `currentLevelId()` which resolves to the level of the story being read (via `lastStoryId`),
  so Level 6 stories correctly show no challenge words (`LEVEL_CHALLENGE_SETS[6]=[]`). Vocab
  tappable words take priority. Guard on `typeof getChallengeLevel==='function'` for safety.
  CSS `.challenge-word` added inline with `.tappable-word`. This was the P-backlog item
  "Wire ribbit-wordlists.js into the v3 reader" — now done.

  Verified: "The Yellow Ball" Level 1 story shows dashed orange underline on "round." (A2 word).
  L6 story with lastStoryId=L6 correctly returns 0 challenge spans. Clean console.

**Cycle 3 next pillar: UI.**

---

### 2026-07-23 — Gamification Pillar (~30 min, automated)

**Pillar: Gamification** — Cycle 2 complete.

**Commit d95c8d8 — local only, deploy blocked by auto-mode classifier. Kyle: run `git push origin master` to ship.**

- **feature: streak milestone toast at 7/14/30 days** — `STREAK_MILESTONES=[7,14,30]` constant +
  `checkStreakMilestone(n)` function. Called from `updateStreak()` after incrementing; fires a
  celebratory `showToast` at 1800ms delay when the streak hits exactly 7, 14, or 30. No extra
  state needed — `updateStreak()` runs at most once per day, so exact-value matching fires only
  when the learner actually crosses the milestone. Re-fires if streak resets and rebuilds. Both
  `UI_STRINGS.en` ("🔥 N-day streak! Amazing work! 🐸") and `.ja` ("🔥 N日連続達成！すごい！🐸") wired.

  Verified: both language toasts displayed correctly in browser (screenshot confirmed),
  zero console errors. STREAK_MILESTONES.includes() logic confirmed correct (7/14/30 hit,
  1/5/8/15/29/31 miss). Push blocked by auto-mode classifier — pending manual push.

**Cycle 2 complete. Next session starts Cycle 3 (Functionality pillar).**

---

### 2026-07-23 — Content Pillar (~35 min, automated)

**Pillar: Content** — Cycle 2.

**Commit 4171f0d — deployed live (v=20260723).**

- **content: 127 missing Japanese glosses for World Journey vocabulary** — `ribbit-ja-translations.js`
  had 1864 entries covering 268 of 395 unique vocabulary words used in Level 6 and World Journey
  stories (~68% coverage). Added all 127 missing entries: cultural food terms (tteokbokki,
  boulangerie, espresso, ceviche, ugali, etc.), cultural concepts (chuseok, carnevale, día de los
  muertos, ondol, hanji, hanok, sassi, etc.), travel/geography words (citadel, ramparts, causeway,
  savannah, ravine, etc.), and abstract C1 words (anguished, buoyant, elaborate, sentiment, etc.).
  Total keys now 1991 (no duplicates). Word popup in World Journey stories now shows Japanese gloss
  for every tappable vocabulary word.

  Verified: `JA_TRANSLATIONS` parses cleanly in Node (1991 keys, no JS errors), no duplicate keys.
  Browser-verified: opened France journey story "Every Morning, a Baguette", tapped "boulangerie",
  popup showed "ブーランジェリー — フランスのパン屋。" below the English definition — clean, correct,
  no console errors. Confirmed live (v=20260723 served within ~60s of push).

**Cycle 2 next pillar: Gamification.**

---

### 2026-07-22 — UX Pillar (~40 min, automated)

**Pillar: UX** — Cycle 2.

**Commit 729aa3a — deployed live (v=20260722).**

- **fix (UX pillar): exit reader/quiz returns to context, not home** — `exitReading()` and
  `exitQuiz()` previously called `navigate('home')` unconditionally, so a learner who
  tapped the × button mid-story lost their library drill-down and had to re-navigate from
  the root. Fixed with a single ternary in each function: if `state.worldSelectedId` is
  set → back to world destination detail; else if `state.libraryLevel` is set → back to
  the library sublevel the learner came from; else → home (for home continue-card flow).
  The existing `navigate()` invariants already preserved both context values through the
  reader/quiz pipe, so no extra state tracking was needed. Verified via JS tests for all
  three paths (library, world, home) and the full golden path with clean console.

- **chore: fix .claude/launch.json cwd** — the preview server was serving from the retired
  `Ribbit Reading App 2/` folder (the wrong directory), requiring a manual server start for
  every verify step. Fixed by adding `--directory` to the python http.server args in both
  the live repo's `.claude/launch.json` and the App 2 session's `.claude/launch.json`, both
  now pointing to the live repo. Also renamed config from "ribbit-v2" to "ribbit-live" to
  reflect the consolidated repo. Cache-bust bumped to `?v=20260722`.

**Verified locally** (golden path clean, all three exit paths tested, mobile 375px clean,
no console errors) **and confirmed live** (curl confirmed `worldSelectedId ? 'world'`
pattern present in the served file within ~60s of push).

**Cycle 2 next pillar: Content.**

**Note for Kyle:** The `launch.json` in `Ribbit Reading App 2/.claude/` was also updated
(same `--directory` fix) since automated sessions run from that folder's CWD.

---

### 2026-07-21 — UI Pillar + Lottie bug fix (~55 min, automated)

**Pillar: UI** — Cycle 2.

**Commits b66f955, b7081a5 — deployed live (v=20260721).**

- **fix: Lottie XP star overflow** — `#header-xp-star` had no size constraint, so the
  `xp-lily-pad-earn.json` animation rendered as a large green blob in the header pill.
  Added `.lottie-slot{width:20px;height:20px;overflow:hidden;...}` CSS and applied the
  class to `#header-xp-star` (streak flame already had it, now both slots are constrained).
  Bug is now blocked at render time regardless of Lottie animation size.

- **style (UI pillar): journey track sub-level labels** — the 5-node track on the home
  screen showed anonymous circles; children couldn't tell where they were in the 10-step
  level. Each node now shows its sub-level number (1–5 windowed) below the circle.
  Title row shows live progress e.g. "0/10 done" / "0/10達成" in both UI languages.
  Inline node styles replaced with `.jn-done` / `.jn-current` / `.jn-locked` CSS classes.
  Track height is now auto (was fixed 66px); dashed line anchored at `top:32px` to stay
  centred on the 40px circles. New CSS: `.journey-node-wrap`, `.journey-node-lbl`,
  `.journey-progress-count`. Bilingual `pondProgress` key added to both `UI_STRINGS`.

**Verified locally** (golden path: landing → home → library → reader → quiz → celebration,
no console errors) **and confirmed live** on GitHub Pages (`?v=20260721` served, DOM checks
passed for node labels, progress count, and lottie-slot class).

**Cycle 2 next pillar: UX.**

**Note for Kyle:** the dev server in `.claude/launch.json` was serving `Ribbit Reading App 2/`
(the retired folder), not the live repo. Needed to start a manual server from the correct
directory to verify changes. Kyle may want to update `.claude/launch.json` in the live repo
to point to its own directory explicitly (or use an absolute path).

---

### 2026-07-17 — P0 licensing fix: CEFR-J swap (~55 min, automated)

**P0 complete: `ribbit-wordlists.js` re-sourced from CEFR-J + Octanove (commit `1c57ff6`, deployed live).**

- Fetched CEFR-J Vocabulary Profile v1.5 (A1–B2, ~7,800 entries, CC BY 4.0) from `openlanguageprofiles/olp-en-cefrj` on GitHub.
- Fetched Octanove Vocabulary Profile v1.0 (C1–C2, ~2,100 entries, CC BY-SA 4.0) from the same repo.
- Parsed, lowercased, deduped (each word assigned to its lowest CEFR level only). Final counts: A2=1221, B1=2099, B2=2427, C1=921 words — no overlaps between sets.
- New header credits both sources with licence identifiers; Octanove share-alike noted.
- `LEVEL_CHALLENGE_SETS`, `getChallengeLevel()`, and `CEFR_LABELS` logic unchanged — the word sets are a drop-in replacement.
- Cache-bust bumped to `?v=20260717` on all four `<script>` tags.
- Browser-verified locally (golden path: landing → home → reader clean, zero console errors) and confirmed live (`?v=20260717` served 200 on GitHub Pages).

**Note:** `getChallengeLevel` is still not called in the app — that TODO item (wire wordlists into the reader for above-level highlighting) is separate and unchanged in the backlog.

**Cycle 2 next pillar: UI** (Functionality done; P0 consumed this session — no pillar counted).

---

### 2026-07-15 — Repo consolidation + routine handover (manual session with Kyle)

**The two-folder split is gone.** This folder (`Ribbit Reading App/`, remote `Oosh-online`, branch
`master`) is now the **single source of truth AND the deploy target**. The old working folder
`Ribbit Reading App 2/` is retired/archived — do not touch it. **Deploy is now just commit +
`git push origin master`** (GitHub Pages publishes `master`); there is no copy-to-deploy-folder step
anymore. Both folders were tar-backed to `~/Documents/Claude/_Archive/ribbit-consolidation-backup-<ts>/`
before anything moved; `ribbit-stories.js` / `ribbit-wordlists.js` / `ribbit-ja-translations.js` verified
byte-identical across both (nothing lost).

**What moved into this repo:** the 43 redesigned icon SVGs + `brand/mascot.svg`, the icon docs, `CLAUDE.md`,
`.claude/launch.json`, a junk `.gitignore` (`.DS_Store`/`.numbers`/`.xlsx` + internal notes kept local),
and the current `TODO.md`/`memory.md`. Commits `9d9d4e6`, `f38e9de` (+ the icon source commit).

**The automated routine (`ribbit-app-update`) was rewritten today:** now targets THIS repo, runs **2 hours**,
and **auto-deploys browser-verified changes** (Kyle authorised auto-deploy). Verification-before-deploy is
the hard gate. It was **temporarily disabled** during setup and gets re-enabled once Claude has validated
the deploy pipeline by shipping the icons.

**Unshipped/parked (in the App 2 archive, NOT in this tree — need Kyle's decision to port):** audio-speed
controls (`d52df2e`), gamification visuals — XP rank card, streak pills, goal-ring (`9e3fb55`). Because
this repo is the live baseline, they're cleanly parked by default.

**SHIPPED — redesigned icon set is LIVE (commit `c5f152e`, deployed 2026-07-15).** All 41 registry icons
regenerated from `assets/icons/**` (keys unchanged, call sites intact); browser-verified on localhost AND
the live URL (landing, home nav, journey locks, reader controls, 20 badges — clean console). This also
validated the new commit→verify→push→live deploy pipeline end-to-end (Pages updated in ~30s).

**Known pre-existing bug found (NOT from the icon change):** `#header-xp-star` is a Lottie slot that
renders oversized (a big green blob) when the XP-earn animation fires — logged in TODO under Functionality.

**Routine:** `ribbit-app-update` was disabled during setup, now **re-enabled** (2h, auto-deploy-verified).
Next run continues the backlog: P0 = CEFR-J licensing swap; then Cycle 2 pillar UI.

**Cycle 2 unchanged:** Functionality done; next pillar is UI (after the P0).

---

### 2026-07-14 — Functionality Pillar (Session 9, ~35 min, automated)

**Pillar: Functionality** — first pillar of Cycle 2.

**Commit d52df2e** — 2 functionality improvements:

- **Audio speed controls in the reader:** A 🐢/🐸/⚡ speed button added inside the audio pill, right of the story title. Tapping cycles through 0.6× (Slow), 0.9× (Normal), 1.2× (Fast) TTS rates. `state.audioRate` persists to `rbt_audioRate` in localStorage so the learner's preference survives page reload. If audio is playing when the speed changes, the current page's utterance is restarted at the new rate without toggling play state. `AUDIO_RATES` constant + `cycleAudioRate()` function. Both `toggleAudio()` now reads `state.audioRate` (was hardcoded 0.9). Bilingual labels in `UI_STRINGS.en` and `.ja`.

- **XP rank-up toast:** `checkRankUp(prevRank)` fires a toast when `awardXP()` crosses a tier boundary in `XP_RANKS`. E.g. crossing from Egg (0–99 XP) to Tadpole (100 XP) shows "🐾 おたまじゃくしになったよ！" (ja) or "🐾 You're now a Tadpole!" (en). Toast fires after 1500ms to avoid clashing with the XP milestone toast. Both languages wired: `xpRankUpToast` key in `UI_STRINGS.en` and `.ja`.

**Verified in browser:** speed button cycles correctly on click; rate persists in state; rank-up toast message confirmed correct via JS; mobile layout clean (pill wraps at 375px, speed button readable); no console errors.

---

### 2026-07-14 — Gamification Pillar (Session 8, ~45 min, automated)

**Pillar: Gamification** — final pillar in Cycle 1, which is now complete.

**Commit 9e3fb55** — 3 gamification improvements:

- **XP Rank system:** `XP_RANKS` array defines 7 frog-themed tiers (Egg → Tadpole → Froglet → Tree Frog → Green Frog → Bull Frog → Golden Frog) keyed to real `state.xp`. `currentRank(xp)` / `nextRank(xp)` / `rankKey(r)` helpers. A new rank card sits between the stats grid and the weekly activity chart in `renderProgressSections()`, showing the rank emoji, name, progress bar toward the next tier, and XP remaining. Bilingual — rank names in both `UI_STRINGS.en` and `UI_STRINGS.ja`.

- **Streak visual treatment on header stat-pill:** Two CSS classes applied conditionally in `renderHeader()`:
  - `streak-at-risk` (amber pulsing glow via `streak-risk-pulse` keyframe) — when `state.streak > 0` and `state.todayCount === 0`. Warns the learner their streak is at risk today.
  - `streak-milestone` (warm orange border glow) — when `state.streak >= 7` and they've read today. Rewards a maintained streak milestone.
  Both classes use real state, respect `prefers-reduced-motion`.

- **Goal ring done state:** When `isGoalDone`, the conic gradient fills solid green (`#72C93A`), the inner counter switches from "3/3" to "✓", and a `goal-ring-done` drop-shadow glow is applied. Visually satisfying completion feedback.

**Orientation notes:**
- Champion badges TODO was stale — they were already implemented via `LEVELS.map()` in the BADGES array (all 6 icons, `levelDoneCount` check). Marking done below.
- All three features verified in-browser: rank card on Profile, streak pills (both states), goal ring done state — no console errors.

**Not done (open for Cycle 2):**
- Streak milestone toast/animation beyond the pill styling (e.g., a special banner at streak=7/14/30)
- XP rank-up toast when a tier is crossed (currently XP milestone toasts at 100/500/1000/5000 exist but don't reference the tier name)

---

### 2026-07-13 — Cache-busting for script assets

Kyle noticed his phone (used for earlier v1/v3 testing) kept serving a stale build off
`https://ooshonline.github.io/Oosh-online/` while his PC showed the current version — plain
browser caching, not a real bug (no service worker in the app). GitHub Pages doesn't allow
custom `Cache-Control` headers, so there was no way to force a refetch once a browser had
cached `ribbit-stories.js` etc.

**Fix:** the three external `<script>` tags in `ribbit-reading-app-v3.html` now carry a
`?v=YYYYMMDD` query string (`ribbit-stories.js?v=20260713` etc.) — a new query string is a new
URL as far as the browser cache is concerned, so bumping it forces a refetch. The
`ribbit-deploy` skill (Step 4) now bumps this to the deploy date automatically on every deploy,
even if `ribbit-reading-app-v3.html`'s own content didn't change, so a stale JS file can never
silently keep being served after a real deploy.

**Not yet deployed** — version bumped to `20260713` in the dev repo only; needs a normal
`ribbit-deploy` run to reach the publishing repo and go live.

### 2026-07-10 — UI/UX review + fixes (manual session with Kyle, NOT part of the pillar cycle)

**No pillar consumed — Gamification is still next in Cycle 1.**

Expert UI/UX review of v3, then 17 fixes, all verified in the browser preview at 1024×768.
Working tree only — **nothing committed, nothing deployed.**

- **Quiz feedback was broken.** `showComboOverlay()` centred a card that covered 3 of the 4
  answer options (measured via bounding boxes) for ~870ms of a 900ms auto-advance, so a child who
  answered wrong never saw the correct answer or the question's `feedback` line. The overlay is
  now top-anchored and the auto-advance is replaced by a learner-tapped Next button
  (`advanceQuiz()`).
- **Reader height containment bug (pre-existing).** `.reader-text-area`'s `overflow-y:auto` never
  engaged because flex items default to `min-height:auto`. Long pages scrolled the whole document
  and pushed the Previous/Next footer off-screen. Fixed with `height:100vh` + `min-height:0` down
  the flex chain, plus `justify-content: safe center` — plain `center` had put the first line of
  38 pages above `scrollTop:0`, where it could never be scrolled into view.
- Reader type now scales by level **and** page length (`readerTypeScale()`): 46px for a Pre-A1
  sentence, 22px for an 817-char C1 paragraph. Swept all 1,529 pages — 0 document overflow,
  0 footers offscreen, 0 clipped first lines.
- Pronunciation audio (`speakText`/`speakWord`) on the word popup, both flashcard faces, and the
  quiz question + every option. The quiz now keeps the story illustration on screen ("What is
  this?" was unanswerable without it).
- Word popup leads with the Japanese gloss at Levels 1–2.
- Real mid-story resume (`state.readingPos`, `rbt_pos` key) — the continue card's 40% was hardcoded.
- Progress screen merged into Profile (`renderProgressSections()`); Flashcards promoted to the
  bottom nav. `navigate('progress')` aliases to `'profile'`.
- Honesty fixes: login bonus no longer fires over the splash; splash claimed "13 languages ·
  10 countries" (actually 2 and 13); "Log In" button removed (there are no accounts); Rewards nav
  dot now tracks unseen earned badges instead of being permanently on.
- Also: `prefers-reduced-motion`, `<html lang>` follows UI language, 44px sub-level touch targets.

**Also built this session: the "Find My Pond" placement test.**
- Opened from a Home quick-link, never forced. After it's taken the tile becomes "Re-Test".
- **Items are generated at runtime from the levelled stories** (`placementPool()` /
  `buildPlacementItem()`): L1–L2 word→Japanese-meaning, L3–L6 cloze from 1,631 real story
  sentences. Verified across 12,000 generated items — 0 duplicate options, 0 answer leaks,
  0 sentence fragments.
- Adaptive staircase, 2-item blocks (2/2 up, 0/2 down, 1/2 stop), max 8 items. Starts one level
  *below* the age band so the child meets an easy item first; result capped one level above the
  band. Simulated every age × ability combination: always terminates within 8 items, never
  over-places by more than one level.
- `state.placement` (`rbt_place`) is honoured by `currentLevelId()` **only until the learner
  reads a story** — real behaviour outranks a test result. Manual override chips on the result
  screen for teachers. No score and no "wrong" answer is ever shown to the child.
- Prior research: neither Oxford's nor Cambridge's placement tests can be embedded (licensed
  products on their own platforms; Cambridge's public APIs are exam admin + dictionary only).

**DEPLOYED 2026-07-10** — commit `28de541` on the publishing repo, pushed to `origin/master`.
Live at `https://ooshonline.github.io/Oosh-online/` and verified: the bytes GitHub Pages serves
for `ribbit-reading-app-v3.html` and `ribbit-stories.js` are identical (sha256) to the committed
files. This also finally shipped the South Korea destination, stranded since `1ffa9b3`.

**Deploy mechanics (was badly documented; `ribbit-deploy` skill now rewritten):**
- The publishing repo is the *old* folder (`Ribbit Reading App`, remote `origin`, branch
  `master`); this folder has no remote. Deploy = copy `ribbit-reading-app-v3.html` +
  `ribbit-stories.js` across, commit there, push. The skill had been staging
  `ribbit-reading-app.html`, the retired v1 file, which nothing links to.
- **Never copy `images/` as part of a deploy.** The dev copies are downscaled 1024→700px and
  would look soft on a retina tablet. Live keeps the 1024px originals.
- Pushing works from the Claude session (credentials cached); dry-run first.

**For Kyle / next session:**
- ⚠️ **Licensing:** `ribbit-wordlists.js` says its sets are based on Oxford 3000/5000 + Cambridge
  lists, which are copyrighted. **CEFR-J** (Tono, Tokyo Univ. of Foreign Studies) is free for
  commercial use with citation and built for Japanese learners — the clean swap. See TODO.md.
- Open follow-ups in TODO.md: unescaped `innerHTML` interpolation of authored content; 300 of
  1,529 pages still need internal scroll at Levels 5–6.

### 2026-07-09 — Content Pillar (Session 6, ~40 min, automated)

**Pillar: Content**

**Commit 1ffa9b3** — 2 content changes:

- **South Korea added as 13th World Journey destination**: wired up in `DESTINATIONS`
  (unlocks after Peru, emoji 🇰🇷, cefr A2, storyCount 4). Four stories written and added
  to `JOURNEY_STORIES['south-korea']` in `ribbit-stories.js`:
  1. *The Night Pojangmacha* — Junho shows his English cousin tteokbokki at a Hongdae
     street stall; sensory food story, ~292 words.
  2. *Chuseok Morning* — Soyeon helps her grandmother shape songpyeon (rice cakes) the
     day before the harvest festival; family/tradition, ~289 words.
  3. *The Hanok and the City* — Priya gets lost in Bukchon Hanok Village and finds the
     contrast between old and new Seoul; place/culture, ~287 words.
  4. *Temple Morning* — Dawit does a Buddhist temple stay at Jogyesa, wakes at 4am,
     learns about ondol, incense, and hanji lanterns; reflection/culture, ~295 words.
  Each story has 6 vocabulary items with cultural definitions and 4 quiz questions with
  verbatim feedback.

- **storyGradient() compound genre fix**: hundreds of stories use compound genres like
  "Sport / Culture" or "Festivals / Culture" that didn't match the 19-key
  `GENRE_CARD_GRADIENTS` object, so they fell back to the level gradient. Updated
  `storyGradient()` to prefix-match compound genres (e.g. "Sport / Culture" now resolves
  to the "Sport" gradient). Story cards across the entire library now get correct
  genre-based colours.

**Orientation notes:**
- Checked Level 2 story counts: sub-levels 3–9 appear to have ~10 pushes each (vs 5 for
  L1, L3, L4–L6). This is an existing data-generation quirk — stories are valid content
  at the right CEFR level, just more than 5 per sub-level. Decided not to remove any since
  learner progress is keyed by story ID (removing would orphan progress data). Kyle should
  decide if trimming is wanted.
- All 12 existing JOURNEY_STORIES destinations verified complete (4 stories each). The
  "Italy/Peru missing" note in TODO was already stale before this session.
- Level 3 placeholder comments (lines ~5112–5136) look alarming but are harmless — they're
  overwritten by real `.push()` calls immediately below.

**Not done (still open):**
- Gamification pillar is next in the cycle.
- Level 1 sub-levels 4–10 and all of Levels 2–6 still use emoji fallback (no real images).
  Images need to be generated externally — cannot be created in code sessions.

---

### 2026-07-08 — UX Pillar (Session 5, ~40 min, automated)

**Pillar: UX**

**Commit 6436c15** — 4 UX fixes:

- **Back navigation from celebration → library** (TODO item, primary fix): `navigate()` was
  clearing `libraryLevel`/`librarySublevel` whenever navigating to any non-library screen,
  including reader. So "Back to Library" on the celebration screen always dropped the learner
  at the root level grid. Fixed by adding reader/quiz/celebration to the preserve list
  (mirrors the existing `worldSelectedId` pattern). Verified in-browser: library → Level 1 →
  Sub 3 → start reading → celebrate → "Back to Library" correctly returns to Sub 3 story grid.

- **Chromebook deck-name input focus** (noted in memory as worth a follow-up): bank tile
  buttons steal focus before onclick fires on Chromium, defeating the existing `activeElement`
  caret guard. Fixed by adding `onmousedown="event.preventDefault()"` to `.bank-tile` buttons.
  Now works correctly on both iOS Safari (primary target) and Chromium/Chromebooks.

- **Word popup doesn't dismiss on page navigation**: tapping Next/Previous while a vocabulary
  popup was open kept the popup visible on the new page. Fixed by adding `state.wordPopup=null`
  to both `prevPage()` and `nextPage()`. Verified in-browser on both directions.

- **World destination empty state**: added a friendly "Stories coming soon" message when a
  destination has no stories yet. Defensive — all current destinations (including Italy and
  Peru, which the TODO listed as missing) actually have full story sets in JOURNEY_STORIES.
  The TODO item was stale. Empty state applies to any future destinations added without stories.
  New `destNoStories` key added to both `UI_STRINGS.en` and `UI_STRINGS.ja`.

**Discovered:** Italy and Peru TODO item ("no stories in JOURNEY_STORIES") is stale — both
destinations have 4 stories each, fully wired up. Removed from TODO.

**Not done (still open for future UX session):**
- Exit reader/quiz sends to home rather than back to library (deliberate design choice, not listed as a bug — could be improved but low priority)
- "View Path" on home sends to Progress screen; arguably World would be more intuitive (minor, debatable)

### 2026-07-08 — Verification pass on 2026-07-07 fixes (no code changes)

Kyle asked to verify yesterday's actioned items actually work, not just that the code
looks right. Ran the app live in-browser (not just static review) and drove the golden
path plus every fix from Session 2 (bug fixes) and Session 3 (UI pass).

**All verified working as intended:**
- Golden path end-to-end: landing → lang toggle → home → library → sub-level → story
  modal → reader → quiz → celebration. No console errors at any step.
- Story cards: real `<button>`s, 👁/🔊 icons gone, in-progress glow+badge, tap-word hint
  in modal ("👆 Tap any word to see its definition").
- Reader: tapping the illustration no longer advances pages; Previous button carries a
  real `disabled` attribute (confirmed both DOM attribute and visual state); story title
  shows in the audio pill.
- XP delta rule + quest bonus, checked precisely: first completion of "A Cat" (2/2
  correct) = 30+2×10=50 base XP + 20 perfect-quest bonus + 10 daily-login bonus already
  present = 80 total. Replay at the same 100% accuracy correctly earned +0 XP with no
  double-counting of the perfect-quest bonus, and showed the "Great practice! Beat your
  score to earn more XP" message instead of an XP chip. `audioEverPlayed` resets on
  Read Again as designed.
- Home World Journey tile and the World screen count are in lockstep — tested at 0/12
  and again after simulating one destination complete (both read 1/12 simultaneously).
- Journey preview windowing: simulated finishing sub-levels 1–3 of Level 1 (curIdx=3);
  home preview correctly showed nodes 1–5 (two ✓, current frog, two locks) instead of
  always 0–4.
- Deck-name input: typed `Kyle's "Fun" Words <script>` — rendered as literal text, no
  broken attribute, no injected script, no console errors.
- Touch targets: spot-checked `.flash-back-btn` at a true 44×44px box.

**One nuance worth knowing — not a bug, but browser-dependent:** the deck-name
focus/caret-preservation fix (`toggleCreateWord()`) checks
`document.activeElement===input` *inside* the tile's `onclick`. On Safari/iOS Safari
(this app's real target — it's a tablet ESL app), clicking a `<button>` does **not**
steal focus from a text input, so the guard passes and focus/caret are correctly
restored. On Chromium-based browsers (Chrome, the Preview tool here, and notably
Chromebooks — common in ESL classrooms), clicking a button natively shifts focus to
the button *before* the onclick fires, so the guard is always false there and the fix
silently no-ops (input just loses focus, same as pre-fix behavior — it doesn't error,
it just doesn't help). Confirmed by calling `toggleCreateWord()` directly while focus
was still on the input: caret/focus restore correctly when the guard's precondition
holds. If Chromebook users matter for this app, this is worth a follow-up (e.g. a
`mousedown` handler on `.bank-tile` that re-focuses the input, or checking
`document.activeElement` before the browser's default mousedown focus shift happens).

**Nothing broken, no regressions found. No code changes made this session.**

---

### 2026-07-07 — UI Pillar (Session 3, ~30 min, automated)

**Pillar: UI**

**Commit 7fe9e6d** — 4 targeted UI improvements:
- Celebration frog: bumped from 64px → 96px; now plays `bounce-in` then continuous `float` animation (uses the existing `float` keyframe at 2.5s/0.8s delay). Much more impactful on the win screen.
- Story card in-progress indicator: replaced the old subtle inline `box-shadow` with a proper CSS class (`story-inprogress`) that drives `glow-pulse` animation + added a yellow "IN PROGRESS" pill badge in the card cover (matches the dest-inprogress-badge pattern from the World screen). Badge uses `t('inProgress')` so it localises correctly in both en and ja.
- Removed non-functional `.story-icons` (👁 🔊 buttons inside story cards) — they were purely decorative dead-weight. CSS classes also removed.
- Modal bottom hint: replaced the "Reading notes" placeholder string with `tapWordHint` — "👆 Tap any word to see its definition" / "👆単語をタップすると意味が見られるよ". Actionable and honest.

**Not done (still open for future UI session):**
- Pond Map home screen (full feature, needs its own session)
- Story card progress bar (CSS exists but no partial-read state is tracked yet — needs Functionality work first)
- Celebration screen badge/achievement animation (beyond the frog — e.g. badge pop when a new badge is earned)

---

### 2026-07-07 — Audit-driven bug fix pass (Session 2)

Kyle asked to action `ribbit-app-audit.md` (a fresh static code review). Before touching
anything, re-verified every flagged item against the actual HEAD commit, because the
audit's own header claimed the file was 1,748 lines but HEAD was already 2,110 — a
mismatch that turned out to matter.

**4 flagged bugs were stale (already fixed/built, no code change made):** continue-card
navigation, XP-grinding delta rule, quests being a "dead feature" (checkStoriesQuest/
markQuestDone were already wired into finishStory/startStudy), landing language pill.
These were likely already fixed in commits 613461f/d5a5ff3 before the audit was written.

**11 real bugs fixed, in 4 commits (a776936, e30d094, e04643e, 693f81a):**
- Star ratings: `audioEverPlayed` now resets per story; tiers are accuracy-primary
  (1/2/3 at 0/50/80%) with audio as a bonus, not a permanent unlock.
- Touch targets bumped to a 44px minimum (not the audit's literal 60px — reader/quiz
  headers are height-constrained at the tablet breakpoint and wouldn't fit a 60px
  button without a wider redesign; 44px is the WCAG/Apple HIG baseline instead).
- Home World Journey tile now agrees with the World screen (`destComplete`-based count
  instead of stale `state.journey` stamped flags).
- TTS now sets `utter.lang='en-GB'` + picks an English voice (was reading English
  stories in the OS default voice on Japanese-locale devices).
- Reader illustration no longer silently advances pages on tap.
- `.story-card`/`.jstory-card` are real `<button>`s now; added `button:focus-visible`.
- Deck-name input: `escAttr()` helper (was unescaped, broke on quote characters) +
  focus/caret preserved across the tile-tap re-render.
- Home journey preview windows around the actual current sub-level (was hardcoded 0-4).
- Reader Previous / Save Deck buttons carry a real `disabled` attribute.
- `--navy:#1A3260` token replaces ~11 duplicated hardcoded hex literals.
- `save()` also fires on `visibilitychange`/`pagehide` (iOS Safari doesn't reliably
  fire `beforeunload`).

**Not done — deliberately deferred:** the audit's Feature Suggestions section (persist
stars on cards, functional audio pill, radial tool menu, Lily Pad currency, streak
freeze, weekly challenges — note: weekly quests already exist via `weekQuestProgress`/
`checkWeekQuests`, so that suggestion is partly stale too, passport stamps, leaderboard).
These are product-scope additions, not bug fixes — flagged to Kyle for a separate
decision rather than built unilaterally.

**Kyle should know:** `ribbit-app-audit.md` is now updated in place — every Bugs-section
item is checked off with a note on what was actually found/fixed. Trust the audit doc's
checkmarks over its prose now; the prose line numbers are stale (pre-dated by a diverging
commit) but were verified against real code before any fix landed.

---

### 2026-07-06 — Functionality Pillar (Session 1, ~60 min)

**What was done:**

**Commit 1: d5a5ff3**
- Fixed continue card navigation bug: home dash "Start Reading" called `navigate('reader')` without setting `state.lastStoryId`. Added `startReadingDirect(id)` function; now the correct story always loads.
- Added `OOSH_Logo_Square.png` to project root (was missing; landing screen showed broken image).
- Fixed landing screen lang toggle: the pill button had no `onclick`; wired it to `toggleUiLang()`.
- Added confetti to celebration screen: `spawnConfetti()` creates 54 CSS-animated pieces, called from `render()` when `state.screen==='celebration'`.
- Added story title to reader audio pill: replaced dead flex spacer with `story.title` text.

**Commit 2: 613461f**
- XP delta rule: `finishStory` now stores the best score and only awards XP for score improvement on replays. First completion = full XP. Zero improvement = 0 XP.
- `state.lastXpEarned` tracks actual XP for the celebration screen display.
- Celebration chip shows "replayGoodJob" message (in both en + ja) when 0 XP earned on a replay.
- Quest progress bars: `storiesPct` was computed but never rendered. Fixed. Weekly quests (levels3, fc10) also now show progress bars.

**Not started / left for future sessions:**
- Pond Map home screen (old app feature, not ported to v3 — would be a full Gamification session task)
- Audio speed controls (old app had 0.75×/1×/1.5×/2× TTS — v3 reader has basic toggle only)
- CEFR word highlighting above level (old app had this via `ribbit-wordlists.js` — v3 reader doesn't call it)
- World Journey destination detail screen missing the vocabulary words + culture quiz sections (only shows story grid)
- Genre browse screens (Quests tile links work but genre/topic screens not ported)

**Kyle should know:**
- The app is solid and functional. Golden path (landing → home → library → reader → quiz → celebration) all verified working in browser.
- `state.lastXpEarned` is not persisted to localStorage (not needed — only used for the current celebration screen render).
- The `OOSH_Logo_Square.png` was copied from `~/Documents/Claude/_Assets/` — it's now tracked in git.
- The `ribbit-summary.md` in this folder refers to the old v1 app (it hasn't been updated). It's useful for architecture context but some details (Pond Map, v1 gamification) don't reflect v3.

---

## Architecture Notes (v3 specific)

- Single dispatcher `render()` + per-screen `renderX()` functions
- Full-bleed screens (no app shell): reader, quiz, celebration
- All state in `state` object, persisted via `save()` to `rbt_*` localStorage keys
- `UI_STRINGS.en` and `UI_STRINGS.ja` for all user-facing copy — always add to both
- `startReadingDirect(id)` — use this (not bare `navigate('reader')`) to start reading a specific story
- `spawnConfetti()` — call after innerHTML injection of celebration; do not call from within renderCelebration return string
- Images: `images/b1/`, `images/b2/`, `images/b3/` (levels 4–6 don't have local images yet — emoji fallback)

---

## Files

| File | Purpose |
|------|---------|
| `ribbit-reading-app-v3.html` | Entire app |
| `ribbit-stories.js` | 300 library stories + JOURNEY_STORIES |
| `ribbit-wordlists.js` | CEFR word-level Sets (not yet wired into v3 reader) |
| `ribbit-ja-translations.js` | Japanese word translations for vocabulary popup |
| `OOSH_Logo_Square.png` | Landing screen logo |
| `images/b1/` · `images/b2/` · `images/b3/` | Story illustrations (L1–3 only) |
| `memory.md` | This file |
| `TODO.md` | Outstanding work |
| `ribbit-summary.md` | Old v1 architecture reference (partially outdated) |
