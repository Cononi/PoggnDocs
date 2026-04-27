---
pgg:
  topic: "dashboard-mobile-routing"
  stage: "plan"
  status: "approved"
  skill: "pgg-plan"
  score: 94
  updated_at: "2026-04-27T08:48:06Z"
  archive_type: "feat"
  project_scope: "current-project"
---

# Spec: Responsive Speed Dial And Bottom Navigation

## Purpose

header action 과밀과 모바일 이동 불편을 줄이기 위해 MUI Speed Dial과 MUI Bottom Navigation을 화면 크기와 route context별 primary action surface로 사용한다.

## Current Boundary

- `TopNavigation`은 PC header에 project add button, insights button, latest project chip을 노출한다.
- compact shell은 sidebar drawer를 열 수 있지만 settings에서 home/projects로 돌아가는 모바일 하단 navigation이 없다.
- `ProjectContextSidebar`의 project selector는 PC sidebar에 자연스럽지만 모바일에서는 drawer를 거쳐야 한다.

## Action Matrix

| Context | Header | Speed Dial | Bottom Navigation |
|---|---|---|---|
| PC `/projects` | brand + nav only, no add button | latest summary disabled, add project, insights, project selector | not shown |
| PC `/settings` | brand + nav only, no insights/latest chip | latest summary disabled, add project, home/projects shortcut | not shown |
| Mobile `/home` or `/projects` | brand + compact menu only | latest summary disabled, home, add project, insights, project selector | home, projects, settings |
| Mobile `/settings` | brand + compact menu only | latest summary disabled, home, add project | home, projects, settings |

## Requirements

- Use `@mui/material` Speed Dial and Bottom Navigation components already available in the project.
- Latest project summary appears as the first Speed Dial item and is non-interactive.
- Project add action opens the existing add project dialog.
- Insights action toggles the existing insights rail/drawer only from project context.
- Mobile project selector action opens the project selector modal directly.
- Bottom Navigation is mobile-only and must not overlap the Speed Dial or page content.
- Header must not show insights button or latest project chip on settings route.
- PC header must not show project add button.

## Layout

- Reserve bottom padding for mobile content equal to Bottom Navigation height plus safe area.
- Keep Speed Dial above Bottom Navigation on mobile.
- Use icon buttons with accessible labels from i18n keys.
- Do not introduce visible help text explaining how Speed Dial or Bottom Navigation work.

## Acceptance

- PC project add is available from Speed Dial and absent from header.
- Settings header has no insights button and no latest project chip.
- Mobile settings screen can navigate home/projects/settings without opening the sidebar drawer.
- Mobile project screen can open project selector from Speed Dial.
- Speed Dial latest summary cannot trigger navigation or project selection.
