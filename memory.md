# Ribbit Reading App — Project Memory

## Project Overview
An ESL reading app with 6 main levels × 10 sub-levels × 5 stories = **300 stories total**.
Fonts: Etna Sans Serif (headings), Glacial Indifference (body).
**Brand colours (OOSH):** Green `#bada55` (primary), Orange `#f9ad3b` (accent), Black `#151515` (text).
**Logo:** `OOSH_Logo_Square.png` (green frog with glasses) — stored in app folder and referenced in HTML.
Updated from old teal palette to OOSH brand colours: 2026-05-29.
**World Journey Hub:** Added 2026-05-29. Full Tokyo destination implemented as proof-of-concept. Architecture: DESTINATIONS[] array in HTML + JOURNEY_STORIES{} in ribbit-stories.js. State tracked in state.journey[destId] (storiesDone, wordsDone, quizScore, stamped). Three activity tracks per destination: 4 sequential stories → 6 local words (auto-save to flash cards) → 5-question culture quiz. Completion awards 200 XP, passport stamp, postcard fact, 3 bonus flash card words. Screens: journey (hub), destination (detail), journeyreader (story list), journeyreaderpage (reader), journeywords (word activity), journeyquiz (culture quiz), journeydone (stamp ceremony). Tab bar now has 4 tabs: Home / Journey / Cards / Profile. Passport stamps shown on profile page.
**Profile page + bottom tab bar:** Added 2026-05-29. Bottom tab bar (Home / Cards / Profile) visible on home, flashcards, and profile screens. Profile shows XP, story count, completion %, per-level progress bars, badge grid (earned/locked), and flash card count. CSS bust silhouette avatar built in pure CSS. `tabBar()` helper injected by each relevant render function. `renderProfile()` in router as case 'profile'.
**Reader step logic:** Fixed 2026-05-29. `splitSentences` now protects abbreviations (Mr./Dr./U.S.A./decimals/ellipses) from false splits. `getReaderSteps` merges any remaining 1–2 word fragments into the adjacent step. Short complete sentences (3+ words) stay as individual steps. Levels 3–6 remain paragraph-by-paragraph.
**TTS (Text-to-Speech):** Added 2026-05-29. Uses Web Speech API (`SpeechSynthesisUtterance`), en-GB voice, word-by-word highlighting via `onboundary` + `data-tts` char-offset spans. Auto-advances to next step on utterance end. Speed: 0.75×/1×/1.5×/2×. TTS bar always visible in reader. Stops on navigate away, step back, start quiz.
Main file: `ribbit-reading-app.html`

## Level Structure
| Main Level | Name | CEFR | Oxford YLE | Ages |
|---|---|---|---|---|
| 1 | Beginner | Pre-A1 | Pre-Starters | 5–7 |
| 2 | Elementary | A1 | Starters | 7–9 |
| 3 | Pre-Intermediate | A2 | Movers | 9–11 |
| 4 | Intermediate | B1 | Flyers | 11–13 |
| 5 | Upper-Intermediate | B2 | KET/PET | 13–15 |
| 6 | Advanced | C1 | FCE | 15+ |

Each main level has **10 sub-levels** (e.g. Beginner 1–10).
Each sub-level has **5 stories**.

## Sub-level Progression (Beginner example)
- B1: 2–4 sentences, CVC words only, "is/are/has"
- B2: 4–6 sentences, basic adjectives, colours
- B3: 6–8 sentences, family/home vocab
- B4: 8–10 sentences, daily routine, numbers
- B5: 10–14 sentences, 2 short paragraphs
- B6: 14–18 sentences, conjunctions "and/but"
- B7: 18–22 sentences, present continuous (-ing)
- B8: 22–28 sentences, simple past tense
- B9: 28–34 sentences, 3 paragraphs
- B10: 34–50 sentences, bridging to Elementary

## Story Data Format
```js
{
  id: "l1.1s1",        // level.sublevel story
  levelId: 1,
  subLevel: 1,
  title: "...",
  emoji: "...",
  genre: "...",
  wordCount: 20,
  readMins: 1,
  blurb: "...",
  paragraphs: ["..."],
  vocabulary: { word: { def: "...", pos: "noun" } },
  quiz: [{ question: "...", options: [...], correct: 0, feedback: "..." }]
}
```

## Build Progress

### Session started: 2026-05-28

