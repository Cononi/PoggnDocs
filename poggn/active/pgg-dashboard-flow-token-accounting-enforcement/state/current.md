# Current State

## Topic

pgg-dashboard-flow-token-accounting-enforcement

## Current Stage

refactor

## Goal

dashboard가 모든 flow의 LLM token과 local token을 계산해 Overview와 Timeline에 보이도록 강제한다.

## Next Action

`pgg-token` required audit를 수행한다.

## Constraints

- project scope: `current-project`
- archive type: `fix`
- version bump: `patch`
- target version: `3.0.3`
- short name: `dashboard-enforcement`
- working branch: `ai/fix/3.0.3-dashboard-enforcement`
- release branch: `release/3.0.3-dashboard-enforcement`

## User Question Record Ref

- `proposal.md` 섹션 `3. 사용자 입력 질문 기록`

## Requirements Summary

- 모든 flow마다 LLM token과 local token을 계산한다.
- dashboard Overview는 topic 전체 LLM/local token 누적 합계를 보여준다.
- dashboard Timeline은 완료된 각 flow의 LLM/local token 측정치를 보여준다.
- LLM token은 LLM과 소통해 생성/전달받은 모든 산출물 token이다.
- local token은 shell, git 등 local 실행으로 만들어진 token이다.
- 이후 생성되는 모든 프로젝트에도 같은 계산 규칙을 적용한다.

## Scope

- dashboard/core flow token 계산 fallback
- Overview topic token total semantics
- Timeline completed-flow token summary
- generated project propagation
- regression tests

## Plan Summary

- `S1`: `spec/token/llm-artifact-token-baseline.md`
- `S2`: `spec/token/local-record-only-token.md`
- `S3`: `spec/dashboard/overview-and-timeline-flow-tokens.md`
- `S4`: `spec/pgg/generated-project-propagation.md`

## Task Summary

- `T1`: done | ledger가 없어도 flow artifact token estimate가 LLM token으로 계산된다.
- `T2`: done | local token은 `source: "local"` record만 합산하고 artifact estimate로 증가하지 않는다.
- `T3`: done | Overview는 topic 전체, Timeline은 완료 flow별 LLM/local token을 표시한다.
- `T4`: done | core dist/template과 generated project path에 같은 semantics가 반영된다.
- `T5`: done | dashboard/core test와 dashboard build 검증 결과가 기록됐다.

## Implementation Summary

- core topic file artifact 기본 token attribution을 local fallback에서 LLM baseline으로 변경했다.
- local token은 `source: "local"` record만 합산하도록 유지하고, artifact estimate가 local token을 증가시키지 않게 했다.
- Overview topic total은 LLM artifact baseline + LLM record + local record 합계로 계산된다.
- Timeline row는 완료 flow별 file artifact LLM baseline과 flow-scoped token record를 중복 없이 합산한다.
- core dist 산출물을 갱신해 이후 생성/업데이트 프로젝트도 같은 snapshot semantics를 사용하게 했다.

## Refactor Summary

- no-op refactor로 결정했다.
- core와 dashboard helper가 LLM baseline, LLM record, local record 역할로 분리되어 추가 구조 변경이 필요하지 않다.

## Token Usage

- ledger: `state/token-usage.ndjson`
- records: `6`
- llm records: `3`
- local records: `3`
- note: provider usage metadata is unavailable in this session, so LLM records preserve attribution while local records measure command output estimates.

## Verification

- `pnpm --filter @pgg/core test`: pass, 56 tests.
- `pnpm test:dashboard`: pass, 3 tests.
- `pnpm --filter @pgg/dashboard build`: pass, Vite chunk-size warning only.

## Audit Applicability

- `pgg-token`: `required` | token 계산 semantics와 generated project propagation을 수정하는 topic이다.
- `pgg-performance`: `not_required` | 계산 범위는 snapshot data와 flow artifact 목록이며 별도 runtime performance contract는 없다.

## Git Publish Message

