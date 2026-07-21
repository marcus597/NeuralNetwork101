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
  GameTextField,
  matchesAnswer,
} from "@/components/games/GameInputs";

export const WordsGame: PresetComponent = forwardRef(function WordsGame(_props, ref) {
  const { revealAfterCorrect, modal } = useGameConceptReveal("game-words");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [won, setWon] = useState(false);
  const snapshot = useGameSnapshot("game-words", { won });

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
    if (matchesAnswer(answer, ["dog", "kitten", "pet", "puppy", "feline", "animal"])) {
      revealAfterCorrect("similar", () => {
        setWon(true);
        setFeedback(null);
      });
    } else {
      setFeedback('Think of an animal like a cat — try "dog" or "kitten".');
    }
  };

  if (won) {
    return (
      <>
        <GameBoard emoji="🧲" title="Neighbors on the word map!" hint="Similar words sit close together.">
          <p className="flex justify-center gap-4 text-3xl">
            <span>🐱 cat</span>
            <span>↔</span>
            <span>🐶 {answer.trim().toLowerCase()}</span>
          </p>
        </GameBoard>
        {modal}
      </>
    );
  }

  return (
    <>
      <GameBoard emoji="🐱" title='Word on the map: "cat"' hint="Type another word that belongs nearby.">
        <div className="space-y-4">
          <div className="rounded-2xl bg-bg-stage p-6 text-center ring-2 ring-nn-input/20">
            <p className="text-5xl">🐱</p>
            <p className="mt-2 text-2xl font-bold text-ink">cat</p>
          </div>
          <GameTextField
            label="A similar word"
            value={answer}
            onChange={setAnswer}
            placeholder="Type a word…"
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

export const FocusGame: PresetComponent = forwardRef(function FocusGame(_props, ref) {
  const { revealAfterCorrect, modal } = useGameConceptReveal("game-focus");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [won, setWon] = useState(false);
  const words = ["The", "cat", "sat", "on", "the", "mat"];
  const snapshot = useGameSnapshot("game-focus", { won });

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
    if (matchesAnswer(answer, ["cat"])) {
      revealAfterCorrect("keyword", () => {
        setWon(true);
        setFeedback(null);
      });
    } else {
      setFeedback("Which word is the animal? Type that word only.");
    }
  };

  if (won) {
    return (
      <>
        <GameBoard emoji="👀" title="AI zooms in on cat!" hint="Important words get more attention.">
          <p className="flex flex-wrap justify-center gap-2 text-lg">
            {words.map((w) => (
              <span
                key={w}
                className={`rounded-lg px-3 py-1 font-bold ${
                  w === "cat" ? "bg-discover text-on-accent" : "text-ink-muted"
                }`}
              >
                {w}
              </span>
            ))}
          </p>
        </GameBoard>
        {modal}
      </>
    );
  }

  return (
    <>
      <GameBoard emoji="👀" title="Which word matters most?" hint="Type the key word only.">
        <div className="space-y-4">
          <p className="flex flex-wrap justify-center gap-2 text-lg font-medium">
            {words.map((w) => (
              <span key={w} className="rounded-lg bg-bg-stage px-3 py-2 ring-1 ring-border-subtle">
                {w}
              </span>
            ))}
          </p>
          <GameTextField
            label="Most important word"
            value={answer}
            onChange={setAnswer}
            placeholder="Type one word…"
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

const CHAT_STEPS = [
  { accept: ["words", "question", "text"], prompt: "Step 1: Your question becomes ___?" },
  { accept: ["look", "attention", "focus", "read"], prompt: "Step 2: AI ___ at important parts." },
  { accept: ["reply", "answer", "response", "talk"], prompt: "Step 3: AI writes a ___." },
] as const;

export const ChatBotGame: PresetComponent = forwardRef(function ChatBotGame(_props, ref) {
  const { revealAfterCorrect, modal } = useGameConceptReveal("game-chat");
  const [question, setQuestion] = useState("");
  const [step, setStep] = useState(0);
  const [blank, setBlank] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const won = step > CHAT_STEPS.length;
  const snapshot = useGameSnapshot("game-chat", { won });

  useImperativeHandle(ref, () => ({
    reset: () => {
      setQuestion("");
      setStep(0);
      setBlank("");
      setFeedback(null);
    },
    getSnapshot: () => snapshot,
    getState: () => ({ question, step }),
  }));

  const startSteps = () => {
    if (question.trim().length < 3) {
      setFeedback("Type a real question first — at least 3 characters.");
      return;
    }
    revealAfterCorrect("question", () => {
      setStep(1);
      setFeedback(null);
    });
  };

  const checkBlank = () => {
    const current = CHAT_STEPS[step - 1];
    if (!current) return;
    if (matchesAnswer(blank, [...current.accept])) {
      revealAfterCorrect(`step-${step}`, () => {
        setStep((s) => s + 1);
        setBlank("");
        setFeedback(null);
      });
    } else {
      setFeedback(`Hint: try "${current.accept[0]}".`);
    }
  };

  if (won) {
    return (
      <>
        <GameBoard emoji="🎮" title="You built a chatbot path!" hint={`"${question.trim()}" → words → look → reply.`}>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-ink-muted">
            Words → Look → Reply. That powers ChatGPT!
          </motion.p>
        </GameBoard>
        {modal}
      </>
    );
  }

  if (step === 0) {
    return (
      <>
        <GameBoard emoji="💬" title="Ask the AI something!" hint="Type a question in the box.">
          <div className="space-y-4">
            <GameTextField
              label="Your question"
              value={question}
              onChange={setQuestion}
              placeholder="Why is the sky blue?"
              onKeyDown={(e) => e.key === "Enter" && startSteps()}
            />
            <GameCheckButton onClick={startSteps} disabled={question.trim().length < 3}>
              Send question →
            </GameCheckButton>
            {feedback && <GameFeedback tone="error" message={feedback} />}
          </div>
        </GameBoard>
        {modal}
      </>
    );
  }

  const current = CHAT_STEPS[step - 1];

  return (
    <>
      <GameBoard
        emoji={step === 1 ? "📝" : step === 2 ? "👀" : "💬"}
        title={current.prompt}
        hint={`Fill in the blank (${step}/${CHAT_STEPS.length})`}
        screen={step - 1}
        totalScreens={CHAT_STEPS.length}
      >
        <div className="space-y-4">
          <p className="rounded-xl bg-bg-stage px-3 py-2 text-center text-sm text-ink-muted">
            Your question: &ldquo;{question.trim()}&rdquo;
          </p>
          <GameTextField
            label="One word answer"
            value={blank}
            onChange={setBlank}
            placeholder="Type one word…"
            onKeyDown={(e) => e.key === "Enter" && checkBlank()}
          />
          <GameCheckButton onClick={checkBlank} disabled={!blank.trim()} />
          {feedback && <GameFeedback tone="error" message={feedback} />}
        </div>
      </GameBoard>
      {modal}
    </>
  );
});
