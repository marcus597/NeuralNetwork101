import { apiHandler } from "@/lib/api/handler";
import { validateQuizAnswer } from "@/lib/api/handlers/quiz";
import {
  quizValidateRequestSchema,
  quizValidateResponseSchema,
} from "@/lib/api/schemas/quiz";

export const POST = apiHandler({
  schema: quizValidateRequestSchema,
  responseSchema: quizValidateResponseSchema,
  handler: async (_ctx, body) => validateQuizAnswer(body),
});