- title: fix: 3.0.3.flow token 계산
- why: dashboard가 ledger record 존재 여부에 의존하지 않고 각 flow의 LLM token과 local token을 계산해 Overview와 Timeline에 명확히 보여야 한다.
- footer: Refs: pgg-dashboard-flow-token-accounting-enforcement

## Review Summary

- proposal review: approved
- plan review: approved
- task review: approved
- code review: approved
- refactor review: approved
- score: `96`
- experts: 소프트웨어 아키텍트, 코드 리뷰어
- blocking issues: 없음

## Next Workflow

- pgg-token

## Changed Files

| CRUD | Path | Diff |
|---|---|---|
| UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | `implementation/diffs/001_UPDATE_apps_dashboard_src_features_history_historyModel_ts.diff` |
| UPDATE | `packages/core/src/index.ts` | `implementation/diffs/002_UPDATE_packages_core_src_index_ts.diff` |
| UPDATE | `packages/core/test/dashboard-token-usage.test.mjs` | `implementation/diffs/003_UPDATE_packages_core_test_dashboard-token-usage_test_mjs.diff` |
| UPDATE | `scripts/dashboard-history-model.test.mjs` | `implementation/diffs/004_UPDATE_scripts_dashboard-history-model_test_mjs.diff` |
| UPDATE | `packages/core/dist/index.js` | `implementation/diffs/005_UPDATE_packages_core_dist_index_js.diff` |
| UPDATE | `packages/core/dist/index.js.map` | `implementation/diffs/006_UPDATE_packages_core_dist_index_js_map.diff` |
| ADD | `poggn/active/pgg-dashboard-flow-token-accounting-enforcement/proposal.md` | pending |
| ADD | `poggn/active/pgg-dashboard-flow-token-accounting-enforcement/plan.md` | pending |
| ADD | `poggn/active/pgg-dashboard-flow-token-accounting-enforcement/task.md` | pending |
| ADD | `poggn/active/pgg-dashboard-flow-token-accounting-enforcement/spec/token/llm-artifact-token-baseline.md` | pending |
| ADD | `poggn/active/pgg-dashboard-flow-token-accounting-enforcement/spec/token/local-record-only-token.md` | pending |
| ADD | `poggn/active/pgg-dashboard-flow-token-accounting-enforcement/spec/dashboard/overview-and-timeline-flow-tokens.md` | pending |
| ADD | `poggn/active/pgg-dashboard-flow-token-accounting-enforcement/spec/pgg/generated-project-propagation.md` | pending |
| ADD | `poggn/active/pgg-dashboard-flow-token-accounting-enforcement/reviews/proposal.review.md` | pending |
| ADD | `poggn/active/pgg-dashboard-flow-token-accounting-enforcement/reviews/plan.review.md` | pending |
| ADD | `poggn/active/pgg-dashboard-flow-token-accounting-enforcement/reviews/task.review.md` | pending |
| ADD | `poggn/active/pgg-dashboard-flow-token-accounting-enforcement/reviews/code.review.md` | pending |
| ADD | `poggn/active/pgg-dashboard-flow-token-accounting-enforcement/reviews/refactor.review.md` | pending |
| ADD | `poggn/active/pgg-dashboard-flow-token-accounting-enforcement/implementation/index.md` | pending |
| ADD | `poggn/active/pgg-dashboard-flow-token-accounting-enforcement/implementation/diffs/*.diff` | pending |
| ADD | `poggn/active/pgg-dashboard-flow-token-accounting-enforcement/state/current.md` | pending |
| ADD | `poggn/active/pgg-dashboard-flow-token-accounting-enforcement/state/history.ndjson` | pending |
| ADD | `poggn/active/pgg-dashboard-flow-token-accounting-enforcement/state/dirty-worktree-baseline.txt` | pending |
| ADD | `poggn/active/pgg-dashboard-flow-token-accounting-enforcement/state/token-usage.ndjson` | pending |
| ADD | `poggn/active/pgg-dashboard-flow-token-accounting-enforcement/workflow.reactflow.json` | pending |
