"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { motion } from "motion/react";
import type { PresetComponent } from "@/engines/presets/PresetPlayground";
import { GameBoard } from "@/components/games/GameBoard";
import { useGameSnapshot } from "@/components/games/game-utils";
import { useGameConceptReveal } from "@/hooks/useGameConceptReveal";
import {
  GameCheckButton,
  GameFeedback,
  GameNumberBox,
  GameSumDisplay,
  GameTextField,
  matchesAnswer,
} from "@/components/games/GameInputs";

export const BrainCellGame: PresetComponent = forwardRef(function BrainCellGame(_props, ref) {
  const { revealAfterCorrect, modal } = useGameConceptReveal("game-neuron");
  const [a, setA] = useState(2);
  const [b, setB] = useState(1);
  const [c, setC] = useState(0);
  const [totalGuess, setTotalGuess] = useState("");
  const [stateGuess, setStateGuess] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [step, setStep] = useState<"sum" | "state" | "won">("sum");

  const total = a + b + c;
  const isOn = total >= 5;
  const won = step === "won";
  const snapshot = useGameSnapshot("game-neuron", { won });

  useImperativeHandle(ref, () => ({
    reset: () => {
      setA(2);
      setB(1);
      setC(0);
      setTotalGuess("");
      setStateGuess("");
      setFeedback(null);
      setStep("sum");
    },
    getSnapshot: () => snapshot,
    getState: () => ({ a, b, c, step }),
  }));

  const checkSum = () => {
    const n = Number(totalGuess.trim());
    if (n === total) {
      revealAfterCorrect("sum", () => {
        setFeedback(null);
        setStep("state");
      });
    } else {
      setFeedback("Not quite — add the three numbers above and type the total.");
    }
  };

  const checkState = () => {
    const on = matchesAnswer(stateGuess, ["on", "awake", "yes", "fire", "glow"]);
    const off = matchesAnswer(stateGuess, ["off", "sleep", "no", "quiet"]);
    if (isOn && on) revealAfterCorrect("state", () => setStep("won"));
    else if (!isOn && off) revealAfterCorrect("state", () => setStep("won"));
    else if (isOn) setFeedback('The total is 5 or more — type "on".');
    else setFeedback('The total is under 5 — type "off". Try changing the numbers!');
  };

  if (won) {
    return (
      <>
        <GameBoard emoji="🌟" title="You figured it out!" hint="Add inputs → check total → ON or OFF.">
          <p className="text-center text-lg text-ink-muted">
            {total} made the cell {isOn ? "turn ON" : "stay OFF"}. That is one neuron!
          </p>
        </GameBoard>
        {modal}
      </>
    );
  }

  return (
    <>
    <GameBoard
      emoji={isOn ? "🤩" : "😴"}
      title={step === "sum" ? "Add the three signals!" : "Is the cell ON or OFF?"}
      hint={
        step === "sum"
          ? "Change numbers, then type the sum."
          : "Type on or off (5+ = on)."
      }
      screen={step === "sum" ? 0 : 1}
      totalScreens={2}
    >
      <div className="space-y-4">
        <div className="flex justify-center gap-3">
          <GameNumberBox label="Signal 1" value={a} onChange={setA} />
          <GameNumberBox label="Signal 2" value={b} onChange={setB} />
          <GameNumberBox label="Signal 3" value={c} onChange={setC} />
        </div>
        <GameSumDisplay parts={[a, b, c]} total={total} />
        {step === "sum" ? (
          <>
            <GameTextField
              label="What is the total?"
              type="number"
              value={totalGuess}
              onChange={setTotalGuess}
              placeholder="Type the number…"
              onKeyDown={(e) => e.key === "Enter" && checkSum()}
            />
            <GameCheckButton onClick={checkSum} disabled={!totalGuess.trim()} />
          </>
        ) : (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <GameTextField
                label='Type "on" or "off"'
                value={stateGuess}
                onChange={setStateGuess}
                placeholder="on / off"
                onKeyDown={(e) => e.key === "Enter" && checkState()}
              />
            </motion.div>
            <GameCheckButton onClick={checkState} disabled={!stateGuess.trim()} />
          </>
        )}
        {feedback && <GameFeedback tone="error" message={feedback} />}
      </div>
    </GameBoard>
    {modal}
    </>
  );
});

export const TeamGame: PresetComponent = forwardRef(function TeamGame(_props, ref) {
  const { revealAfterCorrect, modal } = useGameConceptReveal("game-team");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [won, setWon] = useState(false);
  const snapshot = useGameSnapshot("game-team", { won });

  useImperativeHandle(ref, () => ({
    reset: () => {
      setAnswer("");
      setFeedback(null);
      setWon(false);
    },
    getSnapshot: () => snapshot,
    getState: () => ({ answer }),
  }));

  const check = () => {
    if (Number(answer.trim()) === 3) {
      revealAfterCorrect("count", () => {
        setWon(true);
        setFeedback(null);
      });
    } else {
      setFeedback("Hint: 10 + 10 + 10 = ?");
    }
  };

  if (won) {
    return (
      <>
      <GameBoard emoji="🎉" title="3 neurons lift 30 points!" hint="Teams beat solo workers.">
        <div className="flex justify-center gap-2 py-2">
          {[1, 2, 3].map((i) => (
            <span key={i} className="flex h-14 w-14 items-center justify-center rounded-xl bg-nn-hidden text-2xl">
              🧠
            </span>
          ))}
        </div>
      </GameBoard>
      {modal}
      </>
    );
  }

  return (
    <>
    <GameBoard emoji="💪" title="One neuron lifts 10 points." hint="You need 30 points total.">
      <div className="space-y-4">
        <div className="rounded-xl bg-bg-stage p-4 text-center ring-2 ring-border-subtle">
          <p className="text-4xl font-bold text-ink">30</p>
          <p className="text-sm text-ink-muted">points to lift</p>
        </div>
        <GameTextField
          label="How many neurons do you need?"
          type="number"
          value={answer}
          onChange={setAnswer}
          placeholder="Type a number…"
          onKeyDown={(e) => e.key === "Enter" && check()}
        />
        <GameCheckButton onClick={check} disabled={!answer.trim()} />
        {feedback && <GameFeedback tone="error" message={feedback} />}
      </div>
    </GameBoard>
    {modal}
    </>
  );
});

