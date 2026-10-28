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

Netlify builds and deploys every push to `master`, and CircleCI checks only lint, so the first
real build of a change is the production one. A post's URL comes from its frontmatter `slug` or,
failing that, its `title`. Editing a title looks like a typo fix and silently breaks every inbound
link and search result for that post.

## Tiers: the overhead control

### Always Tier 2, whatever the size of the diff

- **Slug derivation.** Anything touching `onCreateNode` in `gatsby-node.js`, or a published
  post's `title`/`slug` frontmatter, can move URLs that are already linked from elsewhere.
- **The service worker.** Removing or reconfiguring `gatsby-plugin-offline` leaves returning
  visitors on a cached old site unless it is replaced by `gatsby-plugin-remove-serviceworker`.
- **The contact form.** `src/pages/contact.js` works only while Netlify recognises the form
  (`name="contact-form"`, `data-netlify`, the honeypot, `action="/success"`). A broken form
  fails silently and messages are lost.
- **Gatsby, React or MDX major upgrades.** Renovate leaves majors unmerged on purpose. They
  touch every page and the Node 10 toolchain.

## Where a change is worked: one worktree per change

### What a worktree needs

`node_modules`, which is gitignored. `commands.worktree_setup` runs
`yarn install --frozen-lockfile` in the new worktree. It needs `yarn` on the PATH and a Node
version the locked Gatsby 2 dependencies (notably `sharp`) install under: CI uses Node 10.

## Running the stages

### Stage 1 — Plan → `/sdlc:intent`

#### Push-backs at Stage 1

A new blog post is content, not a change to the site: it is Tier 0, committed directly, unless it
needs a new component or plugin.

### Stage 4 — Test

#### The gate and the slower check

- **Gate (`yarn lint`):** ESLint (airbnb + prettier) over all `.js`/`.jsx`, the same check
  CircleCI runs. It says nothing about whether the site builds.
- **Slower check (`yarn build`):** a full `gatsby build`, the same build Netlify runs. It
  catches broken GraphQL queries, MDX that fails to compile, and missing images. Run whenever
  `src/`, `config/`, `blog/`, `static/`, the `gatsby-*.js` files or the dependencies change.

### Stage 5 — Ship → `/sdlc:ship`

#### The path to users

Every push to `master` deploys: Netlify builds and publishes it to james.faeldon.com within
minutes, with no release step in between. Renovate also automerges non-major dependency PRs
(Mondays, before 8am), and those deploy the same way without passing through this process.

### Stage 6 — Maintain → `/sdlc:health`

#### What the scans watch

No scan is configured.
