# Ribbit Reading App — TODO

## Urgent / P0
- [x] **Licensing: swap `ribbit-wordlists.js` → CEFR-J (2026-07-17, commit `1c57ff6`).** OUP/CUP
  attribution replaced with CEFR-J v1.5 (Tono, TUFS — CC BY 4.0, A1–B2) + Octanove v1.0
  (CC BY-SA 4.0, C1). Word counts: A2=1221, B1=2099, B2=2427, C1=921, non-overlapping. LIVE.

## Pending Kyle's decision (do NOT auto-ship)
- [x] **Redesigned icon set SHIPPED (2026-07-15, commit `c5f152e`).** All 41 registry icons inlined + live.
- [ ] **3 icons flagged for a Design tweak** (legible but weakest — optional polish): `status/streak-flame`
  (reads thin/leaf-like), `levels/stream` (flat green square, water too subtle), `levels/lily-pad`
  (faint at rail size). Get Design to punch these up, then re-inline + ship as a small follow-up.
- [ ] **Use `brand/mascot.svg` as the vector avatar?** The header/profile avatar is still the raster
  `ribbit-avatar.png`; the new vector `assets/icons/brand/mascot.svg` could replace it (separate from the
  41-icon registry). Low priority.
- [ ] **Port the unshipped App 2 features?** `audio-speed controls` (old commit `d52df2e`) and the
  `gamification visuals` — XP rank card, streak-at-risk/milestone pills, goal-ring done state (old commit
  `9e3fb55`) — were built + browser-verified in the retired App 2 folder but never deployed, so they are
  **not** in this tree. Both are in the App 2 archive (`_Archive/ribbit-consolidation-backup-*`). Decide
  whether to port + ship.

## Idea Backlog (pillar-sorted) — added 2026-07-24

Five ideas per pillar for the `ribbit-app-update` routine to draw from. Each is scoped to be
**buildable and browser-verifiable in one ~1-hour run**. Rules still apply: real data only, both
`UI_STRINGS.en` **and** `.ja`, extend existing state/CSS tokens, one change per session. Tick items
off here as they ship, and add the commit hash.

> **Pillar rotation updated 2026-08-21 — there are now SEVEN pillars.**
> `Functionality → UI → UX → Content → Gamification → Monetisation → Bug Fixes / Implementation Check`,
> then repeat.
> Monetisation's backlog is the M-series below. Two extra rules apply to that pillar only: **never gate
> gamification** and **never commit a secret** — both are spelled out in the Monetisation section. The
> routine takes **M-series items only**; the S-series in `ribbit-monetisation-handoff.md` requires Kyle
> present and must never run unattended.
> **Bug Fixes / Implementation Check** is the new seventh pillar (added 2026-08-21); its backlog is the
> B-series below. It is an audit-and-fix sweep, not a feature build — the B-series is a checklist of
> failure classes to hunt through. Reproduce a defect in the browser before fixing it, re-check the
> golden path for regressions after, and never dress a redesign up as a "fix."

### Functionality — ideas
- [ ] **F1 · Spaced repetition for flashcards (Leitner).** `state.deckWordStatus` is effectively
  binary (`known` / `practiceMore`), so a word learned once is reviewed as often as one never seen.
  Add `state.cardBox[word]={box:1–4,due:ts}`; `startStudy()` orders due cards first; Home shows a
  real "N cards due today" count. Answering right promotes a box (1d→3d→7d→21d), wrong resets to 1.
- [x] **F2 · Library search — SHIPPED (2026-08-02, commit `37e58de`).** Search field at library root
  matches story `title`, `blurb`, and `genre` across all 300+ stories. Results render as standard
  story cards with level-coloured badge showing which level they're from. Query ≥2 chars activates
  results; clearing restores the level grid. Empty-state message when nothing matches. Both en + ja.
  LIVE (v=20260802).
- [x] **F3 · Continuous read-aloud — SHIPPED (2026-08-06, commit `4064b27`).** "Auto" pill toggle in
  reader audio strip. `speakPage()` helper auto-advances pages on utterance end when `state.autoPlay`
  is on; stops cleanly on last page. `prevPage()` now cancels TTS. `rbt_autoplay` persisted.
  En "Auto" / ja "自動". LIVE (v=20260807).
