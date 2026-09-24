import type { APIRoute } from 'astro';

// AI crawlers are allowed: being cited by AI search is a lead source for a local practice.
// To opt out, add e.g. "User-agent: GPTBot\nDisallow: /".
export const GET: APIRoute = ({ site }) =>
  new Response(
    ['User-agent: *', 'Allow: /', '', `Sitemap: ${new URL('/sitemap-index.xml', site).href}`, ''].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
