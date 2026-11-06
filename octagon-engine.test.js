const fs = require('fs');
const src = fs.readFileSync('app.js', 'utf8');
const block = src.slice(src.indexOf('/* OCT:BEGIN */'), src.indexOf('/* OCT:END */'));
const BASE_R = 110;
const window = { CSS: { supports: () => true } }; const CSS = window.CSS;
const api = new Function('BASE_R', 'window', 'CSS', block +
  '; return {oct, octSnap, octStep, octMask, octHull, OCT_N, OCT_K};')(BASE_R, window, CSS);
const { oct, octSnap, octStep, octMask, octHull, OCT_N } = api;

// parse generated mask string and evaluate alpha at a point (product of layers)
function alphaAt(css, W, H, x, y) {
  const re = /linear-gradient\((-?[\d.]+)deg,#000 (-?[\d.]+)px,rgba\(0,0,0,\.55\) (-?[\d.]+)px,transparent (-?[\d.]+)px\)/g;
  let m, a = 1, n = 0;
  while ((m = re.exec(css))) {
    n++;
    const th = parseFloat(m[1]) * Math.PI / 180, s0 = +m[2], s1 = +m[3], s2 = +m[4];
    const ux = Math.sin(th), uy = -Math.cos(th);
    const L = Math.abs(W * ux) + Math.abs(H * uy);
    const t = L / 2 + ux * (x - W / 2) + uy * (y - H / 2);
    let al; if (t <= s0) al = 1; else if (t <= s1) al = 1 - .45 * (t - s0) / (s1 - s0);
    else if (t <= s2) al = .55 * (1 - (t - s1) / (s2 - s1)); else al = 0;
    a *= al;
  }
  return { a, n };
}
const W = 1000, H = 700; let fail = 0;
const ok = (c, msg) => { if (!c) { fail++; console.log('FAIL', msg); } else console.log('ok  ', msg); };

// T1: regular octagon, inradius 110, centre (400,300)
octSnap(400, 300, 110);
let css = octMask(W, H);
let r = alphaAt(css, W, H, 400, 300); ok(r.n === 8 && r.a === 1, 'regular: 8 layers, centre solid');
const dirs = [...Array(8)].map((_, i) => i * Math.PI / 4);   // edge normals at 0,45,...
let allEdge = true;
for (const d of dirs) {
  const inB = alphaAt(css, W, H, 400 + 80 * Math.cos(d), 300 + 80 * Math.sin(d)).a;      // 30px inside edge
  const mid = alphaAt(css, W, H, 400 + 95 * Math.cos(d), 300 + 95 * Math.sin(d)).a;      // 15px inside edge
  const out = alphaAt(css, W, H, 400 + 111 * Math.cos(d), 300 + 111 * Math.sin(d)).a;    // just outside edge
  if (Math.abs(inB - 1) > 0.005 || Math.abs(mid - .55) > 0.005 || out !== 0) { allEdge = false; console.log(d, inB, mid, out); }
}
ok(allEdge, 'edge normals: solid @r-30, .55 @r-15, 0 @r+1 on all 8 edges');
// vertex direction: octagon extends to R*K at vertex angle, circle-equivalent covers inradius
ok(alphaAt(css, W, H, 400 + 117 * Math.cos(Math.PI / 8), 300 + 117 * Math.sin(Math.PI / 8)).a === 0 ||
   alphaAt(css, W, H, 400 + 117 * Math.cos(Math.PI / 8), 300 + 117 * Math.sin(Math.PI / 8)).a < 0.01, 'beyond vertex (R*K=119) is transparent');

// T2: full coverage at fullRadius with leaps & corner cases
function fullCoverage(cx, cy) {
  const full = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy)) + 30;
  octSnap(cx, cy, 110);
  let t = 0; const dt = 1 / 60;
  for (let i = 0; i < 60 * 40; i++) {          // 40 s of idle growth, app formula
    t += dt; const idle = Math.min(t, 30);
    const tgt = Math.min(full, 110 + 15 * Math.expm1(idle * Math.log(1.2)) / Math.log(1.2));
    // emulate lensRadius easing
    api.lr = (api.lr ?? 110); api.lr += (tgt - api.lr) * (1 - Math.exp(-dt / .24));
    octStep(dt, t * 1000, cx, cy, api.lr, tgt < full - .5, false);
    if (tgt >= full - .5 && i > 60 * 36) break;
  }
  const c = octMask(W, H);
  return [[0, 0], [W, 0], [0, H], [W, H]].map(([x, y]) => alphaAt(c, W, H, x, y).a);
}
for (const [cx, cy] of [[500, 350], [10, 10], [990, 690], [200, 600]]) {
  api.lr = 110; const a = fullCoverage(cx, cy);
  ok(a.every(v => v > 0.999), `full reveal from (${cx},${cy}) covers all corners: ${a.map(v => v.toFixed(3))}`);
}

