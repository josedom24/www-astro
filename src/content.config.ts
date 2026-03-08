import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()).optional(),
    excerpt: z.string().optional(),
    cover: z.string().optional(),
    slug: z.string().optional(),
  }),
});

const microblog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/microblog' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog, microblog };