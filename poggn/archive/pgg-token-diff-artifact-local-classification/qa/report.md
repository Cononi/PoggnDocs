---
pgg:
  topic: "pgg-token-diff-artifact-local-classification"
  stage: "qa"
  status: "done"
  skill: "pgg-qa"
  score: 96
  updated_at: "2026-04-28T03:18:20Z"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "3.0.4"
  short_name: "token-classification"
  working_branch: "ai/fix/3.0.4-token-classification"
  release_branch: "release/3.0.4-token-classification"
  project_scope: "current-project"
---

# QA Report

## Decision

pass

## Verification

- `pnpm --filter @pgg/core test`: pass, 56 tests.
- `pnpm test:dashboard`: pass, 3 tests.
- `pnpm --filter @pgg/dashboard build`: pass, Vite chunk-size warning only.
- `.codex/sh/pgg-state-pack.sh pgg-token-diff-artifact-local-classification`: pass, token_usage_llm_total `45628`, token_usage_local_total `1063`, unavailable records `2`.
- `.codex/sh/pgg-gate.sh pgg-qa pgg-token-diff-artifact-local-classification`: pass.

## Required Audit

- `pgg-token`: pass, `token/report.md`
- `pgg-performance`: not_required

## 전문가 평가

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| QA/테스트 엔지니어 | 96 | core/dashboard tests가 diff artifact를 local token으로만 계산하는 회귀를 검증한다. | 없음 |
| SRE/운영 엔지니어 | 96 | 분류 로직은 path classifier 기반이라 runtime 영향이 작고 source 의미가 명확하다. | 없음 |

## Git Publish Message

- title: fix: 3.0.4.diff token 분류
- why: git diff 파일은 LLM이 생성해 실제로 적은 코드가 아니라 local command 출력이므로 LLM token에서 제외하고 local token으로 계산해야 한다.
- footer: Refs: pgg-token-diff-artifact-local-classification

## Archive Decision

QA pass이므로 archive helper 실행 대상이다.
