---
pgg:
  topic: "pgg-token-diff-artifact-local-classification"
  stage: "token"
  status: "reviewed"
  skill: "pgg-token"
  score: 96
  updated_at: "2026-04-28T03:17:10Z"
  archive_type: "fix"
  project_scope: "current-project"
---

# Token Audit Report

## 판정

pass

## 측정 결과

- ledger: `state/token-usage.ndjson`
- records: `5`
- llm records: `2`
- local records: `3`
- unavailable records: `2`
- state-pack token_usage_llm_total: `45628`
- state-pack token_usage_local_total: `1063`

## 해석

- diff artifact는 LLM token baseline에서 제외되고 local token artifact로 분류된다.
- 실제 코드/문서 artifact는 LLM token baseline을 유지한다.
- local token은 diff artifact baseline과 local source record를 반영한다.

## 전문가 평가

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 테크 리드 | 96 | git diff output과 실제 작성 코드를 다른 token source로 분리했다. | 없음 |
| 코드 리뷰어 | 96 | core/dashboard regression test가 diff local classification을 고정한다. | 없음 |

## Verification

- `.codex/sh/pgg-state-pack.sh pgg-token-diff-artifact-local-classification`: pass, token_usage_llm_total `45628`, token_usage_local_total `1063`, unavailable records `2`.
