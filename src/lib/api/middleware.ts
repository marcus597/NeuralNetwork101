import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";
import {
  AUTH_COOKIE,
  SESSION_COOKIE,
  SESSION_HEADER,
} from "@/lib/api/constants";
import { unauthorized } from "@/lib/api/errors";
import type { AuthUser } from "@/lib/api/schemas/auth";

export type ApiContext = {
  /** Authenticated Firebase uid, or null for anonymous */
  userId: string | null;
  /** Always present — anonymous UUID or linked session */
  sessionId: string;
  isAuthenticated: boolean;
  user: AuthUser | null;
};

function getJwtSecret(): Uint8Array {
  const secret = process.env.WONDER_JWT_SECRET ?? "dev-only-change-in-production";
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: {
  uid: string;
  email?: string;
  displayName?: string;
}): Promise<string> {
  return new SignJWT({
    uid: payload.uid,
    email: payload.email,
    displayName: payload.displayName,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifySessionToken(
  token: string,
): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    const uid = payload.uid;
    if (typeof uid !== "string") return null;
    return {
      uid,
      email: typeof payload.email === "string" ? payload.email : undefined,
      displayName:
        typeof payload.displayName === "string"
          ? payload.displayName
          : undefined,
      isAnonymous: false,
    };
  } catch {
    return null;
  }
}

export async function verifyFirebaseIdToken(
  idToken: string,
): Promise<AuthUser | null> {
  const apiKey = process.env.FIREBASE_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      users?: Array<{ localId: string; email?: string; displayName?: string }>;
    };
    const user = data.users?.[0];
    if (!user) return null;
    return {
      uid: user.localId,
      email: user.email,
      displayName: user.displayName,
      isAnonymous: false,
    };
  } catch {
    return null;
  }
}

function isValidUuid(v: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    v,
  );
}

export async function resolveApiContext(): Promise<ApiContext> {
  const hdrs = await headers();
  const cookieStore = await cookies();

  const headerSession = hdrs.get(SESSION_HEADER);
  const cookieSession = cookieStore.get(SESSION_COOKIE)?.value;
  const authToken = cookieStore.get(AUTH_COOKIE)?.value;
  const bearer = hdrs.get("authorization")?.replace(/^Bearer\s+/i, "");

  let user: AuthUser | null = null;
  if (bearer) {
    user = await verifySessionToken(bearer);
  } else if (authToken) {
    user = await verifySessionToken(authToken);
  }

  const sessionId =
    (headerSession && isValidUuid(headerSession) ? headerSession : null) ??
    (cookieSession && isValidUuid(cookieSession) ? cookieSession : null) ??
    crypto.randomUUID();

  return {
    userId: user?.uid ?? null,
    sessionId,
    isAuthenticated: user !== null,
    user,
  };
}

/** Owner key for storage — authenticated users use uid, anonymous use session prefix */
export function getOwnerId(ctx: ApiContext): string {
  return ctx.userId ?? `anon:${ctx.sessionId}`;
}

export function requireAuth(ctx: ApiContext): string {
  if (!ctx.userId) throw unauthorized("Authentication required");
  return ctx.userId;
}