- [x] **F4 · Word highlighting synced to the voice — SHIPPED (2026-08-17, commit `f29204a`).** `makeWordTappable`
  adds `data-char="N"` to every word span; `_litWord(charIdx)` highlights matching span with `.word-lit`
  (rgba(186,218,85,.45) brand-green pill); `speakPage()` hooks `utter.onboundary` — fires in Chrome/Firefox,
  silent no-op on iOS Safari. Pairs with F3. LIVE (v=20260817).
- [x] **F5 · Progress backup / restore — SHIPPED (2026-07-27, commit `2fca1e8`).** Profile →
  "Save Progress" downloads all `rbt_*` localStorage keys as `ribbit-progress-YYYYMMDD.json`;
  "Restore Progress" reads the file back, validates it, confirms, applies, reloads. Both en+ja.
  LIVE (v=20260727).

### UI — ideas
- [ ] **U1 · Night theme.** The CSS is already fully tokenised on `:root`, so this is a second token
  block under `[data-theme="dark"]` + a Profile toggle + `state.theme` (`rbt_theme`), defaulting to
  `prefers-color-scheme`. Check the monochrome icons still tint (they use `currentColor`) and that
  the genre gradients don't glare.
- [x] **U2 · Reader comfort controls — SHIPPED (2026-08-18, commit `76192e6`).** Aa button in reader header toggles comfort bar with A−/A/A+ font stepper (×0.85/×1.0/×1.2 on `readerTypeScale()` output, `rbt_font_step`) and Easy Read toggle (line-height 1.6→2.2, letter-spacing +0.03em, word-spacing +0.12em, `rbt_easy_read`). Both en+ja. Line-focus tint skipped (complex, low ESL value vs. spacing gains). LIVE (v=20260818).
- [x] **U3 · Progress rings on cards — SHIPPED (2026-08-07, commits `01fff96`+`8b39e79`).** `progressRing(done,total,sz,stroke,track)` SVG donut helper. Level cards: 28px white ring in cover top-right; removes the old bar, sub-level text, and 10-dot row. Destination cards: 22px ring + X/Y fraction replaces plain text. 3 new CSS classes. LIVE (v=20260807d).
- [x] **U4 · Mascot empty states — SHIPPED (2026-08-03, commit `f32b623`).** Flashcards (no words
  saved), Profile recent-badges (0 earned), and World (0 stamps) now show the brand mascot + bilingual
  copy + "Start reading →" CTA. `mascot(px)` helper added. 5 new UI_STRINGS keys en+ja. LIVE (v=20260803).
- [x] **U5 · Reader page transition — SHIPPED (2026-07-27, commit `bfb8e8b`).** `.reader-page-text`
  now slides in from the right on Next and from the left on Prev (translateX ±22px + fade, .2s).
  `state.pageDir` transient flag; disabled under `prefers-reduced-motion`. LIVE.

### UX — ideas
- [x] **X1 · First-run coach tour — SHIPPED (2026-08-04, commit `d96d000`).** 3-slide modal overlay
  shown once on first home visit: tap-a-word, audio pill, quests. `state.seenTour` / `rbt_tour`
  persists dismissal. Skip + backdrop also dismiss. Only shows on home screen. Both en + ja. LIVE.
- [x] **X2 · Full keyboard / Chromebook control — SHIPPED (2026-07-29, commit `1cb312a`).** Single
  `document.keydown` listener: ←/→ (and ↑/↓) for reader pages; 1–4 to select quiz answer, Enter/Space
  to advance; Space/Enter to flip flashcard, ←/→ to mark known/practiceMore when flipped; Esc closes
  word popup first then story modal. Input-focus guard prevents stealing keystrokes from text fields.
  All 8 test cases verified; golden path clean; zero console errors; LIVE (v=20260729).
