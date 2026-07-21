/** Per-game visual identity for map cards and thumbnails. */
export type GameArt = {
  accent: string;
  bg: string;
  label: string;
};

export const GAME_ART: Record<string, GameArt> = {
  "what-is-a-neuron": { accent: "#0984e3", bg: "#dfe6ff", label: "1" },
  "why-many-neurons": { accent: "#6c5ce7", bg: "#e8e4ff", label: "2" },
  "how-does-ai-guess": { accent: "#fdcb6e", bg: "#fff3c4", label: "3" },
  "how-ai-learns": { accent: "#00b894", bg: "#dffff8", label: "4" },
  "teach-with-examples": { accent: "#e17055", bg: "#ffe8e0", label: "5" },
  "recognize-a-cat": { accent: "#fd79a8", bg: "#ffe0ed", label: "6" },
  "when-ai-is-wrong": { accent: "#d63031", bg: "#ffd6d6", label: "7" },
  "how-ai-reads-words": { accent: "#0984e3", bg: "#dfe6ff", label: "8" },
  "how-ai-pays-attention": { accent: "#6c5ce7", bg: "#e8e4ff", label: "9" },
  "how-chatbots-work": { accent: "#00b894", bg: "#dffff8", label: "10" },
};

export const ZONE_ART: Record<
  string,
  { gradient: string; pattern: string; accent: string }
> = {
  "meet-ai": {
    gradient: "from-[#dfe6ff] to-[#e8e4ff]",
    pattern: "#6c5ce7",
    accent: "#0984e3",
  },
  "see-ai": {
    gradient: "from-[#ffe0ed] to-[#ffe8e0]",
    pattern: "#fd79a8",
    accent: "#e17055",
  },
  "talk-ai": {
    gradient: "from-[#dffff8] to-[#dfe6ff]",
    pattern: "#00b894",
    accent: "#0984e3",
  },
};

export function getGameArt(slug: string): GameArt {
  return (
    GAME_ART[slug] ?? {
      accent: "#ff4757",
      bg: "#ffeaa7",
      label: "?",
    }
  );
}
