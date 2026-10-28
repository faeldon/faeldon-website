---
id: 088
slug: worktree-build
tier: 1
impact: none
stage: shipped
created: 2026-10-29
updated: 2026-10-29
shipped: 2026-10-29
idea:
depends_on:
---

# 088 — Let a fresh change worktree build without the main checkout's node_modules

> Stage 1: why this change is worth making, in its originator's words. Read by `/sdlc:spec` at
> Tier 2, or by plan mode at Tier 1; `/sdlc:status` counts the open questions not yet struck.

## Problem

Since 086 replatformed the site onto Astro, `tsconfig.json` (which extends
`astro/tsconfigs/strict`) sits at the root of the main checkout, and every sdlc change worktree
is nested inside that checkout at `.claude/worktrees/NNN-slug/`. Astro's native Vite resolver
loads that parent `tsconfig.json` even from inside the worktree. When the main checkout has no
`node_modules`, its `extends` can't resolve, and `astro sync` fails with
`Tsconfig not found astro/tsconfigs/strict` before it reads a single file. So `npm run build`,
the slower check `/sdlc:ship` runs, fails in every new worktree.

It happened on 2026-10-29 during 087. The post built fine from a copy outside the repo, but ship
stopped at its build step in the worktree until the owner ran `npm ci` in the main checkout by
hand. I reproduced it outside the repo with any parent `tsconfig.json` whose `extends` can't be
resolved from its own folder. Excluding the worktree folder in the parent's `exclude`, or using a
relative `extends` in either file, didn't help.

It works today only because of that manual `npm ci`. A fresh clone, or a cleaned main checkout,
breaks again, and the failure points at the content config, not at the real cause.

## Outcome

- From a main checkout with no `node_modules`, `/sdlc:intent`'s worktree setup produces a worktree
  where `npm run build`, `npm run check:urls` and `npm run check:dist` pass, with no manual step.
- A plain clone (CI, Netlify, a fresh checkout) still installs and builds exactly as before.
- `.sdlc/SDLC.md`'s "What a worktree needs" says what a worktree needs and why, so the next person
  who hits the error finds the cause there.

## Affected

- **Area:** dev tooling: the sdlc worktree setup and the TypeScript config.
- **Files & components:** `.sdlc/config.toml` (`commands.worktree_setup`), possibly
  `tsconfig.json`, and `.sdlc/SDLC.md` (with `AGENTS.md` if the commands change).
- **Downstream:** every future sdlc change in this repo. CI and the Netlify build use a single
  checkout and aren't affected either way. Site readers aren't affected.
- **Contracts:** none. "`master` is production" only in that the fix must not change what CI or
  Netlify run.

## Constraints

- CI and Netlify keep building from a single checkout exactly as now.
- Worktrees stay where sdlc puts them (`.claude/worktrees/`). That's the plugin's convention, not
  this repo's to change.
- `astro check` keeps type-checking with Astro's strict settings.
- No manual step in the change workflow.

## Open questions

- ~~Fix the setup or the config? Either `worktree_setup` also installs `node_modules` in the main
  checkout (simple, but it costs a second `npm ci`, and the main checkout's copy can go stale), or
  the root `tsconfig.json` stops needing a package to resolve. Inlining Astro's strict options
  drifts on upgrades, so it needs a guard.~~ Resolved: neither. `vite: { tsconfig:
  './tsconfig.json' }` in `astro.config.mjs` pins the project's own config. On the reproduction,
  the build fails without it and passes with it.
- ~~Does a stale `node_modules` in the main checkout matter? The parent config only needs `astro` to
  resolve, so probably only if a change removes or renames Astro's tsconfig presets.~~ Resolved:
  moot; the build no longer reads the main checkout's config.
- ~~Is this an Astro or Vite bug worth reporting upstream? A nested project shouldn't load its
  parent's `tsconfig.json`.~~ Resolved: no. Vite documents per-file discovery as the default and
  provides `tsconfig` to override it.

## Approach

Settle the open question in plan mode by testing each option against the reproduction (a parent
checkout with `tsconfig.json` and no `node_modules`, and a child worktree). Prefer the smallest
change that removes the dependency on the main checkout's state. Then rebuild in a fresh worktree
from a main checkout whose `node_modules` has been removed, and update "What a worktree needs" in
`.sdlc/SDLC.md`.
