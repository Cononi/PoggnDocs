---
pgg:
  topic: "dashboard-management-refinement"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-23T02:24:55Z"
reactflow:
  node_id: "spec-shell-navigation"
  node_type: "doc"
  label: "spec/ui/shell-navigation-and-management-sidebar.md"
state:
  summary: "dashboard 상단 navigation과 MANAGEMENT sidebar 정보 구조를 정의한다."
  next: "task.md 승인"
---

# Shell Navigation And Management Sidebar Spec

## Goal

- dashboard를 과도한 utility와 backlog 중심 sidebar에서 벗어나 `Project` / `Settings` 상위 메뉴와 `MANAGEMENT` sidebar 중심 운영 shell로 재정렬한다.

## Top Navigation Requirements

- top navigation은 `Project`, `Settings` 두 메뉴만 활성화한다.
- 브랜드 영역은 dashboard title과 title icon SVG 기반 mark를 함께 보여 줄 수 있어야 한다.
- 우측 utility strip에는 `Latest Project` indicator와 `Insight` 버튼만 남긴다.
- global search, 별도 settings utility 버튼, avatar surface, top-level create button은 제거한다.
- `Project`가 활성일 때와 `Settings`가 활성일 때 active state가 시각적으로 명확해야 한다.

## Management Sidebar Requirements

- `Project` 문맥의 sidebar section label은 `MANAGEMENT`를 사용한다.
- `Project` sidebar 항목 순서는 `Board`, `Category`, `Report`, `History`로 고정한다.
- `Development` 섹션과 그 하위 legacy item은 제거한다.
- `Settings` 문맥의 sidebar는 `Main`, `Refresh`, `Git`, `System`을 유지한다.
- project detail surface는 sidebar item이 아니라 board/report/history row에서 진입하는 secondary surface로 다룬다.

## Navigation State Rules

- store는 최소 `activeTopMenu`, `activeSidebarItem`, `activeSettingsView`, `selectedProjectId`, `selectedTopicKey`, detail surface selection을 복원할 수 있어야 한다.
- `activeSidebarItem` enum은 `board`, `category`, `report`, `history`, `settings` 문맥을 표현할 수 있어야 하며 legacy `backlog`/`project-settings` 의존을 제거한다.
- `Settings`로 이동해도 현재 선택된 project/topic 문맥은 파괴하지 않는다.
- project card 또는 history/report row에서 detail surface를 열어도 top menu는 `Project`를 유지한다.
- browser refresh 이후에도 마지막 top menu, sidebar item, theme mode, insight rail open 상태를 복원할 수 있어야 한다.

## Layout Composition Rules

- shell 기본 구조는 `top navigation -> contextual sidebar -> primary content` 3영역이다.
- primary content는 현재 sidebar item에 따라 `Board`, `Category`, `Report`, `History`, `Settings`, project detail surface 중 하나를 렌더링한다.
- add project entry, category action, delete confirmation 같은 작업성 action은 primary content 내부에 두고 shell header는 navigation 책임만 가진다.
- latest project indicator는 shell 수준에서만 렌더링하고 board/settings 하위 컴포넌트가 중복 노출하지 않는다.

## Responsive Rules

- desktop에서는 top nav, sidebar, primary content가 동시에 보여야 한다.
- compact shell에서는 sidebar를 drawer/overlay로 축소할 수 있지만 `Project`, `Settings`, 현재 surface title 접근성은 유지해야 한다.
- latest project indicator는 좁은 화면에서 축약 가능하지만 완전히 사라지면 안 된다.
- `Insight` 버튼은 compact shell에서도 유지하되 primary content를 가리지 않는 방식으로 동작해야 한다.

## Non-Requirements

- top navigation에 `Your work`, `Filter`, `Dashboards`, `Teams`, `Apps`를 남기는 것
- avatar 기반 사용자 프로필 UX
- global create/search 중심 상단 툴바 유지