export const GuessGame: PresetComponent = forwardRef(function GuessGame(_props, ref) {
  const { revealAfterCorrect, modal } = useGameConceptReveal("game-guess");
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [won, setWon] = useState(false);
  const snapshot = useGameSnapshot("game-guess", { won });

  useImperativeHandle(ref, () => ({
    reset: () => {
      setGuess("");
      setFeedback(null);
      setWon(false);
    },
    getSnapshot: () => snapshot,
    getState: () => ({ guess }),
  }));

  const check = () => {
    if (matchesAnswer(guess, ["cat"])) {
      revealAfterCorrect("guess", () => {
        setWon(true);
        setFeedback(null);
      });
    } else if (matchesAnswer(guess, ["dog"])) {
      setFeedback("Look again — whiskers and pointy ears mean cat!");
    } else {
      setFeedback('Type "cat" or "dog" based on what you see.');
    }
  };

  if (won) {
    return (
      <>
      <GameBoard emoji="🐱" title="Correct — it is a cat!" hint="AI picks the label that fits the clues.">
        <p className="text-center text-lg text-ink-muted">You typed the right answer!</p>
      </GameBoard>
      {modal}
      </>
    );
  }

  return (
    <>
    <GameBoard emoji="🐱" title="Whiskers · pointy ears · small nose" hint="Type what animal this is.">
      <div className="space-y-4">
        <GameTextField
          label="Your guess"
          value={guess}
          onChange={setGuess}
          placeholder="Type cat or dog…"
          onKeyDown={(e) => e.key === "Enter" && check()}
        />
        <GameCheckButton onClick={check} disabled={!guess.trim()}>
          Lock in my guess 🔒
        </GameCheckButton>
        {feedback && <GameFeedback tone="error" message={feedback} />}
      </div>
    </GameBoard>
    {modal}
    </>
  );
});

const ROBOT_ROUNDS = [
  { wrong: "2 + 2 = 5", accept: ["4", "four"], fix: "2 + 2 = 4" },
  { wrong: "The sky is green", accept: ["blue"], fix: "The sky is blue" },
  { wrong: "Cats say woof", accept: ["meow"], fix: "Cats say meow" },
] as const;

export const RobotGame: PresetComponent = forwardRef(function RobotGame(_props, ref) {
  const { revealAfterCorrect, modal } = useGameConceptReveal("game-robot");
  const [round, setRound] = useState(0);
  const [fix, setFix] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const won = round >= ROBOT_ROUNDS.length;
  const snapshot = useGameSnapshot("game-robot", { won });

  useImperativeHandle(ref, () => ({
    reset: () => {
      setRound(0);
      setFix("");
      setFeedback(null);
    },
    getSnapshot: () => snapshot,
    getState: () => ({ round }),
  }));

  const current = ROBOT_ROUNDS[round];

  const check = () => {
    if (!current) return;
    if (matchesAnswer(fix, [...current.accept])) {
      revealAfterCorrect(`round-${round}`, () => {
        if (round + 1 >= ROBOT_ROUNDS.length) setRound(ROBOT_ROUNDS.length);
        else {
          setRound((r) => r + 1);
          setFix("");
          setFeedback(null);
        }
      });
    } else {
      setFeedback(`Try typing the right fix — like: ${current.fix}`);
    }
  };

  if (won) {
    return (
      <>
      <GameBoard emoji="🤖" title="You taught the robot!" hint="Fixing wrong answers is how AI learns.">
        <p className="text-center text-lg text-ink-muted">You typed three better answers. Nice!</p>
      </GameBoard>
      {modal}
      </>
    );
  }

  return (
    <>
    <GameBoard
      emoji="🤖"
      title="The robot is wrong!"
      hint={`Fix ${round + 1} of ${ROBOT_ROUNDS.length} — type the truth.`}
      screen={round}
      totalScreens={ROBOT_ROUNDS.length}
    >
      <div className="space-y-4">
        <p className="rounded-xl bg-nn-blame-soft px-4 py-3 text-center text-lg font-medium text-nn-blame">
          {current.wrong}
        </p>
        <GameTextField
          label="Type the correct answer"
          value={fix}
          onChange={setFix}
          placeholder="Write the fix…"
          onKeyDown={(e) => e.key === "Enter" && check()}
        />
        <GameCheckButton onClick={check} disabled={!fix.trim()} />
        {feedback && <GameFeedback tone="error" message={feedback} />}
      </div>
    </GameBoard>
    {modal}
    </>
  );
});
