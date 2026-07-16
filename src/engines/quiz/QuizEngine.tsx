"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock } from "lucide-react";
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
};

const STEP_LABELS = {
  predict: "Predict",
  manipulate: "Manipulate",
  explain: "Explain",
} as const;

export function QuizEngine({ steps, getSnapshot, onPass }: QuizEngineProps) {
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
    feedback?.includes("reached") ||
    feedback?.includes("Locked")
      ? "success"
      : feedback?.includes("Not quite") || feedback?.includes("Need")
        ? "warning"
        : "neutral";

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        {steps.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors duration-300",
              i < stepIndex ? "bg-mint" : i === stepIndex ? "bg-violet" : "bg-white/10",
            )}
            aria-hidden
          />
        ))}
      </div>
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-ink-muted">
        {STEP_LABELS[step.type]} · {stepIndex + 1} of {steps.length}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={easeOut}
          className="panel space-y-5 p-6"
        >
          <p className="text-[15px] leading-relaxed text-ink">{step.prompt}</p>

          {step.type === "predict" && (
            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                disabled={predictLocked}
                onClick={() => {
                  setPredictLocked(true);
                  setFeedback("Guess locked — now change something in the playground and see if you were right.");
                }}
                className="bg-violet/15 text-violet ring-1 ring-violet/20"
              >
                <Lock className="mr-2 h-4 w-4" aria-hidden />
                {predictLocked ? "Locked" : "Lock my guess"}
              </Button>
              {predictLocked && (
                <Button variant="ghost" onClick={advance}>
                  Next step
                </Button>
              )}
            </div>
          )}

          {step.type === "manipulate" && (
            <Button
              variant="secondary"
              className="bg-sky/15 text-sky ring-1 ring-sky/20"
              onClick={() => {
                const snap = getSnapshot();
                const v = snap?.metrics[step.targetMetric];
                if (v === undefined) {
                  setFeedback("Interact with the playground first — move a slider or drag a point.");
                  return;
                }
                const ok =
                  step.targetOp === "gte"
                    ? v >= step.targetValue
                    : step.targetOp === "lte"
                      ? v <= step.targetValue
                      : step.targetOp === "gt"
                        ? v > step.targetValue
                        : step.targetOp === "lt"
                          ? v < step.targetValue
                          : v === step.targetValue;
                setFeedback(
                  ok
                    ? "Target reached — you caused a real change in the model."
                    : `Need ${step.targetMetric} ${step.targetOp} ${step.targetValue}. Right now: ${v.toFixed(2)}.`,
                );
                if (ok) setTimeout(advance, 700);
              }}
            >
              Check manipulation
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
                      setFeedback("Correct — that's the causal story, not just what moved.");
                      setTimeout(advance, 800);
                    } else {
                      setFeedback(c.wrongReason ?? "Not quite — what would need to be true for that?");
                    }
                  }}
                  className={cn(
                    "focus-ring w-full rounded-xl border px-4 py-3.5 text-left text-sm leading-relaxed transition-all active:scale-[0.99]",
                    selectedExplain === c.id
                      ? "border-violet/40 bg-violet/10 text-ink"
                      : "border-white/10 text-ink-muted hover:border-white/16 hover:text-ink",
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
    </div>
  );
}
