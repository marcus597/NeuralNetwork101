import { z } from "zod";

export const analyticsEventNameSchema = z.enum([
  "lesson_started",
  "phase_completed",
  "mastery_achieved",
  "quiz_step_passed",
  "quiz_step_failed",
  "trap_triggered",
  "experiment_entered",
  "interaction_manipulated",
  "path_node_clicked",
  "api_error",
]);

export const analyticsEventSchema = z.object({
  name: analyticsEventNameSchema.or(z.string().min(1).max(64)),
  lessonSlug: z.string().max(64).optional(),
  properties: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
    .optional(),
  ts: z.number().int().positive(),
  sessionId: z.string().min(1).max(128),
});

export const eventsBatchRequestSchema = z.object({
  events: z.array(analyticsEventSchema).min(1).max(50),
});

export const eventsBatchResponseSchema = z.object({
  accepted: z.number().int(),
});

export type AnalyticsEventDto = z.infer<typeof analyticsEventSchema>;
export type EventsBatchRequest = z.infer<typeof eventsBatchRequestSchema>;
export type EventsBatchResponse = z.infer<typeof eventsBatchResponseSchema>;
