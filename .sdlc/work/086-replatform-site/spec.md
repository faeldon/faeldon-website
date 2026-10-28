---
id: 086
slug: replatform-site
kind: spec
created: 2026-10-28
updated: 2026-10-28
---

# 086 — Replatform the blog so it installs, builds and passes CI · spec

> Tier 2 only. Reads from intent.md; read by plan.md. If you can't write a testable requirement
> list, the intent isn't understood yet — go back to Stage 1 rather than designing around the fog.

## Requirements

1. R1. On Node 24, `npm ci && npm run lint && npm run build` succeeds from a clean clone of the
   branch. `package-lock.json` is the only lockfile (`yarn.lock` is deleted), and `.nvmrc` and
   `package.json` `engines` both name Node 24.
2. R2. `.github/workflows/ci.yml` runs `npm ci`, `npm run lint` and `npm run build` on Node 24 for
   every push and pull request, and passes on the branch's last commit. `.circleci/` is deleted,
   and the README's CircleCI badge is replaced with the workflow's.
3. R3. The build output contains a page for every one of the 15 URLs in the live
   `https://james.faeldon.com/sitemap.xml` as of 2026-10-28 (six posts, five category pages,
   `/categories/`, `/contact/`, `/success/`, `/`), at exactly those paths. A committed check script
   (`scripts/check-urls.mjs`, run by `npm run check:urls`) fails if any path is missing.
4. R4. Post URLs are derived as they are today: `/` + lodash `kebabCase` of the frontmatter
   `slug`, else of the `title`. So `GraphX` → `graph-x`, `COVID19` → `covid-19`, and a trailing
   space is dropped. Category URLs are `/categories/` + `kebabCase(category)`.
5. R5. Each post page shows its title, date, categories (linking to their category pages), the
   body with syntax-highlighted code blocks, and prev/next links in date order. The index lists
   every post newest first, and each category page lists its posts.
6. R6. The two images in `blog/2019-11-02` render, served from `/img/descendant-1.png` and
   `/img/descendant-2.png`. The Tableau `<iframe>` in `blog/2020-04-12` is in that post's HTML.
7. R7. The `react-live` block in `blog/2019-06-06` renders as a highlighted static code block.
   The page ships no React and no live editor.
8. R8. `/contact/`'s built HTML has a form with `name="contact-form"`, `data-netlify="true"`,
   `data-netlify-honeypot="bot-field"`, a `bot-field` input, a hidden `form-name` input and
   `action="/success"`. After deploy, a test submission appears in Netlify Forms.
9. R9. `/sw.js` is served, and when a browser that has the old Gatsby service worker installed
   loads it, it unregisters itself, deletes every Cache Storage entry, and reloads open clients.
   No new service worker is registered.
10. R10. Every page has a `<title>`, a meta description, OpenGraph and Twitter tags, a canonical
    URL, and JSON-LD (`WebSite` on the index, `BlogPosting` on posts), built from the values now in
    `config/index.js`. `/sitemap-index.xml` is generated, `/sitemap.xml` redirects to it, and
    `robots.txt` points to it.
11. R11. The built site has no Google Analytics (`UA-141571270-1`, `googletagmanager`,
    `google-analytics`), no Metomic script and no "Manage Cookies" link. `SpotifyPlayer.js`,
    `blog/2020-04-12/tableau.js` and `src/hooks/useBuildTime.js` are deleted.
12. R12. The pages match the current design: header, cards, footer, the `#ff5f5f` primary colour,
    Bitter headings, Open Sans body, and the existing breakpoints. Each page type (index, post,
    category, categories, contact) is compared side by side with the live site at phone and
    desktop width before shipping.
13. R13. The web manifest and favicon are served (`/manifest.webmanifest`, generated from
    `src/favicon.png`), with the name, colours and start URL from `config/index.js`.
14. R14. The words of every post are unchanged. `git diff master -- blog/` shows only the image
    path rewrite in R6 and frontmatter-format or MDX-syntax edits. The README keeps the LekoArts
    credit, and LICENSE is untouched.
