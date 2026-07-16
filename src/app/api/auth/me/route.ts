import { apiGetHandler } from "@/lib/api/handler";
import { getAuthMe } from "@/lib/api/handlers/auth";
import { authMeResponseSchema } from "@/lib/api/schemas/auth";

export const GET = apiGetHandler(getAuthMe, authMeResponseSchema);
