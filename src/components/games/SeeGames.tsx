"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import type { PresetComponent } from "@/engines/presets/PresetPlayground";
import { GameBoard } from "@/components/games/GameBoard";
import { useGameSnapshot } from "@/components/games/game-utils";
import { useGameConceptReveal } from "@/hooks/useGameConceptReveal";
import {
  GameCheckButton,
  GameFeedback,
  GameTextField,
  matchesAnswer,
} from "@/components/games/GameInputs";

export const PuppyGame: PresetComponent = forwardRef(function PuppyGame(_props, ref) {
  const { revealAfterCorrect, modal } = useGameConceptReveal("game-puppy");
  const [labels, setLabels] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const won = labels.length >= 5;
  const snapshot = useGameSnapshot("game-puppy", { won });

  useImperativeHandle(ref, () => ({
    reset: () => {
      setLabels([]);
      setCurrent("");
      setFeedback(null);
    },
    getSnapshot: () => snapshot,
    getState: () => ({ labels }),
  }));

  const addLabel = () => {
    const trimmed = current.trim();
    if (!trimmed) return;
    if (!matchesAnswer(trimmed, ["tennis ball", "tennis", "ball"])) {
      setFeedback('Label this photo "tennis ball" — that is what we want the puppy to learn.');
      return;
    }
    revealAfterCorrect("example", () => {
      setLabels((l) => [...l, trimmed]);
      setCurrent("");
      setFeedback(null);
    });
  };

  if (won) {
    return (
      <>
        <GameBoard emoji="🐕" title="5 examples taught!" hint="More good labels = smarter AI.">
          <div className="flex flex-wrap justify-center gap-1">
            {labels.map((_, i) => (
              <span key={i} className="text-2xl">🎾</span>
            ))}
          </div>
        </GameBoard>
        {modal}
      </>
    );
  }

  return (
    <>
      <GameBoard
        emoji="🐕"
        title={`Training photo ${labels.length + 1} of 5`}
        hint="Type what is in the picture."
        screen={labels.length}
        totalScreens={5}
      >
        <div className="space-y-4">
          <div className="flex h-32 items-center justify-center rounded-2xl bg-bg-stage text-6xl ring-2 ring-border-subtle">
            🎾
          </div>
          <GameTextField
            label="What is this?"
            value={current}
            onChange={setCurrent}
            placeholder='Type "tennis ball"…'
            onKeyDown={(e) => e.key === "Enter" && addLabel()}
          />
          <GameCheckButton onClick={addLabel} disabled={!current.trim()}>
            Add this example
          </GameCheckButton>
          {feedback && <GameFeedback tone="error" message={feedback} />}
          {labels.length > 0 && (
            <p className="text-center text-sm text-nn-activation">{labels.length} / 5 saved ✓</p>
          )}
        </div>
      </GameBoard>
      {modal}
    </>
  );
});

const CAT_GRID = [
  ["?", "?", "?"],
  ["?", "C", "?"],
  ["?", "A", "?"],
] as const;