15. R15. `netlify.toml` sets `command = "npm run build"`, `publish = "dist"` and
    `NODE_VERSION = "24"`, so the deploy no longer depends on the Netlify UI's old Gatsby settings.
16. R16. `renovate.json` drops the gatsby and @mdx-js groups, adds an `astro` group, and
    automerges non-major updates only once the CI workflow passes.
17. R17. The docs describe the new toolchain: `.sdlc/config.toml` sets `check = "npm run lint"`,
    `build = "npm run build"`, `worktree_setup = "cd {worktree} && npm ci"`, and a `build_when` over
    the new paths; `AGENTS.md`, `.sdlc/SDLC.md`, `.sdlc/REVIEW.md` and the README's commands and
    features list are rewritten to match; no file in the repo mentions Gatsby except history and the
    LekoArts credit.

## Design

**Astro, static output.** Astro 5 with `@astrojs/mdx` and `@astrojs/sitemap`, `output: 'static'`,
`build.format: 'directory'` (each page at `<path>/index.html`, as Gatsby did, so Netlify serves
`/slug` and `/slug/` the same as today) and `trailingSlash: 'ignore'`. `site` is
`https://james.faeldon.com`. There is no adapter: Netlify serves `dist/` as plain files.

**Content stays where it is.** A content collection in `src/content.config.ts` uses the `glob`
loader over `blog/*/index.mdx`, with a schema of `date` (coerced to a date), `title`,
`categories` (string array), and an optional `slug`. The posts don't move. A post's path comes
from `src/lib/slug.ts`, which wraps `lodash/kebabCase`. lodash stays a dependency for that alone,
since an approximate re-implementation is the quickest way to move a URL (R4).

**Pages.** `src/pages/index.astro` lists the posts. `src/pages/[slug].astro` renders one post,
with `getStaticPaths` from the collection sorted by date, which also gives prev and next.
`src/pages/categories/index.astro` lists the categories, and `src/pages/categories/[category].astro`
lists the posts in one. `contact.astro` and `success.astro` port their React counterparts. A
`BaseLayout.astro` holds the `<head>` (`SEO.astro`, which ports `SEO.js` without Helmet or
Metomic) and the footer (the GitHub and Ko-fi links; no Manage Cookies, no Last build).

**Styling.** The styled-components in `src/components/*.js` and `config/theme.js` become
Astro components with scoped `<style>` and one `src/styles/global.css`. The theme's colours,
breakpoints and font sizes become CSS custom properties copied value for value. Fonts come from
`@fontsource/bitter` and `@fontsource/open-sans`, the maintained successors of `typeface-*`.
Nothing in the site ships client JS.

**Code blocks.** Astro's built-in Shiki highlighting replaces prism-react-renderer and
`wrap-root-element.js`. The `react-live` meta on the 2019-06-06 block is ignored, so it renders
as plain `js` (R7).

**Images.** `static/` becomes `public/`. The two `![](img/…)` references become `/img/…`
because Astro resolves a relative path as an import from the post's folder, and the files live
in `public/img/` (R6).

**Config.** `config/index.js` becomes `src/config.ts` with the same keys, minus
`googleAnalyticsID`.

**The old service worker.** `gatsby-plugin-offline` registered `/sw.js`. Browsers check that URL
for updates, so `public/sw.js` becomes a kill switch: on `install` it calls `skipWaiting()`; on
`activate` it deletes every cache, calls `self.registration.unregister()`, and navigates each
client to its own URL. `netlify.toml` serves it with `Cache-Control: no-cache`. This is the
documented way off a Workbox worker; deleting `sw.js` instead leaves the old worker serving the
cached site.

**Netlify.** `netlify.toml` sets the build (R15), the `no-cache` header on `/sw.js`, and a 301
redirect from `/sitemap.xml` to `/sitemap-index.xml`. The contact form is plain HTML in the built
page, which Netlify's deploy-time form detection reads directly, so the client-side registration
Gatsby needed goes away. The hidden `form-name` input stays.

