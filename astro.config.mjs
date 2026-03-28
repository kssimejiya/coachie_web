import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://coachie-ai.com',
  output: 'static',
  integrations: [
    tailwind(),
    sitemap(),
  ],
  build: {
    assets: 'assets',
    inlineStylesheets: 'always',
  },
  vite: {
    build: {
      cssMinify: true,
    },
  },
  image: {
    domains: ['img.youtube.com'],
  },
  compressHTML: true,
});
