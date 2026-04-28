import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import LocationsSection from '@/components/LocationsSection';

export const metadata = {
  title: 'The Wellness Movement | Magppie',
  description:
    'Magppie is not just a brand; it is a wellness movement. Bringing deep impact through deep tech innovations.'
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        kicker="About Us"
        title="A Wellness Movement."
        image="/images/02.webp"
        video="/videos/classical-ceiling.mp4"
        subtitle="For people and planet: bringing deep impact through deep tech."
      />

      {/* Manifesto */}
      <section className="bg-bone py-20 lg:py-40">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 text-center">
          <div className="kicker text-smoke mb-6">Manifesto</div>
          <p className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight text-ink">
            Every day, our planet becomes more toxic. Our food, water, air and
            our homes are filled with unseen threats. The spaces that should
            nurture us are working against us. Magppie is the answer, built
            to bring authentic, health-conscious solutions into every aspect
            of your home and daily life, helping you live longer and healthier.
          </p>
        </div>
      </section>

      {/* The Team */}
      <section className="bg-ink text-bone py-20 lg:py-36">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
          <div className="max-w-3xl mb-12 lg:mb-20">
            <div className="kicker text-bone/50 mb-6">The People</div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-bone leading-[1.05]">
              The architects of the movement.
            </h2>
            <p className="mt-6 text-bone/60 leading-relaxed max-w-2xl">
              A studio of engineers, designers and entrepreneurs across three
              continents. Quietly redefining what a home, and the people inside
              it, deserve.
            </p>
          </div>

          {(() => {
            const TEAM = [
              { name: 'Vinod Jain',        role: 'Founder & CEO',                     slug: 'vinod-jain',        src: '/images/team/vinod-jain.webp',        featured: true },
              { name: 'Kishor Rico',       role: 'Director · US Operations',          slug: 'kishor-rico',       src: '/images/team/kishor-rico.webp' },
              { name: 'Fernando Rico',     role: 'Director · Market Development',     slug: 'fernando-rico',     src: '/images/team/fernando-rico.webp' },
              { name: 'Riccardo Remedi',   role: 'Director · Magppie Europe',         slug: 'riccardo-remedi',   src: '/images/team/riccardo-remedi.webp' },
              { name: 'Ivan Kolomyiko',    role: 'Partner · Florida',                 slug: 'ivan-kolomyiko',    src: '/images/team/ivan-kolomyiko.webp' },
              { name: 'Stacy McCarthy',    role: 'Design Consultant',                 slug: 'stacy-mccarthy',    src: '/images/team/stacy-mccarthy.webp' },
              { name: 'Chaitanya Chavda',  role: 'Technical Director · USA',          slug: 'chaitanya-chavda',  src: '/images/team/chaitanya-chavda.webp' },
              { name: 'Ishat Jain',        role: 'Director · Marketing',              slug: 'ishat-jain',        src: '/images/team/ishat-jain.webp' },
              { name: 'Vikas Jain',        role: 'Director · Innovations',            slug: 'vikas-jain',        src: '/images/team/vikas-jain.webp' },
              { name: 'Christoph Hoeynck', role: 'Director · Germany',                slug: 'christoph-hoeynck', src: '/images/team/christoph-hoeynck.webp' },
              { name: 'Susan Sadolin',     role: 'Sales Director · USA & Denmark',    slug: 'susan-sadolin',     src: '/images/team/susan-sadolin.webp' },
            ];

            const initials = (n: string) =>
              n.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

            return (
              <>
                {/* Featured founder */}
                {TEAM.filter((m) => m.featured).map((m) => (
                  <div
                    key={m.slug}
                    className="flex flex-col lg:flex-row gap-6 lg:gap-12 mb-12 lg:mb-20 items-start lg:items-end justify-center mx-auto max-w-5xl"
                  >
                    <div className="w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[340px] shrink-0">
                      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-smoke/30 to-ink">
                        {m.src ? (
                          <Image
                            src={m.src}
                            alt={m.name}
                            fill
                            priority
                            sizes="(min-width: 1024px) 340px, (min-width: 640px) 320px, 280px"
                            quality={88}
                            className="object-cover grayscale"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="font-display text-8xl text-bone/20 tracking-wider">
                              {initials(m.name)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 max-w-xl">
                      <div className="label text-bone/50 mb-4">Founder</div>
                      <h3 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-bone leading-[1.05]">
                        {m.name}
                      </h3>
                      <div className="text-sm text-bone/65 mt-4">
                        {m.role}
                      </div>
                      <div className="mt-6 lg:mt-8 h-px w-16 bg-bone/30" />
                      <p className="mt-6 lg:mt-8 text-bone/60 leading-relaxed">
                        Two decades building a company that refuses the
                        shortcuts the industry takes. The reason Silverstone™
                        exists, and the reason it keeps getting better.
                      </p>
                    </div>
                  </div>
                ))}

                {/* Rest of team */}
                <div className="label text-bone/45 mb-6 pt-2 border-t border-bone/10 max-w-6xl mx-auto">
                  Directors &amp; Partners
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4 max-w-6xl mx-auto">
                  {TEAM.filter((m) => !m.featured).map((m) => (
                    <figure key={m.slug} className="group">
                      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-smoke/30 to-ink">
                        {m.src ? (
                          <Image
                            src={m.src}
                            alt={m.name}
                            fill
                            sizes="(min-width: 1024px) 19vw, (min-width: 640px) 33vw, 50vw"
                            quality={82}
                            className="object-cover grayscale"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="font-display text-5xl lg:text-6xl text-bone/25 tracking-wider">
                              {initials(m.name)}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent pointer-events-none" />
                      </div>
                      <figcaption className="mt-3">
                        <div className="font-display text-bone text-base sm:text-lg leading-tight">
                          {m.name}
                        </div>
                        <div className="text-[0.75rem] sm:text-[0.8rem] text-bone/60 mt-1">
                          {m.role}
                        </div>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      </section>

      {/* Promise pillars */}
      <section className="bg-sand py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="kicker text-smoke mb-4">The Magppie Promise</div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink">
            Three commitments. One movement.
          </h2>
          <div className="mt-12 lg:mt-16 grid md:grid-cols-3 gap-px bg-ink/10">
            {[
              { t: 'Wellness Built in Stone', c: 'World’s first kitchens and wardrobes fully built in our patented anti-bacterial stone: Silverstone™.' },
              { t: '25-Year Guarantee', c: 'A robust 25-year guarantee, a reflection of our commitment to your long-term satisfaction.' },
              { t: '25 Complimentary Services', c: 'One complimentary service every year for 25 years, to maintain the longevity of your investment.' }
            ].map((b) => (
              <div key={b.t} className="bg-bone p-6 sm:p-8 lg:p-10">
                <h3 className="font-display text-xl sm:text-2xl text-ink mb-4">{b.t}</h3>
                <p className="text-sm text-ink/70 leading-relaxed">{b.c}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Save the planet */}
      <section className="bg-bone py-20 lg:py-40">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/01-copy.webp"
                alt="Magppie kitchen built in Silverstone™, zero deforestation"
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="kicker text-smoke mb-6">For the Planet</div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink leading-tight">
              No deforestation. No mining. No compromise.
            </h2>
            <p className="mt-6 text-ink/70 leading-relaxed">
              Compressed wood (MDF, particle board, plyboard) leads to
              deforestation. Natural granite and marble come from mining.
              Magppie Silverstone™ needs neither. By saying &lsquo;no&rsquo;
              to compressed wood and natural stones, we protect our planet
              from both wounds.
            </p>
          </div>
        </div>
      </section>

      {/* Locations - HQ, factory & city studios on an interactive globe */}
      <LocationsSection />

      {/* Certifications */}
      <section className="bg-sand py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="kicker text-smoke mb-4">Certifications</div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink leading-tight max-w-3xl">
            Independently certified by Shree Ram Testing Laboratories
            (ISO 14001:2015 & ISO 9001:2015).
          </h2>
          <div className="mt-10 lg:mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-ink/10">
            {[
              { t: 'Anti-Bacterial', c: 'Tested per ASTM E-2180: confirmed 100% bacteria-safe.' },
              { t: 'Water & Weather Proofing', c: 'Tested per BS EN 12390: zero permeability under pressure.' },
              { t: 'Scratch / Stain / Heat / Impact', c: 'Class 1 across all resistance tests. Zero formaldehyde. Anti-termite.' },
              { t: 'Fire Rating', c: 'Class A flame spread index per ASTM E-84.' }
            ].map((b) => (
              <div key={b.t} className="bg-bone p-6 sm:p-8">
                <div className="label text-smoke mb-3">Test Report</div>
                <h3 className="font-display text-xl sm:text-2xl text-ink mb-3">{b.t}</h3>
                <p className="text-sm text-ink/60 leading-relaxed">{b.c}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Design Partners */}
      <section className="bg-ink text-bone py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="kicker text-bone/50 mb-4">Global Design Partners</div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl leading-tight max-w-4xl">
            We collaborate with the world&rsquo;s most quietly influential designers.
          </h2>
          <div className="mt-12 lg:mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {[
              { n: 'Karim Rashid',     l: 'USA' },
              { n: 'Stefan Diez',      l: 'Germany' },
              { n: 'Cory Grosser',     l: 'USA' },
              { n: 'Rémi Bouhaniche',  l: 'France' }
            ].map((p) => (
              <div key={p.n} className="border-t border-bone/20 pt-6">
                <div className="text-[0.78rem] text-bone/55 mb-2">{p.l}</div>
                <div className="font-display text-2xl sm:text-3xl text-bone">{p.n}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-sandlight py-20 lg:py-28 text-center">
        <div className="mx-auto max-w-[1000px] px-6 lg:px-10">
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl text-ink leading-tight">
            Be a part of the Wellness Movement.
          </h2>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center mt-8 lg:mt-10 px-8 lg:px-10 py-4 min-h-[48px] border border-ink text-ink kicker hover:bg-ink hover:text-bone transition-colors"
          >
            Talk to Magppie
          </Link>
        </div>
      </section>
    </>
  );
}
