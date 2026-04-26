---
pgg:
  topic: "dashboard-workflow-tab-status-release-fix"
  stage: "refactor"
  status: "reviewed"
  skill: "pgg-refactor"
  score: 96
  updated_at: "2026-04-26T06:53:42Z"
  archive_type: "fix"
  project_scope: "current-project"
---

# Implementation Index

## Summary

Workflow tab visual, strict flow completion, pgg stage event recording, dashboard ingestion, and Done release outcome handling were implemented for the approved plan.

## Refactor Summary

Workflow status helpers were consolidated without changing the accepted behavior. Done release outcome now has one `completed | blocked | pending` decision point, and the Workflow tab UI shares progress count/status helper types instead of repeating inline status checks.

## Changes

| Task | Spec | Summary | Evidence |
|---|---|---|---|
| T1 | S3 | `pgg-new-topic.sh` now records proposal `stage-started`, and generated skill/templates document stage start/progress/requirements/completion event rules. | `implementation/diffs/004_UPDATE_pgg_stage_event_contracts.diff` |
| T2 | S2 | Dashboard completion predicates no longer treat `reviewed`, artifact presence, node presence, or `updatedAt` fallback as completion for the current flow. | `implementation/diffs/001_UPDATE_historyModel_strict_flow_completion.diff` |
| T3 | S5 | Workflow status ingestion prioritizes history events and trusted node completion while keeping low-confidence fallback out of completed state. | `implementation/diffs/001_UPDATE_historyModel_strict_flow_completion.diff` |
| T4 | S4 | Done flow completion now requires archive/version plus successful release publish when publish metadata exists; publish/QA failure is separated as blocked. | `implementation/diffs/001_UPDATE_historyModel_strict_flow_completion.diff` |
| T5 | S1 | History tab geometry was simplified so the selected tab masks only its panel-top segment and inactive tabs remain unboxed. | `implementation/diffs/002_UPDATE_HistoryWorkspace_tab_and_blocked_status.diff` |
| T6 | S6 | Build and core tests were run; lint command is unavailable in this workspace. | Verification section |
| REF1 | S2, S4, S5 | Release outcome and workflow UI status helper duplication were reduced after implementation review. | `implementation/diffs/005_UPDATE_workflow_status_refactor_helpers.diff` |
| REF2 | S5 | Dashboard snapshot was regenerated so the local dashboard reflects refactor stage evidence. | `implementation/diffs/006_UPDATE_dashboard_snapshot_refactor.diff` |

## Changed Files

| CRUD | path | diffRef |
|---|---|---|
| UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | `implementation/diffs/001_UPDATE_historyModel_strict_flow_completion.diff` |
| UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | `implementation/diffs/002_UPDATE_HistoryWorkspace_tab_and_blocked_status.diff` |
| UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | `implementation/diffs/005_UPDATE_workflow_status_refactor_helpers.diff` |
| UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | `implementation/diffs/005_UPDATE_workflow_status_refactor_helpers.diff` |
| UPDATE | `apps/dashboard/public/dashboard-data.json` | `implementation/diffs/006_UPDATE_dashboard_snapshot_refactor.diff` |
| UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/003_UPDATE_dashboard_locale_and_flow_status.diff` |
| UPDATE | `apps/dashboard/src/shared/utils/dashboard.tsx` | `implementation/diffs/003_UPDATE_dashboard_locale_and_flow_status.diff` |
| UPDATE | `AGENTS.md` | `implementation/diffs/004_UPDATE_pgg_stage_event_contracts.diff` |
| UPDATE | `.codex/add/WOKR-FLOW.md` | `implementation/diffs/004_UPDATE_pgg_stage_event_contracts.diff` |
| UPDATE | `.codex/add/STATE-CONTRACT.md` | `implementation/diffs/004_UPDATE_pgg_stage_event_contracts.diff` |
| UPDATE | `.codex/sh/pgg-new-topic.sh` | `implementation/diffs/004_UPDATE_pgg_stage_event_contracts.diff` |
| UPDATE | `.codex/skills/pgg-add/SKILL.md` | `implementation/diffs/004_UPDATE_pgg_stage_event_contracts.diff` |
| UPDATE | `.pgg/project.json` | `implementation/diffs/004_UPDATE_pgg_stage_event_contracts.diff` |
| UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/004_UPDATE_pgg_stage_event_contracts.diff` |
| UPDATE | `packages/core/dist/templates.js` | `implementation/diffs/004_UPDATE_pgg_stage_event_contracts.diff` |
| UPDATE | `packages/core/dist/templates.js.map` | `implementation/diffs/004_UPDATE_pgg_stage_event_contracts.diff` |

## Verification

- `pnpm build`: pass
- `pnpm test`: pass, 37 tests
- `git diff --check`: pass
- `./.codex/sh/pgg-gate.sh pgg-refactor dashboard-workflow-tab-status-release-fix`: pass
- `./.codex/sh/pgg-gate.sh pgg-qa dashboard-workflow-tab-status-release-fix`: pass
- `node --check packages/core/dist/templates.js`: pass
- `node packages/cli/dist/index.js dashboard --snapshot-only`: pass
- `pnpm lint`: not available, command `lint` not found
- `node packages/cli/dist/index.js update`: pass after template build; generated pgg-token/qa skill placement verified
- current-project verification contract: `manual verification required`

## Notes

- `stage-completed` without verified/final source remains non-completion evidence.
- Done blocked state is rendered separately from completed when publish metadata reports blocked/failed/not attempted.
- Browser screenshot comparison remains a QA/manual evidence item because no declared current-project verification command exists.
