---
pgg:
  topic: "dashboard-optional-audit-token-metrics"
  stage: "refactor"
  status: "approved"
  skill: "pgg-refactor"
  score: 96
  updated_at: "2026-04-28T00:18:00Z"
reactflow:
  node_id: "refactor-review"
  node_type: "review"
  label: "refactor.review.md"
state:
  summary: "optional audit artifact 판정과 token usage 합산 조건 중복을 helper로 정리했다."
  next: "pgg-token"
---

# Refactor Review

## Decision

approved

## Score

96

## Reviewers

- 시니어 백엔드 엔지니어
- 테크 리드

## Scope Reviewed

- `apps/dashboard/src/features/history/historyModel.ts`
- `packages/core/src/index.ts`
- `packages/core/dist/index.js`
- `packages/core/dist/index.js.map`

## Findings

- blocking: 없음
- Optional audit artifact path matching이 helper로 분리되어 token/performance report/review 조건이 한 곳에서 관리된다.
- Token usage llm actual/local estimated 합산 조건이 helper로 분리되어 file attribution과 topic summary가 같은 기준을 사용한다.
- Refactor는 기존 완료 evidence gating, timeline completion gating, ledger parser contract를 변경하지 않는다.

## Verification

- `pnpm --filter @pgg/core test`: pass, 54 tests.
- `pnpm --filter @pgg/dashboard build`: pass, Vite chunk-size warning only.

## Residual Risk

- 현재 refactor는 로직 분리만 수행했으므로 별도 성능 audit는 필요하지 않다.
- Provider usage metadata unavailable 상태는 기존 implementation의 token ledger limitation과 동일하다.
