import { apiGetHandler, apiHandler } from "@/lib/api/handler";
import {
  createPlayground,
  listPlaygrounds,
} from "@/lib/api/handlers/playgrounds";
import {
  playgroundCreateRequestSchema,
  playgroundListResponseSchema,
  playgroundRecordSchema,
} from "@/lib/api/schemas/playground";

export const GET = apiGetHandler(listPlaygrounds, playgroundListResponseSchema);

export const POST = apiHandler({
  schema: playgroundCreateRequestSchema,
  responseSchema: playgroundRecordSchema,
  status: 201,
  handler: async (ctx, body) => createPlayground(ctx, body),
});
