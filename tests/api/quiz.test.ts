import { describe, expect, it } from "vitest";
import { validateQuizAnswer } from "@/lib/api/handlers/quiz";
import { ApiError } from "@/lib/api/errors";

describe("quiz validation", () => {
  it("validates open predict step (no accept field)", () => {
    const result = validateQuizAnswer({
      lessonSlug: "overfitting",
      stepIndex: 0,
      answer: { type: "predict", value: true },
    });
    expect(result.correct).toBe(true);
    expect(result.stepType).toBe("predict");
  });

  it("validates explain step", () => {
    const result = validateQuizAnswer({
      lessonSlug: "overfitting",
      stepIndex: 2,
      answer: { type: "explain", choiceId: "a" },
    });
    expect(result.correct).toBe(true);
    expect(result.stepType).toBe("explain");
  });

  it("returns wrong feedback for incorrect explain", () => {
    const result = validateQuizAnswer({
      lessonSlug: "overfitting",
      stepIndex: 2,
      answer: { type: "explain", choiceId: "b" },
    });
    expect(result.correct).toBe(false);
    expect(result.causalExplanation).toContain("Animations follow");
  });

  it("validates manipulate step against metrics", () => {
    const result = validateQuizAnswer({
      lessonSlug: "overfitting",
      stepIndex: 1,
      answer: {
        type: "manipulate",
        simSnapshot: {
          presetId: "overfit-dial",
          params: {},
          metrics: { separation: 0.5 },
          flags: {},
        },
      },
    });
    expect(result.correct).toBe(true);
  });

  it("throws for unknown lesson", () => {
    expect(() =>
      validateQuizAnswer({
        lessonSlug: "nonexistent-lesson",
        stepIndex: 0,
        answer: { type: "predict", value: true },
      }),
    ).toThrow(ApiError);
  });
});
