import { apiGetHandler } from "@/lib/api/handler";
import { getSharedPlayground } from "@/lib/api/handlers/playgrounds";
import { playgroundRecordSchema } from "@/lib/api/schemas/playground";
import { z } from "zod";

export const GET = apiGetHandler(async (_ctx, routeContext) => {
  const params = await routeContext.params;
  const { token } = z.object({ token: z.string().min(1) }).parse(params);
  return getSharedPlayground(token);
}, playgroundRecordSchema);
