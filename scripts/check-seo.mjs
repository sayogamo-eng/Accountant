// Post-build SEO check against the keyword map in src/data/seo.ts. Runs after `astro build`.
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

process.removeAllListeners('warning');
const { keywordMap } = await import('../src/data/seo.ts');
const city = (await readFile('src/data/business.ts', 'utf8')).match(/searchName:\s*'([^']+)'/)[1];
const norm = (s) => s.replace(/&quot;|״/g, '"').replace(/&#39;|׳/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const kw = (s) => norm(s.replaceAll('{city}', city));

const pages = {};
async function walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p);
    else if (e.name.endsWith('.html')) {
      const html = await readFile(p, 'utf8');
      if (/name="robots" content="noindex, follow"/.test(html)) continue; // page-level noindex (404, thank-you); the site-wide block uses "noindex, nofollow"
      const url = p.slice('dist'.length).replace(/\.html$/, '').replace(/^\/index$/, '/');
      pages[url] = {
        title: norm(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? ''),
        description: norm(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? ''),
      };
    }
  }
}
await walk('dist');

const errors = [];
const seen = new Map();
for (const [url, e] of Object.entries(keywordMap)) {
  if (!pages[url]) errors.push(`${url}: in keyword map but not an indexable page`);
  const k = kw(e.primary);
  if (seen.has(k)) errors.push(`${url}: primary keyword "${k}" already used by ${seen.get(k)}`);
  seen.set(k, url);
  if (pages[url] && !pages[url].title.includes(k)) errors.push(`${url}: <title> "${pages[url].title}" does not contain "${k}"`);
}
for (const url of Object.keys(pages)) if (!keywordMap[url]) errors.push(`${url}: indexable page missing from keyword map`);
for (const field of ['title', 'description']) {
  const byValue = new Map();
  for (const [url, p] of Object.entries(pages)) {
    if (!p[field]) errors.push(`${url}: empty ${field}`);
    if (byValue.has(p[field])) errors.push(`${url}: duplicate ${field} with ${byValue.get(p[field])}`);
    byValue.set(p[field], url);
  }
}

if (errors.length) {
  console.error('SEO check failed:\n' + errors.map((e) => '  ' + e).join('\n'));
  process.exit(1);
}
console.log(`SEO check passed (${Object.keys(pages).length} indexable pages, unique primary keywords, titles and descriptions).`);
