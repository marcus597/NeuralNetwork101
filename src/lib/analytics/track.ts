export type AnalyticsEvent = {
  name: string;
  lessonSlug?: string;
  properties?: Record<string, string | number | boolean>;
  ts: number;
  sessionId: string;
};

const QUEUE: AnalyticsEvent[] = [];
const MAX_QUEUE = 50;

function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem("wonder-session-id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("wonder-session-id", id);
  }
  return id;
}

export function track(
  name: string,
  properties?: Record<string, string | number | boolean>,
  lessonSlug?: string,
): void {
  if (typeof window === "undefined") return;

  const event: AnalyticsEvent = {
    name,
    lessonSlug,
    properties,
    ts: Date.now(),
    sessionId: getSessionId(),
  };

  QUEUE.push(event);
  if (QUEUE.length >= MAX_QUEUE) flush();
}

export async function flush(): Promise<void> {
  if (typeof window === "undefined" || QUEUE.length === 0) return;
  const batch = QUEUE.splice(0, QUEUE.length);

  try {
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events: batch }),
      keepalive: true,
    });
  } catch {
    // Fail silently — never block UX
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") void flush();
  });
}
