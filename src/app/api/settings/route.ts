import { apiGetHandler, apiHandler } from "@/lib/api/handler";
import { getSettings, patchSettings } from "@/lib/api/handlers/settings";
import {
  settingsPatchRequestSchema,
  settingsResponseSchema,
} from "@/lib/api/schemas/settings";

export const GET = apiGetHandler(getSettings, settingsResponseSchema);

export const PATCH = apiHandler({
  schema: settingsPatchRequestSchema,
  responseSchema: settingsResponseSchema,
  handler: async (ctx, body) => patchSettings(ctx, body),
});
