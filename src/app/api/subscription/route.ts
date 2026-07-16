import { NextResponse } from "next/server";
import { API_VERSION, API_VERSION_HEADER } from "@/lib/api/constants";
import { getSubscription } from "@/lib/api/handlers/features";
import { subscriptionResponseSchema } from "@/lib/api/schemas/subscription";

/** Current subscription — Wonder launch is free for all users. */
export async function GET() {
  const data = getSubscription();
  return NextResponse.json(subscriptionResponseSchema.parse(data), {
    headers: { [API_VERSION_HEADER]: API_VERSION },
  });
}
