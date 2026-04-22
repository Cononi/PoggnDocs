---
pgg:
  topic: "dashboard-jira-insights-parity"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 96
  updated_at: "2026-04-22T14:46:04Z"
  auto_mode: "on"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "0.10.0"
  short_name: "jira-insights"
  working_branch: "ai/feat/0.10.0-jira-insights"
  release_branch: "release/0.10.0-jira-insights"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "Insights.png를 기준으로 dashboard를 Jira backlog + insights 구조에 맞추는 redesign 범위를 proposal로 확정한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

dashboard-jira-insights-parity

## 2. 변경 분류

- archive_type: `feat`
- version_bump: `minor`
- target_version: `0.10.0`
- short_name: `jira-insights`
- working_branch: `ai/feat/0.10.0-jira-insights`
- release_branch: `release/0.10.0-jira-insights`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- `$pgg-add 대시보드 수정 입니다.`
- `Insights.png 이미지 파일을 보시면 좌측 사이드 바와 상단 네비게이션 그리고 메인화면 정보를 보시면 아시겠지만 현재 디자인과는 거리가 먼 상태 입니다. 정확히 해당 지적 부분을 이미지와 동일한 디자인,구조로 변경해주세요.`

## 4. 왜 하는가

- 현재 dashboard는 `apps/dashboard/src/app/DashboardApp.tsx`, `apps/dashboard/src/features/project-list/ProjectListBoard.tsx`, `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx` 중심으로 "프로젝트 카드 보드 + topic workflow/detail" 구조에 최적화되어 있다.
- 사용자가 준 `Insights.png`는 dark Jira backlog 레이아웃으로, 상단 글로벌 nav, 좌측 project navigation sidebar, 중앙 backlog issue list, 우측 insights 분석 패널이 명확히 분리된 3단 정보 구조를 가진다.
- 현재 보드는 category별 project card를 그리드로 보여주지만, 레퍼런스는 "하나의 선택된 프로젝트 문맥 안에서 backlog/board rows와 요약 인사이트를 함께 본다"는 운영 화면이다. 따라서 현재 정보 구조와 목표 구조의 차이가 크다.
- theme도 현재 `apps/dashboard/src/shared/theme/dashboardTheme.ts` 기준의 pgg 전용 warm palette와 branded surface를 사용한다. `Insights.png`의 무채색 dark chrome, blue accent, compact row density, right insights dock와는 시각 언어가 다르다.
- 이번 변경은 카드 디자인 일부를 손보는 수준이 아니라 shell, navigation hierarchy, list/table density, analytics sidebar, visual token을 모두 재정의하는 feature-level redesign이다.

## 5. 무엇을 할 것인가

- `Insights.png`를 authority reference로 두고, dashboard 메인 구조를 `top global navigation + left contextual sidebar + center backlog workspace + right insights rail`로 재구성한다.
- 상단 global nav는 dark chrome, compact tab spacing, search field, action button, utility icon/avatar 영역을 포함하는 Jira형 헤더로 재정의한다.
- 좌측 sidebar는 현재 generic section rail이 아니라 "선택된 프로젝트 문맥"을 보여주는 project identity + planning/development navigation 구조로 바꾼다.
- 중앙 main surface는 project 카드 grid 대신 backlog/board row list를 기본 표면으로 삼고, section header, search/filter/assignee controls, issue row metadata, status pills, avatars, create action을 포함한다.
- 우측 panel은 `Insights` entry point와 `Backlog Insights` 카드 스택으로 구성하고, workload breakdown, backlog trend, sprint progress 같은 분석 섹션을 collapse 가능한 구조로 제공한다.
- 현재 pgg topic/stage 데이터를 Jira issue row처럼 재해석해 row density는 Jira에 가깝게 맞추되, 실제 데이터 source는 현재 dashboard snapshot 계약 위에서 유지한다.
- 시각 토큰은 `Insights.png`와 동일 계열의 dark surface, blue primary accent, low-radius, thin divider, compact spacing으로 맞춘다.

## 6. 범위

### 포함

- `Insights.png`와 동일한 상단 nav 구조와 dark visual hierarchy 정의
- 선택 프로젝트 중심 좌측 sidebar 구조 정의
- 중앙 backlog/board list형 main surface 정의
- issue row 수준의 dense metadata layout, badge, assignee, status control 정의
- 우측 insights rail과 분석 카드 stack 구조 정의
- 기존 project card board에서 backlog workspace 중심 구조로의 전환 기준 정의
- `DashboardApp`, project board, project detail workspace, theme, locale, snapshot view-model 후속 변경 범위 정의
- desktop 우선 구현과 mobile/tablet 축약 규칙 정의

### 제외

- 이번 proposal 단계에서 실제 React/MUI 구현
- Jira 브랜드 asset이나 외부 SaaS API 연동
- 현행 snapshot schema를 Jira issue schema로 교체하는 작업
- 프로젝트 외부 앱 또는 CLI 영역 변경
- 사용자 인증, 권한, 멀티유저 협업 기능 추가

