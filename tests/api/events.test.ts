import { describe, expect, it } from "vitest";
import { ingestEvents } from "@/lib/api/handlers/events";
import { ApiError } from "@/lib/api/errors";

describe("analytics ingestion", () => {
  it("accepts valid event batch", () => {
    const result = ingestEvents({
      events: [
        {
          name: "lesson_started",
          lessonSlug: "classification",
          ts: Date.now(),
          sessionId: "test-session",
        },
      ],
    });
    expect(result.accepted).toBe(1);
  });

  it("strips PII from properties", () => {
    const result = ingestEvents({
      events: [
        {
          name: "api_error",
          ts: Date.now(),
          sessionId: "test-session-pii",
          properties: { email: "secret@example.com", code: 400 },
        },
      ],
    });
    expect(result.accepted).toBe(1);
  });

  it("rate limits excessive batches", () => {
    const sessionId = `rate-limit-${Date.now()}`;
    for (let i = 0; i < 120; i++) {
      ingestEvents({
        events: [{ name: "interaction_manipulated", ts: Date.now(), sessionId }],
      });
    }
    expect(() =>
      ingestEvents({
        events: [{ name: "interaction_manipulated", ts: Date.now(), sessionId }],
      }),
    ).toThrow(ApiError);
  });
});
