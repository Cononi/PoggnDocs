---
pgg:
  topic: "pgg-dashboard-flow-token-accounting-enforcement"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-28T02:56:00Z"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "3.0.3"
  short_name: "dashboard-enforcement"
  working_branch: "ai/fix/3.0.3-dashboard-enforcement"
  release_branch: "release/3.0.3-dashboard-enforcement"
  project_scope: "current-project"
---

# Plan

## 목표

dashboard가 ledger record 유무와 관계없이 flow 산출물을 LLM token으로 계산하고, local 실행 record만 local token으로 계산하게 한다.

## Active Specs

- `S1`: `spec/token/llm-artifact-token-baseline.md`
- `S2`: `spec/token/local-record-only-token.md`
- `S3`: `spec/dashboard/overview-and-timeline-flow-tokens.md`
- `S4`: `spec/pgg/generated-project-propagation.md`

## 단계

1. core topic file 기본 token attribution을 local fallback에서 LLM artifact baseline으로 바꾼다.
2. topic total summary가 flow 산출물 LLM token과 local record token을 분리 계산하게 한다.
3. dashboard Timeline row가 완료 flow의 file artifact LLM token과 flow-scoped token records를 합쳐 보여 주게 한다.
4. generated project가 같은 core/dashboard/template semantics를 쓰도록 dist/template 산출물을 동기화한다.
5. dashboard/core regression test로 ledger 없는 LLM artifact 계산과 local record-only 계산을 고정한다.

## 검증

- `pnpm test:dashboard`
- `pnpm --filter @pgg/core test`
- `pnpm --filter @pgg/dashboard build`

## Audit Applicability

- `pgg-token`: `required` | token 계산 semantics와 generated project propagation을 수정하는 topic이다.
- `pgg-performance`: `not_required` | 계산 범위는 snapshot data와 flow artifact 목록이며 별도 runtime performance contract는 없다.
