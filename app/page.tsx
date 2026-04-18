import Image from 'next/image';
import Link from 'next/link';
import HeroVideo from '@/components/HeroVideo';
import CustomersMarquee from '@/components/CustomersMarquee';

export default function HomePage() {
  return (
    <>
      {/* HERO ─────────────────────────────────────────────── */}
      <HeroVideo />

      {/* INTRO STATEMENT ──────────────────────────────────── */}
      <section className="bg-bone py-28 lg:py-40">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <div className="kicker text-smoke">A Wellness Movement</div>
          </div>
          <div className="lg:col-span-8">
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.05] text-ink">
              The world needs a new kitchen — one that
              <em className="not-italic text-smoke"> nurtures </em>
              the people who live in it.
            </h2>
            <p className="mt-10 text-lg text-ink/70 max-w-2xl leading-relaxed">
              Every day, our food, air and homes are filled with unseen threats
              to our well-being. From the cabinets we cook in to the wardrobes
              we breathe near — the spaces that should nurture us are working
              against us. Magppie is not just a brand; it is a wellness movement,
              bringing deep impact through deep tech.
            </p>
            <Link
              href="/about"
              className="inline-block mt-10 kicker hover-underline"
            >
              Discover the movement →
            </Link>
          </div>
        </div>
      </section>

      {/* THREE TILES ──────────────────────────────────────── */}
      <section className="bg-bone pb-20">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10 grid md:grid-cols-3 gap-2">
          <Tile
            href="/kitchens"
            kicker="01 — Wellness"
            title="Kitchens"
            image="/images/22.jpg"
          />
          <Tile
            href="/wardrobes"
            kicker="02 — Wellness"
            title="Wardrobes"
            image="/images/wardrobes/concept-1.webp"
          />
          <Tile
            href="/vanities"
            kicker="03 — Wellness"
            title="Vanities"
            image="/images/vanities/onyx-gold-overmount.webp"
          />
        </div>
      </section>

      {/* SILVERSTONE FEATURE ──────────────────────────────── */}
      <section className="bg-sand py-28 lg:py-40">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="kicker text-smoke mb-6">Silverstone™ Revolution</div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight text-ink">
              Silver infused inside the stone, by nano technology.
            </h2>
            <p className="mt-8 text-ink/70 leading-relaxed">
              Conventional wood-based kitchens are breeding grounds for
              termites, bacteria and fungi — and silently leak formaldehyde
              into our food and air. So we abandoned wood entirely. The result
              is Silverstone™: a certified, 100% bacteria-safe technical stone
              built from the antibacterial power of pure silver.
            </p>
            <Link
              href="/materials"
              className="inline-block mt-10 kicker hover-underline"
            >
              Explore Silverstone™ →
            </Link>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/01-copy.jpg"
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

      {/* BENEFITS GRID ────────────────────────────────────── */}
      <section className="bg-bone py-28 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="kicker text-smoke mb-4">The Wellness Promise</div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight text-ink max-w-3xl">
            Built in stone. Guaranteed for 25 years. Serviced for 25 years.
          </h2>
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-ink/10">
            {BENEFITS.map((b) => (
              <div key={b.kicker} className="bg-bone p-8">
                <div className="kicker text-smoke mb-4">{b.kicker}</div>
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

      {/* OUTDOOR KITCHEN BANNER ───────────────────────────── */}
      <section className="relative h-[80vh] overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/images/02.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/pool-area-1.webm" type="video/webm" />
          <source src="/videos/pool-area-1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10 pb-20 w-full">
            <div className="kicker text-bone/80 mb-6">Concept</div>
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-bone leading-none max-w-4xl">
              The Outdoor Kitchen.
            </h2>
            <Link
              href="/kitchens#outdoor"
              className="inline-block mt-10 kicker text-bone hover-underline"
            >
              Experience the concept →
            </Link>
          </div>
        </div>
      </section>

      {/* CUSTOMERS MARQUEE ───────────────────────────────── */}
      <section className="bg-ink text-bone py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 mb-12">
          <div className="kicker text-bone/50 mb-4">Trusted By</div>
          <h2 className="font-display text-4xl md:text-5xl text-bone leading-tight">
            India&rsquo;s most discerning families and global design icons.
          </h2>
        </div>
        <CustomersMarquee />
      </section>

      {/* NEWS / STORIES ──────────────────────────────────── */}
      <section className="bg-bone py-28 lg:py-32">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="kicker text-smoke mb-3">Stories</div>
              <h2 className="font-display text-4xl md:text-5xl text-ink">
                From the Magppie journal.
              </h2>
            </div>
            <Link href="/news" className="kicker hover-underline">
              All stories →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <NewsCard
              image="/images/1.jpg"
              date="Nov 2024"
              tag="Exhibition"
              title="Magppie at FOAID, New Delhi — the Wellness Kitchen unveiled"
            />
            <NewsCard
              image="/images/Hailuo_Image_Create-a-different-Angle-for-t_488492364996386825.jpg"
              date="Apr 2026"
              tag="Innovation"
              title="Inside Silverstone™: nano-silver and the science of safer surfaces"
            />
            <NewsCard
              image="/images/vanities/02.jpg"
              date="Apr 2026"
              tag="Design Partners"
              title="Karim Rashid, Stefan Diez & Cory Grosser join the Wellness Movement"
            />
          </div>
        </div>
      </section>

      {/* CTA ─────────────────────────────────────────────── */}
      <section className="bg-sandlight py-32 lg:py-44">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 text-center">
          <div className="kicker text-smoke mb-6">Begin</div>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-ink leading-[1.02]">
            Transform your kitchen.<br />
            Transform your health.
          </h2>
          <Link
            href="/contact"
            className="inline-block mt-12 px-10 py-4 border border-ink text-ink kicker hover:bg-ink hover:text-bone transition-colors"
          >
            Book a Magppie consultation
          </Link>
        </div>
      </section>
    </>
  );
}

function Tile({
  href,
  kicker,
  title,
  image
}: {
  href: string;
  kicker: string;
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
      <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10 text-bone">
        <div className="kicker text-bone/80 mb-3">{kicker}</div>
        <div className="font-display text-4xl lg:text-5xl">{title}</div>
        <div className="kicker mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
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
      <div className="mt-6 flex items-center gap-3 kicker text-smoke">
        <span>{date}</span>
        <span className="w-6 h-px bg-smoke/40" />
        <span>{tag}</span>
      </div>
      <h3 className="mt-3 font-display text-2xl lg:text-3xl text-ink leading-snug">
        {title}
      </h3>
      <span className="inline-block mt-4 kicker hover-underline">Read story →</span>
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
