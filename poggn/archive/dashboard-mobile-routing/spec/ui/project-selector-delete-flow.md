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

# Spec: Project Selector Delete Flow

## Purpose

project selector modal에서 project 선택뿐 아니라 삭제 진입도 가능하게 하고, 삭제는 별도 confirmation dialog를 반드시 거치게 한다.

## Current Boundary

- `ProjectSelectorDialog`는 project list와 선택 action만 제공한다.
- `DashboardApp.tsx`에는 `pendingDeleteProjectId`, `dangerousDeleteRoot`, `handleDeleteProject`, delete confirmation dialog가 이미 있다.
- 삭제 API는 `DELETE /api/dashboard/projects/:projectId` payload를 사용한다.

## Requirements

- `ProjectSelectorDialog` props에 delete callback과 live/current project constraints를 전달한다.
- 각 project row에는 delete icon/button을 제공하되, row 선택 click과 delete click이 충돌하지 않아야 한다.
- Delete action은 selector modal을 닫지 않고 confirmation dialog를 열 수 있어야 한다. 단, confirmation이 foreground modal로 의미상 우선되어야 한다.
- 현재 dashboard root project 삭제는 기존 `deleteProjectBlockedCurrent` 경고와 disabled state를 유지한다.
- 실제 root folder 삭제 checkbox는 기존 dangerous option을 유지한다.
- 삭제 성공 후 selected project가 사라지면 기존 fallback 로직으로 current project 또는 첫 project를 선택한다.
- project row 안의 delete label, tooltip, confirmation copy는 i18n dictionary에서 가져온다.

## Interaction

1. User opens project selector modal.
2. User clicks delete action for a project.
3. Dashboard sets `pendingDeleteProjectId`.
4. Confirmation dialog shows selected project name/root.
5. User confirms deletion.
6. Dashboard calls existing mutation and invalidates snapshot.
7. Selection and URL query are repaired if deleted project was selected.

## Acceptance

- Project selector modal exposes a delete action per project.
- Delete requires a second confirmation modal.
- Current root project cannot be deleted.
- Deleting a non-current project does not break current URL or selected project state.
