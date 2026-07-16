import { SHARE_TOKEN_TTL_SECONDS } from "@/lib/api/constants";
import { forbidden, notFound } from "@/lib/api/errors";
import { getOwnerId, type ApiContext } from "@/lib/api/middleware";
import { getStorage } from "@/lib/api/storage";
import type {
  PlaygroundCreateRequest,
  PlaygroundListResponse,
  PlaygroundRecord,
  PlaygroundShareResponse,
} from "@/lib/api/schemas/playground";

export async function listPlaygrounds(
  ctx: ApiContext,
): Promise<PlaygroundListResponse> {
  const ownerId = getOwnerId(ctx);
  const items = await getStorage().listPlaygrounds(ownerId);
  return { items, total: items.length };
}

export async function getPlaygroundById(
  ctx: ApiContext,
  id: string,
): Promise<PlaygroundRecord> {
  const ownerId = getOwnerId(ctx);
  const record = await getStorage().getPlayground(ownerId, id);
  if (!record) throw notFound("Playground not found");
  return record;
}

export async function createPlayground(
  ctx: ApiContext,
  body: PlaygroundCreateRequest,
): Promise<PlaygroundRecord> {
  const ownerId = getOwnerId(ctx);
  return getStorage().createPlayground(ownerId, body);
}

export async function deletePlayground(
  ctx: ApiContext,
  id: string,
): Promise<{ ok: true }> {
  const ownerId = getOwnerId(ctx);
  const deleted = await getStorage().deletePlayground(ownerId, id);
  if (!deleted) throw notFound("Playground not found");
  return { ok: true };
}

export async function sharePlayground(
  ctx: ApiContext,
  id: string,
  baseUrl: string,
): Promise<PlaygroundShareResponse> {
  const ownerId = getOwnerId(ctx);
  const storage = getStorage();
  const record = await storage.getPlayground(ownerId, id);
  if (!record) throw notFound("Playground not found");

  const expiresAt = new Date(
    Date.now() + SHARE_TOKEN_TTL_SECONDS * 1000,
  ).toISOString();
  const shareToken = await storage.createShareToken(id, ownerId, expiresAt);

  return {
    shareToken,
    shareUrl: `${baseUrl}/playground?share=${shareToken}`,
    expiresAt,
  };
}

export async function getSharedPlayground(
  token: string,
): Promise<PlaygroundRecord> {
  const record = await getStorage().getPlaygroundByShareToken(token);
  if (!record) throw notFound("Share link expired or invalid");
  return record;
}

export function assertPlaygroundOwner(
  ctx: ApiContext,
  record: PlaygroundRecord,
): void {
  if (record.ownerId !== getOwnerId(ctx)) throw forbidden();
}
