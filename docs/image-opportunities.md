# Image opportunities audit (Canva art)

_2026-10-06 · planning only, no images generated, no app code changed._

This audit uses the `canva-image-gen` skill as the rulebook. It covers raster illustrations only:
badges, mascot poses, destination art, app icons and share-card art. It leaves out two things on
purpose. The monochrome UI icon set (`ICONS`, inline SVG with `currentColor`) stays as it is.
Story-page and story-cover illustrations go through `image-pipeline/`. The 20 badges are already
done (`images/badges/`, shipped 2026-10-06), so they aren't listed here.

**How I checked:** I walked `ribbit-reading-app-v3.html` at 375px in light and night themes:
landing, home (streak-share card, week recap, tour overlay), library, celebration, flashcards
(empty state and deck complete), rewards, World Journey (grid, empty state, Tokyo detail), quests,
profile, placement intro, sub-level celebration and the level champion ceremony. I read the reader,
quiz combo overlay, toasts, share-card canvas and the story-complete interstitial in code.

**Reusable patterns already in the code:**
- `badgeArt(b, size)` puts out an `<img>` that falls back to the SVG icon on `onerror`. A
  `destArt()`/`levelArt()` helper copied from it lets art ship one image at a time without
  breaking anything.
- `mascot(px)` (line ~881) is the single helper behind all three mascot empty states. Change it
  once and every one of them gets the art.
- `assets/brand/ribbit-avatar.png` (the illustrated head shown in the header logo) already exists.
  Some spots can use it with **no new Canva image at all**.

**Legend:** Value H/M/L. Effort = images × wiring (S = swap a `src`/emoji for an `<img>` in an
existing slot · M = new helper or CSS · L = async loading, canvas or i18n plumbing).

---

## Priority 1: high value, cheap wiring

### 1. Celebration mascot ("cheer")
- **Where:** story celebration screen, `renderCelebration()` → `.celeb-frog` (96px, bounce + float
  animation). Could also go in the 0.9s `renderStoryComplete()` interstitial (`.sc-emoji` 🌟, 80px).
- **Replaces:** the 🐸 emoji. It's the biggest single emoji in the app and the payoff screen after
  every story. In night mode it sits on a dark background and reads as clip-art.
- **Asset:** mascot pose · `trim` 512 → `images/mascot/mascot-cheer.webp`
- **Scene:** Ribbit jumping with both arms up, holding an open book overhead, a few sparkles around.
- **Images:** 1 · **Value:** H · **Effort:** 1 × S
- **Code:** swaps into the existing slot (replace the emoji in the `<div>` with an `<img>`; the CSS
  animation stays).

### 2. Empty-state mascot ("wave"): also the landing hero
- **Where:** `mascot(px)`, which is used by
  - flashcards empty state, `renderFlashDecks()` (72px)
  - World Journey welcome, `renderWorldGrid()` (56px)
  - Profile "no badges yet", `renderProfile()` (44px)
  - landing page, `renderLanding()` → `.landing-frog` (130px)
- **Replaces:** in the empty states, a flat 24×24 vector frog (`MASCOT_SVG_PATHS`, just a green
  silhouette with glasses). On the landing page, `OOSH_Logo_Square.png`, which shows as a **white
  square box on the dark green landing background**. It's the first thing a new parent sees and it
  looks the least finished of anything in the app.
