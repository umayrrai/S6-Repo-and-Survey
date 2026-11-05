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

// Game state: the resource the player collects by pressing.
const state = { spores: 0 };

const counter = document.createElement("p");
counter.id = "spore-counter";
const renderCounter = () => {
  counter.textContent = `${Math.floor(state.spores)} spores`;
};

// A button built in TypeScript with an identity and a click handler.
const pressButton = document.createElement("button");
pressButton.id = "press-button";
pressButton.textContent = "Press me";
pressButton.addEventListener("click", () => {
  state.spores += 1;
  renderCounter();
});

renderCounter();
app.append(heading, image, pressButton, counter);
