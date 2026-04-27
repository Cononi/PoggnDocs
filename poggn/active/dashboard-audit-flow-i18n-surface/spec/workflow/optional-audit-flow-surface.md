---
pgg:
  topic: "dashboard-audit-flow-i18n-surface"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-27T04:43:54Z"
  archive_type: "feat"
  project_scope: "current-project"
reactflow:
  node_id: "spec-workflow-optional-audit-flow"
  node_type: "spec"
  label: "spec/workflow/optional-audit-flow-surface.md"
state:
  summary: "token/performance optional audit flow 표시 계약"
---

# Spec: Optional Audit Flow Surface

## Problem

dashboard workflow model은 `performance` optional flow만 정의하고 `token` flow를 직접 표시하지 않는다. 또한 optional audit가 history event나 workflow node로 실행됐더라도 file artifact가 없으면 flow visibility가 누락될 수 있다.

## Requirements

1. `WorkflowFlowId`는 `token`을 포함해야 한다.
2. workflow definition은 `pgg-token` command와 `token` path pattern을 가진 optional flow를 포함해야 한다.
3. `performance` optional flow는 기존 path evidence뿐 아니라 history event와 workflow node evidence도 실행 증거로 인정해야 한다.
4. `normalizeFlowId`는 `token`, `pgg-token`, `performance`, `pgg-performance` stage/flow 값을 각각 동일 flow로 정규화해야 한다.
5. optional audit flow는 실행 evidence가 없으면 숨겨져야 한다.
6. optional audit flow가 실행된 경우 core workflow status model과 같은 기준으로 `current`, `updating`, `completed`, `pending`, `blocked`를 계산해야 한다.

## Acceptance Criteria

- `token/report.md`가 있는 topic은 workflow steps에 `token` flow를 포함한다.
- `reviews/token.review.md`가 있는 topic은 workflow steps에 `token` flow를 포함한다.
- `state/history.ndjson`에 `stage:"token"` 또는 `stage:"pgg-token"` evidence가 있는 topic은 workflow steps에 `token` flow를 포함한다.
- `workflow.reactflow.json` node의 `data.stage`가 `token` 또는 `pgg-token`이면 workflow steps에 `token` flow를 포함한다.
- token/performance evidence가 없는 topic은 기존 core workflow만 표시한다.

## Non-goals

- optional audit를 mandatory workflow stage로 승격하지 않는다.
- pgg audit 실행 명령 자체를 변경하지 않는다.
