// Vite turns this import into a production-safe URL. Keep it as a file so
// even the game's centerpiece is a separately deployed asset.
// @deno-types="./asset-url.d.ts"
import mossUrl from "./assets/moss.svg?no-inline";

const app = document.querySelector<HTMLElement>("#app")!;

const heading = document.createElement("h1");
heading.textContent = "Sporefall";

const image = document.createElement("img");
image.src = mossUrl;
image.alt = "A moss patch dotted with pale spore cases";
image.width = 96;
image.height = 96;

// Game state: the spores the player gathers, plus owned upgrades.
const state = {
  spores: 0,
  dampLogs: 0,
  stickyFingers: 0,
  fernPatches: 0,
};

const AMBIENT_RATE = 1 / 3; // the breeze, in spores per second
const DAMP_LOG = { baseCost: 15, costGrowth: 1.35, rate: 0.5 };
const STICKY_FINGERS = { baseCost: 50, costGrowth: 1.6, pressBonus: 1 };
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

// Pressing: the base press plus one bonus spore per pair of sticky fingers.
const sporesPerPress = () =>
  1 + state.stickyFingers * STICKY_FINGERS.pressBonus;

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

const stickyFingersButton = document.createElement("button");
stickyFingersButton.id = "buy-sticky-fingers";
stickyFingersButton.addEventListener("click", () => {
  const cost = costFor(STICKY_FINGERS, state.stickyFingers);
  if (state.spores < cost) return;
  state.spores -= cost;
  state.stickyFingers += 1;
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

const hint = (text: string) => {
  const note = document.createElement("p");
  note.className = "hint";
  note.textContent = text;
  return note;
};

const dampLogHint = hint("A log that stays wet — moss spreads on its own.");
const stickyFingersHint = hint(
  "Sap on your fingertips — every press carries more spores.",
);
const fernPatchHint = hint("Ferns shade the moss and hold in moisture.");

const render = () => {
  counter.textContent = `${Math.floor(state.spores)} spores`;
  rateReadout.textContent = `Growth: ${
    sporesPerSecond().toFixed(1)
  } spores per second`;
  pressButton.textContent = `Press the moss patch (+${sporesPerPress()} spore)`;
  const dampLogCost = costFor(DAMP_LOG, state.dampLogs);
  dampLogButton.textContent =
    `Buy a damp log (${dampLogCost} spores) — owned ${state.dampLogs}`;
  dampLogButton.disabled = state.spores < dampLogCost;
  const stickyFingersCost = costFor(STICKY_FINGERS, state.stickyFingers);
  stickyFingersButton.textContent =
    `Buy sticky fingers (${stickyFingersCost} spores) — owned ${state.stickyFingers}`;
  stickyFingersButton.disabled = state.spores < stickyFingersCost;
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
  dampLogHint,
  stickyFingersButton,
  stickyFingersHint,
  fernPatchButton,
  fernPatchHint,
);
requestAnimationFrame(tick);
