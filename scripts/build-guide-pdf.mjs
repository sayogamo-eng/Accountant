// Renders the lead-magnet PDF from the built print page: npm run guide:pdf
// (builds the site first, then prints dist/guides/self-employed-guide-print.html to public/guides/).
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { chromium } from 'playwright';
import { guideHash, PDF, STAMP } from './guide-lib.mjs';

const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.woff': 'font/woff', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const body = await readFile(join('dist', path));
    res.writeHead(200, { 'Content-Type': types[extname(path)] ?? 'application/octet-stream' }).end(body);
  } catch { res.writeHead(404).end(); }
}).listen(0);
const { port } = server.address();

const launchOpts = process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {};
const browser = await chromium.launch(launchOpts);
const page = await browser.newPage();
await page.goto(`http://localhost:${port}/guides/self-employed-guide-print.html`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await mkdir('public/guides', { recursive: true });
await page.pdf({ path: PDF, format: 'A4', printBackground: true, preferCSSPageSize: true });
await browser.close();
server.close();

await writeFile(STAMP, (await guideHash()) + '\n');
console.log(`PDF written: ${PDF}`);
