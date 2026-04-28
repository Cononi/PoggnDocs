# Current State

## Topic

dashboard-workflow-token-labels-and-flow-totals

## Current Stage

refactor

## Goal

dashboard workflow token 지표의 명칭과 flow별 누적/완료 반영 기준을 정리한다.

## Next Action

`pgg-token` required audit를 수행한다.

## Constraints

- project scope: `current-project`
- archive type: `fix`
- version bump: `patch`
- target version: `3.0.2`
- short name: `dashboard-totals`
- working branch: `ai/fix/3.0.2-dashboard-totals`
- release branch: `release/3.0.2-dashboard-totals`

## User Question Record Ref

- `proposal.md` 섹션 `3. 사용자 입력 질문 기록`

## Requirements Summary

- dashboard workflow Overview와 Timeline에서 `LLM token`, `local token`으로 표기한다.
- Overview는 flow 진행마다 누적된 topic 전체 LLM/local token 총사용량을 표시한다.
- Timeline은 완료된 flow row마다 해당 flow에 귀속된 LLM/local token 측정치를 적용한다.
- LLM token과 local token은 서로 다른 source 영역이며 서로 합산하거나 fallback을 공유하지 않는다.

## Scope

- dashboard locale token label
- Overview topic-level token total display
- Timeline flow-scoped token summary
- core/dashboard model regression coverage

## Plan Summary

- `S1`: `spec/dashboard/token-labels.md`
- `S2`: `spec/token/overview-topic-token-total.md`
- `S3`: `spec/token/timeline-flow-token-summary.md`

## Task Summary

- `T1`: done | Overview와 Timeline token chip label이 `LLM token`, `local token`으로 표시된다.
- `T2`: done | Overview는 topic-level tokenUsage 누적 합계를 계속 표시한다.
- `T3`: done | Timeline row는 완료 flow별 tokenUsageRecords를 source별로 합산한다.
- `T4`: done | dashboard/core test와 dashboard build 검증 결과를 기록했다.

## Implementation Summary

- dashboard locale의 LLM/local token chip label을 Korean/English 모두 `LLM token`, `local token`으로 변경했다.
- Overview는 기존 `topic.tokenUsage` topic-level 누적 합계를 그대로 표시한다.
- Timeline row는 완료 flow별 `topic.tokenUsageRecords`를 flow/stage normalize 기준으로 필터링해 LLM/local source별로 합산한다.
- core snapshot token record에 `artifactTokenEstimate`를 추가해 LLM unavailable record도 dashboard Timeline에서 flow별 fallback 합산할 수 있게 했다.
- dashboard history model test에 완료 flow별 token record 합산 회귀를 추가했다.

## Refactor Summary

- no-op refactor로 결정했다.
- flow record filtering, LLM 합산, local 합산 helper가 분리되어 추가 구조 변경이 필요하지 않다.

## Token Usage

- ledger: `state/token-usage.ndjson`
- records: `6`
- llm records: `3`
- local records: `3`
- note: provider usage metadata is unavailable in this session, so LLM records keep attribution while local records measure command output estimates.

## Verification

- `pnpm test:dashboard`: pass, 3 tests.
- `pnpm --filter @pgg/core test`: pass, 55 tests.
- `pnpm --filter @pgg/dashboard build`: pass, Vite chunk-size warning only.

## Audit Applicability

- `pgg-token`: `required` | dashboard token metric label과 flow-scoped token summary semantics를 수정하는 topic이다.
- `pgg-performance`: `not_required` | 표시와 집계 범위 수정이며 별도 성능 민감 runtime path는 없다.

## Git Publish Message

- title: fix: 3.0.2.workflow token 표시
- why: dashboard workflow Overview와 Timeline에서 LLM token과 local token을 같은 사용량처럼 보이지 않게 분리 표기하고, Overview는 topic 누적치, Timeline은 완료 flow별 측정치를 보여야 한다.
- footer: Refs: dashboard-workflow-token-labels-and-flow-totals

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
| UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/002_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` |
| UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/003_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.diff` |
| UPDATE | `packages/core/src/index.ts` | `implementation/diffs/004_UPDATE_packages_core_src_index_ts.diff` |
| UPDATE | `packages/core/dist/index.d.ts` | `implementation/diffs/005_UPDATE_packages_core_dist_index_d_ts.diff` |
| UPDATE | `packages/core/dist/index.js` | `implementation/diffs/006_UPDATE_packages_core_dist_index_js.diff` |
| UPDATE | `packages/core/dist/index.js.map` | `implementation/diffs/007_UPDATE_packages_core_dist_index_js_map.diff` |
| UPDATE | `scripts/dashboard-history-model.test.mjs` | `implementation/diffs/008_UPDATE_scripts_dashboard-history-model_test_mjs.diff` |
| ADD | `poggn/active/dashboard-workflow-token-labels-and-flow-totals/proposal.md` | pending |
| ADD | `poggn/active/dashboard-workflow-token-labels-and-flow-totals/plan.md` | pending |
| ADD | `poggn/active/dashboard-workflow-token-labels-and-flow-totals/task.md` | pending |
| ADD | `poggn/active/dashboard-workflow-token-labels-and-flow-totals/spec/dashboard/token-labels.md` | pending |
| ADD | `poggn/active/dashboard-workflow-token-labels-and-flow-totals/spec/token/overview-topic-token-total.md` | pending |
| ADD | `poggn/active/dashboard-workflow-token-labels-and-flow-totals/spec/token/timeline-flow-token-summary.md` | pending |
| ADD | `poggn/active/dashboard-workflow-token-labels-and-flow-totals/reviews/proposal.review.md` | pending |
| ADD | `poggn/active/dashboard-workflow-token-labels-and-flow-totals/reviews/plan.review.md` | pending |
| ADD | `poggn/active/dashboard-workflow-token-labels-and-flow-totals/reviews/task.review.md` | pending |
| ADD | `poggn/active/dashboard-workflow-token-labels-and-flow-totals/reviews/code.review.md` | pending |
| ADD | `poggn/active/dashboard-workflow-token-labels-and-flow-totals/reviews/refactor.review.md` | pending |
| ADD | `poggn/active/dashboard-workflow-token-labels-and-flow-totals/implementation/index.md` | pending |
| ADD | `poggn/active/dashboard-workflow-token-labels-and-flow-totals/implementation/diffs/*.diff` | pending |
| ADD | `poggn/active/dashboard-workflow-token-labels-and-flow-totals/state/current.md` | pending |
| ADD | `poggn/active/dashboard-workflow-token-labels-and-flow-totals/state/history.ndjson` | pending |
| ADD | `poggn/active/dashboard-workflow-token-labels-and-flow-totals/state/dirty-worktree-baseline.txt` | pending |
| ADD | `poggn/active/dashboard-workflow-token-labels-and-flow-totals/state/token-usage.ndjson` | pending |
| ADD | `poggn/active/dashboard-workflow-token-labels-and-flow-totals/workflow.reactflow.json` | pending |
