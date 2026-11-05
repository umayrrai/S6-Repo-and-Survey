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
const state = { spores: 0, dampLogs: 0 };

const AMBIENT_RATE = 1 / 3; // the breeze, in spores per second
const DAMP_LOG_COST = 15;
const DAMP_LOG_RATE = 0.5; // extra spores per second per damp log

// Production: ambient drift plus one contribution per owned damp log.
const sporesPerSecond = () => AMBIENT_RATE + state.dampLogs * DAMP_LOG_RATE;

const counter = document.createElement("p");
counter.id = "spore-counter";

const buyButton = document.createElement("button");
buyButton.id = "buy-damp-log";
buyButton.textContent = `Buy a damp log (${DAMP_LOG_COST} spores)`;
buyButton.addEventListener("click", () => {
  if (state.spores < DAMP_LOG_COST) return; // unaffordable purchases are prevented
  state.spores -= DAMP_LOG_COST;
  state.dampLogs += 1;
  render();
});

const pressButton = document.createElement("button");
pressButton.id = "press-button";
pressButton.textContent = "Press me";
pressButton.addEventListener("click", () => {
  state.spores += 1;
  render();
});

const render = () => {
  counter.textContent = `${Math.floor(state.spores)} spores`;
  buyButton.disabled = state.spores < DAMP_LOG_COST;
};

// Ambient growth and damp logs both accrue with elapsed time rather than
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
app.append(heading, image, pressButton, counter, buyButton);
requestAnimationFrame(tick);
