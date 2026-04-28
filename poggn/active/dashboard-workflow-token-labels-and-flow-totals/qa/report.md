---
pgg:
  topic: "dashboard-workflow-token-labels-and-flow-totals"
  stage: "qa"
  status: "done"
  skill: "pgg-qa"
  score: 96
  updated_at: "2026-04-28T02:33:20Z"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "3.0.2"
  short_name: "dashboard-totals"
  working_branch: "ai/fix/3.0.2-dashboard-totals"
  release_branch: "release/3.0.2-dashboard-totals"
  project_scope: "current-project"
---

# QA Report

## Decision

pass

## Verification

- `pnpm test:dashboard`: pass, 3 tests.
- `pnpm --filter @pgg/core test`: pass, 55 tests.
- `pnpm --filter @pgg/dashboard build`: pass, Vite chunk-size warning only.
- `.codex/sh/pgg-state-pack.sh dashboard-workflow-token-labels-and-flow-totals`: pass, token_usage_llm_total `53281`, token_usage_local_total `1063`, unavailable records `3`.
- `.codex/sh/pgg-gate.sh pgg-qa dashboard-workflow-token-labels-and-flow-totals`: pass.

## Required Audit

- `pgg-token`: pass, `token/report.md`
- `pgg-performance`: not_required

## 전문가 평가

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| QA/테스트 엔지니어 | 96 | dashboard history model test가 완료 flow별 LLM/local token record 합산을 검증했고 label 변경은 dashboard build로 확인됐다. | 없음 |
| SRE/운영 엔지니어 | 96 | Timeline 집계는 snapshot record만 사용하므로 런타임 부하가 작고, topic-level Overview total과 flow-level Timeline total의 역할이 분리됐다. | 없음 |

## Git Publish Message

- title: fix: 3.0.2.workflow token 표시
- why: dashboard workflow Overview와 Timeline에서 LLM token과 local token을 같은 사용량처럼 보이지 않게 분리 표기하고, Overview는 topic 누적치, Timeline은 완료 flow별 측정치를 보여야 한다.
- footer: Refs: dashboard-workflow-token-labels-and-flow-totals

## Archive Decision

QA pass이므로 archive helper 실행 대상이다.
