# Magppie | Wellness Kitchens, Wardrobes & Vanities

Next.js 14 marketing site for the world's first Wellness Kitchen & Wardrobe brand, built on patented anti-bacterial Silverstone™.

## Stack

- **Next.js 14** (App Router) + React 18 + TypeScript
- **Tailwind CSS** with a custom palette (ink/bone/sand/smoke)
- **next/font** (Inter + Cormorant Garamond, self-hosted)
- **next/image** with AVIF/WebP auto-negotiation

## Local development

```bash
npm install
npm run dev       # http://localhost:3010
```

## Production

```bash
npm run build
npm run start     # http://localhost:3010
```

## Asset pipeline

All hero imagery and background videos are pre-compressed:

- Images resized to 2400px max, JPEG q92 (opaque) / WebP q92 (alpha)
- Videos re-encoded x264 CRF 23 + VP9/WebM, 1920px max, `+faststart`

Re-run either pipeline if you add fresh source assets:

```bash
node scripts/optimize-images.js
bash scripts/optimize-videos.sh
node scripts/rewrite-refs.js     # updates code refs from rename-map.json
```

Originals are preserved locally in `../magppie-source-assets/_originals/`
(outside the project root so they never accidentally ship to Vercel via a
direct CLI deploy). Path is relative to the project root, so the source
directory and the project sit as siblings:

```
parent/
  magppie-source-assets/
    _originals/         ← uncompressed source images & videos
    og-source-*.jpg     ← OG image source files (1200x630+ landscape)
    icon-source.png     ← square brand mark, 1024x1024+
  magppie-site/         ← this repo
    public/             ← only optimised, deployable assets
```

The optimisation scripts in `scripts/` and `scripts/generate-social-assets.mjs`
read from `../magppie-source-assets/` and write to `public/`.

## Deployment

One-click deploy on Vercel, no config needed. Set the build command to `npm run build` and root directory to the project root.
