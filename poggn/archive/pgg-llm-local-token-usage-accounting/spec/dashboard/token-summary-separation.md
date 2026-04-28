# S2. Dashboard Token Summary Separation

## 규칙

- `TopicTokenUsage.llmActualTokens`는 provider actual LLM token과 LLM artifact fallback token을 합산한 값이다.
- `TopicTokenUsage.localEstimatedTokens`는 `source: "local"` ledger record만 합산한다.
- file row도 같은 기준으로 해당 artifact record만 반영한다.
- ledger가 전혀 없는 topic의 기존 file estimate fallback은 유지하되, ledger가 있는 topic에서는 local fallback으로 LLM 산출물을 섞지 않는다.

## 수용 기준

- LLM unavailable zero record와 local estimated record가 같은 artifact에 있어도 LLM/local 값이 서로 다른 합계로 표시된다.
- local-only record는 LLM 값을 증가시키지 않는다.
- dashboard shared type은 core snapshot shape와 호환된다.
