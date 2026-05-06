import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import HeroVideo from '@/components/HeroVideo';
import CustomersMarquee from '@/components/CustomersMarquee';
import StacyTestimonial from '@/components/StacyTestimonial';
import PoolsideKitchenBanner from '@/components/PoolsideKitchenBanner';
import ScrollFloat from '@/components/ScrollFloat';
import JsonLd from '@/components/JsonLd';
import {
  allIndiaLocalBusinessSchemas,
  brandSchema,
  designConsultationServiceSchema,
  howToDesignWellnessKitchenSchema,
  faqSchema,
  stacyTestimonialVideoSchema,
  kbisHeroImageSchema,
  indiaShowroomsItemListSchema,
  breadcrumbSchema
} from '@/lib/seo';

// `title.absolute` bypasses the layout's `'%s | Magppie'` template, since
// the homepage title already encodes the brand in full.
export const metadata: Metadata = {
  title: {
    absolute:
      'Luxury Modular Kitchen in India | Magppie Wellness Kitchen | KBIS 2026'
  },
  description:
    "Magppie is the world's first Wellness Kitchen brand, built in patented Silverstone™ antibacterial sintered stone. India's most awarded luxury modular kitchen, wardrobe and vanity. Showrooms in Delhi, Mumbai, Bengaluru, Hyderabad, Mohali, Surat and Coimbatore. KBIS 2026 winner. 25-year guarantee.",
  alternates: {
    canonical: '/',
    languages: { 'en-IN': '/', 'x-default': '/' }
  },
  openGraph: {
    title:
      'Luxury Modular Kitchen in India | Magppie Wellness Kitchen | KBIS 2026',
    description:
      "Magppie crafts the world's first Wellness Kitchen in patented Silverstone™. India's most awarded modular kitchen, wardrobe and vanity. 25-year guarantee.",
    url: '/',
    images: [
      {
        url: '/og/magppie-og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Magppie Wellness Kitchen, built in Silverstone™ sintered stone'
      }
    ]
  },
  twitter: {
    title: 'Luxury Modular Kitchen in India | Magppie Wellness Kitchen',
    description:
      "Magppie's world-first Wellness Kitchen, built in patented Silverstone™. KBIS 2026 winner.",
    images: ['/og/magppie-og-default.jpg']
  }
};

