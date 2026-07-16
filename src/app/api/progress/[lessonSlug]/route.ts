import { apiHandler } from "@/lib/api/handler";
import { patchLessonProgress } from "@/lib/api/handlers/progress";
import { lessonSlugParamSchema } from "@/lib/api/schemas/common";
import {
  progressPatchRequestSchema,
  progressResponseSchema,
} from "@/lib/api/schemas/progress";

export const PATCH = apiHandler({
  schema: progressPatchRequestSchema,
  responseSchema: progressResponseSchema,
  handler: async (ctx, body, routeContext) => {
    const params = await routeContext.params;
    const { lessonSlug } = lessonSlugParamSchema.parse(params);
    return patchLessonProgress(ctx, lessonSlug, body);
  },
});
