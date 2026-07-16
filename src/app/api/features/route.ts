import { apiGetHandler } from "@/lib/api/handler";
import { getFeatures } from "@/lib/api/handlers/features";
import { featuresResponseSchema } from "@/lib/api/schemas/subscription";

export const GET = apiGetHandler(getFeatures, featuresResponseSchema);
