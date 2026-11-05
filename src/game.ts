import { type UpgradeDef, UPGRADES } from "./upgrades.ts";

// The game model: state plus the rules that change it. No DOM lives here.
export type GameState = {
  spores: number;
  owned: Record<string, number>;
};

export const AMBIENT_RATE = 1 / 3; // the breeze, in spores per second
export const BASE_PRESS = 1;

export const createGame = (): GameState => ({ spores: 0, owned: {} });

// Each repeat of an upgrade costs more than the last, so early purchases
// shape how long later ones take to reach.
export const costOf = (def: UpgradeDef, state: GameState): number =>
  Math.ceil(def.baseCost * def.costGrowth ** (state.owned[def.id] ?? 0));

export const sporesPerSecond = (state: GameState): number => {
  let rate = AMBIENT_RATE;
  for (const def of UPGRADES) {
    if (def.effect.kind === "perSecond") {
      rate += def.effect.rate * (state.owned[def.id] ?? 0);
    }
  }
  return rate;
};

export const sporesPerPress = (state: GameState): number => {
  let press = BASE_PRESS;
  for (const def of UPGRADES) {
    if (def.effect.kind === "perPress") {
      press += def.effect.bonus * (state.owned[def.id] ?? 0);
    }
  }
  return press;
};

// Returns false when the purchase is unaffordable; nothing changes then.
export const buy = (state: GameState, def: UpgradeDef): boolean => {
  const cost = costOf(def, state);
  if (state.spores < cost) return false;
  state.spores -= cost;
  state.owned[def.id] = (state.owned[def.id] ?? 0) + 1;
  return true;
};

// Growth accrues from elapsed seconds, not frames, so it is independent of
// the display's frame rate.
export const grow = (state: GameState, seconds: number): void => {
  state.spores += sporesPerSecond(state) * seconds;
};
