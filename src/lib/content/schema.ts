import { z } from "zod";
import { PRESET_IDS } from "@/engines/presets/registry";

export const presetIdSchema = z.enum(PRESET_IDS);
export type PresetIdSchema = z.infer<typeof presetIdSchema>;

/** @deprecated use presetId */
export const interactionIdSchema = presetIdSchema;
export type InteractionId = PresetIdSchema;

export const masteryRuleSchema = z.object({
  type: z.enum(["threshold", "comparison", "sequence", "quizPass", "flag"]),
  metric: z.string().optional(),
  compareMetric: z.string().optional(),
  op: z.enum(["gte", "lte", "gt", "lt", "eq"]).optional(),
  operator: z.enum([">=", "<=", ">", "<", "=="]).optional(),
  value: z.number().optional(),
  multiplier: z.number().optional(),
  flag: z.string().optional(),
  steps: z.array(z.string()).optional(),
  requiresReveal: z.boolean().optional(),
  thenRecover: z
    .object({
      metric: z.string(),
      operator: z.enum([">=", "<=", ">", "<", "=="]),
      value: z.number(),
    })
    .optional(),
});

export type MasteryRule = z.infer<typeof masteryRuleSchema>;

const contentBlockSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("text"),
    body: z.string().optional(),
    text: z.string().optional(),
  }).refine((b) => Boolean(b.body ?? b.text), { message: "block needs body or text" }),
  z.object({
    type: z.literal("metaphor"),
    body: z.string().optional(),
    text: z.string().optional(),
  }).refine((b) => Boolean(b.body ?? b.text), { message: "block needs body or text" }),
  z.object({
    type: z.literal("prediction-prompt"),
    body: z.string().optional(),
    text: z.string().optional(),
  }).refine((b) => Boolean(b.body ?? b.text), { message: "block needs body or text" }),
  z.object({
    type: z.literal("concept"),
    term: z.string(),
    definition: z.string(),
  }),
]);

export const quizStepSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("predict"),
    prompt: z.string(),
    hint: z.string().optional(),
    accept: z
      .object({
        type: z.enum(["boolean", "choice"]),
        value: z.union([z.boolean(), z.string()]),
      })
      .optional(),
    choices: z
      .array(
        z.object({
          id: z.string(),
          text: z.string(),
          wrongReason: z.string().optional(),
        }),
      )
      .optional(),
  }),
  z.object({
    type: z.literal("manipulate"),
    prompt: z.string(),
    targetMetric: z.string(),
    targetOp: z.enum(["gte", "lte", "gt", "lt", "eq"]),
    targetValue: z.number(),
  }),
  z.object({
    type: z.literal("explain"),
    prompt: z.string(),
    choices: z.array(
      z.object({
        id: z.string(),
        text: z.string(),
        wrongReason: z.string().optional(),
      }),
    ),
    correctId: z.string(),
  }),
]);

export type QuizStep = z.infer<typeof quizStepSchema>;

export const lessonContentSchema = z.object({
  id: z.string(),
  slug: z.string(),
  module: z.string(),
  moduleTitle: z.string().optional(),
  title: z.string(),
  kicker: z.string(),
  presetId: presetIdSchema,
  presetConfig: z.record(z.string(), z.unknown()).default({}),
  guide: z
    .object({
      steps: z.array(z.string()).min(1).max(6),
    })
    .optional(),
  narrative: z
    .object({
      thread: z.string(),
      character: z.string(),
    })
    .optional(),
  phases: z.object({
    hook: z.object({
      prompt: z.string(),
      tease: z.string().optional(),
    }),
    intuition: z.object({
      blocks: z.array(contentBlockSchema).min(1).max(5),
    }),
    playground: z.object({
      mastery: masteryRuleSchema.optional(),
    }),
    mistakes: z.object({
      traps: z.array(
        z.object({
          id: z.string(),
          detect: masteryRuleSchema,
          reveal: z.string(),
          tone: z.enum(["warning", "discovery", "neutral"]).default("warning"),
        }),
      ),
    }),
    realWorld: z.object({
      example: z.string(),
      domain: z.string(),
    }),
    miniChallenge: z.object({
      goal: z.string(),
      mastery: masteryRuleSchema,
    }),
    recap: z.object({
      bullets: z.array(z.string()).max(5),
    }),
    quiz: z.object({
      steps: z.array(quizStepSchema).max(3),
    }),
    experiment: z
      .object({
        config: z.record(z.string(), z.unknown()).default({}),
      })
      .optional(),
  }),
  nav: z.object({
    prev: z.string().optional(),
    next: z.string().optional(),
  }),
  seo: z.object({
    title: z.string(),
    description: z.string(),
    ogImage: z.string().optional(),
  }),
});

export type LessonContent = z.infer<typeof lessonContentSchema>;
export const lessonSchema = lessonContentSchema;

export const manifestSchema = z.object({
  version: z.number(),
  modules: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      lessons: z.array(z.string()),
    }),
  ),
});

export type CurriculumManifest = z.infer<typeof manifestSchema>;
export type Manifest = CurriculumManifest;
