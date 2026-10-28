import { getCollection, type CollectionEntry } from 'astro:content'
import kebabCase from 'lodash/kebabCase'

export type Post = CollectionEntry<'posts'>

// A post's URL is derived exactly as gatsby-node.js derived it: the frontmatter slug, else the
// title, through lodash's kebabCase. Published URLs depend on this; don't approximate it.
export const postSlug = (post: Post) => kebabCase(post.data.slug ?? post.data.title)

export const postPath = (post: Post) => `/${postSlug(post)}`

export const categoryPath = (category: string) => `/categories/${kebabCase(category)}`

// Newest first, as every allMdx query sorted.
export const getSortedPosts = async () =>
  (await getCollection('posts')).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())

// Plain text of an MDX body, for excerpts and reading time.
const plainText = (body: string) =>
  body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/^#+\s*/gm, '')
    .replace(/[*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

// Like Gatsby's excerpt(pruneLength: 200): cut at a word boundary, then an ellipsis.
export const excerpt = (body: string, pruneLength = 200) => {
  const text = plainText(body)
  if (text.length <= pruneLength) return text
  const cut = text.slice(0, pruneLength + 1)
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`
}

// Gatsby's timeToRead: words outside code at 265 a minute, rounded, never 0.
export const timeToRead = (body: string) =>
  Math.max(1, Math.round(plainText(body.replace(/`[^`]*`/g, ' ')).split(' ').length / 265))

// MM/DD/YYYY, as the formatString the Gatsby queries used. Frontmatter dates are UTC midnight.
export const formatDate = (date: Date) =>
  [date.getUTCMonth() + 1, date.getUTCDate()].map((n) => String(n).padStart(2, '0')).join('/') +
  `/${date.getUTCFullYear()}`
