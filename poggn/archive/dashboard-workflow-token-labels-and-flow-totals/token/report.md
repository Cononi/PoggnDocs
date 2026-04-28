---
pgg:
  topic: "dashboard-workflow-token-labels-and-flow-totals"
  stage: "token"
  status: "reviewed"
  skill: "pgg-token"
  score: 96
  updated_at: "2026-04-28T02:32:20Z"
  archive_type: "fix"
  project_scope: "current-project"
---

# Token Audit Report

## 판정

pass

## 측정 결과

- ledger: `state/token-usage.ndjson`
- records: `6`
- llm records: `3`
- local records: `3`
- unavailable records: `3`
- state-pack token_usage_llm_total: `53281`
- state-pack token_usage_local_total: `1063`

## 해석

- dashboard Timeline은 `flow`/`stage` 기준으로 token records를 필터링하므로 완료 flow별 token 측정치를 별도 적용한다.
- LLM token은 LLM source record와 artifactTokenEstimate fallback을 사용한다.
- local token은 local source record의 `total_tokens`만 사용한다.
- Overview는 topic-level `tokenUsage` 누적치를 유지한다.

## 전문가 평가

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 테크 리드 | 96 | LLM/local source 분리와 flow-scoped Timeline 합산이 token ledger 의미와 일치한다. | 없음 |
| 코드 리뷰어 | 96 | required audit 기준인 source 분리, measurement 표시, dashboard summary 사용 가능성이 충족된다. | 없음 |

## Verification

- `state/token-usage.ndjson` parsed successfully with 6 records.
- `.codex/sh/pgg-state-pack.sh dashboard-workflow-token-labels-and-flow-totals`: pass, token_usage_llm_total `53281`, token_usage_local_total `1063`, unavailable records `3`.
