/** Simple RNN step for sequence demos. */

export type RNNState = {
  wxh: number;
  whh: number;
  why: number;
  bh: number;
  by: number;
  h: number;
};

export function createRNN(): RNNState {
  return { wxh: 0.8, whh: 0.6, why: 1.0, bh: 0, by: 0, h: 0 };
}

export function rnnStep(state: RNNState, x: number): { state: RNNState; y: number; hPre: number } {
  const hPre = state.wxh * x + state.whh * state.h + state.bh;
  const h = Math.tanh(hPre);
  const y = state.why * h + state.by;
  return { state: { ...state, h }, y, hPre };
}

export function runRNN(state: RNNState, inputs: number[]) {
  const steps: { x: number; h: number; y: number; hPre: number }[] = [];
  let s = { ...state, h: 0 };
  for (const x of inputs) {
    const r = rnnStep(s, x);
    s = r.state;
    steps.push({ x, h: s.h, y: r.y, hPre: r.hPre });
  }
  return steps;
}

/** Word embeddings in 2D for similarity demos. */
export type Embedding2D = { word: string; x: number; y: number };

export const DEFAULT_EMBEDDINGS: Embedding2D[] = [
  { word: "king", x: 1.2, y: 0.8 },
  { word: "queen", x: 1.0, y: 0.9 },
  { word: "man", x: 0.6, y: 0.3 },
  { word: "woman", x: 0.5, y: 0.4 },
  { word: "apple", x: -0.9, y: 0.7 },
  { word: "fruit", x: -0.7, y: 0.5 },
  { word: "car", x: -0.3, y: -0.8 },
  { word: "drive", x: -0.1, y: -0.6 },
];

export function cosineSimilarity(a: Embedding2D, b: Embedding2D): number {
  const dot = a.x * b.x + a.y * b.y;
  const na = Math.sqrt(a.x * a.x + a.y * a.y);
  const nb = Math.sqrt(b.x * b.x + b.y * b.y);
  if (na === 0 || nb === 0) return 0;
  return dot / (na * nb);
}

/** Scaled dot-product attention over values. */
export function attentionWeights(query: number[], keys: number[][]): number[] {
  const scale = Math.sqrt(query.length);
  const scores = keys.map((k) =>
    query.reduce((s, q, i) => s + q * (k[i] ?? 0), 0) / scale,
  );
  const max = Math.max(...scores);
  const exp = scores.map((s) => Math.exp(s - max));
  const sum = exp.reduce((a, b) => a + b, 0);
  return exp.map((e) => e / sum);
}

export function weightedSum(weights: number[], values: number[][]): number[] {
  const dim = values[0]?.length ?? 0;
  const out = Array(dim).fill(0);
  weights.forEach((w, i) => {
    values[i]?.forEach((v, d) => {
      out[d] += w * v;
    });
  });
  return out;
}
