import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const modulos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content' }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    toc: z.boolean().optional().default(true),
  }),
});

export const collections = { modulos };
