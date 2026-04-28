# Current State

## Topic

dashboard-optional-audit-token-metrics

## Current Stage

qa

## Goal

dashboard optional audit 표시 조건, timeline 완료 게이트, pgg token usage 기록 계약을 구현하고 검증한다.

## Next Action

`qa/report.md` pass 결과를 기준으로 archive helper를 실행해 version ledger와 release publish bookkeeping을 완료한다.

## Constraints

- project scope: `current-project`
- archive type: `feat`
- version bump: `minor`
- target version: `2.9.0`
- short name: `dashboard-metrics`
- working branch: `ai/feat/2.9.0-dashboard-metrics`
- release branch: `release/2.9.0-dashboard-metrics`

## User Question Record Ref

- `proposal.md` 섹션 `3. 사용자 입력 질문 기록`

## Requirements Summary

- dashboard Overview에서 `pgg-token`, `pgg-performance`는 실제 실행 evidence가 있을 때만 표시한다.
- Performance/token optional audit는 pgg flow 내부에서 필요하다고 판단된 경우에만 사용한다.
- dashboard timeline은 workflow progress에서 해당 flow가 `완료` 상태로 계산된 경우에만 flow item을 표시한다.
- 각 flow 작업과 file artifact 생성/수정/삭제마다 token usage를 기록할 수 있어야 한다.
- token usage는 `llm`과 `local` source를 분리하고, 실측/추정 여부와 artifact ref를 남긴다.
- token metrics는 dashboard timeline/workflow 주요 지표로 사용할 수 있어야 한다.
- `pgg init`/`pgg update`로 생성되는 후속 프로젝트에도 같은 optional audit visibility와 token usage 기록 계약이 적용되어야 한다.

## Scope

- dashboard optional audit flow visibility gating
- dashboard timeline completion gating
- pgg token usage ledger schema and storage contract
- flow/task/file artifact token attribution
- init/update generated asset propagation
- dashboard workflow/timeline token summary ingestion

## Plan Summary

- `S1`: `spec/workflow/optional-audit-visibility.md`
- `S2`: `spec/workflow/timeline-completion-gating.md`
- `S3`: `spec/token/token-usage-ledger.md`
- `S4`: `spec/pgg/init-update-propagation.md`
- `S5`: `spec/dashboard/token-summary-ingestion.md`

## Task Summary

- `T1`: done | dashboard workflow Overview의 optional audit visibility를 실제 실행 evidence 기반으로 제한했다.
- `T2`: done | timeline row와 bounds 생성 조건을 완료된 workflow progress evidence로 제한했다.
- `T3`: done | pgg token usage ledger schema와 stage/task/file artifact attribution parser를 구현했다.
- `T4`: done | init/update generated workflow assets에 optional audit visibility와 token ledger 계약을 전파했다.
- `T5`: done | dashboard snapshot/model/history ingestion이 flow/file token summary를 읽고 지표로 쓸 수 있게 했다.

## Implementation Summary

- optional `pgg-token`/`pgg-performance` flow는 execution event, meaningful report/review, timestamp/status가 있는 workflow node 중 하나가 있어야 Overview에 표시된다.
- timeline row와 timeline bounds는 completion evidence가 있는 flow만 사용한다.
- core snapshot은 `state/token-usage.ndjson`를 읽어 file/topic token attribution에 ledger 값을 우선 적용하고, ledger가 없으면 기존 local estimate fallback을 유지한다.
- dashboard shared model은 token usage record, ledger source, record count를 표현한다.
- generated AGENTS/WOKR/STATE/skill/state-pack/template 계약에 optional audit visibility와 token ledger summary/ref 규칙을 반영했다.
- `packages/core/test/dashboard-token-usage.test.mjs`로 ledger-first attribution 회귀를 고정했다.

## Refactor Summary

- optional audit report/review artifact matching을 `isOptionalAuditArtifact` helper로 분리했다.
- token usage llm actual/local aggregation 조건을 `isActualLlmTokenRecord`, `sumLocalTokenRecords`, `sumActualLlmTokenRecords` helper로 분리했다.
- 동작 변경 없이 중복 조건을 줄였고, refactor 후 core test와 dashboard build를 재검증했다.

## Token Usage

- ledger: `state/token-usage.ndjson`
- records: `8`
- llm actual tokens: unavailable
- local estimated tokens: `1074`
- note: provider usage metadata remains unavailable for LLM calls, so LLM records preserve attribution without prompt or file body copies. Token audit added local estimated records for ledger size and state-pack handoff output.

## Token Audit Summary

