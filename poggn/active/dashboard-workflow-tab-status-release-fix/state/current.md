# Current State

## Topic

dashboard-workflow-tab-status-release-fix

## Current Stage

implementation

## Goal

Workflow 탭을 `add-img/9.png` 기준으로 맞추고, 모든 pgg flow step이 `시작 전`, `진행 중`, `추가 진행`, `완료` evidence에 따라 바뀌는지 dashboard와 pgg 기록 절차를 함께 검증한다. 모든 flow는 해당 stage가 완벽하게 끝난 뒤에만 완료로 처리되어야 하며, 중간 산출물이나 `reviewed`/`updatedAt`만으로 완료 처리하면 안 된다.

## Document Refs

- proposal: `poggn/active/dashboard-workflow-tab-status-release-fix/proposal.md`
- proposal review: `poggn/active/dashboard-workflow-tab-status-release-fix/reviews/proposal.review.md`
- plan: `poggn/active/dashboard-workflow-tab-status-release-fix/plan.md`
- task: `poggn/active/dashboard-workflow-tab-status-release-fix/task.md`
- plan review: `poggn/active/dashboard-workflow-tab-status-release-fix/reviews/plan.review.md`
- task review: `poggn/active/dashboard-workflow-tab-status-release-fix/reviews/task.review.md`
- implementation index: `poggn/active/dashboard-workflow-tab-status-release-fix/implementation/index.md`
- code review: `poggn/active/dashboard-workflow-tab-status-release-fix/reviews/code.review.md`
- spec:
  - `poggn/active/dashboard-workflow-tab-status-release-fix/spec/ui/workflow-tab-reference.md`
  - `poggn/active/dashboard-workflow-tab-status-release-fix/spec/model/strict-flow-completion.md`
  - `poggn/active/dashboard-workflow-tab-status-release-fix/spec/telemetry/pgg-stage-event-recording.md`
  - `poggn/active/dashboard-workflow-tab-status-release-fix/spec/release/done-release-outcome.md`
  - `poggn/active/dashboard-workflow-tab-status-release-fix/spec/model/dashboard-status-ingestion.md`
  - `poggn/active/dashboard-workflow-tab-status-release-fix/spec/qa/workflow-tab-status-acceptance.md`
- workflow: `poggn/active/dashboard-workflow-tab-status-release-fix/workflow.reactflow.json`
- dirty baseline: `poggn/active/dashboard-workflow-tab-status-release-fix/state/dirty-worktree-baseline.txt`
- visual reference: `add-img/9.png`

## Constraints

- project scope: `current-project`
- archive type: `fix`
- version bump: `patch`
- target version: `2.2.4`
- short name: `dashboard-fix`
- working branch: `ai/fix/2.2.4-dashboard-fix`
- release branch: `release/2.2.4-dashboard-fix`

## Decisions

- `add-img/9.png` is the visual acceptance reference for Workflow tab shape.
- Selected tab must have top/side border connected to the content panel and no selected bottom line/underline.
- Inactive tabs should remain unboxed.
- Flow status remains the shared four-state contract: `시작 전`, `진행 중`, `추가 진행`, `완료`.
- A `pgg-xx` stage start must create stage evidence that lets dashboard show that flow as `진행 중`.
- Added user requirements must create `requirements-added` before stage work so dashboard can show `추가 진행`.
- Completion must not be inferred too early from artifact presence or `reviewed` status alone.
- Every flow can become completed only after its full stage completion contract is satisfied.
- Partial artifacts, draft/reviewed frontmatter, workflow node existence, and updatedAt fallback are progress evidence, not completion evidence.
- Done is a release outcome flow. It is completed only after final QA pass plus archive/version/release evidence.
- QA fail, release blocked, and publish blocked must not display as Done completed.
- The follow-up must diagnose both dashboard status calculation and pgg event recording procedure.
- Spec boundary is fixed as tab visual, strict completion, pgg stage event recording, Done release outcome, dashboard status ingestion, and QA acceptance.
- Task order is T1 event recording, T2 strict completion, T3 ingestion priority, T4 Done outcome, T5 tab visual, T6 QA evidence.
- Implementation tightened dashboard completion predicates so current flow completion is not inferred from `reviewed`, artifact presence, workflow node existence, or `updatedAt` fallback.
- Done flow completed now requires archive/version evidence and successful publish metadata when publish metadata exists.
- Done publish blocked/failed/not attempted metadata is shown as `실패/차단` rather than `완료`.
- `pgg-new-topic.sh` and generated templates now preserve proposal `stage-started` and stage event recording guidance.
- History tabs now use panel top border plus selected-tab mask instead of fragile split-line geometry.

