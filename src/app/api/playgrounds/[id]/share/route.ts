import { apiHandler } from "@/lib/api/handler";
import { sharePlayground } from "@/lib/api/handlers/playgrounds";
import { idParamSchema } from "@/lib/api/schemas/common";
import { playgroundShareResponseSchema } from "@/lib/api/schemas/playground";

export const POST = apiHandler({
  handler: async (ctx, _body, routeContext) => {
    const params = await routeContext.params;
    const { id } = idParamSchema.parse(params);
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");
    return sharePlayground(ctx, id, baseUrl);
  },
  responseSchema: playgroundShareResponseSchema,
});
