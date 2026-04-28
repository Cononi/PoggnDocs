# S1. LLM Artifact Fallback

## 규칙

- `source: "llm"` record가 provider actual metadata를 갖고 있으면 `total_tokens`를 LLM 값으로 사용한다.
- `source: "llm"` record가 `measurement: "unavailable"` 또는 `total_tokens: 0`이어도 `artifact_path`가 topic file과 매칭되면 해당 file content token estimate를 LLM 생성 산출물 fallback으로 사용한다.
- 같은 artifact에 metadata 없는 LLM record가 여러 개 있으면 record별 raw zero를 더하지 않고 artifact content estimate를 한 번만 fallback으로 사용한다.
- LLM fallback은 local usage에 합산하지 않는다.

## 수용 기준

- provider metadata actual record는 기존처럼 LLM total에 반영된다.
- unavailable zero LLM record는 artifact token estimate로 LLM total에 반영된다.
- artifact content가 없으면 LLM fallback은 null/0으로 유지된다.
