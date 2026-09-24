import type { APIRoute } from 'astro';
import { business } from '@/data/business';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: business.name,
      short_name: business.shortName,
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      theme_color: '#13304f',
      background_color: '#ffffff',
      display: 'browser',
      lang: 'he',
      dir: 'rtl',
    }),
    { headers: { 'Content-Type': 'application/manifest+json' } },
  );
