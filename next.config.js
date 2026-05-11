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

  // Strip console.* calls (except error/warn) from the production bundle.
  // Dev / preview still see them; production gets the smaller, quieter
  // bundle. The `[video] requestPlay` telemetry in lib/use-video-lazy-play
  // relies on this so prod doesn't leak the noisy log line.
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? { exclude: ['error', 'warn'] }
        : false
  },

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
        // Indexing control + transport security + CSP for everything.
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
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

          // Content-Security-Policy. Staged rollout: this version is
          // permissive (allows 'unsafe-inline' + 'unsafe-eval' on
          // script-src) so the App Router's RSC/Hydration scripts and
          // any inline framer-motion / GSAP setup don't break in
          // preview. Walk every route on the preview deploy and watch
          // DevTools console for any CSP violation; add the missing
          // host to the relevant directive before promoting to prod.
          //
          // TODO post-launch: replace 'unsafe-inline' / 'unsafe-eval'
          // on script-src with a nonce-based CSP using middleware
          // (per https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy).
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.vercel-scripts.com https://va.vercel-scripts.com https://*.sentry.io",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://cdn.sanity.io",
              "font-src 'self' data:",
              "connect-src 'self' https://www.zohoapis.in https://accounts.zoho.in https://api.resend.com https://*.vercel-insights.com https://*.sentry.io",
              "media-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
              'upgrade-insecure-requests'
            ].join('; ')
          },
          { key: 'X-Frame-Options', value: 'DENY' },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()'
          }
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
      // /materials was retired; route any old Silverstone landing-page
      // backlinks to the kitchens page where the material is featured.
      { source: '/silverstone', destination: '/kitchens', permanent: true },
      { source: '/materials',   destination: '/kitchens', permanent: true },
      { source: '/blog/:slug',  destination: '/news/:slug', permanent: true },
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
