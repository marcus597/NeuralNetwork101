import type { StorageAdapter } from "./types";
import { getMemoryStorage } from "./memory";

/**
 * Returns the active storage adapter.
 * v2: swap to Redis/Firestore based on env.
 */
export function getStorage(): StorageAdapter {
  // When WONDER_REDIS_URL is set, a Redis adapter can be plugged in here.
  return getMemoryStorage();
}
