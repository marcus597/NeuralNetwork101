import { apiGetHandler, apiHandler, apiDeleteHandler } from "@/lib/api/handler";
import {
  createAuthSession,
  deleteAuthSession,
  getAuthMe,
} from "@/lib/api/handlers/auth";
import { authMeResponseSchema, authUserSchema, firebaseSessionRequestSchema } from "@/lib/api/schemas/auth";
import { z } from "zod";

export const GET = apiGetHandler(getAuthMe, authMeResponseSchema);

const sessionResponseSchema = z.object({
  user: authUserSchema,
  token: z.string(),
});

export const POST = apiHandler({
  schema: firebaseSessionRequestSchema,
  handler: async (_ctx, body) => createAuthSession(body),
  responseSchema: sessionResponseSchema,
});

export const DELETE = apiDeleteHandler(async () => deleteAuthSession());
