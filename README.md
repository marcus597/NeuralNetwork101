# Wonder

Interactive machine learning education — learn by touching, not reading.

## Stack

- Next.js 16 (App Router), TypeScript, Tailwind v4
- Motion (UI), Canvas 2D (simulations)
- Zustand (client state), Zod (content + API schemas)

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verify (CI)

```bash
npm run check
```

Runs: content validation → typecheck → lint → tests → production build.

Individual commands:

| Command | Purpose |
|---|---|
| `npm run validate:content` | Zod-validate 26 lesson JSON files |
| `npm run typecheck` | TypeScript strict |
| `npm run test` | Vitest unit + API tests |
| `npm run test:e2e` | Playwright smoke |
| `npm run build` | Production build |

## Environment

Copy `.env.example` to `.env.local`. All vars optional for local dev except production JWT secret.

## Architecture

```
content/lessons/     Lesson JSON (26)
src/engines/       Lesson, quiz, simulation, presets
src/lib/api/         REST handlers + Zod schemas
src/components/    Shell, UI, playground
docs/ENGINEERING_AUDIT.md   Latest audit
docs/api/            API documentation
```

## Deploy

Vercel-compatible. Set `WONDER_JWT_SECRET` in production. See `docs/ENGINEERING_AUDIT.md` deployment checklist.
