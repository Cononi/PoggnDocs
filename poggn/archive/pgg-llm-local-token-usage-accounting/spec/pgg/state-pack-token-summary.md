# S3. State-Pack Token Summary

## 규칙

- `.codex/sh/pgg-state-pack.sh`는 token usage ledger summary를 만들 때 `source: "llm"` raw total만 더하지 않는다.
- LLM record가 zero/unavailable이고 artifact path가 topic file과 매칭되면 artifact content token estimate를 LLM generated total에 반영한다.
- local total은 `source: "local"` record의 total만 반영한다.
- generated template의 state-pack script도 같은 로직을 포함한다.

## 수용 기준

- `token_usage_llm_total`은 metadata 없는 LLM artifact record가 있을 때 0으로 고정되지 않는다.
- `token_usage_local_total`은 local record만 반영한다.
- `token_usage_unavailable_records`는 기존처럼 unavailable record 수를 유지한다.
