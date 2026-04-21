---
pgg:
  topic: "dashboard-renewal"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-21T15:55:16Z"
reactflow:
  node_id: "spec-project-list-board"
  node_type: "doc"
  label: "spec/ui/project-list-board.md"
state:
  summary: "Jira 스타일 프로젝트 목록 보드의 column/card UX를 정의한다."
  next: "task.md 승인"
---

# Project List Board Spec

## Goal

- dashboard 첫 진입 화면이 category 기준 프로젝트 탐색에 최적화된 Jira 스타일 보드가 되도록 정보 구조와 상호작용을 정의한다.

## Layout Requirements

- 목록 화면은 category column들을 수평 또는 반응형 grid로 배치한다.
- 각 column header는 category 이름, project 수, default 표시, quick action entry를 가진다.
- 각 project card는 프로젝트명, provider, language, auto/git mode, active topic 수, 최근 archive 요약을 보여준다.
- 현재 선택 project는 card 강조 상태로 명확히 드러나야 한다.
- mobile에서는 column을 stacked section 또는 swipe 가능한 lane으로 축소할 수 있어야 한다.

## Interaction Rules

- 사용자는 category column에서 project card를 클릭해 상세 워크스페이스를 연다.
- 목록 필터는 project 이름, 상태, 최근 topic 키워드 기준으로 동작해야 한다.
- category가 비어 있으면 empty column 상태를 표시해야 한다.
- 목록 보드에서 category create/edit/delete 진입점이 드러나야 하지만, 상세 설정 흐름과 충돌하지 않아야 한다.

## Jira Adaptation Rules

- Jira 보드의 핵심은 다중 column 안에서 카드 상태를 빠르게 스캔하는 것이며, backlog/sprint semantics를 그대로 복제하지 않는다.
- 스윔레인 대신 category column 자체가 1차 grouping 역할을 맡는다.
- 각 card는 “프로젝트 운영 상태”를 읽는 요약 카드여야 하며 topic 단위 세부 정보는 상세 워크스페이스로 넘긴다.

## Data Requirements

- 목록 보드는 `DashboardSnapshot`의 category ordering과 project projection만으로 렌더링 가능해야 한다.
- card에 필요한 최근 archive 요약은 analyzer가 미리 집계한 메타데이터를 사용한다.
- client는 project root를 직접 스캔하지 않는다.

## Non-Requirements

- Jira backlog, sprint planning 기능 복제
- multi-select bulk operation
- category별 권한 관리
