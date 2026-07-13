# Ribbit Reading App — Icon & Animation Implementation Brief

Source: `audit/phase1-code-analysis.md`. Assets: `icons/` (42 SVG) and `animations/` (11 Lottie JSON), pushed to project root.

## Discrepancies — resolved (single source of truth for Code)

**Font: use Glacial Indifference / Baloo 2 — not Nunito.** Nunito is what's
currently live, but it was never the intended brand font, it's a stand-in.
The brief's Etna Sans Serif is not available as a licensable webfont, so the
resolution is: **Glacial Indifference** (open-source, matches the brief's
geometric-humanist intent) for body text, **Baloo 2** (Google Fonts) as the
closest free rounded-geometric display face for headings, in place of Etna.
Implement this pairing everywhere, replacing Nunito/Nunito Sans.

**Color: `--primary` moves to `#72C93A` — not `#bada55`.** `#bada55` is a
leftover/placeholder value; `#72C93A` is the correct frog green and already
appears correctly in the Level 2 "Pond" gradient stop, it just isn't wired up
as `--primary`. Repoint the token, don't introduce a new one. Navy `#1A3260`
is already correct and unchanged.

All icons and animations below are built against these values — theme via
CSS custom properties / a shared color map, never hardcode hex in new code.

## Asset → trigger mapping

### Nav icons (`icons/nav/`) — 60px hit area, 32px glyph, `--ink` (navy) stroke
- `home.svg` — home tab, nav bar
- `library.svg` — library tab, nav bar
- `flashcards.svg` — flashcards tab, nav bar
- `rewards.svg` — rewards tab, nav bar
- `profile.svg` — profile tab, nav bar / header avatar fallback

### Player controls (`icons/controls/`) — 60px hit area, 28px glyph
- `play.svg` / `pause.svg` — reader/audio play-pause toggle, swap on state change
- `next.svg` / `previous.svg` — reader page nav (pairs with `page-turn.json`)
- `audio.svg` — read-aloud toggle button
- `close.svg` — exit reader / dismiss modal

### Status (`icons/status/`) — 24px inline, or 44px as a standalone badge
- `check.svg` — completed lesson/quiz marker
- `lock.svg` — locked level/story card overlay
- `search.svg` — library search field
- `streak-flame.svg` — static day-streak counter icon; pairs with `streak-flame-idle.json` when the streak counter is visible on-screen for >1s

### Level / pond icons (`icons/levels/`) — 40px in progress rail, `--primary` (green) fill
- `lily-pad.svg`, `pond.svg`, `stream.svg`, `river.svg`, `waterfall.svg`, `ocean.svg` — level progress rail and level-select screen, in ascending order; current level fills solid, locked levels render at 40% opacity (don't recolor)

### XP (`icons/xp/`)
- `xp-star.svg` — XP counter icon, header; pairs with `xp-lily-pad-earn.json` on increment

### Achievement badges (`icons/badges/`) — 56px in gallery, 96px on unlock moment
- `first-leap.svg`, `skill-star.svg`, `ten-tales.svg`, `century-club.svg`, `quiz-ace.svg`, `world-traveler.svg`, `story-streak.svg`, `streak-keeper.svg`, `two-week-streak.svg`, `monthly-marathon.svg`, `word-watcher.svg`, `word-collector.svg`, `vocabulary-vault.svg`, `known-master.svg` — one per achievement, static gallery state
- `champion-lily-pad.svg` … `champion-ocean.svg` (6) — level-champion variants, one per pond stage, gallery state
- All badges pair with `badge-unlock.json` for the unlock moment — the JSON's ring/star shapes should be recolored at runtime to match the specific badge's fill (don't fork one Lottie per badge)

## Animation → trigger mapping

| file | duration | fps | trigger / replaces |
|---|---|---|---|
`animations/badges/badge-unlock.json` | 0.6s (18f) | 30 | plays on badge-unlock moment, replaces the static emoji swap
`animations/rewards/star-collection-1/2/3.json` | 0.4s (12f) each | 30 | plays on quiz result screen render, replaces the CSS star-pop-on-emoji keyframe; pick file by stars earned
`animations/rewards/xp-lily-pad-earn.json` | 0.5s (15f) | 30 | plays on XP counter increment, replaces the instant number jump
`animations/celebrations/level-up-transition.json` | 1.2s (36f) | 30 | full-screen, plays on level-up event, replaces the CSS glow-pulse ring
`animations/celebrations/story-completion-celebration.json` | 0.8s (24f) | 30 | plays on story completion screen render, replaces the DOM-div confetti + bouncing emoji frog
`animations/transitions/flashcard-flip.json` | ~0.35s (10f) | 30 | plays on `flipCard()`, replaces the hard content swap — no flip transform exists today
`animations/transitions/page-turn.json` | 0.3s (9f) | 30 | plays on reader next/previous (button tap or swipe once gesture support is added — none exists today)
`animations/transitions/word-highlight-reveal.json` | 0.4s (12f) | 30 | plays on word tap, replaces the plain modal fade-in
`animations/idle/streak-flame-idle.json` | loops | 30 | continuous idle loop wherever the streak flame is visible on-screen; static `streak-flame.svg` is the poster frame before JS/Lottie loads

All Lottie files are shape-layer only (no images, no embedded fonts), 1–3
layers each, 30fps — built to stay lean over low-bandwidth connections and
hold 30+ fps on iPad.

## Touch targets (iPad landscape, ≥60px)

Apply to every icon-based control, not just nav: **wrap each icon in a
tappable container of at least 60×60px**, with the icon itself rendered
smaller inside it (glyph size guidance above) and centered. Concretely:
- Nav bar tabs / player controls: 60×60px hit area, 28–32px icon centered (≥14px padding on all sides)
- Inline status icons (check/lock inside a list row): the icon can render at 24px, but if it's independently tappable (e.g. a locked-card overlay) it still needs a 60×60px tap zone, not a 24×24 one
- Badge gallery tiles: the whole tile (not just the badge glyph) is the tap target, so 56px badge art is fine as long as the tile itself is ≥60×60px

## Implementation checklist
- [ ] Repoint `--primary` to `#72C93A`; audit remaining hardcoded `#bada55` references
- [ ] Swap Nunito/Nunito Sans → Glacial Indifference (body) / Baloo 2 (headings) app-wide
- [ ] Replace the ~45 emoji-based components per the mapping above
- [ ] Add `lottie-web`; wire each animation to its trigger per the table
- [ ] Recolor `badge-unlock.json` per-badge at runtime rather than forking files
- [ ] Add swipe/gesture handling to the reader (currently button-only) so `page-turn.json` has a gesture trigger, not just button taps
- [ ] Audit all icon-based controls for the 60×60px hit-area minimum — several nav/speak buttons currently measure 36–44px per the audit
- [ ] Confirm `prefers-reduced-motion` fallback (freeze-frame) is extended to every new Lottie trigger — global handling already exists
