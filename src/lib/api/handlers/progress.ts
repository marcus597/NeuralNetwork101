import { getOwnerId, type ApiContext } from "@/lib/api/middleware";
import { getStorage } from "@/lib/api/storage";
import type {
  ProgressPatchRequest,
  ProgressPutRequest,
  ProgressResponse,
  ProgressStateDto,
} from "@/lib/api/schemas/progress";

const DEFAULT_PROGRESS: ProgressStateDto = {
  schemaVersion: 1,
  lessons: {},
  path: { lastSlug: null },
  flags: { mobileBannerDismissed: false },
};

export async function getProgress(ctx: ApiContext): Promise<ProgressResponse> {
  const ownerId = getOwnerId(ctx);
  const storage = getStorage();
  const stored = await storage.getProgress(ownerId);

  return {
    ownerId,
    isAuthenticated: ctx.isAuthenticated,
    progress: stored?.progress ?? DEFAULT_PROGRESS,
    updatedAt: stored?.updatedAt ?? new Date().toISOString(),
  };
}

export async function putProgress(
  ctx: ApiContext,
  body: ProgressPutRequest,
): Promise<ProgressResponse> {
  const ownerId = getOwnerId(ctx);
  const storage = getStorage();
  const stored = await storage.putProgress(ownerId, body);

  return {
    ownerId,
    isAuthenticated: ctx.isAuthenticated,
    progress: stored.progress,
    updatedAt: stored.updatedAt,
  };
}

export async function patchLessonProgress(
  ctx: ApiContext,
  lessonSlug: string,
  body: ProgressPatchRequest,
): Promise<ProgressResponse> {
  const ownerId = getOwnerId(ctx);
  const storage = getStorage();
  const patch = {
    ...body,
    ...(body.visited ? { lastVisitedAt: new Date().toISOString() } : {}),
  };
  const stored = await storage.patchLessonProgress(ownerId, lessonSlug, patch);

  return {
    ownerId,
    isAuthenticated: ctx.isAuthenticated,
    progress: stored.progress,
    updatedAt: stored.updatedAt,
  };
}
