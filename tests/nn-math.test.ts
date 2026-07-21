import { describe, expect, it } from "vitest";
import {
  sigmoid,
  relu,
  forwardTiny,
  createTinyNetwork,
  trainTinyStep,
  XOR_DATA,
} from "@/lib/nn/math";

describe("nn math", () => {
  it("sigmoid maps to (0,1)", () => {
    expect(sigmoid(0)).toBeCloseTo(0.5);
    expect(sigmoid(10)).toBeGreaterThan(0.99);
  });

  it("relu zeroes negatives", () => {
    expect(relu(-1)).toBe(0);
    expect(relu(2)).toBe(2);
  });

  it("forward pass produces output", () => {
    const net = createTinyNetwork();
    const out = forwardTiny(net, [1, 0]);
    expect(out.output).toBeGreaterThanOrEqual(0);
    expect(out.output).toBeLessThanOrEqual(1);
  });

  it("training reduces XOR loss over steps", () => {
    let net = createTinyNetwork();
    const { loss: initialLoss } = trainTinyStep(net, 0);
    let loss = initialLoss;
    for (let i = 0; i < 200; i++) {
      const r = trainTinyStep(net, 0.8);
      net = r.net;
      loss = r.loss;
    }
    expect(loss).toBeLessThan(initialLoss);
    expect(XOR_DATA.length).toBe(4);
  });
});
