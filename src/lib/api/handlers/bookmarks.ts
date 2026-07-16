import { notFound } from "@/lib/api/errors";
import { getOwnerId, type ApiContext } from "@/lib/api/middleware";
import { getStorage } from "@/lib/api/storage";
import type {
  BookmarkCreateRequest,
  BookmarkListResponse,
  BookmarkRecord,
} from "@/lib/api/schemas/bookmark";

export async function listBookmarks(
  ctx: ApiContext,
): Promise<BookmarkListResponse> {
  const ownerId = getOwnerId(ctx);
  const items = await getStorage().listBookmarks(ownerId);
  return { items, total: items.length };
}

export async function createBookmark(
  ctx: ApiContext,
  body: BookmarkCreateRequest,
): Promise<BookmarkRecord> {
  const ownerId = getOwnerId(ctx);
  if (body.type === "lesson") {
    return getStorage().createBookmark(ownerId, {
      type: "lesson",
      lessonSlug: body.lessonSlug,
    });
  }
  return getStorage().createBookmark(ownerId, {
    type: "playground",
    playgroundId: body.playgroundId,
  });
}

export async function deleteBookmark(
  ctx: ApiContext,
  id: string,
): Promise<{ ok: true }> {
  const ownerId = getOwnerId(ctx);
  const deleted = await getStorage().deleteBookmark(ownerId, id);
  if (!deleted) throw notFound("Bookmark not found");
  return { ok: true };
}
