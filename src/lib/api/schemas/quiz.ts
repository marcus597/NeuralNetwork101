import { z } from "zod";
import { simSnapshotSchema } from "./sim-snapshot";

export const quizAnswerSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("predict"),
    value: z.union([z.boolean(), z.number(), z.string()]),
  }),
  z.object({
    type: z.literal("manipulate"),
    simSnapshot: simSnapshotSchema,
  }),
  z.object({
    type: z.literal("explain"),
    choiceId: z.string().min(1).max(8),
  }),
]);

export const quizValidateRequestSchema = z.object({
  lessonSlug: z.string().min(1).max(64),
  stepIndex: z.number().int().min(0).max(10),
  answer: quizAnswerSchema,
  simSnapshot: simSnapshotSchema.optional(),
});

export const quizValidateResponseSchema = z.object({
  correct: z.boolean(),
  feedback: z.string(),
  causalExplanation: z.string().optional(),
  stepType: z.enum(["predict", "manipulate", "explain"]),
});

export type QuizValidateRequest = z.infer<typeof quizValidateRequestSchema>;
export type QuizValidateResponse = z.infer<typeof quizValidateResponseSchema>;
