import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsletterTeaser from '@/components/NewsletterTeaser';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
});

// The Seasons, display face for every headline, hero, manifesto block and
// editorial moment on the site. Three weights licensed: Light (300) for the
// biggest hero moments, Regular (400) as the default for headings and the
// long Manifesto block, Bold (700) reserved for emphasis. Body text + the
// header navigation continue to ride on Inter.
const display = localFont({
  src: [
    { path: './fonts/the-seasons/the-seasons-light.ttf',   weight: '300', style: 'normal' },
    { path: './fonts/the-seasons/the-seasons-regular.ttf', weight: '400', style: 'normal' },
    { path: './fonts/the-seasons/the-seasons-bold.ttf',    weight: '700', style: 'normal' }
  ],
  variable: '--font-display',
  display: 'swap'
});

// Viewport config, viewportFit: 'cover' lets the page extend under the iOS
// home indicator and notch, paired with env(safe-area-inset-*) padding in
// globals.css so nothing important hides behind hardware. themeColor matches
// the bone background so the iOS status bar tints to the brand on first paint.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#F4F1EA'
};

export const metadata: Metadata = {
  title: 'Magppie | The World’s First Wellness Kitchen',
  description:
    'Magppie is the world’s first Wellness Kitchen and Wardrobe brand, fully built in patented anti-bacterial Silverstone™. Safe, hygienic, luxurious, for people and planet.',
  metadataBase: new URL('https://www.magppie.com'),
  openGraph: {
    title: 'Magppie | Wellness Kitchens & Wardrobes',
    description:
      'World’s first Wellness Kitchen, fully built in patented anti-bacterial Silverstone™.',
    images: ['/images/hero.webp']
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <NewsletterTeaser />
      </body>
    </html>
  );
}
