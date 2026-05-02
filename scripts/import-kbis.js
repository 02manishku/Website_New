/**
 * One-shot import of the KBIS 2026 award photos from `../kbis award/` into
 * `public/images/news/kbis/`. Converts everything to webp at high quality
 * (q88), caps at 2200px wide, strips metadata, and prints a tiny report.
 *
 * Run from the project root: `node scripts/import-kbis.js`
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '..', '..', 'kbis award');
const OUT = path.resolve(__dirname, '..', 'public', 'images', 'news', 'kbis');

// Map source filenames -> clean, web-friendly slugs.
const RENAME = {
  'hero_image.webp':            'hero.webp',
  'kbis_award.webp':            'winners-podium.webp',
  'magppie presentation.webp':  'wellness-kitchen-slide.webp',
  'magppiepresenting.webp':     'kishor-presenting.webp',
  'awards.jpg':                 'audience-celebration.webp',
  'awards2.jpg':                'kbis-next-stage.webp',
  'awards3.jpg':                'designers-front-row.webp'
};

(async () => {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

  console.log('Importing KBIS 2026 photos\n');
  let tb = 0, ta = 0;

  for (const [src, dest] of Object.entries(RENAME)) {
    const srcPath = path.join(SRC, src);
    const outPath = path.join(OUT, dest);
    if (!fs.existsSync(srcPath)) {
      console.log('  SKIP (missing): ' + src);
      continue;
    }
    const before = fs.statSync(srcPath).size;
    tb += before;
    const buf = await sharp(srcPath)
      .rotate()
      .resize({ width: 2200, withoutEnlargement: true })
      .webp({ quality: 88, effort: 6 })
      .toBuffer();
    const after = buf.length;
    ta += after;
    fs.writeFileSync(outPath, buf);
    console.log(
      '  ' +
        src.padEnd(34) +
        ' -> ' +
        dest.padEnd(34) +
        ' ' +
        (before / 1024).toFixed(0).padStart(5) +
        'KB -> ' +
        (after / 1024).toFixed(0).padStart(5) +
        'KB'
    );
  }

  console.log(
    '\nTOTAL  ' +
      (tb / 1024).toFixed(0) +
      'KB -> ' +
      (ta / 1024).toFixed(0) +
      'KB  saved ' +
      Math.round((1 - ta / tb) * 100) +
      '%'
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
