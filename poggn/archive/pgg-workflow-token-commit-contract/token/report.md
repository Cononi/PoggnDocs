---
pgg:
  topic: "pgg-workflow-token-commit-contract"
  stage: "token"
  status: "reviewed"
  skill: "pgg-token"
  score: 98
  updated_at: "2026-04-28T01:44:03Z"
---

# Token Audit Report

## Decision

approved

## Audit Applicability

- [pgg-token]: [required] | token 측정 정확도, source 분리, actual/unavailable/estimated 계약을 직접 변경하는 topic이다.
- [pgg-performance]: [not_required] | 모바일 workflow process scaling은 UI layout 계약이며 별도 성능 민감 runtime path나 선언된 performance verification contract는 없다.

## 측정 요약

| 항목 | 값 | 판정 |
|---|---:|---|
| ledger record count | 0 | 현재 topic에는 `state/token-usage.ndjson`가 없다. |
| LLM actual tokens | unavailable | Codex response usage metadata record가 없으므로 요금 계산용 actual 값으로 사용하지 않는다. |
| Local estimated tokens | 151,584 | dashboard snapshot의 파일 기반 local estimate이며 LLM actual로 fallback하지 않는다. |
| dashboard token source | estimated | ledger가 없으므로 source는 `estimated`다. |

## 측정 근거

- `node --input-type=module -e ... buildDashboardSnapshot(...)` 결과:
  - `tokenUsage.total`: `151584`
  - `tokenUsage.llmActualTokens`: `null`
  - `tokenUsage.localEstimatedTokens`: `151584`
  - `tokenUsage.source`: `estimated`
  - `tokenUsage.ledgerRecordCount`: `0`
- `state/token-usage.ndjson`: 없음.
- 따라서 이번 topic의 실제 LLM 과금 토큰은 측정 불가이며, `0`으로 대체하지 않는다.

## 계약 검토

- LLM actual 집계 조건은 `source=llm`, `measurement=actual`, `estimated=false`, `usageMetadataAvailable=true`를 모두 만족해야 한다.
- LLM unavailable record와 usage metadata가 없는 LLM actual 후보는 요금용 actual 합계에서 제외된다.
- Local token은 `source=local`로만 합산되며 LLM actual로 fallback되지 않는다.
- dashboard는 Workflow Progress, timeline, file preview에서 LLM clip과 Local clip을 분리한다.
- LLM actual이 `null`이면 unavailable로 표시하고 `0`처럼 표시하지 않는다.

## Coverage

- `packages/core/src/index.ts`: token ledger parser, actual LLM predicate, Local sum, topic/file summary 적용 경로를 확인했다.
- `packages/core/test/dashboard-token-usage.test.mjs`: LLM actual, LLM unavailable, metadata 없는 actual 후보, Local estimated 분리 회귀 테스트를 확인했다.
- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`: `TokenUsageChips`가 LLM/Local clip을 분리하는 경로를 확인했다.
- `apps/dashboard/src/shared/locale/dashboardLocale.ts`: 한국어/영어 token label이 분리되어 있다.

## 실행 결과

- `./.codex/sh/pgg-gate.sh pgg-token pgg-workflow-token-commit-contract`: pass.
- `pnpm --filter @pgg/core test`: pass, 55 tests.
- dashboard snapshot token summary 확인: pass.

## 최적화/개선 액션

- 지금 topic에서 token 비용 최적화보다 중요한 사항은 실제 LLM usage metadata가 없는 값을 actual로 승격하지 않는 것이다.
- 후속 개선 후보: Codex response usage metadata를 받을 수 있는 실행 경로에서는 `state/token-usage.ndjson`에 append-only actual LLM record를 남겨 `ledgerRecordCount > 0` 상태로 만들 수 있다.
- Local shell/CLI 작업은 token-equivalent estimate로만 기록하고, provider billing metric과 섞지 않는다.

## Expert Notes

### 테크 리드

- score: 98
- judgment: 요금 계산용 actual은 Codex usage metadata가 있을 때만 인정하며, unavailable과 Local estimate를 분리한 계약이 유지된다.
- blocking issues: 없음

### 코드 리뷰어

- score: 98
- judgment: 회귀 테스트가 metadata 없는 LLM record를 actual에서 제외하고 Local estimated를 별도 source로 유지하는 핵심 경로를 검증한다.
- blocking issues: 없음

## 결론

required token audit는 통과한다. 현재 topic의 실제 LLM actual 사용량은 metadata ledger 부재로 unavailable이며, Local estimate와 분리되어 dashboard에 표시된다.
