# API Routes Reference

All routes require header `X-API-Version: 1` on responses. Send `X-Wonder-Session` for anonymous identity.

## Health

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Service health check |

```bash
curl http://localhost:3000/api/health
```

---

## Quiz

| Method | Path | Description |
|---|---|---|
| POST | `/api/quiz/validate` | Validate quiz step answer |

**Request:**

```json
{
  "lessonSlug": "classification",
  "stepIndex": 0,
  "answer": { "type": "predict", "value": true },
  "simSnapshot": {
    "presetId": "decision-boundary",
    "params": {},
    "metrics": { "trainAccuracy": 0.875 },
    "flags": { "hiddenRevealed": false }
  }
}
```

**Response:**

```json
{
  "correct": true,
  "feedback": "Nice prediction — let's see if reality matches.",
  "stepType": "predict"
}
```

```bash
curl -X POST http://localhost:3000/api/quiz/validate \
  -H "Content-Type: application/json" \
  -d '{"lessonSlug":"classification","stepIndex":0,"answer":{"type":"predict","value":true}}'
```

---

## Progress

| Method | Path | Description |
|---|---|---|
| GET | `/api/progress` | Get full progress state |
| PUT | `/api/progress` | Replace progress (idempotent) |
| PATCH | `/api/progress/[lessonSlug]` | Partial lesson update |

```bash
curl http://localhost:3000/api/progress \
  -H "X-Wonder-Session: 550e8400-e29b-41d4-a716-446655440000"

curl -X PATCH http://localhost:3000/api/progress/classification \
  -H "Content-Type: application/json" \
  -H "X-Wonder-Session: 550e8400-e29b-41d4-a716-446655440000" \
  -d '{"visited":true,"mastered":true}'
```

---

## Playgrounds

| Method | Path | Description |
|---|---|---|
| GET | `/api/playgrounds` | List saved experiments |
| POST | `/api/playgrounds` | Create experiment (max 500 points) |
| GET | `/api/playgrounds/[id]` | Get experiment |
| DELETE | `/api/playgrounds/[id]` | Delete experiment |
| POST | `/api/playgrounds/[id]/share` | Generate share link |
| GET | `/api/playgrounds/share/[token]` | Load shared experiment (public) |

```bash
curl -X POST http://localhost:3000/api/playgrounds \
  -H "Content-Type: application/json" \
  -H "X-Wonder-Session: 550e8400-e29b-41d4-a716-446655440000" \
  -d '{
    "name": "My KNN test",
    "taskType": "classification",
    "splitRatio": 0.8,
    "points": [{"id":"1","x":0.2,"y":0.3,"label":0}],
    "algorithms": [{"id":"knn","hyperparameters":{"k":3},"enabled":true}]
  }'
```

---

## Bookmarks

| Method | Path | Description |
|---|---|---|
| GET | `/api/bookmarks` | List bookmarks |
| POST | `/api/bookmarks` | Create bookmark |
| DELETE | `/api/bookmarks/[id]` | Remove bookmark |

```bash
curl -X POST http://localhost:3000/api/bookmarks \
  -H "Content-Type: application/json" \
  -d '{"type":"lesson","lessonSlug":"classification"}'
```

---

## Settings

| Method | Path | Description |
|---|---|---|
| GET | `/api/settings` | Get user settings |
| PATCH | `/api/settings` | Update settings |

```bash
curl -X PATCH http://localhost:3000/api/settings \
  -H "Content-Type: application/json" \
  -d '{"reducedMotion":true}'
```

---

## Authentication

| Method | Path | Description |
|---|---|---|
| GET | `/api/auth/me` | Current user + session |
| POST | `/api/auth/session` | Firebase login |
| DELETE | `/api/auth/session` | Logout |
| POST | `/api/auth/merge` | Merge anonymous data |

---

## Anonymous

| Method | Path | Description |
|---|---|---|
| POST | `/api/anonymous/session` | Create anonymous session |

```bash
curl -X POST http://localhost:3000/api/anonymous/session
```

---

## Analytics

| Method | Path | Description |
|---|---|---|
| POST | `/api/events` | Batch analytics events |

```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "events": [{
      "name": "lesson_started",
      "lessonSlug": "classification",
      "ts": 1710000000000,
      "sessionId": "550e8400-e29b-41d4-a716-446655440000"
    }]
  }'
```

---

## Subscription (launch — free tier)

| Method | Path | Status |
|---|---|---|
| GET | `/api/subscription` | 200 — `{ tier: "free", status: "active" }` |
| POST | `/api/subscription/checkout` | 403 — paid plans not available at launch |
| GET | `/api/features` | 200 — feature flag matrix |
