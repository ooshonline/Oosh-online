# Ribbit — Monetisation & Deployment Plan

**Written:** 2026-08-04
**Supersedes:** `Projects/OOSH Online/ribbit-monetisation-brief.md` (2026-08-02) — see the correction below.
**Decisions taken as given:** B2C first, school/juku licensing second · web app now, native later · zero current traffic · heavy build effort available.

---

## 1. The correction that changes everything

The 2 August brief opens by stating the app has "about 64 stories at Level 1" and that "Levels 2–6 are empty shells… containing zero stories." That is wrong, and it is wrong in the direction that matters most.

Counted directly from `ribbit-stories.js`:

| Level | CEFR | Stories | Sub-levels | Avg words |
|---|---|---|---|---|
| 1 Beginner | Pre-A1 | 75 | 10 | 78 |
| 2 Elementary | A1 | 80 | 10 | 192 |
| 3 Pre-Intermediate | A2 | 50 | 10 | 329 |
| 4 Intermediate | B1 | 50 | 10 | 268 |
| 5 Upper-Intermediate | B2 | 50 | 10 | 361 |
| 6 Advanced | C1 | 50 | 10 | 460 |
| **Total** | | **355** | **60** | |

Plus 13 fully-built World Journey destinations (Tokyo through South Korea) at roughly 4 stories each — another ~52 stories.

**The consequence:** the brief's roadmap put six to eight weeks of Level 2 content generation on the critical path before you could charge anyone. That work is already done. There is nothing to write before you can take money. The only thing standing between Ribbit and revenue is plumbing — accounts, entitlement, checkout — and that is a two-to-three week build, not a two-month one.

The brief's price recommendation is also too low, and its "no ads" instinct is correct. Both are addressed below.

---

## 2. Eiken vs CEFR — dual-label, don't replace

Your instinct is right that CEFR means nothing to a Japanese parent. But a straight relabel would over-claim, because the two ladders don't line up the way the app's structure assumes.

The official MEXT/Eiken correspondence table maps grades like this:

| Eiken grade | CEFR | Ribbit level |
|---|---|---|
| 5級 · 4級 · 3級 | A1 | Level 2 |
| 準2級 | A2 | Level 3 |
| 2級 | B1 | Level 4 |
| 準1級 | B2 | Level 5 |
| 1級 | C1 | Level 6 |

Two problems fall out of that. First, three Eiken grades — 5級, 4級 and 3級, which is the entire primary-school journey and the bulk of your market — are compressed into a single CEFR A1 band, which in Ribbit is one level. Second, at the top end the mapping flatters you badly: Level 6's 460-word stories are not Eiken 1級 material, and 1級 is a genuinely formidable adult exam. Labelling Level 6 as 1級 prep would be a claim you cannot support, and Japanese parents in the exam-prep market are unforgiving about that.

There is a more useful insight hiding in this. **Your Japanese primary-age market lives almost entirely in Levels 1–3.** That is 205 stories — 58% of the library — covering pre-5級 through 準2級. Levels 4–6 serve teenagers and adults, which is a different buyer with different motivations. That should shape both the labelling and, later, where you invest in new content.

### What to do

Keep CEFR in the data model; add Eiken as the primary customer-facing label in the Japanese UI. `LEVELS` already carries a `cefr` field and it renders in exactly three places (`lvl-cefr-badge`, the sub-level header meta, and the placement result). Add an `eiken` field alongside it, and have the Japanese UI lead with Eiken while English leads with CEFR. That is a genuinely small change with an outsized effect on conversion, because 英検5級 is a term parents actively search for and A1 is not.

Two rules on wording. Say **「英検◯級の読解レベル相当」** (equivalent to the reading level of Eiken grade X), not 「英検◯級対策」 (Eiken grade X preparation). Ribbit teaches reading, vocabulary and some listening; Eiken from 3級 upward also tests writing and speaking. The weaker claim is honest, still carries the search term, and cannot be thrown back at you in a review. And cap the honest claims at 準2級/2級 — describe Levels 5–6 by what they are (advanced extended reading) rather than by an exam grade they don't prepare anyone for.

Where the granularity should go, later: the interesting content work is not more Level 6, it is splitting the 5級/4級/3級 band across Level 2's ten sub-levels so each Eiken grade gets a visible milestone. That is a repackaging job, not a writing job.

