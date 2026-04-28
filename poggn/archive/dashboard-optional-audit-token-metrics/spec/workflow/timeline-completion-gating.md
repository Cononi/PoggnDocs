---
pgg:
  topic: "dashboard-optional-audit-token-metrics"
  stage: "plan"
  status: "approved"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-27T23:32:03Z"
spec:
  id: "S2"
  title: "Timeline Completion Gating"
---

# S2. Timeline Completion Gating

## Scope

dashboard timeline은 workflow progress에서 `완료`로 계산된 flow만 timeline row로 표시해야 한다. 진행 중, 추가 진행, 시작 전 flow는 완료 이력처럼 보이면 안 된다.

## Source Boundaries

- `apps/dashboard/src/features/history/historyModel.ts`
- `buildWorkflowSteps`
- `buildTimelineRows`
- `buildTimelineBounds`
- `state/history.ndjson`
- `workflow.reactflow.json`

## Requirements

- timeline row 생성은 `topicHasFlowEvidence`가 아니라 completion evidence 기반이어야 한다.
- 완료 evidence는 기존 flow status contract와 일치해야 한다.
  - `stage-commit`
  - `stage-completed` with verified/final/gate/qa source
  - trusted workflow node `completedAt` plus completed/pass/final status
  - archive/version/release evidence for `done`
  - later-flow evidence는 해당 이전 flow의 필수 완료 조건을 대체할 수 있는 경우에만 허용한다.
- `stage-started`, `stage-progress`, draft/reviewed frontmatter, file updatedAt fallback은 단독 timeline row 조건이 아니다.
- timeline bounds도 완료된 timeline row의 start/completed timestamps만 사용해야 한다.
- optional audit flow는 S1 visibility를 통과했더라도 완료 상태가 아니면 timeline row로 표시하지 않는다.

## Acceptance Criteria

- plan이 진행 중인 active topic은 Overview에서 plan이 current일 수 있지만 timeline에는 plan 완료 row가 나타나지 않는다.
- `pgg-token`이 started만 있고 completed evidence가 없으면 Overview에는 token flow가 current로 표시될 수 있으나 timeline에는 token row가 없다.
- 완료된 Add/Plan/Code flow만 timeline row로 표시된다.
- timeline range summary가 진행 중 flow의 updatedAt fallback 때문에 종료 시각을 앞당겨 표시하지 않는다.
- archive topic의 Done row는 QA pass + archive/version/release outcome이 완료일 때만 표시된다.
