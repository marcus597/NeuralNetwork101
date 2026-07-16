type LogLevel = "debug" | "info" | "warn" | "error";

type LogPayload = Record<string, unknown>;

function format(level: LogLevel, message: string, payload?: LogPayload): string {
  const entry = {
    level,
    message,
    ts: new Date().toISOString(),
    ...payload,
  };
  return JSON.stringify(entry);
}

/** Server-side structured logging. Client code should use analytics, not this. */
export const logger = {
  debug(message: string, payload?: LogPayload) {
    if (process.env.NODE_ENV === "production") return;
    console.debug(format("debug", message, payload));
  },
  info(message: string, payload?: LogPayload) {
    console.info(format("info", message, payload));
  },
  warn(message: string, payload?: LogPayload) {
    console.warn(format("warn", message, payload));
  },
  error(message: string, payload?: LogPayload) {
    console.error(format("error", message, payload));
  },
};
