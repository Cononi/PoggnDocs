---
pgg:
  topic: "dashboard-optional-audit-token-metrics"
  stage: "plan"
  status: "approved"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-27T23:32:03Z"
spec:
  id: "S1"
  title: "Optional Audit Visibility"
---

# S1. Optional Audit Visibility

## Scope

`pgg-token`과 `pgg-performance`는 optional audit다. dashboard Overview workflow는 이 flow를 실제 실행 evidence가 있을 때만 표시해야 한다.

## Source Boundaries

- `apps/dashboard/src/features/history/historyModel.ts`
- `packages/core/src/index.ts` dashboard snapshot generation
- `state/history.ndjson`
- `workflow.reactflow.json`
- `token/report.md`, `performance/report.md`
- `reviews/token.review.md`, `reviews/performance.review.md`

## Requirements

- `Audit Applicability: required`는 audit 필요성 판단일 뿐 visibility evidence가 아니다.
- static `workflowFlowDefinitions`에 `token`/`performance`가 존재한다는 이유만으로 Overview에 표시하지 않는다.
- optional audit 실행 evidence는 다음 중 하나여야 한다.
  - 해당 flow의 `stage-started`, `stage-progress`, verified/final `stage-completed`, `stage-commit` history event
  - `token/report.md` 또는 `performance/report.md`
  - `reviews/token.review.md` 또는 `reviews/performance.review.md`
  - `workflow.reactflow.json` node의 stage가 `token`, `pgg-token`, `performance`, `pgg-performance`이고 실행 timestamp나 status detail이 있는 경우
- optional audit report/review placeholder만 존재하고 실행 timestamp 또는 meaningful content가 없으면 표시 evidence로 보지 않는다.
- core flow는 기존 visibility와 진행 상태 모델을 유지한다.

## Acceptance Criteria

- `pgg-token` required topic이라도 token 실행 event/report/review/node가 없으면 Overview에 token flow가 없다.
- `pgg-performance` not_required topic에서 performance 실행 evidence가 없으면 Overview에 performance flow가 없다.
- token audit가 실제 시작된 topic은 token flow가 표시되고 `시작 전`, `진행 중`, `추가 진행`, `완료` 중 하나로 계산된다.
- performance audit가 실제 시작된 topic은 performance flow가 표시되고 같은 상태 모델을 사용한다.
- optional audit 표시 여부는 archive/active bucket 모두에서 같은 evidence 규칙을 사용한다.
