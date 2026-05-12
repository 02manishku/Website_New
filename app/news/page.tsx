import type { Metadata } from 'next';
import Image from 'next/image';
import PageHero from '@/components/PageHero';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema, kbisHeroImageSchema, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: {
    absolute:
      'Magppie Journal | Wellness Kitchen News, Awards and Stories | KBIS 2026'
  },
  description:
    "Magppie news, design stories, partnerships and innovations. Inside Magppie's KBIS 2026 Most Unexpected Innovation win in Orlando, the FOAID Delhi unveiling, the science of Silverstone™, and design partnerships with Karim Rashid, Stefan Diez and Cory Grosser.",
  keywords: [
    'Magppie news',
    'Magppie journal',
    'Magppie blog',
    'Magppie awards',
    'KBIS 2026 winner Magppie',
    'KBIS Innovation Hour 2026',
    'Magppie KBIS Orlando',
    'modular kitchen news India',
    'Karim Rashid Magppie',
    'Stefan Diez Magppie',
    'Cory Grosser Magppie',
    'Stacy McCarthy Magppie',
    'Silverstone nano silver',
    'FOAID Delhi Magppie'
  ],
  alternates: {
    canonical: '/news',
    languages: { 'en-IN': '/news', 'x-default': '/news' }
  },
  openGraph: {
    title: 'Magppie Journal: Wellness Kitchen Stories and News',
    description:
      'Stories, exhibitions, design partnerships and innovation from Magppie.',
    url: '/news',
    images: [
      {
        url: '/og/news-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Magppie Journal, news and stories'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Magppie Journal: Wellness Kitchen Stories and News',
    description: 'Stories from the Wellness Movement.',
    images: ['/og/news-og.jpg']
  }
};

const STORIES = [
  {
    image: '/images/news/kbis/winners-podium.webp',
    date: 'Feb 2026',
    tag: 'Award',
    title: 'Magppie wins “Most Unexpected” at KBIS 2026, Orlando',
    excerpt:
      'At the inaugural KBIS Innovation Hour on February 17, judged live by an audience of designers, media and industry professionals, Magppie Silverstone™ took the Most Unexpected category, placing alongside Caesarstone (Most Innovative) and LG (I’d Spec That Tomorrow) as one of three global winners. Recognised for the silver-infused, mould- and bacteria-resistant stone surface that extends from countertop to cabinetry to floor, without the toxic adhesives or resins of conventional kitchens. Hosted by Sophie Donelson; presented for Magppie by Kishor Rico, Director of US Operations.'
  },
  {
    image: '/images/vanities/01.webp',
    date: 'Apr 2026',
    tag: 'Launch',
    title: 'The Wellness Vanity: Magppie opens the bathroom to Silverstone™',
    excerpt:
      'After kitchens and wardrobes, the brand’s patented anti-bacterial stone arrives in the most water-intense room of the home. Launched across eight new finishes, from Onyx Gold to Flurry Black.'
  },
  {
    image: '/images/1.webp',
    date: 'Nov 2024',
    tag: 'Exhibition',
    title: 'Magppie at FOAID, New Delhi: the Wellness Kitchen unveiled',
    excerpt:
      'A first-of-its-kind installation that placed our hanging-garden Silverstone™ kitchen at the centre of India’s premier interior design forum.'
  },
  {
    image: '/images/silverstone-nano-silver.webp',
    date: 'Apr 2026',
    tag: 'Innovation',
    title: 'Inside Silverstone™: nano-silver and the science of safer surfaces',
    excerpt:
      'How we infused pure-silver ions into the very core of the stone, and why every Magppie cabinet, fascia and handle now carries that science.'
  },
  {
    image: '/images/design-partners-capsule.webp',
    date: 'Apr 2026',
    tag: 'Design Partners',
    title: 'Karim Rashid, Stefan Diez & Cory Grosser join the Wellness Movement',
    excerpt:
      'Three of the most quietly influential designers of our era, now collaborating with Magppie on capsule kitchen and wardrobe collections.'
  },
  {
    image: '/images/02.webp',
    date: 'Mar 2026',
    tag: 'Customer',
    title: 'A Wellness Kitchen for the Mittal residence: Lutyens, Delhi',
    excerpt:
      'A bespoke Magppie Taj kitchen built for one of India’s most discerning families.'
  }
];

export default function NewsPage() {
  return (
    <>
      <JsonLd
        data={[
          // CollectionPage so Google understands /news as a list of
          // articles rather than a single article. Eligible for the
          // article carousel rich result on the SERP.
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            '@id': `${SITE_URL}/news#collectionpage`,
            name: 'Magppie Journal: Wellness Kitchen News and Stories',
            description:
              'Magppie news, design stories, partnerships and innovations.',
            url: `${SITE_URL}/news`,
            inLanguage: 'en-IN',
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  url: `${SITE_URL}/news#kbis-2026`,
                  name: 'Magppie wins Most Unexpected at KBIS 2026, Orlando'
                }
              ]
            }
          },
          kbisHeroImageSchema,
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'News', path: '/news' }
          ])
        ]}
      />
      <PageHero
        kicker="Stories"
        title="News & Journal."
        image="/images/news/kbis/hero.webp"
        subtitle="Exhibitions, partnerships, innovations, and a few quiet moments from the Magppie world."
      />

      <section className="bg-bone py-20 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 space-y-14 lg:space-y-20">
          {STORIES.map((s, i) => (
            <article
              key={s.title}
              id={i === 0 ? 'kbis-2026' : undefined}
              className={`scroll-mt-24 lg:scroll-mt-32 grid lg:grid-cols-12 gap-6 lg:gap-10 items-center ${
                i % 2 ? 'lg:[&>*:first-child]:order-2' : ''
              }`}
            >
              <div className="lg:col-span-7">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={s.image}
                    alt={`${s.title} | Magppie wellness kitchen news and recognition`}
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="flex items-center gap-3 text-[0.78rem] text-smoke mb-4">
                  <span>{s.date}</span>
                  <span className="w-6 h-px bg-smoke/40" />
                  <span>{s.tag}</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-ink leading-tight">
                  {s.title}
                </h2>
                <p className="mt-4 lg:mt-5 text-ink/70 leading-relaxed">{s.excerpt}</p>
                {/* "Read story →" CTA intentionally omitted until per-story
                    routes (app/news/[slug]/page.tsx) ship. The card stays;
                    a dead href="#" anchor would scroll to top on click. */}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
