import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ui = path.resolve(__dirname, '../../packages/ui/src');

export default defineConfig({
  site: 'https://fp.josedomingo.org',
  integrations: [mdx(), sitemap()],
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
