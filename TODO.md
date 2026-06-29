# Ribbit Reading App — TODO

## Push pending
- [ ] `git push` — 7 commits from 2026-06-24/25/26/29 are local only

## Content (future Content sessions)
- [ ] Story images for levels beyond Beginner 1–3 — one image per genre/topic (~8–10 images covers the library). Unsplash/Pexels URLs to avoid repo bloat.

## UX
- [ ] Weekly News Packs — graded news stories, separate `ribbit-news.js` file

## Functionality
- [ ] Voice selector: test on iOS Safari (voices list may differ from desktop)
- [ ] translateWord: currently uses local JA_TRANSLATIONS only — words outside the 300-story vocab won't have Japanese shown in flash card play. Consider expanding JA_TRANSLATIONS with destination local words, or a fallback API.

## Scheduled tasks
- [ ] `ribbit-new-destination` queue: South Korea → Morocco → Canada → Greece (Peru done manually 2026-06-25)

## Done (recent)
- [x] Quest progress bars — daily (stories) + weekly (levels/flash cards) now show 3px visual bars (2026-06-29)
- [x] Story grid cards — done state shows subtle green ring (2026-06-29)
- [x] Destination cards (journey hub) — stamped/active cards get soft outer glow (2026-06-29)
- [x] Profile level progress bars — each level now uses its own colour (purple/green/teal/blue/orange/rose) (2026-06-29)
- [x] Sub-level hero banner — now uses a dark level-specific gradient instead of always green (2026-06-29)
- [x] Sub-level hero text — updated to white + transparent badge for legibility on dark gradients (2026-06-29)
- [x] Topic/genre cards — emoji now renders in a coloured rounded-square per genre, with hover scale (2026-06-29)
- [x] Level select — `current-level` CSS class now properly applied (was defined but never added in JS) (2026-06-29)
- [x] Level cards — mini progress bar now uses level colour (2026-06-29)
- [x] Flash card empty state — redesigned with icon container, heading, descriptive hint, CTA strip (2026-06-29)
- [x] Settings screen — border-bottom separators between each section (2026-06-29)
- [x] Profile — fixed English strings: 'day streak' → '日連続', 'Total Points' → '合計ポイント' (2026-06-29)
- [x] TTS Firefox fallback — detect missing word-boundary events (900ms timer), highlight whole step block in amber (2026-06-26)
- [x] Flash card swipe gestures — pointer events, card tilt, direction labels (わかった/わからない) (2026-06-26)
- [x] Keyboard shortcuts — reader (arrows/space), journey reader (same), flash cards (arrows/space), quiz MC (1-4/A-D/Enter) (2026-06-26)
- [x] advanceReader() flows to startQuiz() on last step — keyboard-only reading now complete (2026-06-26)
- [x] FITB + type-the-word Enter-to-submit (2026-06-26)
- [x] Quiz next button spring entrance animation (2026-06-26)
- [x] Touch :active press states on key buttons (2026-06-26)
- [x] translateWord defined — was missing, caused ReferenceError on flash card translate button (2026-06-26)
- [x] Journey words pre-populate JA_TRANSLATIONS on save (2026-06-26)
- [x] Flash card translation error state shows '翻訳が見つかりません' not blank (2026-06-26)
- [x] Toast notification for card-added-to-deck (word popup + journey words) (2026-06-26)
- [x] Peru destination — 4 A2 stories, 6 local words, culture quiz (2026-06-25)
- [x] Italy DESTINATIONS entry — was missing, destination was unreachable (2026-06-25)
- [x] DEST_GRADIENTS fixed — all destination cards now show unique gradient (2026-06-25)
- [x] Destination detail hero banner — gradient + emoji + title on each destination page (2026-06-25)
- [x] Splash screen "世界10か国" → "世界12か国" (2026-06-25)
- [x] Daily quest system (2026-06-24)
- [x] Browse by genre / topic (2026-06-24)
- [x] Italy destination stories (2026-06-24)
- [x] Weekly quest system (2026-06-24)
- [x] TTS voice selector in Settings (2026-06-24)
- [x] Full dark theme → v2 light theme (2026-06-23)
- [x] Pond Map home, reader focus mode, level-gated quiz engine (2026-06-12)
