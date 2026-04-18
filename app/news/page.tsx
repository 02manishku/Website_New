import Image from 'next/image';
import PageHero from '@/components/PageHero';

export const metadata = {
  title: 'News — Magppie',
  description: 'Stories, exhibitions, design partnerships and innovation from Magppie.'
};

const STORIES = [
  {
    image: '/images/vanities/01.jpg',
    date: 'Apr 2026',
    tag: 'Launch',
    title: 'The Wellness Vanity — Magppie opens the bathroom to Silverstone™',
    excerpt:
      'After kitchens and wardrobes, the brand’s patented anti-bacterial stone arrives in the most water-intense room of the home. Launched across eight new finishes, from Onyx Gold to Flurry Black.'
  },
  {
    image: '/images/1.jpg',
    date: 'Nov 2024',
    tag: 'Exhibition',
    title: 'Magppie at FOAID, New Delhi — the Wellness Kitchen unveiled',
    excerpt:
      'A first-of-its-kind installation that placed our hanging-garden Silverstone™ kitchen at the centre of India’s premier interior design forum.'
  },
  {
    image: '/images/Hailuo_Image_Create-a-different-Angle-for-t_488492364996386825.jpg',
    date: 'Apr 2026',
    tag: 'Innovation',
    title: 'Inside Silverstone™ — nano-silver and the science of safer surfaces',
    excerpt:
      'How we infused pure-silver ions into the very core of the stone — and why every Magppie cabinet, fascia and handle now carries that science.'
  },
  {
    image: '/images/Hailuo_Image_re-render-it-make-it-ultra-hi_488062043326640136-copy.jpg',
    date: 'Apr 2026',
    tag: 'Design Partners',
    title: 'Karim Rashid, Stefan Diez & Cory Grosser join the Wellness Movement',
    excerpt:
      'Three of the most quietly influential designers of our era — now collaborating with Magppie on capsule kitchen and wardrobe collections.'
  },
  {
    image: '/images/02.jpg',
    date: 'Mar 2026',
    tag: 'Customer',
    title: 'A Wellness Kitchen for the Mittal residence — Lutyens, Delhi',
    excerpt:
      'A bespoke Magppie Taj kitchen built for one of India’s most discerning families.'
  }
];

export default function NewsPage() {
  return (
    <>
      <PageHero
        kicker="Stories"
        title="News & Journal."
        image="/images/02.jpg"
        subtitle="Exhibitions, partnerships, innovations — and a few quiet moments from the Magppie world."
      />

      <section className="bg-bone py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 space-y-20">
          {STORIES.map((s, i) => (
            <article
              key={s.title}
              className={`grid lg:grid-cols-12 gap-10 items-center ${
                i % 2 ? 'lg:[&>*:first-child]:order-2' : ''
              }`}
            >
              <div className="lg:col-span-7">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="flex items-center gap-3 kicker text-smoke mb-4">
                  <span>{s.date}</span>
                  <span className="w-6 h-px bg-smoke/40" />
                  <span>{s.tag}</span>
                </div>
                <h2 className="font-display text-3xl md:text-4xl text-ink leading-tight">
                  {s.title}
                </h2>
                <p className="mt-5 text-ink/70 leading-relaxed">{s.excerpt}</p>
                <a href="#" className="inline-block mt-6 kicker hover-underline">
                  Read story →
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
