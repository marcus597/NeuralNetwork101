/** Core neural network math for interactive labs. */

export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, x))));
}

export function sigmoidDerivative(x: number): number {
  const s = sigmoid(x);
  return s * (1 - s);
}

export function relu(x: number): number {
  return Math.max(0, x);
}

export function reluDerivative(x: number): number {
  return x > 0 ? 1 : 0;
}

export function tanh(x: number): number {
  return Math.tanh(x);
}

export function tanhDerivative(x: number): number {
  const t = Math.tanh(x);
  return 1 - t * t;
}

export type ActivationId = "sigmoid" | "relu" | "tanh";

export function activate(x: number, fn: ActivationId): number {
  switch (fn) {
    case "relu":
      return relu(x);
    case "tanh":
      return tanh(x);
    default:
      return sigmoid(x);
  }
}

export function activateDerivative(x: number, fn: ActivationId): number {
  switch (fn) {
    case "relu":
      return reluDerivative(x);
    case "tanh":
      return tanhDerivative(x);
    default:
      return sigmoidDerivative(x);
  }
}

/** Dot product + bias */
export function linear(inputs: number[], weights: number[], bias: number): number {
  return inputs.reduce((s, v, i) => s + v * (weights[i] ?? 0), 0) + bias;
}

/** Mean squared error */
export function mse(predictions: number[], targets: number[]): number {
  if (predictions.length === 0) return 0;
  return (
    predictions.reduce((s, p, i) => s + (p - (targets[i] ?? 0)) ** 2, 0) /
    predictions.length
  );
}

/** XOR dataset for tiny network demos */
export const XOR_DATA = [
  { inputs: [0, 0], target: 0 },
  { inputs: [0, 1], target: 1 },
  { inputs: [1, 0], target: 1 },
  { inputs: [1, 1], target: 0 },
] as const;

export type DataPoint = { inputs: readonly number[]; target: number };

/** 2→2→1 network forward pass */
export type TinyNetwork = {
  w1: number[][];
  b1: number[];
  w2: number[];
  b2: number;
  activation: ActivationId;
  frozenHidden?: boolean;
  frozenOutput?: boolean;
};

export type TinyGradients = {
  w1: number[][];
  b1: number[];
  w2: number[];
  b2: number;
};

export function createTinyNetwork(hiddenSize = 2): TinyNetwork {
  if (hiddenSize === 0) {
    return {
      w1: [],
      b1: [],
      w2: [0.5, -0.5],
      b2: 0,
      activation: "relu",
    };
  }
  return {
    w1: [
      [0.8, 0.6],
      [-0.7, 0.9],
    ].slice(0, hiddenSize),
    b1: [-0.2, 0.1].slice(0, hiddenSize),
    w2: Array.from({ length: hiddenSize }, (_, i) => (i === 0 ? 0.9 : -0.8)),
    b2: -0.1,
    activation: "relu",
  };
}

export function cloneNetwork(net: TinyNetwork): TinyNetwork {
  return structuredClone(net);
}

export function forwardTiny(
  net: TinyNetwork,
  inputs: number[],
): {
  hiddenPre: number[];
  hidden: number[];
  outputPre: number;
  output: number;
} {
  if (net.w1.length === 0) {
    const outputPre = linear(inputs, net.w2, net.b2);
    return { hiddenPre: [], hidden: [], outputPre, output: sigmoid(outputPre) };
  }
  const hiddenPre = net.w1.map((w, i) => linear(inputs, w, net.b1[i] ?? 0));
  const hidden = hiddenPre.map((z) => activate(z, net.activation));
  const outputPre = linear(hidden, net.w2, net.b2);
  const output = sigmoid(outputPre);
  return { hiddenPre, hidden, outputPre, output };
}

export function forwardAllTiny(net: TinyNetwork, data: readonly DataPoint[] = XOR_DATA) {
  return data.map((d) => ({
    ...d,
    ...forwardTiny(net, [...d.inputs]),
  }));
}

export type OptimizerId = "sgd" | "momentum" | "adam";

export type OptimizerState = {
  id: OptimizerId;
  velocity?: TinyGradients;
  m?: TinyGradients;
  v?: TinyGradients;
  t?: number;
};

