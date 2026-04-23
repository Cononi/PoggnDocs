---
pgg:
  topic: "dashboard-workspace-refinement"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-23T07:52:00Z"
reactflow:
  node_id: "spec-report-history"
  node_type: "doc"
  label: "spec/ui/report-table-and-history-modal-summary.md"
state:
  summary: "report/history를 summary-first surface와 modal detail 중심으로 재정의한다."
  next: "task.md 승인"
---

# Report Table And History Modal Summary Spec

## Goal

- report와 history를 즉시 읽히는 summary surface와 on-demand modal detail 구조로 단순화한다.

## Report Requirements

- report section은 topic별 대형 카드 반복보다 dense table-first surface를 기본으로 해야 한다.
- table row는 topic, stage, score, QA/review availability, updatedAt 같은 핵심 정보만 먼저 보여 줘야 한다.
- detail 문서와 review artifact는 row click 또는 명확한 row action으로 modal에서 열어야 한다.
- 목록 단계에서 모든 QA/review 내용을 inline 렌더하거나 pre-open state로 들고 있으면 안 된다.
- lag complaint가 explicit requirement이므로 목록 렌더 비용을 줄이는 방향이 기본 가드레일이다.

## History Requirements

- history section에는 topic selection UI가 필요하지 않다.
- history card는 한눈에 읽히는 핵심 정보만 담는 compact size여야 한다.
- 기존 `전체 보기` 성격의 별도 CTA는 제거해야 한다.
- card click이 곧 modal detail opening contract여야 한다.
- modal은 topic명, stage, version/score, next action, artifact preview entry point 같은 필요한 상세를 보여 줄 수 있다.

## Shared Modal Requirements

- report/history modal은 기존 document renderer contract를 재사용할 수 있다.
- modal detail은 on-demand로 로드/해결해야 하며 목록 화면에서 모든 내용을 동시 렌더하면 안 된다.
- available artifact만 보여 주고 없는 review/report를 추측으로 채우면 안 된다.

## Non-Requirements

- history 전체를 selected topic 기반 detail page처럼 다시 만드는 것
- report 목록에서 모든 review artifact를 기본으로 펼쳐 놓는 것
