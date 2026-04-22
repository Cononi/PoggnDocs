---
pgg:
  topic: "dashboard-jira-insights-parity"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 95
  updated_at: "2026-04-22T15:02:00Z"
reactflow:
  node_id: "implementation-index"
  node_type: "doc"
  label: "implementation/index.md"
state:
  summary: "dashboard jira insights parity 구현 diff와 검증 결과를 기록한다."
  next: "pgg-refactor"
---

# Implementation Index

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 001 | UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/001_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.diff` | `T1,T3,T4,T6` | Jira형 shell state, sidebar item, workspace filter, insights rail 상태를 담는 frontend 모델을 확장 |
| 002 | UPDATE | `apps/dashboard/src/shared/store/dashboardStore.ts` | `implementation/diffs/002_UPDATE_apps_dashboard_src_shared_store_dashboardStore_ts.diff` | `T1,T4,T6` | shell 문맥과 rail open 상태를 localStorage 기반으로 복원하고 기본 theme를 dark 기준으로 전환 |
| 003 | UPDATE | `apps/dashboard/src/shared/theme/dashboardTheme.ts` | `implementation/diffs/003_UPDATE_apps_dashboard_src_shared_theme_dashboardTheme_ts.diff` | `T2,T6` | dark neutral chrome, blue accent, compact density 기준의 reference parity theme token으로 재정의 |
| 004 | UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/004_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` | `T1,T3,T4,T5,T6` | top nav, project context sidebar, backlog workspace, insights rail용 `ko/en` locale key를 확장 |
| 005 | UPDATE | `apps/dashboard/src/app/dashboardShell.ts` | `implementation/diffs/005_UPDATE_apps_dashboard_src_app_dashboardShell_ts.diff` | `T1,T3,T4,T5` | project search selection, backlog row mapping, insights widget aggregate를 app helper로 분리 |
| 006 | CREATE | `apps/dashboard/src/features/backlog/BacklogWorkspace.tsx` | `implementation/diffs/006_CREATE_apps_dashboard_src_features_backlog_BacklogWorkspace_tsx.diff` | `T3,T6` | dense row backlog workspace, toolbar filters, section collapse, row metadata surface를 추가 |
| 007 | CREATE | `apps/dashboard/src/features/backlog/InsightsRail.tsx` | `implementation/diffs/007_CREATE_apps_dashboard_src_features_backlog_InsightsRail_tsx.diff` | `T4,T5,T6` | docked `Backlog Insights` rail과 workload/trend/progress widget stack을 추가 |
| 008 | UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/008_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.diff` | `T1,T2,T3,T4,T5,T6` | 전체 dashboard shell을 Jira insights형 layout으로 재구성하고 board/reports/settings를 새 shell 안에 재배치 |

## Notes

- snapshot/API shape는 바꾸지 않고 기존 project/topic/recentActivity projection을 backlog row와 insights widget으로 재해석했다.
- 검증은 `pnpm build:dashboard`, `pnpm build`, `pnpm test`를 통과했다.
- dashboard production bundle은 여전히 500kB chunk warning을 남긴다. 기능 blocker는 아니지만 refactor/QA 단계의 residual risk로 유지한다.
- current-project verification contract는 여전히 선언되지 않았으므로 framework-specific 자동 검증 대신 `manual verification required` 상태를 유지한다.
