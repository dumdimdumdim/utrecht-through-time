/* Utrecht through time — white-glass spyglass.
   A base map fills the screen; a historic plan appears inside the lens under
   the pointer. "Swap" flips the two layers. The lens is 1:1 with the base map. */
"use strict";

const BOUNDS = [[52.075753068, 5.10354626], [52.102067016, 5.136397161]];
const TBOUNDS = [[52.0715, 5.0975], [52.1065, 5.1425]];
const HOME = [[52.0798, 5.1055], [52.1010, 5.1380]];
const STORE = "utrecht-through-time-v1";

const SOURCES = {
  "1569": {
    label: "1569/70 · Van Deventer", short: "1569",
    url: "tiles/{z}/{x}/{y}.webp?v=2", minNative: 15, maxNative: 18,
    bounds: BOUNDS, credit: "UBU · Allmaps",
  },
  "1740": {
    label: "c. 1740 · Urbis Traiecti", short: "c.1740",
    url: "https://allmaps.xyz/maps/da8b0d51919d33c0/{z}/{x}/{y}.png", maxNative: 19,
    bounds: [[52.0735, 5.0968], [52.1090, 5.1497]], credit: "Utrecht University Library · Allmaps",
  },
  "1900": {
    label: "1900 · topographical", short: "1900",
    url: "compare/tiles/1900/{z}/{x}/{y}.webp", minNative: 14, maxNative: 16,
    bounds: TBOUNDS, credit: "Kadaster / Topotijdreis",
  },
  "1925": {
    label: "1925 · topographical", short: "1925",
    url: "compare/tiles/1925/{z}/{x}/{y}.webp", minNative: 14, maxNative: 16,
    bounds: TBOUNDS, credit: "Kadaster / Topotijdreis",
  },
  "1950": {
    label: "1950 · topographical", short: "1950",
    url: "compare/tiles/1950/{z}/{x}/{y}.webp", minNative: 14, maxNative: 16,
    bounds: TBOUNDS, credit: "Kadaster / Topotijdreis",
  },
  "1975": {
    label: "1975 · topographical", short: "1975",
    url: "compare/tiles/1975/{z}/{x}/{y}.webp", minNative: 14, maxNative: 16,
    bounds: TBOUNDS, credit: "Kadaster / Topotijdreis",
  },
  "1985": {
    label: "1985 · topographical", short: "1985",
    url: "compare/tiles/1985/{z}/{x}/{y}.webp", minNative: 14, maxNative: 16,
    bounds: TBOUNDS, credit: "Kadaster / Topotijdreis · Esri Nederland",
  },
  osm: {
    label: "Streets", short: "Streets",
    url: "https://tile.openstreetmap.de/{z}/{x}/{y}.png", maxNative: 19,
    credit: "© OpenStreetMap contributors",
  },
  aerial: {
    label: "Aerial", short: "Aerial",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    maxNative: 19, credit: "Esri, Maxar, Earthstar Geographics",
  },
};

const OLD_KEYS = ["1569", "1740", "1900", "1925", "1950", "1975", "1985"];
const $ = id => document.getElementById(id);
const state = { old: "1569", modern: "osm", invert: false };
const BASE_R = 110, SLOW_SPEED = 0.15, FAST_SPEED = 3;
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let lensRadius = BASE_R, lensActive = false, targetRadius = BASE_R;
let lastX = 0, lastY = 0, lastMoveTime = 0, lastFrameTime = 0;
let lastRadius = -1;
let touchLifted = false;   // finger lifted: keep the lens in place, no idle growth
let lensGrowing = false;   // idle growth in progress (drives the vertex leaps)

/* ------------------------------------------------------------------ maps */
const opts = {
  zoomControl: false, attributionControl: false, minZoom: 12, maxZoom: 19, zoomSnap: .5,
  maxBounds: [[52.02, 5.00], [52.16, 5.24]], maxBoundsViscosity: .3,
  inertia: false, zoomAnimation: false, fadeAnimation: false,
  markerZoomAnimation: false,
};
const mapB = L.map("mapB", opts);   // base map
const mapA = L.map("mapA", Object.assign({}, opts, { attributionControl: false })); // lens
const mapFlash = L.map("mapFlash", Object.assign({}, opts, { attributionControl: false }));

