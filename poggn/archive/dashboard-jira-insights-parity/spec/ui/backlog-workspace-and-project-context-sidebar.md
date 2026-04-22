---
pgg:
  topic: "dashboard-jira-insights-parity"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-22T14:49:28Z"
reactflow:
  node_id: "spec-backlog-workspace"
  node_type: "doc"
  label: "spec/ui/backlog-workspace-and-project-context-sidebar.md"
state:
  summary: "중앙 backlog workspace와 좌측 project context sidebar의 역할과 row-first IA를 정의한다."
  next: "task.md 승인"
---

# Backlog Workspace And Project Context Sidebar Spec

## Goal

- 기존 category project grid를 대체할 중앙 backlog workspace와, 선택 프로젝트 문맥을 제공하는 좌측 sidebar의 역할을 분리해 row-first operating surface를 정의한다.

## Project Context Sidebar Requirements

- sidebar 상단은 선택된 project identity를 보여 준다.
- project identity는 name, project type/helper, optional avatar/icon을 가질 수 있어야 한다.
- planning/dev 섹션 구분은 screenshot과 같은 scan rhythm을 제공해야 한다.
- 현재 선택된 sidebar item은 명확한 active highlight를 가져야 한다.

## Workspace Header Requirements

- center workspace 상단은 breadcrumb 또는 contextual path를 보여 줄 수 있어야 한다.
- workspace title은 `Backlog` 같은 현재 surface 명칭을 명확히 드러내야 한다.
- toolbar는 search field, assignee/avatar strip, filter controls, secondary action cluster를 포함해야 한다.
- create action은 workspace 문맥 안에 있어야 하며 sidebar로 내려가면 안 된다.

## Backlog Section Requirements

- backlog content는 sectioned list 구조를 기본으로 한다.
- 각 section은 title, issue count, optional summary chip을 가질 수 있어야 한다.
- section은 collapse/expand 가능한 구조를 수용할 수 있어야 한다.
- 빈 section이어도 title/context를 유지한 helper state를 보여 줄 수 있어야 한다.

## Row Presentation Rules

- row는 card grid가 아니라 dense horizontal metadata layout이어야 한다.
- row는 최소 key, title, tag/label, estimate/order marker, status control, assignee 영역을 표현할 수 있어야 한다.
- pgg domain 데이터는 Jira issue semantics로 재명명하지 않고 backlog row presentation으로만 재배치한다.
- `TopicSummary`, `ProjectSnapshot`, recent activity projection으로 row metadata를 만들 때 실제 source field와 UI label 의미가 어긋나면 안 된다.

## Interaction Rules

- row click 또는 row-local action은 project detail, topic detail, artifact preview 같은 deeper surface로 이어질 수 있어야 한다.
- toolbar filter와 search는 동일한 source-of-truth 상태를 사용해야 한다.
- static snapshot mode에서도 browsing, filtering, section expand/collapse은 동작해야 한다.
- edit-capable action이 live mode에만 허용된다면 disabled semantics와 helper copy가 필요하다.

## Guardrails

- row density를 맞춘다고 가독성을 희생하면 안 된다.
- left sidebar가 project browsing list를 다시 떠맡으면 안 된다.
- backlog workspace는 screenshot의 scan flow를 따르되 current pgg data shape를 왜곡하면 안 된다.

## Non-Requirements

- Jira backlog 기능의 완전한 도메인 복제
- sprint planning business logic 추가
- current snapshot schema 전체 교체
