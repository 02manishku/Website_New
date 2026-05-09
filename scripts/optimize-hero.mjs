// Compress the homepage Wellness-Kitchens tile hero from a 2.6 MB JPG to
// a sub-400 KB WebP. Re-run by hand whenever the source file changes.
//
//   node scripts/optimize-hero.mjs
import sharp from 'sharp';

const out = await sharp('public/images/wellness-kitchen-hero.jpg')
  .resize({ width: 2400, withoutEnlargement: true })
  .webp({ quality: 78, effort: 6 })
  .toFile('public/images/wellness-kitchen-hero.webp');

console.log(`Wrote ${(out.size / 1024) | 0} KB`);
