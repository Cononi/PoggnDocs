---
pgg:
  topic: "pgg-dashboard-flow-token-accounting-enforcement"
  stage: "token"
  status: "reviewed"
  skill: "pgg-token"
  score: 96
  updated_at: "2026-04-28T03:04:00Z"
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
- state-pack token_usage_llm_total: `47214`
- state-pack token_usage_local_total: `1063`

## 해석

- dashboard/core는 ledger가 없어도 topic artifact를 LLM token baseline으로 계산한다.
- local token은 shell/build/test/state-pack 등 local 실행 record만 합산한다.
- Timeline은 완료 flow별 file artifact baseline과 flow-scoped token record를 합산한다.
- 이후 생성/업데이트 프로젝트는 갱신된 core dist snapshot semantics를 사용한다.

## 전문가 평가

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 테크 리드 | 96 | LLM token과 local token의 source 경계가 코드와 테스트에서 모두 고정됐다. | 없음 |
| 코드 리뷰어 | 96 | no-ledger artifact baseline과 local record-only 회귀가 추가되어 사용자의 지적 사항을 직접 방지한다. | 없음 |

## Verification

- `state/token-usage.ndjson` parsed successfully with 6 records.
- `.codex/sh/pgg-state-pack.sh pgg-dashboard-flow-token-accounting-enforcement`: pass, token_usage_llm_total `47214`, token_usage_local_total `1063`, unavailable records `3`.