export default function HomePage() {
  return (
    <>
      {/* Page-level structured data. Site-wide Organization + WebSite live
          in app/layout.tsx. The homepage carries the heaviest schema
          stack on the site:
          - Brand: explicit brand entity for Product references.
          - 9 LocalBusiness: one per India showroom city, so Magppie is
            eligible for every local-pack ("3-pack" map result) query
            from "luxury modular kitchen Delhi" to "kitchen brand
            Coimbatore" without needing dedicated city landing pages.
          - ItemList of showrooms: explicit ListItem so Google can
            present them as a carousel for "Magppie showrooms" queries.
          - Service: kitchen design consultation as a service offering,
            eligible for service rich results.
          - HowTo: design-a-Wellness-Kitchen step list, eligible for
            HowTo rich result and AI Overview ingestion.
          - FAQPage: eligible for SERP "People also ask".
          - VideoObject: Stacy McCarthy testimonial.
          - ImageObject: KBIS 2026 hero, licensable.
          - Breadcrumb. */}
      <JsonLd
        data={[
          brandSchema,
          ...allIndiaLocalBusinessSchemas,
          indiaShowroomsItemListSchema,
          designConsultationServiceSchema,
          howToDesignWellnessKitchenSchema,
          faqSchema,
          stacyTestimonialVideoSchema,
          kbisHeroImageSchema,
          breadcrumbSchema([{ name: 'Home', path: '/' }])
        ]}
      />

      {/* HERO */}
      <HeroVideo />

      {/* KBIS 2026 AWARD ANNOUNCEMENT, sits directly under the hero video.
          The dark register bridges from the hero into the editorial Wellness
          Movement section that follows. KBIS logo + headline + brief copy +
          link to the news story. */}
      <section className="bg-ink text-bone py-16 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-4 order-2 lg:order-1">
            <div className="kicker text-bone/55 mb-5 lg:mb-6">
              Recognised at KBIS 2026 · Orlando
            </div>
            <div className="relative h-16 sm:h-20 lg:h-24 w-[180px] sm:w-[200px] lg:w-[220px]">
              <Image
                src="/images/awards/KBIS.webp"
                alt="KBIS, Kitchen & Bath Industry Show 2026"
                fill
                quality={85}
                sizes="(min-width: 1024px) 220px, (min-width: 640px) 200px, 180px"
                className="object-contain object-left invert opacity-95"
              />
            </div>
          </div>
          <div className="lg:col-span-8 order-1 lg:order-2">
            <ScrollFloat
              as="h2"
              containerClassName="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl text-bone leading-[1.05]"
            >
              Most Unexpected{' '}
              <em className="not-italic text-bone/55">Innovation.</em>
            </ScrollFloat>
            <p className="mt-5 lg:mt-7 text-bone/70 max-w-2xl leading-relaxed">
              At the inaugural KBIS Innovation Hour, judged live by an
              audience of designers, media and industry professionals,
              Magppie Silverstone™ took the Most Unexpected category,
              placing alongside Caesarstone and LG as one of three global
              winners. Orlando, February&nbsp;17,&nbsp;2026.
            </p>
            <Link
              href="/news#kbis-2026"
              className="tap-link mt-7 lg:mt-9 text-sm hover-underline text-bone"
            >
              Read the announcement →
            </Link>
          </div>
        </div>
      </section>

      {/* INTRO STATEMENT, image (woman with leaf, cream wall right) sits
          behind. Text is pushed to col 6-12 so it lands on the empty cream
          side, never crossing the subject on the left. */}
      <section className="relative bg-bone py-24 lg:py-40 overflow-hidden">
        <Image
          src="/images/hero-below.webp"
          alt=""
          fill
          quality={88}
          sizes="100vw"
          /* Mobile crops to the cream-wall side (object 80% from left) so
             text stays readable. Desktop shows the full composition. */
          className="object-cover object-[80%_center] lg:object-center select-none pointer-events-none"
        />

        {/* Bottom blend, fades the image into bg-bone so the section flows
            into the tiles below instead of cutting off at a hard edge. Sits
            in just the lower edge of the image so most of the composition
            stays visible. */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 lg:h-24 bg-gradient-to-b from-transparent via-bone/40 to-bone"
        />

        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10 grid lg:grid-cols-12 gap-6 lg:gap-10">
          <div className="lg:col-span-7 lg:col-start-6">
            <div className="kicker text-smoke">A Wellness Movement</div>
            <ScrollFloat
              as="h2"
              containerClassName="mt-6 font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-ink"
            >
              {/* "nurtures" tinted to the deep sage-green of the leaf in the
                  background image, ties the headline to the visual. */}
              The world needs a new kitchen: one that
              <em className="not-italic text-[#5F6F45]"> nurtures </em>
              the people who live in it.
            </ScrollFloat>
            <p className="mt-8 lg:mt-10 text-base lg:text-lg text-ink/75 max-w-xl leading-relaxed">
              Every day, our food, air and homes are filled with unseen threats
              to our well-being. From the cabinets we cook in to the wardrobes
              we breathe near, the spaces that should nurture us are working
              against us. Magppie is not just a brand; it is a wellness movement,
              bringing deep impact through deep tech.
            </p>
            <Link
              href="/about"
              className="tap-link mt-8 lg:mt-10 text-sm hover-underline"
            >
              Discover the movement →
            </Link>
          </div>
        </div>
      </section>

      {/* THREE TILES, small pt to give the tiles a touch of breathing room.
          The bigger transition lift is handled by the bottom gradient inside
          the Wellness Movement section above, which fades its image into
          bg-bone, so the two sections feel continuous, not jammed. */}
      <section className="bg-bone pt-8 lg:pt-12 pb-20">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10 grid md:grid-cols-3 gap-2">
          <Tile
            href="/kitchens"
            title="Wellness Kitchens"
            image="/images/22.webp"
          />
          <Tile
            href="/wardrobes"
            title="Wellness Wardrobes"
            image="/images/wardrobes/concept-1.webp"
          />
          <Tile
            href="/vanities"
            title="Wellness Vanities"
            image="/images/vanities/onyx-gold-overmount.webp"
          />
        </div>
      </section>

      {/* Section break, hairline divider between the product tiles and the
          "Why Wellness Matters" editorial section below. Sits in a max-width
          container so it lines up with the rest of the page's content rhythm
          rather than running edge-to-edge. */}
      <div className="bg-bone">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <hr className="border-0 border-t border-ink/15" />
        </div>
      </div>

      {/* WHY WELLNESS MATTERS, editorial monograph layout: massive
          two-line heading → full-bleed cinematic kitchen photo → three
          confident numeric answers. No card grid, no comparison strips,
          no long paragraphs. Restraint over decoration. */}
      <section className="bg-bone py-24 lg:py-40">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">

          {/* Heading, editorial display, two lines, second line italic.
              "dangers of wood" tinted in warning red. Tight bottom margin so
              the kitchen photo sits flush below the headline (no bone gap
              before the scroll-driven takeover starts). */}
          <div className="max-w-4xl mb-6 lg:mb-8">
            <div className="kicker text-smoke mb-6 lg:mb-8">Why Wellness Matters</div>
            <ScrollFloat
              as="h2"
              containerClassName="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] leading-[1.02] text-ink"
            >
              The <span className="text-[#c2181f]">dangers of wood,</span>
              <br />
              <em className="not-italic text-smoke">solved in stone.</em>
            </ScrollFloat>
          </div>

        </div>

        {/* Captioned hero photo block. On mobile the previous 80vw cap +
            cinematic 2.36:1 ratio left the photo as a thin strip (~120px
            tall on a 360px phone). Now goes full-bleed inside px-6 with a
            shorter ratio so the kitchen reads as substantial; the desktop
            min(80vw,1400px) / 2.36:1 framing kicks in unchanged at lg. */}
        <div className="px-6 lg:px-0">
          <div className="mx-auto mb-4 lg:mb-5 flex justify-end w-full max-w-[1400px] lg:w-[min(80vw,1400px)]">
            <p className="font-display italic text-smoke text-base sm:text-lg lg:text-xl">
              Yes! This is a Magppie Kitchen.
            </p>
          </div>

          <div className="relative mx-auto overflow-hidden aspect-[3/2] sm:aspect-[16/9] lg:aspect-[2.36/1] w-full max-w-[1400px] lg:w-[min(80vw,1400px)]">
            <Image
              src="/images/kitchens/best-kitchen.webp"
              alt="Magppie Wellness Kitchen with skylights, built in Silverstone™"
              fill
              quality={92}
              sizes="(min-width: 1024px) 80vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 mt-8 lg:mt-12">

          {/* Three answers, no cards, no boxes. Just typography on bone.
              Hairline above sets them apart as a structured statement. */}
          <div className="grid md:grid-cols-3 gap-x-10 gap-y-14 lg:gap-x-20 border-t border-ink/15 pt-14 lg:pt-20">
            {PILLARS.map((p) => (
              <div key={p.label}>
                <ScrollFloat
                  as="div"
                  containerClassName="font-display text-6xl sm:text-7xl lg:text-8xl text-ink leading-none"
                >
                  {p.figure}
                </ScrollFloat>
                <div className="kicker text-smoke mt-5 lg:mt-7">
                  {p.label}
                </div>
                <p className="mt-5 lg:mt-6 text-ink/75 leading-relaxed text-[0.95rem] lg:text-base max-w-xs">
                  {p.body}
                </p>
                <div className="kicker text-smoke/55 mt-6 text-[0.65rem]">
                  {p.standard}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SILVERSTONE FEATURE */}
      <section className="bg-sand py-20 lg:py-40">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="kicker text-smoke mb-6">Silverstone™ Revolution</div>
            <ScrollFloat
              as="h2"
              containerClassName="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight text-ink"
            >
              Silver infused inside the stone, by nano technology.
            </ScrollFloat>
            <p className="mt-6 lg:mt-8 text-ink/70 leading-relaxed">
              Conventional wood-based kitchens are breeding grounds for
              termites, bacteria and fungi, and silently leak formaldehyde
              into our food and air. So we abandoned wood entirely. The result
              is Silverstone™: a certified, 100% bacteria-safe technical stone
              built from the antibacterial power of pure silver.
            </p>
            <Link
              href="/materials"
              className="tap-link mt-8 lg:mt-10 text-sm hover-underline"
            >
              Explore Silverstone™ →
            </Link>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="relative aspect-[4/3] overflow-hidden bg-ink">
              {/* Copper-and-silver nano-particle reveal, autoplays muted on
                  loop. Visualises the section copy: silver infused inside the
                  stone, by nano technology. The poster is a frame extracted
                  from the same video so there's no jarring swap once playback
                  starts. */}
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/images/copper-infused-silver-poster.webp"
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src="/videos/copper-infused-silver.webm" type="video/webm" />
                <source src="/videos/copper-infused-silver.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS GRID, bracketed by hairline section breaks above and
          below the 5-column promise list, so it reads as a self-contained
          ledger of credentials within the page rather than blending into
          the surrounding bone. */}
      <section className="bg-bone py-20 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="kicker text-smoke mb-4">The Wellness Promise</div>
          <ScrollFloat
            as="h2"
            containerClassName="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight text-ink max-w-3xl"
          >
            Built in stone. Guaranteed for 25 years. Serviced for 25 years.
          </ScrollFloat>

          {/* Top hairline, separates the heading from the credential grid */}
          <hr className="border-0 border-t border-ink/15 mt-12 lg:mt-16" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-ink/10">
            {BENEFITS.map((b) => (
              <div key={b.kicker} className="bg-bone p-6 sm:p-8">
                <div className="label text-smoke mb-4">{b.kicker}</div>
                <ul className="space-y-2 text-ink">
                  {b.items.map((i) => (
                    <li key={i} className="text-sm leading-relaxed">{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom hairline, closes the ledger */}
          <hr className="border-0 border-t border-ink/15" />
        </div>
      </section>

      {/* POOLSIDE KITCHEN BANNER, video starts at the 5-second mark and
          loops back to 5s on each cycle (skips the dead intro frames). */}
      <PoolsideKitchenBanner />

      {/* CUSTOMERS GALLERY */}
      <section className="bg-ink text-bone py-20 lg:py-36">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
          <div className="max-w-3xl mb-14 lg:mb-24">
            <ScrollFloat
              as="h2"
              containerClassName="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-bone leading-[1.05]"
            >
              Trusted by Those Who Inspire.
            </ScrollFloat>
            <p className="mt-6 text-bone/60 leading-relaxed max-w-2xl">
              From Mumbai towers to Delhi farmhouses, from Hyderabad estates to
              boardrooms in Dubai. Magppie is the quiet signature in the homes
              of people who build the culture we live in.
            </p>
          </div>
          <CustomersMarquee />
        </div>
      </section>

      {/* GLOBAL RECOGNITION */}
      <section className="bg-bone py-20 lg:py-32">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
          <div className="kicker text-smoke mb-6">Global Recognition</div>
          <ScrollFloat
            as="h2"
            containerClassName="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-ink max-w-5xl"
          >
            Recognised by the world&rsquo;s{' '}
            <span className="text-smoke">most prestigious</span> design bodies.
          </ScrollFloat>

          {(() => {
            const HERO_AWARDS = [
              'Most Unexpected Innovation Award, KBIS 2026 · Orlando',
              'Red Dot Best of the Best 2010',
              'iF International Design Award 2010, Germany',
              'EDIDA India, Best Kitchen 2013',
            ];
            const AWARDS = [
              'Red Dot Award 2007',
              'Red Dot Award 2008',
              'Red Dot Award 2009',
              'Quality Excellence Award, Paris',
              'MoMA Museum, San Francisco',
              'MCHI CREDAI Preferred Partner 2016',
              'TISE 2026, Las Vegas',
              'Home Show 2026, Miami',
            ];
            const MEMBERSHIPS = [
              'ISFA, International Surface Fabricators Association',
              'NKBA, National Kitchen & Bath Association',
              'NSI, National Stone Institute',
            ];
            return (
              <>
                {/* Award logos - lead with the trophy */}
                <div className="mt-14 mb-14">
                  <div className="label text-smoke/70 mb-8 text-[0.65rem]">
                    Featured In
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-x-10 sm:gap-x-16 lg:gap-x-28 gap-y-8 lg:gap-y-8">
                    {[
                      { src: '/images/awards/red_dot-logo.webp', label: 'Red Dot Design Award', caption: 'Germany' },
                      { src: '/images/awards/KBIS.webp', label: 'KBIS', caption: 'Kitchen & Bath Industry Show' },
                      { src: '/images/awards/if-design-awards.webp', label: 'iF Design Award', caption: 'International Forum' },
                    ].map((logo) => (
                      <div key={logo.src} className="flex flex-col items-start">
                        <div className="relative h-20 sm:h-24 lg:h-28 w-[180px] sm:w-[200px] lg:w-[220px] mb-4">
                          <Image
                            src={logo.src}
                            alt={logo.label}
                            fill
                            quality={80}
                            sizes="(min-width: 1024px) 220px, (min-width: 640px) 200px, 180px"
                            className="object-contain object-left"
                          />
                        </div>
                        <div className="text-[0.78rem] font-medium text-ink/85">
                          {logo.label}
                        </div>
                        <div className="text-[0.72rem] text-smoke mt-0.5">
                          {logo.caption}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Awards & Accolades + Memberships, sits right under the
                    Featured In logos so the reader scans the historical
                    record first, then lands on the KBIS spotlight below as
                    the closing crescendo. */}
                <div className="pt-10 border-t border-ink/10">
                  <div className="label text-smoke/70 mb-6 text-[0.65rem]">
                    Awards &amp; Accolades
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {HERO_AWARDS.map((a) => (
                      <li
                        key={a}
                        className="text-[0.72rem] sm:text-[0.78rem] font-semibold text-ink border border-ink/35 bg-bone px-3 sm:px-3.5 py-2"
                      >
                        {a}
                      </li>
                    ))}
                    {AWARDS.map((a) => (
                      <li
                        key={a}
                        className="text-[0.72rem] sm:text-[0.78rem] font-medium text-ink/65 border border-ink/10 bg-bone px-3 sm:px-3.5 py-2 hover:border-ink/30 transition-colors"
                      >
                        {a}
                      </li>
                    ))}
                  </ul>

                  <div className="label text-smoke/70 mt-8 mb-3 text-[0.65rem]">
                    Memberships
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {MEMBERSHIPS.map((m) => (
                      <li
                        key={m}
                        className="text-[0.78rem] font-medium text-ink/70 border border-ink/10 bg-sand/40 px-3.5 py-2 hover:border-ink/30 transition-colors"
                      >
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* KBIS 2026 spotlight, closes the recognition section as
                    the trophy moment. Photo on the left, editorial copy on
                    the right, both link to the full announcement on /news.
                    Top border + generous top spacing separates this from
                    the awards ledger above so it reads as its own beat. */}
                <div className="mt-14 lg:mt-20 pt-12 lg:pt-16 border-t border-ink/10">
                  <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-center">
                    {/* The win photo, hover-zoom + always-visible date and
                        venue stamp. Whole tile is clickable. */}
                    <Link
                      href="/news#kbis-2026"
                      aria-label="Read the full KBIS 2026 announcement"
                      className="lg:col-span-7 group relative block aspect-[4/3] overflow-hidden bg-ink"
                    >
                      <Image
                        src="/images/news/kbis/hero.webp"
                        alt="Magppie accepting the Most Unexpected award at KBIS 2026, Orlando"
                        fill
                        sizes="(min-width: 1024px) 60vw, 100vw"
                        quality={92}
                        className="object-cover tile-img"
                      />
                      <div className="absolute inset-x-0 bottom-0 px-6 py-5 lg:px-8 lg:py-7 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent text-bone">
                        {/* flex-wrap so on the narrowest phones (≤360px) the
                            location chip drops to its own line under the
                            date instead of clipping the venue text. */}
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                          <div className="kicker text-bone/90">
                            February 17, 2026
                          </div>
                          <div className="kicker text-bone/55 flex items-center gap-1.5">
                            <svg
                              width="11"
                              height="11"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                              className="shrink-0"
                            >
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            Orlando · USA
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Editorial copy. Headline, body, link CTA with arrow
                        that nudges right on hover. */}
                    <div className="lg:col-span-5">
                      <div className="kicker text-smoke mb-5">
                        KBIS Innovation Hour · Inaugural Edition
                      </div>
                      <ScrollFloat
                        as="h3"
                        containerClassName="font-display text-3xl sm:text-4xl lg:text-5xl text-ink leading-[1.05]"
                      >
                        Most Unexpected{' '}
                        <em className="not-italic italic text-smoke">
                          Innovation.
                        </em>
                      </ScrollFloat>
                      <p className="mt-5 lg:mt-7 text-ink/70 leading-relaxed">
                        At the inaugural KBIS Innovation Hour, judged live on
                        the NEXT Stage by an audience of designers, media and
                        industry, Magppie Silverstone&trade; took the Most
                        Unexpected category, chosen alongside Caesarstone
                        (Most Innovative) and LG (I&rsquo;d Spec That
                        Tomorrow) as one of three global winners. Hosted by
                        Sophie Donelson; presented for Magppie by Kishor
                        Rico, Director of US Operations.
                      </p>
                      <Link
                        href="/news#kbis-2026"
                        className="group tap-link mt-7 lg:mt-9 inline-block text-sm hover-underline"
                      >
                        Read the announcement{' '}
                        <span className="inline-block transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </section>

      {/* TESTIMONIAL - Stacy McCarthy with autoplay video */}
      <StacyTestimonial />

      {/* NEWS / STORIES */}
      <section className="bg-bone py-20 lg:py-32">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 lg:mb-12">
            <div>
              <div className="kicker text-smoke mb-3">Stories</div>
              <ScrollFloat
                as="h2"
                containerClassName="font-display text-3xl sm:text-4xl md:text-5xl text-ink"
              >
                From the Magppie journal.
              </ScrollFloat>
            </div>
            <Link href="/news" className="text-sm hover-underline tap-link">
              All stories →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <NewsCard
              image="/images/1.webp"
              date="Nov 2024"
              tag="Exhibition"
              title="Magppie at FOAID, New Delhi: the Wellness Kitchen unveiled"
            />
            <NewsCard
              image="/images/silverstone-nano-silver.webp"
              date="Apr 2026"
              tag="Innovation"
              title="Inside Silverstone™: nano-silver and the science of safer surfaces"
            />
            <NewsCard
              image="/images/vanities/02.webp"
              date="Apr 2026"
              tag="Design Partners"
              title="Karim Rashid, Stefan Diez & Cory Grosser join the Wellness Movement"
            />
          </div>
        </div>
      </section>

      {/* CATALOGS, sits between the Stories grid and the closing CTA, so the
          page funnels readers from journal → catalogues → consultation. */}
      <section className="bg-bone py-20 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 lg:mb-12">
            <div>
              <div className="kicker text-smoke mb-3">Library</div>
              <ScrollFloat
                as="h2"
                containerClassName="font-display text-3xl sm:text-4xl md:text-5xl text-ink leading-[1.05]"
              >
                Download the catalogs.
              </ScrollFloat>
            </div>
            <p className="text-ink/65 max-w-md sm:text-right text-sm">
              For your home, for your studio, for your archive.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-2">
            {CATALOGS.map((c) => {
              const isExternal = !!c.href && c.href !== '#';
              return (
                <a
                  key={c.name}
                  href={c.href ?? '#'}
                  {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
                  className="group flex items-center justify-between gap-4 sm:gap-8 p-6 sm:p-8 lg:p-10 bg-sandlight border hairline hover:bg-sand transition-colors"
                >
                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl text-ink leading-tight">{c.name}</h3>
                    <div className="text-sm text-smoke mt-3">{c.size}</div>
                  </div>
                  <div className="text-sm font-medium text-ink whitespace-nowrap group-hover:translate-x-2 transition-transform shrink-0">
                    Download →
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA, closing section, just before the footer */}
      <section className="bg-sandlight py-24 lg:py-44">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 text-center">
          <div className="kicker text-smoke mb-6">Begin</div>
          <ScrollFloat
            as="h2"
            containerClassName="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-ink leading-[1.02]"
          >
            Transform your kitchen.<br />
            Transform your health.
          </ScrollFloat>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center mt-10 lg:mt-12 px-8 lg:px-10 py-4 min-h-[48px] border border-ink text-ink kicker hover:bg-ink hover:text-bone transition-colors"
          >
            Book a Magppie consultation
          </Link>
        </div>
      </section>
    </>
  );
}

// `href` is optional, set it to a real PDF / Google Drive URL once the
// catalogue is published. Entries without an href fall back to "#" so the
// card still renders cleanly without 404'ing.
type Catalog = { name: string; size: string; href?: string };

const CATALOGS: Catalog[] = [
  {
    name: 'Wellness Kitchen: Master Catalog',
    size: '32 MB · PDF',
    href: 'https://drive.google.com/file/d/15TUpZW1IZHk3CBt95ljnOagN4TxwRwaa/view?usp=sharing'
  },
  {
    name: 'Wellness Homes',
    size: '18 MB · PDF',
    href: 'https://drive.google.com/file/d/1_IRFxezio4haWpPrN4TW0dSehoJXkBQ8/view?usp=sharing'
  }
];

function Tile({
  href,
  title,
  image
}: {
  href: string;
  title: string;
  image: string;
}) {
  return (
    <Link href={href} className="group relative block overflow-hidden aspect-[4/5] bg-ink">
      <Image
        src={image}
        alt={title}
        fill
        priority
        quality={95}
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover tile-img opacity-95 group-hover:opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 lg:p-10 text-bone">
        <div className="font-display md:whitespace-nowrap text-3xl sm:text-4xl lg:text-[2.6rem] xl:text-5xl">
          {title}
        </div>
        {/* Hover-only "Discover →", desktop only, mobile users tap the tile */}
        <div className="hidden lg:block text-sm mt-3 lg:mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          Discover →
        </div>
      </div>
    </Link>
  );
}

function NewsCard({
  image,
  date,
  tag,
  title
}: {
  image: string;
  date: string;
  tag: string;
  title: string;
}) {
  return (
    <article className="group cursor-pointer">
      <div className="relative aspect-[4/5] overflow-hidden bg-sand">
        <Image
          src={image}
          alt={title}
          fill
          quality={92}
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover tile-img"
        />
      </div>
      <div className="mt-6 flex items-center gap-3 text-[0.78rem] text-smoke">
        <span>{date}</span>
        <span className="w-6 h-px bg-smoke/40" />
        <span>{tag}</span>
      </div>
      <h3 className="mt-3 font-display text-2xl lg:text-3xl text-ink leading-snug">
        {title}
      </h3>
      <span className="tap-link mt-4 text-sm hover-underline">Read story →</span>
    </article>
  );
}

// "Why Wellness Matters", three Magppie pillars expressed as confident
// numeric / single-word answers (Zero. Zero. 25 years.). No long body
// paragraphs, no comparison strips, typography carries the argument.
const PILLARS = [
  {
    figure: 'Zero',
    label: 'Formaldehyde',
    body: 'Inert stone. Nothing to off-gas, nothing for your family to breathe in.',
    standard: 'ASTM E-2180 certified'
  },
  {
    figure: 'Zero',
    label: 'Absorption',
    body: 'Non-porous. Water beads off. Mould has nothing to feed on.',
    standard: 'BS EN 12390 tested'
  },
  {
    figure: '25 yrs',
    label: 'Guaranteed',
    body: 'No cellulose to chew, no fibre to decay. Standing for the life of your home.',
    standard: '25-year unconditional promise'
  }
];

const BENEFITS = [
  {
    kicker: 'Health',
    items: ['100% Bacteria Safe', '100% Virus Safe', '100% Fungal Safe', '100% Termite Proof']
  },
  {
    kicker: 'Resistance',
    items: ['Scratch Proof', 'Stain Proof', 'Water Proof', 'High-Temperature Resistant']
  },
  {
    kicker: 'Environment',
    items: ['Ecological', '100% Recyclable', 'Zero Deforestation', 'Zero Mining']
  },
  {
    kicker: 'Safety',
    items: ['Heat Resistant', 'Fire Resistant', 'Zero Formaldehyde', 'Zero VOC']
  },
  {
    kicker: 'Promise',
    items: ['25-Year Guarantee', '25 Complimentary Services', 'Lifetime Care', 'Patented Technology']
  }
];