export function zeroGradients(net: TinyNetwork): TinyGradients {
  return {
    w1: net.w1.map((row) => row.map(() => 0)),
    b1: net.b1.map(() => 0),
    w2: net.w2.map(() => 0),
    b2: 0,
  };
}

export function computeGradients(
  net: TinyNetwork,
  data: readonly DataPoint[] = XOR_DATA,
): { gradients: TinyGradients; loss: number; sampleTraces: SampleTrace[] } {
  let loss = 0;
  const grad = zeroGradients(net);
  const sampleTraces: SampleTrace[] = [];

  for (const sample of data) {
    const trace = forwardTiny(net, [...sample.inputs]);
    const err = trace.output - sample.target;
    loss += err * err;

    const dOut = (2 * err) / data.length;
    const dOutputPre = dOut * sigmoidDerivative(trace.outputPre);

    if (net.w1.length === 0) {
      for (let i = 0; i < sample.inputs.length; i++) {
        grad.w2[i] = (grad.w2[i] ?? 0) + dOutputPre * sample.inputs[i];
      }
      grad.b2 += dOutputPre;
    } else {
      for (let h = 0; h < trace.hidden.length; h++) {
        grad.w2[h] += dOutputPre * trace.hidden[h];
        const dHidden =
          dOutputPre * net.w2[h] * activateDerivative(trace.hiddenPre[h], net.activation);
        grad.b1[h] += dHidden;
        for (let i = 0; i < sample.inputs.length; i++) {
          grad.w1[h][i] += dHidden * sample.inputs[i];
        }
      }
      grad.b2 += dOutputPre;
    }

    sampleTraces.push({
      inputs: [...sample.inputs],
      target: sample.target,
      ...trace,
      dOutputPre,
      dHidden: trace.hidden.map(
        (_, h) =>
          dOutputPre * net.w2[h] * activateDerivative(trace.hiddenPre[h], net.activation),
      ),
    });
  }

  return { gradients: grad, loss: loss / data.length, sampleTraces };
}

export type SampleTrace = {
  inputs: number[];
  target: number;
  hiddenPre: number[];
  hidden: number[];
  outputPre: number;
  output: number;
  dOutputPre: number;
  dHidden: number[];
};

export type TrainingFrame = {
  step: number;
  net: TinyNetwork;
  loss: number;
  accuracy: number;
  gradients: TinyGradients;
  sampleTraces: SampleTrace[];
};

