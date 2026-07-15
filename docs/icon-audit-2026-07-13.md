# Ribbit Reading App — Icon Audit

**Date:** 2026-07-13
**File audited:** `ribbit-reading-app-v3.html`
**Scope:** the new UI icon system (inline `ICONS` SVG registry + `icon()` / `iconOrEmoji()` helpers) and every place icons are rendered.
**Method:** static read of the source + live verification in a browser (local server, real render + screenshots). Findings marked **✅ Confirmed live** were reproduced in the running app, not just inferred from code.

---

## TL;DR

One **critical crash** takes the entire Quests screen down. Beyond that, the "icons covering information" you noticed is real: the audio/speak buttons are sized **60 px** and physically overflow their containers. There's also a systemic colour problem — every icon hardcodes a navy stroke and ignores CSS `color`, so "white icon on dark badge" silently renders as a near-invisible navy icon. Everything below is fixable without touching the icon artwork itself (except the colour fix, which is a find-and-replace in the registry).

**Status key:** ✅ fixed & verified in browser · ⏸️ awaiting your decision

| # | Severity | Issue | Status |
|---|----------|-------|--------|
| 1 | 🔴 Critical | `icon` parameter shadows the global `icon()` → **Quests screen throws and never renders** | ✅ Fixed (param renamed to `emoji`) |
| 2 | 🟠 High | Audio button (60 px) overflows the 52 px audio pill — bulges out top & bottom | ✅ Fixed (button → 44 px) |
| 3 | 🟠 High | Speak / back / exit buttons all 60 px — oversized, crowd adjacent text | ✅ Fixed (all → 44 px) |
| 4 | 🟡 Medium | Icons hardcode `stroke="#1A3260"`, ignore `color` → white-on-dark intents render as invisible navy | ✅ Fixed (13 mono icons → `currentColor`; locks now white) |
| 5 | 🟡 Medium | Mixed emoji + custom SVG across the UI — visually inconsistent | ⏸️ Your call (see below) |
| 6 | 🟡 Medium | Nav icons don't reflect the per-tab accent colour | ✅ Fixed (active tab icon now uses accent) |
| 7 | 🔵 Low | 41 icon `.svg` files on disk are unused; the app inlines everything. Plus a full duplicate folder | ✅ Fixed (verified byte-identical, deleted `assets/UI assets/icons/`; kept `assets/icons/` as source) |
| 8 | 🔵 Low | `status-search` registry entry defined but never used | ✅ Fixed (removed) |
| 9 | 🔵 Low | Icon-only state markers (check / lock) have no text alternative | ⏸️ Optional a11y polish |

> **Fixes verified live:** Quests screen now renders end-to-end (no crash); audio button (44 px) sits inside the pill (52 px); rewards-screen locks render white and visible; active nav icon computes to the tab accent (Home = green `rgb(114,201,58)`), inactive stays navy; all 7 main screens render with a clean console.

---

## 1. 🔴 CRITICAL — Quests screen crashes on render

**✅ Confirmed live.** Calling `renderQuestCards()` throws `TypeError: icon is not a function`, and navigating to the Quests screen (`state.screen='quests'; render()`) throws the same — so `render()` aborts and the screen never updates. The user taps "Quests" and nothing happens.

**Cause.** Both quest renderers declare a local `card` helper whose **second parameter is named `icon`**, shadowing the global `icon()` function. The same template then tries to *call* `icon()` for the completion check:

```js
// ribbit-reading-app-v3.html:1343
const card=(done,icon,text,prog,pct)=>`
  <div class="quest-card${done?' quest-done':''}">
    <span class="quest-icon">${icon}</span>          // icon = the emoji string, e.g. '📖'  ✅ fine
    ...
    <span class="quest-check">${icon('status-check',14)}</span>  // ❌ icon is now a STRING → '📖'(...) throws
  </div>`;
```

`card(q.stories,'📖',…)` passes the emoji `'📖'` in as `icon`, so `icon('status-check',14)` is `'📖'('status-check',14)` → TypeError. Identical bug in `renderWeekQuestCards()` at 1373–1382.

