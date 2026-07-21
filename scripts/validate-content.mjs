#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { z } from "zod";

const PRESET_IDS = [
  "game-neuron", "game-team", "game-guess", "game-robot", "game-puppy",
  "game-cat", "game-oops", "game-words", "game-focus", "game-chat",
];

const manifest = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "content/curriculum/manifest.json"), "utf-8"),
);
const expectedCount = manifest.modules.flatMap((m) => m.lessons).length;

const lessonSchema = z.object({
  id: z.string(),
  slug: z.string(),
  presetId: z.enum(PRESET_IDS),
  phases: z.object({
    quiz: z.object({ steps: z.array(z.unknown()) }),
  }),
});

const dir = path.join(process.cwd(), "content/lessons");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
let ok = 0;
for (const f of files) {
  lessonSchema.parse(JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")));
  ok++;
}
if (ok !== expectedCount) {
  throw new Error(`Expected ${expectedCount} lessons, found ${ok}`);
}
console.log(`Validated ${ok} museum games.`);
