import type { BookmarkRecord } from "@/lib/api/schemas/bookmark";
import type { PlaygroundRecord } from "@/lib/api/schemas/playground";
import type { ProgressStateDto } from "@/lib/api/schemas/progress";
import type { UserSettings } from "@/lib/api/schemas/settings";

export type StoredProgress = {
  progress: ProgressStateDto;
  updatedAt: string;
};

export type ShareRecord = {
  playgroundId: string;
  ownerId: string;
  expiresAt: string;
};

export interface StorageAdapter {
  // Progress
  getProgress(ownerId: string): Promise<StoredProgress | null>;
  putProgress(ownerId: string, progress: ProgressStateDto): Promise<StoredProgress>;
  patchLessonProgress(
    ownerId: string,
    lessonSlug: string,
    patch: Partial<ProgressStateDto["lessons"][string]>,
  ): Promise<StoredProgress>;

  // Playgrounds
  listPlaygrounds(ownerId: string): Promise<PlaygroundRecord[]>;
  getPlayground(ownerId: string, id: string): Promise<PlaygroundRecord | null>;
  createPlayground(
    ownerId: string,
    data: Omit<PlaygroundRecord, "id" | "ownerId" | "createdAt" | "updatedAt">,
  ): Promise<PlaygroundRecord>;
  deletePlayground(ownerId: string, id: string): Promise<boolean>;

  // Share tokens
  createShareToken(
    playgroundId: string,
    ownerId: string,
    expiresAt: string,
  ): Promise<string>;
  getShareRecord(token: string): Promise<ShareRecord | null>;
  getPlaygroundByShareToken(token: string): Promise<PlaygroundRecord | null>;

  // Bookmarks
  listBookmarks(ownerId: string): Promise<BookmarkRecord[]>;
  createBookmark(
    ownerId: string,
    data: Omit<BookmarkRecord, "id" | "ownerId" | "createdAt">,
  ): Promise<BookmarkRecord>;
  deleteBookmark(ownerId: string, id: string): Promise<boolean>;

  // Settings
  getSettings(ownerId: string): Promise<{ settings: UserSettings; updatedAt: string }>;
  patchSettings(
    ownerId: string,
    patch: Partial<UserSettings>,
  ): Promise<{ settings: UserSettings; updatedAt: string }>;

  // Merge anonymous → authenticated
  mergeOwnerData(fromOwnerId: string, toOwnerId: string): Promise<{
    lessonsMerged: number;
    playgroundsMerged: number;
    bookmarksMerged: number;
  }>;
}
