// Post-build: fails when the guide's content changed (e.g. a new tax figure) but the PDF
// was not regenerated. Fix: npm run guide:pdf
import { readFile } from 'node:fs/promises';
import { guideHash, STAMP } from './guide-lib.mjs';

const current = await guideHash();
const stamped = (await readFile(STAMP, 'utf8').catch(() => '')).trim();
if (current !== stamped) {
  console.error('Guide PDF is out of date: the guide content changed since the PDF was generated.\nRun: npm run guide:pdf');
  process.exit(1);
}
console.log('Guide PDF is up to date.');
