import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const pages = [
  'index.html',
  'mentions-legales/index.html',
  'cgu/index.html',
  'politique-de-confidentialite/index.html',
];
const failures = [];

for (const page of pages) {
  const html = await readFile(path.join(root, page), 'utf8');
  for (const match of html.matchAll(/(?:src|href|poster)=["'](\/assets\/[^"'?#]+)/g)) {
    const asset = path.join(root, 'public', match[1].slice(1));
    if (!existsSync(asset)) failures.push(`${page}: missing ${match[1]}`);
  }
  if (/cloud\.umami\.is|sibforms\.com\/forms\/end-form\/build\/main\.js/.test(html)) {
    failures.push(`${page}: contains disabled third-party runtime`);
  }
}

const modulesRoot = path.join(root, 'public', 'assets', 'cdn.jsdelivr.net', 'npm', 'three@0.161.0', 'examples', 'jsm');
async function verifyModules(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await verifyModules(file);
    } else if (entry.name.endsWith('.js')) {
      const source = await readFile(file, 'utf8');
      for (const match of source.matchAll(/from\s+["'](\.[^"']+)["']/g)) {
        const dependency = path.resolve(path.dirname(file), match[1]);
        if (!existsSync(dependency)) failures.push(`${path.relative(root, file)}: missing ${match[1]}`);
      }
    }
  }
}
await verifyModules(modulesRoot);

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Verified ${pages.length} pages, local presentation assets, and the Three.js module graph.`);
