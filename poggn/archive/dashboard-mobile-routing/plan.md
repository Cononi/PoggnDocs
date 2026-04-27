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

# Plan

## 1. Goal

dashboard navigation and workflow visibility will be planned around URL-restorable screen state, responsive Speed Dial and Bottom Navigation actions, project selector deletion, i18n coverage, and explicit `stage-blocked` workflow status.

## 2. Scope

- Route-state synchronization for dashboard primary screen, selected project, project section, settings panel, topic/file selection, and route-opened modals.
- Header cleanup and MUI Speed Dial action migration for project add, project insights, latest project summary, home, and project selector.
- Mobile MUI Bottom Navigation for home/projects/settings.
- Project selector modal delete action connected to existing confirmation dialog.
- i18n key coverage for all new fixed UI copy.
- Workflow overview model/rendering support for `stage-blocked`.

## 3. Current Code Boundaries

- `DashboardApp.tsx` owns state wiring, dialogs, mutation payloads, and the app shell.
- `DashboardShellChrome.tsx` owns top navigation, sidebar, project selector modal, and state panels.
- `dashboardStore.ts` persists route-like UI state to localStorage but does not use URL.
- `dashboardLocale.ts` is the dictionary boundary for ko/en UI copy.
- `historyModel.ts` computes workflow steps and status.
- `HistoryWorkspace.tsx` renders workflow overview progress, status counts, and blocked visuals.

## 4. Architecture

- Add a dashboard route-state adapter in the app layer, preferably `apps/dashboard/src/app/dashboardRouteState.ts`.
- Keep router dependency out of scope; use browser History API and `popstate`.
- Treat route path/query as the source of truth for screen-level navigation after hydration.
- Keep localStorage for theme, filters, and non-route preferences.
- Keep existing mutation and dialog flows, but change their entry points.
- Make `stage-blocked` a first-class workflow status while preserving existing blocked rendering compatibility.

## 5. Spec Index

| ID | Spec | Purpose |
|---|---|---|
| S1 | `spec/ui/dashboard-route-state.md` | path/query contract and URL hydration behavior |
| S2 | `spec/ui/responsive-speed-dial-bottom-nav.md` | Speed Dial, header cleanup, Bottom Navigation action matrix |
| S3 | `spec/ui/project-selector-delete-flow.md` | selector modal delete action and confirmation flow |
| S4 | `spec/infra/dashboard-i18n-coverage.md` | dictionary requirements for new UI copy |
| S5 | `spec/ui/workflow-stage-blocked.md` | `stage-blocked` status model and rendering |

## 6. Execution Order

1. Implement route-state adapter and wire primary screen/project/section/panel hydration.
2. Refactor header actions into Speed Dial and add mobile Bottom Navigation.
3. Add project selector delete entry point and preserve confirmation behavior.
4. Add i18n keys while migrating new fixed copy.
5. Add `stage-blocked` model detection and workflow overview rendering.
6. Run build and manual route/mobile verification notes because current-project verification contract is manual.

## 7. Risks

- URL state and store persistence can fight each other if both write during hydration. The implementation must isolate one initialization path and avoid infinite replace/push loops.
- Modal query support should stay narrow. Persisting every modal or draft state would make URLs noisy and brittle.
- Speed Dial latest summary is non-interactive, which MUI Speed Dial does not model as a normal action by default. The implementation may need a custom disabled item pattern that still looks consistent and remains accessible.
- `stage-blocked` must not turn archived completed topics into failed topics through broad keyword matching.

## 8. Audit Applicability

- [pgg-token]: [not_required] | dashboard UI routing and interaction planning is the core scope, not token workflow assets
- [pgg-performance]: [not_required] | no performance-sensitive algorithm or declared verification contract is introduced in the plan

## 9. Verification Plan

- `pnpm build` as implementation-level check if code changes are made later.
- Manual verification required:
  - refresh `/projects?project=<id>&section=history`
  - refresh `/settings?panel=refresh`
  - mobile Bottom Navigation home/projects/settings
  - Speed Dial add/insights/project selector actions
  - project selector delete confirmation
  - workflow overview `stage-blocked` visual

## 10. Handoff

- Next flow: `pgg-code`
- Primary handoff: `state/current.md`
- Supporting docs: `plan.md`, `task.md`, `spec/ui/*.md`, `spec/infra/*.md`