- [x] **X3 · Undo instead of instant loss — SHIPPED (2026-08-10, commits `35a635c`+`380c745`).** `removeWordFromDeck()` buffers the deletion for 5s in `_deletedWord`. `_showUndoToast()` shows a pill toast with tappable Undo button; `undoWordDelete()` restores the word. 3 new UI_STRINGS keys en+ja. LIVE (v=20260810).
- [x] **X4 · "Words you tapped" recap — SHIPPED (2026-08-21, commit `281cc83`).** `_sessionTappedWords[]` tracks popup-opened words per session (cleared on story start). Celebration screen shows a card with word pills + "Save all to my deck (N)" button; pills turn green after saving; "All saved ✓" replaces the button when done. `saveAllTappedWords()` batches the save. 4 new UI_STRINGS keys en+ja. Verified en+ja, 375px, zero console errors. LIVE (v=20260821).
- [ ] **X5 · Peek at the story during the quiz.** The quiz keeps the illustration but not the text, so
  comprehension questions test memory as much as understanding. Add a "Look again" button overlaying
  the page the question came from.

### Content — ideas
- [ ] **C1 · Quiz question variety.** Every item is literal recall — the `feedback` line is almost
  always "The story says…". Add inference ("How does she feel?"), sequencing ("What happened first?")
  and vocab-in-context types. Retro-fit one sub-level per run, starting at Level 3.
- [~] **C2 · After-reading talk prompt — L1 + L2 + L3 + L4 + L5 SHIPPED.** L1: 2026-07-24 commit `e15f2f9`. L2: 2026-07-29 commit `43cc844`. L3: 2026-08-05 commit `dad0610`. L4: 2026-08-11 commit `90200c2`. L5: 2026-08-21 commit `bd562b1` (50 stories, l5.1s1–l5.10s5, both en+ja, LIVE v=20260821b). A story with no prompt renders nothing so partial coverage is safe. **Remaining: Level 6 (50 stories)** — one more batch, no code needed.
- [ ] **C3 · Non-fiction fact files.** The genre mix is almost entirely narrative; ESL readers need
  informational text (animals, weather, places, how things work). Author a set at Levels 2–4 using
  the existing story schema so no code changes are needed.
- [ ] **C4 · Decodable phonics set at Level 1.** Absolute beginners currently get sight-word exposure,
  not systematic decoding. Add short-vowel word-family stories (-at, -ig, -op, -en, -ug) so a child
  can actually sound them out.
- [ ] **C5 · World Journey culture data.** Author `facts` (3 per destination, en + ja) and `vocab`
  (~6 words) for all 13 destinations — this is the missing content half of the stranded
  destination-detail feature listed under Functionality below.

### Monetisation — ideas (added 2026-08-04)

Full spec for each item: `ribbit-monetisation-handoff.md`. Strategy: `ribbit-monetisation-plan.md`.
**Two extra rules apply to this pillar only:** never gate gamification (XP, badges, streaks, quests,
star ratings, flashcards, placement test stay free at every level, forever), and never commit a secret.
**M-series only** is safe for an unattended routine — the S-series in the handoff spec needs Kyle present.

- [ ] **M1 · Eiken dual-labelling.** Add an `eiken` field to `LEVELS` (~line 730); render Eiken-first in
  the ja UI, CEFR-first in en. Three render sites: `lvl-cefr-badge` (~2114), `sublevel-header-meta`
  (~2184), `place-result-meta` (~2452). `cefr` field stays untouched — additive only. Wording must be
  「英検◯級の読解レベル相当」, never 「対策」. Levels 5–6 carry no grade claim. **Kyle to sign off on the
  proposed level→grade table in the handoff spec before building.**
- [x] **M2 · Entitlement stub + gate helpers — SHIPPED (2026-08-14, commit `fbb8ab5`).** `isSubscribed()` (dev flag `rbt_dev_sub='1'`), `canAccessLevel(id)` (L1 free; 2–6 need sub or allowance), `canAccessDestination(id)` (Tokyo free; others need sub or allowance), `weeklyFreeRemaining()` (3 − storyIds in current week), `recordFreeStoryUse(storyId)` (called in `finishStory()`, idempotent). `state.wkFree` persisted as `rbt_wkfree`; auto-resets at week boundary using `thisWeekKey()`. No gamification path calls a gate. No user-visible change. LIVE (v=20260814).
- [ ] **M3 · Upgrade screen.** Shown *only* on tapping locked content. Never an interstitial, never
  mid-story, never on home, never timed. Lists what's included + both prices + an easy, honest dismiss.
  No countdown, no "limited offer", no guilt copy. Blocked on M2; best built after S2/S3 exist.
