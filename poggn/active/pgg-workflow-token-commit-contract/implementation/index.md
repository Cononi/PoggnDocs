---
pgg:
  topic: "pgg-workflow-token-commit-contract"
  stage: "implementation"
  status: "draft"
  skill: "pgg-code"
  score: 0
  updated_at: "2026-04-28T01:19:24Z"
---

# Implementation Index

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 001 | UPDATE | `packages/core/src/index.ts` | `implementation/diffs/001_UPDATE_packages_core_src_index_ts.diff` | `T1` | LLM actual 집계가 usage metadata available record만 포함하도록 token ledger record에 `usageMetadataAvailable`를 추가했다. |
| 002 | UPDATE | `packages/core/test/dashboard-token-usage.test.mjs` | `implementation/diffs/002_UPDATE_packages_core_test_dashboard_token_usage_test_mjs.diff` | `T1` | LLM unavailable과 metadata 없는 LLM actual 후보가 actual 합계에서 제외되는 회귀 테스트를 추가했다. |
| 003 | UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/003_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.diff` | `T1` | dashboard shared model에 `usageMetadataAvailable` token record field를 추가했다. |
| 004 | UPDATE | `packages/core/dist/index.d.ts`, `packages/core/dist/index.js`, `packages/core/dist/index.js.map` | `implementation/diffs/004_UPDATE_packages_core_dist_index.diff` | `T1` | core build 산출물을 T1 source 변경과 동기화했다. |
| 005 | UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | `implementation/diffs/005_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx.diff` | `T2` | Workflow Progress 제목에서 token 결합 문구를 제거하고 LLM/Local clip row를 공용 컴포넌트로 분리했다. |
| 006 | UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/006_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` | `T2` | 한국어/영어 locale에서 결합 token title key를 제거하고 순수 Workflow Progress 제목 key로 바꿨다. |
| 007 | UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | `implementation/diffs/007_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_mobile_process.diff` | `T3` | 모바일 workflow process track이 세로 stack으로 바뀌지 않도록 같은 column 형태와 horizontal connector를 유지하고 node 크기를 동적으로 줄였다. |
| 008 | UPDATE | `.codex/sh/pgg-stage-commit.sh` | `implementation/diffs/008_UPDATE__codex_sh_pgg-stage-commit_sh.diff` | `T4` | task id, dependencies, completion criteria env를 받아 commit body와 stage-commit evidence에 기록하도록 helper를 확장했다. |
| 009 | UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/009_UPDATE_packages_core_src_templates_ts.diff` | `T4` | generated stage commit helper, WOKR, pgg-code skill template에 task-row commit 계약을 반영했다. |
| 010 | UPDATE | `packages/core/test/git-publish.test.mjs` | `implementation/diffs/010_UPDATE_packages_core_test_git-publish_test_mjs.diff` | `T4` | task-row commit body/footer/evidence 구조를 검증하는 stage commit 회귀 테스트를 추가했다. |
| 011 | UPDATE | `.codex/skills/pgg-code/SKILL.md`, `.codex/add/WOKR-FLOW.md` | `implementation/diffs/011_UPDATE_pgg_code_commit_contract_docs.diff` | `T4` | 현재 workspace pgg-code와 WOKR 문서에 T1...N 행 단위 commit cadence와 helper env 계약을 반영했다. |
| 012 | UPDATE | `packages/core/dist/templates.js`, `packages/core/dist/templates.js.map` | `implementation/diffs/012_UPDATE_packages_core_dist_templates.diff` | `T4` | core build 산출물을 T4 template 변경과 동기화했다. |
| 013 | UPDATE | `packages/core/src/templates.ts`, `packages/core/src/readme.ts` | `implementation/diffs/013_UPDATE_packages_core_src_pgg_lang_contract.diff` | `T5` | generated pgg 문서, state/history, commit message, pgg 생성/수정 코드 주석이 `pgg lang`을 따르도록 source template와 README 계약을 갱신했다. |
| 014 | UPDATE | `packages/core/test/skill-generation.test.mjs` | `implementation/diffs/014_UPDATE_packages_core_test_skill_generation_pgg_lang.diff` | `T5` | ko/en fixture에서 generated workflow 문서와 pgg comment rule이 project language를 따르는지 검증했다. |
| 015 | UPDATE | `AGENTS.md`, `README.md`, `.codex/add/*`, `.codex/skills/pgg-*` | `implementation/diffs/015_UPDATE_current_workspace_pgg_lang_docs.diff` | `T5` | 현재 workspace pgg 문서와 pgg-* skill에 한국어 Language Contract를 반영했다. |
| 016 | UPDATE | `packages/core/dist/templates.js`, `packages/core/dist/templates.js.map`, `packages/core/dist/readme.js`, `packages/core/dist/readme.js.map` | `implementation/diffs/016_UPDATE_packages_core_dist_pgg_lang_contract.diff` | `T5` | core build 산출물을 T5 source 변경과 동기화했다. |

## Verification

- `pnpm --filter @pgg/core test`: pass, 54 tests.
- `pnpm --filter @pgg/dashboard build`: pass, Vite chunk-size warning only.
- `rg` mobile stack/vertical connector pattern check: pass, workflow process track의 xs `1fr` stack과 vertical connector 패턴 없음.
- `pnpm --filter @pgg/core test`: first run failed because shared publish helper builder referenced unset task env; after template default-value fix, pass, 54 tests.
- `pnpm --filter @pgg/core test`: first T5 run failed because the new Korean assertion was stricter than the actual localized sentence; after regex adjustment, pass, 55 tests.
