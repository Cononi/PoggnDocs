# S4. Generated Project Propagation

## 규칙

- 이후 생성되는 프로젝트도 같은 dashboard/core snapshot semantics를 사용해야 한다.
- core dist 산출물과 dashboard shared model을 source 변경과 동기화한다.
- workflow 문서와 token audit 문구는 LLM/local source 분리를 유지한다.

## 수용 기준

- `pgg init`/`pgg update` 이후 dashboard snapshot이 topic artifact를 LLM token baseline으로 계산할 수 있다.
