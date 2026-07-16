import { z } from "zod";

export const bookmarkTargetSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("lesson"), lessonSlug: z.string().min(1).max(64) }),
  z.object({ type: z.literal("playground"), playgroundId: z.string().min(1).max(128) }),
]);

export const bookmarkCreateRequestSchema = bookmarkTargetSchema;

export const bookmarkRecordSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  type: z.enum(["lesson", "playground"]),
  lessonSlug: z.string().optional(),
  playgroundId: z.string().optional(),
  createdAt: z.string().datetime(),
});

export const bookmarkListResponseSchema = z.object({
  items: z.array(bookmarkRecordSchema),
  total: z.number().int(),
});

export type BookmarkRecord = z.infer<typeof bookmarkRecordSchema>;
export type BookmarkCreateRequest = z.infer<typeof bookmarkCreateRequestSchema>;
export type BookmarkListResponse = z.infer<typeof bookmarkListResponseSchema>;