["dragging", "touchZoom", "doubleClickZoom", "scrollWheelZoom", "boxZoom", "keyboard"]
  .forEach(k => { mapA[k].disable(); mapFlash[k].disable(); });
mapA.getContainer().style.pointerEvents = "none";
mapFlash.getContainer().style.pointerEvents = "none";

mapB.on("move", () => {
  mapA.setView(mapB.getCenter(), mapB.getZoom(), { animate: false });
  // Keyboard / programmatic pan: no pointer over the stage — keep the lens centred.
  if (!lensActive) {
    const c = mapB.getContainer().getBoundingClientRect();
    lastX = c.width / 2;
    lastY = c.height / 2;
    const s = mapA.getContainer().style;
    s.setProperty("--lx", lastX + "px");
    s.setProperty("--ly", lastY + "px");
  }
});

/* --------------------------------------------------------------- layers */
function tileLayer(key) {
  const s = SOURCES[key];
  const o = {
    minZoom: 12, maxZoom: 19, minNativeZoom: s.minNative || 0,
    maxNativeZoom: s.maxNative, noWrap: true, keepBuffer: 2,
    attribution: s.credit,
  };
  if (s.bounds) o.bounds = L.latLngBounds(s.bounds);
  return L.tileLayer(s.url, o);
}

let layerA = null, layerB = null;
let baseKey = null, hoverKey = null;

/* --------------------------------------------------------- layer health
   External tile services (Allmaps, OpenStreetMap, Esri) can go down. If a
   layer finishes loading with errors and not a single tile arrived, say so
   instead of leaving an empty lens. Local layers are not watched: tiles that
   are simply missing for part of the map are expected there. */
const failedLayers = new Set();
const notice = $("notice");

function isExternal(key) { return /^https?:/.test(SOURCES[key].url); }

function updateNotice() {
  const keys = [...failedLayers];
  notice.hidden = keys.length === 0;
  if (!keys.length) return;
  notice.textContent = keys.map(k => SOURCES[k].short).join(", ") +
    (keys.length > 1 ? " layers are" : " layer is") + " temporarily unavailable.";
}

function watchLayer(layer, key) {
  if (!isExternal(key)) return;
  let ok = 0, bad = 0;
  layer.on("loading", () => { ok = 0; bad = 0; });
  layer.on("tileload", () => { ok++; });
  layer.on("tileerror", () => { bad++; });
  layer.on("load", () => {
    if (layer !== layerA && layer !== layerB) return;
    if (bad > 0 && ok === 0) failedLayers.add(key);
    else failedLayers.delete(key);
    updateNotice();
  });
}

// Lay the new layer on top and remove the old one only after it loads —
// no empty frame or flicker when switching year.
function replaceLayer(map, current, key) {
  const fresh = tileLayer(key);
  watchLayer(fresh, key);
  let done = false;
  const cleanup = () => {
    if (done) return;
    done = true;
    if (current) map.removeLayer(current);
  };
  fresh.once("load", cleanup);
  setTimeout(cleanup, 1200);
  fresh.addTo(map);
  return fresh;
}

function refreshLayers() {
  const base = state.invert ? state.old : state.modern;
  const hover = state.invert ? state.modern : state.old;
  mapB.getContainer().classList.toggle("historic-map", OLD_KEYS.includes(base));
  mapA.getContainer().classList.toggle("historic-map", OLD_KEYS.includes(hover));
  if (base !== baseKey) {
    failedLayers.delete(baseKey);
    layerB = replaceLayer(mapB, layerB, base);
    baseKey = base;
  }
  if (hover !== hoverKey) {
    failedLayers.delete(hoverKey);
    layerA = replaceLayer(mapA, layerA, hover);
    hoverKey = hover;
  }
  updateNotice();
  updateChrome();
}

/* ---------------------------------------------------------------- lens */
const stage = $("stage");

/* ------------------------------------------------------------ octagon lens
   The lens is an octagon with a soft 30px edge. Every vertex has its own position:
   - moving: vertices on the far side of the motion follow more slowly, so a short
     trail drags behind the cursor and settles after it stops;
   - idle growth: from time to time a few vertices leap 20% beyond the current
     radius and hold there until the rest of the shape has caught up.
   Rendering is a CSS mask: one linear-gradient per edge of the convex hull,
   intersected with mask-composite. Without mask-composite support the old
   circular mask is used. */
