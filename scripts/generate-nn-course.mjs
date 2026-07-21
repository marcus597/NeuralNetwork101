#!/usr/bin/env node
/**
 * Wonder Museum — 10 beginner games, one idea each. No math. No jargon.
 */
import fs from "fs";
import path from "path";

const ROOT = path.join(process.cwd(), "content");
const LESSONS = path.join(ROOT, "lessons");

const EXHIBITS = [
  {
    slug: "what-is-a-neuron",
    title: "What is a neuron?",
    wing: "meet-ai",
    preset: "game-neuron",
    kicker: "1",
    hint: "It is a tiny brain cell that turns on or off.",
    fact: "Your phone uses millions of these every second.",
  },
  {
    slug: "why-many-neurons",
    title: "Why do we need many neurons?",
    wing: "meet-ai",
    preset: "game-team",
    kicker: "2",
    hint: "One cell is weak. A team is strong.",
    fact: "ChatGPT uses a huge team of cells working together.",
  },
  {
    slug: "how-does-ai-guess",
    title: "How does AI make a guess?",
    wing: "meet-ai",
    preset: "game-guess",
    kicker: "3",
    hint: "It looks at clues and picks an answer.",
    fact: "Face unlock on your phone works like this.",
  },
  {
    slug: "how-ai-learns",
    title: "How does AI learn from mistakes?",
    wing: "meet-ai",
    preset: "game-robot",
    kicker: "4",
    hint: "Show it a better answer and it remembers.",
    fact: "No math homework — just lots of examples.",
  },
  {
    slug: "teach-with-examples",
    title: "Why does AI need lots of examples?",
    wing: "see-ai",
    preset: "game-puppy",
    kicker: "5",
    hint: "More pictures = smarter puppy.",
    fact: "That is why apps need so much data.",
  },
  {
    slug: "recognize-a-cat",
    title: "How does AI recognize a cat?",
    wing: "see-ai",
    preset: "game-cat",
    kicker: "6",
    hint: "It searches the picture bit by bit.",
    fact: "Photo apps and self-driving cars do this.",
  },
  {
    slug: "when-ai-is-wrong",
    title: "Why does AI sometimes get things wrong?",
    wing: "see-ai",
    preset: "game-oops",
    kicker: "7",
    hint: "If it only saw apples, it thinks everything is an apple.",
    fact: "Weird mistakes happen when training is too narrow.",
  },
  {
    slug: "how-ai-reads-words",
    title: "How does AI read words?",
    wing: "talk-ai",
    preset: "game-words",
    kicker: "8",
    hint: "Each word gets a spot on a map.",
    fact: "Similar words sit close together.",
  },
  {
    slug: "how-ai-pays-attention",
    title: "How does AI know what to focus on?",
    wing: "talk-ai",
    preset: "game-focus",
    kicker: "9",
    hint: "Some words matter more than others.",
    fact: "This helps AI understand sentences.",
  },
  {
    slug: "how-chatbots-work",
    title: "How does ChatGPT work?",
    wing: "talk-ai",
    preset: "game-chat",
    kicker: "10",
    hint: "Words → look → reply. That is it!",
    fact: "The idea is simple. The scale is huge.",
  },
];

const WINGS = [
  { id: "meet-ai", title: "Meet the brain", slugs: EXHIBITS.filter((e) => e.wing === "meet-ai").map((e) => e.slug) },
  { id: "see-ai", title: "AI eyes", slugs: EXHIBITS.filter((e) => e.wing === "see-ai").map((e) => e.slug) },
  { id: "talk-ai", title: "AI words", slugs: EXHIBITS.filter((e) => e.wing === "talk-ai").map((e) => e.slug) },
];

function buildLesson(ex, prev, next, wingTitle) {
  return {
    id: ex.slug,
    slug: ex.slug,
    module: ex.wing,
    moduleTitle: wingTitle,
    title: ex.title,
    kicker: ex.kicker,
    presetId: ex.preset,
    presetConfig: {},
    phases: {
      hook: { prompt: ex.title, tease: ex.hint },
      intuition: {
        blocks: [{ type: "concept", term: "Remember", definition: ex.hint }],
      },
      playground: { mastery: { type: "flag", flag: "won" } },
      mistakes: { traps: [] },
      realWorld: { example: ex.fact, domain: "Everyday AI" },
      miniChallenge: {
        goal: "Earn the star!",
        mastery: { type: "flag", flag: "won" },
      },
      recap: { bullets: [ex.hint] },
      quiz: { steps: [] },
    },
    nav: { prev, next },
    seo: {
      title: `${ex.title} — Neural Network Museum`,
      description: ex.hint,
    },
  };
}

if (fs.existsSync(LESSONS)) {
  for (const f of fs.readdirSync(LESSONS)) {
    if (f.endsWith(".json")) fs.unlinkSync(path.join(LESSONS, f));
  }
}
fs.mkdirSync(LESSONS, { recursive: true });

const allSlugs = [];
for (const ex of EXHIBITS) {
  const i = EXHIBITS.indexOf(ex);
  const prev = i > 0 ? EXHIBITS[i - 1].slug : undefined;
  const next = i < EXHIBITS.length - 1 ? EXHIBITS[i + 1].slug : undefined;
  const wing = WINGS.find((w) => w.id === ex.wing);
  const lesson = buildLesson(ex, prev, next, wing?.title ?? ex.wing);
  fs.writeFileSync(path.join(LESSONS, `${ex.slug}.json`), JSON.stringify(lesson, null, 2));
  allSlugs.push(ex.slug);
}

fs.mkdirSync(path.join(ROOT, "curriculum"), { recursive: true });
fs.writeFileSync(
  path.join(ROOT, "curriculum", "manifest.json"),
  JSON.stringify(
    {
      version: 4,
      modules: WINGS.map((w) => ({ id: w.id, title: w.title, lessons: w.slugs })),
    },
    null,
    2,
  ),
);

console.log(`Generated ${allSlugs.length} museum games.`);
