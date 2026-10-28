# AGENTS.md

James Faeldon's personal blog (james.faeldon.com): Astro + MDX, static output, plain scoped CSS,
with the design of the LekoArts minimal blog starter. Netlify builds and deploys every push to
`master`.

## Commands

- `npm ci`: install dependencies. Needs Node 24 (`.nvmrc`); `package-lock.json` is the only
  lockfile.
- `npm run lint`: ESLint (flat config: `@eslint/js`, `typescript-eslint`, `eslint-plugin-astro`)
  then `prettier --check .`. `npm run format` applies Prettier. Lint one file:
  `npx eslint src/lib/posts.ts`.
- `npm run build`: `astro check` (types, including the post frontmatter schema), then
  `astro build` into `dist/`. `npm run dev` serves it with reload, and `npm run preview` serves
  the build.
- `npm run check:urls`: fails if `dist/` lacks a page for any URL in `scripts/expected-urls.txt`,
  the live sitemap as of the move off Gatsby.
- `npm run check:dist`: assertions on the built HTML (the contact form, the service-worker kill
  switch, head tags and JSON-LD, no analytics). Both checks need a fresh `npm run build` first.

There are no unit tests. CI (`.github/workflows/ci.yml`) runs lint, build and both checks on every
push and pull request.

## Architecture

- **Posts** are `blog/YYYY-MM-DD/index.mdx`, loaded as the `posts` content collection
  (`src/content.config.ts`, the frontmatter schema: `date`, `title`, `categories`, optional
  `slug`). Images live in `public/img/` and are referenced as `/img/…`. Prettier ignores `blog/`.
- **URLs** come from `src/lib/posts.ts`: `postPath` is `/` + lodash `kebabCase` of the `slug`
  frontmatter, else the `title`, exactly as the Gatsby site derived it. It also holds the sort
  (newest first), the excerpt, the reading time and the date format.
- **Pages:** `src/pages/[slug].astro` (one per post, prev/next by date), `index.astro`,
  `categories/index.astro`, `categories/[category].astro`, `contact.astro`, `success.astro`, and
  `manifest.webmanifest.ts` (icons resized from `src/favicon.png`).
- **Layout:** `src/layouts/BaseLayout.astro` holds the `<head>` (fonts from `@fontsource`,
  `src/styles/global.css`, and `src/components/SEO.astro` for meta, OG and Twitter tags, the
  canonical link and JSON-LD) and the footer. Site metadata is in `src/config.ts`. The theme
  is CSS custom properties on `:root` in `global.css`.
- **Markdown** runs on the unified processor (`markdown.processor` in `astro.config.mjs`), not
  Astro's default, because only it runs rehype plugins: `rehypeHeadingIds` first, then the
  heading permalink icons. MDX inherits it; plugins passed to `mdx()` are ignored.
- **Netlify:** `netlify.toml` pins the build (`npm run build`, `dist`, Node 24), serves `/sw.js`
  uncached, and redirects `/sitemap.xml` to `/sitemap-index.xml`.
- **Renovate** opens dependency PRs on Monday mornings and automerges non-major ones once CI
  passes.

## Invariants

- **Published URLs don't move.** Never change how slugs are derived (`src/lib/posts.ts`), or a
  published post's `title`/`slug`, without a redirect in `netlify.toml`. Every new post's path
  goes into `scripts/expected-urls.txt`.
- **`master` is production.** Anything merged there deploys immediately; it must lint, build and
  pass both checks.
- **The contact form stays Netlify-detectable.** Keep `name="contact-form"`, `data-netlify`,
  the `bot-field` honeypot, the hidden `form-name` input and `action="/success"` in
  `src/pages/contact.astro`.
- **`public/sw.js` is a kill switch** for the service worker the Gatsby site installed. Keep it,
  served with `Cache-Control: no-cache`, until no visitor could still have the old worker. Never
  register a new service worker at `/sw.js`.