/* OCT:BEGIN */
const OCTA = !!(window.CSS && CSS.supports &&
  (CSS.supports("mask-composite", "intersect") || CSS.supports("-webkit-mask-composite", "source-in")));
const OCT_N = 8, OCT_PHASE = Math.PI / 8;       // flat top: vertices at 22.5° + k·45°
const OCT_K = 1 / Math.cos(Math.PI / 8);        // circumradius / inradius
const OCT_FEATHER = 30;                          // same soft edge as the old circle
const OCT_JUMP = 0.2;                            // leaping vertices overshoot by 20%
const OCT_MAX_HELD = 3;                          // at most this many vertices ahead at once
const OCT_RATE = 22;                             // how fast a vertex follows its target (1/s)
const OCT_DRAG = 0.78;                           // how much the trailing side slows down (0..1)
const OCT_LAG_MAX = 0.6;                         // trail length cap, as a fraction of the radius
const oct = {
  v: Array.from({ length: OCT_N }, (_, i) =>
    ({ a: OCT_PHASE + i * 2 * Math.PI / OCT_N, x: 0, y: 0, rad: 0, hold: 0 })),
  px: 0, py: 0, vx: 0, vy: 0, dirx: 0, diry: -1, drag: 0,
  nextJump: 0, growing: false, css: "",
};

// Put every vertex on a regular octagon of inradius r around (cx, cy).
function octSnap(cx, cy, r) {
  oct.px = cx; oct.py = cy; oct.vx = 0; oct.vy = 0; oct.drag = 0; oct.growing = false;
  for (const p of oct.v) {
    p.rad = r; p.hold = 0;
    p.x = cx + r * OCT_K * Math.cos(p.a);
    p.y = cy + r * OCT_K * Math.sin(p.a);
  }
}

function octStep(dt, now, cx, cy, r, growing, reduced) {
  // 1. how fast, and which way, is the lens moving
  const k = 1 - Math.exp(-dt * 12);
  oct.vx += ((cx - oct.px) / dt - oct.vx) * k;
  oct.vy += ((cy - oct.py) / dt - oct.vy) * k;
  oct.px = cx; oct.py = cy;
  const speed = Math.hypot(oct.vx, oct.vy);
  if (speed > 25) { oct.dirx = oct.vx / speed; oct.diry = oct.vy / speed; }
  const push = Math.min(1, Math.max(0, (speed - 40) / 700));
  oct.drag = Math.max(push, oct.drag * Math.exp(-dt * 3));   // trail fades out over ~0.3 s

  // 2. leaps during idle growth
  if (growing && !reduced) {
    if (!oct.growing) {
      oct.nextJump = now + 350;
    } else if (now >= oct.nextJump) {
      const free = oct.v.filter(p => !p.hold);
      let held = OCT_N - free.length;
      for (let n = Math.random() < 0.5 ? 2 : 1; n > 0 && free.length && held < OCT_MAX_HELD; n--, held++) {
        const p = free.splice(Math.floor(Math.random() * free.length), 1)[0];
        p.hold = r * (1 + OCT_JUMP);
      }
      oct.nextJump = now + 450 + Math.random() * 650;
    }
    // a vertex rejoins the shape once the radius has reached the one it leapt to
    for (const p of oct.v) if (p.hold && r >= p.hold) p.hold = 0;
  } else {
    for (const p of oct.v) p.hold = 0;
  }
  oct.growing = growing && !reduced;

  // 3. move the vertices
  const maxLag = OCT_LAG_MAX * Math.min(r, 140);
  for (const p of oct.v) {
    const goal = Math.max(r, p.hold);
    p.rad += (goal - p.rad) * (1 - Math.exp(-dt * (goal > p.rad ? 26 : 14)));
    const tx = cx + p.rad * OCT_K * Math.cos(p.a);
    const ty = cy + p.rad * OCT_K * Math.sin(p.a);
    if (reduced) { p.x = tx; p.y = ty; continue; }
    const behind = (1 - (Math.cos(p.a) * oct.dirx + Math.sin(p.a) * oct.diry)) / 2; // 0 front … 1 back
    const f = 1 - Math.exp(-dt * OCT_RATE * (1 - OCT_DRAG * oct.drag * behind));
    p.x += (tx - p.x) * f;
    p.y += (ty - p.y) * f;
    const ox = p.x - tx, oy = p.y - ty, d = Math.hypot(ox, oy);
    if (d > maxLag) { p.x = tx + ox * maxLag / d; p.y = ty + oy * maxLag / d; }
  }
}