export const CatGame: PresetComponent = forwardRef(function CatGame(_props, ref) {
  const { revealAfterCorrect, modal } = useGameConceptReveal("game-cat");
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [won, setWon] = useState(false);

  const flat = CAT_GRID.flat();
  const lettersShown = [...revealed].map((i) => flat[i]).filter((c) => c !== "?").join("");

  const snapshot = useGameSnapshot("game-cat", { won });

  useImperativeHandle(ref, () => ({
    reset: () => {
      setRevealed(new Set());
      setAnswer("");
      setFeedback(null);
      setWon(false);
    },
    getSnapshot: () => snapshot,
    getState: () => ({ revealed: [...revealed], answer }),
  }));

  const tap = (idx: number) => {
    if (flat[idx] === "?") return;
    setRevealed((s) => new Set(s).add(idx));
  };

  const check = () => {
    if (matchesAnswer(answer, ["cat"])) {
      revealAfterCorrect("guess", () => {
        setWon(true);
        setFeedback(null);
      });
    } else {
      setFeedback('Tap squares with letters, then type "cat".');
    }
  };

  if (won) {
    return (
      <>
        <GameBoard emoji="🐱" title="You spotted the cat!" hint="AI scans piece by piece, then guesses.">
          <p className="text-center text-6xl">🐱</p>
        </GameBoard>
        {modal}
      </>
    );
  }

  return (
    <>
      <GameBoard emoji="🔍" title="Reveal letters · guess the animal" hint="Tap letter squares first.">
        <div className="space-y-4">
          <div className="mx-auto grid max-w-xs grid-cols-3 gap-2">
            {flat.map((cell, i) => (
              <button
                key={i}
                type="button"
                onClick={() => tap(i)}
                className="focus-ring flex aspect-square items-center justify-center rounded-xl bg-bg-stage text-2xl font-bold ring-2 ring-border-subtle transition-all hover:scale-105"
              >
                {revealed.has(i) || cell !== "?" ? cell : "?"}
              </button>
            ))}
          </div>
          {lettersShown && (
            <p className="text-center text-sm text-ink-muted">
              Letters found: <span className="font-bold text-ink">{lettersShown}</span>
            </p>
          )}
          <GameTextField
            label="What animal is it?"
            value={answer}
            onChange={setAnswer}
            placeholder="Type the animal…"
            onKeyDown={(e) => e.key === "Enter" && check()}
          />
          <GameCheckButton onClick={check} disabled={!answer.trim() || revealed.size === 0} />
          {feedback && <GameFeedback tone="error" message={feedback} />}
        </div>
      </GameBoard>
      {modal}
    </>
  );
});

export const OopsGame: PresetComponent = forwardRef(function OopsGame(_props, ref) {
  const { revealAfterCorrect, modal } = useGameConceptReveal("game-oops");
  const [phase, setPhase] = useState<"name" | "fix" | "won">("name");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const won = phase === "won";
  const snapshot = useGameSnapshot("game-oops", { won });

  useImperativeHandle(ref, () => ({
    reset: () => {
      setPhase("name");
      setAnswer("");
      setFeedback(null);
    },
    getSnapshot: () => snapshot,
    getState: () => ({ phase }),
  }));

  const checkName = () => {
    if (matchesAnswer(answer, ["banana"])) {
      revealAfterCorrect("name", () => {
        setPhase("fix");
        setAnswer("");
        setFeedback(null);
      });
    } else {
      setFeedback("Look at the picture — type the yellow fruit.");
    }
  };

  const checkFix = () => {
    if (matchesAnswer(answer, ["banana", "it is a banana", "its a banana"])) {
      revealAfterCorrect("fix", () => {
        setPhase("won");
        setFeedback(null);
      });
    } else if (matchesAnswer(answer, ["apple"])) {
      setFeedback("That is what the AI wrongly said! Type the RIGHT fruit.");
    } else {
      setFeedback('Type what it really is — not "apple".');
    }
  };

  if (won) {
    return (
      <>
        <GameBoard emoji="💡" title="Too few examples = silly mistakes!" hint="Train on many kinds of things.">
          <p className="text-center text-lg text-ink-muted">You fixed the AI&apos;s wrong guess.</p>
        </GameBoard>
        {modal}
      </>
    );
  }

  if (phase === "name") {
    return (
      <>
        <GameBoard emoji="🍌" title="What fruit is this?" hint="Type the name.">
          <div className="space-y-4">
            <p className="text-center text-6xl">🍌</p>
            <GameTextField
              label="Your answer"
              value={answer}
              onChange={setAnswer}
              placeholder="Type the fruit…"
              onKeyDown={(e) => e.key === "Enter" && checkName()}
            />
            <GameCheckButton onClick={checkName} disabled={!answer.trim()} />
            {feedback && <GameFeedback tone="error" message={feedback} />}
          </div>
        </GameBoard>
        {modal}
      </>
    );
  }

  return (
    <>
      <GameBoard emoji="🤖" title='AI says: "That is an apple!"' hint="Type what it SHOULD say instead.">
        <div className="space-y-4">
          <p className="text-center text-4xl">🍌</p>
          <GameTextField
            label="Correct answer"
            value={answer}
            onChange={setAnswer}
            placeholder="It is a ___"
            onKeyDown={(e) => e.key === "Enter" && checkFix()}
          />
          <GameCheckButton onClick={checkFix} disabled={!answer.trim()} />
          {feedback && <GameFeedback tone="error" message={feedback} />}
        </div>
      </GameBoard>
      {modal}
    </>
  );
});
