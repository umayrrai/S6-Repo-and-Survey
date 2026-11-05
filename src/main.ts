import { buy, createGame, grow, sporesPerPress } from "./game.ts";
import { createView } from "./view.ts";

// Wiring: connect the model to the view and drive the loop.
const state = createGame();

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

let lastTime = performance.now();

const tick = (now: number) => {
  const elapsedSeconds = (now - lastTime) / 1000;
  lastTime = now;
  grow(state, elapsedSeconds);
  view.render(state);
  requestAnimationFrame(tick);
};

requestAnimationFrame(tick);
