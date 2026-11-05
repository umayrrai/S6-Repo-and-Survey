# Sporefall

A small Cookie Clicker-style game about a moss terrarium. Press the moss
patch to release spores, then spend them on upgrades that grow the patch
for you.

## How to play

- **Press the moss patch** — each press releases spores.
- **Damp log** — a log that stays wet; moss spreads on its own
  (+0.5 spores/s each).
- **Sticky fingers** — sap on your fingertips; every press carries more
  (+1 spore per press each).
- **Fern patch** — ferns shade the moss and hold in moisture
  (+3 spores/s each).
- **Oak canopy** — falling leaves feed the moss (+12 spores/s each).

The breeze drifts in 1 spore every 3 seconds on its own, and every upgrade
costs more each time you buy it, so early choices shape the pacing.

## Development

- `deno task setup` — run once per clone; installs the pre-commit hook.
- `deno task dev` — run the Vite dev server.
- `deno task ci` — formatting, lint, type check, and build; it runs on
  every commit.
- `deno task build` / `deno task preview` — production build and preview.

The site deploys to GitHub Pages on every push to `main`.

## Credits

Tooling adapted from the [CMPM 121 Fall 2026 S01 starter](https://github.com/ucsc-cmpm-121-f26/s01-starter/tree/8974888efb6537be82e8eb069db139ea885039da), which has no explicit repository license. No new license is assigned to that material. The D1 scaffold and original SVG were authored with OpenAI GPT-6 Astra assistance. Dependencies retain their respective licenses.
