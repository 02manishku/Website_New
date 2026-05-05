/**
 * Next.js configuration.
 *
 * Image optimization + SEO scaffolding live here. Visible UI is untouched.
 * Three things this file is responsible for, in order of impact:
 *
 *   1. Image format pipeline. AVIF first, then WebP, then the original.
 *      The aggressive deviceSizes + imageSizes + 1-year cache TTL is what
 *      lets us ship 4K editorial photography to luxury-segment customers
 *      without a 30 MB landing page.
 *
 *   2. Production-only indexing. Preview deployments get an
 *      `X-Robots-Tag: noindex, nofollow` header so Google never sees the
 *      throwaway `*-magppie.vercel.app` hashes; production gets a verbose
 *      `index, follow, max-image-preview:large` so the brand's own photos
 *      can surface in image search.
 *
 *   3. URL hygiene. HSTS, no trailing slash, and 301s for the legacy
 *      magppie.com slug structure → preserves backlink equity from press
 *      placements on the old site.
 */

const isProduction = process.env.VERCEL_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Trailing slash off so /kitchens and /kitchens/ don't both index as
  // duplicates. Canonicals declared per-route reinforce the same.
  trailingSlash: false,

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920, 2400, 3200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 768],
    minimumCacheTTL: 31536000, // 1 year, treat optimized images as immutable
    remotePatterns: [
      // Sanity isn't wired yet, but reserving the host pattern means a
      // future CDN switch doesn't require a redeploy. Add more entries
      // here as new image sources come online.
      { protocol: 'https', hostname: 'cdn.sanity.io' }
    ]
  },

  async headers() {
    return [
      {
        // Indexing control + transport security for everything.
        source: '/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: isProduction
              ? 'index, follow, max-image-preview:large, max-snippet:-1'
              : 'noindex, nofollow'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
        ]
      },
      {
        // Long-cache static assets. Next.js fingerprints filenames so we
        // can lean on `immutable` safely.
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/videos/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  },

  async redirects() {
    // 301s preserve the SEO equity of any backlinks that still point at
    // the old magppie.com URL structure (PR coverage, design publications,
    // partner pages, etc). Add more entries here as Ahrefs / Search
    // Console surface old paths with traffic.
    return [
      {
        source: '/products/wellness-kitchen',
        destination: '/kitchens',
        permanent: true
      },
      {
        source: '/products/wellness-wardrobe',
        destination: '/wardrobes',
        permanent: true
      },
      {
        source: '/products/wellness-vanity',
        destination: '/vanities',
        permanent: true
      },
      { source: '/silverstone', destination: '/materials', permanent: true },
      { source: '/blog/:slug',   destination: '/news/:slug', permanent: true },
      // Common alternate phrasings & legacy index pages.
      { source: '/kitchen',  destination: '/kitchens',  permanent: true },
      { source: '/wardrobe', destination: '/wardrobes', permanent: true },
      { source: '/vanity',   destination: '/vanities',  permanent: true },
      { source: '/journal',  destination: '/news',      permanent: true },
      { source: '/blog',     destination: '/news',      permanent: true }
    ];
  }
};

module.exports = nextConfig;
