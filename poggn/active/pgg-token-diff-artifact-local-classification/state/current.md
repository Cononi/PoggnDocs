# Current State

## Topic

pgg-token-diff-artifact-local-classification

## Current Stage

refactor

## Goal

git diff 산출물을 LLM token에서 제외하고 local token으로 분류한다.

## Next Action

`pgg-token` required audit를 수행한다.

## Constraints

- project scope: `current-project`
- archive type: `fix`
- version bump: `patch`
- target version: `3.0.4`
- short name: `token-classification`
- working branch: `ai/fix/3.0.4-token-classification`
- release branch: `release/3.0.4-token-classification`

## User Question Record Ref

- `proposal.md` 섹션 `3. 사용자 입력 질문 기록`

## Requirements Summary

- git diff 파일은 LLM이 만들어준 코드가 아니다.
- diff는 변경 사항을 보여 주는 local command 산출물이다.
- LLM token은 실제 코드를 받아서 적은 token이다.
- diff artifact는 LLM token에서 제외하고 local token으로 계산한다.

## Scope

- core snapshot file token classification
- dashboard Timeline flow token classification
- regression tests
- dist/generated project propagation

## Plan Summary

- `S1`: `spec/token/diff-artifact-local-token.md`
- `S2`: `spec/dashboard/diff-token-summary.md`
- `S3`: `spec/pgg/generated-project-propagation.md`

## Task Summary

- `T1`: done | diff artifact token estimate가 LLM token에 합산되지 않는다.
- `T2`: done | diff artifact token estimate가 local token에 합산된다.
- `T3`: done | Overview와 Timeline이 같은 diff classification을 사용한다.
- `T4`: done | core dist와 dashboard model/test가 동기화된다.

## Implementation Summary

- core snapshot에 local token artifact classifier를 추가해 `.diff`와 `implementation/diffs/*`를 LLM baseline에서 제외했다.
- diff artifact estimate는 local artifact baseline으로 합산한다.
- LLM record가 diff artifact를 가리켜도 LLM token에 합산하지 않는다.
- dashboard Timeline도 같은 classifier로 완료 flow별 diff artifact를 local token에 반영한다.
- core/dashboard regression test와 core dist 산출물을 갱신했다.

## Refactor Summary

- no-op refactor로 결정했다.
- diff local classification helper가 core와 dashboard에 명확히 분리되어 추가 구조 변경이 필요하지 않다.

## Token Usage

- ledger: `state/token-usage.ndjson`
- records: `5`
- llm records: `2`
- local records: `3`
- note: provider usage metadata is unavailable in this session, so LLM records preserve attribution while local records measure command output estimates.

## Verification

- `pnpm --filter @pgg/core test`: pass, 56 tests.
- `pnpm test:dashboard`: pass, 3 tests.
- `pnpm --filter @pgg/dashboard build`: pass, Vite chunk-size warning only.

## Audit Applicability

- `pgg-token`: `required` | token source classification semantics를 수정하는 topic이다.
- `pgg-performance`: `not_required` | file classification 분기 추가이며 별도 성능 민감 path는 없다.

## Git Publish Message

- title: fix: 3.0.4.diff token 분류
- why: git diff 파일은 LLM이 생성해 실제로 적은 코드가 아니라 local command 출력이므로 LLM token에서 제외하고 local token으로 계산해야 한다.
- footer: Refs: pgg-token-diff-artifact-local-classification

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
| ADD | `poggn/active/pgg-token-diff-artifact-local-classification/proposal.md` | pending |
| ADD | `poggn/active/pgg-token-diff-artifact-local-classification/plan.md` | pending |
| ADD | `poggn/active/pgg-token-diff-artifact-local-classification/task.md` | pending |
| ADD | `poggn/active/pgg-token-diff-artifact-local-classification/spec/token/diff-artifact-local-token.md` | pending |
| ADD | `poggn/active/pgg-token-diff-artifact-local-classification/spec/dashboard/diff-token-summary.md` | pending |
| ADD | `poggn/active/pgg-token-diff-artifact-local-classification/spec/pgg/generated-project-propagation.md` | pending |
| ADD | `poggn/active/pgg-token-diff-artifact-local-classification/reviews/proposal.review.md` | pending |
| ADD | `poggn/active/pgg-token-diff-artifact-local-classification/reviews/plan.review.md` | pending |
| ADD | `poggn/active/pgg-token-diff-artifact-local-classification/reviews/task.review.md` | pending |
| ADD | `poggn/active/pgg-token-diff-artifact-local-classification/reviews/code.review.md` | pending |
| ADD | `poggn/active/pgg-token-diff-artifact-local-classification/reviews/refactor.review.md` | pending |
| ADD | `poggn/active/pgg-token-diff-artifact-local-classification/implementation/index.md` | pending |
| ADD | `poggn/active/pgg-token-diff-artifact-local-classification/implementation/diffs/*.diff` | pending |
| ADD | `poggn/active/pgg-token-diff-artifact-local-classification/state/current.md` | pending |
| ADD | `poggn/active/pgg-token-diff-artifact-local-classification/state/history.ndjson` | pending |
| ADD | `poggn/active/pgg-token-diff-artifact-local-classification/state/dirty-worktree-baseline.txt` | pending |
| ADD | `poggn/active/pgg-token-diff-artifact-local-classification/state/token-usage.ndjson` | pending |
| ADD | `poggn/active/pgg-token-diff-artifact-local-classification/workflow.reactflow.json` | pending |
