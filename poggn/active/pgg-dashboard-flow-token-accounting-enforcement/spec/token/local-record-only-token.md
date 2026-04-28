# S2. Local Record Only Token

## 규칙

- local token은 `source: "local"` token usage record의 `total_tokens`만 합산한다.
- shell, git, build/test, state-pack 등 local 실행 evidence가 record로 남았을 때만 local token이 증가한다.
- file artifact estimate는 local token으로 fallback되지 않는다.

## 수용 기준

- local record가 없는 topic의 local token은 0이다.
- LLM artifact가 아무리 많아도 local token에 섞이지 않는다.
