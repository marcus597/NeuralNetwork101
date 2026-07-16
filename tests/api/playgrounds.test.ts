import { describe, expect, it, beforeEach, vi } from "vitest";
import { MemoryStorageAdapter } from "@/lib/api/storage/memory";
import type { ApiContext } from "@/lib/api/middleware";

let storage: MemoryStorageAdapter;

vi.mock("@/lib/api/storage", () => ({
  getStorage: () => storage,
}));

import {
  createPlayground,
  sharePlayground,
  getSharedPlayground,
} from "@/lib/api/handlers/playgrounds";

function mockCtx(sessionId: string): ApiContext {
  return {
    sessionId,
    userId: null,
    isAuthenticated: false,
    user: null,
  };
}

const samplePayload = {
  name: "Test experiment",
  points: [{ id: "1", x: 0.3, y: 0.4, label: 0 }],
  algorithms: [{ id: "knn" as const, hyperparameters: { k: 3 }, enabled: true }],
  splitRatio: 0.8,
  taskType: "classification" as const,
};

describe("playground share flow", () => {
  beforeEach(() => {
    storage = new MemoryStorageAdapter();
  });

  it("creates, shares, and loads playground by token", async () => {
    const ctx = mockCtx("550e8400-e29b-41d4-a716-446655440000");
    const created = await createPlayground(ctx, samplePayload);
    expect(created.id).toBeTruthy();

    const share = await sharePlayground(
      ctx,
      created.id,
      "http://localhost:3000",
    );
    expect(share.shareToken).toBeTruthy();
    expect(share.shareUrl).toContain(share.shareToken);

    const loaded = await getSharedPlayground(share.shareToken);
    expect(loaded.id).toBe(created.id);
    expect(loaded.name).toBe("Test experiment");
  });
});
