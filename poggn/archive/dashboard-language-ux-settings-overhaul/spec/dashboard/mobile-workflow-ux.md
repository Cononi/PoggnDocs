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
  node_id: "spec-dashboard-mobile-workflow-ux"
  node_type: "spec"
  label: "spec/dashboard/mobile-workflow-ux.md"
state:
  summary: "mobile workflow UX와 tab border 계약"
  next: "pgg-code"
---

# Spec: Mobile Workflow UX

## 목적

모바일 화면에서 dashboard navigation이 중복되지 않아야 하며, workflow progress는 좁은 화면에서도 읽기 쉬운 세로 구조로 표시되어야 한다.

## 요구사항

1. mobile bottom navigation은 제거한다.
2. 관련 type/function이 더 이상 쓰이지 않으면 제거한다.
3. mobile Project drawer에서는 `WORKSPACE` label과 project selector trigger card를 숨긴다.
4. mobile에서 project selector는 SpeedDial action으로 접근한다.
5. workflow progress는 mobile에서 세로 orientation으로 표시한다.
6. workflow tab active 상태는 active tab 하단 border만 끊겨 panel border와 자연스럽게 이어져야 한다.

## 구현 기준

- `DashboardMobileBottomNavigation` component와 렌더링 call site를 제거하거나 no-op로 남기지 않는다.
- mobile drawer는 `compactShell` 또는 `hideWorkspaceHeader` 같은 prop으로 workspace 영역 노출을 제어한다.
- workflow progress component는 `direction={{ xs: "column", md: "row" }}` 또는 별도 mobile variant를 사용한다.
- tab border는 container bottom border와 active tab background/border override로 해결한다.

## 검증 기준

- mobile viewport에서 bottom navigation DOM이 없다.
- mobile Project drawer에서 `WORKSPACE` 텍스트가 보이지 않는다.
- mobile workflow progress가 세로로 쌓인다.
- tab active 영역과 panel 경계가 끊김 없이 이어져 보인다.