// T3: leaps during growth — held vertices freeze at ~1.2R, ≤3 at once, released when caught
octSnap(500, 350, 110); api.lr = 110;
let maxHeld = 0, jumps = 0, prevHold = new Array(8).fill(0), frozenOK = true, releaseOK = true, sumHeld = 0, frames = 0;
let tt = 0, lr = 110;
for (let i = 0; i < 60 * 12; i++) {
  tt += 1 / 60;
  const tgt = 110 + 15 * Math.expm1(Math.max(0, tt - .14) * Math.log(1.2)) / Math.log(1.2);
  lr += (tgt - lr) * (1 - Math.exp(-(1 / 60) / .24));
  octStep(1 / 60, tt * 1000, 500, 350, lr, true, false);
  const held = oct.v.filter(p => p.hold).length; maxHeld = Math.max(maxHeld, held); sumHeld += held; frames++;
  oct.v.forEach((p, k) => {
    if (p.hold && !prevHold[k]) jumps++;
    if (p.hold && prevHold[k] && p.hold !== prevHold[k]) frozenOK = false;          // hold radius must not change
    if (prevHold[k] && !p.hold && lr < prevHold[k] - 1) releaseOK = false;          // released only after catch-up
    prevHold[k] = p.hold;
  });
}
ok(maxHeld <= 3 && maxHeld >= 1, `held vertices at once: max ${maxHeld}, avg ${(sumHeld / frames).toFixed(2)}, ${jumps} leaps in 12 s`);
ok(frozenOK, 'a leaping vertex keeps its radius frozen while waiting');
ok(releaseOK, 'vertex rejoins only after the radius caught up');

// T4: pointer motion: trail behind, bounded, cursor always inside, settles after stop
octSnap(200, 300, 110); let lr2 = 110; tt = 0; let cx = 200, cy = 300;
let minCursorAlpha = 1, maxLagSeen = 0, hullLoss = 0, nan = false;
for (let i = 0; i < 60 * 3; i++) {                 // move right at 1000 px/s for 3 s... wrap
  tt += 1 / 60; cx = 100 + (i * 1000 / 60) % 800; cy = 300 + 100 * Math.sin(i / 20);
  octStep(1 / 60, tt * 1000, cx, cy, lr2, false, false);
  const c = octMask(W, H); minCursorAlpha = Math.min(minCursorAlpha, alphaAt(c, W, H, cx, cy).a);
  if (octHull(oct.v).length < 8) hullLoss++;
  oct.v.forEach(p => { if (!isFinite(p.x) || !isFinite(p.y)) nan = true;
    maxLagSeen = Math.max(maxLagSeen, Math.hypot(p.x - (cx + p.rad * api.OCT_K * Math.cos(p.a)), p.y - (cy + p.rad * api.OCT_K * Math.sin(p.a)))); });
}
ok(!nan, 'no NaN');
ok(minCursorAlpha > 0.999, `cursor stays inside solid area while moving fast (min alpha ${minCursorAlpha.toFixed(3)})`);
ok(maxLagSeen <= 0.6 * 110 + 1e-6, `trail lag bounded: max ${maxLagSeen.toFixed(1)}px (cap 66)`);
console.log('   hull dropped a vertex (non-convex shape) in', hullLoss, 'of 180 frames');
// trailing side lags more than the leading side (moving right, dir=(1,0))
const back = oct.v.filter(p => Math.cos(p.a) < -.5), front = oct.v.filter(p => Math.cos(p.a) > .5);
const lag = p => Math.hypot(p.x - (cx + p.rad * api.OCT_K * Math.cos(p.a)), p.y - (cy + p.rad * api.OCT_K * Math.sin(p.a)));
console.log('   lag back avg', (back.reduce((s, p) => s + lag(p), 0) / back.length).toFixed(1), 'front avg', (front.reduce((s, p) => s + lag(p), 0) / front.length).toFixed(1));
ok(back.reduce((s, p) => s + lag(p), 0) / back.length > front.reduce((s, p) => s + lag(p), 0) / front.length, 'back vertices lag more than front');
for (let i = 0; i < 60 * 3; i++) { tt += 1 / 60; octStep(1 / 60, tt * 1000, cx, cy, lr2, false, false); }
const settle = Math.max(...oct.v.map(lag));
ok(settle < 0.5, `settles into a regular octagon after the cursor stops (max offset ${settle.toFixed(3)}px)`);

// T5: reduced motion = rigid regular octagon following the centre, no leaps
octSnap(300, 300, 110); tt = 0;
for (let i = 0; i < 120; i++) { tt += 1 / 60; octStep(1 / 60, tt * 1000, 300 + i * 5, 300, 110, true, true); }
const cxr = 300 + 119 * 5;
const rigid = oct.v.every(p => Math.hypot(p.x - (cxr + 110 * api.OCT_K * Math.cos(p.a)), p.y - (300 + 110 * api.OCT_K * Math.sin(p.a))) < 1e-6);
ok(oct.v.every(p => !p.hold) && rigid, 'reduced motion: no leaps, no trail, rigid regular octagon');
console.log(fail ? `\n${fail} FAILED` : '\nALL PASSED'); process.exit(fail ? 1 : 0);
