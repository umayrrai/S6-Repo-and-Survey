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
    id: "spring-drip",
    name: "Spring drip",
    description: "Cold water beads off a stone and feeds the moss below.",
    baseCost: 45,
    costGrowth: 1.35,
    effect: { kind: "perSecond", rate: 1.5 },
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
    id: "beetle-patrol",
    name: "Beetle patrol",
    description:
      "Little beetles turn fallen leaves into fresh, spore-rich soil.",
    baseCost: 340,
    costGrowth: 1.35,
    effect: { kind: "perSecond", rate: 5 },
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
  {
    id: "scattering-flick",
    name: "Scattering flick",
    description:
      "A practiced flick of the wrist scatters loose spores with every press.",
    baseCost: 600,
    costGrowth: 1.6,
    effect: { kind: "perPress", bonus: 8 },
  },
  {
    id: "rain-shower",
    name: "Rain shower",
    description:
      "A warm shower passes over the canopy and washes the spores loose.",
    baseCost: 3200,
    costGrowth: 1.35,
    effect: { kind: "perSecond", rate: 30 },
  },
];
