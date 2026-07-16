import { getLessonBySlug } from "@/lib/content/loader";
import { badRequest, notFound } from "@/lib/api/errors";
import type {
  QuizValidateRequest,
  QuizValidateResponse,
} from "@/lib/api/schemas/quiz";
import type { SimSnapshotDto } from "@/lib/api/schemas/sim-snapshot";

type QuizStep = {
  type: string;
  prompt?: string;
  accept?: { type: string; value: unknown };
  target?: { metric: string; operator: string; value: number };
  targetMetric?: string;
  targetOp?: string;
  targetValue?: number;
  choices?: Array<{
    id: string;
    text: string;
    wrongReason?: string;
    correctReason?: string;
  }>;
  correctId?: string;
};

function normalizeTarget(step: QuizStep): {
  metric: string;
  operator: string;
  value: number;
} | null {
  if (step.target) {
    return {
      metric: step.target.metric,
      operator: step.target.operator,
      value: step.target.value,
    };
  }
  if (
    step.targetMetric &&
    step.targetOp !== undefined &&
    step.targetValue !== undefined
  ) {
    const opMap: Record<string, string> = {
      gte: ">=",
      lte: "<=",
      gt: ">",
      lt: "<",
      eq: "==",
    };
    return {
      metric: step.targetMetric,
      operator: opMap[step.targetOp] ?? step.targetOp,
      value: step.targetValue,
    };
  }
  return null;
}

function compareMetric(
  snapshot: SimSnapshotDto,
  metric: string,
  operator: string,
  value: number,
): boolean {
  const v = snapshot.metrics[metric];
  if (v === undefined) return false;
  switch (operator) {
    case ">=":
      return v >= value;
    case "<=":
      return v <= value;
    case ">":
      return v > value;
    case "<":
      return v < value;
    case "==":
      return v === value;
    default:
      return false;
  }
}

function validatePredictStep(
  step: QuizStep,
  answer: QuizValidateRequest["answer"],
): QuizValidateResponse {
  if (answer.type !== "predict") {
    throw badRequest("Expected predict answer type");
  }

  if (step.accept === undefined) {
    return {
      correct: true,
      stepType: "predict",
      feedback:
        "Prediction locked — now manipulate the controls and see if you were right.",
    };
  }

  const expected = step.accept.value;
  const correct = answer.value === expected;
  return {
    correct,
    stepType: "predict",
    feedback: correct
      ? "Nice prediction — let's see if reality matches."
      : "Not quite. Try changing the control and observe what actually happens.",
    causalExplanation: correct
      ? undefined
      : `This would require ${String(expected)} to be true — watch the metric when you interact.`,
  };
}

function validateManipulateStep(
  step: QuizStep,
  answer: QuizValidateRequest["answer"],
): QuizValidateResponse {
  if (answer.type !== "manipulate") {
    throw badRequest("Expected manipulate answer type");
  }
  const target = normalizeTarget(step);
  if (!target) throw badRequest("Quiz step missing target");

  const correct = compareMetric(
    answer.simSnapshot,
    target.metric,
    target.operator,
    target.value,
  );

  return {
    correct,
    stepType: "manipulate",
    feedback: correct
      ? "You manipulated the simulation correctly."
      : `Keep adjusting — ${target.metric} needs to be ${target.operator} ${target.value}.`,
    causalExplanation: correct
      ? undefined
      : `The metric ${target.metric} reflects the model state. Change inputs until the threshold is met.`,
  };
}

function validateExplainStep(
  step: QuizStep,
  answer: QuizValidateRequest["answer"],
): QuizValidateResponse {
  if (answer.type !== "explain") {
    throw badRequest("Expected explain answer type");
  }
  const correct = answer.choiceId === step.correctId;
  const wrongChoice = step.choices?.find((c) => c.id === answer.choiceId);

  return {
    correct,
    stepType: "explain",
    feedback: correct
      ? "Exactly — that's the causal story."
      : "That explanation doesn't fit what you observed.",
    causalExplanation: correct
      ? undefined
      : wrongChoice?.wrongReason ??
        `"${wrongChoice?.text ?? "That choice"}" would require different behavior in the simulation.`,
  };
}

export function validateQuizAnswer(
  request: QuizValidateRequest,
): QuizValidateResponse {
  const lesson = getLessonBySlug(request.lessonSlug);
  if (!lesson) throw notFound(`Lesson not found: ${request.lessonSlug}`);

  const steps = lesson.phases.quiz.steps as QuizStep[];
  const step = steps[request.stepIndex];
  if (!step) {
    throw badRequest(`Invalid step index: ${request.stepIndex}`);
  }

  switch (step.type) {
    case "predict":
      return validatePredictStep(step, request.answer);
    case "manipulate":
      return validateManipulateStep(step, request.answer);
    case "explain":
      return validateExplainStep(step, request.answer);
    default:
      throw badRequest(`Unknown quiz step type: ${step.type}`);
  }
}
