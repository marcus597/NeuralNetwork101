import { z } from "zod";

export const firebaseSessionRequestSchema = z.object({
  idToken: z.string().min(1),
});

export const authUserSchema = z.object({
  uid: z.string(),
  email: z.string().email().optional(),
  displayName: z.string().optional(),
  isAnonymous: z.boolean(),
});

export const authMeResponseSchema = z.object({
  user: authUserSchema.nullable(),
  sessionId: z.string(),
  isAuthenticated: z.boolean(),
});

export const anonymousSessionResponseSchema = z.object({
  sessionId: z.string().uuid(),
  expiresAt: z.string().datetime().optional(),
});

export const authMergeRequestSchema = z.object({
  anonymousSessionId: z.string().uuid(),
});

export const authMergeResponseSchema = z.object({
  merged: z.boolean(),
  lessonsMerged: z.number().int(),
  playgroundsMerged: z.number().int(),
  bookmarksMerged: z.number().int(),
});

export type AuthUser = z.infer<typeof authUserSchema>;
export type FirebaseSessionRequest = z.infer<typeof firebaseSessionRequestSchema>;
export type AuthMeResponse = z.infer<typeof authMeResponseSchema>;
export type AuthMergeRequest = z.infer<typeof authMergeRequestSchema>;
export type AuthMergeResponse = z.infer<typeof authMergeResponseSchema>;
export type AnonymousSessionResponse = z.infer<typeof anonymousSessionResponseSchema>;