// Convex hull (Andrew's monotone chain) of the vertices, as [x, y] pairs.
function octHull(pts) {
  const p = pts.map(q => [q.x, q.y]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of p) {
    while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop();
    lo.push(q);
  }
  for (const q of p.slice().reverse()) {
    while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop();
    up.push(q);
  }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}

// mask-image value for a W×H box: one soft half-plane per hull edge.
function octMask(W, H) {
  const hull = octHull(oct.v);
  const gx = hull.reduce((t, q) => t + q[0], 0) / hull.length;
  const gy = hull.reduce((t, q) => t + q[1], 0) / hull.length;
  const F = OCT_FEATHER, layers = [];
  for (let i = 0; i < hull.length; i++) {
    const a = hull[i], b = hull[(i + 1) % hull.length];
    let nx = b[1] - a[1], ny = a[0] - b[0];
    const len = Math.hypot(nx, ny);
    if (len < 1e-3) continue;
    nx /= len; ny /= len;
    if (nx * (a[0] - gx) + ny * (a[1] - gy) < 0) { nx = -nx; ny = -ny; }   // outward normal
    const deg = Math.atan2(nx, -ny) * 180 / Math.PI;                        // CSS gradient angle
    // distance from the gradient start to this edge, along the gradient line
    const e = (W * Math.abs(nx) + H * Math.abs(ny)) / 2 + nx * (a[0] - W / 2) + ny * (a[1] - H / 2);
    layers.push("linear-gradient(" + deg.toFixed(2) + "deg,#000 " + (e - F).toFixed(1) +
      "px,rgba(0,0,0,.55) " + (e - F / 2).toFixed(1) + "px,transparent " + e.toFixed(1) + "px)");
  }
  return layers.join(",");
}
/* OCT:END */

function octRender() {
  const css = octMask(stage.clientWidth, stage.clientHeight);
  if (css === oct.css) return;               // nothing moved — skip the DOM write
  oct.css = css;
  const s = mapA.getContainer().style;
  s.webkitMaskImage = css;
  s.maskImage = css;
}

function applyRadius(r) {
  lensRadius = r;
  if (Math.abs(r - lastRadius) < 0.05) return; // radius unchanged — skip DOM writes
  lastRadius = r;
  const s = mapA.getContainer().style;
  const feather = 30;
  s.setProperty("--r0", Math.max(0, r - feather).toFixed(1) + "px");
  s.setProperty("--r1", (r - feather / 2).toFixed(1) + "px");
  s.setProperty("--r2", r.toFixed(1) + "px");
}

function setLens(x, y) {
  const box = stage.getBoundingClientRect();
  lastX = Math.max(0, Math.min(box.width, x));
  lastY = Math.max(0, Math.min(box.height, y));
  const s = mapA.getContainer().style;
  s.setProperty("--lx", lastX + "px");
  s.setProperty("--ly", lastY + "px");
  applyRadius(lensRadius);
}

function enterLens(clientX, clientY) {
  const box = stage.getBoundingClientRect();
  const x = Math.max(0, Math.min(box.width, clientX - box.left));
  const y = Math.max(0, Math.min(box.height, clientY - box.top));
  lensActive = true;
  lastMoveTime = performance.now();
  targetRadius = BASE_R;
  lensRadius = BASE_R;
  applyRadius(lensRadius);
  setLens(x, y);
  if (OCTA) octSnap(lastX, lastY, lensRadius);
  document.body.classList.add("lens-on");
}

function moveLens(clientX, clientY) {
  touchLifted = false;
  if (!lensActive) { enterLens(clientX, clientY); return; }
  const box = stage.getBoundingClientRect();
  const x = Math.max(0, Math.min(box.width, clientX - box.left));
  const y = Math.max(0, Math.min(box.height, clientY - box.top));
  const now = performance.now();
  const elapsed = Math.max(8, now - lastMoveTime);
  const speed = Math.hypot(x - lastX, y - lastY) / elapsed;
  const intensity = Math.max(0, Math.min(1, (speed - SLOW_SPEED) / (FAST_SPEED - SLOW_SPEED)));
  targetRadius = BASE_R * (1 + intensity);
  lastMoveTime = now;
  setLens(x, y);
  document.body.classList.add("lens-on");
}

