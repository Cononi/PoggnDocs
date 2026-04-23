---
pgg:
  topic: "dashboard-management-refinement"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 95
  updated_at: "2026-04-23T03:23:16Z"
reactflow:
  node_id: "implementation-index"
  node_type: "doc"
  label: "implementation/index.md"
state:
  summary: "dashboard management refinement 구현 diff와 검증 결과를 기록한다."
  next: "pgg-refactor"
---

# Implementation Index

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 001 | UPDATE | `apps/dashboard/package.json` | `implementation/diffs/001_UPDATE_apps_dashboard_package_json.diff` | `T1` | dashboard data client를 `axios` 기반으로 옮기기 위해 dependency를 추가 |
| 002 | UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/002_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.diff` | `T2`, `T4`, `T5`, `T6` | top nav/sidebar surface routing, category/report/history/settings wiring, delete modal, branding side effect를 재구성 |
| 003 | UPDATE | `apps/dashboard/src/app/DashboardShellChrome.tsx` | `implementation/diffs/003_UPDATE_apps_dashboard_src_app_DashboardShellChrome_tsx.diff` | `T2`, `T5` | `Project`/`Settings` top menu, `MANAGEMENT` sidebar, title icon brand mark를 반영 |
| 004 | UPDATE | `apps/dashboard/src/features/backlog/BacklogWorkspace.tsx` | `implementation/diffs/004_UPDATE_apps_dashboard_src_features_backlog_BacklogWorkspace_tsx.diff` | `T4`, `T6` | backlog surface를 history 문맥에서 재사용하고 native select를 MUI select로 교체 |
| 005 | UPDATE | `apps/dashboard/src/features/project-list/CategoryManagementPanel.tsx` | `implementation/diffs/005_UPDATE_apps_dashboard_src_features_project-list_CategoryManagementPanel_tsx.diff` | `T4` | category CRUD/default/visibility/order를 table surface로 통합 |
| 006 | UPDATE | `apps/dashboard/src/features/project-list/ProjectListBoard.tsx` | `implementation/diffs/006_UPDATE_apps_dashboard_src_features_project-list_ProjectListBoard_tsx.diff` | `T3`, `T6` | board 카드 위계, drag-and-drop, delete trigger, current root guard를 구현 |
| 007 | UPDATE | `apps/dashboard/src/features/settings/SettingsWorkspace.tsx` | `implementation/diffs/007_UPDATE_apps_dashboard_src_features_settings_SettingsWorkspace_tsx.diff` | `T5`, `T6` | title/title icon apply, language/theme toggle, save-less settings UX를 구현 |
| 008 | UPDATE | `apps/dashboard/src/shared/api/dashboard.ts` | `implementation/diffs/008_UPDATE_apps_dashboard_src_shared_api_dashboard_ts.diff` | `T1` | dashboard snapshot/mutation client를 `fetch`에서 `axios`로 전환 |
| 009 | UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/009_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` | `T1`, `T2`, `T4`, `T5` | 새로운 shell/menu/delete/settings/history copy를 ko/en parity로 추가 |
| 010 | UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/010_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.diff` | `T1`, `T2` | title icon snapshot field와 새 sidebar/workspace enum을 반영 |
| 011 | UPDATE | `apps/dashboard/src/shared/store/dashboardStore.ts` | `implementation/diffs/011_UPDATE_apps_dashboard_src_shared_store_dashboardStore_ts.diff` | `T1`, `T2` | `board/category/report/history` 중심 selection state로 재정렬 |
| 012 | UPDATE | `apps/dashboard/src/shared/theme/dashboardTheme.ts` | `implementation/diffs/012_UPDATE_apps_dashboard_src_shared_theme_dashboardTheme_ts.diff` | `T5` | select/menu radius와 popup surface를 현재 dashboard tone에 맞게 조정 |
| 013 | CREATE | `apps/dashboard/src/shared/utils/brand.ts` | `implementation/diffs/013_CREATE_apps_dashboard_src_shared_utils_brand_ts.diff` | `T1`, `T5` | title icon SVG fallback, data URL 변환, branding helper를 추가 |
| 014 | UPDATE | `apps/dashboard/vite.config.ts` | `implementation/diffs/014_UPDATE_apps_dashboard_vite_config_ts.diff` | `T1`, `T3`, `T5` | main settings patch와 project delete live API route를 추가 |
| 015 | UPDATE | `packages/core/src/index.ts` | `implementation/diffs/015_UPDATE_packages_core_src_index_ts.diff` | `T1`, `T3`, `T5` | manifest/snapshot title icon 필드, main settings update, registered project delete를 추가 |
| 016 | UPDATE | `packages/core/dist/index.d.ts` | `implementation/diffs/016_UPDATE_packages_core_dist_index_d_ts.diff` | `T1` | core public types를 source 변경에 맞춰 재빌드 |
| 017 | UPDATE | `packages/core/dist/index.js` | `implementation/diffs/017_UPDATE_packages_core_dist_index_js.diff` | `T1` | core runtime bundle을 source 변경에 맞춰 재빌드 |
| 018 | UPDATE | `packages/core/dist/index.js.map` | `implementation/diffs/018_UPDATE_packages_core_dist_index_js_map.diff` | `T1` | core source map을 재생성 |
| 019 | UPDATE | `pnpm-lock.yaml` | `implementation/diffs/019_UPDATE_pnpm-lock_yaml.diff` | `T1` | `axios` 의존성 추가에 맞춰 lockfile을 갱신 |
| 020 | UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/020_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.refactor.diff` | `refactor` | 화면 분기 내부 inline mutation을 handler로 정리하고 삭제 modal의 filesystem opt-in을 체크박스로 교체 |
| 021 | UPDATE | `apps/dashboard/src/app/dashboardShell.ts` | `implementation/diffs/021_UPDATE_apps_dashboard_src_app_dashboardShell_ts.refactor.diff` | `refactor` | 더 이상 사용하지 않는 search/detail selection helper를 제거해 shell helper 계약을 현재 구조와 맞춤 |
| 022 | UPDATE | `apps/dashboard/src/features/backlog/BacklogWorkspace.tsx` | `implementation/diffs/022_UPDATE_apps_dashboard_src_features_backlog_BacklogWorkspace_tsx.refactor.diff` | `refactor` | history/backlog surface에서 사용하지 않는 `language` prop을 제거 |
| 023 | UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/023_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.refactor.diff` | `refactor` | 더 이상 쓰지 않는 `workspaceMode`, `shellSearchQuery` store contract를 model에서 제거 |
| 024 | UPDATE | `apps/dashboard/src/shared/store/dashboardStore.ts` | `implementation/diffs/024_UPDATE_apps_dashboard_src_shared_store_dashboardStore_ts.refactor.diff` | `refactor` | persisted UI state를 현재 navigation 구조만 남기도록 단순화 |

## Notes

- `pnpm build`가 통과했다.
- 검증 contract는 여전히 선언되지 않았으므로 `manual verification required` 상태를 유지한다.
- `History`는 기존 backlog surface를 history 문맥으로 재사용한다.
- project delete는 dashboard 등록 삭제와 filesystem 삭제를 분리했고, 실제 폴더 삭제는 명시적 opt-in checkbox가 있을 때만 live API가 수행한다.
- refactor 단계에서 dead shell helper, legacy store state, unused backlog prop을 제거했다.
