// audited 2026-05-11 — section rewritten from a sticky stacking-cards
// design to a plain static feature-panel layout. The previous version
// stacked seven sticky <article>s with z-indexed headers; in practice
// cards 03 and 04 intermittently failed to render between cards 02 and
// 05 on both desktop and iOS Safari (sticky-window collapse under
// `dvh` viewport changes, decoder pressure from 7 simultaneous video
// candidates, and IntersectionObserver state thrash during fast
// scrolls). This rewrite removes every moving part: no sticky, no
// IntersectionObserver, no `dvh`, no `<video>`, no shared state. Each
// feature is a self-contained side-by-side panel using the same
// /posters/why-stone-N.webp first-frame WebPs the videos used to start
// on, so the visual identity is preserved. The kitchen demonstration
// frames carry the substance on their own; motion was decoration.
//
// Bonus: this drops 7 H.264 decoder slots off the iOS budget — which
// is the root cause class for the section-scroll crashes the owner
// reported on the iPhone, since iOS Safari only holds ~1–4 decoder
// contexts before the WatchDog reaps the tab.

import Image from 'next/image';
import ScrollFloat from '@/components/ScrollFloat';

type Feature = {
  id: string;
  number: string;
  label: string;
  heading: string;
  body: string;
  poster: string;
};

const FEATURES: Feature[] = [
  {
    id: 'stain',
    number: '01',
    label: 'Stain Safe',
    heading: 'Everyday spills wipe off easily.',
    body:
      "Magppie kitchens are made from a non-porous Silverstone™ that doesn't absorb spills. Coffee, haldi or oil wipes off in a single stroke. Your kitchen stays clean every day, with no permanent marks.",
    poster: '/posters/why-stone-1.webp'
  },
  {
    id: 'scratch',
    number: '02',
    label: 'Scratch Safe',
    heading: 'Handles daily chopping without damage.',
    body:
      "Magppie kitchens use a scratch-resistant Silverstone™ surface built for daily Indian cooking. Regular chopping and knife work won't leave a mark, so your kitchen looks new for years.",
    poster: '/posters/why-stone-2.webp'
  },
  {
    id: 'load',
    number: '03',
    label: 'High Load Bearing Capacity',
    heading: 'Holds heavy kitchen loads with ease.',
    body:
      'Magppie drawers are built to carry weight. Each drawer supports up to 80 kilos of vessels, groceries and appliances without bending, sagging or losing stability, even after a decade of use.',
    poster: '/posters/why-stone-3.webp'
  },
  {
    id: 'fire',
    number: '04',
    label: 'Fire Safe',
    heading: 'Safe around heat and open flame.',
    body:
      'The kitchen is used around heat and open flame every day. Because Magppie kitchens are made entirely from stone, the surface does not catch fire or help flames spread. Built for daily Indian open-flame cooking.',
    poster: '/posters/why-stone-4.webp'
  },
  {
    id: 'water',
    number: '05',
    label: 'Water Safe',
    heading: 'Stays strong even with water exposure.',
    body:
      'Kitchens are exposed to water every day. We placed a wooden panel and a Magppie stone sample in water for thirty days. The wood swelled and weakened. The stone stayed exactly the same. It does not absorb water, bend, or lose strength.',
    poster: '/posters/why-stone-5.webp'
  },
  {
    id: 'impact',
    number: '06',
    label: 'Impact Safe',
    heading: 'Handles sudden drops and accidents.',
    body:
      'To test impact strength, we dropped a heavy ceramic jar on the surface. The stone stayed intact, making it safe for the everyday knocks and drops of a busy Indian kitchen.',
    poster: '/posters/why-stone-6.webp'
  },
  {
    id: 'storage',
    number: '07',
    label: 'More Storage',
    heading: 'Made for maximum storage.',
    body:
      "With extra depth and height, Magppie wall cabinets offer up to 62% more storage than standard kitchens. They're designed to fit large Indian plates and vessels that usually don't fit in regular cabinets.",
    poster: '/posters/why-stone-7.webp'
  }
];

export default function WhyStoneMakesDifference() {
  return (
    <section className="bg-bone relative">
      {/* Section heading flows in normal document order. */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 pt-20 lg:pt-32">
        <div className="kicker text-smoke mb-6">The Promise</div>
        <ScrollFloat
          as="h2"
          containerClassName="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-ink max-w-4xl"
        >
          Why stone makes all the{' '}
          <span className="text-smoke">difference.</span>
        </ScrollFloat>
        <p className="mt-6 lg:mt-8 max-w-xl text-ink/65 leading-relaxed font-display italic text-lg">
          Seven everyday tests every kitchen quietly fails. Magppie quietly
          passes.
        </p>
      </div>

      {/* Feature panels — each card is a plain, self-contained block.
          No sticky, no IntersectionObserver, no shared state. The
          alternating image side on desktop (even indexes left, odd
          right) gives the section visual rhythm without depending on
          scroll-position tracking. On mobile the image sits below the
          copy in single-column order, regardless of index. */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 mt-14 lg:mt-24 pb-20 lg:pb-32">
        <ul className="space-y-6 lg:space-y-10">
          {FEATURES.map((f, i) => {
            const imageLeftOnDesktop = i % 2 === 1;
            return (
              <li key={f.id}>
                <article className="grid lg:grid-cols-12 gap-0 items-stretch rounded-[20px] lg:rounded-[28px] border border-ink/12 bg-bone overflow-hidden shadow-[0_6px_20px_-14px_rgba(40,28,18,0.16)] lg:shadow-[0_22px_50px_-30px_rgba(40,28,18,0.22)]">
                  {/* Copy column */}
                  <div
                    className={`lg:col-span-6 px-6 sm:px-10 lg:px-14 xl:px-16 py-9 sm:py-11 lg:py-14 flex flex-col justify-center ${
                      imageLeftOnDesktop ? 'lg:order-2' : 'lg:order-1'
                    }`}
                  >
                    <div className="flex items-baseline gap-5 sm:gap-7 mb-5 lg:mb-7">
                      <span className="kicker tabular-nums text-ink/55">
                        {f.number}
                      </span>
                      <span className="font-display text-lg sm:text-xl lg:text-2xl text-ink leading-tight">
                        {f.label}
                      </span>
                    </div>
                    <h3 className="font-display text-[1.65rem] sm:text-[1.95rem] lg:text-[2.35rem] xl:text-[2.55rem] text-ink leading-[1.12] tracking-[-0.005em] max-w-[28rem]">
                      {f.heading}
                    </h3>
                    <p className="mt-5 lg:mt-7 text-ink/70 leading-relaxed text-[0.95rem] sm:text-base lg:text-[1.02rem] max-w-[30rem]">
                      {f.body}
                    </p>
                  </div>

                  {/* Image column — fixed aspect on mobile, fills column
                      on desktop. The poster is the same /posters/why-
                      stone-N.webp the video used to start on, so the
                      visual identity matches the previous design. */}
                  <div
                    className={`relative lg:col-span-6 aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:min-h-[420px] bg-ink ${
                      imageLeftOnDesktop ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    <Image
                      src={f.poster}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      quality={82}
                      className="object-cover"
                    />
                    {/* Soft inner vignette keeps the photographic feel
                        the old video container had. */}
                    <div
                      aria-hidden
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.18) 100%)'
                      }}
                    />
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