| Level | Sub-levels Done | Stories Done | Status |
|---|---|---|---|
| 1 – Beginner | 10/10 | 50/50 | ✅ Complete |
| 2 – Elementary | 10/10 | 50/50 | ✅ Complete |
| 3 – Pre-Intermediate | 10/10 | 50/50 | ✅ Complete |
| 4 – Intermediate | 10/10 | 50/50 | ✅ Complete |
| 5 – Upper-Intermediate | 10/10 | 50/50 | ✅ Complete |
| 6 – Advanced | 10/10 | 50/50 | ✅ Complete |

### Completed sub-levels (update as work progresses):
- ✅ Beginner 1 (l1.1s1–s5) — 2–4 sentences, CVC words
- ✅ Beginner 2 (l1.2s1–s5) — 4–6 sentences, colours/adjectives
- ✅ Beginner 3 (l1.3s1–s5) — 6–8 sentences, family/home
- ✅ Beginner 4 (l1.4s1–s5) — 8–10 sentences, daily routine/numbers
- ✅ Beginner 5 (l1.5s1–s5) — 10–14 sentences, 2 paragraphs

## Architecture Notes
- Navigation: Home → Level Select → Sub-level Select → Story Browser → Reader → Quiz → Results
- Data stored in `STORIES` object keyed as `STORIES[levelId][subLevel]` = array of 5 stories
- Progress saved in localStorage
- Scheduled nightly 3am job continues writing from next pending sub-level

## Rules for Scheduled Continuation
1. Read this memory.md FIRST
2. Find the first incomplete sub-level in the table above
3. Write those 5 stories, add to the HTML file
4. Save the HTML file
5. Update this memory.md table
6. Repeat until session limit

## Scheduled Task
- Time: 3:00 AM daily
- Purpose: Continue writing story content from where previous session left off
- Approval: Pre-approved by Kyle — work without asking

### Sub-level completion log (2026-05-28)
- B1 ✅ (5 stories — very basic CVC/sight words, 14–16 words each)
- B2 ✅ (5 stories — basic adjectives and colours, ~25 words)
- B3 ✅ (5 stories — family/home vocab, ~35 words)
- B4 ✅ (5 stories — daily routine and numbers, ~45 words)
- B5 ✅ (5 stories — 2 short paragraphs, ~55 words)
- B6 ✅ (5 stories — conjunctions and/but/because, ~67 words) — 2026-05-28

- B7 ✅ (5 stories — present continuous (-ing) focus, ~78 words) — 2026-05-28
- B8 ✅ (5 stories — simple past tense introduced, ~90 words) — 2026-05-28
- B9 ✅ (5 stories — 3 paragraphs, richer vocabulary, ~100 words) — 2026-05-28
- B10 ✅ (5 stories — bridging to Elementary, ~118 words) — 2026-05-28

**Level 1 (Beginner) fully complete: 50/50 stories ✅**
Next: Level 2 — Elementary (A1 · Starters · Ages 7–9 · 120–200 words)

- E1 ✅ (5 stories — new classroom, library, garden, spelling bee, market · ~130 words) — 2026-05-28
- E2 ✅ (5 stories — science fair, midnight feast, pen pal, museum, bake sale · ~140 words) — 2026-05-28
- E3 ✅ (5 stories — dialogue introduced, wider vocab · ~155 words) — 2026-05-28
- E4 ✅ (5 stories — past tense strengthened, growing descriptions · ~170 words) — 2026-05-28
- E5 ✅ (5 stories — longer paragraphs, feelings and opinions · ~188 words) — 2026-05-28
- E6 ✅ (5 stories — cause & effect, complex sentences · ~203 words) — 2026-05-28
- E7 ✅ (5 stories — varied sentence structure, richer settings · ~218 words) — 2026-05-28
- E8 ✅ (5 stories — multiple perspectives, inference required · ~232 words) — 2026-05-28

### Level 2 completion log (2026-05-28)
- E1 ✅ (5 stories — ~120 words, simple past/present, 3 paragraphs)
- E2 ✅ (5 stories — ~135 words, richer vocabulary)
- E3 ✅ (10 stories — ~150 words, dialogue introduced)
- E4 ✅ (10 stories — ~165 words, reported speech, more dialogue)
- E5 ✅ (10 stories — ~180 words, 4 paragraphs, varied tenses)
- E6 ✅ (10 stories — ~195 words, descriptive language)
- E7 ✅ (10 stories — ~210 words, nuanced characters)
- E8 ✅ (10 stories — ~225 words, 4–5 paragraphs, emotional nuance)
- E9 ✅ (5 stories — ~245 words, abstract themes introduced)
- E10 ✅ (5 stories — ~260 words, bridging to Pre-Intermediate)