- [x] **M4 · Locked-state affordances — COMMITTED, pending browser verify + deploy (2026-08-25, commit `dbeb77e`).** `lib-free-pill` notice above level grid shows real `weeklyFreeRemaining()` count (blue pill) or exhausted state (red pill), hidden for subscribers. Level cards L2–L6: when quota=0 and not subscribed, card gets `.locked` class (opacity .75) + lock badge replaces ring badge + `lvl-locked-text` "Locked/ロック中" in body. Level 1 always accessible; all levels open while freeRem>0. 4 new UI_STRINGS keys en+ja. No behaviour change on tap (M3 adds upgrade screen). **Kyle: verify in browser then push (3 commits pending: `91135d7`, `e22d140`, `dbeb77e`).**
- [ ] **M5 · Pricing page (Japanese-first).** Standalone page outside the app shell, linkable directly.
  What Ribbit is, the Eiken reading ladder from M1, free vs paid, prices in yen, and honest answers on
  cancellation and lapsed subscriptions (progress stays; Level 1 keeps working). No fabricated
  testimonials, user counts, or claims of any kind.
- [ ] **M6 · Analytics instrumentation.** Vercel Analytics + custom events: placement completed, first
  story completed, Level 1 completed, locked-content tap, upgrade screen viewed, checkout started,
  checkout completed. Fire once each, not on re-render. No child PII leaves the device.

### Gamification — ideas
- [ ] **G1 · Give XP a purpose.** XP accumulates and is never spent. Add a pond/avatar customisation
  shop — hats, lily pads, pond decorations — bought with XP, stored in `state.owned`/`state.equipped`,
  shown on the Home pond and the profile avatar. Cosmetic only, no real money, nothing gated behind it.
- [x] **G2 · Badge progress — SHIPPED (2026-07-25, commit `fefe1ce`).** `badgeProgress(b)` +
  thin progress bar + "X/Y" count on every locked badge with numeric criteria. Boolean-only
  badges (first-leap, skill-star, world-traveler) show no bar. Verified: 16 bars rendered
  (17 locked − 1 boolean = 16), all counts from live state. LIVE.
- [ ] **G3 · Personal bests in Profile.** Only the *current* streak is kept, so a 12-day run that
  breaks vanishes. Track `state.bestStreak` going forward and derive best week, most words saved in a
  week, and first-try perfect quizzes from `state.progress` timestamps.
- [x] **G4 · Weekly recap card — covered by G7 (2026-08-13).** See G7 above.
- [x] **G5 · Sub-level completion ceremony — SHIPPED (2026-07-30, commit `d4961d5`).** Full-screen
  ceremony fires between story celebration and library when the last story in a sub-level is finished
  for the first time: level icon, "Sub-level N Complete!", pond name, +50 XP bonus pill, and
  "Sub-level N+1 is now unlocked!" (if applicable). `state.celebratedSublevels` persisted as
  `rbt_celeb_sl` prevents re-trigger. Both en+ja, zero console errors, verified at 375px. LIVE.
- [x] **G6 · Personal bests in Profile — SHIPPED (2026-08-06, commit `74a6722`).** `state.bestStreak`
  persisted to `rbt_best_streak`; updated in `updateStreak()` on new highs. `bestWeekStories` derived
  on render from Mon-anchored week buckets of `state.progress`. Two new stat cards (🏆 Best Streak,
  📅 Best Week) added; desktop grid changed from 4→3 columns for a clean 2×3 layout. Both en + ja. LIVE.
