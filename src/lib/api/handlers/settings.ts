import { getOwnerId, type ApiContext } from "@/lib/api/middleware";
import { getStorage } from "@/lib/api/storage";
import type {
  SettingsPatchRequest,
  SettingsResponse,
} from "@/lib/api/schemas/settings";

export async function getSettings(ctx: ApiContext): Promise<SettingsResponse> {
  const ownerId = getOwnerId(ctx);
  const stored = await getStorage().getSettings(ownerId);
  return {
    ownerId,
    settings: stored.settings,
    updatedAt: stored.updatedAt,
  };
}

export async function patchSettings(
  ctx: ApiContext,
  body: SettingsPatchRequest,
): Promise<SettingsResponse> {
  const ownerId = getOwnerId(ctx);
  const stored = await getStorage().patchSettings(ownerId, body);
  return {
    ownerId,
    settings: stored.settings,
    updatedAt: stored.updatedAt,
  };
}