**Fix.** Rename the parameter so it stops shadowing the global. Apply to **both** functions:

```js
const card=(done,emoji,text,prog,pct)=>`
  <div class="quest-card${done?' quest-done':''}">
    <span class="quest-icon">${emoji}</span>
    <div class="quest-body">
      <div class="quest-text">${text}</div>
      ${(!done&&prog)?`<div class="quest-prog">${prog}</div>`:''}
      ${(!done&&pct!==undefined)?`<div class="quest-prog-bar-wrap"><div class="quest-prog-bar-fill" style="width:${pct}%"></div></div>`:''}
    </div>
    <span class="quest-check">${icon('status-check',14)}</span>
  </div>`;
```

No call-site changes needed — the callers already pass positional args.

---

## 2. 🟠 HIGH — Audio button overflows its pill ("covering information")

**✅ Confirmed live** (measured + screenshotted). The reader audio pill is **52 px tall**, but the play/pause button inside it is **60 × 60 px**. The button's circle bulges ~4 px above and below the pill — it visually breaks out of the container and sits over adjacent chrome.

```css
/* ribbit-reading-app-v3.html:392 */
.reader-audio-pill{ ... height:52px; ... }
/* :393 */
.reader-audio-btn{ width:60px;height:60px; ... }   /* ❌ 60 > 52 */
```

**Fix.** Bring the button inside the pill. 44 px is the right size (matches the 44 px min-touch-target used elsewhere, e.g. `.reader-exit-btn`, `.reader-nav-btn`):

```css
.reader-audio-btn{ width:44px;height:44px; ... }
```

(If you want a bigger tap target, raise the pill to `height:60px` instead — but 44 px is the cleaner, consistent choice.)

---

## 3. 🟠 HIGH — Speak / back / exit circles are oversized (60 px)

**✅ Confirmed live.** Several icon buttons are 60 × 60 px while the icon glyph inside them is only 18 px. The result is a big empty circle that dominates rows and crowds the text beside it (word rows, quiz option rows). This is the second half of the "icons covering information" symptom.

| Class | Current | Line |
|-------|---------|------|
| `.word-speak-btn` | 60×60 | 419 |
| `.quiz-option-speak` | 60×60 | 449 |
| `.quiz-exit-btn` | 60×60 | 429 |
| `.flash-back-btn` | 60×60 | 241 |

**Fix.** Standardise icon buttons to **44 px** (still an accessible tap target, ~2× the 18 px glyph):

```css
.word-speak-btn,.quiz-option-speak,.quiz-exit-btn,.flash-back-btn{ width:44px;height:44px; }
```

Check the quiz option row after this change — the speak button sits next to the answer text, and 44 px gives the label noticeably more room.

---

## 4. 🟡 MEDIUM — Icons ignore `color`, breaking white-on-dark

**✅ Confirmed live** (badge-lock is nearly invisible on its dark circle in the render).

Every SVG in the registry hardcodes `stroke="#1A3260"` (navy). Because nothing uses `currentColor`, the CSS `color` property has **no effect** on any icon. Wherever the layout sets `color:white` expecting a white glyph on a dark chip, the icon stays navy and contrast collapses:

- `.badge-lock` — navy lock on `rgba(0,0,0,.45)` → **fails**, barely visible (rewards screen, locked badges). CSS 326.
- `.dest-lock-badge` — navy lock on `rgba(0,0,0,.3)` → poor contrast (world screen). CSS 344.
- `.reader-audio-btn` — `color:white` set (393) but play/pause renders navy.
- `.quiz-option-badge` (correct/wrong states) — expects a white check/cross on green/red; renders navy.

**Fix (root cause).** Make the icons inherit colour, then set `color` per context. In the registry, swap the hardcoded stroke for `currentColor`:

```js
// before
'status-lock': `<svg ... stroke="#1A3260" ...>`,
// after
'status-lock': `<svg ... stroke="currentColor" ...>`,
```

