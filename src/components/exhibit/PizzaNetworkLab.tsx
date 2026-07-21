"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, RotateCcw, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  AMOUNT_LABELS,
  DETECTOR_INPUTS,
  DETECTORS,
  PRESET_PLATES,
  cycleAmount,
  emptyPlate,
  mixedIngredientOrder,
  shuffleIngredients,
  thinkAboutPizza,
  type IngredientDef,
  type IngredientId,
  type IngredientState,
} from "@/lib/nn/pizza-brain";
import { DeepNetworkReveal } from "@/components/exhibit/DeepNetworkReveal";

const STEPS = [
  { n: 1, title: "Pick ingredients", hint: "Give the brain some clues." },
  { n: 2, title: "See the brain think", hint: "Watch signals flow." },
  { n: 3, title: "Try weird combos", hint: "Each checker notices one thing." },
] as const;

function bezierPath(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
}

function ySlot(index: number, total: number, top: number, height: number) {
  if (total <= 1) return top + height / 2;
  return top + (index / (total - 1)) * height;
}

export function PizzaNetworkLab() {
  const [plate, setPlate] = useState<IngredientState>(emptyPlate);
  const [step, setStep] = useState(1);
  const [flowing, setFlowing] = useState(false);
  const [showNumbers, setShowNumbers] = useState(false);
  const [ingredientOrder, setIngredientOrder] = useState<IngredientDef[]>(mixedIngredientOrder);
  const [celebrate, setCelebrate] = useState(false);
  const [showDeepNetwork, setShowDeepNetwork] = useState(false);
  const prevVerdict = useRef<boolean | null>(null);
  const hadPizza = useRef(false);

  useEffect(() => {
    setIngredientOrder(shuffleIngredients());
  }, []);

  const verdict = useMemo(() => thinkAboutPizza(plate), [plate]);

  useEffect(() => {
    if (verdict.idle) {
      hadPizza.current = false;
      return;
    }
    if (verdict.isPizza && !hadPizza.current) {
      setShowDeepNetwork(true);
      hadPizza.current = true;
    } else if (!verdict.isPizza) {
      hadPizza.current = false;
    }
  }, [verdict.isPizza, verdict.idle]);

  useEffect(() => {
    if (verdict.idle) return;
    if (prevVerdict.current !== null && prevVerdict.current !== verdict.isPizza) {
      setCelebrate(true);
      const t = setTimeout(() => setCelebrate(false), 1200);
      prevVerdict.current = verdict.isPizza;
      return () => clearTimeout(t);
    }
    prevVerdict.current = verdict.isPizza;
  }, [verdict.isPizza, verdict.idle]);

  const bumpIngredient = (id: IngredientId) => {
    setPlate((p) => ({ ...p, [id]: cycleAmount(p[id]) }));
    setStep(Math.max(step, 1));
  };

  const runFlow = useCallback(() => {
    setStep(2);
    setFlowing(true);
    window.setTimeout(() => setFlowing(false), 2200);
  }, []);

  useEffect(() => {
    if (step >= 2 && !verdict.idle) {
      setFlowing(true);
      const t = setTimeout(() => setFlowing(false), 1800);
      return () => clearTimeout(t);
    }
  }, [plate, step, verdict.idle]);

  const inputX = 12;
  const hiddenX = 50;
  const outputX = 88;
  const diagramTop = 8;
  const diagramH = 84;

  const renderIngredientCard = (ing: IngredientDef) => {
    const amount = plate[ing.id];
    const on = amount > 0;
    return (
      <button
        key={ing.id}
        type="button"
        onClick={() => bumpIngredient(ing.id)}
        className={cn(
          "soft-ingredient focus-ring flex w-full items-center gap-3 px-3 py-2.5 text-left transition-all",
          !on && "opacity-50",
        )}
        data-on={on}
        style={
          on
            ? {
                borderColor: `${ing.color}44`,
                backgroundColor: `${ing.soft}cc`,
              }
            : undefined
        }
      >
        <span
          className={cn(
            "soft-ingredient-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-xl transition-all",
            on ? "scale-105" : "border-transparent bg-bg-muted/80",
          )}
          style={on ? { borderColor: `${ing.color}55` } : undefined}
        >
          {ing.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold leading-snug text-ink">{ing.label}</p>
          <p className="text-xs font-semibold" style={{ color: on ? ing.color : undefined }}>
            {AMOUNT_LABELS[amount]}
          </p>
        </div>
        <div className="hidden w-14 shrink-0 sm:block">
          <div className="h-2 overflow-hidden rounded-full soft-meter-track">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: ing.color }}
              animate={{ width: `${amount * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-5">
      {/* Step tabs */}
      <div className="grid grid-cols-3 gap-2">
        {STEPS.map((s) => (
          <button
            key={s.n}
            type="button"
            onClick={() => setStep(s.n)}
            className={cn(
              "soft-step focus-ring px-2 py-3 text-left transition-all",
              step === s.n && "soft-step-active",
            )}
          >
            <span className="soft-step-num text-xs font-bold text-ink-muted">{s.n}</span>
            <p className="soft-step-title mt-0.5 text-[11px] font-bold leading-tight text-ink sm:text-xs">
              {s.title}
            </p>
          </button>
        ))}
      </div>

      {/* Main exhibit card */}
      <div className="soft-shell overflow-hidden">
        <div className="soft-shell-header px-4 py-3 sm:px-6">
          <p className="text-center text-sm font-medium text-ink-muted">
            A neural network is a <span className="font-semibold text-ink">tiny team of decision-makers</span>
          </p>
        </div>

        <div className="grid gap-6 p-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.1fr)_auto_minmax(0,0.9fr)] sm:items-stretch sm:p-6">
          {/* Inputs */}
          <div className="max-h-[520px] overflow-y-auto sm:max-h-none">
            <p className="soft-label mb-2 text-center sm:text-left">
              Ingredients
              <span className="mt-0.5 block font-normal normal-case tracking-normal text-ink-muted">
                Tap to add more
              </span>
            </p>
            <div className="space-y-2">
              {ingredientOrder.map((ing) => renderIngredientCard(ing))}
            </div>
          </div>

          {/* Wires + hidden (diagram) */}
          <div className="relative hidden min-h-[420px] sm:block sm:min-w-[120px]">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
              aria-hidden
            >
              {ingredientOrder.flatMap((ing, ii) =>
                DETECTORS.map((det, di) => {
                  const amount = plate[ing.id];
                  if (amount === 0 && !flowing) return null;
                  const linked = DETECTOR_INPUTS[det.id].includes(ing.id);
                  if (!linked) return null;
                  const y1 = ySlot(ii, ingredientOrder.length, diagramTop, diagramH);
                  const y2 = ySlot(di, DETECTORS.length, diagramTop, diagramH);
                  const path = bezierPath(inputX, y1, hiddenX, y2);
                  const lit = amount > 0 && (flowing || amount >= 0.5);
                  return (
                    <g key={`${ing.id}-${det.id}`}>
                      <path
                        d={path}
                        fill="none"
                        stroke={ing.color}
                        strokeWidth={lit ? 0.9 + amount * 0.6 : 0.35}
                        strokeOpacity={lit ? 0.55 + amount * 0.35 : 0.12}
                        strokeLinecap="round"
                      />
                      {flowing && amount > 0 && (
                        <motion.circle
                          r="1.2"
                          fill={ing.color}
                          initial={{ offsetDistance: "0%" }}
                          animate={{ offsetDistance: "100%" }}
                          transition={{
                            duration: 0.9 + ii * 0.08,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          style={{
                            offsetPath: `path('${path}')`,
                          }}
                        />
                      )}
                    </g>
                  );
                }),
              )}
              {DETECTORS.map((det, di) => {
                const d = verdict.detectors.find((x) => x.id === det.id)!;
                const y1 = ySlot(di, DETECTORS.length, diagramTop, diagramH);
                const path = bezierPath(hiddenX, y1, outputX - 8, 50);
                if (!d.active && !flowing) return null;
                return (
                  <g key={`out-${det.id}`}>
                    <path
                      d={path}
                      fill="none"
                      stroke="#d95e3f"
                      strokeWidth={d.active ? 0.8 + d.level * 0.5 : 0.3}
                      strokeOpacity={d.active ? 0.45 : 0.12}
                      strokeLinecap="round"
                    />
                    {flowing && d.active && (
                      <motion.circle
                        r="1.1"
                        fill="#d95e3f"
                        animate={{ offsetDistance: ["0%", "100%"] }}
                        transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: di * 0.1 }}
                        style={{ offsetPath: `path('${path}')` }}
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Hidden detectors */}
          <div className="soft-team-panel p-3">
            <p className="soft-label mb-3 text-center">
              The team checks clues
            </p>
            <div className="space-y-2">
              {DETECTORS.map((det) => {
                const state = verdict.detectors.find((d) => d.id === det.id)!;
                return (
                  <motion.div
                    key={det.id}
                    className="soft-detector px-3 py-2.5 transition-shadow"
                    data-active={state.active}
                    animate={
                      state.active && flowing
                        ? {
                            scale: [1, 1.02, 1],
                            boxShadow: [
                              "0 0 0 rgba(217,94,63,0)",
                              "0 0 20px rgba(217,94,63,0.2)",
                              "0 0 0 rgba(217,94,63,0)",
                            ],
                          }
                        : {}
                    }
                    transition={{ duration: 1.2, repeat: flowing && state.active ? Infinity : 0 }}
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className={cn(
                          "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg",
                          state.active ? "bg-discover-soft" : "bg-bg-muted/80",
                        )}
                      >
                        {det.emoji}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-ink">{det.name}</p>
                        <p className="mt-0.5 text-[11px] leading-snug text-ink-muted">{det.job}</p>
                        <AnimatePresence mode="wait">
                          <motion.p
                            key={state.thought}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className={cn(
                              "mt-1.5 text-xs font-semibold leading-snug",
                              state.active ? "text-discover" : "text-ink-faint",
                            )}
                          >
                            “{state.thought}”
                          </motion.p>
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Arrow on mobile */}
          <p className="text-center text-2xl text-ink-faint sm:hidden" aria-hidden>
            ↓
          </p>

          {/* Output */}
          <div className="flex flex-col justify-center">
            <p className="soft-label mb-3 text-center">
              Final guess
            </p>
            <motion.div
              key={verdict.label}
              initial={celebrate ? { scale: 0.92 } : false}
              animate={{
                scale: celebrate ? [0.92, 1.05, 1] : 1,
              }}
              className="soft-output px-5 py-6 text-center"
              data-pizza={!verdict.idle ? verdict.isPizza : undefined}
            >
              <motion.span
                className="text-5xl"
                animate={celebrate ? { rotate: [0, 8, -8, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                {verdict.idle ? "🍽️" : verdict.isPizza ? "🍕" : "❌"}
              </motion.span>
              <p className="mt-2 text-2xl font-bold text-ink">
                {verdict.idle ? "Pick ingredients" : verdict.label}
              </p>

              {!verdict.idle && (
                <div className="mx-auto mt-4 max-w-[180px]">
                  <p className="text-xs font-semibold text-ink-muted">
                    {verdict.isPizza ? "Feeling confident" : "Pretty sure"}
                  </p>
                  <div className="soft-meter-track mt-1.5 h-3 overflow-hidden rounded-full">
                    <motion.div
                      className={cn(
                        "h-full rounded-full",
                        verdict.isPizza ? "soft-meter-fill-pizza" : "soft-meter-fill-not",
                      )}
                      animate={{ width: `${Math.round(verdict.confidence * 100)}%` }}
                      transition={{ type: "spring", stiffness: 200, damping: 22 }}
                    />
                  </div>
                  {showNumbers && (
                    <p className="mt-1 font-mono text-[10px] text-ink-faint">
                      {Math.round(verdict.confidence * 100)}%
                    </p>
                  )}
                </div>
              )}

              {verdict.idle && (
                <p className="mt-3 text-sm text-ink-muted">Tap an ingredient to start</p>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Explainer cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            n: 1,
            title: "Ingredients go in",
            body: "Each ingredient wakes up a checker on the team.",
            emoji: "🍅",
          },
          {
            n: 2,
            title: "Team mixes clues",
            body: "Each neuron looks for ONE simple thing.",
            emoji: "🟣",
          },
          {
            n: 3,
            title: "Brain decides",
            body: "Everyone votes together: pizza or not pizza!",
            emoji: "🍕",
          },
        ].map((card) => (
          <div
            key={card.n}
            className="soft-card-sm px-4 py-4"
          >
            <p className="text-2xl">{card.emoji}</p>
            <p className="mt-2 text-sm font-bold text-ink">
              {card.n}. {card.title}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-ink-muted">{card.body}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="soft-tip-panel p-4">
        <p className="text-sm font-bold text-ink">Try it!</p>
        <ul className="mt-2 space-y-1 text-xs text-ink-muted">
          <li>· Tap pizza ingredients to wake up the team</li>
          <li>· Press &ldquo;Watch signals flow&rdquo; to see the brain think</li>
          <li>· Mix pizza toppings with random stuff and see what happens</li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={runFlow}
            disabled={verdict.idle}
            className="soft-btn-primary focus-ring inline-flex min-h-12 flex-1 items-center justify-center gap-2 px-4 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:px-6"
          >
            <Play className="h-4 w-4" aria-hidden />
            Watch signals flow
          </button>
          <button
            type="button"
            onClick={() => {
              setPlate(emptyPlate());
              setIngredientOrder(shuffleIngredients());
              setStep(1);
              setShowDeepNetwork(false);
            }}
            className="soft-btn-secondary focus-ring inline-flex min-h-12 items-center justify-center gap-2 px-4 text-sm font-bold text-ink"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Reset
          </button>
          {PRESET_PLATES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlate(p.plate)}
              className="soft-btn-ghost focus-ring px-3 py-2 text-xs font-bold text-ink"
            >
              {p.emoji} {p.name}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowNumbers((v) => !v)}
            className="soft-btn-ghost focus-ring inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-ink-muted"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {showNumbers ? "Hide numbers" : "Curious mode"}
          </button>
        </div>
      </div>

      <p className="text-center text-sm leading-relaxed text-ink-muted">
        Each neuron checks <span className="font-semibold text-ink">one simple thing</span>.
        Together they decide if it&apos;s pizza.
      </p>

      <DeepNetworkReveal open={showDeepNetwork} onClose={() => setShowDeepNetwork(false)} />
    </div>
  );
}
