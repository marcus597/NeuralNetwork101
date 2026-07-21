import { describe, expect, it } from "vitest";
import { validateQuizAnswer } from "@/lib/api/handlers/quiz";
import { ApiError } from "@/lib/api/errors";

describe("quiz validation", () => {
  it("throws for unknown lesson", () => {
    expect(() =>
      validateQuizAnswer({
        lessonSlug: "nonexistent-lesson",
        stepIndex: 0,
        answer: { type: "predict", value: true },
      }),
    ).toThrow(ApiError);
  });

  it("throws when game has no quiz steps", () => {
    expect(() =>
      validateQuizAnswer({
        lessonSlug: "what-is-a-neuron",
        stepIndex: 0,
        answer: { type: "predict", value: true },
      }),
    ).toThrow(ApiError);
  });
});
