import { apiDeleteHandler, apiGetHandler } from "@/lib/api/handler";
import {
  deletePlayground,
  getPlaygroundById,
} from "@/lib/api/handlers/playgrounds";
import { idParamSchema } from "@/lib/api/schemas/common";
import { playgroundRecordSchema } from "@/lib/api/schemas/playground";

export const GET = apiGetHandler(async (ctx, routeContext) => {
  const params = await routeContext.params;
  const { id } = idParamSchema.parse(params);
  return getPlaygroundById(ctx, id);
}, playgroundRecordSchema);

export const DELETE = apiDeleteHandler(async (ctx, routeContext) => {
  const params = await routeContext.params;
  const { id } = idParamSchema.parse(params);
  return deletePlayground(ctx, id);
});
