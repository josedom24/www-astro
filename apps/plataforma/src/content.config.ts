import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const cursos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cursos' }),
  schema: z.object({
    title: z.string(),
    permalink: z.string().optional(),
    // Campos opcionales que algunos docs pueden tener
    description: z.string().optional(),
    date: z.string().optional(),
  }),
});

export const collections = { cursos };
