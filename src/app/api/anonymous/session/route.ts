import { apiHandler } from "@/lib/api/handler";
import { createAnonymousSession } from "@/lib/api/handlers/auth";
import { anonymousSessionResponseSchema } from "@/lib/api/schemas/auth";

export const POST = apiHandler({
  handler: async () => {
    const { sessionId } = await createAnonymousSession();
    return { sessionId };
  },
  responseSchema: anonymousSessionResponseSchema,
  status: 201,
});
