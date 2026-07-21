"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { QuizStep } from "@/lib/content/schema";
import type { SimSnapshot } from "@/engines/interaction/types";
import { LiveHint } from "@/components/shell/LiveHint";
import { Button } from "@/components/ui/Button";
import { easeOut } from "@/lib/motion/tokens";
import { cn } from "@/lib/cn";

type QuizEngineProps = {
  steps: QuizStep[];
  getSnapshot: () => SimSnapshot | null;
  onPass: () => void;
  onSkip?: () => void;
};

const STEP_LABELS = {
  predict: "Guess!",
  manipulate: "Try it!",
  explain: "Which one sounds right?",
} as const;

function compareMetric(
  v: number,
  op: "gte" | "lte" | "gt" | "lt" | "eq",
  target: number,
): boolean {
  switch (op) {
    case "gte":
      return v >= target;
    case "lte":
      return v <= target;
    case "gt":
      return v > target;
    case "lt":
      return v < target;
    case "eq":
      return v === target;
    default:
      return false;
  }
}

export function QuizEngine({ steps, getSnapshot, onPass, onSkip }: QuizEngineProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [predictLocked, setPredictLocked] = useState(false);
  const [selectedExplain, setSelectedExplain] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const step = steps[stepIndex];

  const advance = () => {
    if (stepIndex >= steps.length - 1) {
      onPass();
      return;
    }
    setStepIndex((i) => i + 1);
    setPredictLocked(false);
    setSelectedExplain(null);
    setFeedback(null);
  };

  if (!step) return null;

  const feedbackTone =
    feedback?.includes("Correct") ||
    feedback?.includes("Nice") ||
    feedback?.includes("Yes") ||
    feedback?.includes("You did it") ||
    feedback?.includes("Great")
      ? "success"
      : feedback?.includes("Not quite") ||
          feedback?.includes("Not yet") ||
          feedback?.includes("Try") ||
          feedback?.includes("Move")
        ? "warning"
        : "neutral";

  const checkPredict = (value: boolean | string) => {
    if (step.type !== "predict") return;
    if (!step.accept) {
      setPredictLocked(true);
      setFeedback("OK! Now try the toy and see what happens.");
      return;
    }
    const expected = step.accept.value;
    const correct = value === expected;
    if (correct) {
      setPredictLocked(true);
      setFeedback("Great guess!");
      setTimeout(advance, 600);
    } else {
      setFeedback("Not quite — try the other button.");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        {steps.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 flex-1 rounded-full transition-colors duration-300",
              i < stepIndex ? "bg-nn-activation" : i === stepIndex ? "bg-discover" : "bg-bg-inset",
            )}
            aria-hidden
          />
        ))}
      </div>
      <p className="text-sm font-semibold text-discover">
        Question {stepIndex + 1} of {steps.length} — {STEP_LABELS[step.type]}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={easeOut}
          className="space-y-4 rounded-2xl border border-border-subtle bg-bg-surface p-5 sm:p-6"
        >
          <p className="text-base leading-relaxed text-ink sm:text-lg">{step.prompt}</p>

          {step.type === "predict" && (
            <div className="flex flex-wrap gap-3">
              {step.accept?.type === "boolean" || (!step.accept && !step.choices) ? (
                <>
                  <Button
                    variant="secondary"
                    size="lg"
                    disabled={predictLocked}
                    onClick={() => checkPredict(true)}
                    className="min-w-[6rem] bg-nn-signal-soft text-nn-activation"
                  >
                    Yes
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    disabled={predictLocked}
                    onClick={() => checkPredict(false)}
                    className="min-w-[6rem] bg-nn-blame-soft text-nn-blame"
                  >
                    No
                  </Button>
                </>
              ) : (
                step.choices?.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    disabled={predictLocked}
                    onClick={() => checkPredict(c.id)}
                    className="focus-ring w-full rounded-xl border border-border-subtle px-4 py-3.5 text-left text-base hover:bg-bg-muted"
                  >
                    {c.text}
                  </button>
                ))
              )}
              {predictLocked && !step.accept && (
                <Button variant="ghost" size="lg" onClick={advance}>
                  Next question →
                </Button>
              )}
            </div>
          )}

          {step.type === "manipulate" && (
            <Button
              variant="secondary"
              size="lg"
              className="bg-nn-input-soft text-nn-input"
              onClick={() => {
                const snap = getSnapshot();
                const metricVal = snap?.metrics[step.targetMetric];
                const flagVal = snap?.flags[step.targetMetric];
                let ok = false;
                if (metricVal !== undefined) {
                  ok = compareMetric(metricVal, step.targetOp, step.targetValue);
                } else if (flagVal !== undefined) {
                  ok = compareMetric(flagVal ? 1 : 0, step.targetOp, step.targetValue);
                } else {
                  setFeedback("Move the sliders in the toy first, then press this button.");
                  return;
                }
                setFeedback(
                  ok ? "You did it!" : "Not yet — keep trying in the toy above.",
                );
                if (ok) setTimeout(advance, 600);
              }}
            >
              I did it — check!
            </Button>
          )}

          {step.type === "explain" && (
            <div className="space-y-2.5">
              {step.choices.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setSelectedExplain(c.id);
                    if (c.id === step.correctId) {
                      setFeedback("Yes!");
                      setTimeout(advance, 700);
                    } else {
                      setFeedback("Try another one.");
                    }
                  }}
                  className={cn(
                    "focus-ring w-full rounded-xl border px-4 py-3.5 text-left text-base transition-colors",
                    selectedExplain === c.id
                      ? "border-discover/35 bg-discover-soft text-ink"
                      : "border-border-subtle text-ink-muted hover:bg-bg-muted hover:text-ink",
                  )}
                >
                  {c.text}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <LiveHint message={feedback} tone={feedbackTone} />

      {onSkip && (
        <button
          type="button"
          onClick={onSkip}
          className="focus-ring text-sm text-ink-muted underline-offset-2 hover:text-ink hover:underline"
        >
          Skip questions →
        </button>
      )}
    </div>
  );
}
