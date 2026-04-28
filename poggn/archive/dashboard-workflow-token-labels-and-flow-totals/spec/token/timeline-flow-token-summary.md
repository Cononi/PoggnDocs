# S3. Timeline Flow Token Summary

## 규칙

- Timeline은 완료된 flow row만 표시한다.
- 각 Timeline row의 token 값은 `topic.tokenUsageRecords` 중 해당 flow/stage에 귀속된 record만 합산한다.
- `source: "llm"` record는 LLM token으로만 합산한다.
- `source: "local"` record는 local token으로만 합산한다.
- record에 `flow`가 있으면 `pgg-code`, `pgg-qa` 같은 값을 workflow flow id로 normalize한다.
- record에 `flow`가 없으면 `stage`를 flow id로 normalize한다.

## 수용 기준

- 완료된 Code flow row는 implementation/pgg-code record만 token에 반영한다.
- 완료된 QA flow row는 qa/pgg-qa record만 token에 반영한다.
- file estimate fallback은 Timeline row token 총합에 섞지 않는다.
