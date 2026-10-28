---
id: 087
slug: update-json-maps-post
tier: 1
impact: patch
stage: shipped
created: 2026-10-29
updated: 2026-10-29
shipped: 2026-10-29
idea:
depends_on:
---

# 087 — Bring the JSON maps post up to date with the repository

> Stage 1: why this change is worth making, in its originator's words. Read by `/sdlc:spec` at
> Tier 2, or by plan mode at Tier 1; `/sdlc:status` counts the open questions not yet struck.

## Problem

`blog/2019-06-09/index.mdx`, "JSON Maps of Philippine Administrative Boundaries", still describes
the project as it was in 2019, and parts of it are now broken:

- Both sample-map links return 404
  (`topojson/provinces/hires/provinces-region-cagayanvalleyregionii.topo.0.1.json` and the Metro
  Manila one). The repository moved its files to `latest/<format>/<level>/<resolution>/`, and the
  3Q 2026 PSGC update renamed files whose codes changed.
- `[Leaflet](www.leafletjs.com)` and `[d3js](www.d3js.org)` have no scheme, so on the live site
  they resolve as relative paths under the post's own URL.
- It says nothing about what the project now is: every feature carries its PSGC code and its
  parents' codes, so the maps join to PSA data; the levels run down to barangays, plus island
  groups; quarterly releases come with SHA256 checksums, with the 2011, 2019 and 2023 vintages
  kept as releases; the boundaries come from `philippines-psgc-shapefiles` and OCHA's COD-AB; and
  republishing them needs a CC BY-IGO credit to NAMRIA and PSA.

This matters more than for an ordinary post. The repository (193 stars, 96 forks) names this post
as its homepage, so it's where people arriving from GitHub land.

## Outcome

- Every link in the post resolves (200) when checked after the build: each GitHub file and
  release link, and Leaflet, MapLibre and d3 with `https://`.
- The post explains what the repository holds today, how to use it (direct `latest/` links versus
  pinned releases), the PSGC conventions a user trips over (codes written as integers, the 3Q 2026
  renames), and the data's sources and the credit it requires. The facts are the repository README
  as of v1.1.0, not memory.
- The four sample SVGs from the repository's `images/` (island groups, regions, the provinces of
  the Negros Island Region, the municipalities and cities of Negros Occidental) are copied into
  `public/img/`, shown in the post with alt text, and credited to NAMRIA and PSA through OCHA's
  COD-AB.
- The frontmatter `date` moves to 2026, so the post heads the index. The `title` is unchanged, and
  `/json-maps-of-philippine-administrative-boundaries` still resolves (`npm run check:urls`).
- Before anything is pushed, the owner has seen the built post at desktop and phone width in a
  local preview and approved it.

## Affected

- **Area:** content, one post.
- **Files & components:** `blog/2019-06-09/index.mdx`, and four new `public/img/` SVGs. Possibly a
  folder rename to match the new date (open question below).
- **Downstream:** readers of james.faeldon.com, and everyone who follows the repository's homepage
  link. Re-dating moves the post to the top of the index and changes the prev/next links on it and
  its neighbours.
- **Contracts:** "Published URLs don't move" (`AGENTS.md`), kept by leaving the title alone.
  Nothing else.

## Constraints

- The title and URL don't change.
- The post stays in the owner's voice, the plain first-person project write-up of the 2019 posts,
  not marketing copy.
- No fact that isn't in the repository or its release notes.
- The CC BY-IGO credit is required wherever the maps' shapes appear (the SVGs).
- Nothing is pushed to `master` until the owner has seen the preview and said go: `master` is
  production.

## Open questions

- ~~Keep the 2019 "Background" story (why the maps were made) as history, or shorten it to a
  paragraph?~~ Resolved: kept, grammar fixed, with one new paragraph on the 2026 rebuild.
- ~~Rename the folder `blog/2019-06-09/` to match the new date? The URL doesn't depend on it, but
  every other post's folder matches its date.~~ Resolved: moved to `blog/2026-10-29/`.
- ~~Which new date exactly: the day it's published, or the v1.1.0 release date (2026-10-28)?~~
  Resolved: the publish day, 2026-10-29; date and folder move if ship is later.
- ~~Should the post embed a live, interactive map, or are the static SVGs enough? An interactive
  map would be the site's first client-side JavaScript.~~ Resolved: static SVGs, four across
  (two on phones); files already preview on GitHub and geojson.io.

## Approach

Rewrite `blog/2019-06-09/index.mdx` from the repository README at v1.1.0, in the voice of the 2019
posts (`file-faeldon-blog-2019-2020` in the wiki gives the register). Keep the title and change the
date. Copy `images/{islandgroups,regions,provinces,municities}.svg` from the repository at its
v1.1.0 tag into `public/img/philippines-json-maps/`, and reference them as `/img/...`. Then
`npm run build`, `npm run check:urls`, `npm run check:dist`, and a link check of every URL in the
post. Then show the owner the page from `npm run preview` in Chrome at 1280px and 390px, and
revise until they approve, before `/sdlc:ship`.
