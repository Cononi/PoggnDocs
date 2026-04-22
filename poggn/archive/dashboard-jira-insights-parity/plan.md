---
pgg:
  topic: "dashboard-jira-insights-parity"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-22T14:49:28Z"
  auto_mode: "on"
reactflow:
  node_id: "plan"
  node_type: "doc"
  label: "plan.md"
state:
  summary: "dashboard jira insights parity를 shell, backlog workspace, insights rail, theme, presentation state spec으로 분해한다."
  next: "pgg-code"
---

# Plan

## 1. 목표

- `Insights.png`를 기준으로 현재 dashboard를 `top global nav + left project sidebar + center backlog workspace + right insights rail` 구조로 재편한다.
- 기존 `ProjectListBoard` 중심 category grid browsing을 dense backlog row operating view로 바꾸되, 데이터 source는 current snapshot/dashboard API 계약 위에서 유지한다.
- Jira형 dark chrome, blue accent, compact spacing, low-radius token을 theme source-of-truth로 정의해 reference parity 기준을 고정한다.
- 좌측 프로젝트 문맥 sidebar, 중앙 toolbar/row list, 우측 insight widgets가 같은 shell state와 locale/model projection 위에서 동작하도록 문서화한다.
- `pgg-code`가 구조 재배치, visual token 교체, row presentation mapping, responsive rail collapse까지 추가 해석 없이 구현에 들어갈 수 있게 만든다.

## 2. Audit Applicability

- [pgg-token]: [not_required] | dashboard UI redesign과 presentation model 분해가 중심이며 token audit를 별도 gate로 열 근거는 없다
- [pgg-performance]: [not_required] | 이번 단계는 구조 설계 문서화 범위이고 verification contract나 성능 측정 기준을 바꾸지 않는다

## 3. Spec 분해

| Spec ID | path | 목적 | 구현 핵심 |
|---|---|---|---|
| S1 | `spec/ui/jira-shell-navigation-information-architecture.md` | `Insights.png` 기준 상단 global nav와 좌측 contextual sidebar를 포함한 전체 shell 구조를 정의한다. | app shell composition, top nav sections, project identity sidebar, shell state, responsive collapse |
| S2 | `spec/ui/backlog-workspace-and-project-context-sidebar.md` | 중앙 backlog workspace와 좌측 project context sidebar의 역할 분리를 정의한다. | breadcrumb/header, search/filter toolbar, backlog section layout, row grouping, create action |
| S3 | `spec/ui/insights-rail-and-analytics-widgets.md` | 우측 `Backlog Insights` rail과 widget stack, collapse 동작을 정의한다. | docked rail, insights entry point, metric cards, chart/list widgets, mobile drawer fallback |
| S4 | `spec/ui/dashboard-theme-and-reference-parity.md` | dark neutral chrome, blue accent, compact density, low-radius visual token 기준을 정의한다. | theme factory, palette/token parity, row density, divider/surface hierarchy, reference fidelity guardrails |
| S5 | `spec/infra/dashboard-backlog-presentation-and-state.md` | 현재 project/topic snapshot을 backlog row와 insights surface에 매핑하기 위한 model/locale/store/query 기준을 정의한다. | presentation mapping, locale keys, Zustand shell state, query invalidation, snapshot/API projection |

## 4. 구현 순서

1. S1에서 shell composition과 navigation state를 먼저 고정해 `DashboardApp.tsx`가 어떤 3-column 구조를 가져야 하는지 명확히 한다.
2. S4에서 visual token, dark chrome, compact density 기준을 정해 이후 row/rail/widget 구현이 같은 디자인 source-of-truth를 쓰게 만든다.
3. S5에서 현재 `DashboardSnapshot`, `ProjectSnapshot`, `TopicSummary`, locale/store/query가 backlog view와 insights widgets에 어떤 projection을 제공해야 하는지 확정한다.
4. S2에서 중앙 backlog workspace와 좌측 project context sidebar를 정의해 기존 category grid와 detail workspace를 어떤 표면으로 대체할지 고정한다.
5. S3에서 우측 insights rail의 metric/card/widget 구조와 responsive fallback을 정의해 analytics surface를 독립 spec으로 분리한다.
6. `task.md`에서는 shell/theme, backlog workspace, insights rail, state/model/locale wiring, 통합 검증 순서로 구현 단위를 자른다.

