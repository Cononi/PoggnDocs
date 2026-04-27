---
pgg:
  topic: "dashboard-mobile-routing"
  stage: "plan"
  status: "approved"
  skill: "pgg-plan"
  score: 94
  updated_at: "2026-04-27T08:48:06Z"
  archive_type: "feat"
  project_scope: "current-project"
---

# Spec: Workflow Stage Blocked

## Purpose

workflow overview에서 실패/차단된 flow를 `stage-blocked` 상태로 모델링하고, lock icon과 danger color로 사용자가 즉시 실패 상태를 인지하게 한다.

## Current Boundary

- `apps/dashboard/src/features/history/historyModel.ts`의 `WorkflowStatus`는 `completed | current | updating | pending | blocked`다.
- `buildWorkflowSteps`는 현재 done/release flow 차단만 `blocked`로 계산한다.
- `HistoryWorkspace.tsx`는 `isBlockedWorkflowStep(step)`로 blocked count, label, color, icon rendering을 처리한다.

## Status Contract

- Add `stage-blocked` to `WorkflowStatus`.
- `stage-blocked` represents a failed or blocked workflow stage, not just final release blocking.
- Existing `blocked` handling may be retained as compatibility, but UI failure rendering must treat both `blocked` and `stage-blocked` as blocked states.

## Detection

A flow should become `stage-blocked` when evidence for that flow includes one of:

- topic or flow status is `blocked`, `failed`, `error`, or `invalid`
- topic `blockingIssues` has a meaningful non-empty value other than none/no/없음/n/a
- matching `state/history.ndjson` event for the flow indicates blocked/failed/error
- matching workflow node status indicates blocked/failed/error

The done/release flow may continue to use release outcome evidence but should normalize to the same visual blocked predicate.

## Rendering

- Blocked failure flow uses MUI lock icon from `@mui/icons-material`.
- Danger tone uses `theme.palette.error.main` and existing error/danger palette conventions.
- Tooltip/status label uses dictionary copy for failed/blocked.
- Progress counts include `stage-blocked` in blocked count.
- Connector line into or out of a blocked step uses danger color.

## Acceptance

- A topic with flow-level blocked evidence displays that flow as `stage-blocked`.
- The blocked flow shows a lock icon and error/danger color in workflow overview.
- Existing archived/completed/pending/current/updating states remain unchanged.
- `stage-blocked` appears in model/status output and is not collapsed to a generic pending state.
