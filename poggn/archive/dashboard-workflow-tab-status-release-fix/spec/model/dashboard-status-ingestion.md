---
pgg:
  topic: "dashboard-workflow-tab-status-release-fix"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-24T23:52:49Z"
---

# S5. Dashboard Status Ingestion

## 목적

dashboard가 workflow status source를 일관된 우선순위로 읽게 한다.

## Source Priority

1. `state/history.ndjson`의 stage-started/progress/requirements-added/stage-commit/verified completion event
2. `workflow.reactflow.json` node detail의 trusted `startedAt`, `updatedAt`, `completedAt`, status
3. stage-specific artifact frontmatter와 review/gate result
4. stage-specific file timestamp
5. topic-wide fallback

## Status Rules

- no start evidence: `시작 전`
- `stage-started` 또는 `stage-progress`: `진행 중`
- completion 이후 unresolved `requirements-added`/revision: `추가 진행`
- full-stage completion evidence: `완료`

## Fallback Rules

- topic-wide fallback은 completed time으로 복제하지 않는다.
- broad artifacts like `state/`, `workflow.reactflow.json`, shared implementation index는 per-flow completion source로 과신하지 않는다.
- low-confidence fallback은 UI에서 확정 완료처럼 표시하지 않는다.

## Acceptance

- 같은 `updatedAt`이 여러 flow의 완료 시각으로 반복 표시되지 않는다.
- stage event가 있으면 artifact fallback보다 우선한다.
- dashboard Overview Progress와 React Flow surface가 같은 status source를 사용한다.
