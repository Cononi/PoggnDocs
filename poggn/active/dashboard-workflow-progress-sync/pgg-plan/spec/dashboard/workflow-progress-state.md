# Spec: Dashboard Workflow Progress State

## Purpose

Make the dashboard workflow progress component derive status from explicit evidence, not only from stage ordering.

## Status Rules

- `pending`: no start, progress, completion, blocked, or revision evidence for the flow.
- `current`: latest unresolved evidence for the flow is `stage-started` or `stage-progress`.
- `updating`: completion evidence exists, then a later unresolved `requirements-added`, `updated`, or `revised` event exists for that flow.
- `completed`: trusted completion evidence exists and no later unresolved revision exists.
- `stage-blocked`: latest blocking evidence for the flow is newer than completion evidence.

## Trusted Completion Evidence

- `stage-commit`
- `version-recorded`
- `archived`
- `stage-completed` with `source` containing `verified`, `final`, `gate`, `qa`, `검증`, or `최종`
- workflow node with `completedAt` and trusted done/pass/final/verified status
- archive bucket completion for non-Done flows
- Done flow release completion

## Not Completion Evidence

- `stage-started`
- `stage-progress`
- file presence alone
- flow index lower than current stage
- `Audit Applicability` required text

## Optional Audit Visibility

`pgg-token` and `pgg-performance` are visible only when there is actual execution evidence:

- stage history event for that audit
- meaningful `token/report.md`, `pgg-performance/report.md`, or `performance/report.md`
- workflow node with started/progress/completed audit evidence

## UI Contract

The overview and topic detail must use the same `TopicSummary.historyEvents` and `buildWorkflowSteps` semantics.
Labels remain localized through `dashboardLocale.ts`.
