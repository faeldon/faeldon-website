---
id: 086
slug: replatform-site
tier: 2
impact: patch
stage: shipped
created: 2026-10-28
updated: 2026-10-28
shipped: 2026-10-28
idea:
depends_on:
---

# 086 — Replatform the blog so it installs, builds and passes CI

> Stage 1: why this change is worth making, in its originator's words. Read by `/sdlc:spec` at
> Tier 2, or by plan mode at Tier 1; `/sdlc:status` counts the open questions not yet struck.

## Problem

The site hasn't been touched since 2020 and no longer installs or builds on a current machine. It
is Gatsby 2 with the deprecated `gatsby-mdx`, React 16, ESLint 5, and a lockfile that CI installs
on Node 10, which reached end of life in 2021. This machine has Node 24 and no yarn, so neither
`yarn lint` (the sdlc gate) nor `yarn build` can run. That means `/sdlc:ship` can't pass for any
change. CI is CircleCI running lint only, so even when it was green it never proved the site
builds; Netlify's production build on `master` was the first real one. The Google Analytics ID
(`UA-141571270-1`) has done nothing since Universal Analytics shut down in 2023.

Upgrading Gatsby in place means a chain of major upgrades (Gatsby 2→5, `gatsby-mdx` →
`gatsby-plugin-mdx`, MDX 1→2, React 16→18), with a starter's worth of code to carry through each
one. The owner would rather replatform onto something current.

## Outcome

- On a current LTS Node, a clean clone installs from its lockfile, lints, and builds the whole
  site with the repo's documented commands, and `.sdlc/config.toml`'s `check`, `build` and
  `worktree_setup` are updated to those commands.
- A GitHub Actions workflow runs lint and a full build on every push and pull request, and passes
  on `master`. `.circleci/` is removed.
- Netlify builds and serves the new site from `master` at james.faeldon.com.
- All six posts render with their images, code highlighting, and the embedded components
  (`blog/2020-04-12/tableau.js` and the imports in `2019-06-06` and `2019-11-02`).
- Every URL the current site serves still resolves: each post at its title-derived slug, each
  `/categories/<category>` page, `/contact`, `/success`, `/categories`, and the sitemap.
- The contact form still delivers to Netlify Forms.
- Google Analytics is gone: no tracking ID and no GA script.

## Affected

- **Area:** the whole site: build tooling, page and template code, MDX rendering, CI, the Netlify
  configuration.
- **Files & components:** `package.json` and the lockfiles, `gatsby-*.js`,
  `wrap-root-element.js`, `src/` (components, pages, templates, hooks), `config/`, `.eslintrc`,
  `.circleci/`, a new `.github/workflows/`, `renovate.json`, and probably the six
  `blog/*/index.mdx` posts wherever their syntax or imports don't carry over. Also
  `.sdlc/config.toml`, `.sdlc/SDLC.md` and `AGENTS.md`, which describe the Gatsby toolchain.
- **Downstream:** readers of james.faeldon.com and every inbound link or search result pointing
  at a post. Netlify deploys whatever lands on `master`. Renovate opens PRs against the
  dependency set this replaces.
- **Contracts:** all four invariants in `AGENTS.md`: published URLs don't move, `master` is
  production, the contact form stays Netlify-detectable, and the service worker
  (`gatsby-plugin-offline`) is never just removed. Visitors who have it installed need it
  unregistered explicitly, or they stay on a cached copy of the old site.

## Constraints

- No published URL changes. A URL that has to change gets a redirect.
- `master` must lint and build before every push, because Netlify deploys it straight away. The
  replatform lands only once the new site builds in full.
- The contact form keeps working through Netlify Forms, with its honeypot.
- The offline service worker the old site installed is actively unregistered for returning
  visitors.
- The posts' content stays as written. Syntax may change, the words don't.
- Credits for the LekoArts minimal blog design and the MIT licence stay.

## Open questions

- ~~Which platform? Astro, a current Gatsby 5, Next.js static export, Eleventy… Weigh how well it
  handles MDX with embedded components, the Netlify fit, and how little code it needs.~~
  Resolved: Astro 5, static output, with the posts left in `blog/` as a content collection.
- ~~Does the design carry over as it is (styled-components theme, typography, layout), or is a
  close restyle acceptable?~~ Resolved: a faithful recreation in plain CSS, with the theme's
  values copied value for value (R12).
- ~~Is Netlify still building `master` successfully today, or has it been failing since the old
  toolchain aged out? That changes how urgent the cutover is.~~ Resolved: Netlify still serves
  the site (200, via faeldon.netlify.com). The build settings are pinned in `netlify.toml`
  (R15), so the cutover no longer depends on the old UI settings.
- ~~Do the react-live examples and the Tableau and Spotify embeds still work, and are they worth
  keeping?~~ Resolved: the Tableau iframe stays (R6), react-live becomes a static code block
  (R7), and the unused SpotifyPlayer and the broken `tableau.js` are deleted (R11).
- ~~What are the features from the README worth keeping: offline support, the web manifest,
  JSON-LD, OpenGraph and Twitter tags, the sitemap, categories?~~ Resolved: all stay except
  offline support, which is replaced by a kill-switch `sw.js` (R9, R10, R13); Metomic goes with
  GA (R11).
- ~~Should Renovate stay, and with which grouping and automerge rules for the new dependency
  set?~~ Resolved: it stays, with an astro group, automerging non-majors only on green CI (R16).
- ~~yarn or npm? The repo has both a `yarn.lock` and a `package-lock.json`.~~ Resolved: npm,
  with `package-lock.json` as the only lockfile (R1).
