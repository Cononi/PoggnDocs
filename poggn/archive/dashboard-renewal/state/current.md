# Current State

## Topic

dashboard-renewal

## Current Stage

qa

## Goal

Jira 스타일 프로젝트 목록, MUI CRUD 스타일 프로젝트 상세, active/archive 스크럼 보드형 운영 뷰 구현 결과를 검증하고 archive 가능 여부를 판정한다.

## Confirmed Scope

- 프로젝트 목록은 Jira 스크럼 보드의 컬럼/카드 탐색 감각을 반영한다.
- 프로젝트 상세는 MUI CRUD dashboard 템플릿을 참고한 summary + panel 구조를 사용한다.
- 프로젝트 상세 내부에서 `active`와 `archive`를 각각 별도 스크럼 보드로 관리한다.
- 최근 archive topic 폴더의 반복 구조를 읽어 topic card와 artifact detail 정보 구조를 정의한다.
- React + TypeScript style guide 기준으로 feature/category 책임을 분리한다.
- spec은 `project-list-board`, `project-detail-workspace`, `topic-lifecycle-board`, `artifact-inspector`, `dashboard-topic-artifact-snapshot`, `dashboard-feature-architecture`로 분해한다.
- task는 feature 구조 재편, 목록 보드, 상세 워크스페이스, lifecycle board, inspector, integration 검증으로 나누고 모두 구현 완료했다.
- `packages/core` snapshot에 `archiveType`, `archivedAt`, `artifactSummary`, `artifactCompleteness`가 추가되었다.
- dashboard는 `app / features / shared` 구조로 재편되었고, root `App.tsx`는 composition root export만 남는다.
- 프로젝트 목록은 Jira식 category board, 상세는 summary/workflow/lifecycle/inspector workspace로 재구성되었다.
- `Active Board`는 workflow stage lane, `Archive Board`는 `archive_type` lane으로 분리되었다.
- artifact inspector는 topic card와 workflow node에서 drill-down한 detail을 panel과 dialog로 모두 보여준다.
- `reviews/refactor.review.md`를 추가해 workflow gate가 요구하는 refactor 산출물을 보강했다.
- dashboard/core/cli build, workspace build, snapshot 재생성, QA gate가 모두 통과했다.
- verification contract 미선언 상태는 그대로 유지되어 QA 근거에 `manual verification required`를 기록했다.

## Constraints

- project scope: `current-project`
- archive type: `feat`
- auto mode: `on`
- teams mode: `off`
- verification contract: `manual verification required`

## Open Items

- status: pass

## User Question Record

- ref: `proposal.md` -> `## 3. 사용자 입력 질문 기록`

## Active Specs

- `spec/ui/project-list-board.md`
- `spec/ui/project-detail-workspace.md`
- `spec/ui/topic-lifecycle-board.md`
- `spec/ui/artifact-inspector.md`
- `spec/infra/dashboard-topic-artifact-snapshot.md`
- `spec/infra/dashboard-feature-architecture.md`

## Active Tasks

- T-001 done
- T-002 done
- T-003 done
- T-004 done
- T-005 done
- T-006 done

## Audit Applicability

- `pgg-token`: `not_required` | feature 분해와 UI/snapshot 구현 범위이며 token audit를 열 근거가 없다
- `pgg-performance`: `not_required` | 성능 민감 기능 최적화나 verification contract 변경 범위가 아니다

## QA Report

- ref: `qa/report.md`

## Changed Files

