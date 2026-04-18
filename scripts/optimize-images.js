/**
 * One-shot image optimizer.
 * - Moves originals to public/_originals/ (preserving structure).
 * - Resizes anything wider than MAX_WIDTH.
 * - Photos without real transparency -> JPG q92 (mozjpeg).
 * - Images with real transparency -> WebP q92 (keeps alpha).
 * - Logos dir is skipped (SVG already optimal; brand PNG kept).
 * - Writes `rename-map.json` so we can rewrite code references afterwards.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const IMG_DIR = path.join(PUBLIC, 'images');
const ORIG_DIR = path.join(PUBLIC, '_originals', 'images');
const MAX_WIDTH = 2400;
const JPG_Q = 92;
const WEBP_Q = 92;

const exts = new Set(['.jpg', '.jpeg', '.png']);

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else if (exts.has(path.extname(name).toLowerCase())) out.push(full);
  }
  return out;
}

async function hasRealAlpha(file) {
  const meta = await sharp(file).metadata();
  if (!meta.hasAlpha) return false;
  try {
    const s = await sharp(file).extractChannel('alpha').stats();
    return s.channels[0].min < 250;
  } catch {
    return false;
  }
}

async function process(file) {
  const rel = path.relative(IMG_DIR, file);
  const origCopy = path.join(ORIG_DIR, rel);
  fs.mkdirSync(path.dirname(origCopy), { recursive: true });
  if (!fs.existsSync(origCopy)) fs.copyFileSync(file, origCopy);

  const meta = await sharp(file).metadata();
  const realAlpha = await hasRealAlpha(file);
  const needsResize = meta.width > MAX_WIDTH;

  const parsed = path.parse(file);
  const targetExt = realAlpha ? '.webp' : '.jpg';
  const targetFile = path.join(parsed.dir, parsed.name + targetExt);

  let pipe = sharp(file, { failOn: 'none' }).rotate();
  if (needsResize) pipe = pipe.resize({ width: MAX_WIDTH, withoutEnlargement: true });

  if (realAlpha) {
    await pipe.webp({ quality: WEBP_Q, effort: 5 }).toFile(targetFile + '.tmp');
  } else {
    await pipe.flatten({ background: '#ffffff' }).jpeg({ quality: JPG_Q, mozjpeg: true, chromaSubsampling: '4:4:4' }).toFile(targetFile + '.tmp');
  }

  fs.renameSync(targetFile + '.tmp', targetFile);

  const sameTarget = path.relative(path.dirname(file), targetFile) === path.basename(file);
  if (!sameTarget && fs.existsSync(file) && path.resolve(file) !== path.resolve(targetFile)) {
    fs.unlinkSync(file);
  }

  const origSize = fs.statSync(origCopy).size;
  const newSize = fs.statSync(targetFile).size;
  return {
    from: path.relative(PUBLIC, file).replace(/\\/g, '/'),
    to: path.relative(PUBLIC, targetFile).replace(/\\/g, '/'),
    origSize, newSize,
  };
}

(async () => {
  fs.mkdirSync(ORIG_DIR, { recursive: true });
  const files = walk(IMG_DIR);
  const map = {};
  let totalOrig = 0, totalNew = 0;
  for (const f of files) {
    try {
      const r = await process(f);
      if (r.from !== r.to) map['/' + r.from] = '/' + r.to;
      totalOrig += r.origSize;
      totalNew += r.newSize;
      console.log(`${(r.origSize/1048576).toFixed(1)}MB -> ${(r.newSize/1048576).toFixed(2)}MB  ${r.to}`);
    } catch (e) {
      console.error('FAIL', f, e.message);
    }
  }
  fs.writeFileSync(path.join(ROOT, 'scripts', 'rename-map.json'), JSON.stringify(map, null, 2));
  console.log(`\nTOTAL: ${(totalOrig/1048576).toFixed(1)} MB -> ${(totalNew/1048576).toFixed(1)} MB  (${((1 - totalNew/totalOrig)*100).toFixed(1)}% reduction)`);
  console.log(`Rename map written with ${Object.keys(map).length} entries.`);
})();
