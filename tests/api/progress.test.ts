import { describe, expect, it, beforeEach, vi } from "vitest";
import { MemoryStorageAdapter } from "@/lib/api/storage/memory";
import type { ApiContext } from "@/lib/api/middleware";

let storage: MemoryStorageAdapter;

vi.mock("@/lib/api/storage", () => ({
  getStorage: () => storage,
}));

import {
  getProgress,
  putProgress,
  patchLessonProgress,
} from "@/lib/api/handlers/progress";
import { mergeAnonymousSession } from "@/lib/api/handlers/auth";

function mockCtx(sessionId: string, userId: string | null = null): ApiContext {
  return {
    sessionId,
    userId,
    isAuthenticated: userId !== null,
    user: userId
      ? { uid: userId, isAnonymous: false, email: "test@example.com" }
      : null,
  };
}

describe("progress API handlers", () => {
  beforeEach(() => {
    storage = new MemoryStorageAdapter();
  });

  it("returns default progress for new anonymous user", async () => {
    const ctx = mockCtx("550e8400-e29b-41d4-a716-446655440000");
    const result = await getProgress(ctx);
    expect(result.isAuthenticated).toBe(false);
    expect(result.progress.lessons).toEqual({});
  });

  it("put and get progress", async () => {
    const ctx = mockCtx("550e8400-e29b-41d4-a716-446655440000");
    await putProgress(ctx, {
      schemaVersion: 1,
      lessons: {
        "what-is-a-neuron": {
          visited: true,
          mastered: true,
          quizPassed: false,
          lastVisitedAt: new Date().toISOString(),
          masteryEvents: ["hidden-75"],
        },
      },
      path: { lastSlug: "what-is-a-neuron" },
      flags: { mobileBannerDismissed: false },
    });

    const result = await getProgress(ctx);
    expect(result.progress.lessons["what-is-a-neuron"]?.mastered).toBe(true);
  });

  it("patches single lesson progress", async () => {
    const ctx = mockCtx("550e8400-e29b-41d4-a716-446655440000");
    const result = await patchLessonProgress(ctx, "how-ai-learns", {
      visited: true,
      quizPassed: true,
    });
    expect(result.progress.lessons["how-ai-learns"]?.quizPassed).toBe(true);
    expect(result.progress.lessons["how-ai-learns"]?.lastVisitedAt).toBeTruthy();
  });
});

describe("anonymous merge", () => {
  beforeEach(() => {
    storage = new MemoryStorageAdapter();
  });

  it("merges anonymous progress into authenticated user", async () => {
    const anonCtx = mockCtx("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
    await patchLessonProgress(anonCtx, "what-is-a-neuron", {
      visited: true,
      mastered: true,
    });

    const authCtx = mockCtx("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", "user-123");
    const mergeResult = await mergeAnonymousSession(authCtx, {
      anonymousSessionId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    });

    expect(mergeResult.merged).toBe(true);
    expect(mergeResult.lessonsMerged).toBeGreaterThan(0);

    const progress = await getProgress(authCtx);
    expect(progress.progress.lessons["what-is-a-neuron"]?.mastered).toBe(true);
  });
});
