---
pgg:
  topic: "dashboard-workflow-timing-sync"
  stage: "review"
  status: "approved"
  skill: "pgg-add"
  score: 93
  updated_at: "2026-04-28T14:16:49Z"
---

# proposal.review

## 전문가 메모

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 프로덕트 매니저 | 94 | 사용자의 핵심 불만은 단순 UI 문구가 아니라 flow 상태, 시간 측정, 다음 flow 판단이 신뢰되지 않는 문제다. bug fix 범위로 두되 workflow 시간 소비는 측정 task로 분리해야 한다. | 없음 |
| UX/UI 전문가 | 92 | dashboard는 시작 전, 진행 중, 완료, 추가 진행, pending duration을 일관된 단어와 위치로 보여줘야 한다. wrong-flow routing은 사용자의 다음 행동을 잘못 유도하므로 명확한 fixture가 필요하다. | 없음 |

## Review 결과

- Decision: PASS
- Score: 93
- Requirements clarity: PASS
- Acceptance criteria observability: PASS
- Version decision: PASS, patch fix
- Performance candidate detection: PASS, required_candidate

## 남은 불확실성

- 실제 재현 topic은 pgg-plan에서 archive/active fixture를 탐색해 확정해야 한다.
- duration은 wall-clock interval인지 active work time인지 pgg-plan에서 용어와 표시 기준을 고정해야 한다.
