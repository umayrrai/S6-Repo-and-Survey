// @deno-types="./asset-url.d.ts"
import mossUrl from "./assets/moss.svg?no-inline";
import {
  costOf,
  type GameState,
  sporesPerPress,
  sporesPerSecond,
} from "./game.ts";
import { type UpgradeDef, UPGRADES } from "./upgrades.ts";

// The view: builds the interface once, then reflects state on each render.
// Input is reported through callbacks; the view never edits state itself.
export type View = {
  render: (state: GameState) => void;
  announce: (text: string) => void;
};

export const createView = (
  onPress: () => void,
  onBuy: (def: UpgradeDef) => void,
): View => {
  const app = document.querySelector<HTMLElement>("#app")!;

  const heading = document.createElement("h1");
  heading.textContent = "Sporefall";

  const image = document.createElement("img");
  image.src = mossUrl;
  image.alt = "A moss patch dotted with pale spore cases";
  image.width = 96;
  image.height = 96;

  const counter = document.createElement("p");
  counter.id = "spore-counter";

  const rateReadout = document.createElement("p");
  rateReadout.id = "production-rate";

  const announcement = document.createElement("p");
  announcement.id = "announcement";
  announcement.setAttribute("aria-live", "polite");
  announcement.classList.add("hint");

  const pressButton = document.createElement("button");
  pressButton.id = "press-button";
  pressButton.addEventListener("click", onPress);

  const buyButtons = new Map<string, HTMLButtonElement>();
  const rows: HTMLElement[] = [];
  for (const def of UPGRADES) {
    const button = document.createElement("button");
    button.id = `buy-${def.id}`;
    button.addEventListener("click", () => onBuy(def));

    const note = document.createElement("p");
    note.className = "hint";
    note.textContent = def.description;

    buyButtons.set(def.id, button);
    rows.push(button, note);
  }

  app.append(
    heading,
    image,
    pressButton,
    counter,
    rateReadout,
    announcement,
    ...rows,
  );

  return {
    render: (state: GameState) => {
      counter.textContent = `${Math.floor(state.spores)} spores`;
      rateReadout.textContent = `Growth: ${
        sporesPerSecond(state).toFixed(1)
      } spores per second`;
      pressButton.textContent = `Press the moss patch (+${
        sporesPerPress(state)
      } spore)`;
      for (const def of UPGRADES) {
        const button = buyButtons.get(def.id)!;
        const cost = costOf(def, state);
        const owned = state.owned[def.id] ?? 0;
        button.textContent =
          `Buy ${def.name.toLowerCase()} (${cost} spores) — owned ${owned}`;
        button.disabled = state.spores < cost;
      }
    },
    announce: (text: string) => {
      announcement.textContent = text;
    },
  };
};
