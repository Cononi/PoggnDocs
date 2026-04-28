---
pgg:
  topic: "dashboard-git-diff-lazy-view"
  stage: "review"
  status: "reviewed"
  score: 95
  updated_at: "2026-04-28T05:30:44Z"
---

# plan.review

## 전문가 메모

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 소프트웨어 아키텍트 | 96 | workflow 계약, dashboard lazy API, 검증 spec을 분리해 시스템 영향 범위가 명확하다. 기존 `.diff` archive fallback을 유지하는 점이 migration risk를 낮춘다. | 없음 |
| 도메인 전문가 | 94 | `diffRef`, `gitRef`, `commitRange`, `working-tree` 상태의 의미가 pgg/git 도메인에 맞게 분리되어 있다. archive 가능한 evidence와 임시 diff의 차이를 code 단계에서 유지해야 한다. | 없음 |

## 결정

- plan 승인.
- 다음 단계는 `pgg-code`.
- pgg-token과 pgg-performance는 required로 유지한다.

## 리스크

- Git ref schema를 너무 넓게 잡으면 dashboard와 helper가 서로 다른 필드를 해석할 수 있다. code 단계에서 단일 타입 또는 table schema를 고정해야 한다.
- static dashboard snapshot에서는 lazy Git 조회가 불가능하므로 fallback UX가 필수다.
