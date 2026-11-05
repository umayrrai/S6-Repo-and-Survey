// Upgrade content lives here as data. Adding an upgrade means adding an
// entry; the shared game and view code picks it up unchanged.
export type UpgradeEffect =
  | { kind: "perSecond"; rate: number }
  | { kind: "perPress"; bonus: number };

export type UpgradeDef = {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  costGrowth: number;
  effect: UpgradeEffect;
};

export const UPGRADES: UpgradeDef[] = [
  {
    id: "damp-log",
    name: "Damp log",
    description: "A log that stays wet — moss spreads on its own.",
    baseCost: 15,
    costGrowth: 1.35,
    effect: { kind: "perSecond", rate: 0.5 },
  },
  {
    id: "sticky-fingers",
    name: "Sticky fingers",
    description: "Sap on your fingertips — every press carries more spores.",
    baseCost: 50,
    costGrowth: 1.6,
    effect: { kind: "perPress", bonus: 1 },
  },
  {
    id: "fern-patch",
    name: "Fern patch",
    description: "Ferns shade the moss and hold in moisture.",
    baseCost: 120,
    costGrowth: 1.35,
    effect: { kind: "perSecond", rate: 3 },
  },
  {
    id: "oak-canopy",
    name: "Oak canopy",
    description:
      "An old oak leans over the patch, and every falling leaf feeds the moss.",
    baseCost: 900,
    costGrowth: 1.35,
    effect: { kind: "perSecond", rate: 12 },
  },
];
