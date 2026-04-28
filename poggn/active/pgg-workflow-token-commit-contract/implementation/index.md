---
pgg:
  topic: "pgg-workflow-token-commit-contract"
  stage: "implementation"
  status: "draft"
  skill: "pgg-code"
  score: 0
  updated_at: "2026-04-28T01:02:00Z"
---

# Implementation Index

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 001 | UPDATE | `packages/core/src/index.ts` | `implementation/diffs/001_UPDATE_packages_core_src_index_ts.diff` | `T1` | LLM actual 집계가 usage metadata available record만 포함하도록 token ledger record에 `usageMetadataAvailable`를 추가했다. |
| 002 | UPDATE | `packages/core/test/dashboard-token-usage.test.mjs` | `implementation/diffs/002_UPDATE_packages_core_test_dashboard_token_usage_test_mjs.diff` | `T1` | LLM unavailable과 metadata 없는 LLM actual 후보가 actual 합계에서 제외되는 회귀 테스트를 추가했다. |
| 003 | UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/003_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.diff` | `T1` | dashboard shared model에 `usageMetadataAvailable` token record field를 추가했다. |
| 004 | UPDATE | `packages/core/dist/index.d.ts`, `packages/core/dist/index.js`, `packages/core/dist/index.js.map` | `implementation/diffs/004_UPDATE_packages_core_dist_index.diff` | `T1` | core build 산출물을 T1 source 변경과 동기화했다. |

## Verification

- `pnpm --filter @pgg/core test`: pass, 54 tests.
