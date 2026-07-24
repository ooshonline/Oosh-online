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

### Functionality — ideas
- [ ] **F1 · Spaced repetition for flashcards (Leitner).** `state.deckWordStatus` is effectively
  binary (`known` / `practiceMore`), so a word learned once is reviewed as often as one never seen.
  Add `state.cardBox[word]={box:1–4,due:ts}`; `startStudy()` orders due cards first; Home shows a
  real "N cards due today" count. Answering right promotes a box (1d→3d→7d→21d), wrong resets to 1.
- [ ] **F2 · Library search.** No way to find a known story except by walking the level tree. Add a
  search field on the Library root matching story `title` + `blurb` + `genre` + vocab words across
  `STORIES`, rendering results as normal story cards with a level pill. Distinct from the
  genre-browse item below (that's browsing, this is finding).
- [ ] **F3 · Continuous read-aloud.** `toggleAudio()` speaks the current page and stops. Add
  auto-advance: on utterance end, turn the page and keep reading until the story ends or the child
  stops. Persist the preference; cancel speech on exit/navigate so it can't keep talking off-screen.
- [ ] **F4 · Word highlighting synced to the voice.** Use `SpeechSynthesisUtterance.onboundary`
  (`charIndex` → word span) to highlight each word as it is spoken — the single biggest decoding
  support for a beginning reader. Feature-detect and no-op silently where unsupported (iOS Safari).
  Pairs with F3.
- [ ] **F5 · Progress backup / restore.** There are no accounts, so a lost browser profile or a new
  Chromebook loses everything. Profile → "Save my progress" downloads the `rbt_*` keys as JSON;
  "Restore" reads a file back with a confirm step. Static-site safe, and the honest fix for a
  classroom that rotates devices.

### UI — ideas
- [ ] **U1 · Night theme.** The CSS is already fully tokenised on `:root`, so this is a second token
  block under `[data-theme="dark"]` + a Profile toggle + `state.theme` (`rbt_theme`), defaulting to
  `prefers-color-scheme`. Check the monochrome icons still tint (they use `currentColor`) and that
  the genre gradients don't glare.
- [ ] **U2 · Reader comfort controls.** On top of the automatic `readerTypeScale()`, give the child a
  font-size stepper (3 steps), an "easy read" mode (looser line-height + letter-spacing), and an
  optional line-focus tint. Persist per learner.
- [ ] **U3 · Progress rings on cards.** Level, sub-level and destination cards show progress as text
  ("X/10 done"). Replace with a real SVG ring in the level's own colour — same data, readable at a
  glance by a child who can't yet decode the label.
- [ ] **U4 · Mascot empty states.** Flashcards with no decks, Rewards with no badges and World with no
  stamps all render bare text. Use `assets/icons/brand/mascot.svg` + one bilingual line + a CTA that
  goes somewhere useful.
- [ ] **U5 · Reader page transition.** `playPageTurn()` fires a Lottie but the text swaps instantly, so
  the animation and the content disagree. Add a short slide/fade on `.reader-text-area` for next/prev,
  disabled under `prefers-reduced-motion`.

### UX — ideas
- [ ] **X1 · First-run coach tour.** Nothing tells a child that words are tappable — the app's core
  mechanic is invisible. Three skippable spotlight steps (tap a word, the audio pill, the quests tile)
  shown once via `state.seenTour`. Never blocks, never repeats.
- [ ] **X2 · Full keyboard / Chromebook control.** No `keydown` handlers exist anywhere. Add ←/→ to
  turn reader pages, 1–4 to pick a quiz answer, Enter to confirm, Esc to close modals and the word
  popup, Space to flip a flashcard. Kyle's learners are on Chromebooks; focus rings are already there.
- [ ] **X3 · Undo instead of instant loss.** `removeWordFromDeck()` deletes a saved word immediately
  with no confirmation and no way back. Add a 5-second undo toast (better than a modal for kids) and
  reuse it for any future delete.
- [ ] **X4 · "Words you tapped" recap.** Track which words a child opened during a story and list them
  on the celebration screen with one-tap "Save all to my deck" — turns passive tapping into vocabulary.
- [ ] **X5 · Peek at the story during the quiz.** The quiz keeps the illustration but not the text, so
  comprehension questions test memory as much as understanding. Add a "Look again" button overlaying
  the page the question came from.

### Content — ideas
- [ ] **C1 · Quiz question variety.** Every item is literal recall — the `feedback` line is almost
  always "The story says…". Add inference ("How does she feel?"), sequencing ("What happened first?")
  and vocab-in-context types. Retro-fit one sub-level per run, starting at Level 3.
- [~] **C2 · After-reading talk prompt — Level 1 SHIPPED (2026-07-24, commit `e15f2f9`).** LIVE.
  `TALK_PROMPTS` in `ribbit-stories.js` (keyed by story id, en + ja) + `renderTalkPrompt()` on the
  celebration screen: unmarked open question, speaker button, Japanese gloss below the English.
  All 75 Level 1 stories covered; a story with no prompt renders nothing, so partial coverage is
  safe. **Remaining: Levels 2–6 (280 stories)** — author in level-sized batches, no code needed.
- [ ] **C3 · Non-fiction fact files.** The genre mix is almost entirely narrative; ESL readers need
  informational text (animals, weather, places, how things work). Author a set at Levels 2–4 using
  the existing story schema so no code changes are needed.
- [ ] **C4 · Decodable phonics set at Level 1.** Absolute beginners currently get sight-word exposure,
  not systematic decoding. Add short-vowel word-family stories (-at, -ig, -op, -en, -ug) so a child
  can actually sound them out.
- [ ] **C5 · World Journey culture data.** Author `facts` (3 per destination, en + ja) and `vocab`
  (~6 words) for all 13 destinations — this is the missing content half of the stranded
  destination-detail feature listed under Functionality below.

### Gamification — ideas
- [ ] **G1 · Give XP a purpose.** XP accumulates and is never spent. Add a pond/avatar customisation
  shop — hats, lily pads, pond decorations — bought with XP, stored in `state.owned`/`state.equipped`,
  shown on the Home pond and the profile avatar. Cosmetic only, no real money, nothing gated behind it.
- [ ] **G2 · Badge progress.** Locked badges show a hint but no distance, so none of them feel close.
  Give each badge a `progress()` beside its `check()` and show "7 / 10 stories" on the locked card.
- [ ] **G3 · Personal bests in Profile.** Only the *current* streak is kept, so a 12-day run that
  breaks vanishes. Track `state.bestStreak` going forward and derive best week, most words saved in a
  week, and first-try perfect quizzes from `state.progress` timestamps.
- [ ] **G4 · Weekly recap card.** On the first visit of a new week, a dismissible Home card summarising
  last week from real data ("7 stories · 12 new words · 4-day streak"). No fabricated numbers.
- [ ] **G5 · Sub-level completion ceremony.** Finishing 10 stories just ticks nodes. Add a short
  full-screen unlock moment (stamp + next pond revealed + XP bonus) reusing the celebration machinery
  — the milestone that actually matters has the least fanfare.

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
