'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import FocusLock from 'react-focus-lock';

// Routes that don't render a full-bleed dark hero behind the header. On these
// pages the header must start in its light (bone background, dark logo) state
// from the first paint, otherwise the white logo floats invisibly over a
// cream section. Add new no-hero routes here.
const NO_HERO_ROUTES = ['/contact'];

const NAV = [
  { label: 'Kitchens',  href: '/kitchens'  },
  { label: 'Wardrobes', href: '/wardrobes' },
  { label: 'Vanities',  href: '/vanities'  },
  { label: 'About',     href: '/about'     },
  { label: 'News',      href: '/news'      }
];

export default function Header() {
  const pathname = usePathname();
  const noHero = NO_HERO_ROUTES.includes(pathname);

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Prevent background scroll when mobile drawer is open.
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // Esc closes the drawer. Standard dialog-pattern expectation; previously
  // the only close paths were the X button or tapping a nav link.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // While at the top of any page, every page begins with a dark/visual hero,
  // so the header text needs to be light. After scroll, switch to the bone bar.
  // Exception: routes in NO_HERO_ROUTES (e.g. /contact) start in light mode
  // because there's no dark hero for the white logo to sit on.
  const onLight = scrolled || open || noHero;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
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
              // No `priority`. The logo is small (~36-145px) and is never the
              // LCP element. PageHero (or HeroVideo on the homepage) carries
              // the LCP role; promoting the logo too would compete for the
              // browser's preload budget.
              // The black logo PNG is taller (R-mark stacked under wordmark);
              // it needs ~2x the height of the white SVG to read at the
              // same visual weight. Mobile-scrolled state uses h-9 (was
              // h-10) so it sits inside the 64px header bar with breathing
              // room rather than crowding the nav controls.
              className={`w-auto transition-all duration-300 ${
                onLight ? 'h-9 lg:h-16' : 'h-6 lg:h-8'
              }`}
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`kicker hover-underline transition-colors ${
                  onLight ? 'text-ink' : 'text-bone drop-shadow-sm'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="/contact#book"
              className={`kicker px-5 py-2.5 border transition-colors ${
                onLight
                  ? 'text-bone bg-ink border-ink hover:bg-ink/85'
                  : 'text-ink bg-bone border-bone hover:bg-bone/90'
              }`}
            >
              Book now
            </Link>
            <span
              className={`kicker transition-colors ${
                onLight ? 'text-ink/40' : 'text-bone/60'
              }`}
            >
              EN
            </span>
          </div>

          {/* Right-side cluster on mobile: a compact Book Now CTA + the
              hamburger. The CTA is the single most important conversion
              action on the site, so it deserves to be visible at all times,
              not buried behind the menu. Hidden at lg+ where the full Book
              Now button lives in the desktop CTA group above. */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/contact#book"
              className={`kicker px-3.5 py-2 text-[10px] tracking-[0.22em] border transition-colors min-h-11 inline-flex items-center ${
                onLight
                  ? 'text-bone bg-ink border-ink hover:bg-ink/85'
                  : 'text-ink bg-bone border-bone hover:bg-bone/90'
              }`}
            >
              Book now
            </Link>
            <button
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen(!open)}
              className="p-3 -mr-3 min-h-[44px] min-w-[44px] flex flex-col justify-center items-end"
            >
              <div className={`w-6 h-px mb-1.5 transition-colors ${onLight ? 'bg-ink' : 'bg-bone'}`} />
              <div className={`w-6 h-px mb-1.5 transition-colors ${onLight ? 'bg-ink' : 'bg-bone'}`} />
              <div className={`w-6 h-px transition-colors ${onLight ? 'bg-ink' : 'bg-bone'}`} />
            </button>
          </div>
        </div>
      </div>

      {open && (
        <FocusLock returnFocus>
          <div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="lg:hidden bg-bone border-t hairline max-h-[calc(100dvh-4rem)] overflow-y-auto"
          >
            <div className="px-6 py-6 space-y-1">
              {NAV.map((item) => (
                <div
                  key={item.label}
                  className="border-b border-ink/5 last:border-b-0"
                >
                  <Link
                    href={item.href}
                    className="flex items-center min-h-[44px] kicker text-ink py-2"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
              <div className="flex items-center justify-between pt-6">
                <Link
                  href="/contact#book"
                  className="inline-flex items-center justify-center kicker px-6 py-3 bg-ink text-bone min-h-[44px]"
                  onClick={() => setOpen(false)}
                >
                  Book now
                </Link>
                <span className="kicker text-ink/40">EN</span>
              </div>
            </div>
          </div>
        </FocusLock>
      )}
    </header>
  );
}
