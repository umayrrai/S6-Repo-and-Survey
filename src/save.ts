import { createGame, type GameState } from "./game.ts";

// Progress survives a reload: spores, upgrades and the wall-clock moment of
// the last save. On load, real elapsed time away still grows the moss.
const KEY = "sporefall-save-v1";

// Long absences count, but an empty terrarium left for a year shouldn't hand
// back a fortune in one dump; eight hours is the window the moss remembers.
export const MAX_OFFLINE_SECONDS = 8 * 60 * 60;

export const loadGame = (): { state: GameState; offlineSeconds: number } => {
  const state = createGame();
  let offlineSeconds = 0;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const saved = JSON.parse(raw) as {
        spores?: number;
        owned?: Record<string, number>;
        savedAt?: number;
      };
      if (typeof saved.spores === "number" && saved.spores >= 0) {
        state.spores = saved.spores;
      }
      if (saved.owned && typeof saved.owned === "object") {
        state.owned = saved.owned;
      }
      if (typeof saved.savedAt === "number") {
        const away = (Date.now() - saved.savedAt) / 1000;
        offlineSeconds = Math.min(MAX_OFFLINE_SECONDS, Math.max(0, away));
      }
    }
  } catch {
    // A broken save must never keep the game from starting.
  }
  return { state, offlineSeconds };
};

export const saveGame = (state: GameState): void => {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        spores: state.spores,
        owned: state.owned,
        savedAt: Date.now(),
      }),
    );
  } catch {
    // Storage can be unavailable (private mode, quota); the game still plays.
  }
};
