import { z } from "zod";
import { MAX_PLAYGROUND_POINTS } from "@/lib/api/constants";

const playgroundPointSchema = z.object({
  id: z.string(),
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  label: z.number().int().min(0).max(9).optional(),
  split: z.enum(["train", "test", "hidden", "val"]).optional(),
});

export const playgroundAlgorithmSchema = z.object({
  id: z.enum([
    "knn",
    "linear-regression",
    "logistic-regression",
    "decision-tree",
    "random-forest",
    "svm",
    "kmeans",
    "naive-bayes",
  ]),
  hyperparameters: z.record(
    z.string(),
    z.union([z.number(), z.boolean(), z.string()]),
  ),
  enabled: z.boolean().default(true),
});

export const playgroundPayloadSchema = z.object({
  name: z.string().min(1).max(120).default("Untitled experiment"),
  points: z.array(playgroundPointSchema).max(MAX_PLAYGROUND_POINTS),
  algorithms: z.array(playgroundAlgorithmSchema).min(1).max(8),
  splitRatio: z.number().min(0.1).max(0.9).default(0.8),
  seed: z.number().int().optional(),
  taskType: z.enum(["classification", "regression", "clustering"]).default(
    "classification",
  ),
});

export const playgroundCreateRequestSchema = playgroundPayloadSchema;

export const playgroundRecordSchema = playgroundPayloadSchema.extend({
  id: z.string(),
  ownerId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const playgroundSummarySchema = playgroundRecordSchema.pick({
  id: true,
  name: true,
  taskType: true,
  createdAt: true,
  updatedAt: true,
});

export const playgroundListResponseSchema = z.object({
  items: z.array(playgroundSummarySchema),
  total: z.number().int(),
});

export const playgroundShareResponseSchema = z.object({
  shareToken: z.string(),
  shareUrl: z.string().url(),
  expiresAt: z.string().datetime(),
});

export type PlaygroundPayload = z.infer<typeof playgroundPayloadSchema>;
export type PlaygroundRecord = z.infer<typeof playgroundRecordSchema>;
export type PlaygroundCreateRequest = z.infer<typeof playgroundCreateRequestSchema>;
export type PlaygroundListResponse = z.infer<typeof playgroundListResponseSchema>;
export type PlaygroundShareResponse = z.infer<typeof playgroundShareResponseSchema>;
