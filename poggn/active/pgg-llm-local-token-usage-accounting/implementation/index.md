---
pgg:
  topic: "pgg-llm-local-token-usage-accounting"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 96
  updated_at: "2026-04-28T02:04:11Z"
---

# Implementation Index

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 001 | UPDATE | `.codex/sh/pgg-state-pack.sh` | `implementation/diffs/001_UPDATE__codex_sh_pgg-state-pack_sh.diff` | `T3` | state-pack token usage summary에 LLM artifact fallback을 적용했다. |
| 002 | UPDATE | `packages/core/src/index.ts` | `implementation/diffs/002_UPDATE_packages_core_src_index_ts.diff` | `T1,T2` | dashboard snapshot 집계가 LLM source artifact fallback과 local ledger-only 합산을 분리한다. |
| 003 | UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/003_UPDATE_packages_core_src_templates_ts.diff` | `T3` | generated state-pack template에 같은 token summary 로직을 전파했다. |
| 004 | UPDATE | `packages/core/test/dashboard-token-usage.test.mjs` | `implementation/diffs/004_UPDATE_packages_core_test_dashboard-token-usage_test_mjs.diff` | `T2,T4` | provider actual, LLM unavailable fallback, local 분리 집계를 회귀 테스트로 고정했다. |
| 005 | UPDATE | `packages/core/dist/index.js` | `implementation/diffs/005_UPDATE_packages_core_dist_index_js.diff` | `T1,T2,T4` | core build 산출물을 동기화했다. |
| 006 | UPDATE | `packages/core/dist/index.js.map` | `implementation/diffs/006_UPDATE_packages_core_dist_index_js_map.diff` | `T1,T2,T4` | core source map을 동기화했다. |
| 007 | UPDATE | `packages/core/dist/templates.js` | `implementation/diffs/007_UPDATE_packages_core_dist_templates_js.diff` | `T3,T4` | template build 산출물을 동기화했다. |
| 008 | UPDATE | `packages/core/dist/templates.js.map` | `implementation/diffs/008_UPDATE_packages_core_dist_templates_js_map.diff` | `T3,T4` | template source map을 동기화했다. |

## Verification

- `pnpm --filter @pgg/core test`: pass, 55 tests.
- `pnpm --filter @pgg/dashboard build`: pass, Vite chunk-size warning only.
- `.codex/sh/pgg-state-pack.sh dashboard-optional-audit-token-metrics`: pass, token_usage_llm_total `1167`, token_usage_local_total `1074`, unavailable records `6`.
