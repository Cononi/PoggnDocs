---
pgg:
  topic: "pgg-llm-local-token-usage-accounting"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-28T01:56:51Z"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "3.0.1"
  short_name: "llm-accounting"
  working_branch: "ai/fix/3.0.1-llm-accounting"
  release_branch: "release/3.0.1-llm-accounting"
  project_scope: "current-project"
---

# Plan

## 목표

LLM provider usage metadata가 없는 topic에서도 LLM이 만든 artifact token이 0으로 고정되지 않게 하고, local shell/parser/handoff token과 분리해 dashboard와 state-pack에서 같은 의미로 보이게 한다.

## Active Specs

- `S1`: `spec/token/llm-artifact-fallback.md`
- `S2`: `spec/dashboard/token-summary-separation.md`
- `S3`: `spec/pgg/state-pack-token-summary.md`

## 단계

1. `packages/core/src/index.ts`의 token usage parser/aggregator를 수정해 LLM source record의 artifact fallback을 계산한다.
2. topic/file summary에서 LLM fallback은 LLM 값에만, local ledger record는 local 값에만 합산한다.
3. `pgg-state-pack.sh`와 generated template의 token summary 출력이 같은 fallback 기준을 사용하게 한다.
4. core regression test로 provider actual, LLM unavailable fallback, local-only 합산을 고정한다.
5. build된 `packages/core/dist/*`와 dashboard shared type을 동기화한다.

## 검증

- `pnpm --filter @pgg/core test`
- `pnpm --filter @pgg/dashboard build`
- `pgg-state-pack.sh` token summary smoke check

## Audit Applicability

- `pgg-token`: `required` | token usage ledger 해석과 dashboard token summary semantics를 바꾸는 topic이다.
- `pgg-performance`: `not_required` | 집계 로직과 표시 semantics 수정이며 별도 성능 민감 path나 performance contract는 없다.
