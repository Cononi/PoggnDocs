# Current State

## Topic

pgg-token-accounting-and-reactflow-retirement

## Current Stage

qa

## Goal

pgg-code 토큰 집계가 실제 Codex/provider usage metadata와 artifact 추정치를 섞지 않게 하고, React Flow workflow JSON 신규 생성을 중단한다.

## Constraints

- project scope: `current-project`
- archive type: `fix`
- version bump: `patch`
- target version: `3.0.5`
- short name: `token-retirement`
- working branch: `ai/fix/3.0.5-token-retirement`
- release branch: `release/3.0.5-token-retirement`

## User Question Record Ref

- `proposal.md` 섹션 `3. 사용자 입력 질문 기록`

## Active Specs

- `spec/token/actual-usage-metadata.md`
- `spec/workflow/reactflow-retirement.md`

## Active Tasks

- T1: 완료 | dashboard token aggregation을 실제 usage metadata 우선 계약으로 수정했다.
- T2: 완료 | `workflow.reactflow.json` 신규 생성과 필수 artifact 요구를 제거했다.
- T3: 완료 | 회귀 테스트와 pgg implementation 산출물을 갱신했다.

## Implementation Progress

- T1 완료: actual LLM token 집계를 provider usage metadata가 있는 record로 제한했다.
- T2 완료: `workflow.reactflow.json` 신규 생성 경로와 필수 artifact 요구를 제거했다.
- T3 완료: core/dashboard 테스트를 통과했고 implementation index, diff, code review를 기록했다.

## Refactor Progress

- token artifact record 존재 확인의 `llm`/`local` 중복 로직을 공통 source predicate helper로 정리했다.
- dashboard history timeline의 동일한 source별 record 확인 로직도 같은 구조로 맞췄다.
- `pnpm test`와 `pnpm build`가 통과했다.
- `pgg-stage-commit.sh` 실행 결과 unrelated dirty worktree 때문에 refactor completion commit은 deferred 처리됐다.

## Token Audit Progress

- required `pgg-token` audit를 실행하고 `token/report.md`에 기록했다.
- dashboard snapshot 기준 `llmActualTokens:null`, `localEstimatedTokens:159770`, `ledgerRecordCount:0`로 actual/local 분리 계약을 확인했다.

## QA Progress

- `pnpm test`, `pnpm build`, dashboard snapshot 확인이 통과했다.
- React Flow 신규 생성 제거와 legacy read 호환성, usage metadata 기반 actual LLM 집계 조건을 검증했다.
- active topic 통합 완료 요청에 따라 release blocker를 해소하고 archive/publish 준비를 완료했다.

## Changed Files

| CRUD | path | taskRef |
|---|---|---|
| UPDATE | `.codex/add/WOKR-FLOW.md` | T2 |
| UPDATE | `.codex/sh/pgg-new-topic.sh` | T2 |
| UPDATE | `.codex/sh/pgg-state-pack.sh` | T1 |
| UPDATE | `.codex/skills/pgg-add/SKILL.md` | T2 |
| UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | T1 |
| UPDATE | `packages/core/src/index.ts` | T1,T2 |
| UPDATE | `packages/core/src/templates.ts` | T1,T2 |
| UPDATE | `packages/core/dist/index.js` | T3 |
| UPDATE | `packages/core/dist/index.js.map` | T3 |
| UPDATE | `packages/core/dist/templates.js` | T3 |
| UPDATE | `packages/core/dist/templates.js.map` | T3 |
| UPDATE | `packages/core/test/dashboard-token-usage.test.mjs` | T3 |
| UPDATE | `packages/core/test/status-analysis.test.mjs` | T3 |
| UPDATE | `scripts/dashboard-history-model.test.mjs` | T3 |
| UPDATE | `packages/core/src/index.ts` | refactor |
| UPDATE | `packages/core/dist/index.js` | refactor |
| UPDATE | `packages/core/dist/index.js.map` | refactor |
| UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | refactor |
| CREATE | `poggn/active/pgg-token-accounting-and-reactflow-retirement/token/report.md` | token |
| CREATE | `poggn/active/pgg-token-accounting-and-reactflow-retirement/qa/report.md` | qa |
| UPDATE | `poggn/active/pgg-token-accounting-and-reactflow-retirement` | T3 |

## Latest Review

- refactor review: `reviews/refactor.review.md`
- token audit: `token/report.md`
- qa report: `qa/report.md`
- score: `96`
- blocking issues: 없음

## Refactor Git Evidence

- helper: `.codex/sh/pgg-stage-commit.sh`
- resultType: `publish_blocked`
- reason: `Unrelated worktree changes are present, so the stage-local commit was deferred.`
- commit title attempted: `fix: 3.0.5.토큰 record 중복 정리`

## QA Decision

- result: `pass`
- reason: required token audit, regression test, build, dashboard snapshot verification이 통과했고 active 통합 완료 요청으로 dirty blocker를 통합 commit으로 해소한다.

## Audit Applicability

- `pgg-token`: `required` | token usage 산정과 workflow artifact 제거 검증이 필요하다.
- `pgg-performance`: `not_required` | 성능 민감 변경이 아니다.

## Git Publish Message

- title: fix: 3.0.5.token accounting trim
- why: 실제 Codex usage metadata가 없는 산출물 추정치를 actual LLM token으로 표시하지 않고, 더 이상 사용하지 않는 React Flow workflow 산출물 생성을 중단해야 한다.
- footer: Refs: pgg-token-accounting-and-reactflow-retirement
