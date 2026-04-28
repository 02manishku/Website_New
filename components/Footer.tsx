import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-ink text-bone">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
          <div className="lg:col-span-5">
            <Image
              src="/logos/magppie-white.svg"
              alt="Magppie"
              width={160}
              height={40}
              className="h-7 lg:h-8 w-auto mb-6 lg:mb-8"
            />
            <p className="font-display text-2xl sm:text-3xl lg:text-4xl leading-tight max-w-md">
              For People and Planet.
            </p>
            <p className="mt-6 lg:mt-8 text-sm text-bone/60 max-w-md">
              The world&rsquo;s first Wellness Kitchen and Wardrobe brand.
              Fully built in patented anti-bacterial Silverstone&trade;.
            </p>
          </div>

          <div className="lg:col-span-3">
            <div className="label text-bone/55 mb-5">Explore</div>
            <ul className="space-y-3 text-sm">
              <li><Link href="/kitchens" className="hover-underline">Wellness Kitchen</Link></li>
              <li><Link href="/wardrobes" className="hover-underline">Wellness Wardrobe</Link></li>
              <li><Link href="/vanities" className="hover-underline">Wellness Vanity</Link></li>
              <li><Link href="/materials" className="hover-underline">Silverstone&trade; Finishes</Link></li>
              <li><Link href="/about" className="hover-underline">The Wellness Movement</Link></li>
              <li><Link href="/news" className="hover-underline">News</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <div className="label text-bone/55 mb-5">Newsletter</div>
            <p className="text-sm text-bone/70 mb-5">
              Receive Magppie stories, new openings, and design notes.
            </p>
            <form className="flex flex-wrap items-center gap-x-3 border-b border-bone/30 pb-2 mb-6">
              <input
                type="email"
                required
                placeholder="Your email"
                className="flex-1 min-w-0 bg-transparent placeholder-bone/40 text-sm focus:outline-none py-2"
              />
              <button
                type="submit"
                className="text-sm font-medium text-bone hover:text-sand transition-colors py-2 shrink-0"
              >
                Submit →
              </button>
            </form>
            <label className="flex items-start gap-2 text-xs text-bone/50">
              <input type="checkbox" className="mt-1 accent-sand" required />
              <span>I have read and accept the privacy policy.</span>
            </label>
          </div>
        </div>

        <div className="mt-14 lg:mt-20 pt-8 border-t border-bone/20 flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between text-xs text-bone/50">
          {/* Legal pages aren't built yet — using "#" placeholders so they
              don't 404 on click. Repoint to /legal /privacy etc. when each
              page is created in the app/ directory. */}
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a href="#" className="hover:text-bone py-1.5 -my-1.5">Legal</a>
            <a href="#" className="hover:text-bone py-1.5 -my-1.5">Privacy</a>
            <a href="#" className="hover:text-bone py-1.5 -my-1.5">Cookies</a>
            <a href="#" className="hover:text-bone py-1.5 -my-1.5">Sitemap</a>
            <a href="#" className="hover:text-bone py-1.5 -my-1.5">Whistleblowing</a>
          </div>
          <div>© {new Date().getFullYear()} Magppie Silverstone Pvt. Ltd. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
