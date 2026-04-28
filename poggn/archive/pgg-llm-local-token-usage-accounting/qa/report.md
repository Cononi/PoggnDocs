---
pgg:
  topic: "pgg-llm-local-token-usage-accounting"
  stage: "qa"
  status: "done"
  skill: "pgg-qa"
  score: 96
  updated_at: "2026-04-28T02:13:20Z"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "3.0.1"
  short_name: "llm-accounting"
  working_branch: "ai/fix/3.0.1-llm-accounting"
  release_branch: "release/3.0.1-llm-accounting"
  project_scope: "current-project"
---

# QA Report

## Decision

pass

## Verification

- `pnpm --filter @pgg/core test`: pass, 55 tests.
- `pnpm --filter @pgg/dashboard build`: pass, Vite chunk-size warning only.
- `.codex/sh/pgg-state-pack.sh pgg-llm-local-token-usage-accounting`: pass, token_usage_llm_total `84738`, token_usage_local_total `1223`, unavailable records `4`.
- `.codex/sh/pgg-gate.sh pgg-qa pgg-llm-local-token-usage-accounting`: pass.

## Required Audit

- `pgg-token`: pass, `token/report.md`
- `pgg-performance`: not_required

## 전문가 평가

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| QA/테스트 엔지니어 | 96 | provider actual, metadata 없는 LLM actual, topic artifact fallback, project file artifact fallback, local-only 합산이 core test로 검증됐다. | 없음 |
| SRE/운영 엔지니어 | 96 | fallback은 ledger에 등장한 artifact path만 읽어 repository 전체 scan을 추가하지 않으며 state-pack smoke check도 통과했다. | 없음 |

## Git Publish Message

- title: fix: 3.0.1.llm token 집계
- why: LLM이 만든 산출물이 provider usage metadata 부재 때문에 계속 0으로 보이고 local 처리 토큰과 구분되지 않아, artifact 기반 LLM 생성 토큰 fallback과 local ledger 분리 집계가 필요하다.
- footer: Refs: pgg-llm-local-token-usage-accounting

## Archive Decision

QA pass이므로 archive helper 실행 대상이다.
