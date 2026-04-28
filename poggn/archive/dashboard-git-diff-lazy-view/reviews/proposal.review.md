---
pgg:
  topic: "dashboard-git-diff-lazy-view"
  stage: "review"
  status: "reviewed"
  score: 94
  updated_at: "2026-04-28T05:27:37Z"
---

# proposal.review

## 전문가 메모

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 프로덕트 매니저 | 95 | 문제는 diff 본문 중복 저장으로 인한 active/archive 용량 증가와 dashboard 사용성 저하다. 신규 flow부터 Git ref 기반 lazy diff로 전환하고 과거 archive 삭제를 제외한 범위가 적절하다. | 없음 |
| UX/UI 전문가 | 93 | dashboard는 변경 파일명 목록을 먼저 보여주고 선택 시 diff를 여는 흐름이 스캔성과 성능 모두에 유리하다. Git ref 부족 시 unavailable/fallback 상태를 명확히 표시해야 한다. | 없음 |

## 결정

- proposal 승인.
- 다음 단계는 `pgg-plan`.
- pgg-token과 pgg-performance audit는 required로 표시한다.

## 주요 리스크

- commit이 아직 없는 상태의 diff는 archive 이후 재현성이 낮으므로 completion 단계에서 commit/range ref를 반드시 고정해야 한다.
- 기존 archive의 `.diff` 파일 삭제는 별도 topic 없이 진행하지 않는다.
