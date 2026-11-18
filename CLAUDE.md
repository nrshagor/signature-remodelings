# CLAUDE.md — Signature Remodelings website

You are building the website for **Signature Remodelings** (signatureremodelings.com), a client project of HBS (Holistic Business Solution Inc.). The owner of this repo is N R Shagor (HBS CTO). He runs every server command himself.

## Start of every session (do this first, every time)

1. Read this file fully.
2. Read `docs/PROGRESS.md` — current status, last session's notes, blockers, decisions.
3. Read `docs/06-TASKS.md` — find the **next task**: the first task in order whose status is `[ ]` (not started) or `[~]` (in progress) and that is not marked `BLOCKED`. If it is `[~]`, resume it.
4. Read only the other docs that task needs (each task lists them under "Read").
5. Tell the user in 2–4 lines: what was done last, which task you will do now, and any blocker you see. Then start.

## End of every task (always)

1. Run `npm run lint` and `npm run build`. Fix errors you caused. Do not mark a task done if the build fails.
2. Tick the task in `docs/06-TASKS.md` (`[x]`) and add a one-line result under it if useful.
3. Add an entry at the **top** of the log in `docs/PROGRESS.md` (date, task id, what changed, files touched, anything the user must do).
4. Update the "Current status" and "Next task" block at the top of `docs/PROGRESS.md`.
5. Commit locally (see Git rules). Then tell the user what is next.

If a task is blocked (needs client info, a decision, or a server action), mark it `BLOCKED: <reason>` in `06-TASKS.md`, write the question in `PROGRESS.md` under "Open questions", and move to the next unblocked task.

## Document map

| File | What it holds |
| --- | --- |
| `docs/01-PROJECT-BRIEF.md` | Client, goals, audience, scope, what is confirmed vs not |
| `docs/02-TECH-SPEC.md` | Stack, versions, structure, animation policy, SEO, security, browser support |
| `docs/03-CONTENT.md` | All website copy, page by page, with status of each item |
| `docs/04-DESIGN.md` | Visual direction: colors, type, layout, components, motion |
| `docs/05-IMAGES.md` | Every image slot: file name, source, size, alt text |
| `docs/06-TASKS.md` | Ordered task list with acceptance criteria — the work queue |
| `docs/PROGRESS.md` | Session log, status, open questions, decisions |

If two docs disagree, follow this order: the user's latest message > `PROGRESS.md` decisions > `02-TECH-SPEC.md` > other docs. Report the conflict to the user.

## Repo conventions (hard rules)

- **No visible placeholders.** No "Lorem ipsum", "TBD", "[Phone]", fake numbers or fake names on any page. If a piece of content is missing, the component renders nothing for it (or the section is hidden). Missing data lives in `src/content/*` as `undefined`, never as dummy text.
- **No invented facts.** Never write years in business, license numbers, awards, ratings, reviews, testimonials, warranties, team members, prices, profit or sale-price claims unless they appear as CONFIRMED in `docs/03-CONTENT.md`. No investment/return promises for home flipping ("positioned to sell" is the limit).
- **Project privacy:** show projects by city only (e.g. "Carrollton, TX"). Never show street addresses, house numbers or map embeds of client homes.
- **Stock and AI images are never presented as the company's work.** Project pages use only the company's own photos. AI renderings must carry a visible "Design rendering" caption.
- **Older-browser support** is required (see `02-TECH-SPEC.md` → Browser support). No Tailwind. Plain CSS (CSS Modules + global tokens).
- **No new dependencies without asking.** The pre-approved list is in `02-TECH-SPEC.md`. Anything else: ask the user first, explain why, and give the no-dependency alternative.
- **Reuse before you build.** If the user says a pattern already exists in the other HBS repos (`solum-constructions`, `quality-concrete-solution`, `hera-builders`), ask him to point you to it or paste it, and follow it.
- **Ports:** dev `3003`, staging `3104`, production `3204` (pending user confirmation — see PROGRESS.md).
- **Ask before touching the environment.** Never create git worktrees, junctions or symlinks, never use `git stash`, and never delete or reinstall `node_modules` (`npm ci`, `rm -rf node_modules`, etc.) without asking the user first. Explain the plan and wait for his OK.
- **Repo files only.** Do not plan, write or run server commands (Nginx, PM2, certbot, DNS, SSH). Server work happens in a separate chat. If something needs the server, write it in `PROGRESS.md` under "For the server chat".
- **Language:** all code, comments, commit messages and site copy in English.

## Git rules

- Small commits, one per task (or per logical step inside a big task).
- Conventional message style: `feat: home hero section`, `fix: mobile menu focus trap`, `docs: update progress`.
- **No AI or Claude mentions** in commit messages, code comments or the site.
- **Never push, never add or change remotes.** The user pushes.
- Commit messages contain **no** `Co-Authored-By` line, no "Generated with", no mention of Claude, AI or any tool. Plain conventional messages only, e.g. `chore: scaffold Next.js project`.
- The commit author is the user's own git identity (`git config user.name` / `user.email`). Never set or override the author.
- After each commit, run `git log -1 --format=%B` to confirm the message is clean; if anything slipped in, amend it before moving on.
- Never commit `.env*` files except `.env.example`.

## Working style

- Before a big task, write a 3–6 line plan in chat, then build.
- When unsure about content or a business fact: ask, don't guess.
- When a library or API behaves differently from these docs (versions change), check the official docs, follow them, and note the change in `PROGRESS.md`.
- Keep the user informed in short messages: what you did, what's next, what you need from him.
