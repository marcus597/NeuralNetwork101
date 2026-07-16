import { z } from "zod";

export const simSnapshotSchema = z.object({
  presetId: z.string(),
  params: z.record(z.string(), z.union([z.number(), z.boolean(), z.string()])),
  metrics: z.record(z.string(), z.number()),
  flags: z.record(z.string(), z.boolean()),
});

export type SimSnapshotDto = z.infer<typeof simSnapshotSchema>;
