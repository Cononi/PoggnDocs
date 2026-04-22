---
pgg:
  topic: "dashboard-jira-insights-parity"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-22T14:49:28Z"
  auto_mode: "on"
reactflow:
  node_id: "task"
  node_type: "task"
  label: "task.md"
state:
  summary: "dashboard jira insights parity 구현 작업을 shell, backlog workspace, insights rail, theme, presentation state 기준으로 분해한다."
  next: "pgg-code"
---

# Task

## 1. Audit Applicability

- [pgg-token]: [not_required] | dashboard shell/theme/presentation 재구성이 중심이라 token audit가 핵심이 아니다
- [pgg-performance]: [not_required] | 구조 구현과 reference parity가 우선이며 성능 측정 contract 변경은 없다

## 2. 작업 목록

| Task ID | Spec Ref | 작업 요약 | 선행 조건 | 완료 기준 |
|---|---|---|---|---|
| T1 | `S1`, `S5` | `DashboardApp`를 Jira형 3-column shell로 재편하고 top nav, active menu, selected project, rail open/close 상태를 store로 분리한다. | proposal, S1, S5 | desktop에서 top nav + left sidebar + main + right rail 구조가 성립하고 shell state가 refresh 이후 복원 가능하다 |
| T2 | `S4`, `S5` | dashboard theme를 dark neutral + blue accent + low-radius + compact density 기준으로 재정의하고 reference parity token을 provider 전역에 적용한다. | T1, S4, S5 | shell, backlog rows, rail widgets가 같은 theme token을 사용하며 warm palette 중심 기존 시각 언어가 reference 방향으로 정렬된다 |
| T3 | `S2`, `S5` | 중앙 backlog workspace를 구현해 breadcrumb/header, search/filter toolbar, backlog section, dense row metadata, create action을 current snapshot 데이터로 렌더링한다. | T1, T2, S2, S5 | project card grid 대신 backlog-style row workspace가 기본 landing surface가 되고 row metadata가 spec 기준을 충족한다 |
| T4 | `S1`, `S2`, `S3`, `S5` | 좌측 project context sidebar와 우측 insights rail을 구현해 project identity/navigation과 analytics widgets를 동시에 배치한다. | T1, T2, T3, S1, S2, S3, S5 | sidebar는 project identity와 menu navigation을 제공하고 insights rail은 docked panel + collapsible widgets로 동작한다 |
| T5 | `S3`, `S5` | insights rail의 workload, trend, sprint progress 계열 widget과 fallback state를 current snapshot/recent activity projection 위에서 연결한다. | T3, T4, S3, S5 | rail widget이 read-only snapshot에서도 의미 있는 metric을 보여 주고 empty/error/read-only 상태를 설명한다 |
| T6 | `S1`, `S2`, `S3`, `S4`, `S5` | locale, responsive collapse, static snapshot read-only semantics, manual verification note를 통합 검증하고 구현 기록에 남긴다. | T2, T3, T4, T5 | desktop/tablet/mobile shell, locale-only copy, rail/sidebar collapse, manual verification required가 통합적으로 확인된다 |

## 3. 구현 메모

- T1은 `apps/dashboard/src/app/DashboardApp.tsx`, `shared/store/dashboardStore.ts`, shell helper 계층이 함께 바뀔 가능성이 높다.
- T1은 기존 `activeTopMenu`, `activeProjectsView`, `activeSettingsView`, `projectSurface`를 버리기보다 Jira형 shell state로 재해석하는 편이 회귀 위험이 낮다.
- T2는 `apps/dashboard/src/shared/theme/dashboardTheme.ts`와 주요 surface component가 모두 같은 token을 사용하도록 theme-first로 진행해야 한다.
- T3는 현재 `ProjectListBoard`와 `ProjectDetailWorkspace`를 유지할지, 새 backlog workspace feature로 대체할지 구현 시작 전에 파일 책임을 분명히 해야 한다.
- T4는 좌측 sidebar와 중앙 header의 project identity 중복을 피해야 하며, right rail은 modal이 아니라 docked layout을 기본으로 유지해야 한다.
- T5는 `DashboardSnapshot.recentActivity`, `ProjectSnapshot.latestTopic*`, `TopicSummary`를 조합해 widget projection을 계산할 가능성이 높다.
- T6는 verification contract 미선언 상태를 유지해야 하므로 framework 명령 추론 실행 대신 `manual verification required` 기록을 남겨야 한다.

## 4. 검증 체크리스트

- 상단 global nav가 `Insights.png`와 같은 역할의 dark chrome, search, action, utility 영역을 갖는지 확인한다.
- 좌측 영역이 선택 프로젝트 identity와 planning/development navigation을 제공하는지 확인한다.
- 중앙 main surface가 project card grid가 아니라 backlog-style row workspace인지 확인한다.
- toolbar에 search, filter, assignee/avatar strip, section title이 존재하는지 확인한다.
- backlog row가 key, title, label/tag, estimate/order marker, status, assignee를 dense layout으로 렌더링하는지 확인한다.
- 우측 insights rail이 기본 open docked panel로 보이고 workload/trend/progress 계열 widget을 포함하는지 확인한다.
- theme token이 dark neutral surface, blue accent, low-radius, thin divider, compact spacing 기준으로 정렬되는지 확인한다.
- 신규 copy가 `ko/en` locale dictionary만 사용하고 inline 문자열로 새로 추가되지 않았는지 확인한다.
- tablet/mobile에서 sidebar 또는 insights rail이 collapse 되어도 접근 경로가 남는지 확인한다.
- static snapshot mode에서 편집 불가 semantics가 유지되고 reason copy가 노출되는지 확인한다.
- current-project verification contract가 없으므로 QA/기록에 `manual verification required`가 남는지 확인한다.
