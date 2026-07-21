import { describe, expect, it } from "vitest";
import { cn } from "@/lib/cn";
import { evaluateMastery } from "@/lib/progress/mastery";
import { lessonContentSchema } from "@/lib/content/schema";
import fs from "fs";
import path from "path";

describe("cn", () => {
  it("merges tailwind classes", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-ink", false && "hidden", "font-bold")).toBe("text-ink font-bold");
  });
});

describe("evaluateMastery", () => {
  const snap = {
    presetId: "test",
    params: {},
    metrics: { loss: 0.01, hiddenAccuracy: 0.8 },
    flags: { revealed: true, fired: true },
  };

  it("evaluates threshold lte", () => {
    expect(
      evaluateMastery(
        { type: "threshold", metric: "loss", op: "lte", value: 0.05 },
        snap,
      ),
    ).toBe(true);
  });

  it("evaluates flag", () => {
    expect(
      evaluateMastery({ type: "flag", flag: "fired" }, snap),
    ).toBe(true);
  });

  it("requires reveal when configured", () => {
    expect(
      evaluateMastery(
        {
          type: "threshold",
          metric: "hiddenAccuracy",
          op: "gte",
          value: 0.75,
          requiresReveal: true,
        },
        { ...snap, flags: { revealed: false } },
      ),
    ).toBe(false);
  });
});

describe("lessonContentSchema", () => {
  it("parses generated neuron game", () => {
    const raw = fs.readFileSync(
      path.join(process.cwd(), "content/lessons/what-is-a-neuron.json"),
      "utf-8",
    );
    const lesson = lessonContentSchema.parse(JSON.parse(raw));
    expect(lesson.slug).toBe("what-is-a-neuron");
    expect(lesson.presetId).toBe("game-neuron");
    expect(lesson.title).toMatch(/neuron/i);
  });
});
