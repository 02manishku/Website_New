import Image from 'next/image';
import Link from 'next/link';
import HeroVideo from '@/components/HeroVideo';
import CustomersMarquee from '@/components/CustomersMarquee';
import StacyTestimonial from '@/components/StacyTestimonial';

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <HeroVideo />

      {/* INTRO STATEMENT — image (woman with leaf, cream wall right) sits
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

        {/* Bottom blend — fades the image into bg-bone so the section flows
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
            <h2 className="mt-6 font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-ink">
              The world needs a new kitchen: one that
              {/* "nurtures" tinted to the deep sage-green of the leaf in the
                  background image — ties the headline to the visual. */}
              <em className="not-italic text-[#5F6F45]"> nurtures </em>
              the people who live in it.
            </h2>
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

      {/* THREE TILES — small pt to give the tiles a touch of breathing room.
          The bigger transition lift is handled by the bottom gradient inside
          the Wellness Movement section above, which fades its image into
          bg-bone — so the two sections feel continuous, not jammed. */}
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

      {/* WHY WELLNESS MATTERS */}
      <section className="bg-bone py-20 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="kicker text-smoke mb-6">Why Wellness Matters</div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-ink max-w-4xl">
            What happens quietly inside a conventional{' '}
            <span className="font-bold text-[#c2181f]">wood</span>
            <span className="text-smoke font-sans font-normal">-</span>
            <span className="text-smoke">based kitchen ?</span>
          </h2>
          <p className="mt-8 max-w-2xl text-ink/70 leading-relaxed">
            Most modular kitchens in India are built in compressed wood, MDF,
            plywood, particle board. These kitchens are not safe for our
            families. Let&rsquo;s know why.
          </p>

          <div className="mt-12 lg:mt-16 grid md:grid-cols-3 gap-px bg-ink/10">
            {[
              {
                n: '01',
                title: 'Formaldehyde emissions',
                body: 'Compressed wood, MDF, plywood, particle board, continuously off-gases formaldehyde, classified by the World Health Organisation as a Group 1 carcinogen. This happens silently, every day, in the room where your family cooks and breathes.',
                wood: 'Wood, released daily',
                stone: 'Silverstone™, zero emissions',
              },
              {
                n: '02',
                title: 'Moisture, mould & fungus',
                body: 'Wood is porous. It absorbs steam and moisture from every meal. Over 2–3 years, mould begins growing inside cabinets, invisible to the eye, releasing spores into the air your family breathes.',
                wood: 'Wood, absorbs moisture',
                stone: 'Silverstone™, zero absorption',
              },
              {
                n: '03',
                title: 'Termites & decay',
                body: 'Termites eat wood from the inside out, silently, invisibly. By the time the damage is visible, the cabinetry structure is often irreparable. Most families replace their kitchen within ten years.',
                wood: 'Wood, termite risk',
                stone: 'Silverstone™, termite-proof',
              },
            ].map((c) => (
              <div key={c.n} className="bg-bone p-6 sm:p-8 lg:p-10 flex flex-col">
                <div className="font-display text-4xl lg:text-5xl text-ink/25 mb-4 lg:mb-6">
                  {c.n}
                </div>
                <h3 className="font-display text-xl sm:text-2xl lg:text-[1.65rem] text-ink leading-snug">
                  {c.title}
                </h3>
                <p className="mt-3 lg:mt-4 text-ink/70 leading-relaxed text-[0.9rem] lg:text-[0.95rem]">
                  {c.body}
                </p>
                <div className="mt-auto pt-6 lg:pt-10 space-y-2 text-[0.78rem] lg:text-[0.8rem]">
                  <div className="flex items-center gap-3 text-smoke">
                    <span className="w-5 h-px bg-smoke/60" />
                    <span>{c.wood}</span>
                  </div>
                  <div className="flex items-center gap-3 text-ink">
                    <span className="w-5 h-px bg-ink" />
                    <span>{c.stone}</span>
                  </div>
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
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight text-ink">
              Silver infused inside the stone, by nano technology.
            </h2>
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
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/01-copy.webp"
                alt="Silverstone island in Magppie Wellness Kitchen"
                fill
                quality={95}
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS GRID */}
      <section className="bg-bone py-20 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="kicker text-smoke mb-4">The Wellness Promise</div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight text-ink max-w-3xl">
            Built in stone. Guaranteed for 25 years. Serviced for 25 years.
          </h2>
          <div className="mt-12 lg:mt-16 grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-ink/10">
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
        </div>
      </section>

      {/* OUTDOOR KITCHEN BANNER */}
      <section className="relative h-[65vh] min-h-[420px] lg:h-[80vh] overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/images/02.webp"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/pool-area-1.webm" type="video/webm" />
          <source src="/videos/pool-area-1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 pb-14 lg:pb-20 w-full">
            <div className="label text-bone/80 mb-4 lg:mb-6">Concept</div>
            <h2 className="font-display md:whitespace-nowrap text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-bone leading-[1.02] lg:leading-none">
              The Poolside Kitchen.
            </h2>
            <Link
              href="/kitchens#outdoor"
              className="inline-block mt-8 lg:mt-10 text-sm text-bone hover-underline"
            >
              Experience the concept →
            </Link>
          </div>
        </div>
      </section>

      {/* CUSTOMERS GALLERY */}
      <section className="bg-ink text-bone py-20 lg:py-36">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
          <div className="max-w-3xl mb-14 lg:mb-24">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-bone leading-[1.05]">
              Trusted by Those Who Inspire.
            </h2>
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
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-ink max-w-5xl">
            Recognised by the world&rsquo;s{' '}
            <span className="text-smoke">most prestigious</span> design bodies.
          </h2>

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
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink">
                From the Magppie journal.
              </h2>
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

      {/* CATALOGS — sits between the Stories grid and the closing CTA, so the
          page funnels readers from journal → catalogues → consultation. */}
      <section className="bg-bone py-20 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 lg:mb-12">
            <div>
              <div className="kicker text-smoke mb-3">Library</div>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink leading-[1.05]">
                Download the catalogs.
              </h2>
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

      {/* CTA — closing section, just before the footer */}
      <section className="bg-sandlight py-24 lg:py-44">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 text-center">
          <div className="kicker text-smoke mb-6">Begin</div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-ink leading-[1.02]">
            Transform your kitchen.<br />
            Transform your health.
          </h2>
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

// `href` is optional — set it to a real PDF / Google Drive URL once the
// catalogue is published. Entries without an href fall back to "#" so the
// card still renders cleanly without 404'ing.
type Catalog = { name: string; size: string; href?: string };

const CATALOGS: Catalog[] = [
  {
    name: 'Wellness Kitchen: Master Catalog',
    size: '32 MB · PDF',
    href: 'https://drive.google.com/file/d/15TUpZW1IZHk3CBt95ljnOagN4TxwRwaa/view?usp=sharing'
  },
  { name: 'Wellness Wardrobe: Concepts', size: '18 MB · PDF' },
  { name: 'Silverstone™ Finishes Brochure', size: '24 MB · PDF' },
  { name: 'Outdoor Kitchen Concepts', size: '12 MB · PDF' }
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
        {/* Hover-only "Discover →" — desktop only, mobile users tap the tile */}
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
