"use client";

import { DeepNetworkDiagram } from "@/components/exhibit/DeepNetworkDiagram";
import type { ConceptDiagramId } from "@/lib/content/game-concept-reveals";
import { cn } from "@/lib/cn";

type ConceptDiagramProps = {
  id: ConceptDiagramId;
  className?: string;
};

export function ConceptDiagram({ id, className }: ConceptDiagramProps) {
  switch (id) {
    case "deep-network":
      return <DeepNetworkDiagram className={cn("mx-auto w-full max-w-md", className)} />;
    case "single-neuron":
      return <SingleNeuronDiagram className={className} />;
    case "neuron-team":
      return <NeuronTeamDiagram className={className} />;
    case "classifier":
      return <ClassifierDiagram className={className} />;
    case "learning-fix":
      return <LearningFixDiagram className={className} />;
    case "training-examples":
      return <TrainingExamplesDiagram className={className} />;
    case "scan-grid":
      return <ScanGridDiagram className={className} />;
    case "word-map":
      return <WordMapDiagram className={className} />;
    case "attention":
      return <AttentionDiagram className={className} />;
    case "chat-pipeline":
      return <ChatPipelineDiagram className={className} />;
    default:
      return null;
  }
}

function diagramClass(className?: string) {
  return cn("mx-auto w-full max-w-md", className);
}

function SingleNeuronDiagram({ className }: { className?: string }) {
  const inputs = [0, 1, 2];
  return (
    <svg viewBox="0 0 320 140" className={diagramClass(className)} aria-hidden>
      <text x="8" y="18" className="fill-ink text-[13px] font-semibold">Single neuron</text>
      {inputs.map((i) => {
        const y = 40 + i * 32;
        return (
          <g key={i}>
            <line x1="56" y1={y} x2="200" y2="72" stroke="#93c5fd" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <circle cx="36" cy={y} r="10" fill="#2563eb" />
            <text x="36" y={y + 4} textAnchor="middle" className="fill-white text-[8px] font-bold">x</text>
          </g>
        );
      })}
      <circle cx="220" cy="72" r="18" fill="#14b8a6" />
      <text x="220" y="76" textAnchor="middle" className="fill-white text-[9px] font-bold">Σ</text>
      <text x="260" y="76" className="fill-ink-muted text-[11px]">on / off</text>
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#93c5fd" />
        </marker>
      </defs>
    </svg>
  );
}

function NeuronTeamDiagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 120" className={diagramClass(className)} aria-hidden>
      <text x="8" y="18" className="fill-ink text-[13px] font-semibold">Team of neurons</text>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <circle cx={80 + i * 56} cy="68" r="16" fill="#7b5ea7" />
          <text x={80 + i * 56} y="72" textAnchor="middle" className="fill-white text-[10px] font-bold">N</text>
        </g>
      ))}
      <line x1="48" y1="68" x2="64" y2="68" stroke="#93c5fd" strokeWidth="2" />
      <line x1="256" y1="68" x2="280" y2="68" stroke="#60a5fa" strokeWidth="2" />
      <text x="280" y="72" className="fill-ink-muted text-[11px]">out</text>
    </svg>
  );
}

function ClassifierDiagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 120" className={diagramClass(className)} aria-hidden>
      <text x="8" y="18" className="fill-ink text-[13px] font-semibold">Classifier</text>
      <rect x="24" y="44" width="72" height="48" rx="12" fill="#e8f4fa" stroke="#2e86ab" />
      <text x="60" y="72" textAnchor="middle" className="fill-ink text-[10px]">clues</text>
      <line x1="96" y1="68" x2="140" y2="68" stroke="#93c5fd" strokeWidth="2" />
      <circle cx="168" cy="68" r="18" fill="#14b8a6" />
      <line x1="186" y1="68" x2="230" y2="68" stroke="#93c5fd" strokeWidth="2" />
      <rect x="238" y="52" width="56" height="32" rx="10" fill="#fdf0ec" stroke="#d95e3f" />
      <text x="266" y="72" textAnchor="middle" className="fill-ink text-[10px] font-bold">cat</text>
    </svg>
  );
}

function LearningFixDiagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 120" className={diagramClass(className)} aria-hidden>
      <text x="8" y="18" className="fill-ink text-[13px] font-semibold">Fix the guess</text>
      <rect x="20" y="48" width="88" height="36" rx="10" fill="#fceaea" stroke="#d64545" />
      <text x="64" y="70" textAnchor="middle" className="fill-nn-blame text-[10px] font-semibold">wrong</text>
      <text x="128" y="72" textAnchor="middle" className="fill-ink-muted text-[16px]">→</text>
      <rect x="152" y="48" width="88" height="36" rx="10" fill="#e6f7f4" stroke="#2d9b6a" />
      <text x="196" y="70" textAnchor="middle" className="fill-nn-activation text-[10px] font-semibold">right</text>
      <text x="260" y="72" className="fill-ink-muted text-[10px]">update</text>
    </svg>
  );
}

function TrainingExamplesDiagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 120" className={diagramClass(className)} aria-hidden>
      <text x="8" y="18" className="fill-ink text-[13px] font-semibold">Training data</text>
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${28 + i * 18}, ${36 + i * 4})`}>
          <rect width="64" height="48" rx="10" fill="#fff" stroke="#e8e4de" />
          <text x="32" y="32" textAnchor="middle" className="text-[18px]">🎾</text>
        </g>
      ))}
      <text x="240" y="72" className="fill-ink-muted text-[11px]">many examples</text>
    </svg>
  );
}

function ScanGridDiagram({ className }: { className?: string }) {
  const cells = ["?", "?", "?", "?", "C", "?", "?", "A", "?"];
  return (
    <svg viewBox="0 0 320 140" className={diagramClass(className)} aria-hidden>
      <text x="8" y="18" className="fill-ink text-[13px] font-semibold">Scan the grid</text>
      {cells.map((cell, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 100 + col * 36;
        const y = 40 + row * 36;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width="30"
            height="30"
            rx="6"
            fill={cell === "?" ? "#f3f0eb" : "#e8f4fa"}
            stroke="#2e86ab"
            strokeWidth={cell === "?" ? 1 : 2}
          />
        );
      })}
      {cells.map((cell, i) => {
        if (cell === "?") return null;
        const col = i % 3;
        const row = Math.floor(i / 3);
        return (
          <text
            key={`t-${i}`}
            x={115 + col * 36}
            y={60 + row * 36}
            textAnchor="middle"
            className="fill-ink text-[12px] font-bold"
          >
            {cell}
          </text>
        );
      })}
    </svg>
  );
}

function WordMapDiagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 120" className={diagramClass(className)} aria-hidden>
      <text x="8" y="18" className="fill-ink text-[13px] font-semibold">Word map</text>
      <circle cx="120" cy="72" r="22" fill="#e8f4fa" stroke="#2e86ab" strokeWidth="2" />
      <text x="120" y="76" textAnchor="middle" className="fill-ink text-[11px] font-bold">cat</text>
      <circle cx="210" cy="72" r="22" fill="#e8f4fa" stroke="#2e86ab" strokeWidth="2" />
      <text x="210" y="76" textAnchor="middle" className="fill-ink text-[11px] font-bold">dog</text>
      <line x1="142" y1="72" x2="188" y2="72" stroke="#14b8a6" strokeWidth="2" strokeDasharray="4 3" />
      <text x="165" y="62" textAnchor="middle" className="fill-ink-muted text-[9px]">near</text>
    </svg>
  );
}

function AttentionDiagram({ className }: { className?: string }) {
  const words = ["The", "cat", "sat"];
  return (
    <svg viewBox="0 0 320 120" className={diagramClass(className)} aria-hidden>
      <text x="8" y="18" className="fill-ink text-[13px] font-semibold">Attention</text>
      {words.map((word, i) => (
        <g key={word}>
          <rect
            x={72 + i * 72}
            y="48"
            width="56"
            height="36"
            rx="10"
            fill={word === "cat" ? "#d95e3f" : "#f3f0eb"}
            stroke={word === "cat" ? "#d95e3f" : "#e8e4de"}
          />
          <text
            x={100 + i * 72}
            y="70"
            textAnchor="middle"
            className={cn("text-[11px] font-bold", word === "cat" ? "fill-white" : "fill-ink-muted")}
          >
            {word}
          </text>
        </g>
      ))}
    </svg>
  );
}

function ChatPipelineDiagram({ className }: { className?: string }) {
  const steps = ["words", "look", "reply"];
  return (
    <svg viewBox="0 0 320 120" className={diagramClass(className)} aria-hidden>
      <text x="8" y="18" className="fill-ink text-[13px] font-semibold">Chat pipeline</text>
      {steps.map((step, i) => (
        <g key={step}>
          <rect x={48 + i * 88} y="50" width="64" height="36" rx="10" fill="#fdf0ec" stroke="#d95e3f" />
          <text x={80 + i * 88} y="72" textAnchor="middle" className="fill-ink text-[10px] font-bold">
            {step}
          </text>
          {i < steps.length - 1 && (
            <text x={120 + i * 88} y="72" className="fill-ink-muted text-[14px]">→</text>
          )}
        </g>
      ))}
    </svg>
  );
}
