import type { MetadataRoute } from 'next';

// Production domain. Anything outside production (preview, branch, dev) is
// blanket-disallowed below so we don't leak duplicate content into Google.
const PRODUCTION_HOST = 'https://magppie.com';

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === 'production';

  // Preview / branch / dev deployments: keep them invisible to crawlers so
  // staging URLs don't compete with the canonical magppie.com in SERPs.
  if (!isProduction) {
    return {
      rules: { userAgent: '*', disallow: '/' }
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /api/ has no public surface, /admin/ and /private/ are reserved
        // for future internal routes. /_next/ is Next.js build assets that
        // search engines have no business indexing directly.
        disallow: ['/api/', '/admin/', '/_next/', '/private/']
      },
      // Welcome the AI training crawlers we want to be ingested by, since
      // ChatGPT / Perplexity / Gemini answers are an emerging discovery
      // surface for luxury home brands.
      { userAgent: 'GPTBot',         allow: '/' },
      { userAgent: 'PerplexityBot',  allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      // CCBot scrapes for Common Crawl, which feeds many ML datasets we
      // can't audit. Block it.
      { userAgent: 'CCBot', disallow: '/' }
    ],
    sitemap: `${PRODUCTION_HOST}/sitemap.xml`,
    host: PRODUCTION_HOST
  };
}
