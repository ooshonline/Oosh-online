# Ribbit Monetisation — Claude Code Handoff Spec

**Written:** 2026-08-04
**Strategy source:** `ribbit-monetisation-plan.md` (same folder) — read it before starting any task here.

## Scope: this is the APP, not the webstore

Every task in this document changes the **Ribbit Reading App**. They are two separate products in two
separate repositories, and no task here touches the webstore's code.

| | Ribbit Reading App — *this work* | Ribbit Webstore — *not this work* |
|---|---|---|
| Folder | `Projects/Ribbit Reading App/` | `Projects/OOSH Online/oosh-online/` |
| Remote | `github.com/ooshonline/Oosh-online` | `github.com/ooshonline/ribbit-webstore` |
| Branch | `master` | `main` |
| Stack | Single-file static HTML/JS, no build | Next.js on Vercel |
| Live file | `ribbit-reading-app-v3.html` | — |
| Buyer | Japanese parents, for their child | Teachers, buying printable PDFs |

The webstore appears in the strategy document in three places only, none of which are app tasks:
as a **source of reusable infrastructure** (its Supabase project, Stripe account, and already-debugged
webhook code), as a thing to deliberately **keep separate** (its AdSense is for adults and must never
reach the child app), and as an **acquisition channel** (its blog automation, retargeted at Japanese
keywords — that is webstore work, tracked separately, not part of the M or S series).

**Correction to `CLAUDE.md`:** it states this repo "also hosts non-Ribbit content (the webstore)."
That is stale — `git ls-files` shows only Ribbit files tracked. The **never `git add -A`** rule still
stands, but for a different reason: seven untracked local files sit in this folder (research notes,
translation scripts, these planning docs) that would be swept into a commit. Stage by name.

---

## Read this first: what can and cannot be automated

The monetisation work splits cleanly in two, and the split matters more than the task list.

**Routine-safe.** Self-contained changes inside `ribbit-reading-app-v3.html`, verifiable in a browser at `localhost:3459`, needing no secrets and no external dashboards. These fit the existing pillar-session pattern exactly — one item per ~1-hour run, browser-verified, committed, deployed. Tasks M1–M6 below.

**Supervised only.** Anything touching Stripe keys, Supabase schema, Vercel environment variables, DNS, or a production cutover. These need Kyle present, and several need Kyle's own hands because they happen in dashboards Claude can't and shouldn't hold credentials for. Tasks S1–S5 below.

This is not caution for its own sake. The July webstore sessions hit safety blocks twice for exactly this class of action — pushing to production and deleting an env var without a fresh explicit instruction — and both blocks were correct. A routine that runs at 7am unattended must not be the thing that rotates a Stripe secret.

**Ordering constraint:** M1 and M2 can start immediately. M3–M6 are UI that *renders* entitlement state and can be built against a stubbed `isSubscribed()` returning a hardcoded value, so they are not blocked by S1–S5. Wire the stub to the real check once S3 lands.

---

## Standing rules for every task here

These are the existing project conventions — they are not new, and they apply unchanged:

- One change per session. Commit it. Don't batch.
- Both `UI_STRINGS.en` **and** `UI_STRINGS.ja` for every user-visible string. No exceptions.
- Extend existing state keys and CSS tokens rather than inventing parallel ones.
- Real data only — never fabricate a number shown to a user.
- Browser-verify before committing: dev server is `.claude/launch.json` → `ribbit-live` on port 3459. Check at 375px width, confirm zero console errors, walk the golden path.
- Bump the `?v=YYYYMMDD` cache-bust on the three `<script>` tags when deploying.
- Stage files by name. Never `git add -A` — this repo also hosts the webstore.
- Update `TODO.md` and `memory.md` with the commit hash when an item ships.

**Two additional rules specific to monetisation work:**

- **Never gate gamification.** XP, badges, streaks, quests, star ratings, the frog life-cycle, the pond map, saved flashcards and the placement test stay free at every level for every user, forever. If a task seems to require locking any of these, the task is wrong — stop and flag it.
- **Never commit a secret.** Keys live in Vercel environment variables and `.env.local` (gitignored). If a task appears to need a key in the HTML file, the only key that ever belongs there is the Supabase *anon* key, which is public by design and safe only because row-level security is enabled. Confirm RLS is on before relying on that.

---

## Routine-safe tasks

### M1 · Eiken dual-labelling

**Why:** Japanese parents search 英検5級, not A1. This is the highest-conversion-per-hour change available and it costs nothing but care in the wording.

