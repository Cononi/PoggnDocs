---
pgg:
  topic: "dashboard-mobile-routing"
  stage: "task"
  status: "approved"
  skill: "pgg-plan"
  score: 94
  updated_at: "2026-04-27T08:48:06Z"
  archive_type: "feat"
  project_scope: "current-project"
---

# Task

## T1. Route State Adapter

- spec: `S1`
- files:
  - `apps/dashboard/src/app/dashboardRouteState.ts`
  - `apps/dashboard/src/app/DashboardApp.tsx`
  - `apps/dashboard/src/shared/store/dashboardStore.ts`
  - `apps/dashboard/src/shared/model/dashboard.ts`
- work:
  - define route/query parser and serializer
  - hydrate route-level state from URL
  - update URL when primary screen, project, section, settings panel, topic/file selection changes
  - preserve localStorage for non-route preferences
- acceptance:
  - refresh restores projects/settings route state
  - invalid query values are repaired safely

## T2. Responsive Speed Dial And Bottom Navigation

- spec: `S2`
- files:
  - `apps/dashboard/src/app/DashboardShellChrome.tsx`
  - `apps/dashboard/src/app/DashboardApp.tsx`
  - `apps/dashboard/src/shared/model/dashboard.ts`
- work:
  - remove PC header project add button
  - remove settings header insights/latest project exposure
  - add MUI Speed Dial action matrix
  - add mobile MUI Bottom Navigation
  - keep latest project summary non-interactive at the top of Speed Dial
- acceptance:
  - settings header is clean
  - mobile users can move home/projects/settings
  - Speed Dial opens add project, insights, and project selector in valid contexts

## T3. Project Selector Delete Flow

- spec: `S3`
- files:
  - `apps/dashboard/src/app/DashboardShellChrome.tsx`
  - `apps/dashboard/src/app/DashboardApp.tsx`
- work:
  - add delete action to each selector project row
  - wire delete action to existing `pendingDeleteProjectId` confirmation dialog
  - prevent row select/delete event collision
  - repair selected project and URL after deletion
- acceptance:
  - selector modal can start delete
  - confirmation dialog is mandatory
  - current root project delete remains blocked

## T4. I18n Coverage

- spec: `S4`
- files:
  - `apps/dashboard/src/shared/locale/dashboardLocale.ts`
  - any changed dashboard TSX file with new user-facing copy
- work:
  - add ko/en keys for Speed Dial, Bottom Navigation, selector delete, route fallback, and `stage-blocked`
  - replace hard-coded fixed copy introduced by this topic with dictionary keys
  - keep API data unmodified
- acceptance:
  - ko/en key sets remain symmetrical
  - new fixed UI copy is dictionary-backed

## T5. Workflow Stage Blocked

- spec: `S5`
- files:
  - `apps/dashboard/src/features/history/historyModel.ts`
  - `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
  - `apps/dashboard/src/shared/locale/dashboardLocale.ts`
- work:
  - add `stage-blocked` to workflow status model
  - detect flow-level blocked/failed/error evidence
  - render blocked failure with lock icon and danger tone
  - include `stage-blocked` in blocked counts and labels
- acceptance:
  - blocked stage appears as `stage-blocked`
  - lock icon and danger color are visible
  - existing completed/current/updating/pending behavior is preserved

## Audit Applicability

- [pgg-token]: [not_required] | task split follows dashboard UI/spec boundaries and does not require token audit
- [pgg-performance]: [not_required] | tasks do not introduce a performance-sensitive contract
