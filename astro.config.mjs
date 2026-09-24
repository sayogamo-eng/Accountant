// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// The production domain. Replace per client before launch (also used for canonical, OG and sitemap).
const SITE_URL = process.env.SITE_URL || 'https://www.example-cpa.co.il';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !/\/(thank-you|404)(\.html)?$/.test(page),
    }),
  ],
});
