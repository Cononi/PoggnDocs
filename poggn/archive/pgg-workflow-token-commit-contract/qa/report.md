---
pgg:
  topic: "pgg-workflow-token-commit-contract"
  stage: "qa"
  status: "done"
  skill: "pgg-qa"
  score: 98
  updated_at: "2026-04-28T01:48:08Z"
---

# QA Report

## Decision

pass

## Audit Applicability

- [pgg-token]: [required] | token 측정 정확도, source 분리, actual/unavailable/estimated 계약을 직접 변경하는 topic이다.
- [pgg-performance]: [not_required] | 모바일 workflow process scaling은 UI layout 계약이며 별도 성능 민감 runtime path나 선언된 performance verification contract는 없다.

## Test Plan

- required `pgg-token` audit report가 존재하고 QA gate가 통과하는지 확인한다.
- core token ledger/parser, task commit, generated asset 회귀 테스트를 실행한다.
- dashboard build가 token clip과 mobile workflow process 변경을 포함해 통과하는지 확인한다.
- archive 전 QA report와 release publish metadata가 충분한지 확인한다.

## Execution Results

- `./.codex/sh/pgg-gate.sh pgg-qa pgg-workflow-token-commit-contract`: pass.
- `pnpm --filter @pgg/core test`: pass, 55 tests.
- `pnpm --filter @pgg/dashboard build`: pass, Vite chunk-size warning only.
- `node packages/cli/dist/index.js update`: 이전 실행 기준 second run `status: unchanged`, `conflicts: 0`.
- `pgg-token` audit: pass, `token/report.md` exists.

## Token Audit Evidence

- LLM actual tokens: unavailable/null, Codex response usage metadata ledger가 없으므로 요금 계산용 actual로 쓰지 않는다.
- Local estimated tokens: 151,584.
- ledger record count: 0.
- dashboard token source: estimated.
- LLM actual이 `null`인 상태를 `0`으로 대체하지 않는 계약을 확인했다.

## Scope Verification

- workflow process는 모바일에서도 horizontal process 형태를 유지한다.
- token 표시는 LLM clip과 Local clip으로 분리된다.
- LLM actual 집계는 usage metadata available actual record만 포함한다.
- task 행 단위 commit evidence가 T1...T6에 남아 있다.
- pgg-generated 문서와 pgg-managed 주석 계약은 pgg lang을 따른다.
- source template, generated workspace asset, dist, README, tests가 동기화되어 있다.

## Expert Notes

### QA/테스트 엔지니어

- score: 98
- judgment: required audit와 핵심 회귀 테스트가 모두 통과했고, 이전 QA blocking issue였던 `token/report.md` 누락이 해소됐다.
- blocking issues: 없음

### SRE / 운영 엔지니어

- score: 98
- judgment: archive/release 전 operational blocker는 없으며, token actual unavailable 상태를 요금 actual로 승격하지 않는 점이 명확히 기록됐다.
- blocking issues: 없음

## Git Publish Message

- title: feat: 3.0.0.token commit contract
- why: workflow process는 모바일에서도 같은 형태를 유지해야 하고, token 비용 지표는 LLM actual과 Local source를 분리해야 하며, pgg-code task 행 단위 commit과 pgg lang 문서/주석 계약이 workflow 신뢰성을 결정한다.
- footer: Refs: pgg-workflow-token-commit-contract

## Final Decision

QA pass. Archive를 진행한다.
