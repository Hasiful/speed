import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname);
const preferredPort = Number(process.env.PORT || 4173);
let port = preferredPort;
const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.avif': 'image/avif', '.gif': 'image/gif', '.ico': 'image/x-icon',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.mp3': 'audio/mpeg',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.glb': 'model/gltf-binary',
};

const server = http.createServer(async (request, response) => {
  try {
    const requestPath = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
    const isPublicAsset = requestPath.startsWith('/assets/') || requestPath === '/clone-runtime.js' || requestPath === '/speed-brand.js' || requestPath === '/speed-brand.css' || requestPath === '/mirror-manifest.json';
    let file = path.resolve(isPublicAsset ? path.join(root, 'public', '.' + requestPath) : path.join(root, '.' + requestPath));
    if (!file.startsWith(root)) throw new Error('Invalid path');
    try {
      if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    } catch {
      if (path.extname(requestPath)) throw new Error('Missing asset');
      file = path.join(root, 'index.html');
    }
    const body = await readFile(file);
    response.writeHead(200, { 'Content-Type': mime[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end('Not found');
  }
});

const listen = () => {
  server.listen(port, () => console.log(`Speed Energy site: http://localhost:${port}`));
};

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE' && port < preferredPort + 20) {
    console.warn(`Port ${port} is busy; trying ${port + 1}...`);
    port += 1;
    listen();
    return;
  }
  throw error;
});

listen();
