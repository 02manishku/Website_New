'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const NAV = [
  {
    label: 'Kitchens',
    href: '/kitchens',
    sub: [
      { label: 'Wellness Kitchen', href: '/kitchens#wellness' },
      { label: 'Outdoor Kitchen', href: '/kitchens#outdoor' },
      { label: 'Patented Lighting', href: '/kitchens#lighting' },
      { label: '23 Accessories', href: '/kitchens#accessories' }
    ]
  },
  {
    label: 'Wardrobes',
    href: '/wardrobes',
    sub: [
      { label: 'Wellness Wardrobe', href: '/wardrobes#wellness' },
      { label: '13 Accessories', href: '/wardrobes#accessories' }
    ]
  },
  {
    label: 'Vanities',
    href: '/vanities',
    sub: [
      { label: 'Wellness Vanity', href: '/vanities#wellness' },
      { label: 'Stone Finishes', href: '/vanities#finishes' }
    ]
  },
  { label: 'Company', href: '/about' },
  { label: 'Catalogs', href: '/catalogs' },
  { label: 'News', href: '/news' }
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // While at the top of any page, every page begins with a dark/visual hero —
  // so the header text needs to be light. After scroll, switch to the bone bar.
  const onLight = scrolled || open;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        onLight
          ? 'bg-bone/95 backdrop-blur border-b hairline'
          : 'bg-gradient-to-b from-ink/40 to-transparent'
      }`}
    >
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center" aria-label="Magppie home">
            {/* Two logos, swapped by scroll state.
                Black PNG (1267x655) has the ® mark stacked, so it needs ~2x
                the height of the white SVG (1080x246) to match visually. */}
            <Image
              src={onLight ? '/logos/magppie-black.png' : '/logos/magppie-white.svg'}
              alt="Magppie"
              width={onLight ? 280 : 160}
              height={onLight ? 145 : 36}
              priority
              className={`w-auto transition-all duration-300 ${
                onLight ? 'h-14 lg:h-16' : 'h-7 lg:h-8'
              }`}
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {NAV.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setHovered(item.label)}
                onMouseLeave={() => setHovered(null)}
              >
                <Link
                  href={item.href}
                  className={`kicker hover-underline transition-colors ${
                    onLight ? 'text-ink' : 'text-bone drop-shadow-sm'
                  }`}
                >
                  {item.label}
                </Link>
                {item.sub && hovered === item.label && (
                  <div className="absolute top-full left-0 pt-6">
                    <div className="bg-bone border hairline shadow-sm min-w-[240px] py-3">
                      {item.sub.map((s) => (
                        <Link
                          key={s.href}
                          href={s.href}
                          className="block px-5 py-2 text-sm text-ink/80 hover:text-ink hover:bg-sand/40 transition-colors"
                        >
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="/contact"
              className={`kicker hover-underline transition-colors ${
                onLight ? 'text-ink' : 'text-bone'
              }`}
            >
              Contact
            </Link>
            <span
              className={`kicker transition-colors ${
                onLight ? 'text-ink/40' : 'text-bone/60'
              }`}
            >
              EN
            </span>
          </div>

          <button
            aria-label="Open menu"
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 -mr-2"
          >
            <div className={`w-6 h-px mb-1.5 ${onLight ? 'bg-ink' : 'bg-bone'}`} />
            <div className={`w-6 h-px mb-1.5 ${onLight ? 'bg-ink' : 'bg-bone'}`} />
            <div className={`w-4 h-px ml-auto ${onLight ? 'bg-ink' : 'bg-bone'}`} />
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-bone border-t hairline">
          <div className="px-6 py-6 space-y-4">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block kicker text-ink"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="block kicker text-ink"
              onClick={() => setOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
