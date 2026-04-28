---
pgg:
  topic: "dashboard-optional-audit-token-metrics"
  stage: "plan"
  status: "approved"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-27T23:32:03Z"
spec:
  id: "S5"
  title: "Dashboard Token Summary Ingestion"
---

# S5. Dashboard Token Summary Ingestion

## Scope

dashboard snapshot/model은 token usage ledger와 기존 file estimates를 읽어 flow/file 단위 주요 지표로 사용할 수 있어야 한다.

## Source Boundaries

- `packages/core/src/index.ts`
- `apps/dashboard/src/shared/model/dashboard.ts`
- `apps/dashboard/src/features/history/historyModel.ts`
- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
- `apps/dashboard/src/shared/locale/dashboardLocale.ts`

## Requirements

- 기존 `TopicFileEntry`의 `localEstimatedTokens`, `llmActualTokens`, `tokenSource`는 ledger 기반 값과 호환되어야 한다.
- ledger가 있으면 file artifact별 llm/local token attribution을 우선 사용한다.
- ledger가 없으면 현재 local text estimate fallback을 유지한다.
- `TopicTokenUsage`는 total만이 아니라 llm actual, local estimated, source availability를 구분해 dashboard가 표시할 수 있어야 한다.
- flow별 summary는 timeline row와 workflow step에서 같은 aggregation 함수를 사용해야 한다.
- token source label과 not-recorded fallback은 locale dictionary를 사용한다.

## Acceptance Criteria

- dashboard timeline row에서 각 flow의 `llmActualTokens`와 `localEstimatedTokens`가 별도로 계산된다.
- file list는 artifact별 llm/local token 값을 표시할 수 있다.
- ledger가 없는 기존 archive topic은 기존 estimate 기반 표시를 유지한다.
- ledger가 있는 topic은 file text length estimate보다 ledger attribution을 우선한다.
- token metrics parsing failure는 dashboard를 깨지 않고 `not recorded` 또는 local estimate fallback으로 처리된다.