## User Question Record

- `워크플로우의 탭에서 디자인이 9.png와 같아야하나 전혀 다릅니다.`
- `워크플로우의 플로우 스탭마다 시작 전, 진행 중, 추가 사항, 완료 같은 상태로 바뀌어야 하는데 그러지 않습니다.`
- `워크플로우의 스탭이 대시보드의 문제인지, 남기는 절차가 문제인지 확인 필요 합니다.`
- `워크플로의 스탭은 pgg-xx가 실행될때 진행 중으로 바뀌어야 합니다.`
- `Done만이 release 처리되어 최종 QA가 모두 통과되서 완료되거나 release 처리하지 못하는 상태나 qa실패로인한 실패 바께 없습니다.`
- `추가 사항이 있습니다. 모든 플로우는 그 단계가 완벽하게 끝나야만 완료로 처리되야 합니다. 지금은 중간에 완료 처리가 되네요`

## Audit Applicability

- `pgg-token`: `not_required` | handoff token 최적화가 아니라 dashboard tab/status와 pgg evidence contract 정합이 핵심이다.
- `pgg-performance`: `not_required` | UI geometry와 상태 evidence 계산/기록 수정이며 별도 성능 계측이 필요한 데이터 규모 변경은 없다.

## Git Publish Message

- title: fix: 2.2.4.워크플로우 상태 표시
- why: Workflow 탭이 add-img/9.png와 다르게 보이고 pgg stage 시작/추가/완료 evidence가 dashboard 상태로 안정적으로 반영되지 않아, 탭 visual과 flow status 기록/계산 및 Done release outcome 표시를 함께 바로잡아야 한다.
- footer: Refs: dashboard-workflow-tab-status-release-fix

## Changed Files

