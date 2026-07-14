import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const sourceUrl = 'https://www.speedenergy.com/';
const pageRoutes = ['', 'mentions-legales', 'cgu', 'politique-de-confidentialite'];
const allowedAssetHosts = new Set([
  'cdn.prod.website-files.com',
  'd3e54v103j8qbb.cloudfront.net',
  'cdn.jsdelivr.net',
  'cdnjs.cloudflare.com',
  'unpkg.com',
  'cdn.mprez.fr',
  'sibforms.com',
]);

const threeAddonsBase = 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/';

const textExtensions = new Set(['.css', '.js', '.mjs', '.json', '.html', '.txt', '.svg']);
const queue = [];
const queued = new Set();
const mirrored = new Map();

function cleanUrl(raw, base = sourceUrl) {
  try {
    const value = raw.replaceAll('&amp;', '&').trim();
    if (!value || value.startsWith('data:') || value.startsWith('blob:')) return null;
    return new URL(value, base);
  } catch {
    return null;
  }
}

function localPathFor(url) {
  let pathname = decodeURIComponent(url.pathname);
  if (pathname.endsWith('/')) pathname += 'index.html';
  const safeSegments = pathname
    .split('/')
    .filter(Boolean)
    .map((part) => part.replace(/[<>:"|?*]/g, '_'));
  return path.join('public', 'assets', url.hostname, ...safeSegments);
}

function publicUrlFor(url) {
  if (url.pathname.endsWith('/')) {
    return `/assets/${url.hostname}${decodeURIComponent(url.pathname)}`;
  }
  return '/' + localPathFor(url).replace(/^public[\\/]/, '').split(path.sep).join('/');
}

function enqueue(raw, base) {
  const url = cleanUrl(raw, base);
  if (!url || !allowedAssetHosts.has(url.hostname)) return;
  url.hash = '';
  const key = url.href;
  if (queued.has(key)) return;
  queued.add(key);
  queue.push(url);
}

function discover(text, base) {
  const absolute = /https?:\\?\/\\?\/[^\s"'<>`)}\\]+/g;
  for (const match of text.matchAll(absolute)) {
    enqueue(match[0].replaceAll('\\/', '/'), base);
  }

  const cssUrls = /url\(\s*['"]?([^'"\)]+)['"]?\s*\)/g;
  for (const match of text.matchAll(cssUrls)) enqueue(match[1], base);

  const imports = /(?:from\s*|import\s*\()['"]([^'"]+)['"]/g;
  for (const match of text.matchAll(imports)) {
    if (match[1].startsWith('three/addons/')) {
      enqueue(threeAddonsBase + match[1].slice('three/addons/'.length));
    } else {
      enqueue(match[1], base);
    }
  }
}

function rewrite(text, base) {
  const replacements = [];
  for (const [remote, local] of mirrored) {
    replacements.push([remote, local]);
    replacements.push([remote.replaceAll('/', '\\/'), local.replaceAll('/', '\\/')]);
  }
  replacements.sort((a, b) => b[0].length - a[0].length);
  let output = text;
  for (const [remote, local] of replacements) output = output.split(remote).join(local);

  output = output.replace(/url\(\s*(['"]?)([^'"\)]+)\1\s*\)/g, (whole, quote, raw) => {
    const resolved = cleanUrl(raw, base);
    if (!resolved) return whole;
    const local = mirrored.get(resolved.href);
    return local ? `url(${quote}${local}${quote})` : whole;
  });
  return output;
}

async function download(url) {
  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  const contentType = response.headers.get('content-type') || '';
  const extension = path.extname(url.pathname).toLowerCase();
  const isText = contentType.includes('text/') || contentType.includes('javascript') || contentType.includes('json') || textExtensions.has(extension);
  const body = isText ? await response.text() : Buffer.from(await response.arrayBuffer());
  return { body, isText };
}

async function main() {
  await mkdir(path.join(root, 'public'), { recursive: true });
  const pages = [];
  for (const route of pageRoutes) {
    const pageUrl = new URL(route, sourceUrl).href;
    const response = await fetch(pageUrl);
    if (!response.ok) throw new Error(`Unable to load ${pageUrl}: ${response.status}`);
    const html = await response.text();
    pages.push({ route, pageUrl, html });
    discover(html, pageUrl);
  }

  const downloadedText = [];
  while (queue.length) {
    const url = queue.shift();
    if (url.pathname.endsWith('/')) {
      mirrored.set(url.href, publicUrlFor(url));
      continue;
    }
    const targetRelative = localPathFor(url);
    const target = path.join(root, targetRelative);
    try {
      const { body, isText } = await download(url);
      mirrored.set(url.href, publicUrlFor(url));
      await mkdir(path.dirname(target), { recursive: true });
      if (isText) {
        discover(body, url.href);
        downloadedText.push({ url, target, body });
      } else {
        await writeFile(target, body);
      }
      process.stdout.write(`Mirrored ${url.href}\n`);
    } catch (error) {
      process.stderr.write(`Skipped ${url.href}: ${error.message}\n`);
    }
  }

  for (const item of downloadedText) {
    await writeFile(item.target, rewrite(item.body, item.url.href));
  }

  for (const page of pages) {
    let html = rewrite(page.html, page.pageUrl);
    html = html
      .replace(/<script defer src="https:\/\/cloud\.umami\.is\/script\.js"[^>]*><\/script>/, '')
      .replace(/<script defer src="[^"]*sibforms\.com\/forms\/end-form\/build\/main\.js"><\/script>/, '')
      .replace(/(<form id="sib-form"[^>]*?) action="[^"]+"/, '$1 action="#"')
      .replace(/\s+integrity="[^"]*"/g, '')
      .replace(/\s+crossorigin="anonymous"/g, '');
    html = html.replace('</body>', `<script src="/clone-runtime.js"></script></body>`);
    const output = page.route ? path.join(root, page.route, 'index.html') : path.join(root, 'index.html');
    await mkdir(path.dirname(output), { recursive: true });
    await writeFile(output, html);
  }
  await writeFile(path.join(root, 'public', 'mirror-manifest.json'), JSON.stringify(Object.fromEntries(mirrored), null, 2));
  process.stdout.write(`Done: ${mirrored.size} assets mirrored.\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
