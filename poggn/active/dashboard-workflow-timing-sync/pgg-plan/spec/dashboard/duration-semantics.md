---
pgg:
  topic: "dashboard-workflow-timing-sync"
  stage: "plan"
  status: "approved"
  skill: "pgg-plan"
  updated_at: "2026-04-28T14:28:00Z"
reactflow:
  node_id: "spec-dashboard-duration-semantics"
  node_type: "spec"
  label: "dashboard duration semantics"
---

# Spec: Dashboard Duration Semantics

## 목적

timeline duration이 source label이 아니라 flow start와 completion 사이의 elapsed interval을 표시하게 한다.

## 현재 문제

`buildTimelineRows`는 `duration: completedAt.source ?? "recorded"`를 사용한다.
이 값은 `state/history.ndjson:stage-completed` 같은 evidence source이며 사용자가 기대하는 시간 측정 값이 아니다.

## Duration 규칙

- start와 end timestamp가 모두 유효하면 end - start를 표시한다.
- 60초 미만은 1분으로 올림 처리한다.
- 60분 미만은 분 단위로 표시한다.
- 24시간 미만은 시간+분으로 표시한다.
- 24시간 이상은 일+시간으로 표시한다.
- start/end가 없거나 invalid이면 unavailable fallback을 표시한다.
- end가 start보다 빠르면 unavailable fallback을 표시한다.
- 완료되지 않은 flow는 completed timeline row에 포함하지 않는 기존 계약을 유지한다.

## 구현 지점

- `apps/dashboard/src/features/history/historyModel.ts`
  - 새 helper `formatWorkflowDuration`
  - `buildTimelineRows`
- `apps/dashboard/src/shared/locale/dashboardLocale.ts`
  - `workflowDurationUnavailable`

## 성공 기준

- 7분 fixture가 `7m` 또는 `7분`으로 표시된다.
- duration이 `state/history.ndjson:*`, `recorded`, `release`를 포함하지 않는다.
