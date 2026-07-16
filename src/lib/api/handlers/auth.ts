import { cookies } from "next/headers";
import { AUTH_COOKIE, SESSION_COOKIE } from "@/lib/api/constants";
import { unauthorized } from "@/lib/api/errors";
import {
  createSessionToken,
  getOwnerId,
  resolveApiContext,
  verifyFirebaseIdToken,
  type ApiContext,
} from "@/lib/api/middleware";
import { getStorage } from "@/lib/api/storage";
import type {
  AuthMergeRequest,
  AuthMergeResponse,
  AuthMeResponse,
  AuthUser,
  FirebaseSessionRequest,
} from "@/lib/api/schemas/auth";

export async function getAuthMe(ctx: ApiContext): Promise<AuthMeResponse> {
  return {
    user: ctx.user,
    sessionId: ctx.sessionId,
    isAuthenticated: ctx.isAuthenticated,
  };
}

export async function createAuthSession(
  body: FirebaseSessionRequest,
): Promise<{ user: AuthUser; token: string }> {
  const user = await verifyFirebaseIdToken(body.idToken);
  if (!user) {
    throw unauthorized("Invalid Firebase ID token");
  }
  const token = await createSessionToken({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  });

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return { user, token };
}

export async function deleteAuthSession(): Promise<{ ok: true }> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
  return { ok: true };
}

export async function createAnonymousSession(): Promise<{
  sessionId: string;
}> {
  const sessionId = crypto.randomUUID();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return { sessionId };
}

export async function mergeAnonymousSession(
  ctx: ApiContext,
  body: AuthMergeRequest,
): Promise<AuthMergeResponse> {
  if (!ctx.userId) {
    throw unauthorized("Must be authenticated to merge sessions");
  }

  const fromOwnerId = `anon:${body.anonymousSessionId}`;
  const toOwnerId = getOwnerId(ctx);
  const result = await getStorage().mergeOwnerData(fromOwnerId, toOwnerId);

  return {
    merged: true,
    ...result,
  };
}

/** Resolve context exported for route handlers that need pre-resolution */
export { resolveApiContext };