function leaveLens() {
  lensActive = false;
  targetRadius = BASE_R;
  lensRadius = BASE_R;
  applyRadius(lensRadius);
  document.body.classList.remove("lens-on");
}

function tick(now) {
  const elapsed = lastFrameTime ? Math.min(now - lastFrameTime, 100) : 16;
  lastFrameTime = now;
  lensGrowing = false;
  if (lensActive && document.body.classList.contains("lens-on")) {
    if (REDUCED) {
      if (lensRadius !== BASE_R) { lensRadius = BASE_R; applyRadius(lensRadius); }
    } else {
      const idleSeconds = Math.max(0, (now - lastMoveTime - 140) / 1000);
      if (idleSeconds > 0 && !touchLifted) {
        const fullRadius = Math.hypot(Math.max(lastX, stage.clientWidth - lastX),
          Math.max(lastY, stage.clientHeight - lastY)) + 30;
        const growth = 15 * Math.expm1(Math.min(idleSeconds, 30) * Math.log(1.2)) / Math.log(1.2);
        targetRadius = Math.min(fullRadius, BASE_R + growth);
        lensGrowing = targetRadius < fullRadius - 0.5;
      }
      const duration = 240;
      lensRadius += (targetRadius - lensRadius) * (1 - Math.exp(-elapsed / duration));
      applyRadius(lensRadius);
    }
  }
  if (OCTA && document.body.classList.contains("lens-on")) {
    octStep(Math.max(elapsed / 1000, 0.004), now, lastX, lastY, lensRadius, lensGrowing, REDUCED);
    octRender();
  }
  requestAnimationFrame(tick);
}

stage.addEventListener("pointermove", e => moveLens(e.clientX, e.clientY));
stage.addEventListener("pointerenter", e => moveLens(e.clientX, e.clientY));
stage.addEventListener("pointerdown", e => moveLens(e.clientX, e.clientY));
// On touch, pointerleave fires right after the finger lifts. Ignore it there:
// the lens stays where the finger was, and only a mouse/pen leaving hides it.
stage.addEventListener("pointerleave", e => {
  if (e.pointerType === "touch") return;
  leaveLens();
});
const liftTouch = e => {
  if (e.pointerType !== "touch") return;
  touchLifted = true;
  targetRadius = BASE_R;
};
stage.addEventListener("pointerup", liftTouch);
stage.addEventListener("pointercancel", liftTouch);

