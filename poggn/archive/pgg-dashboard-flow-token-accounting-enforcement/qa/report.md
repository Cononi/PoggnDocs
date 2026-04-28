---
pgg:
  topic: "pgg-dashboard-flow-token-accounting-enforcement"
  stage: "qa"
  status: "done"
  skill: "pgg-qa"
  score: 96
  updated_at: "2026-04-28T03:05:00Z"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "3.0.3"
  short_name: "dashboard-enforcement"
  working_branch: "ai/fix/3.0.3-dashboard-enforcement"
  release_branch: "release/3.0.3-dashboard-enforcement"
  project_scope: "current-project"
---

# QA Report

## Decision

pass

## Verification

- `pnpm --filter @pgg/core test`: pass, 56 tests.
- `pnpm test:dashboard`: pass, 3 tests.
- `pnpm --filter @pgg/dashboard build`: pass, Vite chunk-size warning only.
- `.codex/sh/pgg-state-pack.sh pgg-dashboard-flow-token-accounting-enforcement`: pass, token_usage_llm_total `47214`, token_usage_local_total `1063`, unavailable records `3`.
- `.codex/sh/pgg-gate.sh pgg-qa pgg-dashboard-flow-token-accounting-enforcement`: pass.

## Required Audit

- `pgg-token`: pass, `token/report.md`
- `pgg-performance`: not_required

## 전문가 평가

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| QA/테스트 엔지니어 | 96 | core no-ledger test와 dashboard Timeline test가 LLM artifact baseline 및 local record-only 계산을 검증한다. | 없음 |
| SRE/운영 엔지니어 | 96 | 계산은 snapshot artifact와 token records 기반이며 local 실행 token과 LLM 산출물 token이 분리된다. | 없음 |

## Git Publish Message

- title: fix: 3.0.3.flow token 계산
- why: dashboard가 ledger record 존재 여부에 의존하지 않고 각 flow의 LLM token과 local token을 계산해 Overview와 Timeline에 명확히 보여야 한다.
- footer: Refs: pgg-dashboard-flow-token-accounting-enforcement

## Archive Decision

QA pass이므로 archive helper 실행 대상이다.
