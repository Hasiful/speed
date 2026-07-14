# Speed Energy showcase

A local, frontend-only Speed Energy showcase. The
visual assets, 3D scene, typography, motion, sound design, and responsive Webflow
layout are served locally. The linked legal pages are included, while newsletter
submission and analytics are intentionally disabled.

## Run

```powershell
npm.cmd start
```

Open <http://localhost:4173>.

## Deploy to Vercel

```powershell
npm.cmd run build
```

This creates a `dist/` folder that Vercel can publish as a static site. The
repo includes a `vercel.json` file, so after importing the Git repository into
Vercel you can keep the default settings and deploy.

## Refresh public assets

```powershell
npm.cmd run mirror
```

The mirror script downloads public presentation assets and rewrites their URLs to
local paths under `public/assets/`.