| CRUD | path | diffRef |
|---|---|---|
| CREATE | `poggn/active/dashboard-workflow-tab-status-release-fix/proposal.md` | |
| CREATE | `poggn/active/dashboard-workflow-tab-status-release-fix/reviews/proposal.review.md` | |
| CREATE | `poggn/active/dashboard-workflow-tab-status-release-fix/state/current.md` | |
| CREATE | `poggn/active/dashboard-workflow-tab-status-release-fix/state/history.ndjson` | |
| CREATE | `poggn/active/dashboard-workflow-tab-status-release-fix/state/dirty-worktree-baseline.txt` | |
| CREATE | `poggn/active/dashboard-workflow-tab-status-release-fix/workflow.reactflow.json` | |
| CREATE | `poggn/active/dashboard-workflow-tab-status-release-fix/plan.md` | |
| CREATE | `poggn/active/dashboard-workflow-tab-status-release-fix/task.md` | |
| CREATE | `poggn/active/dashboard-workflow-tab-status-release-fix/spec/ui/workflow-tab-reference.md` | |
| CREATE | `poggn/active/dashboard-workflow-tab-status-release-fix/spec/model/strict-flow-completion.md` | |
| CREATE | `poggn/active/dashboard-workflow-tab-status-release-fix/spec/telemetry/pgg-stage-event-recording.md` | |
| CREATE | `poggn/active/dashboard-workflow-tab-status-release-fix/spec/release/done-release-outcome.md` | |
| CREATE | `poggn/active/dashboard-workflow-tab-status-release-fix/spec/model/dashboard-status-ingestion.md` | |
| CREATE | `poggn/active/dashboard-workflow-tab-status-release-fix/spec/qa/workflow-tab-status-acceptance.md` | |
| CREATE | `poggn/active/dashboard-workflow-tab-status-release-fix/reviews/plan.review.md` | |
| CREATE | `poggn/active/dashboard-workflow-tab-status-release-fix/reviews/task.review.md` | |
| UPDATE | `poggn/active/dashboard-workflow-tab-status-release-fix/proposal.md` | |
| CREATE | `poggn/active/dashboard-workflow-tab-status-release-fix/implementation/index.md` | |
| CREATE | `poggn/active/dashboard-workflow-tab-status-release-fix/implementation/diffs/001_UPDATE_historyModel_strict_flow_completion.diff` | |
| CREATE | `poggn/active/dashboard-workflow-tab-status-release-fix/implementation/diffs/002_UPDATE_HistoryWorkspace_tab_and_blocked_status.diff` | |
| CREATE | `poggn/active/dashboard-workflow-tab-status-release-fix/implementation/diffs/003_UPDATE_dashboard_locale_and_flow_status.diff` | |
| CREATE | `poggn/active/dashboard-workflow-tab-status-release-fix/implementation/diffs/004_UPDATE_pgg_stage_event_contracts.diff` | |
| CREATE | `poggn/active/dashboard-workflow-tab-status-release-fix/reviews/code.review.md` | |
| UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | `poggn/active/dashboard-workflow-tab-status-release-fix/implementation/diffs/001_UPDATE_historyModel_strict_flow_completion.diff` |
| UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | `poggn/active/dashboard-workflow-tab-status-release-fix/implementation/diffs/002_UPDATE_HistoryWorkspace_tab_and_blocked_status.diff` |
| UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `poggn/active/dashboard-workflow-tab-status-release-fix/implementation/diffs/003_UPDATE_dashboard_locale_and_flow_status.diff` |
| UPDATE | `apps/dashboard/src/shared/utils/dashboard.tsx` | `poggn/active/dashboard-workflow-tab-status-release-fix/implementation/diffs/003_UPDATE_dashboard_locale_and_flow_status.diff` |
| UPDATE | `AGENTS.md` | `poggn/active/dashboard-workflow-tab-status-release-fix/implementation/diffs/004_UPDATE_pgg_stage_event_contracts.diff` |
| UPDATE | `.codex/add/WOKR-FLOW.md` | `poggn/active/dashboard-workflow-tab-status-release-fix/implementation/diffs/004_UPDATE_pgg_stage_event_contracts.diff` |
| UPDATE | `.codex/add/STATE-CONTRACT.md` | `poggn/active/dashboard-workflow-tab-status-release-fix/implementation/diffs/004_UPDATE_pgg_stage_event_contracts.diff` |
| UPDATE | `.codex/sh/pgg-new-topic.sh` | `poggn/active/dashboard-workflow-tab-status-release-fix/implementation/diffs/004_UPDATE_pgg_stage_event_contracts.diff` |
| UPDATE | `.codex/skills/pgg-add/SKILL.md` | `poggn/active/dashboard-workflow-tab-status-release-fix/implementation/diffs/004_UPDATE_pgg_stage_event_contracts.diff` |
| UPDATE | `.pgg/project.json` | `poggn/active/dashboard-workflow-tab-status-release-fix/implementation/diffs/004_UPDATE_pgg_stage_event_contracts.diff` |
| UPDATE | `packages/core/src/templates.ts` | `poggn/active/dashboard-workflow-tab-status-release-fix/implementation/diffs/004_UPDATE_pgg_stage_event_contracts.diff` |
| UPDATE | `packages/core/dist/templates.js` | `poggn/active/dashboard-workflow-tab-status-release-fix/implementation/diffs/004_UPDATE_pgg_stage_event_contracts.diff` |
| UPDATE | `packages/core/dist/templates.js.map` | `poggn/active/dashboard-workflow-tab-status-release-fix/implementation/diffs/004_UPDATE_pgg_stage_event_contracts.diff` |

## Last Expert Score

- phase: implementation
- score: 95
- blocking issues: none

## Open Items

- status: ready_for_refactor

## Verification

- current-project verification contract: `manual verification required`
- proposal document review: pass
- plan document review: pass
- task document review: pass
- pgg-code implementation review: pass
- `pnpm build`: pass
- `pnpm test`: pass
- `pnpm lint`: not available, command `lint` not found
