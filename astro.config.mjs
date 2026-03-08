import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.josedomingo.org',
  base: '/pledin',
  integrations: [mdx(), sitemap()],
});