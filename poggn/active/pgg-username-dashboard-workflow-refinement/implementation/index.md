---
pgg:
  topic: "pgg-username-dashboard-workflow-refinement"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 94
  updated_at: "2026-04-27T13:24:00Z"
---

# Implementation Index

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 001 | UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/001_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.diff` | `T5,T6,T7` | project add Stepper, username save action, global user handoff |
| 002 | UPDATE | `apps/dashboard/src/app/DashboardShellChrome.tsx` | `implementation/diffs/002_UPDATE_apps_dashboard_src_app_DashboardShellChrome_tsx.diff` | `T6` | sidebar username card, speed dial version removal |
| 003 | UPDATE | `apps/dashboard/src/features/backlog/InsightsRail.tsx` | `implementation/diffs/003_UPDATE_apps_dashboard_src_features_backlog_InsightsRail_tsx.diff` | `T6` | bottom close button removal |
| 004 | UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | `implementation/diffs/004_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx.diff` | `T3,T4,T7` | workflow token heading, username creator/assignee, timeline token labels |
| 005 | UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | `implementation/diffs/005_UPDATE_apps_dashboard_src_features_history_historyModel_ts.diff` | `T3,T4` | timeline rows from actual flow files and stage-commit evidence |
| 006 | UPDATE | `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx` | `implementation/diffs/006_UPDATE_apps_dashboard_src_features_project_detail_ProjectDetailWorkspace_tsx.diff` | `T1,T3` | global user propagation to workflow views |
| 007 | UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/007_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` | `T7` | ko/en copy for username, token, project add |
| 008 | UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/008_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.diff` | `T1,T3,T5` | global user, token, project init contracts |
| 009 | UPDATE | `apps/dashboard/vite.config.ts` | `implementation/diffs/009_UPDATE_apps_dashboard_vite_config_ts.diff` | `T1,T5` | live API for user settings, project inspect/init |
| 010 | UPDATE | `packages/cli/src/index.ts` | `implementation/diffs/010_UPDATE_packages_cli_src_index_ts.diff` | `T2,T7` | config/settings commands and init username gate |
| 011 | UPDATE | `packages/cli/dist/index.js` | `implementation/diffs/011_UPDATE_packages_cli_dist_index_js.diff` | `T2` | rebuilt CLI output |
| 012 | UPDATE | `packages/cli/dist/index.js.map` | `implementation/diffs/012_UPDATE_packages_cli_dist_index_js_map.diff` | `T2` | rebuilt CLI sourcemap |
| 013 | UPDATE | `packages/core/src/index.ts` | `implementation/diffs/013_UPDATE_packages_core_src_index_ts.diff` | `T1,T3,T5` | global user config, token estimates, dashboard init API |
| 014 | UPDATE | `packages/core/dist/index.d.ts` | `implementation/diffs/014_UPDATE_packages_core_dist_index_d_ts.diff` | `T1,T3,T5` | rebuilt core types |
| 015 | UPDATE | `packages/core/dist/index.js` | `implementation/diffs/015_UPDATE_packages_core_dist_index_js.diff` | `T1,T3,T5` | rebuilt core output |
| 016 | UPDATE | `packages/core/dist/index.js.map` | `implementation/diffs/016_UPDATE_packages_core_dist_index_js_map.diff` | `T1,T3,T5` | rebuilt core sourcemap |
| 017 | CREATE | `packages/core/test/global-username.test.mjs` | `implementation/diffs/017_CREATE_packages_core_test_global_username_test_mjs.diff` | `T1,T8` | global username regression tests |

## Verification

- `pnpm --filter @pgg/core build`: pass
- `pnpm --filter @pgg/cli build`: pass
- `pnpm --filter @pgg/dashboard build`: pass with existing Vite chunk-size warning
- `pnpm test:core`: pass, 53 tests
- `pnpm test:dashboard`: pass, 2 tests
- `pnpm build`: pass with existing Vite chunk-size warning
- manual CLI check: missing username blocks `pgg init`; `pgg config username 홍길동` enables init
- additional request: LLM actual token and local estimated token are separated in the workflow heading, flow cards, and file rows
- additional request: timeline layout is changed from table rows to the `add-img/timeline.png` style vertical rail with stage cards, date column, generated file column, and git commit column
- `pnpm --filter @pgg/core build`: pass after additional token split
- `pnpm --filter @pgg/dashboard build`: pass after timeline reference adjustment, Vite chunk-size warning remains
- `pnpm test:dashboard`: pass after timeline model change
- follow-up request: timeline rail now connects flow nodes with the overview completed color, generated file rows show LLM/Local labels above file names, and token docs require split LLM actual/Local estimated measurement for all project topic snapshots
- `pnpm --filter @pgg/dashboard build`: pass after timeline rail/file label adjustment, Vite chunk-size warning remains
- `pnpm test:dashboard`: pass after timeline rail/file label adjustment

## Additional Diff Records

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 018 | UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | `implementation/diffs/018_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx.additional.diff` | `T3,T4` | split LLM/local token display and vertical timeline reference layout |
| 019 | UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | `implementation/diffs/019_UPDATE_apps_dashboard_src_features_history_historyModel_ts.additional.diff` | `T3,T4` | split token fields and timeline date/time labels |
| 020 | UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/020_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.additional.diff` | `T7` | token split and timeline reference labels |
| 021 | UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/021_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.additional.diff` | `T3` | split token usage contract |
| 022 | UPDATE | `packages/core/src/index.ts` | `implementation/diffs/022_UPDATE_packages_core_src_index_ts.additional.diff` | `T3` | split local estimated and LLM actual token fields |
| 023 | UPDATE | `packages/core/dist/index.d.ts` | `implementation/diffs/023_UPDATE_packages_core_dist_index_d_ts.additional.diff` | `T3` | rebuilt core type output |
| 024 | UPDATE | `packages/core/dist/index.js` | `implementation/diffs/024_UPDATE_packages_core_dist_index_js.additional.diff` | `T3` | rebuilt core output |
| 025 | UPDATE | `packages/core/dist/index.js.map` | `implementation/diffs/025_UPDATE_packages_core_dist_index_js_map.additional.diff` | `T3` | rebuilt core sourcemap |
| 026 | UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | `implementation/diffs/026_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx.additional.diff` | `T3,T4` | timeline rail uses overview completed color and file token chips move above file names |
| 027 | UPDATE | `spec/dashboard/workflow-overview-token.md` | `implementation/diffs/027_UPDATE_spec_dashboard_workflow_overview_token_md.additional.diff` | `T3,T8` | LLM actual and Local estimated token accounting documented for all project snapshots |
| 028 | UPDATE | `spec/dashboard/workflow-git-timeline-reference.md` | `implementation/diffs/028_UPDATE_spec_dashboard_workflow_git_timeline_reference_md.additional.diff` | `T4,T8` | timeline rail/color/file-token placement acceptance criteria documented |
| 029 | UPDATE | `spec/qa/token-and-reference-regression.md` | `implementation/diffs/029_UPDATE_spec_qa_token_and_reference_regression_md.additional.diff` | `T8` | QA regression criteria require split LLM/Local tokens and timeline rail parity |