## 5. 검증 전략

- shell 검증: 상단 global nav, 좌측 project context sidebar, 중앙 backlog workspace, 우측 insights rail이 desktop에서 동시에 보이는지 확인한다.
- reference 검증: `Insights.png`와 비교했을 때 정보 구조, 시각 hierarchy, 주요 control 배치가 같은 계열로 읽히는지 확인한다.
- backlog 검증: toolbar에 search, filter, assignee/avatar strip, section header가 있고 row가 dense metadata layout을 가지는지 확인한다.
- row 검증: backlog row가 key, title, tag/label, estimate/order marker, status, assignee를 current pgg 데이터로 표현할 수 있는지 확인한다.
- insights 검증: workload breakdown, backlog trend, sprint progress 계열 widget이 docked rail 안에서 동작 가능한 구조로 정의되는지 확인한다.
- theme 검증: dark neutral surface, blue accent, low-radius, compact spacing이 MUI theme token으로 일관되게 정의되는지 확인한다.
- state/model 검증: client가 로컬 파일을 직접 읽지 않고 snapshot/query/store/locale만으로 shell과 backlog/insights surface를 복원하는지 확인한다.
- workflow 검증: current-project verification contract가 없으므로 후속 구현/QA에서 `manual verification required`를 유지해야 한다.

## 6. 리스크와 가드레일

- Jira screenshot을 픽셀 복제 대상으로 오해하면 domain copy와 data semantics가 어긋날 수 있다. S4와 S5에서 layout parity와 data semantics를 분리한다.
- backlog row를 단순 project card 변형으로 처리하면 dense list IA가 무너질 수 있다. S2에서 row-first workspace 기준을 명시한다.
- insights rail을 modal이나 secondary tab로 내리면 reference의 핵심 구조를 잃는다. S3에서 docked rail을 기본값으로 고정한다.
- 좌측 sidebar와 중앙 backlog header가 모두 project identity를 중복 표현하면 정보 밀도가 깨질 수 있다. S1과 S2에서 책임을 분리한다.
- theme token을 정리하지 않고 컴포넌트별 `sx` override로만 맞추면 reference parity 유지가 어렵다. S4에서 theme-first 원칙을 강제한다.
- snapshot projection 없이 UI에서 임의 계산을 늘리면 list/insights 간 의미가 틀어질 수 있다. S5에서 presentation mapping source-of-truth를 명시한다.

## 7. 완료 기준

- `plan.md`, `task.md`, `spec/ui/*.md`, `spec/infra/*.md`, `reviews/plan.review.md`, `reviews/task.review.md`가 모두 생성되어 있다.
- `pgg-code`가 shell, backlog workspace, insights rail, theme parity, presentation state/model 변경 범위를 spec/task만 보고 이해할 수 있다.
- `state/current.md`가 active specs, active tasks, audit applicability, git publish message, next action을 최소 handoff 형태로 유지한다.
- 구현 단계에서 "어느 정도 Jira 비슷하면 되는지" 다시 해석할 필요 없이 문서만으로 layout hierarchy와 data mapping 기준이 정해져 있다.

## 8. 전문가 평가 요약

- 소프트웨어 아키텍트: shell, backlog workspace, insights rail, theme, presentation state를 분리한 spec 구성이 현재 dashboard 재구성 범위와 시스템 영향 경계에 맞다.
- 시니어 백엔드 엔지니어: 기존 snapshot/model/store 구조를 폐기하지 않고 presentation mapping으로 재사용하는 순서가 현실적이며 회귀 위험을 줄인다.
- QA/테스트 엔지니어: reference parity, responsive rail collapse, locale-only copy, manual verification required까지 acceptance에 포함되어 누락 위험이 낮다.
