# S3. Overview And Timeline Flow Tokens

## 규칙

- Overview는 topic 전체 LLM token과 local token 누적 합계를 표시한다.
- Timeline은 완료된 flow row마다 해당 flow의 LLM token과 local token을 표시한다.
- Timeline LLM token은 flow files와 flow-scoped LLM records를 통합하되 같은 artifact를 중복 합산하지 않는다.
- Timeline local token은 flow-scoped local records만 합산한다.

## 수용 기준

- 완료된 Plan flow에 plan/task/spec artifact가 있으면 LLM token이 표시된다.
- 완료된 QA flow에 local gate record가 있으면 QA row local token에만 반영된다.
