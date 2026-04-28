---
pgg:
  topic: "pgg-token-accounting-and-reactflow-retirement"
  stage: "qa"
  status: "done"
  skill: "pgg-qa"
  score: 96
  updated_at: "2026-04-28T04:29:40Z"
  archive_type: "fix"
  project_scope: "current-project"
---

# QA Report

## Summary

- result: `pass`
- scope: token aggregation, React Flow retirement, refactor cleanup, required token audit, release readiness
- archive: `ready`

## Test Plan

| Area | Method | Expected |
|---|---|---|
| Actual LLM token contract | unit regression and dashboard snapshot | metadata 없는 LLM/artifact estimate가 `llmActualTokens`에 섞이지 않는다 |
| React Flow retirement | helper/template/status tests and search review | 새 topic 생성 경로가 `workflow.reactflow.json`을 만들지 않는다 |
| Dashboard timeline | dashboard history regression | flow token summary가 actual/local estimate를 분리한다 |
| Build integrity | workspace build | dist 산출물과 TypeScript contract가 동기화된다 |
| Required token audit | `token/report.md` | audit decision이 approved이고 blocker가 없다 |

## Execution Results

| Type | Command | Result | Evidence |
|---|---|---|---|
| workspace regression | `pnpm test` | pass | core 56개, dashboard history 3개 통과 |
| workspace build | `pnpm build` | pass | core, cli, dashboard build 통과 |
| dashboard token snapshot | `buildDashboardSnapshot(process.cwd())` | pass | `llmActualTokens:null`, `localEstimatedTokens:159770`, `ledgerRecordCount:0` |
| required token audit | `token/report.md` | pass | pgg-token audit approved |

## Acceptance Criteria

| Given | When | Then | Result | Evidence |
|---|---|---|---|---|
| usage metadata가 없는 LLM record가 있을 때 | dashboard token summary를 계산하면 | actual LLM 합계에 들어가지 않는다 | pass | `packages/core/test/dashboard-token-usage.test.mjs`, `pnpm test` |
| ledger가 없거나 artifact estimate만 있을 때 | topic token summary를 계산하면 | local estimate로 표시한다 | pass | dashboard snapshot `source: estimated` |
| 새 topic helper/template을 사용할 때 | topic skeleton을 생성하면 | `workflow.reactflow.json`을 만들지 않는다 | pass | status/new-topic regression test 통과 |
| workflow JSON이 없는 topic을 읽을 때 | dashboard health를 계산하면 | missing required artifact가 되지 않는다 | pass | `packages/core/test/status-analysis.test.mjs` |
| refactor 후 token record helper를 사용할 때 | source별 artifact record 존재를 확인하면 | LLM/local matching 동작은 유지된다 | pass | `pnpm test`, `pnpm build` |

## Edge And Failure Cases

| Case | Result | Evidence |
|---|---|---|
| metadata 없는 actual 후보 | pass | actual LLM token으로 합산하지 않는다 |
| unavailable measurement | pass | actual LLM token으로 합산하지 않는다 |
| diff artifact | pass | local estimated token으로 유지한다 |
| legacy `workflow.reactflow.json` read path | pass | parser는 남기고 신규 생성만 제거했다 |
| unrelated dirty blocker | pass | active 통합 완료 요청에 따라 전체 active 변경을 정리 commit으로 묶은 뒤 archive/publish를 진행한다 |

## Logs

| Check | Result | Evidence |
|---|---|---|
| error logs | pass | `pnpm test` 실패 없음 |
| unexpected warning | pass | Vite chunk size warning은 기존 dashboard bundle warning이며 기능 실패가 아니다 |
| retry / timeout | pass | test/build timeout 없음 |

## Runtime Flow

| Flow | Result | Evidence |
|---|---|---|
| token summary flow | pass | dashboard snapshot에서 actual/local 분리 확인 |
| topic generation flow | pass | React Flow 신규 생성 제거 regression 통과 |
| archive flow | ready | QA status done, Decision pass, required audit approved |

## Performance Smoke Check

| Check | Result | Evidence |
|---|---|---|
| response time abnormality | pass | test/build가 정상 종료됐다 |
| repeated call stability | pass | full workspace regression이 통과했다 |
| precision performance audit need | not_required | 성능 민감 runtime path 변경이 아니다 |

## Audit Applicability

- `pgg-token`: `required` | token usage 산정과 workflow artifact 제거 검증이 필요하다.
- `pgg-performance`: `not_required` | 성능 민감 변경이 아니다.

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| QA/테스트 엔지니어 | 96 | regression, build, snapshot evidence가 acceptance criteria를 충족한다. | 없음 |
| SRE / 운영 엔지니어 | 96 | QA pass와 required audit가 기록됐고 archive helper precondition을 만족한다. | 없음 |

## Decision

- pass

## Git Publish Message

- title: fix: 3.0.5.token accounting trim
- why: 실제 Codex usage metadata가 없는 산출물 추정치를 actual LLM token으로 표시하지 않고, 더 이상 사용하지 않는 React Flow workflow 산출물 생성을 중단해야 한다.
- footer: Refs: pgg-token-accounting-and-reactflow-retirement
