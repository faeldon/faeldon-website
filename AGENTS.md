# AGENTS.md

James Faeldon's personal blog (james.faeldon.com): Gatsby 2 + MDX + styled-components, built
from the LekoArts minimal blog starter. Netlify builds and deploys every push to `master`.

## Commands

- `yarn install --frozen-lockfile`: install dependencies (CI uses Node 10; Gatsby 2's `sharp`
  may not install on current Node).
- `yarn lint`: ESLint over all `.js`/`.jsx`. This is the only check CI runs. `yarn lint:fix`
  applies the fixable ones. To lint one file: `yarn eslint src/components/Article.js`.
- `yarn build`: the production `gatsby build` Netlify runs, which catches GraphQL, MDX and image
  errors. `yarn develop` serves it locally.
- `yarn format`: Prettier over the MDX posts.

There are no tests. A green lint run doesn't mean the site builds; run `yarn build` for that.

## Architecture

- **Posts** are `blog/YYYY-MM-DD/index.mdx`, with images alongside. Frontmatter: `date`,
  `title`, `categories`, optional `slug`.
- **`gatsby-node.js`** sets each post's URL in `onCreateNode` (`/` + kebab-cased `slug`, or
  `title` when there's no slug). `createPages` builds one page per post from
  `src/templates/post.js`, with prev/next by date, and one page per category from
  `src/templates/category.js`.
- **`config/index.js`** holds site metadata (title, URL, social handles, the GA ID) and is read
  by `gatsby-config.js`, the SEO component and the pages. `config/theme.js` is the
  styled-components theme, provided in `wrap-root-element.js`.
- **MDX rendering** goes through `wrap-root-element.js`'s `MDXProvider`, which maps code blocks
  to `src/components/Code.js` (prism-react-renderer, with react-live for live examples).
- **Renovate** opens dependency PRs every Monday and automerges the non-major ones.

## Invariants

- **Published URLs don't move.** Never change how slugs are derived, or a published post's
  `title`/`slug`, without a redirect (`static/_redirects`).
- **`master` is production.** Anything merged there deploys immediately; it must lint and build.
- **The contact form stays Netlify-detectable.** Keep `name="contact-form"`, `data-netlify`,
  the honeypot field and `action="/success"`.
- **The service worker is never just removed.** Swap `gatsby-plugin-offline` for
  `gatsby-plugin-remove-serviceworker`, or returning visitors stay on a stale cache.
