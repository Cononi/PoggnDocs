# Current State

## Topic

pgg-token-accounting-and-reactflow-retirement

## Current Stage

implementation

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
| UPDATE | `poggn/active/pgg-token-accounting-and-reactflow-retirement` | T3 |

## Audit Applicability

- `pgg-token`: `required` | token usage 산정과 workflow artifact 제거 검증이 필요하다.
- `pgg-performance`: `not_required` | 성능 민감 변경이 아니다.

## Git Publish Message

- title: fix: 3.0.5.token accounting trim
- why: 실제 Codex usage metadata가 없는 산출물 추정치를 actual LLM token으로 표시하지 않고, 더 이상 사용하지 않는 React Flow workflow 산출물 생성을 중단해야 한다.
- footer: Refs: pgg-token-accounting-and-reactflow-retirement
