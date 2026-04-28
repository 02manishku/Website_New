/**
 * One-shot optimizer for the Silverstone™ finish photos.
 *
 *  - Walks public/images/finishes/**\/*.png
 *  - Resizes to max FINISH_MAX_WIDTH (the materials grid never requests bigger)
 *  - Re-encodes to WebP at quality FINISH_QUALITY (near-lossless for stone)
 *  - Removes the original PNG
 *
 * Re-run any time new finishes are dropped into the folder.
 *
 *   node scripts/optimize-finishes.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const FINISHES_DIR = path.join(ROOT, 'public', 'images', 'finishes');
const FINISH_MAX_WIDTH = 1200;   // Plenty for the largest device + DPR the page asks for
const FINISH_QUALITY = 90;        // 88-92 is the sweet spot for textured stone
const EFFORT = 6;                 // 0..6, higher = better compression (slower encode)

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else if (path.extname(name).toLowerCase() === '.png') out.push(full);
  }
  return out;
}

function pad(s, n) {
  s = String(s);
  return s + ' '.repeat(Math.max(0, n - s.length));
}

(async () => {
  const files = walk(FINISHES_DIR);
  if (!files.length) {
    console.log(`No PNG files under ${path.relative(ROOT, FINISHES_DIR)}. Nothing to do.`);
    return;
  }

  console.log(
    `Compressing ${files.length} finish PNGs → WebP @ q${FINISH_QUALITY}, max ${FINISH_MAX_WIDTH}px wide\n`
  );

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const before = fs.statSync(file).size;
    totalBefore += before;

    const parsed = path.parse(file);
    const out = path.join(parsed.dir, parsed.name + '.webp');

    const meta = await sharp(file).metadata();
    const needsResize = (meta.width || 0) > FINISH_MAX_WIDTH;

    let pipe = sharp(file, { failOn: 'none' }).rotate();
    if (needsResize) {
      pipe = pipe.resize({ width: FINISH_MAX_WIDTH, withoutEnlargement: true });
    }

    await pipe.webp({ quality: FINISH_QUALITY, effort: EFFORT }).toFile(out + '.tmp');
    fs.renameSync(out + '.tmp', out);

    const after = fs.statSync(out).size;
    totalAfter += after;

    // Drop the original PNG only after the WebP is on disk
    fs.unlinkSync(file);

    const rel = path.relative(FINISHES_DIR, out).replace(/\\/g, '/');
    console.log(
      `${pad(rel, 42)} ` +
        `${pad((before / 1024).toFixed(0) + 'KB', 8)} -> ` +
        `${pad((after / 1024).toFixed(0) + 'KB', 8)} ` +
        `${pad(Math.round((1 - after / before) * 100) + '%', 4)}` +
        (needsResize ? `  (resized ${meta.width}px → ${FINISH_MAX_WIDTH}px)` : '')
    );
  }

  console.log(
    `\nTOTAL: ${(totalBefore / 1024).toFixed(0)}KB -> ${(totalAfter / 1024).toFixed(0)}KB ` +
      `saved ${Math.round((1 - totalAfter / totalBefore) * 100)}% ` +
      `(${((totalBefore - totalAfter) / 1024 / 1024).toFixed(2)} MB freed)`
  );
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
