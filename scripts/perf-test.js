/**
 * Simulate a browser visit for each page.
 * - Fetch HTML, time-to-first-byte + full body.
 * - Extract all referenced assets (img/script/link/source + /_next/image URLs from srcset).
 * - Fetch each asset with AVIF-first Accept headers (what Chrome/Edge/Firefox send).
 * - Report: total bytes, slowest asset, rough time budget at 10 Mbps.
 */
const ROUTES = ['/', '/kitchens', '/wardrobes', '/vanities', '/about', '/news', '/contact', '/catalogs'];
const HOST = 'http://localhost:3010';
const MBPS_ESTIMATE = 10; // typical home broadband lower bound

const AVIF_ACCEPT = 'image/avif,image/webp,image/apng,*/*;q=0.8';
const VIDEO_ACCEPT = 'video/webm,video/mp4,*/*;q=0.8';

function extractAssets(html, baseUrl) {
  const urls = new Set();
  const abs = (u) => {
    if (!u || u.startsWith('data:')) return null;
    try { return new URL(u, baseUrl).href; } catch { return null; }
  };

  // <link rel="stylesheet|preload|font" href="...">
  for (const m of html.matchAll(/<link[^>]+href=["']([^"']+)["'][^>]*>/g)) {
    const t = m[0];
    if (/rel=["'](?:stylesheet|preload|font)/i.test(t) || /as=["'](?:style|font|script|image)/i.test(t)) {
      const u = abs(m[1]); if (u) urls.add(u);
    }
  }
  // <script src="...">
  for (const m of html.matchAll(/<script[^>]+src=["']([^"']+)["']/g)) {
    const u = abs(m[1]); if (u) urls.add(u);
  }
  // <img src="..."> and srcset (next/image ships both)
  for (const m of html.matchAll(/<img[^>]+>/g)) {
    const srcM = m[0].match(/\bsrc=["']([^"']+)["']/);
    const srcsetM = m[0].match(/\bsrcset=["']([^"']+)["']/);
    if (srcM) { const u = abs(srcM[1]); if (u) urls.add(u); }
    if (srcsetM) {
      for (const entry of srcsetM[1].split(',')) {
        const u = abs(entry.trim().split(/\s+/)[0]); if (u) urls.add(u);
      }
    }
  }
  // <source src="..."> (video/audio)
  for (const m of html.matchAll(/<source[^>]+src=["']([^"']+)["']/g)) {
    const u = abs(m[1]); if (u) urls.add(u);
  }
  // <video poster="...">
  for (const m of html.matchAll(/<video[^>]+poster=["']([^"']+)["']/g)) {
    const u = abs(m[1]); if (u) urls.add(u);
  }
  return Array.from(urls);
}

function pickAccept(url) {
  if (/\/_next\/image/.test(url) || /\.(jpg|jpeg|png|webp|avif|gif)(?:$|\?)/i.test(url)) return AVIF_ACCEPT;
  if (/\.(mp4|webm|mov)(?:$|\?)/i.test(url)) return VIDEO_ACCEPT;
  return '*/*';
}

async function fetchSize(url, opts = {}) {
  const t0 = performance.now();
  const res = await fetch(url, {
    headers: { 'Accept': pickAccept(url), 'Accept-Encoding': 'gzip, deflate, br' },
    ...opts,
  });
  const buf = await res.arrayBuffer();
  return { url, status: res.status, bytes: buf.byteLength, ms: performance.now() - t0, contentType: res.headers.get('content-type') || '' };
}

async function fetchRange(url) {
  // Videos in browsers start with a Range: bytes=0- request and buffer progressively.
  // The initial chunk that gets LCP-like playback is typically <=2 MB.
  return fetchSize(url, { headers: { 'Range': 'bytes=0-2097151', 'Accept': VIDEO_ACCEPT } });
}

async function audit(route) {
  const pageUrl = HOST + route;
  const html0 = await fetchSize(pageUrl);
  if (html0.status !== 200) return { route, error: `HTTP ${html0.status}` };
  const htmlText = await (await fetch(pageUrl)).text();
  const assets = extractAssets(htmlText, pageUrl);

  // Only fetch critical-ish assets for the initial paint estimate:
  // - CSS, JS, fonts: always
  // - Images: top N (above-the-fold-ish)
  // - Videos: fetch first 2 MB (what a browser buffers before play)
  const results = [];
  // Real browsers pick ONE video format per <source>; WebM wins on Chromium/Firefox.
  const allVideos = assets.filter(u => /\.(mp4|webm)(?:$|\?)/i.test(u));
  const webmStems = new Set(allVideos.filter(u => /\.webm/i.test(u)).map(u => u.replace(/\.webm.*$/, '')));
  const videos = allVideos.filter(u => /\.webm/i.test(u) || !webmStems.has(u.replace(/\.mp4.*$/, '')));
  const others = assets.filter(u => !/\.(mp4|webm)(?:$|\?)/i.test(u));

  // Parallel fetch non-video in batches of 8
  for (let i = 0; i < others.length; i += 8) {
    const batch = others.slice(i, i + 8);
    const rs = await Promise.all(batch.map(u => fetchSize(u).catch(e => ({ url: u, status: 0, bytes: 0, ms: 0, error: e.message }))));
    results.push(...rs);
  }
  // Videos: only first 2 MB (browser-like)
  for (const v of videos) {
    results.push(await fetchRange(v).catch(e => ({ url: v, status: 0, bytes: 0, ms: 0, error: e.message })));
  }

  const totalBytes = html0.bytes + results.reduce((s, r) => s + (r.bytes || 0), 0);
  const slowest = results.slice().sort((a, b) => b.ms - a.ms)[0];
  const heaviest = results.slice().sort((a, b) => b.bytes - a.bytes).slice(0, 3);
  // Wall time estimate: html TTFB + all assets downloaded at MBPS (serialized would be pessimistic; real browsers parallelize 6+ per origin)
  const serialMs = html0.ms + results.reduce((s, r) => s + r.ms, 0);
  const effectiveParallelMs = html0.ms + Math.max(...results.map(r => r.ms), 0) + (results.reduce((s, r) => s + r.ms, 0) / 6);
  const budgetMs = (totalBytes * 8) / (MBPS_ESTIMATE * 1000); // ms on a 10 Mbps link

  return {
    route,
    htmlBytes: html0.bytes,
    htmlMs: html0.ms.toFixed(1),
    assetCount: results.length,
    totalBytes,
    totalMB: (totalBytes / 1048576).toFixed(2),
    serverTimeMs: serialMs.toFixed(0),
    estimatedWallMs: effectiveParallelMs.toFixed(0),
    netBudgetMs10Mbps: budgetMs.toFixed(0),
    slowest: slowest ? `${slowest.ms.toFixed(0)}ms  ${slowest.url.replace(HOST,'')}` : '',
    heaviest: heaviest.map(h => `${(h.bytes/1024).toFixed(0)}KB  ${h.url.replace(HOST,'')}`),
  };
}

(async () => {
  console.log(`Auditing ${ROUTES.length} routes on ${HOST}...\n`);
  for (const r of ROUTES) {
    try {
      const res = await audit(r);
      console.log(`── ${r} ──`);
      if (res.error) { console.log(`  ERROR: ${res.error}`); continue; }
      console.log(`  HTML ${res.htmlBytes}B in ${res.htmlMs}ms · ${res.assetCount} assets · ${res.totalMB} MB total`);
      console.log(`  Est. wall time (parallel): ${res.estimatedWallMs}ms`);
      console.log(`  Network budget @10 Mbps:   ${res.netBudgetMs10Mbps}ms`);
      console.log(`  Heaviest:`);
      for (const h of res.heaviest) console.log(`    ${h}`);
      console.log('');
    } catch (e) {
      console.log(`── ${r} ── ERROR: ${e.message}`);
    }
  }
})();
