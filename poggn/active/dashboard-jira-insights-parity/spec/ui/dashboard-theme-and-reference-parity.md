---
pgg:
  topic: "dashboard-jira-insights-parity"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-22T14:49:28Z"
reactflow:
  node_id: "spec-theme-parity"
  node_type: "doc"
  label: "spec/ui/dashboard-theme-and-reference-parity.md"
state:
  summary: "Insights.png 기준 dark chrome, blue accent, compact density 토큰을 정의한다."
  next: "task.md 승인"
---

# Dashboard Theme And Reference Parity Spec

## Goal

- `Insights.png`의 dark Jira 계열 시각 hierarchy를 현재 dashboard에 적용하기 위한 theme/token/source-of-truth 기준을 정의한다.

## Theme Direction Requirements

- palette는 dark neutral chrome을 기본으로 하고 primary accent는 blue 계열을 사용한다.
- 현재 warm orange 중심 accent는 reference parity 기준에서 secondary 또는 제한적 semantic role로 축소될 수 있다.
- surface hierarchy는 header, left sidebar, center workspace, right rail이 미묘하게 다른 neutral tone을 가지는 방식이어야 한다.
- divider는 thin, low-contrast line으로 유지하되 dense list scan을 방해하지 않아야 한다.

## Shape And Density Rules

- radius는 low-radius 기준을 유지한다.
- list row, toolbar control, panel, chip, widget은 compact spacing을 기본으로 한다.
- typography는 dashboard shell에서 dense 운영 화면에 맞는 크기/leading/weight 체계를 가져야 한다.
- oversized marketing-style spacing이나 decorative gradient는 reference parity를 해치므로 억제한다.

## Component Token Requirements

- top nav, sidebar items, search field, pills, rows, rail cards가 같은 token 언어를 공유해야 한다.
- selected, hover, current, disabled, read-only 상태는 서로 구분되는 semantic token을 가져야 한다.
- avatar strip, status pill, tag chip, row marker는 theme token 안에서 재사용 가능해야 한다.
- 컴포넌트별 ad-hoc `sx` override보다 theme component override와 semantic helper를 우선한다.

## Reference Fidelity Rules

- 목표는 screenshot과 같은 IA와 visual hierarchy를 구현하는 것이지 Jira 상표를 복제하는 것이 아니다.
- header/search/create CTA, dense rows, right rail처럼 screenshot의 핵심 인상 요소는 유지해야 한다.
- pgg domain 특성 때문에 copy와 일부 metric 의미는 달라질 수 있지만, 사용자가 봤을 때 구조와 톤은 동일 계열로 읽혀야 한다.

## Accessibility And Guardrails

- dark surface 위 text contrast는 dense list에서도 읽기 가능한 수준을 유지해야 한다.
- blue accent는 active/selected 의미에 집중하고 semantic overload를 피해야 한다.
- compact density를 위해 클릭 영역을 과도하게 줄이면 안 된다.
- theme source-of-truth는 MUI theme와 `CssBaseline`/component override여야 한다.

## Non-Requirements

- Jira exact hex code 복제
- 브랜드 로고/아이콘 도용
- visual theme와 무관한 data contract 변경
