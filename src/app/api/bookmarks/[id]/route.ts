import { apiDeleteHandler } from "@/lib/api/handler";
import { deleteBookmark } from "@/lib/api/handlers/bookmarks";
import { idParamSchema } from "@/lib/api/schemas/common";

export const DELETE = apiDeleteHandler(async (ctx, routeContext) => {
  const params = await routeContext.params;
  const { id } = idParamSchema.parse(params);
  return deleteBookmark(ctx, id);
});
