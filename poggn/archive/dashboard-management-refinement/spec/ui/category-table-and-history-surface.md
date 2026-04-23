---
pgg:
  topic: "dashboard-management-refinement"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-23T02:24:55Z"
reactflow:
  node_id: "spec-category-history"
  node_type: "doc"
  label: "spec/ui/category-table-and-history-surface.md"
state:
  summary: "category table과 report/history 표면의 책임을 정의한다."
  next: "task.md 승인"
---

# Category Table And History Surface Spec

## Goal

- `Category`, `Report`, `History`를 서로 다른 운영 표면으로 분리하고, category 관리 UX를 card list에서 table 중심 관리 화면으로 바꾼다.

## Category Table Requirements

- `Category` 화면은 table 기반이어야 한다.
- table은 최소 category name, default 상태, visible 상태, project count, action column을 보여 줄 수 있어야 한다.
- 사용자는 category 추가, 수정, 삭제, default 변경을 이 화면에서 수행해야 한다.
- 기존 visibility/order 정보를 잃지 않아야 하며, 필요 시 table 안에서 표시하거나 보조 action으로 유지한다.
- default category는 최소 1개 유지되어야 하며, 마지막 category 삭제는 금지된다.
- category delete는 default reassignment 또는 project reassignment 규칙을 명시해야 한다.

## Report Surface Requirements

- `Report`는 dashboard 운영 관점의 최근 활동 테이블로 유지한다.
- row는 최소 project, topic, stage/status, archive type, score, next action, updated 시각을 제공해야 한다.
- 정렬 기본값은 최신 업데이트 내림차순이다.
- row 선택은 관련 project detail 또는 topic detail surface를 열 수 있어야 한다.

## History Surface Requirements

- `History`는 report와 다른 관점의 로그 화면이어야 한다.
- `History`는 선택한 project 기준 active + archived topic 흐름을 시간순 또는 stage transition 기준으로 탐색할 수 있어야 한다.
- history row는 최소 topic, bucket(active/archive), stage or archive type, updated 시각, blocking/next action 정보를 보여 줘야 한다.
- history는 selected project 문맥을 우선 사용하며, project 미선택 시 명확한 empty helper를 제공해야 한다.

## Shared Data Rules

- `Report`와 `History`는 동일한 snapshot source를 쓸 수 있지만, 목적이 다른 별도 view model이어야 한다.
- category table mutation은 current-project 범위에서만 수행한다.
- history/report는 inline copy 대신 locale dictionary를 통해 title, helper, empty state, column label을 제공해야 한다.
- category table action은 board card drag-and-drop과 충돌하지 않는 별도 governance surface여야 한다.

## Non-Requirements

- category 관리와 report/history를 하나의 복합 화면에 섞는 것
- history를 단순히 report 복제본으로 두는 것
- category default/delete 규칙을 미정 상태로 구현 단계에 넘기는 것
