import type { PresetComponent } from "./PresetPlayground";
import { BrainCellGame, TeamGame, GuessGame, RobotGame } from "@/components/games/MeetGames";
import { PuppyGame, CatGame, OopsGame } from "@/components/games/SeeGames";
import { WordsGame, FocusGame, ChatBotGame } from "@/components/games/TalkGames";

export const PRESET_IDS = [
  "game-neuron",
  "game-team",
  "game-guess",
  "game-robot",
  "game-puppy",
  "game-cat",
  "game-oops",
  "game-words",
  "game-focus",
  "game-chat",
] as const;

export type PresetId = (typeof PRESET_IDS)[number];

export const PRESET_REGISTRY: Record<
  PresetId,
  { component: PresetComponent; label: string }
> = {
  "game-neuron": { component: BrainCellGame, label: "Brain Cell" },
  "game-team": { component: TeamGame, label: "Team of Cells" },
  "game-guess": { component: GuessGame, label: "Guess" },
  "game-robot": { component: RobotGame, label: "Teach Robot" },
  "game-puppy": { component: PuppyGame, label: "Train Puppy" },
  "game-cat": { component: CatGame, label: "Find Cat" },
  "game-oops": { component: OopsGame, label: "Oops" },
  "game-words": { component: WordsGame, label: "Word Magnets" },
  "game-focus": { component: FocusGame, label: "Focus" },
  "game-chat": { component: ChatBotGame, label: "Chat Blocks" },
};

export const LESSON_PRESET_MAP: Record<string, PresetId> = {
  "what-is-a-neuron": "game-neuron",
  "why-many-neurons": "game-team",
  "how-does-ai-guess": "game-guess",
  "how-ai-learns": "game-robot",
  "teach-with-examples": "game-puppy",
  "recognize-a-cat": "game-cat",
  "when-ai-is-wrong": "game-oops",
  "how-ai-reads-words": "game-words",
  "how-ai-pays-attention": "game-focus",
  "how-chatbots-work": "game-chat",
};