**Level 2 (Elementary) fully complete: 80 stories ✅**

### Level 3 completion log (2026-05-28)
- PI1 ✅ (5 stories — ~260–275 words, clear narrative arc, accessible vocab)
- PI2 ✅ (5 stories — ~275–290 words, stronger character voice, figurative language)
- PI3 ✅ (5 stories — ~290–305 words, complex sentences, richer setting)
- PI4 ✅ (5 stories — ~305–320 words, deeper observation and inference)
- PI5 ✅ (5 stories — ~320–335 words, broader themes, nuanced emotion)
- PI6 ✅ (5 stories — ~335–350 words, abstract ideas, community/world)
- PI7 ✅ (5 stories — ~350–360 words, history, science, complex reflection)
- PI8 ✅ (5 stories — ~360–370 words, bridging — first person professional/adult)
- PI9 ✅ (5 stories — ~370–380 words, community, translation, ecology, sport)
- PI10 ✅ (5 stories — ~380 words, memory, identity, objects, reflection)

**Level 3 (Pre-Intermediate) fully complete: 50/50 stories ✅**

### Level 4 completion log (2026-05-29)
- I1–I10 ✅ (50 stories — ~400–500 words, B1 Flyers, ages 11–13)

**Level 4 (Intermediate) fully complete: 50/50 stories ✅**

### Level 5 completion log (2026-05-29)
- UI1–UI10 ✅ (50 stories — ~450–550 words, B2 KET/PET, ages 13–15)

**Level 5 (Upper-Intermediate) fully complete: 50/50 stories ✅**

### Level 6 completion log (2026-05-29)
- A1 ✅ (5 stories — ~480–500 words, C1/FCE, ages 15+) — written by dispatch session
- A2 ✅ (5 stories — ~500–520 words) — written by dispatch session
- A3–A10 ✅ (40 stories — ~410–550 words) — written by scheduled task

**Level 6 (Advanced) fully complete: 50/50 stories ✅**

⚠️ Format note: A1–A2 use `STORIES[6][n].push({id:"l6.xs1"})` format. A3–A10 use `STORIES[6][n] = [{id: "l6.xs1"}]` format (with spaces, array literal). Both load correctly. subLevel field is 1-indexed in Level 6 (inconsistent with Levels 1–5 which are 0-indexed) — monitor if app displays sub-levels incorrectly.

## 🎉 ALL 300 STORIES COMPLETE — 2026-05-29
All 6 levels × 10 sub-levels × 5 stories written and saved to ribbit-stories.js.
Total story IDs in file: 355 (includes 75 in L1 and 80 in L2 due to bonus stories from earlier sessions).

---

## Bug fix pass: 2026-05-30 (scheduled task)

### Bugs found and fixed

**1. Double padding on `.reader-bottom-row` (primary quiz-button bug)**
- `.reader-bottom` already has `padding:12px 20px 20px`. `.reader-bottom-row` inside it had the same padding again, making the fixed bottom bar ~114px tall — dangerously close to the word-popup's `bottom:120px` anchor and leaving the Start Quiz button cramped/potentially obscured.
- Fix: `.reader-bottom-row` padding removed (`padding:0`). The outer container's padding is sufficient.

**2. "Read Again" didn't reset readerStep**
- Navigating `reader` with the same `storyId` does not reset `readerStep` (by design, to support mid-story resumption). The results screen's "Read Again" button passed only `storyId`, landing the user on the last step.
- Fix: Added `readerStep:0` to the Read Again navigate call.

**3. Sub-level completion badge never showed for L1–L5**
- `finishQuiz()` used `const sl = story.subLevel - 1` to convert to a 0-indexed array key. But L1–L5 stories already store `subLevel` as 0-indexed (0–9), so the first sub-level gave `sl = -1` and `subLevelDone` always returned false.
- Fix: `const sl = story.levelId===6 ? story.subLevel-1 : story.subLevel`

