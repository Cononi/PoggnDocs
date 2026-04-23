# Current State

## Topic

dashboard-workspace-refinement

## Current Stage

implementation

## Goal

dashboard workspace refinement 구현을 완료하고 diff, review, verification 기록을 남겨 다음 refactor 단계로 넘긴다.

## Confirmed Scope

- project list는 Jira-style kanban lane rhythm과 compact card density로 재정의한다.
- project card는 별도 open button 없이 카드 전체 클릭으로 detail workspace에 진입한다.
- project info에서 `dashboard port`는 제거하고 `POGGN version`과 `project version`을 분리한다.
- workflow topic은 좌측 sidebar에서 선택하고 `Timeline`/`Flow` 전환은 MUI Tabs로 제공한다.
- 초기 질문 기록은 workflow summary card 내부의 작은 글씨/caption tone으로 옮긴다.
- workflow/timeline은 add, plan, code, refactor, qa 산출물과 current task/file 진행 상태를 같은 source로 보여 준다.
- 현재 진행중 task/file은 animation-enabled highlight로 강조하되 reduced-motion fallback을 둔다.
- files는 `add-img/3.png` 느낌의 folder tree explorer로 전환한다.
- report는 dense table-first surface로 바꾸고 history는 topic selection 없는 compact card + modal detail로 정리한다.

## Constraints

- project scope: `current-project`
- archive type: `feat`
- version bump: `minor`
- target version: `0.13.0`
- short name: `dashboard-workspace-refinement`
- working branch: `ai/feat/0.13.0-dashboard-workspace-refinement`
- release branch: `release/0.13.0-dashboard-workspace-refinement`
- auto mode: `on`
- teams mode: `off`
- git mode: `on`
- latest archive baseline: `dashboard-project-workspace-redesign` (`0.12.0`, archived at `2026-04-23T07:35:31Z`)
- current project version source candidate: `package.json` / `apps/dashboard/package.json` (`0.1.0`)
- verification contract: `manual verification required`

## Open Items

- status: ready for `pgg-refactor`
- blocking issues: 없음
- note: `pgg-performance` audit는 `required`이며 report lag 개선 여부를 후속 audit에서 검증해야 한다
- note: current-project verification contract가 없어 수동 검증은 아직 남아 있다
- note: Vite production build는 chunk size warning을 남긴다

## User Question Record

- ref: `proposal.md` -> `## 3. 사용자 입력 질문 기록`

## Audit Applicability

- [pgg-token]: [not_required] | token handoff 구조 변경이 아니다
- [pgg-performance]: [required] | report lag가 명시 요구사항이며 table/lazy modal 구조 검증이 필요하다

## Active Specs

- `spec/ui/project-board-and-project-info-refinement.md`
- `spec/ui/workflow-topic-navigation-and-tabbed-views.md`
- `spec/ui/workflow-progress-highlighting-and-artifacts.md`
- `spec/ui/file-tree-navigation-and-folder-layout.md`
- `spec/ui/report-table-and-history-modal-summary.md`

## Active Tasks

- T1 completed
- T2 completed
- T3 completed
- T4 completed
- T5 completed
- T6 completed
- T7 completed

## Plan

- ref: `plan.md`

## Task

- ref: `task.md`

## Reviews

- ref: `reviews/proposal.review.md`
- ref: `reviews/plan.review.md`
- ref: `reviews/task.review.md`
- ref: `reviews/code.review.md`

## Implementation

- ref: `implementation/index.md`

## Changed Files

| CRUD | path | diff |
|---|---|---|
| UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/001_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.diff` |
| UPDATE | `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx` | `implementation/diffs/002_UPDATE_apps_dashboard_src_features_project-detail_ProjectDetailWorkspace_tsx.diff` |
| UPDATE | `apps/dashboard/src/features/project-list/ProjectListBoard.tsx` | `implementation/diffs/003_UPDATE_apps_dashboard_src_features_project-list_ProjectListBoard_tsx.diff` |
| UPDATE | `apps/dashboard/src/features/project-list/projectBoard.ts` | `implementation/diffs/004_UPDATE_apps_dashboard_src_features_project-list_projectBoard_ts.diff` |
| UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/005_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` |
| UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/006_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.diff` |
| UPDATE | `apps/dashboard/src/shared/utils/dashboard.tsx` | `implementation/diffs/007_UPDATE_apps_dashboard_src_shared_utils_dashboard_tsx.diff` |
| UPDATE | `packages/core/src/index.ts` | `implementation/diffs/008_UPDATE_packages_core_src_index_ts.diff` |
| CREATE | `poggn/active/dashboard-workspace-refinement/implementation/index.md` | 없음 |
| CREATE | `poggn/active/dashboard-workspace-refinement/reviews/code.review.md` | 없음 |
| UPDATE | `poggn/active/dashboard-workspace-refinement/state/current.md` | 없음 |
| UPDATE | `poggn/active/dashboard-workspace-refinement/state/history.ndjson` | 없음 |

## Verification

- `pnpm --filter @pgg/dashboard build` | pass
- current-project verification contract가 없으므로 `manual verification required`
- `pgg-performance` applicability는 `required`로 기록했고 후속 audit에서 report lag 개선 여부를 확인해야 한다
- Vite bundle chunk size warning이 남아 있다

## Last Expert Score

- phase: implementation
- score: 95
- blocking issues: 없음

## Git Publish Message

- title: feat: dashboard workspace refinement
- why: jira-style board, workflow topic navigation, folder tree, report and history summary reading contract를 후속 refinement로 정리한다
- footer: Refs: dashboard-workspace-refinement

## Next Action

`pgg-refactor`
