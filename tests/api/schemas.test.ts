import { describe, expect, it } from "vitest";
import {
  quizValidateRequestSchema,
  progressPutRequestSchema,
  eventsBatchRequestSchema,
  bookmarkCreateRequestSchema,
} from "@/lib/api/schemas";

describe("API request schemas", () => {
  it("validates quiz predict request", () => {
    const result = quizValidateRequestSchema.safeParse({
      lessonSlug: "what-is-a-neuron",
      stepIndex: 0,
      answer: { type: "predict", value: false },
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid lesson slug in quiz", () => {
    const result = quizValidateRequestSchema.safeParse({
      lessonSlug: "",
      stepIndex: 0,
      answer: { type: "predict", value: true },
    });
    expect(result.success).toBe(false);
  });

  it("validates progress put", () => {
    const result = progressPutRequestSchema.safeParse({
      schemaVersion: 1,
      lessons: {},
      path: { lastSlug: null },
      flags: { mobileBannerDismissed: false },
    });
    expect(result.success).toBe(true);
  });

  it("validates analytics batch", () => {
    const result = eventsBatchRequestSchema.safeParse({
      events: [
        {
          name: "lesson_started",
          ts: Date.now(),
          sessionId: "550e8400-e29b-41d4-a716-446655440000",
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("validates bookmark create", () => {
    const lesson = bookmarkCreateRequestSchema.safeParse({
      type: "lesson",
      lessonSlug: "what-is-a-neuron",
    });
    expect(lesson.success).toBe(true);
  });
});