**4. Level 6 display name off by one in reader**
- L6 stories store `subLevel` as 1-indexed (1–10), but the reader meta-pill did `story.subLevel+1`, showing "Advanced 2" for the first sub-level.
- Fix: `story.levelId===6 ? story.subLevel : story.subLevel+1`

**5. Level 6 XP calculation off by one**
- Same 1-indexed issue in `storyXP()` — first L6 sub-level awarded double the intended XP.
- Fix: Same conditional normalisation applied.

### Items audited and confirmed working
- stepBack() / readerStep decrement ✅
- Quiz rendering: pick(), nextQ(), all 4 options, Next button visibility ✅
- Retry Quiz resets quizIndex and quizAnswers ✅
- More Stories navigates to sublevels ✅
- Flash card flip / fcMark / summary screen ✅
- lastStoryId saved/loaded from localStorage ✅
- Font size toggle (font-large on body, persisted via rbt_fontsize) ✅
- Language selector (rbt_lang, getUserLang()) ✅
- beforeunload save listener ✅

---

## Session log: 2026-05-30

### Features added this session

**OOSH brand colours applied**
- Primary green: `#bada55`, accent orange: `#f9ad3b`, text black: `#151515`
- All old teal palette replaced throughout HTML and JS
- OOSH frog logo (`OOSH_Logo_Square.png`) replaces SVG placeholder in home screen
- Brand colours and logo added to knowledge-base.md under OOSH Brand Kit

**TTS (Text-to-Speech)**
- Uses Web Speech API — no external service needed
- Persistent 🔊 Listen bar in the reader with ▶/⏸, ■ stop, and 0.75×/1×/1.5×/2× speed
- Word-by-word highlighting via `onboundary` + `data-tts` char-offset spans (`addTTSWordSpans()`)
- Auto-advances to next step on utterance end; stops cleanly on navigate/quiz/back
- Works in Chrome and Safari; Firefox has limited `onboundary` support (audio still plays)

**Reader step logic fix**
- `splitSentences()` now protects abbreviations (Mr./Dr./U.S.A./decimals/ellipses) from false splits
- `getReaderSteps()` merges 1–2 word fragments into adjacent step; short complete sentences (3+ words) stay as individual steps

**Bottom tab bar**
- 4 tabs: Home / Journey 🌍 / Cards / Profile (bust silhouette)
- Visible on home, journey, flashcards, and profile screens
- Built with `tabBar()` helper injected by each relevant render function

**Profile page**
- Stats: stories read, total XP, completion %
- Per-level progress bars for all 6 levels
- Badge grid (8 badges, earned/locked)
- Passport stamps section (shows World Journey stamps; prompts if none yet)
- Flash card count + Study shortcut

**World Journey Hub — Tokyo (full destination)**
- Architecture: `DESTINATIONS[]` in HTML + `JOURNEY_STORIES{}` in ribbit-stories.js
- State tracked in `state.journey[destId]` — storiesDone, wordsDone, quizScore, stamped
- 3 activity tracks: Stories → Local Words → Culture Quiz (quiz locked until others complete)
- 4 Tokyo stories at A2: The Morning Market, Platform 12, One Thousand Cranes, My Street
- 6 local words: sakura, bento, origami, torii, shinkansen, manga (auto-saved to flash cards)
- 5 culture quiz questions about Tokyo
- Completion: 200 XP, passport stamp, postcard fact, 3 bonus flash card words (ramen, sushi, onsen)
- Screens: journey, destination, journeyreader, journeyreaderpage, journeywords, journeyquiz, journeydone
- Adding a new destination = new entry in `DESTINATIONS[]` + stories in `JOURNEY_STORIES['id']`

**Destinations built:**
- Tokyo 🗼 (unlockAfter: null) — stories: Morning Market, Platform 12, One Thousand Cranes, My Street
- Australia 🦘 (unlockAfter: 'tokyo') — stories: Below the Surface, The Long Road, Saturday Morning, The Shape of the Throw
- England 🎡 (unlockAfter: 'australia') — stories: The Village Fête, Mind the Gap, Chip Shop Friday, Bonfire Night
- Brazil 🌿 (unlockAfter: 'england') — stories: The Drumline, River Deep, Kickabout, The Saturday Churrasco
- Egypt 🏺 (unlockAfter: 'brazil') — stories: Before the Heat, The Felucca, The Khan, The Stone Letters
- China 🏮 (unlockAfter: 'egypt') — stories: The Section Nobody Climbs, The Tea House, The Last Night of the Lanterns, The Hutong and the House Behind the Wall — local words: mandarin, chopsticks, pagoda, hutong, dim sum, tai chi — Added 2026-05-30
- India 🇮🇳 (unlockAfter: 'china') — stories: The Dabbawalas, The Colour That Runs, Night Train to Mysuru, The Stepwell — local words: dabbawala, chai, gulal, sari, rangoli, rupee — Added 2026-05-30

