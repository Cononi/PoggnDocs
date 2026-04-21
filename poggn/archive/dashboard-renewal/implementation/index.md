---
pgg:
  topic: "dashboard-renewal"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 95
  updated_at: "2026-04-21T16:09:30Z"
reactflow:
  node_id: "implementation-index"
  node_type: "doc"
  label: "implementation/index.md"
state:
  summary: "dashboard 리뉴얼 구현 diff와 feature 분해 결과를 기록한다."
  next: "pgg-qa"
---

# Implementation Index

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 001 | UPDATE | `packages/core/src/index.ts` | `implementation/diffs/001_UPDATE_packages_core_src_index_ts.diff` | `T-004,T-005,T-006` | topic snapshot에 `archiveType`, `archivedAt`, `artifactSummary`, `artifactCompleteness`를 추가 |
| 002 | UPDATE | `apps/dashboard/src/App.tsx` | `implementation/diffs/002_UPDATE_apps_dashboard_src_App_tsx.diff` | `T-001` | root `App.tsx`를 composition root export만 남기도록 축소 |
| 003 | UPDATE | `apps/dashboard/src/main.tsx` | `implementation/diffs/003_UPDATE_apps_dashboard_src_main_tsx.diff` | `T-001` | shared theme 경로로 provider 구성을 연결 |
| 004 | UPDATE | `apps/dashboard/public/dashboard-data.json` | `implementation/diffs/004_UPDATE_apps_dashboard_public_dashboard_data_json.diff` | `T-005,T-006` | 새 topic projection과 artifact summary가 반영된 snapshot으로 재생성 |
| 005 | DELETE | `apps/dashboard/src/dashboardLocale.ts` | `implementation/diffs/005_DELETE_apps_dashboard_src_dashboardLocale_ts.diff` | `T-001` | legacy root locale 파일 제거 |
| 006 | DELETE | `apps/dashboard/src/theme.ts` | `implementation/diffs/006_DELETE_apps_dashboard_src_theme_ts.diff` | `T-001` | legacy root theme 파일 제거 |
| 007 | CREATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/007_CREATE_apps_dashboard_src_app_DashboardApp_tsx.diff` | `T-001,T-006` | query, mutation, selection orchestration, dialogs를 app layer로 이동 |
| 008 | CREATE | `apps/dashboard/src/features/project-list/ProjectListBoard.tsx` | `implementation/diffs/008_CREATE_apps_dashboard_src_features_project-list_ProjectListBoard_tsx.diff` | `T-002` | Jira식 category column과 project card board 구현 |
| 009 | CREATE | `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx` | `implementation/diffs/009_CREATE_apps_dashboard_src_features_project-detail_ProjectDetailWorkspace_tsx.diff` | `T-003` | MUI workspace summary, meta, workflow, boards, inspector 조합 |
| 010 | CREATE | `apps/dashboard/src/features/topic-board/TopicLifecycleBoard.tsx` | `implementation/diffs/010_CREATE_apps_dashboard_src_features_topic-board_TopicLifecycleBoard_tsx.diff` | `T-004` | active/archive lifecycle board lane 규칙과 topic card 구현 |
| 011 | CREATE | `apps/dashboard/src/features/artifact-inspector/ArtifactInspectorPanel.tsx` | `implementation/diffs/011_CREATE_apps_dashboard_src_features_artifact-inspector_ArtifactInspectorPanel_tsx.diff` | `T-005` | artifact group summary와 inspector preview panel 구현 |
| 012 | CREATE | `apps/dashboard/src/features/artifact-inspector/ArtifactDetailDialog.tsx` | `implementation/diffs/012_CREATE_apps_dashboard_src_features_artifact-inspector_ArtifactDetailDialog_tsx.diff` | `T-005` | full artifact viewer dialog 구현 |
| 013 | CREATE | `apps/dashboard/src/shared/api/dashboard.ts` | `implementation/diffs/013_CREATE_apps_dashboard_src_shared_api_dashboard_ts.diff` | `T-001,T-006` | snapshot fetch/live request helper 분리 |
| 014 | CREATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/014_CREATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` | `T-001,T-006` | board/workspace/inspector용 locale key 분리 |
| 015 | CREATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/015_CREATE_apps_dashboard_src_shared_model_dashboard_ts.diff` | `T-001,T-004,T-005` | dashboard domain shape와 artifact selection 타입 정의 |
| 016 | CREATE | `apps/dashboard/src/shared/store/dashboardStore.ts` | `implementation/diffs/016_CREATE_apps_dashboard_src_shared_store_dashboardStore_ts.diff` | `T-001` | selection/filter store 분리 |
| 017 | CREATE | `apps/dashboard/src/shared/theme/dashboardTheme.ts` | `implementation/diffs/017_CREATE_apps_dashboard_src_shared_theme_dashboardTheme_ts.diff` | `T-001` | shared theme 토큰 이동 |
| 018 | CREATE | `apps/dashboard/src/shared/ui/DiffViewer.tsx` | `implementation/diffs/018_CREATE_apps_dashboard_src_shared_ui_DiffViewer_tsx.diff` | `T-005` | diff renderer 공통 UI 분리 |
| 019 | CREATE | `apps/dashboard/src/shared/utils/dashboard.tsx` | `implementation/diffs/019_CREATE_apps_dashboard_src_shared_utils_dashboard_tsx.diff` | `T-001,T-004,T-005,T-006` | lane mapping, artifact entry 생성, optimistic move, workflow model helper 분리 |

## Notes

- verification contract는 여전히 선언되지 않았으므로 구현 검증은 workspace build와 snapshot 재생성 수준으로만 기록했다.
- dashboard production bundle은 여전히 500kB chunk warning을 남기므로 QA에서 residual risk로 이어서 확인한다.
