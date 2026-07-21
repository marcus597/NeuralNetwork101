import type { PresetId } from "@/engines/presets/registry";

export type ConceptDiagramId =
  | "deep-network"
  | "single-neuron"
  | "neuron-team"
  | "classifier"
  | "learning-fix"
  | "training-examples"
  | "scan-grid"
  | "word-map"
  | "attention"
  | "chat-pipeline";

export type ConceptRevealContent = {
  emoji: string;
  title: string;
  paragraphs: string[];
  diagram?: ConceptDiagramId;
  buttonLabel?: string;
};

export const GAME_CONCEPT_REVEALS: Partial<Record<PresetId, Record<string, ConceptRevealContent>>> = {
  "game-neuron": {
    sum: {
      emoji: "➕",
      title: "Neurons add their inputs",
      diagram: "single-neuron",
      paragraphs: [
        "You just added three signals — that is exactly what a neuron does first. Every input gets a number, and the neuron adds them up.",
        "In a real network, each connection can count more or less. But the first step is always: combine the clues into one total.",
      ],
    },
    state: {
      emoji: "💡",
      title: "Neurons turn on or off",
      diagram: "single-neuron",
      paragraphs: [
        "When the total is high enough, the neuron turns ON. When it is too low, it stays OFF. That is the whole decision.",
        "Real AI uses the same idea: each neuron fires or stays quiet based on how much signal it received.",
      ],
    },
  },
  "game-team": {
    count: {
      emoji: "🧠",
      title: "Many neurons beat one",
      diagram: "neuron-team",
      paragraphs: [
        "One neuron can only lift a little. Stack three together and they handle much more — that is why AI uses layers of neurons, not just one.",
        "Each neuron in the team checks something small. Together they solve bigger problems.",
      ],
    },
  },
  "game-guess": {
    guess: {
      emoji: "🐱",
      title: "AI picks the best label",
      diagram: "classifier",
      paragraphs: [
        "You looked at whiskers and ears, then typed cat. AI does the same: it reads clues from the input and picks the label that fits best.",
        "The output layer of a network is like your guess — one answer chosen from everything it noticed.",
      ],
    },
  },
  "game-robot": {
    "round-0": {
      emoji: "✏️",
      title: "Learning means fixing mistakes",
      diagram: "learning-fix",
      paragraphs: [
        "You corrected a wrong answer. Training a network works the same way: show the wrong guess, then show the right one.",
        "Each fix nudges the weights so the network is less wrong next time.",
      ],
    },
    "round-1": {
      emoji: "✏️",
      title: "Errors teach the network",
      diagram: "learning-fix",
      paragraphs: [
        "When the prediction is off, the network compares its guess to the truth. That gap is the error — the signal that something needs to change.",
        "You are doing backpropagation in plain English: spot the mistake, then update.",
      ],
    },
    "round-2": {
      emoji: "✏️",
      title: "Practice makes weights smarter",
      diagram: "learning-fix",
      paragraphs: [
        "Every correction you typed is like one training step. Do it thousands of times on lots of examples and the network gets reliable.",
        "That is how chatbots learn facts — not magic, just many small fixes.",
      ],
    },
  },
  "game-puppy": {
    example: {
      emoji: "🎾",
      title: "AI learns from examples",
      diagram: "training-examples",
      paragraphs: [
        "Each label you added is training data — a photo paired with the right answer. Networks learn by seeing many pairs like this.",
        "More good examples means the AI recognizes tennis balls (or cats, or pizza) more reliably.",
      ],
    },
  },
  "game-cat": {
    guess: {
      emoji: "🔍",
      title: "AI scans piece by piece",
      diagram: "scan-grid",
      paragraphs: [
        "You revealed squares and guessed cat. Convolutional networks do something similar: they scan small patches of an image and build up bigger patterns.",
        "Letters in a grid, pixels in a photo — the idea is the same: look locally, then combine clues.",
      ],
    },
  },
  "game-oops": {
    name: {
      emoji: "🍌",
      title: "First the AI needs to see clearly",
      diagram: "classifier",
      paragraphs: [
        "You named what is really in the picture. Before judging, the network has to read the input correctly — ingredients, pixels, or words.",
        "That raw input feeds the first layer, just like your answer named the fruit.",
      ],
    },
    fix: {
      emoji: "⚠️",
      title: "Bad training → silly mistakes",
      diagram: "training-examples",
      paragraphs: [
        "The AI said apple for a banana because it did not see enough variety. If training only shows apples, everything looks like an apple.",
        "Fixing the label is like giving the network a better example so its weights shift toward the truth.",
      ],
    },
  },
  "game-words": {
    similar: {
      emoji: "🧲",
      title: "Words live on a map",
      diagram: "word-map",
      paragraphs: [
        "Cat and dog sit close because they mean similar things. AI stores each word as a point in space — neighbors share meaning.",
        "Those points are embeddings. They let the network understand language without memorizing every sentence.",
      ],
    },
  },
  "game-focus": {
    keyword: {
      emoji: "👀",
      title: "Attention picks what matters",
      diagram: "attention",
      paragraphs: [
        "You picked cat as the important word. Attention does that across a whole sentence — some words get a bright spotlight, others fade.",
        "Transformers use attention so the network knows which clues to listen to when it answers.",
      ],
    },
  },
  "game-chat": {
    question: {
      emoji: "💬",
      title: "Your question becomes tokens",
      diagram: "chat-pipeline",
      paragraphs: [
        "The chatbot first breaks your question into words (tokens). That is the input layer — raw text turned into numbers the network can read.",
      ],
    },
    "step-1": {
      emoji: "📝",
      title: "Text goes in as numbers",
      diagram: "chat-pipeline",
      paragraphs: [
        "Every word becomes a vector on the map you saw earlier. The network now has a numeric snapshot of what you asked.",
      ],
    },
    "step-2": {
      emoji: "👀",
      title: "The model looks closely",
      diagram: "attention",
      paragraphs: [
        "Attention scans your question and highlights the important pieces — just like you picked the key word in the last game.",
      ],
    },
    "step-3": {
      emoji: "💬",
      title: "The network writes a reply",
      diagram: "chat-pipeline",
      paragraphs: [
        "The output layer generates the answer word by word. Words → look → reply. That pipeline is the core of ChatGPT and other chatbots.",
      ],
    },
  },
};

export const PIZZA_CONCEPT_REVEAL: ConceptRevealContent = {
  emoji: "🍕",
  title: "You built a neural network!",
  diagram: "deep-network",
  paragraphs: [
    "Your pizza brain works just like this diagram. Ingredients go into the input layer on the left. Hidden layers in the middle mix clues together. The output layer on the right makes the final guess — pizza or not pizza.",
    "More hidden layers means more steps to combine clues — that is what makes a network deep.",
  ],
  buttonLabel: "Nice — keep experimenting!",
};

export function getGameConceptReveal(
  presetId: PresetId,
  stepId: string,
): ConceptRevealContent | null {
  return GAME_CONCEPT_REVEALS[presetId]?.[stepId] ?? null;
}
