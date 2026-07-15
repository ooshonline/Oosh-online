# Ribbit Reading App — Icon Redesign Brief (v2) + `/design-sync` Process

**Date:** 2026-07-14
**For:** Claude Design (via `/design-sync`)
**Goal:** Redraw the 42-icon set so every glyph reads *instantly* — anchored to the familiar emoji it replaced — while staying one cohesive, custom SVG icon system. Not literal emoji; recognisable, warm, kid-first icons.

---

## Why we're redoing them

The first custom set (the "Balanced, Semi-Geometric" direction) came out too abstract. Several glyphs don't read at a glance — the pond/level icons especially blur into near-identical wave shapes, and the monochrome UI icons feel cold. Kyle's steer: **keep them as real icons, but make each one look like the emoji it replaced.** Emoji are instantly legible to a 5–12 year-old; that legibility is what we want, expressed in a unified custom style rather than 42 unrelated novelty glyphs.

So the north star for each icon is: *"a child should name it in under a second, and it should feel like the same family as every other icon."*

---

## Brand mascot

**Ribbit** is the mascot: a friendly green frog in chunky black rectangular reading glasses — hand-illustrated, warm, a little bookish (the glasses = reading, which is the whole point of the app). Bright leaf-greens with a soft yellow-green belly, golden-yellow eyes, black glasses.

**Reference art:** `assets/brand/ribbit-logo.png` (the canonical logo). This is the brand character everywhere a frog appears:

- **Hero / brand** (landing, splash): use the illustrated logo as-is.
- **Avatar** (header + profile — *currently a plain 🐸 emoji*): produce a **simplified, icon-style Ribbit** — front-facing head-and-shoulders, glasses kept as the signature element — that reads cleanly at 44px. New file: `icons/brand/mascot.svg`.
- **`first-leap` badge**: the frog here should nod to Ribbit (keep the glasses), not a generic frog.

**The frog is the mascot, so keep it out of the level icons.** The Pond level (level 2) is a *water scene*, not a frog — that keeps Ribbit distinct and makes the pond progression read as places, not characters.

---

## THE PROMPT FOR CLAUDE DESIGN (self-contained)

> Redesign the Ribbit Reading App icon set — 42 SVGs across nav, controls, status, levels, XP, and achievement badges, plus one new mascot avatar. Ribbit is an English-reading app for ESL kids aged 5–12; the mascot is **Ribbit** — a friendly green frog in chunky black reading glasses (see *Brand mascot* below) — and the world is pond-themed (Lily Pad → Ocean level progression).
>
> **Direction:** Each icon must read *immediately* as its concept. Use the emoji in the reference table below as the recognisability target for each glyph — match the emoji's silhouette and "read", but redraw it in one unified, custom icon style (do **not** paste or trace actual emoji). Friendly, rounded, confident. Think "the clearest possible version of this idea," not "the most minimal/geometric."
>
> **One cohesive family.** Consistent 2px stroke, rounded caps and joins, consistent corner radius, consistent optical weight, drawn on a 24×24 grid with ~2px padding. A child should see they all belong together.
>
> **Two visual tiers:**
> - **Monochrome UI icons** (nav, controls, status): single-colour line icons. Stroke = `currentColor` (see spec) so the app can tint them. No baked-in fills.
> - **Illustrative icons** (levels, XP, badges): may use flat colour fills from the palette below — these are meant to feel like little collectible emblems. Badges sit on a filled circular token.
>
> **Palette (use tokens, never invent hex):** primary green `#72C93A`, navy ink `#1A3260`, teal `#3FA6A0`, gold `#F0AC3D`, off-white `#FFFDF8`. Level accents follow the pond ramp: Lily-Pad green → Pond teal → Stream gold → River orange → Waterfall red → Ocean purple.
>
> **Deliverable:** one SVG per filename in the table, same folder structure and filenames as the existing set (so the app can drop them in without code changes). See the technical spec for exact SVG requirements.

---

## Per-icon emoji reference

Each row: the file to produce → what it means in the app → the emoji to make it read like.

### `icons/nav/` — monochrome, `currentColor`
| file | meaning | reads like |
|---|---|---|
| `home.svg` | Home tab | 🏠 house |
| `library.svg` | Library tab | 📚 stacked books |
| `flashcards.svg` | Flashcards tab | 🔤 "abc" letter tile |
| `rewards.svg` | Rewards tab | 🏆 trophy |
| `profile.svg` | Profile tab / avatar fallback | 👤 person bust |

### `icons/controls/` — monochrome, `currentColor`
| file | meaning | reads like |
|---|---|---|
| `play.svg` | play audio / start | ▶️ play triangle |
| `pause.svg` | pause | ⏸️ two bars |
| `next.svg` | next page | ⏭️ / → forward |
| `previous.svg` | previous page | ⏮️ / ← back |
| `audio.svg` | read-aloud | 🔊 speaker + sound waves |
| `close.svg` | exit / dismiss | ✖️ close X |

### `icons/status/` — monochrome, `currentColor`
| file | meaning | reads like |
|---|---|---|
| `check.svg` | completed | ✔️ checkmark |
| `lock.svg` | locked | 🔒 padlock |
| `search.svg` | library search | 🔍 magnifying glass |
| `streak-flame.svg` | day-streak counter | 🔥 flame (this one may be 2-tone: flame + navy outline) |

### `icons/levels/` — illustrative, level-accent fills. **Design to the names, not the emoji** (decision below).
A six-step water-body progression, shallow → deep, that must read as **one coherent ramp**. Give each a **distinct silhouette + a scale cue** so a child sees the journey getting bigger. The accent colours already encode order, so the icon carries recognisability, not the ordering.

