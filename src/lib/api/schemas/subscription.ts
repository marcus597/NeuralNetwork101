import { z } from "zod";

export const subscriptionTierSchema = z.enum(["free", "pro"]);

export const subscriptionResponseSchema = z.object({
  tier: subscriptionTierSchema,
  status: z.enum(["active", "inactive", "trialing", "none"]),
  expiresAt: z.string().datetime().nullable(),
});

export const featureFlagSchema = z.object({
  id: z.string(),
  label: z.string(),
  free: z.boolean(),
  pro: z.boolean(),
});

export const featuresResponseSchema = z.object({
  tier: subscriptionTierSchema,
  features: z.array(featureFlagSchema),
});

export type SubscriptionResponse = z.infer<typeof subscriptionResponseSchema>;
export type FeaturesResponse = z.infer<typeof featuresResponseSchema>;
export type FeatureFlag = z.infer<typeof featureFlagSchema>;

export const FEATURE_FLAGS: FeatureFlag[] = [
  { id: "full_museum", label: "Full museum (20 exhibits)", free: true, pro: true },
  { id: "interactive_labs", label: "All interactive simulations", free: true, pro: true },
  { id: "training_scrubber", label: "Frame-by-frame training replay", free: true, pro: true },
  { id: "architecture_wing", label: "CNN, RNN, transformer exhibits", free: true, pro: true },
  { id: "cloud_sync", label: "Cloud progress sync", free: false, pro: true },
  { id: "export_notebook", label: "Export to notebook", free: false, pro: true },
  { id: "priority_support", label: "Priority support", free: false, pro: true },
];
