# Inbox

> Where change requests arrive, before anyone decides to act on them. Every entry is a **seed**,
> something a change may grow from, and its tag is its kind: `[idea]` a change someone proposes,
> `[bug]` something already shipped that is broken, `[nit]` a finding `/sdlc:ship` approved
> unfixed. Each is a `## [YYYY-MM-DD-n] [idea] <title>` heading, its id the day it came in and a
> count from `sdlc.py next-entry`, then a few lines on why and where it came from. A `[bug]` has
> `Severity:` (a word from the process doc), `Paths:` and, once confirmed, `Introduced by:
> NNN-slug` lines; a `[nit]` has `Theme:`, `Paths:`, `Cost:`, `Value:` and `Raised by: NNN-slug
> (pass)` lines. A seed that must wait for others carries an `After: <id>, <id>` line. An entry is
> named by its id, written bare, or by its title, quoted. `/sdlc:status` reads the tags and those
> lines to put forward what's next. `/sdlc:intent` promotes a seed into a change, whose type
> (`feature`, `fix`, `refactor`, `docs`, `chore`…, listed in the process doc) its kind suggests,
> and tags an idea `[building]`; that change's commit deletes the entry, and history keeps it. A
> `[seed]` tag, from before ideas had their own, reads as `[idea]`.

## [2026-10-28-1] [nit] A whole Markdown pipeline for one hover icon

The heading permalink icon needs `@astrojs/markdown-remark` and `rehype-autolink-headings`, and moves
MDX off Astro 7's default processor (Sätteri) onto the older unified one. Heading ids, and so deep
links, already worked without it; the icon is the only gain.

Theme: dependencies
Paths: astro.config.mjs, package.json
Cost: S
Value: low
Raised by: 086-replatform-site (cost)

## [2026-10-28-2] [nit] Contact textarea overflows the card on phones

The message textarea is `width: 100%` plus padding, and `box-sizing: inherit` has no `border-box`
root, so at 390px it runs past the card's right edge. Carried over from the Gatsby site as it was.

Theme: layout
Paths: src/styles/global.css, src/pages/contact.astro
Cost: S
Value: low
Raised by: 086-replatform-site (correctness)

## [2026-10-29-1] [nit] JSON maps post not yet seen at phone width

Change 087's outcome called for the rewritten post to be seen at desktop and phone width, but the
browser window wouldn't shrink, so only desktop was looked at. The maps grid should fall to 2×2 on
a 390px phone; check it on the live site.

Theme: layout
Paths: blog/2026-10-29/index.mdx
Cost: S
Value: med
Raised by: 087-update-json-maps-post (correctness)

## [2026-10-29-2] [nit] Stiff home-page excerpt for the JSON maps post

The index excerpt reads "…down to the barangays. Github Project I first wrote this post in June
2019…": the link text and the italic note run into the summary. Moving the note below the opening
paragraph, or excluding link-only lines from excerpts, would fix it.

Theme: content
Paths: blog/2026-10-29/index.mdx, src/lib/posts.ts
Cost: S
Value: low
Raised by: 087-update-json-maps-post (correctness)

## [2026-10-29-3] [nit] Confirm 088's fix with a bare main checkout

Remove node_modules from the main checkout, then build in a fresh change worktree; it should pass
with no manual step. 088 proved the fix on a reproduction outside the repo, not in place.

Theme: tooling
Paths: astro.config.mjs
Cost: S
Value: med
Raised by: 088-worktree-build (correctness)