| CRUD | path | diff |
|---|---|---|
| CREATE | `poggn/active/dashboard-renewal/proposal.md` | 없음 |
| CREATE | `poggn/active/dashboard-renewal/plan.md` | 없음 |
| UPDATE | `poggn/active/dashboard-renewal/task.md` | 없음 |
| CREATE | `poggn/active/dashboard-renewal/implementation/index.md` | 없음 |
| CREATE | `poggn/active/dashboard-renewal/spec/ui/project-list-board.md` | 없음 |
| CREATE | `poggn/active/dashboard-renewal/spec/ui/project-detail-workspace.md` | 없음 |
| CREATE | `poggn/active/dashboard-renewal/spec/ui/topic-lifecycle-board.md` | 없음 |
| CREATE | `poggn/active/dashboard-renewal/spec/ui/artifact-inspector.md` | 없음 |
| CREATE | `poggn/active/dashboard-renewal/spec/infra/dashboard-topic-artifact-snapshot.md` | 없음 |
| CREATE | `poggn/active/dashboard-renewal/spec/infra/dashboard-feature-architecture.md` | 없음 |
| CREATE | `poggn/active/dashboard-renewal/reviews/proposal.review.md` | 없음 |
| CREATE | `poggn/active/dashboard-renewal/reviews/plan.review.md` | 없음 |
| CREATE | `poggn/active/dashboard-renewal/reviews/task.review.md` | 없음 |
| CREATE | `poggn/active/dashboard-renewal/reviews/code.review.md` | 없음 |
| CREATE | `poggn/active/dashboard-renewal/reviews/refactor.review.md` | 없음 |
| CREATE | `poggn/active/dashboard-renewal/reviews/qa.review.md` | 없음 |
| CREATE | `poggn/active/dashboard-renewal/qa/report.md` | 없음 |
| CREATE | `poggn/active/dashboard-renewal/qa/review.md` | 없음 |
| UPDATE | `packages/core/src/index.ts` | `implementation/diffs/001_UPDATE_packages_core_src_index_ts.diff` |
| UPDATE | `apps/dashboard/src/App.tsx` | `implementation/diffs/002_UPDATE_apps_dashboard_src_App_tsx.diff` |
| UPDATE | `apps/dashboard/src/main.tsx` | `implementation/diffs/003_UPDATE_apps_dashboard_src_main_tsx.diff` |
| UPDATE | `apps/dashboard/public/dashboard-data.json` | `implementation/diffs/004_UPDATE_apps_dashboard_public_dashboard_data_json.diff` |
| DELETE | `apps/dashboard/src/dashboardLocale.ts` | `implementation/diffs/005_DELETE_apps_dashboard_src_dashboardLocale_ts.diff` |
| DELETE | `apps/dashboard/src/theme.ts` | `implementation/diffs/006_DELETE_apps_dashboard_src_theme_ts.diff` |
| CREATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/007_CREATE_apps_dashboard_src_app_DashboardApp_tsx.diff` |
| CREATE | `apps/dashboard/src/features/project-list/ProjectListBoard.tsx` | `implementation/diffs/008_CREATE_apps_dashboard_src_features_project-list_ProjectListBoard_tsx.diff` |
| CREATE | `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx` | `implementation/diffs/009_CREATE_apps_dashboard_src_features_project-detail_ProjectDetailWorkspace_tsx.diff` |
| CREATE | `apps/dashboard/src/features/topic-board/TopicLifecycleBoard.tsx` | `implementation/diffs/010_CREATE_apps_dashboard_src_features_topic-board_TopicLifecycleBoard_tsx.diff` |
| CREATE | `apps/dashboard/src/features/artifact-inspector/ArtifactInspectorPanel.tsx` | `implementation/diffs/011_CREATE_apps_dashboard_src_features_artifact-inspector_ArtifactInspectorPanel_tsx.diff` |
| CREATE | `apps/dashboard/src/features/artifact-inspector/ArtifactDetailDialog.tsx` | `implementation/diffs/012_CREATE_apps_dashboard_src_features_artifact-inspector_ArtifactDetailDialog_tsx.diff` |
| CREATE | `apps/dashboard/src/shared/api/dashboard.ts` | `implementation/diffs/013_CREATE_apps_dashboard_src_shared_api_dashboard_ts.diff` |
| CREATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/014_CREATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` |
| CREATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/015_CREATE_apps_dashboard_src_shared_model_dashboard_ts.diff` |
| CREATE | `apps/dashboard/src/shared/store/dashboardStore.ts` | `implementation/diffs/016_CREATE_apps_dashboard_src_shared_store_dashboardStore_ts.diff` |
| CREATE | `apps/dashboard/src/shared/theme/dashboardTheme.ts` | `implementation/diffs/017_CREATE_apps_dashboard_src_shared_theme_dashboardTheme_ts.diff` |
| CREATE | `apps/dashboard/src/shared/ui/DiffViewer.tsx` | `implementation/diffs/018_CREATE_apps_dashboard_src_shared_ui_DiffViewer_tsx.diff` |
| CREATE | `apps/dashboard/src/shared/utils/dashboard.tsx` | `implementation/diffs/019_CREATE_apps_dashboard_src_shared_utils_dashboard_tsx.diff` |
| UPDATE | `poggn/active/dashboard-renewal/state/current.md` | 없음 |
| UPDATE | `poggn/active/dashboard-renewal/state/history.ndjson` | 없음 |
| UPDATE | `poggn/active/dashboard-renewal/workflow.reactflow.json` | 없음 |

## Last Expert Score

- phase: qa
- score: 95
- blocking issues: 없음

## Next Action

archive allowed
