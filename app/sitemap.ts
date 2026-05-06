import type { MetadataRoute } from 'next';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://magppie.com';

// Static routes mirrored from the file system. Each entry includes:
// - changeFrequency / priority for crawl budget hints
// - hreflang alternates (en-IN canonical + x-default)
// - representative image URLs so Google Image Search can ingest them
//   (Image Sitemap protocol — supported via Next.js's `images` field)
const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
  images: string[];
}> = [
  {
    path: '',
    changeFrequency: 'weekly',
    priority: 1.0,
    images: [
      `${SITE_URL}/images/hero.webp`,
      `${SITE_URL}/images/news/kbis/hero.webp`,
      `${SITE_URL}/images/kitchens/best-kitchen.webp`,
      `${SITE_URL}/images/copper-infused-silver-poster.webp`
    ]
  },
  {
    path: '/kitchens',
    changeFrequency: 'weekly',
    priority: 0.95,
    images: [
      `${SITE_URL}/images/kitchens/best-kitchen.webp`,
      `${SITE_URL}/images/kitchens/kitchen-marble-island.webp`,
      `${SITE_URL}/images/kitchens/kitchen-black-finish.webp`
    ]
  },
  {
    path: '/wardrobes',
    changeFrequency: 'weekly',
    priority: 0.9,
    images: [`${SITE_URL}/images/wardrobes/concept-1.webp`]
  },
  {
    path: '/vanities',
    changeFrequency: 'weekly',
    priority: 0.9,
    images: [
      `${SITE_URL}/images/vanities/01.webp`,
      `${SITE_URL}/images/vanities/onyx-gold-overmount.webp`
    ]
  },
  {
    path: '/about',
    changeFrequency: 'monthly',
    priority: 0.7,
    images: [`${SITE_URL}/images/02.webp`]
  },
  {
    path: '/news',
    changeFrequency: 'weekly',
    priority: 0.85,
    images: [
      `${SITE_URL}/images/news/kbis/hero.webp`,
      `${SITE_URL}/images/news/kbis/winners-podium.webp`,
      `${SITE_URL}/images/news/kbis/kishor-presenting.webp`
    ]
  },
  {
    path: '/contact',
    changeFrequency: 'yearly',
    priority: 0.75,
    images: []
  }
];

// Journal posts. Hard-coded for now; once Sanity is wired in this becomes a
// `await sanityClient.fetch(...)` call.
const JOURNAL_POSTS: Array<{
  slug: string;
  lastModified: string;
  images?: string[];
}> = [
  {
    slug: 'kbis-2026',
    lastModified: '2026-02-18',
    images: [
      `${SITE_URL}/images/news/kbis/hero.webp`,
      `${SITE_URL}/images/news/kbis/winners-podium.webp`
    ]
  }
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
    images: r.images,
    alternates: {
      languages: {
        'en-IN': `${SITE_URL}${r.path}`,
        'x-default': `${SITE_URL}${r.path}`
      }
    }
  }));

  const postEntries: MetadataRoute.Sitemap = JOURNAL_POSTS.map((p) => ({
    url: `${SITE_URL}/news/${p.slug}`,
    lastModified: new Date(p.lastModified),
    changeFrequency: 'monthly',
    priority: 0.7,
    images: p.images,
    alternates: {
      languages: {
        'en-IN': `${SITE_URL}/news/${p.slug}`,
        'x-default': `${SITE_URL}/news/${p.slug}`
      }
    }
  }));

  return [...staticEntries, ...postEntries];
}