- `token/report.md` records the required optional audit because this topic changed workflow assets, generated templates, state handoff, and token ledger contracts.
- Pre-audit ledger had 4 `llm` records with `measurement: unavailable`; token audit appended 2 `local` estimated records and 2 additional LLM unavailable artifact records.
- The largest measured workflow token-cost contributor is generated template propagation in `packages/core/src/templates.ts` at 4,004 lines / estimated 47,294 local tokens.
- `pgg-state-pack.sh` handoff output is 2,861 bytes / estimated 716 local tokens and remains compact because it passes refs rather than full document bodies.
- Token review approved with no blocking issues; follow-up is to automate refactor-stage ledger coverage in a later topic if exact per-artifact reporting becomes required.

## Verification

- `pnpm --filter @pgg/core test`: pass, 54 tests.
- `pnpm --filter @pgg/dashboard build`: pass, Vite chunk-size warning only.
- Refactor verification: `pnpm --filter @pgg/core test` pass, 54 tests.
- Refactor verification: `pnpm --filter @pgg/dashboard build` pass, Vite chunk-size warning only.
- Token audit verification: `state/token-usage.ndjson` parsed successfully with 8 records, 6 `llm` records, 2 `local` records, 6 unavailable records, and 1,074 local estimated tokens.
- Token audit verification: `pgg-state-pack.sh` output measured at 2,861 bytes.
- Token audit verification: `workflow.reactflow.json` parsed successfully.
- Token audit verification: `pgg-qa` gate passed.
- QA verification: `pnpm --filter @pgg/core test` pass, 54 tests.
- QA verification: `pnpm --filter @pgg/dashboard build` pass, Vite chunk-size warning only.
- QA verification: `workflow.reactflow.json` and `state/token-usage.ndjson` parsed successfully.
- QA verification: `pgg-qa` gate passed.

## Out Of Scope

- optional audit 상시 mandatory stage화
- 외부 billing API 연동
- provider별 가격표 또는 금액 환산 UI
- dashboard 전체 timeline redesign
- archive topic reactivation

## Audit Applicability

- `pgg-token`: `required` | workflow 자산, state handoff, generated 문서 구조, token usage 기록 계약을 함께 바꾸는 topic이다.
- `pgg-performance`: `not_required` | dashboard 표시 조건과 token metrics 계약이 핵심이며 별도 성능 민감 runtime path나 선언된 performance verification contract는 없다.

## Git Publish Message

- title: feat: 2.9.0.audit token 지표
- why: dashboard가 optional audit flow를 실제 실행 evidence가 있을 때만 보여 주고, timeline은 완료된 workflow progress만 표시해야 하며, 각 flow와 file artifact의 llm/local token usage를 후속 프로젝트까지 기록할 수 있어야 한다.
- footer: Refs: dashboard-optional-audit-token-metrics

## Review Summary

- proposal review: approved
- plan review: approved
- task review: approved
- code review: approved
- refactor review: approved
- token review: approved
- qa review: pass
- score: `96`
- experts: QA/테스트 엔지니어, SRE/운영 엔지니어
- blocking issues: 없음

## Next Workflow

- archive

## Changed Files

