// Guards the "single source of truth" rule: every tax figure, price and contact detail is
// defined once in src/data/ and must not be typed by hand anywhere else in src/.
// Runs automatically before every build (npm run build).
// Numbers below 1000 are not guarded (too many false positives); add `single-source-ignore`
// in a line comment to exempt an unrelated value that happens to match.
import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

const DATA_FILES = ['src/data/tax.ts', 'src/data/pricing.ts'];
const BUSINESS_FILE = 'src/data/business.ts';
const SCAN_ROOT = 'src';
const SKIP_DIRS = new Set(['src/data']);

const isYear = (n) => n >= 1900 && n <= 2100;
const numbers = new Set();
for (const f of DATA_FILES) {
  const src = (await readFile(f, 'utf8')).replace(/https?:\/\/\S+/g, '');
  for (const m of src.matchAll(/\b\d{1,3}(?:_\d{3})+\b|\b\d{3,}\b/g)) {
    const n = Number(m[0].replace(/_/g, ''));
    if (n >= 1000 && !isYear(n)) numbers.add(n);
  }
}

const business = await readFile(BUSINESS_FILE, 'utf8');
const strings = new Set();
for (const key of ['phone', 'phoneIntl', 'whatsapp', 'email', 'businessId']) {
  const m = business.match(new RegExp(`\\b${key}:\\s*'([^']+)'`));
  if (m) strings.add(m[1]);
}

const patterns = [...numbers].map((n) => ({
  label: String(n),
  re: new RegExp(`(?<![\\d.,_])(?:${n}|${n.toLocaleString('en-US')}|${n.toLocaleString('en-US').replace(/,/g, '_')})(?![\\d_]|,\\d)`),
}));
for (const s of strings) patterns.push({ label: s, re: new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) });

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) { if (!SKIP_DIRS.has(p)) yield* walk(p); }
    else if (/\.(astro|ts|mdx?|js)$/.test(e.name)) yield p;
  }
}

const problems = [];
for await (const file of walk(SCAN_ROOT)) {
  const lines = (await readFile(file, 'utf8')).split('\n');
  let inStyle = false;
  lines.forEach((line, i) => {
    if (/<style[\s>]/.test(line)) inStyle = true;
    if (/<\/style>/.test(line)) { inStyle = false; return; }
    if (inStyle || line.includes('single-source-ignore')) return;
    for (const p of patterns) if (p.re.test(line)) problems.push(`${relative('.', file)}:${i + 1}  "${p.label}" — ${line.trim().slice(0, 100)}`);
  });
}

if (problems.length) {
  console.error('Single-source check failed. These values are defined in src/data/ and must be imported, not typed:\n');
  problems.forEach((p) => console.error('  ' + p));
  process.exit(1);
}
console.log(`Single-source check passed (${patterns.length} values guarded).`);
