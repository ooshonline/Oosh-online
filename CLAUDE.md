# Ribbit Reading App — How We Work Here

This file is the git + deploy workflow for the Ribbit Reading App. Any Claude session
working on this project should read and follow it. Kyle is newish to git, so this is
written to be followed literally, not interpreted.

---

## Where the app lives (read this first)

There are currently **two folders** for this app, which is a known problem we are fixing:

| | Folder | Git remote | Role |
|---|---|---|---|
| **Working** | `Ribbit Reading App 2/` | none | where edits happen |
| **Deploy** | `Ribbit Reading App/` | `origin → github.com/ooshonline/Oosh-online` (branch `master`) | what goes live |

- **The live app is `ribbit-reading-app-v3.html`.** `index.html` just redirects to it.
  `ribbit-reading-app.html` (no `-v3`) is a retired v1 file — never touch it.
- **Live URL:** https://ooshonline.github.io/Oosh-online/
- Deploying today means copying the changed files from the working folder into the deploy
  folder, committing there, and pushing. **The `ribbit-deploy` skill does this — always use it.**

> **Goal (pending Kyle's go-ahead):** collapse these two folders into one repo with the remote,
> so "deploy" becomes a plain `git push` and the folders can never drift. Until then, follow the
> skill exactly. See the `project_ribbit_deploy_setup` memory for the full background.

---

## The three habits (the important part)

### 1. One Claude session at a time on this project
Running two sessions against the same folder is what tangles the git history — they commit on
top of each other. If you need two things going at once, use a **git worktree** (a separate
folder sharing one repo) rather than a second session in the same folder. If you are a session
and you see uncommitted changes or commits you didn't make appear underneath you, **stop and
tell Kyle** — another session is probably live.

### 2. Commit every finished change, immediately
Committing is cheap and safe; **uncommitted work is the fragile state.** Don't batch commits.
As soon as a change is complete and works, commit it with a clear message. Never leave a session
with meaningful work uncommitted.

Commit message format:
```
[type]: [short description]

[optional: 2–4 bullets for anything non-obvious]
```
Types: `content` (stories/destinations), `fix` (bugs), `feature` (new UI), `style` (visual/CSS),
`docs`.

### 3. Deploy small, often, and only after verifying
A static-site deploy is ~1 minute, free, and a bad one is one `git revert` + push away. So there's
no reason to save changes up — **ship each change once it's verified in the browser.** Never deploy
something you haven't actually watched work in a live preview. Use the `ribbit-deploy` skill; it
includes the browser smoke test as its final step.

**Do not do a weekly "deploy day."** Batching a week of changes makes a broken deploy far harder
to debug and delays every fix. Commit continuously, deploy per-verified-change instead.

---

## Weekly housekeeping (the calm checkpoint — ~10 min)

Not a deploy gate; just a tidy-up so nothing rots:

- [ ] `git status` in both folders — anything uncommitted? Commit or discard it deliberately.
- [ ] `git branch` — delete merged/stale branches; make sure `main`/`master` reflects what's live.
- [ ] Confirm the live site (https://ooshonline.github.io/Oosh-online/) loads and looks right.
- [ ] Update `TODO.md` and the project memory with anything that changed.
- [ ] Note anything half-finished so next week's session has context.

---

## Git cheat-sheet (for Kyle)

Plain-English commands, safe to run any time:

- `git status` — what's changed but not yet committed. Run this constantly; it's read-only.
- `git log --oneline -10` — the last 10 commits (the project's history).
- `git diff` — the exact lines changed since the last commit.
- `git branch` — lists branches; the `*` marks the one you're on.

Undoing things (ask Claude if unsure — some of these lose work):
- **Undo a deploy that went wrong:** `git revert HEAD` then push — makes a new commit that reverses
  the last one. Safe; keeps history.
- **Throw away uncommitted edits to a file:** `git restore <file>` — **destroys** those edits. Only
  when you're sure.

If a push is ever rejected ("non-fast-forward"), it means the remote has commits you don't — run
`git pull origin master` first, then push again.
