import { z } from "zod";

export const apiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
});

export const paginationQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
});

export const idParamSchema = z.object({
  id: z.string().min(1).max(128),
});

export const lessonSlugParamSchema = z.object({
  lessonSlug: z.string().min(1).max(64).regex(/^[a-z0-9-]+$/),
});

export type ApiErrorResponse = z.infer<typeof apiErrorSchema>;
