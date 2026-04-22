---
pgg:
  topic: "dashboard-jira-insights-parity"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-22T14:49:28Z"
reactflow:
  node_id: "spec-backlog-state"
  node_type: "doc"
  label: "spec/infra/dashboard-backlog-presentation-and-state.md"
state:
  summary: "snapshot, locale, store, query를 backlog workspace와 insights rail presentation에 맞게 해석하는 계약을 정의한다."
  next: "task.md 승인"
---

# Dashboard Backlog Presentation And State Spec

## Goal

- 현재 dashboard의 snapshot/model/query/store/locale 구조를 유지하면서 backlog workspace와 insights rail에 필요한 presentation mapping과 state contract를 정의한다.

## Locale Requirements

- shell header, sidebar sections, backlog toolbar, row metadata labels, insights widget titles, read-only helper copy는 모두 locale dictionary에 존재해야 한다.
- 신규 copy의 inline 추가를 금지한다.
- reference screenshot의 용어를 그대로 쓰기 어렵다면 locale에서 pgg domain에 맞는 대응어를 제공해야 한다.

## UI State Requirements

- store는 최소 `activePrimaryMenu`, `activeSidebarItem`, `selectedProjectId`, `selectedTopicKey`, `workspaceMode`, `shellSearchQuery`, `workspaceFilterState`, `insightsRailOpen`, `themeMode`를 다룰 수 있어야 한다.
- search/filter/section collapse와 right rail open state는 shell-level source-of-truth를 가져야 한다.
- refresh 이후 project selection과 active surface가 복원 가능해야 한다.

## Snapshot And Model Requirements

- `DashboardSnapshot`은 header와 left sidebar가 선택 project context를 렌더링할 수 있는 project summary를 제공해야 한다.
- `ProjectSnapshot`과 `TopicSummary`는 backlog row에서 key/title/status/tag/assignee-like metadata로 재해석 가능한 필드를 제공해야 한다.
- `recentActivity`는 insights widget과 backlog summary 계산에 재사용 가능해야 한다.
- rail widget이 필요로 하는 aggregate가 없다면 client-side projection으로 계산하되 source field 의미를 왜곡하면 안 된다.

## Query Coordination Rules

- snapshot query는 shell 전체의 source-of-truth로 유지한다.
- shell search/filter가 row workspace와 insights widget에 동시에 영향을 줄 경우 derived selector나 helper를 통해 일관되게 계산한다.
- live mutation 이후 invalidate 범위는 backlog rows와 insights aggregates가 동시에 최신 상태를 보장하도록 잡아야 한다.

## API Surface Requirements

- live API가 이미 제공하는 category/settings/project mutation과 충돌하지 않는 naming을 유지해야 한다.
- 이번 redesign이 purely presentational이라면 snapshot shape 확장 없이 client projection만으로 처리하는 경로를 우선 검토한다.
- 새로운 read-only metric field가 필요할 때만 snapshot projection 추가를 고려한다.

## Guardrails

- client는 로컬 파일 시스템이나 `poggn` 경로를 직접 읽지 않는다.
- current-project verification contract가 없으므로 UI는 검증 자동 실행을 시도하지 않는다.
- `manual verification required` projection과 helper copy는 유지되어야 한다.
- presentation mapping이 current data를 Jira issue처럼 오해하게 만들면 안 된다.

## Non-Requirements

- 상태 관리 라이브러리 교체
- dashboard API를 Jira domain schema로 개명
- server-side analytics backend 추가
