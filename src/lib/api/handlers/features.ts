import {
  FEATURE_FLAGS,
  type FeaturesResponse,
  type SubscriptionResponse,
} from "@/lib/api/schemas/subscription";
import type { ApiContext } from "@/lib/api/middleware";

export async function getFeatures(ctx: ApiContext): Promise<FeaturesResponse> {
  void ctx;
  return {
    tier: "free",
    features: FEATURE_FLAGS,
  };
}

/** Launch: Wonder is free — all users on the free tier. */
export function getSubscription(): SubscriptionResponse {
  return {
    tier: "free",
    status: "active",
    expiresAt: null,
  };
}
