'use client';

import Image from 'next/image';
import { useState } from 'react';
import CountUp from '@/components/CountUp';

type Person = {
  name: string;
  subtitle?: string;
  src: string;
};

// Ordered by public profile / global recognition.
// Mukesh & Anant Ambani (Reliance, world's wealthiest families) lead, followed
// by M S Dhoni (global cricket icon), then Bollywood, politics, and founders.
const FAMILIES: Person[] = [
  { name: 'Mukesh Ambani',   subtitle: 'Reliance',        src: '/images/people/mukesh_ambani.webp' },
  { name: 'Anant Ambani',    subtitle: 'Reliance',        src: '/images/people/anant_ambani_.webp' },
  { name: 'M S Dhoni',       subtitle: 'Cricket Legend',  src: '/images/people/MS_Dhoni.webp' },
  { name: 'Shilpa Shetty',   subtitle: 'Actor',           src: '/images/people/shilpa_shetty.webp' },
  { name: 'Nitin Gadkari',   subtitle: 'Union Minister',  src: '/images/people/nitin_gadkari.webp' },
  { name: 'Kamal Nath',      subtitle: 'Statesman',       src: '/images/people/kamal_Nath.webp' },
  { name: 'Akhil Akkineni',  subtitle: 'Actor',           src: '/images/people/akhil_akkineni.webp' },
  { name: 'Peyush Bansal',   subtitle: 'Lenskart',        src: '/images/people/peyush_bansal.webp' },
  { name: 'Rizwan Sajan',    subtitle: 'Danube Group',    src: '/images/people/rizwan_sajan.webp' },
  { name: 'Ritesh Malik',    subtitle: 'Innov8',          src: '/images/people/ritesh_malik.webp' },
  { name: 'Rushi Ajmera',    subtitle: 'Ajmera Realty',   src: '/images/people/rushi_ajmera.webp' },
];

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function PortraitCard({
  person,
  priority = false,
}: {
  person: Person;
  priority?: boolean;
}) {
  const [errored, setErrored] = useState(false);

  return (
    <figure className="group relative">
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-smoke/40 to-ink">
        {!errored ? (
          <Image
            src={person.src}
            alt={person.name}
            fill
            quality={82}
            priority={priority}
            loading={priority ? undefined : 'lazy'}
            sizes="(min-width: 1024px) 18vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover grayscale"
            onError={() => setErrored(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-5xl sm:text-6xl lg:text-7xl text-bone/25 tracking-wider">
              {initials(person.name)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent pointer-events-none" />
      </div>
      <figcaption className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-5">
        <div className="font-display text-bone text-base sm:text-lg lg:text-xl leading-tight">
          {person.name}
        </div>
        {person.subtitle && (
          // Bumped from 0.72rem (~11.5px) to text-xs (12px) on the smallest
          // breakpoint, sub-12px feels strained on phones at glance speed.
          <div className="text-xs sm:text-[0.78rem] text-bone/70 mt-1">
            {person.subtitle}
          </div>
        )}
      </figcaption>
    </figure>
  );
}

export default function CustomersMarquee() {
  return (
    <div>
      <div className="flex items-end justify-between mb-8 lg:mb-10">
        <div className="label text-bone/55">
          Families <span className="text-bone/20 mx-2">·</span>{' '}
          <span className="text-bone/30">India &amp; Abroad</span>
        </div>
        <div className="hidden lg:block text-bone/30 text-xs">
          {FAMILIES.length} homes
        </div>
      </div>
      {/* No portrait gets `priority` — the customers grid sits far below
          the fold (after hero, KBIS, Wellness Movement intro, three
          tiles, Why Wellness Matters, Wellness Revolution, Wellness
          Promise, Poolside banner). Preloading any of these would block
          LCP-critical assets above. Each <Image> lazy-loads naturally
          as it scrolls toward view. */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
        {FAMILIES.map((p) => (
          <PortraitCard key={p.src} person={p} priority={false} />
        ))}
        <figure className="group relative">
          <div className="relative aspect-[3/4] overflow-hidden bg-white flex items-center justify-center">
            <div className="text-center px-3 sm:px-4">
              <div className="font-display text-ink text-2xl sm:text-3xl lg:text-4xl leading-none">
                <CountUp
                  to={28000}
                  suffix="+"
                  suffixClassName="font-light"
                />
              </div>
              <div className="text-[0.72rem] sm:text-[0.78rem] text-smoke mt-2 sm:mt-3">
                Private Clients
              </div>
            </div>
          </div>
          <figcaption className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-5">
            <div className="font-display text-ink text-base sm:text-lg lg:text-xl leading-tight">
              &amp; many more.
            </div>
            <div className="text-xs sm:text-[0.78rem] text-smoke mt-1">
              Across India &amp; the World
            </div>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
