import { apiHandler } from "@/lib/api/handler";
import { mergeAnonymousSession } from "@/lib/api/handlers/auth";
import {
  authMergeRequestSchema,
  authMergeResponseSchema,
} from "@/lib/api/schemas/auth";

export const POST = apiHandler({
  schema: authMergeRequestSchema,
  responseSchema: authMergeResponseSchema,
  handler: async (ctx, body) => mergeAnonymousSession(ctx, body),
});
