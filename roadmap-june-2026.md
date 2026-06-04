# Ribbit Reading App — Roadmap
**Period:** June – August 2026 (3 months)
**Format:** Now / Next / Later
**Owner:** Kyle Hope (solo)
**Constraints:** No server, free hosting (GitHub Pages), no budget, no-code (Claude-assisted)
**Long-term vision:** Ribbit grows into OOSH Online — a full A1–C1 ESL platform

---

## Current state (as of June 2026)

- 300 stories across 6 CEFR levels (Pre-A1 → C1)
- World Journey: 7 destinations live, 3 pre-researched (France, Mexico, Kenya), Wednesday auto-builder running
- Features: flash cards, quizzes, CEFR word highlighting, TTS (Web Speech API), 6 UI languages, daily reading goal, XP, badges, progress ring
- Hosted: GitHub Pages (free, no server)

---

## Now — Weeks 1–4

### 1. Japanese as default UI language
**Priority:** High | **Effort:** Low (< 1 hour)

Change the fallback UI language from English to Japanese in the `UI_STRINGS` / `t()` helper. Currently auto-detects via `navigator.language` — Japanese speakers on non-Japanese devices default to English. One-line config change.

**Why now:** Small change, immediate strategic clarity. Signals that Ribbit's primary market is Japanese ESL learners — every design decision going forward should be made with that user in mind.

**Flag:** This is a positioning decision, not just a code change. Confirm this is intentional — it affects how you'd market Ribbit, what content you prioritise, and how you'd eventually build OOSH Online.

---

### 2. Daily & Weekly Quests
**Priority:** High | **Effort:** Medium (1–2 sessions)

A quest system that gives learners a daily and weekly challenge. All state stored in localStorage — no server needed.

Example quests:
- Daily: "Read 2 stories", "Learn 5 new words", "Complete a quiz without hints"
- Weekly: "Visit a new World Journey destination", "Read stories from 3 different levels", "Build a 10-word flash card deck"

Completion triggers XP bonus + a celebratory animation. Quests reset on a daily/weekly timer stored in `state`.

**Why now:** Retention driver. Gives returning users a reason to open the app every day. High impact for low technical complexity.

---

### 3. Browse stories by topic (Story Packs)
**Priority:** Medium | **Effort:** Low-Medium (1 session)

Add a `genre` or `topic` tag to each story and build a "Browse by Topic" screen. No new stories needed — reorganises the existing 300. Topics could include: Animals, Food, Family, School, Travel, Nature, Fantasy, Sports.

This is the foundation for future themed content packs and eventually a content CMS for OOSH Online.

**Why now:** Low effort, makes the app feel much bigger and more navigable. Directly supports the "story packs around topics" goal.

---

## Next — Weeks 5–8

### 4. Images for stories
**Priority:** High | **Effort:** Medium-High (multiple sessions)

Add a header illustration to each story. Options (in order of feasibility):

1. **Free stock images via URL** — link to Unsplash/Pexels source URLs. Zero hosting cost, no repo bloat. Requires internet connection (fine for a web app).
2. **Topic-based illustrations** — one shared illustration per topic/genre rather than per story. 8–10 images covers the whole library.
3. **AI-generated, hosted externally** — generate via ChatGPT/Midjourney, host on a free image CDN (Cloudinary free tier: 25GB).

**Recommendation:** Start with option 2 (topic illustrations) — quick to implement, consistent visual style, minimal storage.

**GitHub Pages constraint:** Repo has a soft 1GB limit. If storing images in the repo, keep them compressed and below 100KB each.

---

### 5. TTS improvements
**Priority:** Medium | **Effort:** Medium (1–2 sessions)

Current TTS uses Web Speech API (en-GB). Known limitations: Firefox has poor `onboundary` support (word-by-word highlighting breaks); voice quality varies by device.

Improvements to build:
- Voice selector in Settings (list available voices on the user's device)
- Reading speed control (0.75×, 1×, 1.25×)
- Fallback mode for Firefox: highlight sentence rather than word when `onboundary` unsupported
- Optional: explore ElevenLabs free tier for pre-generated audio on short story segments

**Note:** ElevenLabs pre-generated audio would require storing audio files — evaluate file size impact carefully.

---

### 6. World Journey — images and visual upgrades
**Priority:** Medium | **Effort:** Low-Medium (1 session)

Add destination hero images (same approach as Story images above — Unsplash URLs or topic illustrations). Each destination already has cultural context; pairing it with a photo makes the passport/travel metaphor land better.

Also: animated stamp on passport completion (CSS animation, no dependencies).

---

## Later — Weeks 9–12

### 7. Weekly News Packs
**Priority:** Medium | **Effort:** High (ongoing)

Simplified, CEFR-graded news stories based on real current events. The "pulling from real news" goal has a technical constraint: GitHub Pages can't make server-side API calls, and most news APIs block client-side requests due to CORS.

**Realistic workflow (no server):**
- Kyle selects 3–5 news stories each week
- Claude rewrites them at A1, A2, B1, B2 versions using existing story format
- Kyle commits the updated `ribbit-stories.js` or a separate `ribbit-news.js` file
- App displays "This Week's News" as a separate tab or section

**Alternative to explore:** NewsAPI.org has a free tier with some CORS support — worth testing. If it works client-side, automation becomes possible. This needs a prototype before committing.

**Why later:** Requires a repeating manual workflow. Establish the quest system and images first so the app feels polished before adding a content cadence.

---

## Strategic notes

### Ribbit → OOSH Online
The current architecture (single-file HTML, localStorage, GitHub Pages) will scale to roughly where you want Ribbit to go in the next 6 months without any infrastructure changes. When OOSH Online eventually needs user accounts and cross-device sync, that's the moment to consider a lightweight backend (Supabase has a generous free tier, PocketBase is self-hostable). Don't build for that now — but don't add features that make the migration harder (e.g., avoid deeply coupling content to localStorage structure).

### Capacity
As a solo builder using Claude, realistic output is 2–4 meaningful features per month. The roadmap above has 7 items across 3 months — achievable if each session is focused. Quests and topic packs are the highest-leverage items and should not slip.

### What's not on this roadmap
- User accounts / cross-device sync (needs a server — out of scope for now)
- iOS/Android native app (out of scope without a developer)
- Monetisation (intentionally deferred — keep it free while growing users)
- Teacher dashboard (OOSH Online milestone, not a Ribbit milestone)

---

## Summary view

| Item | Now/Next/Later | Effort | Impact |
|---|---|---|---|
| Japanese default language | Now | Low | High |
| Daily & Weekly Quests | Now | Medium | High |
| Browse by topic (Story Packs) | Now | Low-Medium | Medium |
| Images for stories | Next | Medium-High | High |
| TTS improvements | Next | Medium | Medium |
| World Journey image upgrades | Next | Low-Medium | Medium |
| Weekly News Packs | Later | High (ongoing) | High |

---

*Last updated: 2026-06-02*
