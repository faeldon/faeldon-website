# Review

> This repo's additions to the review guide, which `/sdlc:ship` reads with this file
> (`docs.review.guide` in `sdlc.py config`). Each block here, a heading or a `- **lead**` bullet,
> stands in for the guide's block of the same heading path, or lead, when it holds text of its
> own, and is read after its parent's block there when the guide has none like it. A heading with
> nothing under it only places what follows.

## Pass 1 — Correctness

### The ways this repo's code fails

- **Lint left for CI.** Five commits in the history only fix lint errors after the fact. Every
  change has to pass `npm run lint` before it lands, not after.
- **Slugs that move.** Custom slugs have been overwritten by title-derived ones before (upstream
  #68). Check that any change near `src/lib/posts.ts` or post frontmatter keeps every existing
  URL, and that `npm run check:urls` still lists them all.
- **Third-party scripts that misbehave.** The Metomic cookie-consent prompt kept reappearing
  (#5) and needed lint fixes of its own. A script added through `src/layouts/BaseLayout.astro`
  or `src/components/SEO.astro` needs checking on a real page load, not just a build.
- **Broken external links.** The ko-fi and funding links have each needed fixing. Check that a
  changed URL in `src/config.ts`, the footer or `FUNDING.yml` actually resolves.
