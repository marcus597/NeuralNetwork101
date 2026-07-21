import { z } from "zod";

export const bookmarkCreateRequestSchema = z.object({
  type: z.literal("lesson"),
  lessonSlug: z.string().min(1).max(64),
});

export const bookmarkRecordSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  type: z.literal("lesson"),
  lessonSlug: z.string(),
  createdAt: z.string().datetime(),
});

export const bookmarkListResponseSchema = z.object({
  items: z.array(bookmarkRecordSchema),
  total: z.number().int(),
});

export type BookmarkRecord = z.infer<typeof bookmarkRecordSchema>;
export type BookmarkCreateRequest = z.infer<typeof bookmarkCreateRequestSchema>;
export type BookmarkListResponse = z.infer<typeof bookmarkListResponseSchema>;
