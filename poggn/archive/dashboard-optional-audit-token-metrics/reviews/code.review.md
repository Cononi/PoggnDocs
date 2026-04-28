---
pgg:
  topic: "dashboard-optional-audit-token-metrics"
  stage: "review"
  status: "approved"
  score: 95
  updated_at: "2026-04-27T23:54:55Z"
---

# Code Review

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 시니어 백엔드 엔지니어 | 95 | core snapshot에 `state/token-usage.ndjson` parser와 ledger-first file/topic attribution을 추가했고, 기존 estimate fallback을 보존했다. malformed ledger는 무시되어 dashboard snapshot이 깨지지 않는다. | 없음 |
| 테크 리드 | 95 | optional audit visibility와 timeline completion gating을 dashboard model에서 분리해 `required` applicability와 실행 evidence를 혼동하지 않게 했다. generated docs/templates/state-pack까지 같은 계약으로 전파했다. | 없음 |

## Decision

- code review approved.
- required `pgg-token` audit remains open after the refactor stage.
- `pgg-performance` remains not required.

## Verification

- `pnpm --filter @pgg/core test`: pass, 54 tests.
- `pnpm --filter @pgg/dashboard build`: pass, Vite chunk-size warning only.