- **Asset:** mascot pose · `trim` 512 → `images/mascot/mascot-wave.webp`
- **Scene:** Ribbit standing and waving hello with one hand, a small book tucked under the other arm.
- **Images:** 1 (covers 4 spots) · **Value:** H · **Effort:** 1 × S
- **Code:** swap in existing slots. Change `mascot(px)` to return an `<img>` (keep the SVG as the
  `onerror` fallback, the same way `badgeArt` does it) and change the landing `src`. Later, an
  optional `pose` argument lets each empty state get its own pose (see #9).

### 3. Placement intro mascot ("fishing")
- **Where:** Find My Pond, `renderPlacementIntro()` → `.place-frog` (64px, floating).
- **Replaces:** 🐸 emoji. (The Home tile for this feature already uses 🎣, so the fishing idea fits.)
- **Asset:** mascot pose · `trim` 512 → `images/mascot/mascot-fishing.webp`
- **Scene:** Ribbit sitting on a lily pad holding a little fishing rod, looking curious, ripples below.
- **Images:** 1 · **Value:** H (first thing a child sees in the test, so it sets the tone: "this isn't
  a scary test") · **Effort:** 1 × S
- **Code:** swaps into the existing slot.

### 4. Deck-complete mascot ("high five")
- **Where:** `renderFlashComplete()` → `.complete-frog` (52px).
- **Replaces:** 🐸 emoji.
- **Asset:** mascot pose · `trim` 512 → `images/mascot/mascot-cards.webp`
- **Scene:** Ribbit holding up a fanned stack of flashcards with a big proud smile.
- **Images:** 1 · **Value:** M · **Effort:** 1 × S
- **Code:** swaps into the existing slot.

### 5. App icon + favicon
- **Where:** `<head>` of `ribbit-reading-app-v3.html`. There is **no favicon, no
  `apple-touch-icon` and no manifest** today. The browser tab shows a blank page icon, and
  "Add to Home Screen" on iPhone takes a screenshot.
- **Replaces:** nothing (empty).
- **Asset:** app icon · `none` 512 + 192 → `images/app-icon/icon-512.webp`, `icon-192.webp`
  (+ PNG copies: `apple-touch-icon` and most favicon uses want PNG).
- **Scene:** Ribbit's head and shoulders peeking over an open book, on a solid frog-green
  (`#72C93A`) rounded square, with no text.
- **Images:** 1 Canva image (exported at 2 sizes) · **Value:** H (parents install it on the home
  screen; it also shows in every tab and bookmark) · **Effort:** 1 × S
- **Code:** new but tiny, just 2–3 `<link>` tags. A `manifest.webmanifest` is optional and would
  be a separate PWA decision.

### 6. Profile and header avatar (no Canva needed)
- **Where:** `renderProfile()` → `.profile-avatar` (64/90px); `renderHeader()` → `.avatar-btn`
  (52px, top-right on every tabbed screen).
- **Replaces:** 🐸 emoji on a green circle. Meanwhile the header's left-hand logo already shows the
  illustrated `assets/brand/ribbit-avatar.png`, so two different frogs sit side by side in the header.
- **Asset:** none: reuse `ribbit-avatar.png` with the same `object-fit/object-position` the logo uses.
- **Images:** 0 · **Value:** M · **Effort:** 0 × S
- **Code:** swaps into the existing slot.

---

## Priority 2: high value, needs new wiring

### 7. World Journey destination art (13)
- **Where:** `renderWorldGrid()` → `.dest-bg-emoji` (40px emoji at 35% opacity in the corner of a
  110px navy card); `renderWorldDetail()` → `.dest-hero-emoji` (80px at 25% opacity behind the hero),
  plus the emoji before the destination name and the no-stories fallback `.coming-soon-emoji`.
- **Replaces:** emoji per `DESTINATIONS` entry. Five of them are **flag emoji** (India, Mexico,
  Kenya, Italy, South Korea). Flags render as two letters on Windows/Chromebooks, so on school
  devices those cards show "IN", "MX" and so on. The other emoji are a mixed bag (England = 🎡,
  Brazil = 🌿).
- **Asset:** destination · `none` 768 → `images/destinations/dest-<id>.webp`
- **Scenes** (Ribbit with glasses exploring each one, child-friendly and respectful):

  | id | Scene |
  |---|---|
  | tokyo | Ribbit under cherry blossoms with Tokyo Tower and a bullet train behind |
  | australia | Ribbit beside a kangaroo in red outback, with the Sydney Opera House on the horizon |
  | england | Ribbit with a red telephone box and Big Ben, holding a cup of tea |
  | brazil | Ribbit in the green Amazon with a toucan, Sugarloaf Mountain in the distance |
  | egypt | Ribbit on a camel in front of the pyramids, the Nile glinting |
  | china | Ribbit on the Great Wall holding a red paper lantern |
  | india | Ribbit in front of the Taj Mahal with a marigold garland |
  | france | Ribbit at a café table with a croissant, the Eiffel Tower behind |
  | mexico | Ribbit with a colourful papel picado street and a stepped pyramid behind |
  | kenya | Ribbit on the savanna with giraffes and Mount Kilimanjaro on the horizon |
  | italy | Ribbit with a gelato in front of the Colosseum |
  | peru | Ribbit with a llama on a terrace path, Machu Picchu in the mist |
  | south-korea | Ribbit by a palace gate with hanok rooftops and a city skyline beyond |

  Rule for every scene: no writing on flags or signs.
- **Images:** 13 · **Value:** H (World Journey is the most "travel-poster" screen and the one that
  looks emptiest) · **Effort:** 13 × M
- **Code:** new code. Add a `destArt(d)` helper (an `<img>` with emoji fallback, copied from
  `badgeArt`) and change the card CSS so the art fills the card as a cover with a dark gradient
  under the name text. Locked cards already dim to `opacity:.55`; check that it still reads. Ship
  all 13 in one go so the grid doesn't look half-done.

### 8. Habitat scenes for the six levels
- **Where:**
  - Library level cards, `renderLibraryTierLevels()` → `.lvl-cover` (a 20px SVG icon in the
    middle of a 90–118px gradient cover; most of the card is blank)
  - sub-level celebration, `renderSublevelCelebration()` → `.sl-celeb-pond` (96px tile, 48px icon)
  - level champion ceremony, `renderLevelChampionCeremony()` → `.lc-celeb-pond` (72px tile above
    the champion badge)
  - placement result, `renderPlacementResult()` → `.place-frog` (56px icon)
- **Replaces:** the small `lvl-*` SVG level icons floating in big empty gradient boxes.
- **Asset:** a habitat scene. The skill doesn't have this type yet; use the destination template
  and `none` mode at 768 → `images/levels/level-<id>.webp`. The skill's table would need one new
  row.
- **Scenes** (the same habitat journey the champion badges follow, Ribbit in each, tinted toward
  the `LEVELS` colour):
  1. Lily Pad: Ribbit reading on a single big lily pad (`#72C93A`)
  2. Pond: a reedy pond with a dragonfly (`#70C1B3`)
  3. Stream: stepping stones over a little stream (`#F5C842`)
  4. River: a leaf boat drifting down a river (`#F4844A`)
  5. Waterfall: a ledge beside a waterfall with a rainbow in the spray (`#E05C5C`)
  6. Ocean: waves and a lighthouse (`#9B72CF`)
- **Images:** 6 · **Value:** H (the Library is a main tab; the ceremonies are the big moments) ·
  **Effort:** 6 × M
- **Code:** new code. A `levelArt(lv)` helper with fallback to `icon(lv.icon)`, plus cover CSS for
  `.lvl-cover`. The ceremony tiles can take the same image. **Keep the SVG `lvl-*` icons** in the
  small spots (see "Where art would hurt").

### 9. Extra empty-state poses (once #2's helper takes a `pose`)
- **Where:** the `mascot(px)` call sites, each given its own pose:
  - World welcome: "explorer" (Ribbit with a backpack and an unfolded map)
  - Profile no-badges: "hopeful" (Ribbit looking up at an empty medal hook)
  - Flashcards empty: "cards" (reuse #4's image)
- **Replaces:** the shared "wave" image from #2.
- **Asset:** mascot pose · `trim` 512 · **Images:** 2 · **Value:** M · **Effort:** 2 × S
- **Code:** swap in existing slots (pass a pose name to `mascot()`).

### 10. Share-card art (M8 progress / M9 streak)
- **Where:** `generateShareCard(variant)`, a 360×480 canvas, called from `shareProgress()` (Profile
  → Share) and `shareStreak()` (Home streak card).
- **Replaces:** `ctx.fillText('🐸')` at 64px and `ctx.fillText('🔥')` at 72px. Emoji drawn on a
  canvas come out differently on every OS (Apple frog, Google frog, Windows frog), so the card a
  parent sends on LINE won't look the same from one phone to the next. This is the app's
  word-of-mouth surface.
- **Asset:** mascot pose · `trim` 512 → `images/mascot/mascot-share.webp` (Ribbit sitting
  cross-legged reading, proud) and `mascot-streak.webp` (Ribbit holding a little torch flame
  aloft, in the warm orange of the Streak Keeper badge).
- **Images:** 2 · **Value:** M–H · **Effort:** 2 × L
- **Code:** new code. Preload with `new Image()` and `await` `img.decode()` before `drawImage`.
  Same-origin, so the canvas isn't tainted and `toBlob` still works. The 📖🔥💡⭐ in the stat grid
  stay as they are (see "Where art would hurt").

### 11. Home streak-share card
- **Where:** `streakShareCard()` → `.streak-share-flame` (2rem 🔥) on Home after 7/30-day streaks.
- **Replaces:** 🔥 emoji.
- **Asset:** reuse `mascot-streak.webp` from #10 at ~48px.
- **Images:** 0 extra · **Value:** M · **Effort:** 0 × S
- **Code:** swaps into the existing slot (once #10 exists).

### 12. Social link preview (og:image)
- **Where:** `<head>`. There are no `og:` / `twitter:` meta tags. When the share fallback sends the
  URL (`navigator.share({url})`) or a parent pastes the link into LINE, there's no preview image.
- **Replaces:** nothing (empty).
- **Asset:** share-card art at 1200×630. That size isn't in the skill table: generate square,
  then place the art on a 1200×630 Canva page with brand-lime/navy fill. Mode `none`.
- **Scene:** Ribbit reading under a tree with a stack of books, with room on the left for the
  page's own title text (none drawn into the image).
- **Images:** 1 · **Value:** M · **Effort:** 1 × S
- **Code:** new but tiny (meta tags). Needs a PNG/JPG, not only WebP; LINE and some crawlers
  ignore WebP.

---

## Priority 3: nice to have

### 13. Coach-tour step art
- **Where:** `renderTour()` → `.tour-icon` (56px). The icon is pulled from the first word of the
  `tourStep1–3Title` strings (👆 🔊 🏆).
- **Asset:** mascot pose · `trim` 512 × 3: tapping a glowing word on a page, wearing headphones,
  holding a trophy.
- **Images:** 3 · **Value:** L–M (seen once) · **Effort:** 3 × L
- **Code:** new code. Move the emoji out of the EN and JA strings and into an image list keyed by
  step, otherwise the JA titles keep a leading emoji.

### 14. Quiz combo overlay poses
- **Where:** `showComboOverlay()` → `.combo-frog-em` ('🐸', '🐸✨' at a combo of 3+, '😔' when wrong).
- **Asset:** mascot pose · `trim` × 2–3: thumbs-up, sparkling celebration, gentle "try again"
  shrug (never sad or upset).
- **Images:** 3 · **Value:** M · **Effort:** 3 × M
- **Code:** new code. It must be preloaded when the quiz opens, because the overlay only flashes
  for a moment per answer and a lazy load would show a blank space. **Speed risk:** if it slows
  answer → next question at all, keep the emoji. I'd also replace the 😔. A sad face on a wrong
  answer runs against the placement test's "no failing" principle.

### 15. Passport stamps for finished destinations
- **Where:** `renderWorldDetail()` → `.dest-stamp` (currently text, `passportStamped`) and the
  check badge on completed `.dest-card`s.
- **Asset:** badge `circle` 256 × 13: a round ink-stamp design per destination, built from the
  same motif as its destination art.
- **Images:** 13 · **Value:** L–M · **Effort:** 13 × M
- **Code:** new code. Only worth it after #7, and it doubles the destination image count.

### 16. Fallback screens
- **Where:** `renderComingSoon()` → `.coming-soon-emoji` 🚧 (error/unknown-screen fallback);
  home continue card with no story → 🐸 in `.continue-cover` (`renderHomeDash()`).
- **Asset:** reuse `mascot-wave` (#2). **Images:** 0 · **Value:** L · **Effort:** 0 × S
- **Code:** swaps into the existing slots.

---

## Where art would hurt (keep these as they are)

- **Quick-link tiles on Home** (`.ql-icon`: 🎣📚🔤🌍🎯📈🏆, ~20px in tinted squares) and **quest
  rows** (`.quest-icon`: 📖⭐🃏📚🌍🔤). The brief suggested quest icons, but at this size a painted
  illustration turns into a blob. These are UI icons. The right fix is monochrome SVGs in `ICONS`
  (night-mode tintable), not Canva.
- **Small level icons:** library sub-level nodes (18px), sub-level header (22px), Profile level
  pill (18px), `level-row-icon` (20px), the Home journey current node `.jn-current` (🐸 at 18px in a
  46px ring). Keep the `lvl-*` SVGs and emoji here. Watercolour art doesn't read under ~32px.
  (`.jn-current` could take a tight crop of `ribbit-avatar.png` but doesn't need to.)
- **Header stat pills** (streak flame, XP star) are Lottie and SVG with animation. Leave them.
- **Toasts** (XP 500/1000, streak 7/14/30, vocab milestones, all-quests-done). They're short-lived
  text with an emoji; an image would pop in late and push the text around. If milestone art is
  wanted, it belongs in a new milestone modal (a feature decision, not a swap).
- **Share-card stat grid** (📖🔥💡⭐ at 22px on the canvas). Too small; keep it or swap it for the SVG icons.
- **Story covers and story emoji** (continue card, Today's Pick, story modal, `.jstory-cover`) are
  story illustrations and belong to `image-pipeline/`.
- **Lottie celebrations** (story completion, star collection, badge unlock) are already animated.
  Static art there would be a step backward.
- **World passport pill** (🛂 count chip) and **destination vocab buttons** (🔊, ＋/✓). Tiny controls.

**Theme note for all mascot art:** the World pane is always navy (`#0F1D2A`) even in light mode,
and night mode makes every screen dark. Every mascot pose must go through `remove-background` →
`trim` so it never sits in a white box like the current landing logo. Check it on `#0F1D2A`,
`#14231a` and `#FFFDF8`.

**Side finding (not image-related):** on the World Journey grid in light mode, the empty-state title
"Start exploring the world!" is near-invisible. It uses `var(--text)` (`#1A2340`) on the
always-navy `.world-pane`. Worth a one-line CSS fix separately.

---

## Recommended first batch (5 Canva images + 1 free swap)

Every item drops into a slot that already exists. Most wiring is "emoji → `<img>`", with no new
layout.

| # | Asset | File | Lands in | Wiring |
|---|---|---|---|---|
| 1 | Mascot "wave" | `images/mascot/mascot-wave.webp` | landing hero + all 3 `mascot()` empty states | change one helper + one `src` |
| 2 | Mascot "cheer" | `images/mascot/mascot-cheer.webp` | story celebration (+ story-complete interstitial) | emoji → img |
| 3 | Mascot "fishing" | `images/mascot/mascot-fishing.webp` | placement intro | emoji → img |
| 4 | Mascot "cards" | `images/mascot/mascot-cards.webp` | deck complete | emoji → img |
| 5 | App icon | `images/app-icon/icon-512/192` (+ PNG) | favicon + apple-touch-icon | 2–3 `<link>` tags |
| 6 | _(no Canva)_ | `assets/brand/ribbit-avatar.png` | Profile avatar + header avatar button | emoji → img |

That's 5 generations touching 9 visible spots,
including the first screen a parent sees and the screen after every story. **Batch 2** should be
the 13 destinations (#7) in one go, then the 6 habitat scenes (#8). Those two need small new
helpers but give the biggest visual change in the app.
