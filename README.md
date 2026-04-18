# Magppie — Wellness Kitchens, Wardrobes & Vanities

Next.js 14 marketing site for the world's first Wellness Kitchen & Wardrobe brand, built on patented anti-bacterial Silverstone™.

## Stack

- **Next.js 14** (App Router) + React 18 + TypeScript
- **Tailwind CSS** — custom palette (ink/bone/sand/smoke)
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

Originals are preserved locally in `public/_originals/` (gitignored).

## Deployment

One-click deploy on Vercel — no config needed. Set the build command to `npm run build` and root directory to the project root.
