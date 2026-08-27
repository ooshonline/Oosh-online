# Deploy Pending

**Updated: 2026-08-27**

## Git state
Branch is now clean: rebased local commit `70c7f2a` (illustrations e6–e10) on top of the
remote OOSH attendance commit `3d3b791` that Kyle pushed directly to master. Divergence resolved.
Local is now 1 commit ahead of `origin/master` (the illustrations batch).

## Commits awaiting push (oldest first)

| Commit | Description | Status |
|--------|-------------|--------|
| `91135d7` | feature: G8 — Level Champion ceremony | Code-complete; browser verify required |
| `e22d140` | docs: Cycle 7 Gamification wrap-up | — |
| `dbeb77e` | feature: M4 — free-story count notice + locked state | Code-complete; browser verify required |
| `59e25c3` | docs: Cycle 7 Monetisation wrap-up | — |
| `70c7f2a` | content: illustrations for e6–e10 + reroll1 completions | Kyle's commit — ready to push |

**Total: 5 commits local-only.**

## What Kyle needs to do

1. Open the app in a browser (file:// or local server from this folder).
2. **Verify G8 (Level Champion ceremony):**
   - Navigate home → library
   - In browser console: `state.pendingLevelChampion={lv:1}; state.screen='levelChampion'; render();`
   - Confirm the gold ceremony screen appears, the lily-pad badge shows, "+200 XP Bonus!" is visible, console is clean.
   - Press "Keep Going!" — should return to library.
3. **Verify M4 (free-story pill):**
   - Navigate to Library, confirm blue "📚 3 free stories left this week" pill appears above the level grid.
   - In console: `localStorage.setItem('rbt_wkfree', JSON.stringify({weekKey: Object.keys(JSON.parse(localStorage.getItem('rbt_wqp')||'{}'))[0]||'2026-08-24', storyIds:['s1','s2','s3']})); location.reload();`
   - Library should show red "🔒 No free stories left this week" and L2–L6 cards show lock badge + "Locked" text.
   - Reset: clear localStorage or wait for next week.
4. **If both look correct:** bump `?v=` to `20260827` in the three `<script>` tags, then `git push origin master`.
5. The push will include all 5 pending commits (including the OOSH attendance and illustrations).
