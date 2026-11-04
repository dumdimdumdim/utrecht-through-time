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

const OLD_KEYS = ["1569", "1900", "1925", "1950", "1975"];
const $ = id => document.getElementById(id);
const state = { old: "1569", modern: "osm", invert: false };
const BASE_R = 110, SLOW_SPEED = 0.15, FAST_SPEED = 3;
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let lensRadius = BASE_R, lensActive = false, targetRadius = BASE_R;
let lastX = 0, lastY = 0, lastMoveTime = 0, lastFrameTime = 0;
let lastRadius = -1;

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

// Lay the new layer on top and remove the old one only after it loads —
// no empty frame or flicker when switching year.
function replaceLayer(map, current, key) {
  const fresh = tileLayer(key);
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
    layerB = replaceLayer(mapB, layerB, base);
    baseKey = base;
  }
  if (hover !== hoverKey) {
    layerA = replaceLayer(mapA, layerA, hover);
    hoverKey = hover;
  }
  updateChrome();
}

/* ---------------------------------------------------------------- lens */
const stage = $("stage");

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
  document.body.classList.add("lens-on");
}

function moveLens(clientX, clientY) {
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
  if (lensActive && document.body.classList.contains("lens-on")) {
    if (REDUCED) {
      if (lensRadius !== BASE_R) { lensRadius = BASE_R; applyRadius(lensRadius); }
    } else {
      const idleSeconds = Math.max(0, (now - lastMoveTime - 140) / 1000);
      if (idleSeconds > 0) {
        const fullRadius = Math.hypot(Math.max(lastX, stage.clientWidth - lastX),
          Math.max(lastY, stage.clientHeight - lastY)) + 30;
        const growth = 15 * Math.expm1(Math.min(idleSeconds, 30) * Math.log(1.2)) / Math.log(1.2);
        targetRadius = Math.min(fullRadius, BASE_R + growth);
      }
      const duration = targetRadius > lensRadius ? 240 : 700;
      lensRadius += (targetRadius - lensRadius) * (1 - Math.exp(-elapsed / duration));
      applyRadius(lensRadius);
    }
  }
  requestAnimationFrame(tick);
}

stage.addEventListener("pointermove", e => moveLens(e.clientX, e.clientY));
stage.addEventListener("pointerenter", e => moveLens(e.clientX, e.clientY));
stage.addEventListener("pointerdown", e => moveLens(e.clientX, e.clientY));
stage.addEventListener("pointerleave", leaveLens);

/* --------------------------------------------------------------- chrome */
function updateChrome() {
  $("attribution").textContent = SOURCES[state.invert ? state.old : state.modern].credit;
  document.querySelectorAll("#years button").forEach(b => {
    const on = b.dataset.old === state.old;
    b.classList.toggle("on", on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
  });
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
  $("years").innerHTML = OLD_KEYS.map(k =>
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

/* ------------------------------------------------------------- storage */
function save() {
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
  let bounds = L.latLngBounds(HOME);
  const bbox = qs.get("bbox");
  if (bbox) {
    const b = bbox.split(",").map(Number);
    if (b.length === 4 && b.every(Number.isFinite)) {
      bounds = L.latLngBounds([[b[1], b[0]], [b[3], b[2]]]);
    }
  }
  mapB.fitBounds(bounds, { animate: false, padding: [8, 8] });
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
  refreshLayers();

  const box = stage.getBoundingClientRect();
  let lx = 50, ly = 50;
  if (qs.get("lx") !== null && Number.isFinite(+qs.get("lx"))) lx = +qs.get("lx");
  if (qs.get("ly") !== null && Number.isFinite(+qs.get("ly"))) ly = +qs.get("ly");
  lensRadius = BASE_R;
  setLens(box.width * lx / 100, box.height * ly / 100);
  document.body.classList.add("lens-on");
  updateChrome();
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
    mapA.invalidateSize(); mapB.invalidateSize(); mapFlash.invalidateSize();
    const r = stage.getBoundingClientRect();
    setLens(Math.min(lastX, r.width), Math.min(lastY, r.height));
  });
}

/* keyboard */
document.addEventListener("keydown", e => {
  const tag = e.target.tagName;
  if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
  if (/^[1-5]$/.test(e.key)) {
    const k = OLD_KEYS[+e.key - 1];
    if (k) setOld(k);
  } else if (e.key.toLowerCase() === "x") {
    setInvert(!state.invert);
  } else if (e.key === "Escape") {
    $("info").classList.add("hidden");
  }
});

init();
