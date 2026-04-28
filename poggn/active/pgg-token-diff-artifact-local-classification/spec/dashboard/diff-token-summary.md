# S2. Dashboard Diff Token Summary

## 규칙

- Overview topic total은 diff artifact를 local token으로 계산한다.
- Timeline flow row도 flow에 속한 diff artifact를 local token으로 계산한다.
- 실제 코드/문서 artifact는 기존 LLM artifact baseline을 유지한다.

## 수용 기준

- Code flow에 source file과 diff file이 있으면 source는 LLM, diff는 local로 나뉜다.