**Tooling.** ESLint 9 flat config (`eslint.config.js`) with `eslint-plugin-astro` and the
recommended TypeScript rules, and Prettier with `prettier-plugin-astro`. `npm run lint` runs
ESLint and `prettier --check`; `npm run format` writes. `npm run build` runs `astro check` and
then `astro build`, so type errors in the frontmatter schema fail the build. The airbnb config is
dropped, since nothing in it applies to `.astro` files.

**CI.** One GitHub Actions job: checkout, `actions/setup-node` with Node 24 and the npm cache,
`npm ci`, `npm run lint`, `npm run build`, `npm run check:urls`.

**Deleted.** `gatsby-*.js`, `wrap-root-element.js`, `src/components/*.js`, `src/pages/*.js`,
`src/templates/`, `src/hooks/`, `config/`, `.eslintrc`, `.circleci/`, `yarn.lock`, the old
`package-lock.json` (regenerated), `SpotifyPlayer.js` and `tableau.js`.

## Contracts touched

- **Published URLs don't move.** Kept by R3 and R4: the same derivation through the same
  function, checked against the live sitemap. Only `/sitemap.xml` moves, behind a 301 to
  `/sitemap-index.xml`.
- **`master` is production.** Kept: the branch merges only once CI is green and the URL check
  passes, and the Netlify build command is pinned in the repo (R15), so the first deploy runs the
  same command CI does.
- **The contact form stays Netlify-detectable.** Kept by R8.
- **⚠ The service worker is never just removed. This invariant changes.** It names
  `gatsby-plugin-offline` and `gatsby-plugin-remove-serviceworker`, and neither exists after this
  change. The new wording: *"`public/sw.js` is a kill switch for the service worker the Gatsby site
  installed. Keep it, served with `Cache-Control: no-cache`, until no visitor could still have the
  old worker. Never register a new service worker at `/sw.js`."* That is an edit to `AGENTS.md`,
  made in this change's diff and approved with it at ship.

## Alternatives rejected

- **Gatsby 5 in place.** It keeps the React and GraphQL code, but goes through four breaking
  majors (Gatsby, MDX, React, styled-components) to end on the same heavy dependency tree that
  aged out this time.
- **Next.js static export.** More framework than six posts need, and it would ship a React
  runtime to every page.
- **Eleventy.** Lighter, but its MDX support is third-party. The posts would become Markdown, and
  the iframe and any future component would need shortcodes.
- **Keeping react-live as an Astro island.** It would put React and a live editor on the page for
  one button. The owner chose a static block.
- **Hard-coding a `slug:` into each post's frontmatter.** It would freeze today's six URLs, but
  every new post would then need a hand-made slug, and the derivation would still be needed.
- **Keeping offline support with a new service worker.** A blog this size gains little from it,
  and a second worker at `/sw.js` would fight the kill switch.
- **yarn.** It isn't installed here, and npm ships with Node. One lockfile, `package-lock.json`.

## Verification

- `npm ci && npm run lint && npm run build && npm run check:urls`, on Node 24 from a clean
  worktree: all four exit 0, and `check:urls` reports 15 of 15 paths present (R1, R3, R4).
- The GitHub Actions run on the pushed branch is green (R2).
- `grep -rE "UA-141571270|googletagmanager|google-analytics|metomic" dist` finds nothing (R11).
- `grep -l 'data-netlify="true"' dist/contact/index.html` matches, and the form's attributes are
  as listed in R8.
- `npm run preview`, then compare each page type side by side with james.faeldon.com at 390px
  and 1280px wide (R5, R6, R7, R12, R13), including the two images and the Tableau embed.
- A Netlify deploy preview of the branch: send one contact submission and see it in Netlify
  Forms (R8); in a browser that has the old site cached, load the preview and confirm in DevTools
  → Application that the service worker is gone and Cache Storage is empty (R9).
- `git diff master --stat -- blog/` and a read of the diff show only R14's allowed edits.
- `grep -rni gatsby --exclude-dir=node_modules --exclude-dir=.git .` finds only the LekoArts
  credit and the `.sdlc/work/` history (R17).