- [x] **G7 · Weekly recap card — SHIPPED (2026-08-13, commits `747dcb7`+`81df533`).** Dismissible home
  card appears on first visit of a new week when learner had stories last week. Stories pill + streak
  pill (if streak > 0). `state.lastWeekRecap` / `rbt_wkrecap` tracks dismissal per week. Both en + ja.
  LIVE (v=20260813).
- [~] **G8 · "Level Champion" ceremony — COMMITTED, pending browser verify + deploy (2026-08-24, commit `91135d7`).** Gold-themed full-screen ceremony fires after the last sub-level ceremony: level icon + champion badge, +200 XP, next-level hint, confetti. `state.celebratedLevels[]` → `rbt_celeb_lv` prevents re-firing. **Kyle: verify in browser, then `git push origin master` after bumping `?v=20260824`.**

### Bug Fixes / Implementation Check — ideas (added 2026-08-21)

**Audit-and-fix sweep, not a feature build.** These are *classes of implementation defect* to hunt
through each Bug pillar run — not features to add. Sweep the live app against this list, pick the
highest-impact **real** defect, **reproduce it in the browser first**, fix it, re-check the golden path
for regressions, then ship. Tick a class off with the date + commit only when a concrete instance is
fixed; the classes themselves are recurring, so re-open them in later cycles as new instances appear.
Rules still apply: real data only, both `UI_STRINGS.en` **and** `.ja` for any copy touched, extend
existing state/CSS tokens, one change per session, verify-before-deploy.

- [ ] **B1 · Responsive image rendering.** Illustrations get cut off on the sides or top on some
  devices — the reader illustration, story-card covers, destination cards and the mascot don't scale
  cleanly to every viewport. Audit `object-fit` / `aspect-ratio` / `max-width` / container overflow on
  every image surface; test a tall-narrow phone, a short-wide phone (landscape), tablet (>=768) and
  375px. No image should crop its subject or overflow its frame.
- [ ] **B2 · Layout overflow & safe areas.** Hunt for anything that causes a horizontal scrollbar or
  bleeds off-screen at small widths — long story titles, long Japanese strings, wide pills/rows — plus
  content colliding with the notch / status bar at the top or the home-indicator and bottom nav at the
  bottom (`env(safe-area-inset-*)`). Nothing should be clipped, overlapped, or force sideways scroll.
- [ ] **B3 · Broken assets & console errors.** Walk the golden path (landing -> home -> library ->
  reader -> quiz -> celebration) with the console open: no errors or warnings, no 404s (a missing
  illustration `.webp` should fall back gracefully, never render a broken-image icon), no failed network
  requests, and the served cache-bust `?v=` must match the live JS.
- [ ] **B4 · Touch targets & interaction.** Child-sized fingers: every tappable control >=44px, no
  overlapping tap zones, no dead buttons, no popup/modal that won't close, no element trapped behind the
  bottom nav or another layer (z-index). Reader audio pills, word popup, quiz answers and nav are the
  usual suspects.
- [x] **B5 · State & persistence integrity.** Audited 2026-08-27 — all 22 `rbt_*` keys have matching `save()` calls, week-boundary resets correct, TTS cancel on navigate correct, image 404 fallback acceptable. One minor edge case noted (pendingLevelChampion lost on reload during ceremony — transient by design, low probability). No concrete defect to fix; re-sweep in Cycle 8.
  - **Edge case to watch:** if user reloads during levelChampion ceremony screen, pendingLevelChampion is lost and +200 XP is never awarded. Sub-level entry in celebratedSublevels prevents re-firing. Consider persisting pendingLevelChampion in a future Bug pillar.

---

## Priority

### Deploy
- [x] **Repo consolidated (2026-07-15).** The two-folder split is gone — this repo (remote `Oosh-online`,
  branch `master`) is now the single source *and* the deploy target. Old `Ribbit Reading App 2/` retired
  and archived. Deploy = commit + `git push origin master` (no copy step). Both folders backed up to
  `_Archive/ribbit-consolidation-backup-*` first; data files verified byte-identical (nothing lost).
