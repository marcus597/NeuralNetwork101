# Wonder — Senior Engineering Audit

**Date:** 2026-07-16  
**Scope:** Full codebase review + refactor  
**Result:** CI green (`npm run check`)

---

## Scorecard (1–10)

| Domain | Before | After | Notes |
|---|---|---|---|
| Folder structure | 6 | 8 | Removed duplicate `validate-content.ts`; consolidated API events route |
| Duplicate code | 5 | 7 | Removed duplicate `useSimulationLoop` from `bridge.ts`; wired ultimate playground |
| Performance | 5 | 7 | Playground canvas: RAF only when timeline playing; playground code-split |
| Accessibility | 7 | 7 | Existing aria-live, focus rings retained; keyboard canvas v1.1 |
| Security | 4 | 8 | CSP + security headers in `next.config.ts`; API Zod validation unified |
| SEO | 7 | 7 | SSG lessons, sitemap, robots, JSON-LD unchanged |
| Bundle size | 5 | 7 | Dynamic import for `PlaygroundShell`; preset registry still eager (P2) |
| Lazy loading | 5 | 7 | `/playground` lazy; lesson presets still static import (P2) |
| Memory leaks | 6 | 8 | RAF cancel on unmount; ResizeObserver cleanup verified |
| Animation perf | 6 | 8 | No infinite RAF on idle playground; UI/canvas split maintained |
| API quality | 5 | 8 | Events route uses `apiHandler`; typed schema exports; structured logger |
| Type safety | 4 | 9 | All TS errors fixed; `Partial` hyperparams; exported API types |
| Testing | 7 | 8 | 40 tests passing; API + sim + e2e smoke |
| Error handling | 7 | 8 | API handler + SimulationErrorBoundary hierarchy |
| Logging | 3 | 7 | `lib/logger.ts` structured JSON; dev-only analytics debug |
| Monitoring | 5 | 7 | `/api/health` with version; analytics proxy validated |
| Deployment readiness | 6 | 8 | `.env.example`, security headers, `npm run check` |

---

## Major refactors

### 1. TypeScript CI blockers (P0)
- Fixed broken imports in `createCanvasPreset.tsx`
- Exported `QuizStep`, API request/response types from Zod schemas
- Fixed `ProgressEngine` re-exports
- Fixed `drawBoundaryLine` color typing
- Fixed Model Arena metric mapping (`acc` vs `accuracy`)
- Changed `PlaygroundExperiment.hyperparams` to `Partial<Record<...>>`

### 2. API layer consolidation (P0)
- `/api/events` now uses shared `apiHandler` + `ingestEvents` handler
- Removed duplicate ad-hoc route logic
- Added structured `logger` for server errors and dev analytics

### 3. Duplicate simulation loop removed (P1)
- `engines/interaction/bridge.ts` no longer duplicates `useSimulationLoop`
- Single canonical implementation in `engines/simulation/useSimulationLoop.ts`

### 4. Ultimate playground wired (P1)
- `/playground` was stub tab UI; now loads `PlaygroundShell` via `dynamic()` + skeleton
- Code-split ~playground bundle from main routes

### 5. Playground canvas performance (P1)
- **Before:** Infinite RAF at 60fps always
- **After:** Redraw on state change; RAF loop only when `timelinePlaying`

### 6. Security headers (P1)
- `next.config.ts`: CSP, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy
- `poweredByHeader: false`

### 7. Dead code removed (P2)
- Deleted duplicate `scripts/validate-content.ts` (`.mjs` is canonical)

---

## Files deleted / consolidated

| Action | Path |
|---|---|
| Deleted | `scripts/validate-content.ts` |
| Consolidated | `src/app/api/events/route.ts` → uses handler |
| Slimmed | `src/engines/interaction/bridge.ts` |

---

## Deployment readiness checklist

- [x] `npm run validate:content` — 26 lessons
- [x] `npm run typecheck` — strict, zero errors
- [x] `npm run lint` — warnings only (unused imports in preset stubs)
- [x] `npm test` — 40 tests
- [x] `npm run build` — production build
- [x] `.env.example` documents required vars
- [x] Security headers configured
- [x] No secrets in client bundle
- [x] API input validation via Zod
- [ ] Sentry DSN (optional, not configured)
- [ ] Redis storage for serverless persistence (v2)
- [ ] Preset registry lazy loading (P2)

---

## Verify commands

```bash
cd /Users/marcuscheung/Documents/GitHub/wonder-ml
npm run check          # full CI: validate + typecheck + lint + test + build
npm run test:e2e       # Playwright smoke (requires dev server)
npm run dev            # local development
```

---

## Remaining debt (honest P2)

1. **Preset registry eager imports** — All 26 presets load in lesson bundle; should use `dynamic()` per `presetId`
2. **Legacy interaction components** — `components/interactions/*` still used on home page; migrate to presets + delete
3. **Duplicate TimelineControls** — `ui/TimelineControls` vs `playground/TimelineControls`; unify with props adapter
4. **ESLint warnings** — Unused imports in generated preset simulations (26 warnings)
5. **Canvas keyboard navigation** — WCAG gap for pointer-only canvases
6. **Sentry integration** — Stub only; add when DSN available
7. **Redis storage adapter** — Memory store only; not durable across serverless instances
8. **Bundle analyzer** — Not in CI; add `@next/bundle-analyzer` optional script

---

## Architecture alignment

```
content/          → lesson JSON (26 validated)
src/engines/      → lesson, quiz, progress, simulation, presets, visualization
src/lib/api/      → schemas, handlers, storage adapter
src/stores/       → zustand (progress, lesson, ui, playground)
src/components/   → shell, ui, playground, interactions (legacy)
```

Target state: interactions folder deleted after home page migrates to `PresetPlayground`.
