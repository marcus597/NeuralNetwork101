/** Semantic pizza brain — teaches thinking, not math. */

export type PizzaIngredientId = "tomato" | "dough" | "cheese" | "pepperoni";

export type TrickIngredientId =
  | "chocolate"
  | "icecream"
  | "banana"
  | "candy"
  | "fish"
  | "pickles";

export type IngredientId = PizzaIngredientId | TrickIngredientId;

export type IngredientAmount = 0 | 0.5 | 1;

export type IngredientState = Record<IngredientId, IngredientAmount>;

export type IngredientDef = {
  id: IngredientId;
  emoji: string;
  label: string;
  color: string;
  soft: string;
  pizza: boolean;
  weirdLabel: string;
};

export const PIZZA_CLUES: IngredientDef[] = [
  {
    id: "tomato",
    emoji: "🍅",
    label: "Tomato Sauce",
    color: "#e85d4a",
    soft: "#fdecea",
    pizza: true,
    weirdLabel: "",
  },
  {
    id: "dough",
    emoji: "🍞",
    label: "Dough",
    color: "#e6a817",
    soft: "#fef6e4",
    pizza: true,
    weirdLabel: "",
  },
  {
    id: "cheese",
    emoji: "🧀",
    label: "Cheese",
    color: "#f4a261",
    soft: "#fef3eb",
    pizza: true,
    weirdLabel: "",
  },
  {
    id: "pepperoni",
    emoji: "🥓",
    label: "Pepperoni",
    color: "#c45c4a",
    soft: "#fceee9",
    pizza: true,
    weirdLabel: "",
  },
];

export const TRICKY_STUFF: IngredientDef[] = [
  {
    id: "chocolate",
    emoji: "🍫",
    label: "Chocolate",
    color: "#6b4423",
    soft: "#f3ebe3",
    pizza: false,
    weirdLabel: "Chocolate detected!",
  },
  {
    id: "icecream",
    emoji: "🍦",
    label: "Ice Cream",
    color: "#f4a7c0",
    soft: "#fdeef4",
    pizza: false,
    weirdLabel: "Ice cream?! On pizza?!",
  },
  {
    id: "banana",
    emoji: "🍌",
    label: "Banana",
    color: "#f2c94c",
    soft: "#fef9e7",
    pizza: false,
    weirdLabel: "Banana does not belong here.",
  },
  {
    id: "candy",
    emoji: "🍬",
    label: "Candy",
    color: "#e056fd",
    soft: "#faeafe",
    pizza: false,
    weirdLabel: "Candy?! That's dessert!",
  },
  {
    id: "fish",
    emoji: "🐟",
    label: "Fish",
    color: "#3498db",
    soft: "#eaf4fc",
    pizza: false,
    weirdLabel: "Fish belongs on sushi, not pizza!",
  },
  {
    id: "pickles",
    emoji: "🥒",
    label: "Pickles",
    color: "#6ab04c",
    soft: "#eef8ea",
    pizza: false,
    weirdLabel: "Pickles? That's a weird topping…",
  },
];

export const INGREDIENTS: IngredientDef[] = [...PIZZA_CLUES, ...TRICKY_STUFF];

const INGREDIENT_BY_ID = Object.fromEntries(
  INGREDIENTS.map((ing) => [ing.id, ing]),
) as Record<IngredientId, IngredientDef>;

