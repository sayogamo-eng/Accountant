import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

export const PRINT_HTML = 'dist/guides/self-employed-guide-print.html';
export const PDF = 'public/guides/self-employed-guide.pdf';
export const STAMP = 'public/guides/self-employed-guide.stamp';

/** Hash of the guide's visible text, so a changed figure or sentence marks the PDF stale. */
export async function guideHash() {
  const html = await readFile(PRINT_HTML, 'utf8');
  const main = html.match(/<main[\s\S]*<\/main>/)?.[0] ?? '';
  const text = main.replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return createHash('sha256').update(text).digest('hex');
}
