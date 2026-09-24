// Builds checklist/accountant-site-checklist.json — an import file for the
// Master Website Build Checklist (v3.0). Run: npm run checklist
//
// Item keys follow the checklist app exactly: `${stageId}.${djb2(itemText) in base 36}`.
// The page table is generated from the built site (dist/), so run `npm run build` first.
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { project, marks } from '../checklist/progress.mjs';

const hash = (str) => {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  return h.toString(36);
};

const { stages } = JSON.parse(await readFile('checklist/stages.json', 'utf8'));
const profileLetter = { landing: 'L', corporate: 'C', store: 'S' }[project.data.profile];
const items = {};
const errors = [];

for (const [stageId, { done = [], na = [] }] of Object.entries(marks)) {
  const stage = stages.find((s) => s.id === stageId);
  if (!stage) { errors.push(`unknown stage "${stageId}"`); continue; }
  for (const [list, state] of [[done, 'done'], [na, 'na']]) {
    for (const text of list) {
      const item = stage.items.find((i) => i.t === text);
      if (!item) { errors.push(`${stageId}: no item "${text}"`); continue; }
      const profiles = item.p || stage.p || 'LCS';
      if (!profiles.includes(profileLetter)) errors.push(`${stageId}: "${text}" is hidden for this site type`);
      if (item.m && project.data.projectKind === 'new') errors.push(`${stageId}: "${text}" is migration-only`);
      items[`${stageId}.${hash(text)}`] = state;
    }
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }

// Page status table, from the built HTML (title = <h1>)
const pages = [];
async function walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p);
    else if (e.name.endsWith('.html')) {
      const html = await readFile(p, 'utf8');
      const url = p.slice('dist'.length).replace(/\.html$/, '').replace(/\/index$/, '/');
      const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1]?.replace(/<[^>]+>/g, '').trim() || url;
      const indexable = !/name="robots" content="noindex, follow"/.test(html);
      // design/SEO are built; content is demo copy awaiting the client; no client approval yet
      pages.push({ name: h1, url, content: false, design: true, seo: indexable, approval: false });
    }
  }
}
await walk('dist');
pages.sort((a, b) => a.url.localeCompare(b.url));

const now = new Date().toISOString();
const state = { version: 3, savedAt: now, data: project.data, items, waiting: {}, pages };
const out = { format: 'websiteBuildChecklist', version: 3, projects: [{ id: project.id, name: project.name, state }] };
await writeFile('checklist/accountant-site-checklist.json', JSON.stringify(out, null, 2) + '\n');

const counts = Object.values(items).reduce((a, s) => ((a[s] = (a[s] || 0) + 1), a), {});
console.log(`checklist written: ${counts.done || 0} done, ${counts.na || 0} n/a, ${pages.length} pages`);