**What:** Add an `eiken` field to each entry in the `LEVELS` array (`ribbit-reading-app-v3.html` ~line 730). Render Eiken as the primary label in the Japanese UI and CEFR as primary in English. The `cefr` field stays in the data model untouched — this is additive.

Three render sites, all already located:

| Line | Element |
|---|---|
| ~2114 | `lvl-cefr-badge` on the level card |
| ~2184 | `sublevel-header-meta` |
| ~2452 | `place-result-meta` on the placement result |

**Proposed values — Kyle to sign off before building, as he is the ESL authority here:**

| Level | CEFR | Proposed `eiken` (ja) |
|---|---|---|
| 1 | Pre-A1 | 英検5級 準備レベル |
| 2 | A1 | 英検5級〜4級 |
| 3 | A2 | 英検3級〜準2級 |
| 4 | B1 | 英検2級 |
| 5 | B2 | 上級読解（英検の級付けなし） |
| 6 | C1 | 最上級読解（英検の級付けなし） |

**Critical wording rule:** the label must read 「英検◯級の読解レベル相当」 — equivalent to the *reading level* of that grade — never 「英検◯級対策」. Ribbit teaches reading, vocabulary and some listening. Eiken from 3級 upward also tests writing and speaking, and claiming exam preparation invites a review that says so. Levels 5 and 6 carry no grade claim at all; their content does not support one.

**Acceptance:** all three sites render Eiken-first in Japanese and CEFR-first in English; no string appears without both `UI_STRINGS` entries; placement result reads sensibly for a Level 1 child; 375px clean; zero console errors.

---

### M2 · Entitlement stub and gate helper

**Why:** every other monetisation task depends on one honest answer to "is this user paid?", and building six screens against six ad-hoc checks will produce six bugs.

**What:** Add a single `isSubscribed()` helper plus `canAccessLevel(levelId)` and `canAccessDestination(destId)`. For now `isSubscribed()` returns a value from a dev-only flag so the UI can be built and tested both ways; S3 replaces its body with the real Supabase read and nothing else changes.

Free-tier rules to encode:

- Level 1: always accessible, all ten sub-levels, all 75 stories.
- Levels 2–6: subscriber only, **except** the weekly allowance below.
- Weekly allowance: three stories from any level above 1 per calendar week, tracked in a new `rbt_wkfree` key holding `{weekKey, storyIds[]}`. Reuse the existing ISO-week helper if the quest system already has one — check `rbt_wqp` handling before writing a new one.
- World Journey: Tokyo free; the other twelve destinations subscriber only.
- Everything gamification-related: always free. `canAccess*` must never be consulted for XP, badges, streaks, quests or flashcards.

**Acceptance:** helpers exist and are unit-checkable from the console; toggling the dev flag flips access correctly; the weekly counter resets on a new ISO week and does not leak across weeks; no gamification path calls a gate.

---

### M3 · Upgrade screen

**Why:** the moment a free user meets a locked level is the only place Ribbit should ever mention money.

**What:** A screen shown *only* when a free user taps a locked level or destination. Never an interstitial, never mid-story, never on the home screen, never on a timer.

Content: what they get (280 more stories, 12 more destinations, sync across devices, parent report, up to three children), the two prices, and a clearly visible way to dismiss and carry on with the free tier. The dismiss option must not be a dark-pattern whisper — a child should be able to back out easily.

Wording stays warm and factual. No countdown, no "limited offer", no guilt. If the copy would embarrass you in front of a parent, rewrite it.

**Acceptance:** appears only on locked-content tap; dismisses cleanly back to context; both languages; 375px clean; a free user who never taps a locked level never sees it once.

---

### M4 · Locked-state affordances

**What:** Levels 2–6 and locked destinations need an honest locked state on their cards — the existing `.lvl-card.locked` and `.jn-locked` styles are already there for the sub-level chain and can be extended. Show the weekly free allowance where it applies ("今週あと2話読めます" / "2 free stories left this week") using the real count from `rbt_wkfree`, never a placeholder.

**Acceptance:** locked cards are visually distinct but not punitive; the allowance count is real; tapping routes to M3; both languages.

---

### M5 · Pricing page (Japanese-first)

**What:** A standalone marketing page — not part of the app shell — that a parent can be linked to directly. Japanese primary. Covers what Ribbit is, who it's for, the Eiken reading-level ladder from M1, what's free versus paid, the two prices in yen, and honest answers on cancellation and what happens to a child's progress if a subscription lapses (it stays; Level 1 keeps working).