/** Fisher–Yates shuffle — pizza toppings mixed with everything else. */
export function shuffleIngredients(items: IngredientDef[] = INGREDIENTS): IngredientDef[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

/** Stable mixed order for first paint (avoids hydration flicker). */
export function mixedIngredientOrder(): IngredientDef[] {
  const order: IngredientId[] = [
    "fish",
    "tomato",
    "candy",
    "dough",
    "banana",
    "cheese",
    "chocolate",
    "pepperoni",
    "pickles",
    "icecream",
  ];
  return order.map((id) => INGREDIENT_BY_ID[id]);
}

export const DETECTORS = [
  {
    id: "cheesy",
    emoji: "🟣",
    name: "Cheesy Detector",
    job: "Checks for cheese",
  },
  {
    id: "bread",
    emoji: "🟣",
    name: "Bread Detector",
    job: "Checks for dough",
  },
  {
    id: "shape",
    emoji: "🟣",
    name: "Pizza Shape Detector",
    job: "Looks for a real pizza combo",
  },
  {
    id: "savory",
    emoji: "🟣",
    name: "Savory Detector",
    job: "Checks for savory toppings",
  },
  {
    id: "weird",
    emoji: "🟣",
    name: "Weird Stuff Detector",
    job: "Spots things that do NOT belong on pizza",
  },
] as const;

export type DetectorId = (typeof DETECTORS)[number]["id"];

export type DetectorState = {
  id: DetectorId;
  level: number;
  thought: string;
  active: boolean;
};

export type BrainVerdict = {
  isPizza: boolean;
  idle: boolean;
  confidence: number;
  label: string;
  detectors: DetectorState[];
  pizzaVotes: number;
};

export const AMOUNT_LABELS: Record<IngredientAmount, string> = {
  0: "Off",
  0.5: "A little",
  1: "Lots!",
};

function blankPlate(): IngredientState {
  return {
    tomato: 0,
    dough: 0,
    cheese: 0,
    pepperoni: 0,
    chocolate: 0,
    icecream: 0,
    banana: 0,
    candy: 0,
    fish: 0,
    pickles: 0,
  };
}

export function defaultPlate(): IngredientState {
  return { ...blankPlate(), tomato: 1, dough: 1, cheese: 1 };
}

export function emptyPlate(): IngredientState {
  return blankPlate();
}

export function plateHasClues(plate: IngredientState): boolean {
  return INGREDIENTS.some((i) => plate[i.id] > 0);
}

export function cycleAmount(current: IngredientAmount): IngredientAmount {
  if (current === 0) return 0.5;
  if (current === 0.5) return 1;
  return 0;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function thought(
  level: number,
  high: string,
  mid: string,
  low: string,
  off: string,
): string {
  if (level >= 0.75) return high;
  if (level >= 0.4) return mid;
  if (level > 0) return low;
  return off;
}

function weirdThought(plate: IngredientState): { level: number; thought: string } {
  const active = TRICKY_STUFF.map((t) => ({ ...t, amount: plate[t.id] }))
    .filter((t) => t.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  if (active.length === 0) {
    return { level: 0, thought: "Nothing weird here." };
  }

  const level = clamp01(active.reduce((s, t) => s + t.amount, 0) / 1.6);
  const loudest = active[0]!;

  if (active.length >= 3) {
    return { level, thought: "Way too much weird stuff!" };
  }
  if (active.length === 2) {
    return {
      level,
      thought: `${loudest.weirdLabel} And something else odd too…`,
    };
  }
  if (loudest.amount >= 1) return { level, thought: loudest.weirdLabel };
  return { level, thought: `Hmm… a little ${loudest.label.toLowerCase()}?` };
}

export function thinkAboutPizza(plate: IngredientState): BrainVerdict {
  if (!plateHasClues(plate)) {
    return {
      isPizza: false,
      idle: true,
      confidence: 0,
      label: "Waiting…",
      pizzaVotes: 0,
      detectors: DETECTORS.map((d) => ({
        id: d.id,
        level: 0,
        active: false,
        thought: "Waiting for clues.",
      })),
    };
  }

  const tomato = plate.tomato;
  const dough = plate.dough;
  const cheese = plate.cheese;
  const pepperoni = plate.pepperoni;

  const cheesyLevel = cheese;
  const breadLevel = dough;
  const shapeLevel = clamp01(
    Math.min(dough, 0.5 + tomato * 0.5) *
      (tomato > 0 && (cheese > 0 || pepperoni > 0) ? 1 : 0.3),
  );
  const savoryLevel = clamp01((tomato + cheese + pepperoni) / 3);
  const weird = weirdThought(plate);

  const detectors: DetectorState[] = [
    {
      id: "cheesy",
      level: cheesyLevel,
      active: cheesyLevel >= 0.4,
      thought: thought(
        cheesyLevel,
        "Lots of cheese!",
        "Some cheese.",
        "Barely any cheese.",
        "No cheese at all.",
      ),
    },
    {
      id: "bread",
      level: breadLevel,
      active: breadLevel >= 0.4,
      thought: thought(
        breadLevel,
        "Solid dough base!",
        "A little dough.",
        "Not enough dough.",
        "No bread!",
      ),
    },
    {
      id: "shape",
      level: shapeLevel,
      active: shapeLevel >= 0.45,
      thought:
        shapeLevel >= 0.7
          ? "Looks like pizza!"
          : shapeLevel >= 0.35
            ? "Getting pizza-shaped…"
            : dough > 0 && weird.level > 0.4
              ? "Dough plus weird stuff? Hmm…"
              : "Does not look like pizza.",
    },
    {
      id: "savory",
      level: savoryLevel,
      active: savoryLevel >= 0.35,
      thought: thought(
        savoryLevel,
        "Very savory!",
        "Some savory clues.",
        "Not very savory.",
        "Nothing savory here.",
      ),
    },
    {
      id: "weird",
      level: weird.level,
      active: weird.level >= 0.25,
      thought: weird.thought,
    },
  ];

  const pizzaVotes =
    cheesyLevel * 0.18 +
    breadLevel * 0.17 +
    shapeLevel * 0.27 +
    savoryLevel * 0.18 -
    weird.level * 0.72;

  const isPizza =
    pizzaVotes >= 0.4 &&
    weird.level < 0.5 &&
    shapeLevel >= 0.35 &&
    savoryLevel >= 0.25;

  const confidence = clamp01(
    Math.abs(pizzaVotes - 0.35) * 1.3 + (isPizza ? 0.12 : 0.15) - weird.level * 0.1,
  );

  return {
    isPizza,
    idle: false,
    confidence,
    label: isPizza ? "Pizza!" : "Not pizza",
    detectors,
    pizzaVotes,
  };
}

export const PRESET_PLATES = [
  {
    id: "classic",
    name: "Classic pizza",
    emoji: "🍕",
    plate: {
      ...blankPlate(),
      tomato: 1,
      dough: 1,
      cheese: 1,
      pepperoni: 1,
    } as IngredientState,
  },
  {
    id: "sneaky",
    name: "Sneaky pizza",
    emoji: "😈",
    plate: {
      ...blankPlate(),
      tomato: 1,
      dough: 1,
      cheese: 1,
      pepperoni: 1,
      banana: 0.5,
      icecream: 0.5,
    } as IngredientState,
  },
  {
    id: "chaos",
    name: "Kitchen chaos",
    emoji: "🍌",
    plate: {
      ...blankPlate(),
      dough: 1,
      banana: 1,
      candy: 1,
      fish: 0.5,
    } as IngredientState,
  },
  {
    id: "dessert",
    name: "Dessert plate",
    emoji: "🍫",
    plate: {
      ...blankPlate(),
      dough: 1,
      chocolate: 1,
      icecream: 1,
    } as IngredientState,
  },
] as const;

/** Which inputs feed each detector (for animation wiring). */
export const DETECTOR_INPUTS: Record<DetectorId, IngredientId[]> = {
  cheesy: ["cheese"],
  bread: ["dough"],
  shape: ["tomato", "dough", "cheese", "pepperoni"],
  savory: ["tomato", "cheese", "pepperoni"],
  weird: TRICKY_STUFF.map((t) => t.id),
};
