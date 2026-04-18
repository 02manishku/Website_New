import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-ink text-bone">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-20">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Image
              src="/logos/magppie-white.svg"
              alt="Magppie"
              width={160}
              height={40}
              className="h-8 w-auto mb-8"
            />
            <p className="font-display text-3xl lg:text-4xl leading-tight max-w-md">
              For people<br />and planet.
            </p>
            <p className="mt-8 text-sm text-bone/60 max-w-md">
              The world&rsquo;s first Wellness Kitchen and Wardrobe brand.
              Fully built in patented anti-bacterial Silverstone&trade;.
            </p>
          </div>

          <div className="lg:col-span-3">
            <div className="kicker text-bone/50 mb-5">Explore</div>
            <ul className="space-y-3 text-sm">
              <li><Link href="/kitchens" className="hover-underline">Wellness Kitchen</Link></li>
              <li><Link href="/wardrobes" className="hover-underline">Wellness Wardrobe</Link></li>
              <li><Link href="/vanities" className="hover-underline">Wellness Vanity</Link></li>
              <li><Link href="/materials" className="hover-underline">Silverstone&trade; Finishes</Link></li>
              <li><Link href="/about" className="hover-underline">The Wellness Movement</Link></li>
              <li><Link href="/news" className="hover-underline">News</Link></li>
              <li><Link href="/catalogs" className="hover-underline">Catalogs</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <div className="kicker text-bone/50 mb-5">Newsletter</div>
            <p className="text-sm text-bone/70 mb-5">
              Receive Magppie stories, new openings, and design notes.
            </p>
            <form className="flex border-b border-bone/30 pb-2 mb-6">
              <input
                type="email"
                required
                placeholder="Your email"
                className="flex-1 bg-transparent placeholder-bone/40 text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="kicker text-bone hover:text-sand transition-colors"
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

        <div className="mt-20 pt-8 border-t border-bone/20 flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between text-xs text-bone/50">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/legal" className="hover:text-bone">Legal</Link>
            <Link href="/privacy" className="hover:text-bone">Privacy</Link>
            <Link href="/cookies" className="hover:text-bone">Cookies</Link>
            <Link href="/sitemap" className="hover:text-bone">Sitemap</Link>
            <Link href="/whistleblowing" className="hover:text-bone">Whistleblowing</Link>
          </div>
          <div>© {new Date().getFullYear()} Magppie Silverstone Pvt. Ltd. — All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
