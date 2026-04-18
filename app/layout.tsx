import type { Metadata } from 'next';
import './globals.css';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
});

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-display',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Magppie — The World’s First Wellness Kitchen',
  description:
    'Magppie is the world’s first Wellness Kitchen and Wardrobe brand, fully built in patented anti-bacterial Silverstone™. Safe, hygienic, luxurious — for people and planet.',
  metadataBase: new URL('https://www.magppie.com'),
  openGraph: {
    title: 'Magppie — Wellness Kitchens & Wardrobes',
    description:
      'World’s first Wellness Kitchen, fully built in patented anti-bacterial Silverstone™.',
    images: ['/images/hero.jpg']
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
      </body>
    </html>
  );
}
