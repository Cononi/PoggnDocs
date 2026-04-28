---
pgg:
  topic: "pgg-llm-local-token-usage-accounting"
  stage: "token"
  status: "reviewed"
  skill: "pgg-token"
  score: 96
  updated_at: "2026-04-28T02:09:10Z"
  archive_type: "fix"
  project_scope: "current-project"
---

# Token Audit Report

## 판정

pass

## 측정 결과

- ledger: `state/token-usage.ndjson`
- records: `7`
- llm records: `4`
- local records: `3`
- unavailable records: `4`
- state-pack token_usage_llm_total: `84738`
- state-pack token_usage_local_total: `1223`

## 해석

- provider usage metadata는 세션에서 제공되지 않아 LLM record 자체의 `total_tokens`는 0/unavailable로 남는다.
- 이번 수정 후 dashboard/core와 state-pack은 topic artifact뿐 아니라 project file artifact도 읽어 LLM 생성 산출물 token estimate로 fallback한다.
- local 사용량은 core test, dashboard build, state-pack smoke output처럼 `source: "local"` record만 합산된다.
- LLM fallback 값이 local 합계로 섞이지 않아 사용자가 두 지표의 차이를 구분할 수 있다.

## 최적화 판단

- prompt 전문이나 파일 본문을 ledger에 복사하지 않고 artifact ref 기반으로 계산하므로 handoff 크기 증가를 피했다.
- project file fallback은 ledger에 등장한 LLM artifact path만 읽으므로 전체 repository scan을 추가하지 않는다.

## 전문가 평가

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 테크 리드 | 96 | ledger schema를 깨지 않고 LLM unavailable record를 artifact 기반으로 복구해 dashboard 지표 의미를 회복했다. | 없음 |
| 코드 리뷰어 | 96 | local record만 local total로 합산되는 점과 project file fallback test가 있어 회귀 위험이 낮다. | 없음 |

## Verification

- `state/token-usage.ndjson` parsed successfully with 7 records.
- `.codex/sh/pgg-state-pack.sh pgg-llm-local-token-usage-accounting`: pass, token_usage_llm_total `84738`, token_usage_local_total `1223`, unavailable records `4`.
