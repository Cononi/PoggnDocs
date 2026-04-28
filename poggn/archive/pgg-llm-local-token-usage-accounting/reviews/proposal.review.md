---
pgg:
  topic: "pgg-llm-local-token-usage-accounting"
  stage: "review"
  status: "reviewed"
  score: 94
  updated_at: "2026-04-28T01:55:28Z"
---

# proposal.review

## 전문가 메모

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 프로덕트 매니저 | 95 | 요구는 token usage 기능의 의미 오류 수정이다. `LLM 실사용`이 provider metadata 부재 때문에 0으로 고정되면 사용자가 실제 LLM 산출물 비용을 볼 수 없으므로 patch fix 범위가 타당하다. | 없음 |
| UX/UI 전문가 | 93 | dashboard에서 LLM과 local이 비슷하게 보이는 문제는 표시보다 집계 출처 문제다. file/topic 단위에서 LLM artifact fallback과 local ledger-only 합산을 분리해야 한다. | 없음 |

## 결정

approved

## Blocking Issues

없음
