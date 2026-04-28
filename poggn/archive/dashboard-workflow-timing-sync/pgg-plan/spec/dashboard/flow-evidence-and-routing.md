---
pgg:
  topic: "dashboard-workflow-timing-sync"
  stage: "plan"
  status: "approved"
  skill: "pgg-plan"
  updated_at: "2026-04-28T14:28:00Z"
reactflow:
  node_id: "spec-dashboard-flow-evidence-and-routing"
  node_type: "spec"
  label: "dashboard flow evidence and routing"
---

# Spec: Dashboard Flow Evidence And Routing

## 목적

dashboard workflow progress가 flow별 evidence를 같은 규칙으로 해석하게 한다.
시작 evidence가 있는 flow는 시작 전으로 표시하면 안 되고, 완료 evidence가 없는 started/progress flow는 current 후보로 유지해야 한다.

## Source Of Truth

- `state/history.ndjson`의 flow event
- `workflow.reactflow.json` node detail timestamp
- topic artifact path
- `state/current.md`의 Current Stage와 Next

## 상태 규칙

- start evidence 없음: `pending`
- `stage-started` 또는 `stage-progress` 있음, trusted completion 없음: `current`
- trusted completion 뒤 unresolved `requirements-added`, `updated`, `revised`: `updating`
- verified/final/gate/qa source의 `stage-completed`, `stage-commit`, archive/later-flow evidence: `completed`
- blocked evidence가 completion보다 최신이면 `stage-blocked`

## 구현 지점

- `apps/dashboard/src/features/history/historyModel.ts`
  - `visibleWorkflowFlows`
  - `flowActiveTimestamp`
  - `runtimeEntryHasUnresolvedTimestamp`
  - `latestUnresolvedFlowIndex`
  - `buildWorkflowSteps`

## 성공 기준

- started plan flow fixture가 `current`로 표시된다.
- completed add flow 뒤 started plan flow가 있을 때 add는 `completed`, plan은 `current`다.
- optional audit required text만으로 `performance` 또는 `token` step이 보이지 않는다.
