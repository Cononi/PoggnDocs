# Current State

## Topic

pgg-llm-local-token-usage-accounting

## Current Stage

implementation

## Goal

LLM 생성 산출물 토큰과 local 처리 토큰의 집계 차이를 dashboard와 handoff에서 명확히 드러낸다.

## Next Action

`pgg-refactor`에서 구현 중복과 명명 정합성을 확인한다.

## Constraints

- project scope: `current-project`
- archive type: `fix`
- version bump: `patch`
- target version: `3.0.1`
- short name: `llm-accounting`
- working branch: `ai/fix/3.0.1-llm-accounting`
- release branch: `release/3.0.1-llm-accounting`

## User Question Record Ref

- `proposal.md` 섹션 `3. 사용자 입력 질문 기록`

## Requirements Summary

- LLM 실사용은 LLM이 실제로 만들어낸 산출물 token으로 쌓여야 한다.
- provider usage metadata가 없어 `source: "llm"` record가 0/unavailable로 남아도 artifact 기반 fallback으로 LLM 생성 토큰을 계산해야 한다.
- local 사용은 shell, git diff, state-pack, parser 등 사용자 환경에서 실행된 local 처리 사용량으로 분리해야 한다.
- dashboard topic/file summary와 state-pack handoff에서 LLM/local 차이가 명확히 보여야 한다.

## Scope

- core dashboard snapshot token usage parser/aggregation
- file/topic token attribution semantics
- state-pack token usage summary
- generated template propagation
- focused regression tests

## Plan Summary

- `S1`: `spec/token/llm-artifact-fallback.md`
- `S2`: `spec/dashboard/token-summary-separation.md`
- `S3`: `spec/pgg/state-pack-token-summary.md`

## Task Summary

- `T1`: done | LLM source record가 metadata 없이 zero total이어도 artifact content token estimate로 LLM 값에 반영한다.
- `T2`: done | topic/file summary에서 LLM fallback과 local ledger-only 합산을 분리하고 test로 검증했다.
- `T3`: done | state-pack script와 generated template의 token summary가 raw total zero만 사용하지 않는다.
- `T4`: done | core test, dashboard build, state-pack smoke check 결과를 기록했다.

## Implementation Summary

- `packages/core/src/index.ts`에 LLM direct token total과 artifact fallback token estimate를 분리하는 집계 helper를 추가했다.
- 같은 artifact에 direct LLM token record가 있으면 unavailable fallback을 중복 합산하지 않는다.
- local usage는 `source: "local"` ledger record만 합산해 LLM artifact fallback과 섞이지 않게 했다.
- `.codex/sh/pgg-state-pack.sh`와 generated template의 token usage summary도 같은 fallback 기준을 사용하게 했다.
- `packages/core/test/dashboard-token-usage.test.mjs`가 provider actual, metadata 없는 LLM actual, unavailable zero artifact fallback, local-only 합산을 검증한다.

## Token Usage

- ledger: `state/token-usage.ndjson`
- records: `7`
- llm records: `4`
- local records: `3`
- note: provider usage metadata is unavailable in this session, so LLM implementation records keep attribution and rely on artifact fallback semantics introduced by this topic.

## Verification

- `pnpm --filter @pgg/core test`: pass, 55 tests.
- `pnpm --filter @pgg/dashboard build`: pass, Vite chunk-size warning only.
- `.codex/sh/pgg-state-pack.sh dashboard-optional-audit-token-metrics`: pass, token_usage_llm_total `1167`, token_usage_local_total `1074`, unavailable records `6`.

## Audit Applicability

- `pgg-token`: `required` | token usage ledger 해석과 dashboard token summary semantics를 바꾸는 topic이다.
- `pgg-performance`: `not_required` | 집계 로직과 표시 semantics 수정이며 별도 성능 민감 path나 performance contract는 없다.

## Git Publish Message

- title: fix: 3.0.1.llm token 집계
- why: LLM이 만든 산출물이 provider usage metadata 부재 때문에 계속 0으로 보이고 local 처리 토큰과 구분되지 않아, artifact 기반 LLM 생성 토큰 fallback과 local ledger 분리 집계가 필요하다.
- footer: Refs: pgg-llm-local-token-usage-accounting

## Review Summary

- proposal review: approved
- plan review: approved
- task review: approved
- code review: approved
- score: `96`
- experts: 시니어 백엔드 엔지니어, 테크 리드
- blocking issues: 없음

## Next Workflow

- pgg-refactor

## Changed Files

| CRUD | Path | Diff |
|---|---|---|
| UPDATE | `.codex/sh/pgg-state-pack.sh` | `implementation/diffs/001_UPDATE__codex_sh_pgg-state-pack_sh.diff` |
| UPDATE | `packages/core/src/index.ts` | `implementation/diffs/002_UPDATE_packages_core_src_index_ts.diff` |
| UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/003_UPDATE_packages_core_src_templates_ts.diff` |
| UPDATE | `packages/core/test/dashboard-token-usage.test.mjs` | `implementation/diffs/004_UPDATE_packages_core_test_dashboard-token-usage_test_mjs.diff` |
| UPDATE | `packages/core/dist/index.js` | `implementation/diffs/005_UPDATE_packages_core_dist_index_js.diff` |
| UPDATE | `packages/core/dist/index.js.map` | `implementation/diffs/006_UPDATE_packages_core_dist_index_js_map.diff` |
| UPDATE | `packages/core/dist/templates.js` | `implementation/diffs/007_UPDATE_packages_core_dist_templates_js.diff` |
| UPDATE | `packages/core/dist/templates.js.map` | `implementation/diffs/008_UPDATE_packages_core_dist_templates_js_map.diff` |
| ADD | `poggn/active/pgg-llm-local-token-usage-accounting/proposal.md` | pending |
| ADD | `poggn/active/pgg-llm-local-token-usage-accounting/plan.md` | pending |
| ADD | `poggn/active/pgg-llm-local-token-usage-accounting/task.md` | pending |
| ADD | `poggn/active/pgg-llm-local-token-usage-accounting/spec/token/llm-artifact-fallback.md` | pending |
| ADD | `poggn/active/pgg-llm-local-token-usage-accounting/spec/dashboard/token-summary-separation.md` | pending |
| ADD | `poggn/active/pgg-llm-local-token-usage-accounting/spec/pgg/state-pack-token-summary.md` | pending |
| ADD | `poggn/active/pgg-llm-local-token-usage-accounting/reviews/proposal.review.md` | pending |
| ADD | `poggn/active/pgg-llm-local-token-usage-accounting/reviews/plan.review.md` | pending |
| ADD | `poggn/active/pgg-llm-local-token-usage-accounting/reviews/task.review.md` | pending |
| ADD | `poggn/active/pgg-llm-local-token-usage-accounting/reviews/code.review.md` | pending |
| ADD | `poggn/active/pgg-llm-local-token-usage-accounting/implementation/index.md` | pending |
| ADD | `poggn/active/pgg-llm-local-token-usage-accounting/implementation/diffs/*.diff` | pending |
| ADD | `poggn/active/pgg-llm-local-token-usage-accounting/state/current.md` | pending |
| ADD | `poggn/active/pgg-llm-local-token-usage-accounting/state/history.ndjson` | pending |
| ADD | `poggn/active/pgg-llm-local-token-usage-accounting/state/dirty-worktree-baseline.txt` | pending |
| ADD | `poggn/active/pgg-llm-local-token-usage-accounting/state/token-usage.ndjson` | pending |
| ADD | `poggn/active/pgg-llm-local-token-usage-accounting/workflow.reactflow.json` | pending |
