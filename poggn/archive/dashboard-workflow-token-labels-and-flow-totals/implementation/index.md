---
pgg:
  topic: "dashboard-workflow-token-labels-and-flow-totals"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 96
  updated_at: "2026-04-28T02:29:33Z"
---

# Implementation Index

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 001 | UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | `implementation/diffs/001_UPDATE_apps_dashboard_src_features_history_historyModel_ts.diff` | `T3` | Timeline row token 합산을 flow-scoped tokenUsageRecords 기준으로 전환했다. |
| 002 | UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/002_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` | `T1` | Overview/Timeline 공통 token label을 `LLM token`, `local token`으로 변경했다. |
| 003 | UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/003_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.diff` | `T3` | dashboard token record model에 artifact fallback estimate를 노출했다. |
| 004 | UPDATE | `packages/core/src/index.ts` | `implementation/diffs/004_UPDATE_packages_core_src_index_ts.diff` | `T3` | snapshot token records에 artifactTokenEstimate를 포함해 Timeline fallback 합산 근거를 제공했다. |
| 005 | UPDATE | `packages/core/dist/index.d.ts` | `implementation/diffs/005_UPDATE_packages_core_dist_index_d_ts.diff` | `T3,T4` | core type build 산출물을 동기화했다. |
| 006 | UPDATE | `packages/core/dist/index.js` | `implementation/diffs/006_UPDATE_packages_core_dist_index_js.diff` | `T3,T4` | core build 산출물을 동기화했다. |
| 007 | UPDATE | `packages/core/dist/index.js.map` | `implementation/diffs/007_UPDATE_packages_core_dist_index_js_map.diff` | `T3,T4` | core source map을 동기화했다. |
| 008 | UPDATE | `scripts/dashboard-history-model.test.mjs` | `implementation/diffs/008_UPDATE_scripts_dashboard-history-model_test_mjs.diff` | `T3,T4` | 완료 flow별 LLM/local token record 합산 회귀 테스트를 추가했다. |

## Verification

- `pnpm test:dashboard`: pass, 3 tests.
- `pnpm --filter @pgg/core test`: pass, 55 tests.
- `pnpm --filter @pgg/dashboard build`: pass, Vite chunk-size warning only.
