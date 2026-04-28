# S2. Overview Topic Token Total

## 규칙

- Overview token chip은 `topic.tokenUsage.llmActualTokens`와 `topic.tokenUsage.localEstimatedTokens`를 표시한다.
- 이 값은 flow 진행마다 ledger가 늘어나며 topic-level 누적 총합으로 계산된다.
- Overview는 flow별 row breakdown을 계산하지 않는다.

## 수용 기준

- Overview는 topic 전체 누적치를 보여 주고 Timeline row 값의 합산 방식과 UI 역할을 혼동하지 않는다.
