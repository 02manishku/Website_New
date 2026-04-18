/** Rewrite image path references in .tsx/.ts files using scripts/rename-map.json. */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MAP = JSON.parse(fs.readFileSync(path.join(__dirname, 'rename-map.json'), 'utf8'));

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === '.next' || name === '_originals') continue;
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else if (/\.(tsx?|jsx?|mdx?|css)$/.test(name)) out.push(full);
  }
  return out;
}

const files = walk(ROOT);
let changed = 0;
for (const f of files) {
  let src = fs.readFileSync(f, 'utf8');
  let orig = src;
  for (const [from, to] of Object.entries(MAP)) {
    if (src.includes(from)) src = src.split(from).join(to);
  }
  if (src !== orig) {
    fs.writeFileSync(f, src);
    changed++;
    console.log('updated', path.relative(ROOT, f));
  }
}
console.log(`\n${changed} files updated.`);