### Key files
- `ribbit-reading-app.html` — main app: all screens, DESTINATIONS[], state management, TTS, tab bar, profile
- `ribbit-stories.js` — 300 main stories + `JOURNEY_STORIES{}` constant for all World Journey stories
- `memory.md` — this file (project ground truth — read at the start of every Ribbit session)
- `~/Documents/Claude/knowledge-base.md` — OOSH Brand Kit, World Journey Hub, scheduled tasks
- `~/Documents/Claude/Projects/Ribbit Reading App/OOSH_Logo_Square.png` — app logo

### Scheduled automation
- **`ribbit-new-destination`** — runs every Wednesday at 3am — adds the next destination from the queue to the app automatically. Queue: France → Mexico → Kenya → Italy → Peru → South Korea → Morocco → Canada → Greece. Task reads memory.md to find the last built destination and picks the next unbuilt one.

### Hosting / Deployment
- GitHub account: **Ooshonline** (kyle.iain.hope@gmail.com)
- Repo: `https://github.com/Ooshonline/Oosh-online`
- Files committed locally to `master` branch; **push pending** — Kyle needs to run in Terminal:
  ```
  cd "/Users/ooshafterschool/Documents/Claude/Projects/Ribbit Reading App"
  git remote set-url origin https://Ooshonline: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@github.com/Ooshonline/Oosh-online.git
  git push -u origin master
  ```
- After push: repo Settings → Pages → Branch: master → / (root) → Save
- Live URL: `https://ooshonline.github.io/Oosh-online/ribbit-reading-app.html`
- ✅ **LIVE** — deployed to GitHub Pages on 2026-06-01
- ⚠️ localStorage is device-local — progress doesn't sync across devices

### Development skills
Five on-demand skills available for Ribbit work — all in `~/Documents/Claude/Skills/`:
- **ribbit-story-reviewer** — quality audit (8 checks: structure, word count, British English, CEFR, anti-AI, quiz, vocab, character)
- **ribbit-feature-builder** — guide for adding new screens/activities (navigation, state, rendering, brand colours)
- **ribbit-deploy** — stage, commit, hand off git push to Terminal
- **ribbit-health-check** — structural audit (story counts, Journey integrity, quiz range, JS syntax, localStorage)
- **research** — general-purpose web research → structured knowledge-base entry; used automatically by ribbit-new-destination before writing stories

### Native language UI system (2026-05-30)
- `UI_STRINGS` object added: 6 languages (en, ja, ko, zh, es, fr), ~40 UI string keys
- `t(key, vars)` helper auto-selects strings based on `navigator.language`; English fallback
- `getUserLang()` now reads device language first, stored preference second
- Tab bar, quiz feedback, destination completion screen all use `t()`
- Word popup redesigned: English definition + native language definition (fetched via API) + example sentence extracted from story paragraph
- `doTranslate()` now fetches word translation AND definition translation in parallel
- Quiz feedback translated: "✓ Correct!" and "✗ Not quite — re-read step N…" in all 6 languages
- Language selector in settings kept for manual override; removed from start-up flow dependency
- New CSS classes: `.wp-section-label`, `.wp-native-def`, `.wp-example`

### UX improvements applied (2026-05-30)
- Quiz wrong-answer feedback: "Not quite — re-read step N and try again."
- Reader font: 1.2rem / 1.9 line-height for Levels 1–2 (body class `level-early`); 1.1rem / 1.75 for 3–6
- Quiz option padding 18px, gap 16px
- Destination completion: stamp drop animation, animated XP counter (0→200), staggered reveals
- White text on orange fixed (stamp button + TTS paused state)
- All touch targets confirmed 44px minimum

### Destination research pre-loaded in knowledge-base.md
France 🇫🇷, Mexico 🇲🇽, Kenya 🇰🇪 — researched and ready for scheduler to use.

### Last updated
2026-05-30 — UX improvements applied; India complete; GitHub push pending Monday; Mexico + Kenya pre-researched.
