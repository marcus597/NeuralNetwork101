import { EVENTS_RATE_LIMIT_PER_MINUTE } from "@/lib/api/constants";
import { rateLimited } from "@/lib/api/errors";
import { logger } from "@/lib/logger";
import type {
  AnalyticsEventDto,
  EventsBatchRequest,
  EventsBatchResponse,
} from "@/lib/api/schemas/events";

const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(sessionId: string): void {
  const now = Date.now();
  const bucket = rateBuckets.get(sessionId);
  if (!bucket || now > bucket.resetAt) {
    rateBuckets.set(sessionId, { count: 1, resetAt: now + 60_000 });
    return;
  }
  bucket.count++;
  if (bucket.count > EVENTS_RATE_LIMIT_PER_MINUTE) {
    throw rateLimited();
  }
}

const BLOCKED_PROPERTY_KEYS = new Set([
  "email",
  "name",
  "phone",
  "ip",
  "userAgent",
  "password",
]);

function sanitizeEvent(event: AnalyticsEventDto): AnalyticsEventDto {
  const properties = event.properties
    ? Object.fromEntries(
        Object.entries(event.properties).filter(
          ([k]) => !BLOCKED_PROPERTY_KEYS.has(k.toLowerCase()),
        ),
      )
    : undefined;

  return { ...event, properties };
}

export function ingestEvents(
  body: EventsBatchRequest,
): EventsBatchResponse {
  const sessionId = body.events[0]?.sessionId ?? "unknown";
  checkRateLimit(sessionId);

  const sanitized = body.events.map(sanitizeEvent);

  if (process.env.NODE_ENV === "development") {
    logger.debug("analytics batch ingested", { count: sanitized.length, sessionId });
  }

  // v2: forward to PostHog / warehouse
  return { accepted: sanitized.length };
}
