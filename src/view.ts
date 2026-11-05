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
  const shopHeading = document.createElement("h2");
  shopHeading.textContent = "Grow the terrarium";
  for (const def of UPGRADES) {
    const card = document.createElement("div");
    card.className = "upgrade";

    const button = document.createElement("button");
    button.id = `buy-${def.id}`;
    button.addEventListener("click", () => onBuy(def));

    const note = document.createElement("p");
    note.className = "hint";
    note.textContent = def.description;

    const effect = document.createElement("p");
    effect.className = "hint";
    effect.id = `effect-${def.id}`;

    card.append(button, note, effect);
    buyButtons.set(def.id, button);
    rows.push(card);
  }

  // Floating feedback on press: a brief "+N" rising from the button.
  let latest: GameState | null = null;
  const floatSpores = (): void => {
    if (!latest) return;
    const rect = pressButton.getBoundingClientRect();
    const span = document.createElement("span");
    span.className = "spore-float";
    span.textContent = `+${sporesPerPress(latest)}`;
    span.style.left = `${rect.left + rect.width / 2}px`;
    span.style.top = `${rect.top}px`;
    span.addEventListener("animationend", () => span.remove());
    document.body.append(span);
  };
  pressButton.addEventListener("click", floatSpores);

  app.append(
    heading,
    image,
    pressButton,
    counter,
    rateReadout,
    announcement,
    shopHeading,
    ...rows,
  );

  return {
    render: (state: GameState) => {
      latest = state;
      counter.textContent = `${Math.floor(state.spores)} spores`;
      rateReadout.textContent = `Growth: ${
        sporesPerSecond(state).toFixed(1)
      } spores per second`;
      const press = sporesPerPress(state);
      pressButton.textContent = `Press the moss patch (+${press} spore${
        press === 1 ? "" : "s"
      })`;
      for (const def of UPGRADES) {
        const button = buyButtons.get(def.id)!;
        const cost = costOf(def, state);
        const owned = state.owned[def.id] ?? 0;
        button.textContent =
          `Buy ${def.name.toLowerCase()} (${cost} spores) — owned ${owned}`;
        button.disabled = state.spores < cost;

        const effect = document.getElementById(`effect-${def.id}`)!;
        const rate = def.effect.kind === "perSecond"
          ? `+${(def.effect.rate * owned).toFixed(1)} spores/s`
          : `+${def.effect.bonus * owned} spores per press`;
        effect.textContent = owned > 0 ? `Owned ${owned} — ${rate}` : "";
      }
    },
    announce: (text: string) => {
      announcement.textContent = text;
    },
  };
};
