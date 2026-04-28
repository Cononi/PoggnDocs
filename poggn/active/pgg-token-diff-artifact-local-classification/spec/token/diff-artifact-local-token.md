# S1. Diff Artifact Local Token

## 규칙

- `.diff` 파일과 `implementation/diffs/*` 파일은 local token artifact다.
- diff artifact는 LLM artifact baseline에서 제외한다.
- diff artifact를 가리키는 LLM record가 있어도 LLM token으로 합산하지 않는다.

## 수용 기준

- diff file token estimate는 local token에만 반영된다.