export function applyGradients(
  net: TinyNetwork,
  gradients: TinyGradients,
  lr: number,
  optimizer: OptimizerState,
): { net: TinyNetwork; optimizer: OptimizerState } {
  const next = cloneNetwork(net);

  const apply = (w: number, g: number, frozen: boolean) => {
    if (frozen) return w;
    return w - lr * g;
  };

  if (optimizer.id === "sgd") {
    next.w1 = next.w1.map((row, h) =>
      row.map((w, i) => apply(w, gradients.w1[h][i], false)),
    );
    next.b1 = next.b1.map((b, h) => apply(b, gradients.b1[h], net.frozenHidden ?? false));
    next.w2 = next.w2.map((w, h) => apply(w, gradients.w2[h], net.frozenHidden ?? false));
    next.b2 = apply(next.b2, gradients.b2, net.frozenOutput ?? false);
    return { net: next, optimizer };
  }

  if (optimizer.id === "momentum") {
    const vel = optimizer.velocity ?? zeroGradients(net);
    const beta = 0.9;
    const nextVel: TinyGradients = {
      w1: vel.w1.map((row, h) =>
        row.map((v, i) => beta * v + gradients.w1[h][i]),
      ),
      b1: vel.b1.map((v, h) => beta * v + gradients.b1[h]),
      w2: vel.w2.map((v, h) => beta * v + gradients.w2[h]),
      b2: beta * vel.b2 + gradients.b2,
    };
    next.w1 = next.w1.map((row, h) =>
      row.map((w, i) => w - lr * nextVel.w1[h][i]),
    );
    next.b1 = next.b1.map((b, h) =>
      net.frozenHidden ? b : b - lr * nextVel.b1[h],
    );
    next.w2 = next.w2.map((w, h) =>
      net.frozenHidden ? w : w - lr * nextVel.w2[h],
    );
    next.b2 = net.frozenOutput ? next.b2 : next.b2 - lr * nextVel.b2;
    return { net: next, optimizer: { ...optimizer, velocity: nextVel } };
  }

  const m = optimizer.m ?? zeroGradients(net);
  const v = optimizer.v ?? zeroGradients(net);
  const t = (optimizer.t ?? 0) + 1;
  const beta1 = 0.9;
  const beta2 = 0.999;
  const eps = 1e-8;

  const adamStep = (param: number, grad: number, mVal: number, vVal: number) => {
    const mNext = beta1 * mVal + (1 - beta1) * grad;
    const vNext = beta2 * vVal + (1 - beta2) * grad * grad;
    const mHat = mNext / (1 - beta1 ** t);
    const vHat = vNext / (1 - beta2 ** t);
    return { param: param - (lr * mHat) / (Math.sqrt(vHat) + eps), mNext, vNext };
  };

  const nextM = zeroGradients(net);
  const nextV = zeroGradients(net);

  next.w1 = next.w1.map((row, h) =>
    row.map((w, i) => {
      const r = adamStep(w, gradients.w1[h][i], m.w1[h][i], v.w1[h][i]);
      nextM.w1[h][i] = r.mNext;
      nextV.w1[h][i] = r.vNext;
      return r.param;
    }),
  );
  next.b1 = next.b1.map((b, h) => {
    if (net.frozenHidden) return b;
    const r = adamStep(b, gradients.b1[h], m.b1[h], v.b1[h]);
    nextM.b1[h] = r.mNext;
    nextV.b1[h] = r.vNext;
    return r.param;
  });
  next.w2 = next.w2.map((w, h) => {
    if (net.frozenHidden) return w;
    const r = adamStep(w, gradients.w2[h], m.w2[h], v.w2[h]);
    nextM.w2[h] = r.mNext;
    nextV.w2[h] = r.vNext;
    return r.param;
  });
  if (!net.frozenOutput) {
    const r = adamStep(next.b2, gradients.b2, m.b2, v.b2);
    nextM.b2 = r.mNext;
    nextV.b2 = r.vNext;
    next.b2 = r.param;
  }

  return {
    net: next,
    optimizer: { id: "adam", m: nextM, v: nextV, t },
  };
}

export function trainTinyStep(
  net: TinyNetwork,
  lr: number,
  data: readonly DataPoint[] = XOR_DATA,
  optimizer: OptimizerState = { id: "sgd" },
): { net: TinyNetwork; loss: number; gradients: TinyGradients; optimizer: OptimizerState; sampleTraces: SampleTrace[] } {
  const { gradients, loss, sampleTraces } = computeGradients(net, data);
  const applied = applyGradients(net, gradients, lr, optimizer);
  return { ...applied, loss, gradients, sampleTraces };
}

export function accuracy(net: TinyNetwork, data: readonly DataPoint[] = XOR_DATA): number {
  const preds = forwardAllTiny(net, data);
  return preds.filter((p) => (p.output >= 0.5 ? 1 : 0) === p.target).length / preds.length;
}

export function recordTrainingFrame(
  step: number,
  net: TinyNetwork,
  data: readonly DataPoint[] = XOR_DATA,
): TrainingFrame {
  const { gradients, loss, sampleTraces } = computeGradients(net, data);
  return {
    step,
    net: cloneNetwork(net),
    loss,
    accuracy: accuracy(net, data),
    gradients,
    sampleTraces,
  };
}

/** Sample loss landscape over two output weights (for visualization). */
export function sampleLossLandscape(
  net: TinyNetwork,
  w2a: number,
  w2b: number,
  grid = 24,
  range = 2,
): number[][] {
  const surface: number[][] = [];
  for (let i = 0; i <= grid; i++) {
    const row: number[] = [];
    for (let j = 0; j <= grid; j++) {
      const trial = cloneNetwork(net);
      if (trial.w2.length >= 2) {
        trial.w2[0] = w2a + ((i / grid) * 2 - 1) * range;
        trial.w2[1] = w2b + ((j / grid) * 2 - 1) * range;
      }
      row.push(computeGradients(trial).loss);
    }
    surface.push(row);
  }
  return surface;
}
