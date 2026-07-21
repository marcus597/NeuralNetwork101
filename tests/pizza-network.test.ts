import { describe, expect, it } from "vitest";
import {
  defaultPlate,
  thinkAboutPizza,
} from "@/lib/nn/pizza-brain";

describe("pizza brain", () => {
  it("calls classic pizza pizza", () => {
    const v = thinkAboutPizza(defaultPlate());
    expect(v.isPizza).toBe(true);
    expect(v.label).toBe("Pizza!");
  });

  it("rejects dessert plate", () => {
    const v = thinkAboutPizza({
      tomato: 0,
      dough: 1,
      cheese: 0,
      pepperoni: 0,
      chocolate: 1,
      icecream: 1,
      banana: 0,
      candy: 0,
      fish: 0,
      pickles: 0,
    });
    expect(v.isPizza).toBe(false);
    expect(v.detectors.find((d) => d.id === "weird")?.active).toBe(true);
  });

  it("rejects sneaky pizza with hidden weird toppings", () => {
    const v = thinkAboutPizza({
      tomato: 1,
      dough: 1,
      cheese: 1,
      pepperoni: 1,
      chocolate: 0,
      icecream: 0.5,
      banana: 0.5,
      candy: 0,
      fish: 0,
      pickles: 0,
    });
    expect(v.isPizza).toBe(false);
  });

  it("gives each detector a plain-language thought", () => {
    const v = thinkAboutPizza(defaultPlate());
    for (const d of v.detectors) {
      expect(d.thought.length).toBeGreaterThan(3);
      expect(d.thought).not.toMatch(/\d\.\d/);
    }
  });
});
