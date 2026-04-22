/**
 * Bulk compress all JPG/PNG in public/images (except _originals and team) to
 * WebP q82 at max 1920px width, and emit a rename map for code rewrites.
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = 'public/images';
const THRESHOLD = 200 * 1024; // only touch files bigger than 200 KB
const SKIP_DIRS = new Set(['_originals', 'team']);

function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      if (!SKIP_DIRS.has(f)) walk(full, out);
    } else if (/\.(jpe?g|png)$/i.test(f)) {
      out.push(full);
    }
  }
  return out;
}

function rel(p) {
  return p.split(path.sep).join('/').replace('public/images/', '/images/');
}

(async () => {
  const files = walk(ROOT).filter((f) => fs.statSync(f).size > THRESHOLD);
  console.log(`Compressing ${files.length} files >200KB\n`);
  const renameMap = {};
  let tb = 0, ta = 0;

  for (const f of files) {
    const before = fs.statSync(f).size;
    tb += before;
    const parsed = path.parse(f);
    const outPath = path.join(parsed.dir, parsed.name + '.webp');
    const buf = await sharp(f)
      .rotate()
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toBuffer();
    const after = buf.length;
    ta += after;
    fs.writeFileSync(outPath, buf);
    if (path.extname(f).toLowerCase() !== '.webp') fs.unlinkSync(f);
    renameMap[rel(f)] = rel(outPath);
    console.log(
      path.basename(f).padEnd(58) +
        ' ' +
        (before / 1024).toFixed(0).padStart(5) +
        'KB -> ' +
        (after / 1024).toFixed(0).padStart(5) +
        'KB  ' +
        Math.round((1 - after / before) * 100) +
        '%'
    );
  }

  fs.writeFileSync('scripts/image-rename.json', JSON.stringify(renameMap, null, 2));
  console.log(
    '\nTOTAL  ' +
      (tb / 1024).toFixed(0) +
      'KB -> ' +
      (ta / 1024).toFixed(0) +
      'KB  saved ' +
      Math.round((1 - ta / tb) * 100) +
      '%'
  );
  console.log('Rename map written to scripts/image-rename.json');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
