# Process

> This repo's answers to the process guide, which the skills read with this file
> (`docs.process.guide` in `sdlc.py config`). Each block here, a heading or a `- **lead**`
> bullet, stands in for the guide's block of the same heading path, or lead, when it holds text of
> its own, and is read after its parent's block there when the guide has none like it. A heading
> with nothing under it only places what follows. Copy any block of the guide here to change it
> for this repo; delete a prompt to keep what the guide says.

## The point of the process

### The failure it stops

A push to `master` that breaks the live site at james.faeldon.com, or moves a published post's URL.

Netlify builds and deploys every push to `master`, so a change CI didn't see go green is tested
first in production. A post's URL comes from its frontmatter `slug` or, failing that, its
`title`. Editing a title looks like a typo fix and silently breaks every inbound
link and search result for that post.

## Tiers: the overhead control

### Always Tier 2, whatever the size of the diff

- **Slug derivation.** Anything touching `postPath`/`postSlug` in `src/lib/posts.ts`, the
  `[slug].astro` route, or a published post's `title`/`slug` frontmatter can move URLs that are
  already linked from elsewhere. `npm run check:urls` catches a moved one; a deliberate move
  needs a redirect in `netlify.toml`.
- **The service worker.** `public/sw.js` unregisters the worker the Gatsby site installed.
  Deleting it, caching it, or registering anything at `/sw.js` can leave returning visitors on
  the old cached site.
- **The contact form.** `src/pages/contact.astro` works only while Netlify recognises the form
  (`name="contact-form"`, `data-netlify`, the honeypot, `form-name`, `action="/success"`). A
  broken form fails silently and messages are lost.
- **Astro or MDX major upgrades.** Renovate leaves majors unmerged on purpose. They touch every
  page and the content collection.

## Where a change is worked: one worktree per change

### What a worktree needs

`node_modules`, which is gitignored. `commands.worktree_setup` runs `npm ci` in the new
worktree. It needs Node 24 (`.nvmrc`), the version CI and Netlify use.

## Running the stages

### Stage 1 — Plan → `/sdlc:intent`

#### Push-backs at Stage 1

A new blog post is content, not a change to the site: it is Tier 0, committed directly, unless it
needs a new component or integration. Its path goes into `scripts/expected-urls.txt` with it.

### Stage 4 — Test

#### The gate and the slower check

- **Gate (`npm run lint`):** ESLint and `prettier --check` over the source, the first step CI
  runs. It says nothing about whether the site builds.
- **Slower check (`npm run build`):** `astro check` (types and the post frontmatter schema),
  then the full static build Netlify runs. It catches MDX that fails to compile, bad
  frontmatter and missing images. Run whenever `src/`, `public/`, `blog/`, `scripts/`, the
  Astro, Netlify or TypeScript config, or the dependencies change. After it,
  `npm run check:urls && npm run check:dist` check the output the way CI does.

### Stage 5 — Ship → `/sdlc:ship`

#### The path to users

Every push to `master` deploys: Netlify builds and publishes it to james.faeldon.com within
minutes, with no release step in between. Renovate also automerges non-major dependency PRs
(Mondays, before 8am), and those deploy the same way without passing through this process.

### Stage 6 — Maintain → `/sdlc:health`

#### What the scans watch

No scan is configured.
