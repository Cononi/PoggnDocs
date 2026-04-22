---
pgg:
  topic: "dashboard-jira-insights-parity"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-22T14:49:28Z"
reactflow:
  node_id: "spec-jira-shell-navigation"
  node_type: "doc"
  label: "spec/ui/jira-shell-navigation-information-architecture.md"
state:
  summary: "Jira형 상단 global nav와 좌측 contextual sidebar 구조를 정의한다."
  next: "task.md 승인"
---

# Jira Shell Navigation Information Architecture Spec

## Goal

- `Insights.png` 기준의 dark Jira shell을 현재 dashboard에 맞게 재해석하기 위해 상단 global nav, 좌측 contextual sidebar, main workspace, right rail의 기본 정보 구조를 정의한다.

## Top Navigation Requirements

- top navigation은 desktop에서 항상 보이는 dark chrome header여야 한다.
- header는 최소 global launcher 영역, product brand/title, primary nav tabs, create CTA, search field, utility actions, avatar 영역을 포함해야 한다.
- 현재 선택된 primary nav는 시각적으로 강조되어야 한다.
- header 안의 copy는 Jira 제품명을 그대로 쓰지 않고 current pgg domain에 맞게 locale로 치환한다.

## Primary Navigation Rules

- primary nav는 최소 `Projects`를 포함해야 하며, shell이 향후 `Settings` 등 다른 상위 문맥을 수용할 수 있어야 한다.
- 이번 reference parity 구현의 기본 landing surface는 `Projects` 문맥이다.
- primary nav 전환이 selected project 상태를 불필요하게 초기화하면 안 된다.

## Contextual Sidebar Requirements

- 좌측 sidebar는 선택된 project identity와 project-local navigation을 담당한다.
- sidebar 상단에는 project icon, project title, project type/helper copy를 보여 줄 수 있어야 한다.
- sidebar menu는 planning/development 섹션으로 나뉘고, `Backlog`, `Board`, `Reports`, `Issues`, `Components`, `Code`, `Releases`, `Pages`, `Shortcuts`, `Project settings` 같은 항목을 수용할 수 있어야 한다.
- 모든 sidebar 메뉴를 한 번에 구현하지 않더라도 shell 구조는 해당 IA를 수용할 수 있게 설계해야 한다.

## Layout Composition Rules

- desktop shell은 `top navigation -> left contextual sidebar -> center workspace -> right insights rail` 4영역 구조를 기본값으로 한다.
- left sidebar와 right rail은 header 아래에서 독립 scroll surface를 가질 수 있어야 한다.
- center workspace는 backlog toolbar와 backlog sections를 가진 primary operating area여야 한다.
- 현재 `ProjectListBoard + ProjectDetailWorkspace`의 동시 노출 구조는 유지하지 않는다.

## Shell State Rules

- shell state는 최소 `activePrimaryMenu`, `activeSidebarItem`, `selectedProjectId`, `workspaceMode`, `insightsRailOpen`, `shellSearchQuery`를 다룰 수 있어야 한다.
- 새로고침 이후에도 사용자는 최소 project 문맥과 현재 workspace selection을 복원할 수 있어야 한다.
- static snapshot mode에서도 shell navigation과 read-only browsing은 가능해야 한다.

## Responsive Rules

- desktop에서는 four-region shell을 그대로 유지한다.
- tablet에서는 right insights rail이 collapsible panel 또는 overlay drawer로 축약될 수 있어야 한다.
- mobile에서는 left sidebar와 right rail 모두 drawer/sheet 패턴으로 접을 수 있어야 하지만 current surface title과 상단 header는 항상 남아야 한다.

## Non-Requirements

- Jira 제품의 픽셀 단위 브랜딩 복제
- 외부 SaaS navigation 연동
- 사용자 계정/권한 기반 personalized menu