One helpful accident: `ribbit-wordlists.js` was swapped to CEFR-J in July. CEFR-J is a Japanese academic project built specifically for Japanese learners, so the underlying vocabulary grading is already tuned to this market even though the label isn't.

---

## 3. The model: freemium subscription, parent-led

### The principle that keeps it education-first

One rule, and it decides every subsequent question: **gate content breadth, never gate the child's motivation or anything the child has earned.**

XP, badges, streaks, daily and weekly quests, star ratings, the frog life-cycle, saved flashcards, the pond map, the placement test — all of it stays free for everyone, permanently, at every level. A child who cannot pay must never see their streak die, their badge locked, or their progress held hostage. That is the line that separates an educational product from a game with a shop attached, and it is also, practically, the thing that makes teachers and parents willing to recommend you.

What that rules out, explicitly: no ads anywhere in the reading app (the webstore's AdSense is for teachers and adults and should stay separate), no energy or lives systems, no timers, no consumable currency, no loot boxes, no "buy a streak freeze," no countdown-timer discounts, no interstitial upsells mid-story. If Ribbit ever nags a seven-year-old about money, the model has failed.

### Free tier

Level 1 in full — all 75 stories, all ten sub-levels. That is several months of genuine use for a beginner, not a taster. Tokyo, the first World Journey destination. The complete gamification layer. The placement test. Local progress on one device.

Add one deliberate concession: **three stories per week from any level above 1.** A child who places into Level 3 shouldn't hit a wall on their first session, and a weekly trickle lets the family experience the paid content properly before deciding. It costs you almost nothing and it removes the single worst free-tier experience — being placed somewhere you can't go.

### Paid tier — Ribbit プラス

Levels 2–6 unlocked (280 stories), all 13 World Journey destinations, cloud progress sync across devices, a parent progress report, and up to three child profiles on one account. Human-recorded narration joins this list later as the headline quality upgrade.

**No free trial.** Level 1 is the trial, and it is a far more generous one than a 14-day countdown. Adding a card-required trial on top would introduce exactly the pressure tactic the free tier is designed to avoid, and it would undercut the "try it properly, decide when you're ready" positioning that makes this app recommendable.

### Price

Market anchors, all current:

| Product | Japan price |
|---|---|
| NOVA ネイティブKIDS | ¥2,200 / month |
| Lingokids Plus | ~$14.99 / month |
| Raz-Plus (individual) | ~¥37,000 / year (~¥3,100 / month) |
| Raz-Plus (via juku) | ~¥275 / student / month |

**Set by Kyle, 2026-08-04: ¥850/month, or ¥6,800/year (¥567/month effective, 33% off).**

The 2 August brief proposed ¥600–700/month. That is under-priced against every comparable and, more importantly, it signals low value in a category where Japanese parents read price as a quality proxy. ¥850 corrects that while sitting well below NativeKIDS (¥2,200) and Lingokids — the right position for a focused single-purpose reading app from an unknown brand — and leaves room to raise later.

*Noted for a later revisit:* ¥880 would be the closest conventional Japanese price point to this figure — the ¥X80 ending is long-established, 8 is culturally favourable, and it nets marginally more per subscriber at what is effectively the same price to the buyer. ¥850 is a perfectly reasonable price and not worth relitigating now; flagging it only so the option is on record when you next review pricing. Either way, an A/B test is the real answer once there is enough traffic to run one, which there currently isn't.

Present annual as the default with monthly available beside it. Bill in yen.

### School and juku licensing (Phase 3)

¥300/student/month with a ten-student minimum — ¥3,000/month per classroom. That prices just above the Raz-Plus institutional rate of roughly ¥275, which is defensible on the basis that Ribbit is bilingual, Eiken-labelled and built for this market rather than translated into it.

The unlock is not pricing, it is a teacher dashboard: a class code that links students to a teacher view showing last-active date, stories read this week, current level and quiz star averages. That is a modest amount of UI for a large change in what the product *is* — it converts a consumer app into something a juku can put on an invoice.

**Worth flagging, since it cuts against your stated order:** you have zero B2C traffic and direct access to schools. B2B may well produce your first real revenue — not because the deals are large (a ten-student class at ¥3,000/month is only worth about three B2C subscribers) but because the *acquisition* is efficient. One conversation with a juku owner you already know converts a whole classroom; thirty consumer subscribers require thirty separate acts of persuasion through channels you don't yet have. And juku deals scale within the account — a hundred-student school is ¥30,000/month from the same single relationship. I'd still build B2C first — the account system is a prerequisite for both, and the consumer product is the stronger long-term asset — but I would not be surprised if the first invoice you send is to a school, and I'd sell into your own network in parallel rather than waiting for Phase 3.

---

## 4. Technical architecture

### Don't rebuild it

Ribbit is a single 3,168-line HTML file with no build step, no framework, and one `state` object persisted to twenty `rbt_*` localStorage keys. That architecture is an asset, not a liability — it is why an automated hour-long session can ship a verified feature five days a week. Porting it into the Next.js webstore would destroy that and buy nothing.

Add auth and payments *to* the static app instead. Supabase's JS client loads fine from a CDN with no build step.

### Reuse what already works

The `oosh-online` project already has a working Supabase project, Stripe account, webhook endpoint (`src/app/api/webhooks/stripe`), and the environment plumbing for all of it — and that Stripe integration has been debugged the hard way, including the API-version bug on `current_period_end`. Reuse the same Supabase project and Stripe account with new tables and new price IDs. Keep the two products' *catalogues* and marketing entirely separate, as the earlier brief correctly argued, but share the infrastructure.

### The pieces

**Auth.** Supabase magic link, same pattern as the webstore's `/login`. Parent creates the account; child profiles are rows the parent owns. Do not ask children for email addresses.

**Entitlement.** A `subscriptions` table with row-level security so a client can read only its own row. The existing Stripe webhook writes to it. The app reads it once on load and caches the result in memory. Server-side truth, no fakeable localStorage flag — the mistake the webstore made in July and has already fixed once.

**Progress sync.** A `progress` table, one JSONB blob per child profile holding the `rbt_*` keys. Keep localStorage as a write-through cache so the app stays fully usable offline and on a flaky school connection; sync on load and on `visibilitychange`. Because state is already a single object with one save function, this is a small, contained change.

**Content gating.** Client-side gating is bypassable by anyone who opens DevTools, and `ribbit-stories.js` currently ships all 355 stories to every visitor. The honest fix is to split it — Level 1 in the public bundle, Levels 2–6 fetched from a Supabase Edge Function that checks entitlement before responding. I would *not* block launch on this. The realistic threat model for a children's reading app is not piracy, and shipping the paywall two weeks earlier is worth more than closing a hole that almost no parent will exploit. Do it in Phase 2, not Phase 1.

**Hosting.** This is the part that must change. GitHub Pages cannot run server code, and `ooshonline.github.io` is not a domain a Japanese parent will hand a credit card to. Move Ribbit to Vercel on a real custom domain. That gets you serverless functions for checkout and entitlement, and a URL that looks like a business. Treat the domain as a conversion feature, not an expense.

### The native path

Capacitor wrapping the same codebase, once web revenue justifies it — not before.

The economics here recently improved a great deal in your favour. Japan's Mobile Software Competition Act took effect on 18 December 2025, and Apple and Google have both restructured accordingly. You can now link out from inside a Japanese iOS app to your own web checkout at a 15% Store Services Commission, or use alternative in-app payments at 21%; Apple's standard IAP rate in Japan also dropped from 30% to 26%. Google charges 10% on auto-renewing subscriptions purchased via link-out. Compared with the old 30%, that materially changes when a native app is worth building — and it means you should keep Stripe as the payment rail and link out, rather than adopting IAP, when you do ship native.

---

## 5. The honest problem: nobody is using it

You said traffic is basically none, and everything above is a toll booth on an empty road. The monetisation build is two to three weeks; the distribution problem is the one that will still be there afterwards. Roughly speaking, this should be a third of your effort and two thirds acquisition, not the reverse.

The awkward part is that your largest existing audience is the wrong one. Penguin English Studio's 450 products sell mainly to American teachers, and Ribbit's buyer is a Japanese parent. Cross-promoting Ribbit inside TpT listings is free and worth doing, but do not expect it to move the needle — the overlap is thin.

The channels that actually match this buyer, in the order I'd attack them:

Your own students and their parents come first, and it is not close. They are real users you can watch, interview, and price against, and a parent who has seen the app in their child's lesson is the warmest lead you will ever get. Get Ribbit into your own classroom and ask ten parents what they would pay.

Japanese-language SEO is the scalable one, and you already own the machine. The `ribbit-weekly-blog` automation is publishing to a Next.js site with a sitemap; repoint it at Japanese Eiken and 多読 keywords — 英検5級 読解, 小学生 英語 多読, おうち英語 — and it becomes a compounding acquisition asset instead of a content exercise. This is the single highest-leverage change available to you that costs no new infrastructure. Note that this is the one recommendation in this document that is *webstore* work rather than app work — the blog lives in the `ribbit-webstore` repo, and it earns its place here purely as a traffic channel pointing at the app.

Juku direct sales runs in parallel, as argued above.

Instagram and YouTube in Japanese are where おうち英語 parents actually congregate, and short clips of a child reading a Ribbit story with the word-tap and audio are natural content. This is a real time commitment, so treat it as a deliberate choice rather than a background task.

---

## 6. Phased plan

**Phase 0 — Positioning (this week, ~1 day).** Add the `eiken` field to `LEVELS`, dual-label the UI (Eiken-led in Japanese, CEFR-led in English), fix the wording to 「読解レベル相当」, and stop claiming exam grades at Levels 5–6. Register the domain. Cheap, and it makes everything after it work better.

**Phase 1 — Take money (weeks 1–3).** Move to Vercel on the custom domain. Supabase magic-link auth with parent accounts and child profiles. `subscriptions` table with RLS, wired to the existing Stripe webhook. Two Stripe prices in yen (¥850 monthly, ¥6,800 annual). Cloud progress sync. A Japanese pricing page, and an upgrade screen that appears only when a free user reaches a locked level — never as an interstitial, never during a story. Ship it.

**Phase 2 — Make it worth paying for (weeks 4–8).** Parent dashboard with a weekly progress email. Split the story bundle behind the entitlement check. Human-recorded narration for Level 1 and Level 2, which is the most visible quality gap against browser TTS and the strongest single argument for the subscription. Multi-profile management.

**Phase 3 — Institutions (weeks 9–14).** Teacher dashboard, class codes, seat-based licensing, invoicing. Sell into your own network first.

**Phase 4 — Native.** Capacitor wrap, link-out to Stripe under the new Japanese rules. Only once web subscribers prove the model.

Throughout: instrument it. You cannot tune a funnel you cannot see, and right now you would not be able to tell a pricing problem from a traffic problem. Vercel Analytics is already in the webstore; add it here, and track placement-test completion, Level 1 completion rate, paywall views, and checkout starts.

---

## 7. What I'd change about the earlier brief

It was right about the freemium shape, right about parent-led accounts, right to keep ads out of the child app, and right that the webstore and the reading app should stay separate product lines on shared infrastructure.

It was wrong that the content doesn't exist — 355 stories do — and that error would have cost you two months of unnecessary work before your first sale. It under-priced the product by about a third. And it treated the app's readiness as the binding constraint when the real one is that nobody knows Ribbit exists.

---

## Sources

- [MEXT — 各資格・検定試験とCEFRとの対照表](https://www.mext.go.jp/b_menu/shingi/chousa/koutou/091/gijiroku/__icsFiles/afieldfile/2018/07/27/1407616_003.pdf)
- [EIKEN Foundation of Japan — Grades overview](https://www.eiken.or.jp/eiken/en/grades/)
- [アプリブ — 子ども向け英語アプリおすすめ（NOVA ネイティブKIDS pricing）](https://app-liv.jp/lifestyle/kosodate/0965/)
- [Lingokids Plus — Pricing & Currency](https://help.lingokids.com/hc/en-us/articles/115005120505-Lingokids-Plus-Pricing-Currency)
- [玄々舎 — Raz-Plus 多読・多聴 (juku vs individual pricing)](https://www.gengensha.jp/course/extensive_reading/)
- [Mirava — App Pricing Guide: Japan Market](https://www.mirava.io/blog/app-pricing-guide-japan)
- [MacRumors — Japan App Store gets alternative marketplaces, third-party payments](https://www.macrumors.com/2025/12/17/japan-app-store-feature-updates/)
- [Xsolla — Japan's Mobile Software Competition Act: what developers should know](https://xsolla.com/blog/mobile-software-competition-act-in-japan-and-what-mobile-game-developers-should-know)