/* --------------------------------------------------------------- chrome */
function updateChrome() {
  $("attribution").textContent = SOURCES[state.invert ? state.old : state.modern].credit;
  document.querySelectorAll("#years button").forEach(b => {
    const on = b.dataset.old === state.old;
    b.classList.toggle("on", on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
  });
  positionYearIndicator();
  $("swap").classList.toggle("on", state.invert);
  $("swap").setAttribute("aria-pressed", state.invert ? "true" : "false");
}

/* ------------------------------------------------------------- preview */
const pv = $("yearPreview");
let mini = null, miniLayer = null;

function initMini() {
  if (mini) return;
  mini = L.map("yearMap", {
    zoomControl: false, attributionControl: false, minZoom: 11, maxZoom: 19,
    zoomSnap: .25, inertia: false, zoomAnimation: false, fadeAnimation: false,
    maxBounds: [[52.02, 5.00], [52.16, 5.24]], maxBoundsViscosity: .3,
  }).setView([52.0905, 5.1205], 14);
  ["dragging", "touchZoom", "doubleClickZoom", "scrollWheelZoom", "boxZoom", "keyboard"]
    .forEach(k => mini[k].disable());
}

function positionPreview(chip) {
  const r = chip.getBoundingClientRect();
  const w = 252, m = 8;
  let left = r.left + r.width / 2 - w / 2;
  left = Math.max(m, Math.min(window.innerWidth - w - m, left));
  pv.style.left = left + "px";
  pv.style.bottom = (window.innerHeight - r.top + 9) + "px";
}

function showPreview(key, chip) {
  if (!SOURCES[key]) return;
  pv.classList.add("on");
  initMini();
  if (miniLayer) mini.removeLayer(miniLayer);
  miniLayer = tileLayer(key).addTo(mini);
  $("pvYear").textContent = SOURCES[key].label;
  $("pvSrc").textContent = SOURCES[key].credit;
  positionPreview(chip);
  chip.classList.add("previewing");
  requestAnimationFrame(() => {
    mini.invalidateSize();
    const b = SOURCES[key].bounds ? L.latLngBounds(SOURCES[key].bounds) : L.latLngBounds(BOUNDS);
    mini.fitBounds(b, { padding: [2, 2], animate: false });
  });
}

function hidePreview() {
  pv.classList.remove("on");
  document.querySelectorAll("#years button.previewing").forEach(b =>
    b.classList.remove("previewing"));
}

function buildYears() {
  $("years").innerHTML = '<span class="year-indicator" aria-hidden="true"></span>' + OLD_KEYS.map(k =>
    `<button data-old="${k}">${SOURCES[k].short}</button>`).join("");
  document.querySelectorAll("#years button").forEach(b => {
    const key = b.dataset.old;
    b.addEventListener("pointerenter", () => showPreview(key, b));
    b.addEventListener("pointerleave", hidePreview);
    b.addEventListener("focus", () => showPreview(key, b));
    b.addEventListener("blur", hidePreview);
    b.addEventListener("click", () => { hidePreview(); setOld(key); });
  });
}

function positionYearIndicator() {
  const selected = $("years").querySelector("button.on");
  const indicator = $("years").querySelector(".year-indicator");
  if (!selected || !indicator) return;
  indicator.style.width = selected.offsetWidth + "px";
  indicator.style.transform = `translateX(${selected.offsetLeft}px)`;
}

/* --------------------------------------------------------------- flash */
let flashLayer = null, flashRaf = 0;

function flashYear() {
  if (REDUCED) return; // reduced motion: skip the reveal — the layer just swaps
  if (flashLayer) mapFlash.removeLayer(flashLayer);
  flashLayer = tileLayer(state.old).addTo(mapFlash);
  mapFlash.setView(mapB.getCenter(), mapB.getZoom(), { animate: false });
  mapFlash.invalidateSize();
  const el = mapFlash.getContainer();
  const maxR = Math.hypot(stage.clientWidth, stage.clientHeight) / 2;
  cancelAnimationFrame(flashRaf);
  el.style.opacity = "0";
  el.style.setProperty("--fr", "0px");
  el.style.setProperty("--fr2", "0px");
  void el.offsetWidth;
  const start = performance.now();
  el.style.opacity = "1";
  const step = now => {
    const p = Math.min(1, (now - start) / 600);
    const rad = maxR * p;
    const feather = Math.min(80, rad * .35);
    el.style.setProperty("--fr", Math.max(0, rad - feather).toFixed(1) + "px");
    el.style.setProperty("--fr2", rad.toFixed(1) + "px");
    el.style.opacity = String(1 - p);
    if (p < 1) flashRaf = requestAnimationFrame(step);
    else el.style.opacity = "0";
  };
  flashRaf = requestAnimationFrame(step);
}

/* -------------------------------------------------------------- setters */
function setOld(key) {
  hidePreview();
  if (!OLD_KEYS.includes(key) || key === state.old) return;
  state.old = key;
  refreshLayers();
  flashYear();
  save();
}

function setInvert(v) {
  hidePreview();
  state.invert = !!v;
  refreshLayers();
  save();
}

/* ------------------------------------------------------------------ url
   Keep the address bar in sync with the view so any state can be shared.
   Written only after the first user action, so a fresh visit keeps a clean URL. */
let urlTimer = 0;
function syncUrl() {
  clearTimeout(urlTimer);
  urlTimer = setTimeout(() => {
    try {
      const qs = new URLSearchParams(location.search);
      qs.delete("bbox");                       // lat/lng/z supersede it
      qs.set("old", state.old);
      qs.set("modern", state.modern);
      qs.set("invert", state.invert ? "1" : "0");
      const c = mapB.getCenter();
      qs.set("lat", c.lat.toFixed(5));
      qs.set("lng", c.lng.toFixed(5));
      qs.set("z", String(mapB.getZoom()));
      history.replaceState(null, "", location.pathname + "?" + qs + location.hash);
    } catch (e) { /* file:// or history rate limit — ignore */ }
  }, 250);
}

/* ------------------------------------------------------------- storage */
function save() {
  syncUrl();
  try {
    localStorage.setItem(STORE, JSON.stringify({
      old: state.old, modern: state.modern, invert: state.invert,
    }));
  } catch (e) { /* ignore */ }
}
function loadState() {
  try {
    const d = JSON.parse(localStorage.getItem(STORE) || "{}");
    if (OLD_KEYS.includes(d.old)) state.old = d.old;
    if (["osm", "aerial"].includes(d.modern)) state.modern = d.modern;
    if (typeof d.invert === "boolean") state.invert = d.invert;
  } catch (e) { /* ignore */ }
}

/* ------------------------------------------------------------------ init */
function initView(qs) {
  const lat = parseFloat(qs.get("lat")), lng = parseFloat(qs.get("lng")),
    zoom = parseFloat(qs.get("z"));
  if ([lat, lng, zoom].every(Number.isFinite)) {
    mapB.setView([lat, lng], Math.min(19, Math.max(12, zoom)), { animate: false });
  } else {
    let bounds = L.latLngBounds(HOME);
    const bbox = qs.get("bbox");
    if (bbox) {
      const b = bbox.split(",").map(Number);
      if (b.length === 4 && b.every(Number.isFinite)) {
        bounds = L.latLngBounds([[b[1], b[0]], [b[3], b[2]]]);
      }
    }
    mapB.fitBounds(bounds, { animate: false, padding: [8, 8] });
  }
  const c = mapB.getCenter(), z = mapB.getZoom();
  mapA.setView(c, z, { animate: false });
  mapFlash.setView(c, z, { animate: false });
}

function init() {
  const qs = new URLSearchParams(location.search);
  loadState();
  if (OLD_KEYS.includes(qs.get("old"))) state.old = qs.get("old");
  if (["osm", "aerial"].includes(qs.get("modern"))) state.modern = qs.get("modern");
  const qi = qs.get("invert");
  if (qi !== null) state.invert = qi === "1" || qi === "true";

  buildYears();
  initView(qs);
  mapB.on("moveend", syncUrl);   // after initView, so the first fit doesn't touch the URL
  refreshLayers();

  const box = stage.getBoundingClientRect();
  let lx = 50, ly = 50;
  if (qs.get("lx") !== null && Number.isFinite(+qs.get("lx"))) lx = +qs.get("lx");
  if (qs.get("ly") !== null && Number.isFinite(+qs.get("ly"))) ly = +qs.get("ly");
  lensRadius = BASE_R;
  setLens(box.width * lx / 100, box.height * ly / 100);
  if (OCTA) { octSnap(lastX, lastY, lensRadius); octRender(); }
  document.body.classList.add("lens-on");
  updateChrome();
  requestAnimationFrame(() => $("years").classList.add("ready"));
  requestAnimationFrame(tick);

  $("swap").addEventListener("click", () => setInvert(!state.invert));
  $("zoomIn").addEventListener("click", () => mapB.zoomIn());
  $("zoomOut").addEventListener("click", () => mapB.zoomOut());

  $("btnInfo").addEventListener("click", () => $("info").classList.remove("hidden"));
  $("infoClose").addEventListener("click", () => $("info").classList.add("hidden"));
  $("info").addEventListener("click", e => {
    if (e.target.id === "info") $("info").classList.add("hidden");
  });

  window.addEventListener("resize", () => {
    hidePreview();
    positionYearIndicator();
    mapA.invalidateSize(); mapB.invalidateSize(); mapFlash.invalidateSize();
    const r = stage.getBoundingClientRect();
    setLens(Math.min(lastX, r.width), Math.min(lastY, r.height));
  });
}

/* keyboard */
document.addEventListener("keydown", e => {
  const tag = e.target.tagName;
  if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
  if (/^[1-7]$/.test(e.key)) {
    const k = OLD_KEYS[+e.key - 1];
    if (k) setOld(k);
  } else if (e.key.toLowerCase() === "x") {
    setInvert(!state.invert);
  } else if (e.key === "Escape") {
    $("info").classList.add("hidden");
  }
});

init();
