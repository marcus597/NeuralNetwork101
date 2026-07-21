import type { BookmarkRecord } from "@/lib/api/schemas/bookmark";
import type { ProgressStateDto } from "@/lib/api/schemas/progress";
import type { UserSettings } from "@/lib/api/schemas/settings";
import type { StorageAdapter, StoredProgress } from "./types";

const DEFAULT_PROGRESS: ProgressStateDto = {
  schemaVersion: 1,
  lessons: {},
  path: { lastSlug: null },
  flags: { mobileBannerDismissed: false },
};

const DEFAULT_SETTINGS: UserSettings = {
  reducedMotion: false,
  mobileBannerDismissed: false,
  theme: "dark",
  notifications: { lessonReminders: false, productUpdates: false },
};

function nowIso(): string {
  return new Date().toISOString();
}

export class MemoryStorageAdapter implements StorageAdapter {
  private progress = new Map<string, StoredProgress>();
  private bookmarks = new Map<string, BookmarkRecord>();
  private settings = new Map<string, { settings: UserSettings; updatedAt: string }>();

  async getProgress(ownerId: string): Promise<StoredProgress | null> {
    return this.progress.get(ownerId) ?? null;
  }

  async putProgress(
    ownerId: string,
    progress: ProgressStateDto,
  ): Promise<StoredProgress> {
    const stored: StoredProgress = { progress, updatedAt: nowIso() };
    this.progress.set(ownerId, stored);
    return stored;
  }

  async patchLessonProgress(
    ownerId: string,
    lessonSlug: string,
    patch: Partial<ProgressStateDto["lessons"][string]>,
  ): Promise<StoredProgress> {
    const current =
      this.progress.get(ownerId) ??
      ({ progress: structuredClone(DEFAULT_PROGRESS), updatedAt: nowIso() });

    const lesson = current.progress.lessons[lessonSlug] ?? {
      visited: false,
      mastered: false,
      quizPassed: false,
      lastVisitedAt: null,
      masteryEvents: [],
    };

    current.progress.lessons[lessonSlug] = {
      ...lesson,
      ...patch,
      masteryEvents: patch.masteryEvents ?? lesson.masteryEvents,
    };
    current.updatedAt = nowIso();
    this.progress.set(ownerId, current);
    return current;
  }

  async listBookmarks(ownerId: string): Promise<BookmarkRecord[]> {
    return [...this.bookmarks.values()].filter((b) => b.ownerId === ownerId);
  }

  async createBookmark(
    ownerId: string,
    data: Omit<BookmarkRecord, "id" | "ownerId" | "createdAt">,
  ): Promise<BookmarkRecord> {
    const record: BookmarkRecord = {
      ...data,
      id: crypto.randomUUID(),
      ownerId,
      createdAt: nowIso(),
    };
    this.bookmarks.set(record.id, record);
    return record;
  }

  async deleteBookmark(ownerId: string, id: string): Promise<boolean> {
    const b = this.bookmarks.get(id);
    if (!b || b.ownerId !== ownerId) return false;
    this.bookmarks.delete(id);
    return true;
  }

  async getSettings(
    ownerId: string,
  ): Promise<{ settings: UserSettings; updatedAt: string }> {
    return (
      this.settings.get(ownerId) ?? {
        settings: structuredClone(DEFAULT_SETTINGS),
        updatedAt: nowIso(),
      }
    );
  }

  async patchSettings(
    ownerId: string,
    patch: Partial<UserSettings>,
  ): Promise<{ settings: UserSettings; updatedAt: string }> {
    const current = await this.getSettings(ownerId);
    const settings: UserSettings = {
      ...current.settings,
      ...patch,
      notifications: {
        ...current.settings.notifications,
        ...(patch.notifications ?? {}),
      },
    };
    const stored = { settings, updatedAt: nowIso() };
    this.settings.set(ownerId, stored);
    return stored;
  }

  async mergeOwnerData(
    fromOwnerId: string,
    toOwnerId: string,
  ): Promise<{
    lessonsMerged: number;
    playgroundsMerged: number;
    bookmarksMerged: number;
  }> {
    if (fromOwnerId === toOwnerId) {
      return { lessonsMerged: 0, playgroundsMerged: 0, bookmarksMerged: 0 };
    }

    let lessonsMerged = 0;
    let bookmarksMerged = 0;

    const fromProgress = await this.getProgress(fromOwnerId);
    if (fromProgress) {
      const toStored =
        (await this.getProgress(toOwnerId)) ??
        ({ progress: structuredClone(DEFAULT_PROGRESS), updatedAt: nowIso() });

      for (const [slug, lesson] of Object.entries(fromProgress.progress.lessons)) {
        const existing = toStored.progress.lessons[slug];
        if (!existing || (!existing.mastered && lesson.mastered)) {
          toStored.progress.lessons[slug] = existing
            ? { ...existing, ...lesson, masteryEvents: [...new Set([...existing.masteryEvents, ...lesson.masteryEvents])] }
            : lesson;
          lessonsMerged++;
        }
      }
      toStored.progress.path.lastSlug ??= fromProgress.progress.path.lastSlug;
      toStored.progress.flags.mobileBannerDismissed ||=
        fromProgress.progress.flags.mobileBannerDismissed;
      toStored.updatedAt = nowIso();
      this.progress.set(toOwnerId, toStored);
    }

    for (const b of [...this.bookmarks.values()]) {
      if (b.ownerId === fromOwnerId) {
        this.bookmarks.set(b.id, { ...b, ownerId: toOwnerId });
        bookmarksMerged++;
      }
    }

    const fromSettings = this.settings.get(fromOwnerId);
    if (fromSettings) {
      const toSettings = await this.getSettings(toOwnerId);
      await this.patchSettings(toOwnerId, {
        reducedMotion:
          toSettings.settings.reducedMotion || fromSettings.settings.reducedMotion,
        mobileBannerDismissed:
          toSettings.settings.mobileBannerDismissed ||
          fromSettings.settings.mobileBannerDismissed,
      });
    }

    return { lessonsMerged, playgroundsMerged: 0, bookmarksMerged };
  }
}

/** Singleton for serverless — resets on cold start (v1 dev acceptable; use Redis v2) */
let globalMemory: MemoryStorageAdapter | null = null;

export function getMemoryStorage(): MemoryStorageAdapter {
  if (!globalMemory) globalMemory = new MemoryStorageAdapter();
  return globalMemory;
}
