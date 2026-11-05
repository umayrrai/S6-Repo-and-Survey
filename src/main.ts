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

const message = document.createElement("p");
message.textContent = "Your project starts here.";

// A button built in TypeScript with an identity and a click handler.
let pressCount = 0;

const pressButton = document.createElement("button");
pressButton.id = "press-button";
pressButton.textContent = "Press me";
pressButton.addEventListener("click", () => {
  pressCount += 1;
  message.textContent = `The button was pressed ${
    pressCount === 1 ? "once" : `${pressCount} times`
  }.`;
});

app.append(heading, image, pressButton, message);
