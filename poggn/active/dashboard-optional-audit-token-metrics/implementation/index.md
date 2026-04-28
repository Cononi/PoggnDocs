---
pgg:
  topic: "dashboard-optional-audit-token-metrics"
  stage: "refactor"
  status: "reviewed"
  skill: "pgg-refactor"
  score: 96
  updated_at: "2026-04-28T00:18:00Z"
---

# Implementation Index

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 001 | UPDATE | `AGENTS.md` | `implementation/diffs/001_UPDATE_AGENTS_md.diff` | `T4` | Generated agent contract propagation. |
| 002 | UPDATE | `.codex/add/WOKR-FLOW.md` | `implementation/diffs/002_UPDATE__codex_add_WOKR_FLOW_md.diff` | `T4` | Optional audit visibility, timeline completion, token ledger workflow rules. |
| 003 | UPDATE | `.codex/add/STATE-CONTRACT.md` | `implementation/diffs/003_UPDATE__codex_add_STATE_CONTRACT_md.diff` | `T4` | Token usage ledger handoff summary/ref contract. |
| 004 | UPDATE | `.codex/sh/pgg-state-pack.sh` | `implementation/diffs/004_UPDATE__codex_sh_pgg_state_pack_sh.diff` | `T4` | State-pack token usage summary output. |
| 005 | UPDATE | `.codex/skills/pgg-code/SKILL.md` | `implementation/diffs/005_UPDATE__codex_skills_pgg_code_SKILL_md.diff` | `T4` | Code stage token ledger recording rule. |
| 006 | UPDATE | `.codex/skills/pgg-token/SKILL.md` | `implementation/diffs/006_UPDATE__codex_skills_pgg_token_SKILL_md.diff` | `T4` | Token audit ledger coverage/source separation rule. |
| 007 | UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | `implementation/diffs/007_UPDATE_apps_dashboard_src_features_history_historyModel_ts.diff` | `T1,T2,T5` | Optional audit execution evidence gating, completed-only timeline rows/bounds, token aggregation compatibility. |
| 008 | UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/008_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.diff` | `T3,T5` | Dashboard token usage record and ledger source types. |
| 009 | UPDATE | `packages/core/src/index.ts` | `implementation/diffs/009_UPDATE_packages_core_src_index_ts.diff` | `T3,T5` | Topic token usage ledger parser and snapshot attribution. |
| 010 | UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/010_UPDATE_packages_core_src_templates_ts.diff` | `T4` | init/update template propagation. |
| 011 | UPDATE | `packages/core/src/workflow-contract.ts` | `implementation/diffs/011_UPDATE_packages_core_src_workflow_contract_ts.diff` | `T4` | README optional audit summary contract. |
| 012 | ADD | `packages/core/test/dashboard-token-usage.test.mjs` | `implementation/diffs/012_ADD_packages_core_test_dashboard_token_usage_test_mjs.diff` | `T3,T5` | Ledger attribution regression test. |
| 013 | UPDATE | `packages/core/dist/index.d.ts` | `implementation/diffs/013_UPDATE_packages_core_dist_index_d_ts.diff` | `T3,T5` | Built core type output. |
| 014 | UPDATE | `packages/core/dist/index.js` | `implementation/diffs/014_UPDATE_packages_core_dist_index_js.diff` | `T3,T5` | Built core runtime output. |
| 015 | UPDATE | `packages/core/dist/index.js.map` | `implementation/diffs/015_UPDATE_packages_core_dist_index_js_map.diff` | `T3,T5` | Built core source map. |
| 016 | UPDATE | `packages/core/dist/templates.js` | `implementation/diffs/016_UPDATE_packages_core_dist_templates_js.diff` | `T4` | Built template output. |
| 017 | UPDATE | `packages/core/dist/templates.js.map` | `implementation/diffs/017_UPDATE_packages_core_dist_templates_js_map.diff` | `T4` | Built template source map. |
| 018 | UPDATE | `packages/core/dist/workflow-contract.d.ts` | `implementation/diffs/018_UPDATE_packages_core_dist_workflow_contract_d_ts.diff` | `T4` | Built workflow contract type output. |
| 019 | UPDATE | `packages/core/dist/workflow-contract.js` | `implementation/diffs/019_UPDATE_packages_core_dist_workflow_contract_js.diff` | `T4` | Built workflow contract runtime output. |
| 020 | UPDATE | `packages/core/dist/workflow-contract.js.map` | `implementation/diffs/020_UPDATE_packages_core_dist_workflow_contract_js_map.diff` | `T4` | Built workflow contract source map. |
| 021 | UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | `implementation/diffs/021_REFACTOR_apps_dashboard_src_features_history_historyModel_ts.diff` | `T1,T2,T5` | Refactored optional audit artifact matching into a shared helper. |
| 022 | UPDATE | `packages/core/src/index.ts` | `implementation/diffs/022_REFACTOR_packages_core_src_index_ts.diff` | `T3,T5` | Refactored repeated token usage source/measurement predicates into helpers. |
| 023 | UPDATE | `packages/core/dist/index.js` | `implementation/diffs/023_REFACTOR_packages_core_dist_index_js.diff` | `T3,T5` | Built core runtime output for token helper refactor. |
| 024 | UPDATE | `packages/core/dist/index.js.map` | `implementation/diffs/024_REFACTOR_packages_core_dist_index_js_map.diff` | `T3,T5` | Built core source map for token helper refactor. |

## Verification

- `pnpm --filter @pgg/core test`: pass, 54 tests.
- `pnpm --filter @pgg/dashboard build`: pass, Vite chunk-size warning only.
- Refactor verification repeated both commands after helper extraction with the same pass results.

## Refactor Summary

- Optional audit artifact path matching now lives in `isOptionalAuditArtifact`, keeping token/performance report and review path rules in one place.
- Token usage llm/local aggregation now uses `isActualLlmTokenRecord`, `sumLocalTokenRecords`, and `sumActualLlmTokenRecords`, keeping file attribution and topic summary totals aligned.
- No behavior or public type contract changes were introduced.

## Notes

- Pre-existing dirty paths `.pgg/project.json` and `변경.md` remain excluded from this implementation scope.
