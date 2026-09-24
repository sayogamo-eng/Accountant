// Generates the PNG icon set, favicon.ico and default Open Graph image from public/favicon.svg.
// Run after changing the logo: node scripts/generate-icons.mjs
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';

const svg = await readFile('public/favicon.svg');
const png = (size, out) => sharp(svg, { density: 512 }).resize(size, size).png().toFile(`public/${out}`);

await png(192, 'icon-192.png');
await png(512, 'icon-512.png');
await png(180, 'apple-touch-icon.png');

// favicon.ico: a single 32x32 PNG wrapped in an ICO container
const ico32 = await sharp(svg, { density: 512 }).resize(32, 32).png().toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6); header.writeUInt8(32, 7); header.writeUInt8(0, 8); header.writeUInt8(0, 9);
header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12);
header.writeUInt32LE(ico32.length, 14); header.writeUInt32LE(22, 18);
await writeFile('public/favicon.ico', Buffer.concat([header, ico32]));

// 1200x630 Open Graph image: brand mark on the brand navy
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#0d2137"/>
  <rect x="0" y="560" width="1200" height="70" fill="#0f6e66"/>
  <g transform="translate(470 150) scale(6.5)">
    <path d="M11 27V13M17 27v-8M23 27v-5M29 27V16" stroke="#7fd1c7" stroke-width="3" stroke-linecap="round"/>
  </g>
</svg>`;
await sharp(Buffer.from(og)).png().toFile('public/og-default.png');
console.log('icons generated');
