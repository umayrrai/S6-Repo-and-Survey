import { buy, grow, sporesPerPress } from "./game.ts";
import { loadGame, saveGame } from "./save.ts";
import { createView } from "./view.ts";

// Wiring: connect the model to the view and drive the loop.
const { state, offlineSeconds } = loadGame();

const view = createView(
  () => {
    state.spores += sporesPerPress(state);
    view.render(state);
  },
  (def) => {
    buy(state, def);
    view.render(state);
  },
);

view.render(state);

if (offlineSeconds > 0) {
  const before = Math.floor(state.spores);
  grow(state, offlineSeconds);
  view.announce(
    `While you were away, the moss kept growing (+${
      Math.floor(state.spores) - before
    } spores).`,
  );
  view.render(state);
}

let lastTime = performance.now();
let lastSave = 0;

const tick = (now: number) => {
  const elapsedSeconds = (now - lastTime) / 1000;
  lastTime = now;
  grow(state, elapsedSeconds);
  view.render(state);
  if (now - lastSave > 5000) {
    lastSave = now;
    saveGame(state);
  }
  requestAnimationFrame(tick);
};

requestAnimationFrame(tick);

// A hidden tab stops rAF, so the periodic save inside tick stops too; save
// once at the moment of hiding, and once more before the page goes away.
document.addEventListener("visibilitychange", () => {
  if (document.hidden) saveGame(state);
});
globalThis.addEventListener("pagehide", () => saveGame(state));