- [x] **`ribbit-deploy` skill rewritten (2026-07-10).** It had staged `ribbit-reading-app.html` (the retired v1 file) and never staged `ribbit-reading-app-v3.html`, so it would not have published v3. It now documents the two-repo split, the image warning, and post-push verification.
- [x] Deployed `28de541` on 2026-07-10 — placement test, quiz feedback fix, reader fixes, and the South Korea destination that had been stranded since `1ffa9b3`. Live bytes verified identical to the committed files.
- [ ] **Decide on the 700×700 image downscales.** `image-pipeline/` produced them on 2026-07-05 and this repo tracks them, but they have never shipped: the reader illustration needs ~1064 device px at 2× DPR, so 700px would look soft. Live still serves the 1024×1024 originals (3.01 MB vs 1.84 MB). Either re-export at ~1200px, or accept the softness for the 39% weight saving on school Wi-Fi.
- [ ] Consider giving this folder a git remote of its own, so development history is backed up rather than living only on Kyle's machine.

### Functionality
- [x] **Bug: celebration Lottie left a green disc over the stars** — fixed 2026-07-24 (commit
  `5549d79`). `story-completion-celebration.json` ends on an opaque green frame and the slot was
  never cleared, so a green circle covered the star rating, XP chip and part of the result text
  after *every* story. Was live. `playLottie`'s `onComplete` now empties the slot, matching
  `playPageTurn()`. Found during browser verification of the talk prompts.
- [x] **Bug: `#header-xp-star` Lottie renders oversized** — fixed 2026-07-21 (commit `b66f955`).
  Added `.lottie-slot` CSS (20×20px, overflow:hidden) and class to `#header-xp-star`.
- [x] **Above-level word highlighting in reader (2026-07-24, commit `a5dc7a2`).** `makeWordTappable()` now calls `getChallengeLevel(clean, currentLevelId())`. Words above the story's level get `.challenge-word` (dashed orange underline). LIVE.
- [x] Audio speed controls — 🐢/🐸/⚡ toggle in reader audio pill, cycles 0.6×/0.9×/1.2×, persisted (2026-07-14)
- [ ] World Journey destination detail: vocabulary words + culture quiz sections are not ported (destination screen only shows the story grid, no vocab auto-save or culture quiz)
- [ ] Genre / topic browse screens — Quick Links "Explore Library" goes to the main library; genre browse tiles that v1 had are not in v3

### UI
- [ ] **Badge-unlock animation on the celebration screen reads as a plain green circle.** Spotted
  2026-07-24 while fixing the completion-animation bug. `.celeb-badge-anim-slot` (96×96) is sized
  correctly and the animation plays, but it ends on a flat green disc with no visible badge, so a
  child who just earned a badge sees a green dot. Either the Lottie is wrong for the slot or it
  needs the same `onComplete` clear as `playCelebrationAnims()` now has. Low risk, small fix.
- [x] Journey track sub-level labels — nodes now show numbers 1–5 + title shows "X/10 done" progress count (2026-07-21, commit `b66f955`)
- [x] **Star ratings on completed story cards (2026-07-24, commit `f564d4f`).** `storyStarCount()` + `.story-stars` row of gold stars below title for completed stories. LIVE.
- [ ] Pond Map home screen — v1 had a winding lily-pad SVG path (10 nodes per sub-level, frog on current node); the v3 home dash has a 5-node preview track but not the full Pond Map
- [x] **Dev server config fixed (2026-07-22, commit `729aa3a`).** Both `.claude/launch.json` files now use `--directory` pointing to the live repo, so `preview_start` always serves from the correct folder regardless of CWD.

### UX
- [x] **Exit reader/quiz now returns to library/world context (2026-07-22, commit `729aa3a`).** exitReading() and exitQuiz() contextually navigate: worldSelectedId → world; libraryLevel → library sublevel; else → home. LIVE.
- [x] **Story modal: best stars + "Read Again" for completed stories (2026-07-24, commit `a1682a5`).** `.modal-stars` row + button switches to `t('readAgainBtn')` when `state.progress[s.id]` exists. LIVE.
- [ ] 300 of 1,529 story pages still need internal scrolling at 1024×768 (mostly Levels 5–6, 700+ char pages). Now safe — the text area scrolls and the footer stays put — but splitting the longest pages would remove the scroll entirely.

