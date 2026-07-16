import { z } from "zod";

export const lessonProgressSchema = z.object({
  visited: z.boolean(),
  mastered: z.boolean(),
  quizPassed: z.boolean(),
  lastVisitedAt: z.string().datetime().nullable(),
  masteryEvents: z.array(z.string()).max(50),
});

export const progressStateSchema = z.object({
  schemaVersion: z.number().int().default(1),
  lessons: z.record(z.string(), lessonProgressSchema),
  path: z.object({
    lastSlug: z.string().nullable(),
  }),
  flags: z.object({
    mobileBannerDismissed: z.boolean(),
  }),
});

export const progressResponseSchema = z.object({
  ownerId: z.string(),
  isAuthenticated: z.boolean(),
  progress: progressStateSchema,
  updatedAt: z.string().datetime(),
});

export const progressPutRequestSchema = progressStateSchema;

export const progressPatchRequestSchema = z
  .object({
    visited: z.boolean().optional(),
    mastered: z.boolean().optional(),
    quizPassed: z.boolean().optional(),
    masteryEvents: z.array(z.string()).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, {
    message: "At least one field required",
  });

export type LessonProgressDto = z.infer<typeof lessonProgressSchema>;
export type ProgressStateDto = z.infer<typeof progressStateSchema>;
export type ProgressResponse = z.infer<typeof progressResponseSchema>;
export type ProgressPutRequest = z.infer<typeof progressPutRequestSchema>;
export type ProgressPatchRequest = z.infer<typeof progressPatchRequestSchema>;
