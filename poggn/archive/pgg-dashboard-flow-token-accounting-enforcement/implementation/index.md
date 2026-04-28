---
pgg:
  topic: "pgg-dashboard-flow-token-accounting-enforcement"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 96
  updated_at: "2026-04-28T02:59:22Z"
---

# Implementation Index

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 001 | UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | `implementation/diffs/001_UPDATE_apps_dashboard_src_features_history_historyModel_ts.diff` | `T3` | Timeline 완료 flow별 LLM artifact baseline과 local record-only 합산을 적용했다. |
| 002 | UPDATE | `packages/core/src/index.ts` | `implementation/diffs/002_UPDATE_packages_core_src_index_ts.diff` | `T1,T2,T3,T4` | topic file artifact token estimate를 LLM baseline으로 계산하고 local fallback을 제거했다. |
| 003 | UPDATE | `packages/core/test/dashboard-token-usage.test.mjs` | `implementation/diffs/003_UPDATE_packages_core_test_dashboard-token-usage_test_mjs.diff` | `T1,T2,T5` | ledger 없는 topic artifact LLM token 계산과 local 0 기준을 검증했다. |
| 004 | UPDATE | `scripts/dashboard-history-model.test.mjs` | `implementation/diffs/004_UPDATE_scripts_dashboard-history-model_test_mjs.diff` | `T3,T5` | Timeline flow row가 file baseline LLM token과 local record를 분리 합산하는지 검증했다. |
| 005 | UPDATE | `packages/core/dist/index.js` | `implementation/diffs/005_UPDATE_packages_core_dist_index_js.diff` | `T4,T5` | generated project가 같은 core snapshot semantics를 쓰도록 build 산출물을 동기화했다. |
| 006 | UPDATE | `packages/core/dist/index.js.map` | `implementation/diffs/006_UPDATE_packages_core_dist_index_js_map.diff` | `T4,T5` | core source map을 동기화했다. |

## Verification

- `pnpm --filter @pgg/core test`: pass, 56 tests.
- `pnpm test:dashboard`: pass, 3 tests.
- `pnpm --filter @pgg/dashboard build`: pass, Vite chunk-size warning only.