| file | level (accent) | scene |
|---|---|---|
| `lily-pad.svg` | 1 · Lily Pad (green) | a single calm lily pad, maybe a tiny bud — the smallest scene |
| `pond.svg` | 2 · Pond (teal) | a small enclosed pool with a ripple / lily pad — **not a frog** (that's the mascot) |
| `stream.svg` | 3 · Stream (gold) | a narrow winding channel of water, gentle motion |
| `river.svg` | 4 · River (orange) | a broader winding waterway with banks — clearly bigger than the stream |
| `waterfall.svg` | 5 · Waterfall (red) | water falling vertically over a ledge — a distinctly *vertical* silhouette |
| `ocean.svg` | 6 · Ocean (purple) | a big rolling wave with a horizon line (or sun) — vast, the largest scene |

> **Decision (2026-07-14):** the level *emoji* are an incoherent mix (sprout, frog, wave, landscape, droplet, whale) and don't tell the level story — and 🐸 would collide with the mascot. v1's levels failed because the water shapes were too *similar*, not too unified. So the levels keep the water-body progression from the names and fix distinctness with silhouette + scale cues, rather than chasing the emoji. **Every other icon still follows its emoji.**

### `icons/xp/` — illustrative
| file | meaning | reads like |
|---|---|---|
| `xp-star.svg` | XP counter | ⭐ gold star |

### `icons/badges/` — illustrative, each on a filled circular token, 56px gallery / 96px unlock
| file | achievement | reads like |
|---|---|---|
| `first-leap.svg` | first story | Ribbit the mascot mid-leap (keep the glasses) |
| `skill-star.svg` | first perfect skill | 🌟 glowing star |
| `ten-tales.svg` | 10 stories | 📚 books |
| `century-club.svg` | 100 stories | 💯 hundred |
| `quiz-ace.svg` | 5 perfect quizzes | ⭐ star |
| `world-traveler.svg` | a world destination | 🌍 globe |
| `story-streak.svg` | 3 stories in 7 days | 📖 open book |
| `streak-keeper.svg` | 7-day streak | 🔥 flame |
| `two-week-streak.svg` | 14-day streak | 🗓️ spiral calendar |
| `monthly-marathon.svg` | 30-day streak | 📅 calendar |
| `word-watcher.svg` | 5 flashcards | 🔤 letters |
| `word-collector.svg` | 25 flashcards | 📇 card index |
| `vocabulary-vault.svg` | 50 flashcards | 🗝️ old key |
| `known-master.svg` | 10 known words | 🐝 bee |
| `champion-lily-pad.svg` … `champion-ocean.svg` (6) | level champions | the matching level *scene* (above) on a champion medal/token |

---

## Technical spec (so assets drop straight into the app)

- **Format:** flat SVG, `viewBox="0 0 24 24"`, **no `width`/`height` on the root `<svg>`** (the app sizes them).
- **Stroke:** 2px, `stroke-linecap="round"`, `stroke-linejoin="round"`.
- **Monochrome icons (nav/controls/status):** `stroke="currentColor"`, `fill="none"` (or `fill="currentColor"` for solid glyphs). **Do not hard-code navy.** This is a deliberate fix from the last round — hard-coded `#1A3260` meant the icons couldn't be tinted, so locks went invisible on dark chips and the active nav tab couldn't take its accent colour. `currentColor` fixes that.
- **Illustrative icons (levels/xp/badges):** flat fills from the palette are fine; keep to the token colours.
- **Filenames & folders:** identical to the current set — same 42 paths under `assets/icons/{nav,controls,status,levels,xp,badges}/`. Overwrite in place; don't rename. **Plus one new file:** `assets/icons/brand/mascot.svg` (the simplified Ribbit avatar). The illustrated hero logo stays a raster at `assets/brand/ribbit-logo.png`.
- **Keep lean:** shape/path only, no embedded rasters, no `<style>` blocks, minimal nodes.

---

## The `/design-sync` process (same flow as the original round)

1. **Prep locally.** This brief + the current 42 SVGs in `assets/icons/` are the inputs. Nothing to change in code yet.
2. **Run `/design-sync`.** It connects to the Claude Design project on claude.ai/design (first run may prompt to authorise design-system access, or use `/design-login`).
   - `list_projects` → pick the existing Ribbit icon project, or `create_project` "Ribbit Icon System" if there isn't one.
   - Push the current `assets/icons/**` plus this brief into the project so Claude Design has both the current state and the target.
3. **Claude Design redraws** each icon per this brief on claude.ai/design — same filenames, same folders, new art.
4. **Pull back via `/design-sync`** into `assets/icons/` (review the diff — one component at a time, never a wholesale replace).
5. **Inline into the app.** A code session regenerates the inline `ICONS` registry in `ribbit-reading-app-v3.html` from the new SVGs — **keep every `icon(key,size)` call site unchanged** (the keys map 1:1 to filenames), and apply the audit's `currentColor` rule for the monochrome tier. Also delete the duplicate `assets/UI assets/icons/` if the sync recreates it.
6. **Verify + deploy.** Browser-verify each screen (nav, reader controls, rewards badges, level rail, profile) with a clean console, then ship via the `ribbit-deploy` skill. Deploy the icon change on its own — small, verified, reversible.

---

## Guardrails carried over from the icon audit (don't regress these)

- Monochrome icons use `currentColor`, not hard-coded navy — so they tint correctly (locks on dark chips, active nav accent).
- Control buttons stay at 44px tap targets; the icon glyph inside is smaller and centred.
- The Quests-screen render fix, the a11y `role/aria-label` on state markers, and the button-sizing fixes are independent of the artwork — leave them intact when re-inlining.
