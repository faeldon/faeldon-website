import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import { rehypeHeadingIds, unified } from '@astrojs/markdown-remark'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

// The permalink icon gatsby-remark-autolink-headers put before each heading (GitHub's octicon).
const linkIcon = {
  type: 'element',
  tagName: 'svg',
  properties: { ariaHidden: 'true', focusable: 'false', height: 16, width: 16, viewBox: '0 0 16 16' },
  children: [
    {
      type: 'element',
      tagName: 'path',
      properties: {
        fillRule: 'evenodd',
        d: 'M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z',
      },
      children: [],
    },
  ],
}

export default defineConfig({
  site: 'https://james.faeldon.com',
  output: 'static',
  // Each page at <path>/index.html, as Gatsby built it, so Netlify serves /slug and /slug/ alike.
  build: { format: 'directory' },
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap()],
  // Pin this project's tsconfig. Vite otherwise finds the nearest one per file, and from an sdlc
  // worktree (nested inside the main checkout) that reaches the main checkout's tsconfig.json,
  // whose `extends` fails there unless it has its own node_modules.
  vite: { tsconfig: './tsconfig.json' },
  markdown: {
    shikiConfig: { theme: 'dark-plus' },
    // Astro 7 runs rehype plugins only on the unified processor, which MDX inherits. Heading ids come
    // from Astro's github-slugger, the same ids the Gatsby site used, so deep links hold; they must
    // exist before the autolink plugin runs, so Astro's id plugin goes first.
    processor: unified({
      rehypePlugins: [
        rehypeHeadingIds,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'prepend',
            properties: (heading) => ({
              className: ['anchor'],
              ariaLabel: `${heading.properties.id.replace(/-/g, ' ')} permalink`,
            }),
            content: linkIcon,
          },
        ],
      ],
    }),
  },
})
