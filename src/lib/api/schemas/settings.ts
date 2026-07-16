import { z } from "zod";

export const userSettingsSchema = z.object({
  reducedMotion: z.boolean().default(false),
  mobileBannerDismissed: z.boolean().default(false),
  theme: z.enum(["dark"]).default("dark"),
  notifications: z
    .object({
      lessonReminders: z.boolean().default(false),
      productUpdates: z.boolean().default(false),
    })
    .default({ lessonReminders: false, productUpdates: false }),
});

export const settingsPatchRequestSchema = userSettingsSchema.partial().refine(
  (v) => Object.keys(v).length > 0,
  { message: "At least one field required" },
);

export const settingsResponseSchema = z.object({
  ownerId: z.string(),
  settings: userSettingsSchema,
  updatedAt: z.string().datetime(),
});

export type UserSettings = z.infer<typeof userSettingsSchema>;
export type SettingsPatchRequest = z.infer<typeof settingsPatchRequestSchema>;
export type SettingsResponse = z.infer<typeof settingsResponseSchema>;
