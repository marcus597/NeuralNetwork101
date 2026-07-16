import { apiHandler } from "@/lib/api/handler";
import { ingestEvents } from "@/lib/api/handlers/events";
import {
  eventsBatchRequestSchema,
  eventsBatchResponseSchema,
} from "@/lib/api/schemas/events";

export const POST = apiHandler({
  schema: eventsBatchRequestSchema,
  responseSchema: eventsBatchResponseSchema,
  handler: async (_ctx, body) => ingestEvents(body),
});
