# Ribbit Reading App 2 — TODO

## Priority

### Deploy
- [x] **`ribbit-deploy` skill rewritten (2026-07-10).** It had staged `ribbit-reading-app.html` (the retired v1 file) and never staged `ribbit-reading-app-v3.html`, so it would not have published v3. It now documents the two-repo split, the image warning, and post-push verification.
- [x] Deployed `28de541` on 2026-07-10 — placement test, quiz feedback fix, reader fixes, and the South Korea destination that had been stranded since `1ffa9b3`. Live bytes verified identical to the committed files.
- [ ] **Decide on the 700×700 image downscales.** `image-pipeline/` produced them on 2026-07-05 and this repo tracks them, but they have never shipped: the reader illustration needs ~1064 device px at 2× DPR, so 700px would look soft. Live still serves the 1024×1024 originals (3.01 MB vs 1.84 MB). Either re-export at ~1200px, or accept the softness for the 39% weight saving on school Wi-Fi.
- [ ] Consider giving this folder a git remote of its own, so development history is backed up rather than living only on Kyle's machine.

### Functionality
- [ ] Wire `ribbit-wordlists.js` into the v3 reader — CEFR above-level word highlighting was in v1 but is not active in v3 (`makeWordTappable` handles vocab highlights but doesn't call the word-level Sets)
- [x] Audio speed controls — 🐢/🐸/⚡ toggle in reader audio pill, cycles 0.6×/0.9×/1.2×, persisted (2026-07-14)
- [ ] World Journey destination detail: vocabulary words + culture quiz sections are not ported (destination screen only shows the story grid, no vocab auto-save or culture quiz)
- [ ] Genre / topic browse screens — Quick Links "Explore Library" goes to the main library; genre browse tiles that v1 had are not in v3

### UI
- [ ] Pond Map home screen — v1 had a winding lily-pad SVG path (10 nodes per sub-level, frog on current node); the v3 home dash has a 5-node preview track but not the full Pond Map

### UX
- [ ] Exit reading/quiz sends to home — learner loses their library context if they abandon mid-story (low priority; current behaviour is safe, just not ideal)
- [ ] 300 of 1,529 story pages still need internal scrolling at 1024×768 (mostly Levels 5–6, 700+ char pages). Now safe — the text area scrolls and the footer stays put — but splitting the longest pages would remove the scroll entirely.

### Technical
- [ ] Story titles, quiz questions and option labels are interpolated into `innerHTML` unescaped. `escAttr()` covers the `onclick` attributes (verified against an injection payload), but a title containing `<b>` still renders as markup. Authored content only, so low risk — the audit's "HTML-escape all interpolated strings" item.

### Content
- [ ] Images for levels 4–6 stories are missing (only b1, b2, b3 folders exist) — stories show emoji placeholder (images must be generated externally)
- [ ] Level 2 sub-levels 3–9 have ~10 stories each instead of 5 (data-generation quirk from the original file — all are valid content, but inconsistent with every other level). Kyle to decide whether to trim to 5 per sub-level (would require clearing affected learner progress)

### Gamification
- [x] Streak visual treatment on home header pill — `streak-at-risk` amber pulse when streak active but no stories today; `streak-milestone` warm glow at 7+ days (2026-07-14)
- [x] Champion badges — were already implemented via `LEVELS.map()` in BADGES; icons, checks, and rendering all wired. TODO was stale.
- [ ] Streak milestone toast/banner when streak hits 7/14/30 (currently covered by `loginBonusStreak` toast but no persistent UI feedback)
- [x] XP rank-up toast when tier is crossed — `checkRankUp()` fires in `awardXP()`, bilingual (2026-07-14)

### Content / licensing
- [ ] **`ribbit-wordlists.js` header says the sets are "Based on Oxford 3000/5000 and Cambridge English vocabulary lists."** Those are OUP/CUP copyrighted lists — worth a licensing sanity check for a commercial app. The clean swap is **CEFR-J** (Yukio Tono, Tokyo University of Foreign Studies, `github.com/openlanguageprofiles/olp-en-cefrj`): explicitly free for research *and commercial* use with citation, and built for Japanese learners of English. Its Octanove C1/C2 extension is CC BY-SA 4.0, so share-alike applies to that part.
- [ ] Level 6 Japanese gloss coverage is only 36% (96 of 268 vocabulary words). Fine for the placement test (L6 uses cloze, which needs no gloss) but it means the reader's word popup falls back to English-only at C1.

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
