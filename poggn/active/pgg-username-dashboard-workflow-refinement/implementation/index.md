---
pgg:
  topic: "pgg-username-dashboard-workflow-refinement"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 94
  updated_at: "2026-04-27T14:47:32Z"
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
- follow-up request: timeline check circles no longer show the rail through the circle, and timeline rows are sorted newest first
- `pnpm --filter @pgg/dashboard build`: pass after descending timeline order and rail cutout adjustment, Vite chunk-size warning remains
- `pnpm test:dashboard`: pass after descending timeline order and rail cutout adjustment
- follow-up request: completed check node uses overview styling instead of black fill, timeline header filter/show more/collapse buttons are removed, and right file tree folders expand/collapse on folder row click
- `pnpm --filter @pgg/dashboard build`: pass after timeline control and file tree interaction adjustment, Vite chunk-size warning remains
- `pnpm test:dashboard`: pass after timeline control and file tree interaction adjustment
- follow-up request: timeline file action now switches the right file tree to selected flow files, initial tree shows all topic files, reset appears beside search after filtering, and unused table/list buttons are removed
- `pnpm --filter @pgg/dashboard build`: pass after flow file tree selection, Vite chunk-size warning remains
- `pnpm test:dashboard`: pass after flow file tree selection
- follow-up request: timeline generated file list is capped at 3 rows, right file tree rows include LLM/Local token chips, and timeline rail endpoints align to the completed circle outer ring
- `pnpm --filter @pgg/dashboard build`: pass after file tree token chips and timeline list cap, Vite chunk-size warning remains
- `pnpm test:dashboard`: pass after file tree token chips and timeline list cap
- follow-up request: timeline rail is a single continuous overview-style rail, generated file click opens a file content modal with LLM/Local tokens, and right file tree token chips are removed
- `pnpm --filter @pgg/core build`: pass after file content snapshot contract
- `pnpm --filter @pgg/dashboard build`: pass after file content modal and rail adjustment, Vite chunk-size warning remains
- `pnpm test:dashboard`: pass after file content modal and rail adjustment
- follow-up request: timeline rows now follow actual pgg workflow order, displayed time uses flow completion evidence, file preview modal opens from the right file tree, and generated file rows no longer open preview
- `pnpm --filter @pgg/dashboard build`: pass after timeline order/time and file tree preview adjustment, Vite chunk-size warning remains
- `pnpm test:dashboard`: pass after timeline order/time and file tree preview adjustment
- follow-up request: timeline rows now use reverse actual workflow order, completed check colors vary by flow tone, generated file rows hide file-level LLM/Local chips, and flow total LLM/Local remains in the flow header
- `pnpm --filter @pgg/dashboard build`: pass after reverse order and flow-tone checks, Vite chunk-size warning remains
- `pnpm test:dashboard`: pass after reverse order and flow-tone checks
- follow-up request: timeline rail and completed check use blue fill, rail does not show behind/after terminal checks, commit rows are capped at 3, and all commits open in a modal
- `pnpm --filter @pgg/dashboard build`: pass after blue rail/check and commit modal, Vite chunk-size warning remains
- `pnpm test:dashboard`: pass after blue rail/check and commit modal
- `pnpm --filter @pgg/dashboard build`: pass after vertical Stepper overview-completed connector adjustment, Vite chunk-size warning remains
- `pnpm test:dashboard`: pass after vertical Stepper overview-completed connector adjustment
- `pnpm --filter @pgg/core build`: pass after project files and highlighted preview adjustment
- `pnpm --filter @pgg/dashboard build`: pass after project files and highlighted preview adjustment, Vite chunk-size warning remains
- `pnpm test:dashboard`: pass after project files and highlighted preview adjustment
- `pnpm test:core`: pass after project files and highlighted preview adjustment, 53 tests
- `pnpm --filter @pgg/dashboard build`: pass after timeline reference CSS restore, Vite chunk-size warning remains
- `pnpm test:dashboard`: pass after timeline reference CSS restore
- `./.codex/sh/pgg-gate.sh pgg-refactor pgg-username-dashboard-workflow-refinement`: pass

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
| 030 | UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx`, `apps/dashboard/src/features/history/historyModel.ts` | `implementation/diffs/030_UPDATE_apps_dashboard_src_features_history_timeline_order_and_rail.diff` | `T4` | prevent rail from visually crossing check circles and sort timeline newest first |
| 031 | UPDATE | `spec/dashboard/workflow-git-timeline-reference.md` | `implementation/diffs/031_UPDATE_spec_dashboard_workflow_git_timeline_reference_md.order.diff` | `T4,T8` | document newest-first order and rail/check separation criteria |
| 032 | UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | `implementation/diffs/032_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx.timeline_controls.diff` | `T4` | restore overview-style completed check, remove timeline header action buttons, and add clickable folder tree expansion |
| 033 | UPDATE | `spec/dashboard/workflow-git-timeline-reference.md` | `implementation/diffs/033_UPDATE_spec_dashboard_workflow_git_timeline_reference_md.controls.diff` | `T4,T8` | document overview-style completed check and right file tree click expansion criteria |
| 034 | UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | `implementation/diffs/034_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx.flow_file_tree.diff` | `T4` | timeline file action drives right file tree scope and reset clears flow/search filters |
| 035 | UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/035_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.flow_file_tree.diff` | `T7` | i18n labels for flow-scoped file tree and reset action |
| 036 | UPDATE | `spec/dashboard/workflow-git-timeline-reference.md` | `implementation/diffs/036_UPDATE_spec_dashboard_workflow_git_timeline_reference_md.flow_file_tree.diff` | `T4,T8` | document flow file tree scope, initial all files state, and reset button behavior |
| 037 | UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | `implementation/diffs/037_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx.file_token_tree.diff` | `T4` | cap timeline generated file rows at 3, add LLM/Local token chips to right file tree rows, and align rail endpoints to circle ring |
| 038 | UPDATE | `spec/dashboard/workflow-git-timeline-reference.md` | `implementation/diffs/038_UPDATE_spec_dashboard_workflow_git_timeline_reference_md.file_token_tree.diff` | `T4,T8` | document timeline file cap, file tree token chips, and rail endpoint criteria |
| 039 | UPDATE | `packages/core/src/index.ts`, `apps/dashboard/src/shared/model/dashboard.ts`, `apps/dashboard/src/features/history/historyModel.ts` | `implementation/diffs/039_UPDATE_core_dashboard_file_content_contract.diff` | `T4,T8` | include text file content in topic file snapshots for timeline preview modal |
| 040 | UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | `implementation/diffs/040_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx.file_modal_rail.diff` | `T4` | switch timeline to a single continuous rail, add generated file content modal, and remove token chips from right file tree |
| 041 | UPDATE | `spec/dashboard/workflow-git-timeline-reference.md` | `implementation/diffs/041_UPDATE_spec_dashboard_workflow_git_timeline_reference_md.file_modal_rail.diff` | `T4,T8` | document file modal token display, single rail behavior, and no tokens in right file tree |
| 042 | UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx`, `apps/dashboard/src/features/history/historyModel.ts` | `implementation/diffs/042_UPDATE_apps_dashboard_history_timeline_order_filetree_preview.diff` | `T4` | restore actual workflow order, use completion evidence time, and move file preview opening to right file tree |
| 043 | UPDATE | `spec/dashboard/workflow-git-timeline-reference.md` | `implementation/diffs/043_UPDATE_spec_dashboard_workflow_git_timeline_reference_md.order_preview.diff` | `T4,T8` | document actual workflow order, completion time source, and right file tree preview behavior |
| 044 | UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx`, `apps/dashboard/src/features/history/historyModel.ts` | `implementation/diffs/044_UPDATE_apps_dashboard_timeline_reverse_tone_file_tokens.diff` | `T4` | reverse timeline flow order, color completed checks by flow tone, and remove file-level token chips from generated file rows |
| 045 | UPDATE | `spec/dashboard/workflow-git-timeline-reference.md` | `implementation/diffs/045_UPDATE_spec_dashboard_workflow_git_timeline_reference_md.reverse_tone.diff` | `T4,T8` | document reverse workflow order, flow-tone completed checks, and flow-only token display |
| 046 | UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | `implementation/diffs/046_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx.blue_rail_commit_modal.diff` | `T4` | use blue rail/check, prevent terminal rail overshoot, cap commit rows at 3, and add full commit modal |
| 047 | UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/047_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.view_all_commits.diff` | `T7` | add ko/en label for viewing all commits |
| 048 | UPDATE | `spec/dashboard/workflow-git-timeline-reference.md` | `implementation/diffs/048_UPDATE_spec_dashboard_workflow_git_timeline_reference_md.blue_rail_commit_modal.diff` | `T4,T8` | document blue rail/check, terminal line constraint, and commit modal behavior |
| 049 | UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx`, `spec/dashboard/workflow-git-timeline-reference.md` | `implementation/diffs/049_UPDATE_dashboard_timeline_vertical_stepper_completed_connector.diff` | `T4,T8` | use MUI vertical Stepper with custom connector/step icon and overview completed success styling |
| 050 | UPDATE | `packages/core/src/index.ts`, `packages/core/dist/index.d.ts`, `packages/core/dist/index.js`, `packages/core/dist/index.js.map`, `apps/dashboard/vite.config.ts`, `apps/dashboard/src/shared/model/dashboard.ts`, `apps/dashboard/src/shared/api/dashboard.ts`, `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx`, `apps/dashboard/src/features/history/HistoryWorkspace.tsx`, `apps/dashboard/src/features/history/historyModel.ts`, `apps/dashboard/src/shared/ui/ArtifactDocumentContent.tsx`, `apps/dashboard/src/shared/ui/DiffViewer.tsx`, `apps/dashboard/src/shared/utils/dashboard.tsx`, `apps/dashboard/src/shared/locale/dashboardLocale.ts`, `spec/dashboard/workflow-git-timeline-reference.md` | `implementation/diffs/050_UPDATE_project_files_timeline_preview_start_end.diff` | `T4,T7,T8` | add timeline start/end summary, highlighted file preview modal, and project-wide Project Files tree without topic selector |
| 051 | UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx`, `apps/dashboard/src/features/history/historyModel.ts`, `spec/dashboard/workflow-git-timeline-reference.md` | `implementation/diffs/051_UPDATE_timeline_reference_css_and_heading_range.diff` | `T4,T8` | restore timeline CSS to add-img/timeline.png style and move start-end range under Timeline heading |
