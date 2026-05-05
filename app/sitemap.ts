import type { MetadataRoute } from 'next';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://magppie.com';

// Static routes mirrored from the file system. When a new top-level route
// goes live, add it here so it appears in the sitemap on next build.
const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
}> = [
  { path: '',          changeFrequency: 'weekly',  priority: 1.0 },
  { path: '/kitchens', changeFrequency: 'weekly',  priority: 0.9 },
  { path: '/wardrobes',changeFrequency: 'weekly',  priority: 0.9 },
  { path: '/vanities', changeFrequency: 'weekly',  priority: 0.9 },
  { path: '/materials',changeFrequency: 'monthly', priority: 0.85 },
  { path: '/about',    changeFrequency: 'monthly', priority: 0.7 },
  { path: '/news',     changeFrequency: 'weekly',  priority: 0.8 },
  { path: '/contact',  changeFrequency: 'yearly',  priority: 0.7 }
];

// Journal posts. Hard-coded for now; once Sanity is wired in this becomes a
// `await sanityClient.fetch(...)` call. Slugs picked to match the in-page
// `id` anchors (e.g. /news#kbis-2026 → eventually /news/kbis-2026).
const JOURNAL_POSTS: Array<{ slug: string; lastModified: string }> = [
  { slug: 'kbis-2026', lastModified: '2026-02-18' }
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority
  }));

  const postEntries: MetadataRoute.Sitemap = JOURNAL_POSTS.map((p) => ({
    url: `${SITE_URL}/news/${p.slug}`,
    lastModified: new Date(p.lastModified),
    changeFrequency: 'monthly',
    priority: 0.6
  }));

  return [...staticEntries, ...postEntries];
}
