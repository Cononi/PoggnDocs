---
pgg:
  topic: "pgg-username-dashboard-workflow-refinement"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-27T13:14:00Z"
  archive_type: "feat"
  project_scope: "current-project"
---

# Spec: Insights, Speed Dial, Sidebar

## Scope

PROJECT INSIGHTS, speed dial, project sidebar bottom 영역의 UX 정리.

## Requirements

- PROJECT INSIGHTS의 Sprint Progress status label은 중복 없이 한 번씩만 표시한다.
- Project Insights 최하단 닫기 버튼은 제거한다.
- SpeedDial에서 version chip/action은 제거한다.
- SpeedDial actions는 MUI Persistent action tooltips pattern을 유지한다.
  - `tooltipOpen`을 유지하거나 동일하게 항상 label이 보이는 방식이어야 한다.
  - disabled dummy action은 만들지 않는다.
- Sidebar 최하단에 username card를 추가한다.
  - configured username 표시
  - missing username empty state 표시
  - settings/config action으로 이동 가능한 affordance 제공

## Acceptance Criteria

- Sprint Progress에는 완료, 진행중, 차단 status가 각각 하나씩만 표시된다.
- PROJECT INSIGHTS bottom close button이 없다.
- SpeedDial action label이 항상 보인다.
- Sidebar bottom user card는 desktop/mobile drawer 모두에서 layout overflow 없이 표시된다.
