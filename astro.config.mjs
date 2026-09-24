// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { appendFile } from 'node:fs/promises';
import { allowIndexing } from './src/data/site.ts';

// Adds a site-wide X-Robots-Tag header (Cloudflare Pages / Netlify _headers) while indexing is blocked.
/** @type {import('astro').AstroIntegration} */
const noindexHeader = {
  name: 'noindex-header',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      if (!allowIndexing) await appendFile(new URL('_headers', dir), '\n/*\n  X-Robots-Tag: noindex, nofollow\n');
    },
  },
};

// The site's public address (canonical, Open Graph, sitemap, schema). Change to the real domain when one is bought.
const SITE_URL = process.env.SITE_URL || 'https://accountant-8or.pages.dev';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    mdx(),
    noindexHeader,
    sitemap({
      filter: (page) => !/\/(thank-you|guide-download|404)(\.html)?$|\/guides\//.test(page),
    }),
  ],
});
