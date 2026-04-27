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

# Spec: Dashboard Route State

## Purpose

dashboard 화면 상태를 URL path/query와 동기화해 새로고침, 뒤로가기, 직접 URL 진입 시 사용자가 보던 primary screen과 주요 선택 상태를 복원한다.

## Current Boundary

- `apps/dashboard/src/app/DashboardApp.tsx`는 `activeTopMenu`, `activeDetailSection`, `activeSettingsView`, `selectedProjectId`, `selectedTopicKey`, `insightsRailOpen`, modal state를 React/Zustand state로만 관리한다.
- `apps/dashboard/src/shared/store/dashboardStore.ts`는 `pgg.dashboard.ui-state` localStorage에 UI state를 저장한다.
- `apps/dashboard/src/main.tsx`와 `apps/dashboard/src/App.tsx`에는 router dependency가 없다.

## Route Contract

| Route | Meaning | Required State |
|---|---|---|
| `/` | home alias, projects main으로 normalize | `screen=projects`, `section=main` |
| `/home` | home/projects landing | `screen=projects`, `section=main` |
| `/projects` | selected project workspace | query의 `project`, `section`, `topic`, `file` 적용 |
| `/settings` | dashboard settings workspace | query의 `panel` 적용 |

## Query Contract

| Query | Applies To | Values |
|---|---|---|
| `project` | `/projects` | `ProjectSnapshot.id` |
| `section` | `/projects` | `main`, `history`, `report`, `files`, `settings` |
| `topic` | `/projects` | `buildTopicKey(topic)` |
| `file` | `/projects` | topic artifact `sourcePath` |
| `panel` | `/settings` | `main`, `refresh`, `git`, `system` |
| `insights` | `/projects` only | `open` or omitted |
| `modal` | optional modal deep link | `project-selector`, `add-project` only when opened by explicit action |

## Behavior

- URL is the source of truth for route-level state after initial hydration.
- Store persistence remains valid for theme, filters, and non-route preferences.
- Invalid route/query values fall back to the closest valid state and replace the URL instead of creating a broken screen.
- Project selection fallback uses existing `resolveInitialSelectedProjectId` and selected project existence checks.
- Switching top-level screen updates the path.
- Switching project section or settings panel updates query without losing unrelated valid query values for that route.
- Closing volatile modal state removes `modal` from query when that modal was route-opened.
- Browser back/forward updates the dashboard state without additional API mutation.

## Non-Goals

- Do not add authentication or external routing service behavior.
- Do not translate API-provided path, project name, topic name, or artifact content.
- Do not persist every transient hover, drawer, or draft field in query.

## Acceptance

- Refresh on `/projects?project=<id>&section=history&topic=<key>` returns to that project history view.
- Refresh on `/settings?panel=refresh` returns to the refresh settings panel.
- `/` and `/home` are valid entry points and do not strand mobile users in settings.
- Back/forward moves between screen/section/panel changes consistently.
