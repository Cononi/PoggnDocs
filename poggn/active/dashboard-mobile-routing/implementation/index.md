---
pgg:
  topic: "dashboard-mobile-routing"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 93
  updated_at: "2026-04-27T08:56:37Z"
  archive_type: "feat"
  project_scope: "current-project"
---

# Implementation Index

## Summary

dashboard route state, responsive actions, project selector deletion, i18n coverage, and workflow `stage-blocked` rendering were implemented within the approved current-project scope.

## Task Mapping

| Task | Status | Summary |
|---|---|---|
| T1 | done | Added browser History API route-state adapter and wired app state to path/query restoration. |
| T2 | done | Moved add/insights/latest summary into MUI Speed Dial and added mobile Bottom Navigation. |
| T3 | done | Added project selector delete action and connected it to existing confirmation dialog. |
| T4 | done | Added ko/en keys for home navigation, Speed Dial, route repair copy, and stage-blocked label. |
| T5 | done | Added `stage-blocked` workflow status detection and lock-icon danger rendering. |

## Changed Files

| CRUD | path | diff |
|---|---|---|
| UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/001_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.diff` |
| UPDATE | `apps/dashboard/src/app/DashboardShellChrome.tsx` | `implementation/diffs/002_UPDATE_apps_dashboard_src_app_DashboardShellChrome_tsx.diff` |
| CREATE | `apps/dashboard/src/app/dashboardRouteState.ts` | `implementation/diffs/003_CREATE_apps_dashboard_src_app_dashboardRouteState_ts.diff` |
| UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/004_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.diff` |
| UPDATE | `apps/dashboard/src/shared/store/dashboardStore.ts` | `implementation/diffs/005_UPDATE_apps_dashboard_src_shared_store_dashboardStore_ts.diff` |
| UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/006_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` |
| UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | `implementation/diffs/007_UPDATE_apps_dashboard_src_features_history_historyModel_ts.diff` |
| UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | `implementation/diffs/008_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx.diff` |
| UPDATE | `apps/dashboard/src/app/dashboardRouteState.ts` | `implementation/diffs/009_REFACTOR_apps_dashboard_src_app_dashboardRouteState_ts.diff` |
| UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/010_REFACTOR_apps_dashboard_src_app_DashboardApp_tsx.diff` |
| UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | `implementation/diffs/011_REFACTOR_apps_dashboard_src_features_history_HistoryWorkspace_tsx.diff` |
| UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/012_REFACTOR_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` |

## Verification

- `pnpm --filter @pgg/dashboard build`: pass
- refactor `pnpm --filter @pgg/dashboard build`: pass
- current-project verification contract: `manual verification required`

## Notes

- Route-state is implemented without adding a router dependency.
- LocalStorage no longer persists route-level fields such as section, settings panel, selected topic, and insights state.
- `stage-blocked` remains compatible with existing blocked counting/rendering predicates.
- Refactor moved route-state UI projection helpers into `dashboardRouteState.ts` and removed unused route repair locale copy.
