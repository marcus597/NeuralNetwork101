import { apiGetHandler, apiHandler } from "@/lib/api/handler";
import {
  createBookmark,
  listBookmarks,
} from "@/lib/api/handlers/bookmarks";
import {
  bookmarkCreateRequestSchema,
  bookmarkListResponseSchema,
  bookmarkRecordSchema,
} from "@/lib/api/schemas/bookmark";

export const GET = apiGetHandler(listBookmarks, bookmarkListResponseSchema);

export const POST = apiHandler({
  schema: bookmarkCreateRequestSchema,
  responseSchema: bookmarkRecordSchema,
  status: 201,
  handler: async (ctx, body) => createBookmark(ctx, body),
});
