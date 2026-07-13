import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const entries = [
  'index.html',
  'cgu',
  'mentions-legales',
  'politique-de-confidentialite',
];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const entry of entries) {
  await cp(path.join(root, entry), path.join(dist, entry), { recursive: true });
}

// Publish everything under public/ at the site root on Vercel.
await cp(path.join(root, 'public'), dist, { recursive: true });

console.log('Built static site into dist/');
