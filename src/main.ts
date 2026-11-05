// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"
import tileUrl from "./assets/tile.svg?no-inline";

const app = document.querySelector<HTMLElement>("#app")!;

const heading = document.createElement("h1");
heading.textContent = "D1 project";

const image = document.createElement("img");
image.src = tileUrl;
image.alt = "A teal tile with a cream circle";
image.width = 96;
image.height = 96;

// Game state: the resource the player collects, plus owned upgrades.
const state = {
  spores: 0,
  dampLogs: 0,
  stickyPads: 0,
  fernPatches: 0,
};

const AMBIENT_RATE = 1 / 3; // the breeze, in spores per second
const DAMP_LOG = { cost: 15, rate: 0.5 };
const STICKY_PADS = { cost: 50, pressBonus: 1 };
const FERN_PATCH = { cost: 120, rate: 3 };

// Production: ambient drift plus each owned producer's contribution.
const sporesPerSecond = () =>
  AMBIENT_RATE +
  state.dampLogs * DAMP_LOG.rate +
  state.fernPatches * FERN_PATCH.rate;

// Pressing: the base press plus one bonus spore per sticky pad.
const sporesPerPress = () => 1 + state.stickyPads * STICKY_PADS.pressBonus;

const counter = document.createElement("p");
counter.id = "spore-counter";

const rateReadout = document.createElement("p");
rateReadout.id = "production-rate";

const pressButton = document.createElement("button");
pressButton.id = "press-button";
pressButton.textContent = "Press me";
pressButton.addEventListener("click", () => {
  state.spores += sporesPerPress();
  render();
});

const dampLogButton = document.createElement("button");
dampLogButton.id = "buy-damp-log";
dampLogButton.textContent = `Buy a damp log (${DAMP_LOG.cost} spores) — +0.5/s`;
dampLogButton.addEventListener("click", () => {
  if (state.spores < DAMP_LOG.cost) return;
  state.spores -= DAMP_LOG.cost;
  state.dampLogs += 1;
  render();
});

const stickyPadsButton = document.createElement("button");
stickyPadsButton.id = "buy-sticky-pads";
stickyPadsButton.textContent =
  `Buy sticky pads (${STICKY_PADS.cost} spores) — +1/press`;
stickyPadsButton.addEventListener("click", () => {
  if (state.spores < STICKY_PADS.cost) return;
  state.spores -= STICKY_PADS.cost;
  state.stickyPads += 1;
  render();
});

const fernPatchButton = document.createElement("button");
fernPatchButton.id = "buy-fern-patch";
fernPatchButton.textContent =
  `Buy a fern patch (${FERN_PATCH.cost} spores) — +3/s`;
fernPatchButton.addEventListener("click", () => {
  if (state.spores < FERN_PATCH.cost) return;
  state.spores -= FERN_PATCH.cost;
  state.fernPatches += 1;
  render();
});

const render = () => {
  counter.textContent = `${Math.floor(state.spores)} spores`;
  rateReadout.textContent = `${sporesPerSecond().toFixed(1)} spores per second`;
  pressButton.textContent = `Press the tile (+${sporesPerPress()} spore)`;
  dampLogButton.textContent =
    `Buy a damp log (${DAMP_LOG.cost} spores) — owned ${state.dampLogs}`;
  stickyPadsButton.textContent =
    `Buy sticky pads (${STICKY_PADS.cost} spores) — owned ${state.stickyPads}`;
  fernPatchButton.textContent =
    `Buy a fern patch (${FERN_PATCH.cost} spores) — owned ${state.fernPatches}`;
  dampLogButton.disabled = state.spores < DAMP_LOG.cost;
  stickyPadsButton.disabled = state.spores < STICKY_PADS.cost;
  fernPatchButton.disabled = state.spores < FERN_PATCH.cost;
};

// Ambient growth and owned producers accrue with elapsed time rather than
// per frame, so growth depends on seconds elapsed, not frames counted.
let lastTime = performance.now();

const tick = (now: number) => {
  const elapsedSeconds = (now - lastTime) / 1000;
  lastTime = now;
  state.spores += sporesPerSecond() * elapsedSeconds;
  render();
  requestAnimationFrame(tick);
};

render();
app.append(
  heading,
  image,
  pressButton,
  counter,
  rateReadout,
  dampLogButton,
  stickyPadsButton,
  fernPatchButton,
);
requestAnimationFrame(tick);
