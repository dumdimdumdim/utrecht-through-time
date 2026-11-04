# Utrecht through time

A liquid-glass **spyglass** that overlays the 1569/70 plan of Utrecht — and the
topographical surveys that followed — on the present-day city. Move your pointer
and a lens reveals the historic map exactly where you point; move faster to expand
it, then pause to let it shrink back. Streets, canals and fortifications line up 1:1, so you
can compare four centuries directly.

**[Live demo →](https://dumdimdumdim.github.io/utrecht-through-time/)**

## What it does

- **Base layer** — Streets (OpenStreetMap) or Aerial (Esri).
- **Historic layers** — 1569/70 (Van Deventer), 1900, 1925, 1950, 1975.
- **Spyglass** — the old plan appears inside the lens under your pointer. Move
  faster to expand it; pause and it returns to its original size.
- **Swap** — flips the two layers: the old plan stays on screen and today's city
  appears inside the lens.
- **1:1 alignment** — the lens never magnifies, so the maps line up exactly.

### Keyboard

| key | action |
|---|---|
| `1`–`5` | switch historic map (1569 → 1975) |
| `X` | swap base and lens |
| `F` | fullscreen |
| `Esc` | close the info panel |

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

> Tiles total ~27 MB (12 MB 1569 + 15 MB topographical). GitHub recommends keeping Pages source repositories below 1 GB.

## Credits

### Maps

- **1569/70 plan of Utrecht** — Jacob van Deventer.
  Universiteitsbibliotheek Utrecht, Kaart IX.E.a.35. **Public domain.**
- **1900, 1925, 1950, 1975 topographical maps** — Kadaster / Topotijdreis.
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

The code in this repository is © Kanstantsin Kisleika. Add a `LICENSE` file
(`MIT`, or your choice) before making the repository public. The map data keeps
the licenses of its sources listed above.
