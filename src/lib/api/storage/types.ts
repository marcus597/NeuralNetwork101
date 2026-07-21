import type { BookmarkRecord } from "@/lib/api/schemas/bookmark";
import type { ProgressStateDto } from "@/lib/api/schemas/progress";
import type { UserSettings } from "@/lib/api/schemas/settings";

export type StoredProgress = {
  progress: ProgressStateDto;
  updatedAt: string;
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
