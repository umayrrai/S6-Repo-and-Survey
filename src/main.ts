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
const DAMP_LOG = { baseCost: 15, costGrowth: 1.35, rate: 0.5 };
const STICKY_PADS = { baseCost: 50, costGrowth: 1.6, pressBonus: 1 };
const FERN_PATCH = { baseCost: 120, costGrowth: 1.35, rate: 3 };

// Each repeat of an upgrade costs more than the last, so early purchases
// shape how long later ones take to reach.
const costFor = (
  upgrade: { baseCost: number; costGrowth: number },
  owned: number,
) => Math.ceil(upgrade.baseCost * upgrade.costGrowth ** owned);

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
pressButton.addEventListener("click", () => {
  state.spores += sporesPerPress();
  render();
});

const dampLogButton = document.createElement("button");
dampLogButton.id = "buy-damp-log";
dampLogButton.addEventListener("click", () => {
  const cost = costFor(DAMP_LOG, state.dampLogs);
  if (state.spores < cost) return;
  state.spores -= cost;
  state.dampLogs += 1;
  render();
});

const stickyPadsButton = document.createElement("button");
stickyPadsButton.id = "buy-sticky-pads";
stickyPadsButton.addEventListener("click", () => {
  const cost = costFor(STICKY_PADS, state.stickyPads);
  if (state.spores < cost) return;
  state.spores -= cost;
  state.stickyPads += 1;
  render();
});

const fernPatchButton = document.createElement("button");
fernPatchButton.id = "buy-fern-patch";
fernPatchButton.addEventListener("click", () => {
  const cost = costFor(FERN_PATCH, state.fernPatches);
  if (state.spores < cost) return;
  state.spores -= cost;
  state.fernPatches += 1;
  render();
});

const render = () => {
  counter.textContent = `${Math.floor(state.spores)} spores`;
  rateReadout.textContent = `${sporesPerSecond().toFixed(1)} spores per second`;
  pressButton.textContent = `Press the tile (+${sporesPerPress()} spore)`;
  const dampLogCost = costFor(DAMP_LOG, state.dampLogs);
  dampLogButton.textContent =
    `Buy a damp log (${dampLogCost} spores) — owned ${state.dampLogs}`;
  dampLogButton.disabled = state.spores < dampLogCost;
  const stickyPadsCost = costFor(STICKY_PADS, state.stickyPads);
  stickyPadsButton.textContent =
    `Buy sticky pads (${stickyPadsCost} spores) — owned ${state.stickyPads}`;
  stickyPadsButton.disabled = state.spores < stickyPadsCost;
  const fernPatchCost = costFor(FERN_PATCH, state.fernPatches);
  fernPatchButton.textContent =
    `Buy a fern patch (${fernPatchCost} spores) — owned ${state.fernPatches}`;
  fernPatchButton.disabled = state.spores < fernPatchCost;
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
