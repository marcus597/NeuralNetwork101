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

export type ConceptTerm = {
  term: string;
  definition: string;
};

export type ConceptRevealContent = {
  emoji: string;
  title: string;
  paragraphs: string[];
  diagram?: ConceptDiagramId;
  /** Simple equation shown under the diagram */
  formula?: string;
  /** Neural-net vocabulary tied to this moment */
  terms?: ConceptTerm[];
  buttonLabel?: string;
};

export const GAME_CONCEPT_REVEALS: Partial<Record<PresetId, Record<string, ConceptRevealContent>>> = {
  "game-neuron": {
    sum: {
      emoji: "➕",
      title: "Neurons add weighted inputs",
      diagram: "single-neuron",
      formula: "sum = (w₁·x₁) + (w₂·x₂) + (w₃·x₃) + bias",
      terms: [
        { term: "Input (x)", definition: "A clue coming into the neuron — a number." },
        { term: "Weight (w)", definition: "How much that clue counts. Big weight = loud clue." },
        { term: "Bias", definition: "A starting nudge — makes ON easier or harder." },
      ],
      paragraphs: [
        "Why this matters: every neural network starts here. A neuron’s first job is to combine clues into one score.",
        "You added three signals. A real neuron does the same, but each signal is multiplied by a weight first, then a bias is added.",
      ],
    },
    state: {
      emoji: "💡",
      title: "Activation: on or off",
      diagram: "single-neuron",
      formula: "output = 1 if sum ≥ threshold, else 0",
      terms: [
        { term: "Activation", definition: "The rule that turns the sum into a final output." },
        { term: "Threshold", definition: "The cutoff — here, 5. Above = ON, below = OFF." },
        { term: "Neuron", definition: "One tiny decision unit: combine → activate → send." },
      ],
      paragraphs: [
        "Why this matters: networks only become useful when neurons decide — fire or stay quiet. That decision is activation.",
        "When the total is high enough, the neuron turns ON. Too low and it stays OFF. Soft versions (ReLU, sigmoid) use the same idea with smoother curves.",
      ],
    },
  },
  "game-team": {
    count: {
      emoji: "🧠",
      title: "Layers beat a lone neuron",
      diagram: "neuron-team",
      formula: "layer → layer → output",
      terms: [
        { term: "Layer", definition: "A row of neurons that all look at the same inputs." },
        { term: "Hidden layer", definition: "Middle layers that mix clues before the answer." },
        { term: "Deep network", definition: "Many layers stacked — more steps to combine patterns." },
      ],
      paragraphs: [
        "One neuron can only do a tiny job. Stack several and you get a layer. Stack layers and you get a network.",
        "Each neuron checks something small. Together they build richer features — edges → shapes → “cat.”",
      ],
    },
  },
  "game-guess": {
    guess: {
      emoji: "🐱",
      title: "Classification picks a label",
      diagram: "classifier",
      formula: "prediction = argmax(scores)",
      terms: [
        { term: "Features", definition: "Clues the model reads — whiskers, ears, color…" },
        { term: "Classifier", definition: "A model that chooses a category (cat, dog, pizza)." },
        { term: "Softmax", definition: "Turns output scores into probabilities that add to 1." },
      ],
      paragraphs: [
        "You weighed clues and typed “cat.” A network does the same: it scores each possible label, then picks the highest.",
        "The output layer is that final guess — one answer chosen from everything the earlier layers noticed.",
      ],
    },
  },
  "game-robot": {
    "round-0": {
      emoji: "✏️",
      title: "Training = fix the mistake",
      diagram: "learning-fix",
      formula: "new weight ≈ old weight − learning_rate × error",
      terms: [
        { term: "Error / loss", definition: "How wrong the guess was vs the true answer." },
        { term: "Learning rate", definition: "How big each weight update is — small steps are safer." },
        { term: "Training step", definition: "One fix: see mistake → nudge weights → try again." },
      ],
      paragraphs: [
        "You corrected a wrong answer. Training works the same way: show the wrong guess, compare to the truth, then nudge the weights.",
        "Do that many times and the network gets less wrong — that is learning.",
      ],
    },
    "round-1": {
      emoji: "📉",
      title: "Loss tells the network what to fix",
      diagram: "learning-fix",
      formula: "loss = how far guess is from truth",
      terms: [
        { term: "Loss", definition: "A score for “how wrong.” Training tries to make it smaller." },
        { term: "Backpropagation", definition: "Send the error backward so every weight learns its share." },
        { term: "Gradient", definition: "The direction each weight should move to reduce loss." },
      ],
      paragraphs: [
        "When the prediction is off, the gap between guess and truth is the loss — the signal that something must change.",
        "Backpropagation is just: spot the mistake at the end, then walk it back through the layers to update weights.",
      ],
    },
    "round-2": {
      emoji: "🔁",
      title: "Many steps make smart weights",
      diagram: "learning-fix",
      formula: "repeat: predict → compare → update",
      terms: [
        { term: "Epoch", definition: "One full pass over the training examples." },
        { term: "Batch", definition: "A small chunk of examples used for one update." },
        { term: "Convergence", definition: "When loss stops dropping — the model has settled." },
      ],
      paragraphs: [
        "Every correction you typed is like one training step. Thousands of steps on lots of examples make the weights reliable.",
        "Chatbots and image models learn the same loop — not magic, just predict → measure error → update.",
      ],
    },
  },
  "game-puppy": {
    example: {
      emoji: "🎾",
      title: "AI learns from examples",
      diagram: "training-examples",
      formula: "(photo, label) → training pair",
      terms: [
        { term: "Training data", definition: "Examples paired with the right answer." },
        { term: "Label", definition: "The correct name for an example — here, “tennis ball.”" },
        { term: "Supervised learning", definition: "Learn from labeled pairs: input + answer." },
      ],
      paragraphs: [
        "Each label you added is training data — a photo paired with the right answer. Networks learn by seeing many pairs like this.",
        "More good examples means the AI recognizes tennis balls (or cats, or pizza) more reliably.",
      ],
    },
  },
  "game-cat": {
    guess: {
      emoji: "🔍",
      title: "CNNs scan piece by piece",
      diagram: "scan-grid",
      formula: "local patch → feature → bigger pattern",
      terms: [
        { term: "Convolution", definition: "Slide a small filter over the image to spot local patterns." },
        { term: "Filter / kernel", definition: "A tiny pattern detector (edge, whisker, ear…)." },
        { term: "Feature map", definition: "Where in the image that pattern showed up." },
      ],
      paragraphs: [
        "You revealed squares and guessed cat. Convolutional networks do something similar: they scan small patches and build bigger patterns.",
        "Letters in a grid, pixels in a photo — look locally first, then combine clues into “that’s a cat.”",
      ],
    },
  },
  "game-oops": {
    name: {
      emoji: "🍌",
      title: "First read the input clearly",
      diagram: "classifier",
      formula: "input → features → prediction",
      terms: [
        { term: "Input layer", definition: "Where raw data enters — pixels, words, or numbers." },
        { term: "Representation", definition: "How the net encodes what it “sees” before guessing." },
        { term: "Inference", definition: "Using a trained model to make a new prediction." },
      ],
      paragraphs: [
        "You named what is really in the picture. Before judging, the network has to read the input correctly — ingredients, pixels, or words.",
        "Garbage in, garbage out: if the first layer misreads the input, every later layer is guessing from a bad map.",
      ],
    },
    fix: {
      emoji: "⚠️",
      title: "Bad data → silly mistakes",
      diagram: "training-examples",
      formula: "biased data → biased model",
      terms: [
        { term: "Bias (data)", definition: "Training that only shows one kind of thing." },
        { term: "Overfitting", definition: "Memorizing quirks instead of the real pattern." },
        { term: "Generalization", definition: "Doing well on new examples, not just the training set." },
      ],
      paragraphs: [
        "The AI said apple for a banana because it did not see enough variety. If training only shows apples, everything looks like an apple.",
        "Fixing the label is like giving the network a better example so its weights shift toward the truth.",
      ],
    },
  },
  "game-words": {
    similar: {
      emoji: "🧲",
      title: "Words live as vectors",
      diagram: "word-map",
      formula: "similar meaning → nearby vectors",
      terms: [
        { term: "Embedding", definition: "A list of numbers that places a word on a map." },
        { term: "Vector", definition: "That list of numbers — a point in space." },
        { term: "Similarity", definition: "How close two embeddings are (cat ≈ dog)." },
      ],
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
      formula: "attention weights → spotlight on key tokens",
      terms: [
        { term: "Token", definition: "A chunk of text the model reads — often a word or piece of one." },
        { term: "Attention", definition: "Scores that say which tokens matter for this step." },
        { term: "Transformer", definition: "The architecture that uses attention everywhere (GPT, etc.)." },
      ],
      paragraphs: [
        "You picked “cat” as the important word. Attention does that across a whole sentence — some tokens get a bright spotlight, others fade.",
        "Transformers use attention so the network knows which clues to listen to when it answers.",
      ],
    },
  },
  "game-chat": {
    question: {
      emoji: "💬",
      title: "Your question becomes tokens",
      diagram: "chat-pipeline",
      formula: "text → tokens → vectors",
      terms: [
        { term: "Tokenization", definition: "Split text into pieces the model can read." },
        { term: "Input layer", definition: "Where those token vectors enter the network." },
        { term: "Context", definition: "The tokens the model can “see” at once." },
      ],
      paragraphs: [
        "The chatbot first breaks your question into tokens. That is the input — raw text turned into numbers the network can use.",
      ],
    },
    "step-1": {
      emoji: "📝",
      title: "Text goes in as numbers",
      diagram: "chat-pipeline",
      formula: "token → embedding vector",
      terms: [
        { term: "Embedding", definition: "Each token becomes a vector on the meaning map." },
        { term: "Vocabulary", definition: "The set of tokens the model knows." },
      ],
      paragraphs: [
        "Every word (token) becomes a vector. The network now has a numeric snapshot of what you asked — ready for the layers in the middle.",
      ],
    },
    "step-2": {
      emoji: "👀",
      title: "The model looks closely",
      diagram: "attention",
      formula: "query · key → attention score",
      terms: [
        { term: "Attention", definition: "Which parts of your question matter for the next word." },
        { term: "Hidden state", definition: "The model’s internal summary after looking." },
      ],
      paragraphs: [
        "Attention scans your question and highlights the important pieces — just like you picked the key word in the last game.",
      ],
    },
    "step-3": {
      emoji: "💬",
      title: "The network writes a reply",
      diagram: "chat-pipeline",
      formula: "next word = argmax(vocab scores)",
      terms: [
        { term: "Output layer", definition: "Scores every possible next token." },
        { term: "Autoregressive", definition: "Generate one token, feed it back, repeat." },
        { term: "Decoding", definition: "Turning those scores into the words you read." },
      ],
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
  formula: "input → hidden layers → output",
  terms: [
    { term: "Input layer", definition: "Ingredients / features go in here." },
    { term: "Hidden layers", definition: "Mix clues together into richer patterns." },
    { term: "Output layer", definition: "Final guess — pizza or not pizza." },
    { term: "Depth", definition: "More hidden layers = a deeper network." },
  ],
  paragraphs: [
    "Your pizza brain works just like this diagram. Ingredients enter on the left. Hidden layers in the middle combine clues. The output on the right makes the final guess.",
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

/** Always-available fallback so a missing step never skips the teach moment. */
export function getGameConceptRevealOrFallback(
  presetId: PresetId,
  stepId: string,
): ConceptRevealContent {
  return (
    getGameConceptReveal(presetId, stepId) ?? {
      emoji: "🧠",
      title: "This is how neural networks work",
      diagram: "deep-network",
      formula: "input → hidden layers → output",
      terms: [
        {
          term: "Neural network",
          definition: "Many simple neurons stacked in layers that learn from examples.",
        },
        {
          term: "Learning",
          definition: "Adjusting weights so the next guess is closer to the truth.",
        },
      ],
      paragraphs: [
        "What you just did matches a real step inside a neural network — reading inputs, combining clues, and making a decision.",
        "Each game question is a tiny piece of that pipeline. Stack the pieces and you get modern AI.",
      ],
    }
  );
}