| CRUD | Path | Diff |
|---|---|---|
| ADD | `poggn/active/dashboard-optional-audit-token-metrics/proposal.md` | pending |
| ADD | `poggn/active/dashboard-optional-audit-token-metrics/reviews/proposal.review.md` | pending |
| ADD | `poggn/active/dashboard-optional-audit-token-metrics/state/current.md` | pending |
| ADD | `poggn/active/dashboard-optional-audit-token-metrics/state/history.ndjson` | pending |
| ADD | `poggn/active/dashboard-optional-audit-token-metrics/state/dirty-worktree-baseline.txt` | pending |
| ADD | `poggn/active/dashboard-optional-audit-token-metrics/workflow.reactflow.json` | pending |
| ADD | `poggn/active/dashboard-optional-audit-token-metrics/plan.md` | pending |
| ADD | `poggn/active/dashboard-optional-audit-token-metrics/task.md` | pending |
| ADD | `poggn/active/dashboard-optional-audit-token-metrics/spec/workflow/optional-audit-visibility.md` | pending |
| ADD | `poggn/active/dashboard-optional-audit-token-metrics/spec/workflow/timeline-completion-gating.md` | pending |
| ADD | `poggn/active/dashboard-optional-audit-token-metrics/spec/token/token-usage-ledger.md` | pending |
| ADD | `poggn/active/dashboard-optional-audit-token-metrics/spec/pgg/init-update-propagation.md` | pending |
| ADD | `poggn/active/dashboard-optional-audit-token-metrics/spec/dashboard/token-summary-ingestion.md` | pending |
| ADD | `poggn/active/dashboard-optional-audit-token-metrics/reviews/plan.review.md` | pending |
| ADD | `poggn/active/dashboard-optional-audit-token-metrics/reviews/task.review.md` | pending |
| UPDATE | `AGENTS.md` | `implementation/diffs/001_UPDATE_AGENTS_md.diff` |
| UPDATE | `.codex/add/WOKR-FLOW.md` | `implementation/diffs/002_UPDATE__codex_add_WOKR_FLOW_md.diff` |
| UPDATE | `.codex/add/STATE-CONTRACT.md` | `implementation/diffs/003_UPDATE__codex_add_STATE_CONTRACT_md.diff` |
| UPDATE | `.codex/sh/pgg-state-pack.sh` | `implementation/diffs/004_UPDATE__codex_sh_pgg_state_pack_sh.diff` |
| UPDATE | `.codex/skills/pgg-code/SKILL.md` | `implementation/diffs/005_UPDATE__codex_skills_pgg_code_SKILL_md.diff` |
| UPDATE | `.codex/skills/pgg-token/SKILL.md` | `implementation/diffs/006_UPDATE__codex_skills_pgg_token_SKILL_md.diff` |
| UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | `implementation/diffs/007_UPDATE_apps_dashboard_src_features_history_historyModel_ts.diff` |
| UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/008_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.diff` |
| UPDATE | `packages/core/src/index.ts` | `implementation/diffs/009_UPDATE_packages_core_src_index_ts.diff` |
| UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/010_UPDATE_packages_core_src_templates_ts.diff` |
| UPDATE | `packages/core/src/workflow-contract.ts` | `implementation/diffs/011_UPDATE_packages_core_src_workflow_contract_ts.diff` |
| ADD | `packages/core/test/dashboard-token-usage.test.mjs` | `implementation/diffs/012_ADD_packages_core_test_dashboard_token_usage_test_mjs.diff` |
| UPDATE | `packages/core/dist/index.d.ts` | `implementation/diffs/013_UPDATE_packages_core_dist_index_d_ts.diff` |
| UPDATE | `packages/core/dist/index.js` | `implementation/diffs/014_UPDATE_packages_core_dist_index_js.diff` |
| UPDATE | `packages/core/dist/index.js.map` | `implementation/diffs/015_UPDATE_packages_core_dist_index_js_map.diff` |
| UPDATE | `packages/core/dist/templates.js` | `implementation/diffs/016_UPDATE_packages_core_dist_templates_js.diff` |
| UPDATE | `packages/core/dist/templates.js.map` | `implementation/diffs/017_UPDATE_packages_core_dist_templates_js_map.diff` |
| UPDATE | `packages/core/dist/workflow-contract.d.ts` | `implementation/diffs/018_UPDATE_packages_core_dist_workflow_contract_d_ts.diff` |
| UPDATE | `packages/core/dist/workflow-contract.js` | `implementation/diffs/019_UPDATE_packages_core_dist_workflow_contract_js.diff` |
| UPDATE | `packages/core/dist/workflow-contract.js.map` | `implementation/diffs/020_UPDATE_packages_core_dist_workflow_contract_js_map.diff` |
| ADD | `poggn/active/dashboard-optional-audit-token-metrics/implementation/index.md` | pending |
| ADD | `poggn/active/dashboard-optional-audit-token-metrics/implementation/diffs/*.diff` | pending |
| ADD | `poggn/active/dashboard-optional-audit-token-metrics/reviews/code.review.md` | pending |
| ADD | `poggn/active/dashboard-optional-audit-token-metrics/state/token-usage.ndjson` | pending |
| UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | `implementation/diffs/021_REFACTOR_apps_dashboard_src_features_history_historyModel_ts.diff` |
| UPDATE | `packages/core/src/index.ts` | `implementation/diffs/022_REFACTOR_packages_core_src_index_ts.diff` |
| UPDATE | `packages/core/dist/index.js` | `implementation/diffs/023_REFACTOR_packages_core_dist_index_js.diff` |
| UPDATE | `packages/core/dist/index.js.map` | `implementation/diffs/024_REFACTOR_packages_core_dist_index_js_map.diff` |
| ADD | `poggn/active/dashboard-optional-audit-token-metrics/reviews/refactor.review.md` | pending |
| ADD | `poggn/active/dashboard-optional-audit-token-metrics/token/report.md` | pending |
| ADD | `poggn/active/dashboard-optional-audit-token-metrics/reviews/token.review.md` | pending |
| UPDATE | `poggn/active/dashboard-optional-audit-token-metrics/state/token-usage.ndjson` | pending |
| ADD | `poggn/active/dashboard-optional-audit-token-metrics/qa/report.md` | pending |
