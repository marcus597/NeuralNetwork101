import { apiGetHandler, apiHandler } from "@/lib/api/handler";
import { getProgress, putProgress } from "@/lib/api/handlers/progress";
import {
  progressPutRequestSchema,
  progressResponseSchema,
} from "@/lib/api/schemas/progress";

export const GET = apiGetHandler(getProgress, progressResponseSchema);

export const PUT = apiHandler({
  schema: progressPutRequestSchema,
  responseSchema: progressResponseSchema,
  handler: async (ctx, body) => putProgress(ctx, body),
});
