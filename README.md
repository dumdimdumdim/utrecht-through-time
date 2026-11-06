# Utrecht through time

A liquid-glass **spyglass** that overlays the 1569/70 plan of Utrecht — and the
topographical surveys that followed — on the present-day city. Move your pointer
and a lens reveals the historic map exactly where you point; move faster to expand
it slightly, or pause to gradually reveal the whole map. Streets, canals and fortifications line up 1:1, so you
can compare four centuries directly.

**[Live demo →](https://dumdimdumdim.github.io/utrecht-through-time/)**

## What it does

- **Base layer** — Streets (OpenStreetMap) or Aerial (Esri).
- **Historic layers** — 1569/70 (Van Deventer), c. 1740, 1900, 1925, 1950, 1975, 1985.
- **Spyglass** — the old plan appears inside a softly edged lens under your pointer.
  Move faster to expand it slightly; the vertices on the trailing side lag behind
  and leave a short tail. Pause and it gradually reveals the whole map: now and then
  a few vertices leap 20% ahead and hold until the rest catch up. Browsers without
  `mask-composite` fall back to a circular lens; reduced-motion gets a still lens.
- **Swap** — flips the two layers: the old plan stays on screen and today's city
  appears inside the lens.
- **1:1 alignment** — the lens never magnifies, so the maps line up exactly.

### Keyboard

| key | action |
|---|---|
| `1`–`7` | switch historic map (1569 → 1985) |
| `X` | swap base and lens |
| `F` | fullscreen |
| `Esc` | close the info panel |

## Share a view

The address bar follows the map once you start interacting, so any view can be
sent as a link:

| parameter | meaning |
|---|---|
| `old` | historic map: `1569`, `1740`, `1900`, `1925`, `1950`, `1975`, `1985` |
| `modern` | `osm` (streets) or `aerial` |
| `invert` | `1` to swap base and lens |
| `lat`, `lng`, `z` | map centre and zoom |
| `bbox` | `west,south,east,north` — alternative to `lat`/`lng`/`z` |
| `lx`, `ly` | initial lens position, % of the screen (default `50`) |

If an external tile service (Allmaps, OpenStreetMap, Esri) is unreachable, a small
notice says which layer is unavailable.

## Run locally

No build step, no server required:

```bash
cd utrecht-through-time
python3 -m http.server 8812
# open http://127.0.0.1:8812/
```

Opening `index.html` directly from disk also works (the tile layers are relative,
Leaflet is vendored, and the base maps are remote).

## Publish on GitHub Pages

1. Create an empty repository on GitHub named `utrecht-through-time` (no README,
   no `.gitignore` — this folder already has both).
2. From inside this folder:

```bash
git init
git add .
git commit -m "Utrecht through time — liquid-glass spyglass"
git branch -M main
git remote add origin https://github.com/dumdimdumdim/utrecht-through-time.git
git push -u origin main
```

3. In the repo on GitHub: **Settings → Pages → Build and deployment → Source:
   “Deploy from a branch” → Branch: `main`, folder `/ (root)` → Save.**

The site goes live at `https://dumdimdumdim.github.io/utrecht-through-time/`.

> GitHub recommends keeping Pages source repositories below 1 GB.

## Credits

### Maps

- **1569/70 plan of Utrecht** — Jacob van Deventer.
  Universiteitsbibliotheek Utrecht, Kaart IX.E.a.35. **Public domain.**
- **c. 1740, Urbis Traiecti ad Rhenum** — [Utrecht University Library, Special Collections](https://objects.library.uu.nl/reader/1874-348748), Kaart *VIII*.B.h.30. Georeferenced and served via [Allmaps](https://annotations.allmaps.org/maps/da8b0d51919d33c0); availability depends on the external services.
- **1900, 1925, 1950, 1975, 1985 topographical maps** — Kadaster / Topotijdreis. The 1985 layer uses the [Esri Nederland historical map service](https://www.arcgis.com/home/item.html?id=8e69dff18a0049bc98b6a00f07632fa0); it contains the latest mapping available through 1985, not necessarily surveyed in that year.
- **Present-day base map** — © OpenStreetMap contributors
  ([CC BY-SA](https://www.openstreetmap.org/copyright)).
- **Aerial imagery** — Esri, Maxar, Earthstar Geographics.

The 1569/70 sheet is served as pre-warped WebP tiles, georeferenced with
[Allmaps](https://allmaps.org/); the topographical sheets are re-projected from
RD New to Web Mercator.

> The OpenStreetMap tiles are currently loaded from `tile.openstreetmap.de`, a
> community server. That is fine for a demo; for heavier traffic, switch to a
> commercial tile provider that still credits © OpenStreetMap.

### Author

Built by **[Kanstantsin Kisleika](https://kisleyko.com)**.

## License

The original project code is released under the [MIT License](LICENSE),
© Kanstantsin Kisleika. The bundled Leaflet library is provided under its own
[BSD 2-Clause License](vendor/LICENSE-Leaflet.txt). The map data keeps the
licenses of its sources listed above.
