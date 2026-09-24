// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { appendFile } from 'node:fs/promises';
import { allowIndexing } from './src/data/site.ts';

// Adds a site-wide X-Robots-Tag header (Cloudflare Pages / Netlify _headers) while indexing is blocked.
const noindexHeader = {
  name: 'noindex-header',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      if (!allowIndexing) await appendFile(new URL('_headers', dir), '\n/*\n  X-Robots-Tag: noindex, nofollow\n');
    },
  },
};

// The production domain. Replace per client before launch (also used for canonical, OG and sitemap).
const SITE_URL = process.env.SITE_URL || 'https://www.example-cpa.co.il';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    mdx(),
    noindexHeader,
    sitemap({
      filter: (page) => !/\/(thank-you|404)(\.html)?$/.test(page),
    }),
  ],
});