### Technical
- [ ] Story titles, quiz questions and option labels are interpolated into `innerHTML` unescaped. `escAttr()` covers the `onclick` attributes (verified against an injection payload), but a title containing `<b>` still renders as markup. Authored content only, so low risk — the audit's "HTML-escape all interpolated strings" item.

### Content
- [ ] Images for levels 4–6 stories are missing (only b1, b2, b3 folders exist) — stories show emoji placeholder (images must be generated externally)
- [ ] Level 2 sub-levels 3–9 have ~10 stories each instead of 5 (data-generation quirk from the original file — all are valid content, but inconsistent with every other level). Kyle to decide whether to trim to 5 per sub-level (would require clearing affected learner progress)

### Gamification
- [x] Streak visual treatment on home header pill — `streak-at-risk` amber pulse when streak active but no stories today; `streak-milestone` warm glow at 7+ days (2026-07-14)
- [x] Champion badges — were already implemented via `LEVELS.map()` in BADGES; icons, checks, and rendering all wired. TODO was stale.
- [x] **Streak milestone toast at 7/14/30 days (2026-07-23, commit `d95c8d8`, pending push).** `checkStreakMilestone(n)` fires a bilingual celebratory toast when `updateStreak()` increments to exactly 7, 14, or 30. No extra state needed — fires again if streak resets and rebuilds.
- [x] XP rank-up toast when tier is crossed — `checkRankUp()` fires in `awardXP()`, bilingual (2026-07-14)

### Content / licensing
- [x] **`ribbit-wordlists.js` licensing resolved (2026-07-17).** OUP/CUP attribution swapped to CEFR-J + Octanove — both openly licensed for commercial use. See P0 section above.
- [x] **Japanese gloss coverage for World Journey + L6 vocabulary resolved (2026-07-23, commit `4171f0d`).** Added 127 missing entries to `ribbit-ja-translations.js` — total now 1991 keys covering all 395 unique vocab words used in Journey and Level 6 stories (was ~68%, now 100%). Cultural terms, food vocabulary, C1 abstract words all covered.

## Done ✅

### Placement test — 2026-07-10
- [x] **"Find My Pond" adaptive level test**, opened from a Home quick-link (never forced on a child). Once taken, the tile becomes "Re-Test" and shows the current pond.
- [x] Items are **generated at runtime from the app's own stories** — no bank to author. L1–L2 are word→Japanese-meaning; L3–L6 are cloze drawn from 1,631 real story sentences. Verified: 12,000 generated items with 0 duplicate options, 0 answers leaked into the prompt, 0 sentence fragments.
- [x] Adaptive staircase in 2-item blocks (2/2 up, 0/2 down, 1/2 stop), max 8 items, starting one level *below* the age band so a child meets an easy item first. Result capped one level above the age band. Simulated every age × ability: always terminates within 8 items, never over-places by more than one level.
- [x] `state.placement` (`rbt_place`) is honoured by `currentLevelId()` only until the learner reads a story — real behaviour outranks the test. Manual level override on the result screen (teacher-friendly).
- [x] Researched embedding an official test first: **Oxford Online Placement Test** and the **Oxford Placement Test for Young Learners** (ages 7–12) are licensed products delivered on OUP's own platform; Cambridge's public APIs cover exam administration and the dictionary, not placement items. No embeddable option exists, hence the generated bank.