Do this for the monochrome UI icons (nav, controls, status, check, lock). Leave the deliberately multi-colour icons (level ponds, badges, xp star, streak flame — which use specific fills) as-is. Then the existing `color:white` rules "just work", and you can also colour nav icons by accent (see #6). Default the icon container to navy so nothing regresses:

```css
.ico{ color:#1A3260; }   /* add to the existing .ico rule at line 98 */
```

---

## 5. 🟡 MEDIUM — Emoji and custom SVG are mixed inconsistently

The new icon set covers nav, controls, status, levels, badges and XP — but large parts of the UI still use OS emoji, so the app looks half-migrated and renders differently across devices (emoji glyphs vary by OS):

- Quest cards: `📖 ⭐ 🃏 📚 🌍 🔤` (1356–1358, 1386–1388)
- Home quick-link tiles: `🎣 🔁 📚 🔤 🌍 🎯 📈 🏆` (2700–2710)
- Deck icon: hardcoded `🔤` (2293)
- Progress stat tiles: `📖 🔤` (2426–2427)

**Recommendation.** Make a deliberate call rather than leaving it accidental. Either (a) extend the icon set to cover these surfaces for one coherent visual language, or (b) keep emoji intentionally for the playful/quick-link areas and restrict custom SVG to chrome (nav, controls, status). Given this is a kids' reading app, a hybrid is defensible — but decide it, don't let it be an artefact of a partial rollout. `iconOrEmoji()` already supports a graceful mix, so migrating is low-risk and incremental.

---

## 6. 🟡 MEDIUM — Nav icons don't show the active-tab accent

Each nav tab defines an `accent` colour (green/blue/orange/purple/navy, 1803–1807), and the active tab tints its background with it — but the **icon itself stays navy** because of the hardcoded stroke (#4). The active state is weaker than intended.

**Fix.** After the `currentColor` change in #4, colour the active icon:

```js
// :1862 — pass the accent through to the icon wrapper on the active tab
<div class="nav-icon-wrap" style="color:${active?tab.accent:'#1A3260'}">${icon(tab.icon,28)}...</div>
```

---

## 7. 🔵 LOW — The icon `.svg` files on disk are unused (and duplicated)

The app **references no `.svg` file at all** — every icon is inlined in the `ICONS` object (604–647). That means:

- All 41 files under `assets/icons/` (badges, controls, levels, nav, status, xp) are dead assets as far as the running app is concerned.
- There is a **complete duplicate copy** under `assets/UI assets/icons/` (note the space in the path — it would need URL-encoding if ever referenced).

**Risk.** The inline registry can silently drift from the source SVGs, and nobody knows which is authoritative. **Recommendation:** pick one source of truth. If the inline registry is intentional (good for a single-file offline app — no extra requests, no CORS), then treat `assets/icons/` as the *design source* and add a build/export note, and **delete the `assets/UI assets/` duplicate**. If you'd rather load from files, wire `icon()` to reference them — but inlining is the better fit for this single-file architecture, so I'd keep inlining and just de-duplicate.

---

## 8. 🔵 LOW — Dead registry entry

`status-search` (registry 618) is defined but never rendered anywhere (`assets/icons/status/search.svg` likewise unused). Harmless, but remove it or wire up the search UI it was meant for.

---

## 9. 🔵 LOW — Icon-only state markers lack a text alternative

Completion checks (`status-check`) and locks (`status-lock`) convey meaningful state ("story complete", "level locked") purely as decorative `<span class="ico">` glyphs with no accessible text. Interactive buttons are fine (they carry `aria-label`), but these non-interactive status markers are silent to screen readers. **Fix:** add a visually-hidden label, e.g. `<span class="sr-only">Complete</span>` alongside the check, or `aria-label` on the badge element.

---

## Suggested fix order

1. **#1 first** — it's a hard crash and a one-line rename in two functions. Ship it on its own.
2. **#2 + #3** — the button-sizing fixes; they directly resolve "icons covering information" and are pure CSS.
3. **#4 (+ #6)** — the `currentColor` refactor; slightly more involved but fixes contrast systemically and unlocks accent-coloured nav.
4. **#5, #7, #8, #9** — consistency and cleanup; do at leisure.

Every finding above was checked against the running app where observable; the crash (#1), the pill overflow (#2/#3) and the lock contrast (#4) were reproduced live.
