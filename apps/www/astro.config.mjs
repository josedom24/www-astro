import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'url';
import path from 'path';
import { shikiConfig } from '../../packages/ui/src/shiki.config.mjs';
import remarkDirective from 'remark-directive';
import remarkAsides from '../../packages/ui/src/utils/remark-asides.mjs';


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ui = path.resolve(__dirname, '../../packages/ui/src');

export default defineConfig({
  site: 'https://www.josedomingo.org',
  base: '/pledin',
  integrations: [mdx(), sitemap()],
  markdown: { shikiConfig, remarkPlugins: [remarkDirective, remarkAsides] },
  vite: {
    resolve: {
      alias: {
        '@pledin/ui/components': `${ui}/components`,
        '@pledin/ui/layouts':    `${ui}/layouts`,
        '@pledin/ui/styles':     `${ui}/styles`,
        '@pledin/ui/utils':      `${ui}/utils`,
      }
    }
  }
});