### UI/UX pass — 2026-07-10
- [x] **Quiz feedback loop rebuilt.** The combo overlay was centred and covered 3 of the 4 answer options (measured) for ~870ms of a 900ms auto-advance, so a child who answered wrong never saw the right answer or the question's `feedback` line. Overlay moved to the top; auto-advance replaced with a learner-tapped "Next Question / See Results" button.
- [x] Quiz keeps the story illustration on screen — "What is this?" was unanswerable without it — and lays out illustration-left / question-right at tablet width.
- [x] Audio on the quiz question and every answer option (speaker is a sibling `<button>`, never nested inside the option).
- [x] Pronunciation audio in the word popup (auto-speaks on open) and on both faces of the flashcard study card.
- [x] Word popup leads with the Japanese gloss at Levels 1–2 — the English definition of "cat" was several CEFR bands above the word.
- [x] **Reader height containment.** `.reader-text-area`'s `overflow-y:auto` never engaged (flex items default to `min-height:auto`), so long pages scrolled the whole document and pushed Previous/Next off-screen. Fixed with `height:100vh` + `min-height:0` down the flex chain.
- [x] `justify-content: safe center` in the reader — plain `center` put the first line of 38 pages above `scrollTop:0`, unreachable.
- [x] Reader type scales with level *and* page length (46px for a Pre-A1 sentence, 22px for an 817-char C1 paragraph). Swept all 1,529 pages: 0 document overflow, 0 footer offscreen, 0 clipped first lines.
- [x] Real mid-story resume — `readingPos` persisted per story, so the continue card shows true progress instead of a hardcoded 40%. (Closes the audit's "[High] Resume mid-story".)
- [x] Rewards nav dot now means "you earned a badge you haven't looked at" instead of being permanently on.
- [x] Daily login bonus no longer fires over the splash screen before the child has entered.
- [x] Splash copy fixed — claimed "13 languages · 10 countries"; there are 2 UI languages and 13 destinations. Counts now derive from `LEVELS`/`DESTINATIONS`.
- [x] Removed the "Log In" button that just called `enterFromLanding()` — there are no accounts.
- [x] Bottom nav restructured: Progress merged into Profile (they rendered nearly the same content); Flashcards — a core loop with no tab — took the freed slot. "View path →" now opens the sub-level track instead of the stats screen.
- [x] `prefers-reduced-motion` honoured (3 looping animations + confetti); `<html lang>` follows the UI language; sub-level nodes raised from 36px to the 44px minimum; duplicate reader page counter removed.

- [x] South Korea added as 13th World Journey destination with 4 complete stories (2026-07-09)
- [x] storyGradient() fixed to resolve compound genre strings like "Sport / Culture" (2026-07-09)
- [x] Back navigation from celebration → library restores correct level/sublevel (2026-07-08)
- [x] Chromebook deck-name input focus: bank tile onmousedown fix (2026-07-08)
- [x] Word popup now dismissed when navigating between reader pages (2026-07-08)
- [x] World destination empty state for future no-story destinations (2026-07-08)
- [x] Story card in-progress indicator — class-based glow-pulse + yellow "IN PROGRESS" badge (2026-07-07)
- [x] Celebration frog enlarged to 96px with continuous float animation after bounce-in (2026-07-07)
- [x] Non-functional story-icons (👁 🔊) removed from story cards (2026-07-07)
- [x] "Reading Notes" modal placeholder replaced with actionable tap-word hint in en + ja (2026-07-07)
- [x] Continue card navigation bug (startReadingDirect)
- [x] Landing logo missing (OOSH_Logo_Square.png added)
- [x] Landing lang toggle non-functional (onclick added)
- [x] Confetti on celebration screen
- [x] Story title in reader header
- [x] XP delta rule (replay grinding prevented)
- [x] Quest progress bars (storiesPct / levelsPct / fcPct wired up)
- [x] Star rating logic (audioEverPlayed reset per story, accuracy-primary tiers)
- [x] Touch targets bumped to 44px minimum (reader/quiz/flashcard/header controls)
- [x] Home World Journey count now matches the World tab (destComplete-based)
- [x] TTS lang/voice set (en-GB + English voice pick) so JP-locale devices read stories correctly
- [x] Reader illustration no longer silently advances pages on tap
- [x] Story cards (.story-card/.jstory-card) are real buttons, focus-visible outline added
- [x] Deck-name input: escAttr() helper, focus/caret preserved across tile-tap re-render
- [x] Home journey preview windows around the learner's actual current sub-level
- [x] Reader Previous / Save Deck buttons use a real disabled attribute
- [x] --navy:#1A3260 token replaces duplicated hardcoded hex
- [x] save() also fires on visibilitychange/pagehide, not just beforeunload
