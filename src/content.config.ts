import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

// Posts stay where they always were: blog/YYYY-MM-DD/index.mdx.
const posts = defineCollection({
  loader: glob({ pattern: '*/index.mdx', base: './blog' }),
  schema: z.object({
    date: z.coerce.date(),
    title: z.string(),
    categories: z.array(z.string()),
    slug: z.string().optional(),
  }),
})

export const collections = { posts }
