---
pgg:
  topic: "dashboard-language-ux-settings-overhaul"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-27T12:02:00Z"
  archive_type: "feat"
  project_scope: "current-project"
reactflow:
  node_id: "spec-dashboard-shell-navigation-speed-dial"
  node_type: "spec"
  label: "spec/dashboard/shell-navigation-speed-dial.md"
state:
  summary: "dashboard shell navigation과 SpeedDial UX 계약"
  next: "pgg-code"
---

# Spec: Shell Navigation And SpeedDial

## 목적

상단 navigation과 SpeedDial은 desktop/mobile 양쪽에서 dashboard의 주요 진입점을 제공한다. 텍스트 줄바꿈과 동작 없는 action을 제거하고, dashboard title과 pgg version을 일관되게 표시한다.

## 요구사항

1. TopNavigation의 프로젝트/설정 버튼은 한 줄로 표시되어야 한다.
2. navigation title은 dashboard title 설정 값을 source of truth로 사용해야 한다.
3. dashboard title fallback은 dashboard 설정에 title이 없을 때만 사용한다.
4. SpeedDial은 MUI Persistent action tooltips 패턴을 사용해야 한다.
5. SpeedDial action tooltip은 열림 상태에서 계속 보이도록 `tooltipOpen` 또는 동등한 방식으로 구현한다.
6. 동작 없는 `!` 정보 action은 제거하거나 read-only action임이 명확한 version action으로 대체한다.
7. SpeedDial 마지막 action에는 현재 `pggVersion`이 표시되어야 한다.
8. project selector action은 mobile/compact shell에서만 표시한다.
9. insight toggle은 project surface에서만 표시하고 settings surface에서는 숨긴다.

## 구현 기준

- `DashboardSpeedDial`은 `pggVersion`, `isCompactShell`, `activeTopMenu`를 명시적으로 받아 action visibility를 계산한다.
- read-only action은 disabled 상태여도 사용자가 왜 표시되는지 이해 가능한 label을 가져야 한다.
- `SpeedDialAction`의 `FabProps.disabled`가 tooltip 접근성을 완전히 막지 않는지 확인하고, 필요하면 custom label row로 대체한다.
- TopNavigation button은 `whiteSpace: "nowrap"`, 충분한 horizontal padding, gap 조정, min width 기준을 가진다.

## 검증 기준

- desktop에서 프로젝트/설정 버튼이 줄바꿈되지 않는다.
- mobile에서 project selector action이 보이고 desktop에서는 숨겨진다.
- pgg version이 SpeedDial action list 마지막에 표시된다.
- settings 화면에서 project-only action이 노출되지 않는다.