**Acceptance:** renders standalone; brand fonts and colours; no fabricated testimonials, user counts or claims of any kind; readable on a phone.

---

### M6 · Analytics instrumentation

**Why:** with zero traffic, the first real question will be whether a weak funnel is a pricing problem or a traffic problem, and that is unanswerable without events.

**What:** Vercel Analytics (already proven on the webstore) plus custom events for: placement test completed, first story completed, Level 1 completion, locked-content tap, upgrade screen viewed, checkout started, checkout completed.

**Acceptance:** events fire once each, not on re-render; no personally identifying data on a child ever leaves the device.

---

## Supervised tasks — Kyle present

### S1 · Domain and Vercel migration

GitHub Pages cannot run server code, and `ooshonline.github.io` will not convert a Japanese parent. Register a domain, then create a **new, second Vercel project** from the `ooshonline/Oosh-online` repo, configure DNS, and serve the static app from there.

To be explicit, since the two products share a Vercel account: this is a *separate* project from the webstore's existing `ribbit-webstore` deployment. Different repo, different domain, different environment variables. Do not add the app to the webstore's Vercel project, and do not merge the repos — the app's value is that it has no build step, and folding it into a Next.js project would destroy that.

Keep GitHub Pages live until the new domain is verified working end to end. Do not delete anything on cutover day.

### S2 · Stripe products in yen

Two prices — **¥850 monthly and ¥6,800 annual** (set by Kyle 2026-08-04) — created in the existing Stripe account used by the webstore. New price IDs, new env vars, kept distinct from the webstore's `STRIPE_MONTHLY_PRICE_ID` / `STRIPE_ANNUAL_PRICE_ID`. Kyle creates these in the Stripe dashboard himself.

Note for whoever builds this: the webstore's webhook already hit and fixed the API-version bug where subscription-level `current_period_end` was removed in Stripe API 2025-03-31 and must be read from the subscription *item* instead. Reuse that working code rather than rediscovering the bug.

### S3 · Supabase auth, schema and the real entitlement read

Reuse the existing Supabase project. New tables: `parents`, `child_profiles`, `ribbit_subscriptions`, `ribbit_progress`. Row-level security on all four, verified with a second account before trusting it — RLS is the only thing making the anon key safe to ship.

Magic-link auth following the webstore's `/login` pattern. Parent creates the account; children never supply an email address.

Then replace the body of `isSubscribed()` from M2 with a real read of `ribbit_subscriptions`. Server truth only. The webstore shipped a fakeable localStorage subscription flag in July and had to tear it out — do not repeat it here.

**Known trap:** Supabase Auth's Site URL and Redirect URLs allowlist must be set to the real production domain before the first magic link is sent. The webstore's factory-default `localhost:3000` broke Kyle's own login email and cost a debugging session.

### S4 · Cloud progress sync

One JSONB blob per child profile holding the twenty `rbt_*` keys. localStorage stays as a write-through cache so the app keeps working offline and on school wifi. Sync on load and on `visibilitychange`. Conflict rule: last-write-wins is acceptable here, but a child's completed stories must never be *removed* by a sync — merge completions rather than overwriting them.

### S5 · Content bundle split

`ribbit-stories.js` currently ships all 355 stories to every visitor, so M2's gating is client-side and bypassable via DevTools. The real fix is splitting the bundle — Level 1 public, Levels 2–6 behind a Supabase Edge Function that checks entitlement.

**Deliberately deprioritised.** The realistic threat model for a children's reading app is not piracy, and shipping the paywall weeks earlier is worth more than closing a hole almost no parent will exploit. Do this after the first paying subscribers exist, not before.

---

## Sequencing

**Now, unattended:** M1 → M2 → M4 → M6.
**With Kyle, one sitting each:** S1 → S2 → S3.
**Then unattended:** M3 → M5 wired to the real entitlement check.
**Later:** S4, then S5 once revenue exists.

M3 and M5 are listed late deliberately — they are the screens that mention money, and there is no reason to show a price before checkout can actually take one.

---

## A note on the automation itself

The `ribbit-website-update` routine recorded in `memory.md` as running 7:02am Mon–Fri is **not present in the live scheduled-task list**, and `ribbit-new-destination` is registered but **disabled**. Whatever ran the recent pillar sessions is not currently scheduled, so these tasks will not pick themselves up. Either re-create the routine pointed at this file, or run these as manual Claude Code sessions.

If the routine is re-created, scope it to the M-series only. The S-series must never be handed to an unattended process.
