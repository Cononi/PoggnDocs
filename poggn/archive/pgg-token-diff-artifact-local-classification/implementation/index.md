---
pgg:
  topic: "pgg-token-diff-artifact-local-classification"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 96
  updated_at: "2026-04-28T03:12:12Z"
---

# Implementation Index

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 001 | UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | `implementation/diffs/001_UPDATE_apps_dashboard_src_features_history_historyModel_ts.diff` | `T2,T3` | Timeline flow summary에서 diff artifact를 local token으로 분류했다. |
| 002 | UPDATE | `packages/core/src/index.ts` | `implementation/diffs/002_UPDATE_packages_core_src_index_ts.diff` | `T1,T2,T3,T4` | core snapshot classifier가 diff artifact를 LLM에서 제외하고 local baseline으로 계산한다. |
| 003 | UPDATE | `packages/core/test/dashboard-token-usage.test.mjs` | `implementation/diffs/003_UPDATE_packages_core_test_dashboard-token-usage_test_mjs.diff` | `T1,T2,T4` | no-ledger diff artifact local classification 회귀 테스트를 추가했다. |
| 004 | UPDATE | `scripts/dashboard-history-model.test.mjs` | `implementation/diffs/004_UPDATE_scripts_dashboard-history-model_test_mjs.diff` | `T2,T3,T4` | Timeline code row에서 diff token이 local에만 반영되는지 검증했다. |
| 005 | UPDATE | `packages/core/dist/index.js` | `implementation/diffs/005_UPDATE_packages_core_dist_index_js.diff` | `T4` | core build 산출물을 동기화했다. |
| 006 | UPDATE | `packages/core/dist/index.js.map` | `implementation/diffs/006_UPDATE_packages_core_dist_index_js_map.diff` | `T4` | core source map을 동기화했다. |

## Verification

- `pnpm --filter @pgg/core test`: pass, 56 tests.
- `pnpm test:dashboard`: pass, 3 tests.
- `pnpm --filter @pgg/dashboard build`: pass, Vite chunk-size warning only.