## 7. 제약 사항

- project scope는 `current-project`로 유지한다.
- `archive_type`은 `feat`, `version_bump`는 `minor`, `target_version`은 `0.10.0`으로 고정한다.
- 구현 기준 이미지는 repo 루트의 `Insights.png`이며, "비슷한 분위기"가 아니라 핵심 layout/structure parity를 목표로 한다.
- 현재 stack인 React, TypeScript, MUI, React Query, Zustand, existing locale 구조를 유지하면서 재설계한다.
- 데이터 source는 current snapshot/dashboard API 계약을 우선 유지하고, 화면 해석 계층을 Jira backlog형으로 재배치한다.
- 우측 insights panel은 desktop에서 docked rail로 유지하고, 좁은 viewport에서는 collapse/drawer 전략이 필요하다.
- 텍스트/라벨은 기존 dashboard i18n 구조를 유지하되 reference screenshot의 IA를 따르도록 locale surface를 확장해야 한다.

## 8. auto mode 처리

- poggn auto mode: `on`
- auto mode가 `on`이므로 proposal 단계에서 아래 기준안을 선결정한다.
- reference fidelity는 "정확한 구조와 시각 hierarchy" 기준으로 해석하고, product copy는 현재 pgg domain에 맞게 치환한다.
- main landing surface는 project card board가 아니라 backlog-style workspace를 기본값으로 삼는다.
- right insights rail은 optional modal이 아니라 기본 노출된 docked panel로 구현한다.
- desktop 기준 3-column shell을 source-of-truth로 두고, smaller viewport는 rail collapse로 대응한다.

## 9. 기준안

| 항목 | 기준안 | 상태 |
|---|---|---|
| 상단 헤더 | dark Jira형 global nav, search, create CTA, utility icon/avatar를 포함한다. | resolved |
| 좌측 영역 | 선택된 프로젝트 identity와 planning/development menu를 가진 contextual sidebar로 구성한다. | resolved |
| 메인 표면 | project grid 대신 backlog/board row list를 primary surface로 둔다. | resolved |
| board toolbar | search, assignee/avatar strip, filter controls를 header row에 둔다. | resolved |
| row density | issue row는 compact table/list 밀도로 렌더링한다. | resolved |
| row 메타데이터 | key, title, label/tag, estimate/order icon, status, assignee를 포함한다. | resolved |
| 우측 패널 | `Backlog Insights`를 기본 open rail로 두고 collapsible insight cards를 제공한다. | resolved |
| chart 구성 | workload breakdown, backlog trend, sprint progress 같은 summary widgets를 포함한다. | resolved |
| visual token | dark neutral surfaces + blue accent + low-radius + thin divider로 맞춘다. | resolved |
| 데이터 해석 | 현재 pgg dashboard data를 Jira issue/backlog형 presentation으로 재배치한다. | resolved |
| 반응형 | desktop 3-column을 기준으로 tablet/mobile에서는 sidebar/insights rail을 접는다. | resolved |

## 10. 성공 기준

- plan 단계 전에 `Insights.png`와의 차이가 단순 테마가 아니라 shell 구조, main content model, insight rail까지 포함한다는 점이 명확히 고정된다.
- 현재 dashboard의 project card board 중심 IA를 backlog workspace 중심 IA로 바꾸는 범위가 문서로 분명해진다.
- 후속 spec이 shell/navigation, backlog workspace rows, insights analytics rail, visual token/theme, data mapping으로 분해 가능할 정도로 경계가 정리된다.
- 구현 단계에서 "대충 Jira 느낌"이 아니라 어떤 화면 구조를 따라야 하는지 재해석 여지가 줄어든다.

## 11. 전문가 평가 요약

- 프로덕트 매니저: 이번 요구는 단순 디자인 보정이 아니라 dashboard의 기본 사용 시나리오를 project browsing에서 backlog operating view로 바꾸는 feature 범위로 보는 것이 맞다.
- UX/UI 전문가: `Insights.png`의 핵심은 dark Jira 미감 자체보다도 상단 nav, contextual sidebar, dense issue list, docked insights rail의 정보 구조이므로 이를 그대로 기준으로 잡은 판단이 타당하다.
- 도메인 전문가: pgg dashboard의 실제 데이터는 project/topic snapshot이므로 Jira issue row를 그대로 복제하는 대신 현재 데이터를 backlog row presentation으로 재배치하는 방향이 현재 제품 문맥과 충돌하지 않는다.

## 12. 다음 단계

`pgg-plan`에서 다음 spec 축으로 분해한다.

- shell navigation and Jira-style information architecture
- backlog workspace rows, toolbar, and project context sidebar
- insights rail widgets and responsive behavior
- theme/token overhaul for reference parity
- pgg snapshot-to-backlog presentation mapping
