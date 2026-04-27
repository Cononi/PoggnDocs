---
pgg:
  topic: "dashboard-language-ux-settings-overhaul"
  stage: "refactor"
  status: "reviewed"
  skill: "pgg-refactor"
  score: 96
  updated_at: "2026-04-27T12:29:03Z"
  archive_type: "feat"
  project_scope: "current-project"
reactflow:
  node_id: "refactor-cleanup-dashboard-language-ux-settings-overhaul"
  node_type: "refactor"
  label: "refactor/cleanup.md"
state:
  summary: "dashboard state and category cleanup"
  next: "pgg-token"
---

# Refactor Cleanup

## Cleanup Summary

- Settings category panel로 진입점이 정리되면서 더 이상 호출되지 않는 `activeSidebarItem` store/type/action을 제거했다.
- Project surface의 legacy category branch를 제거하고 category management 렌더링을 `renderCategoryManagementPanel`로 단일화했다.
- sidebar footer 제거 후 남아 있던 `statusSyncManaged`, `goToSettings` locale dead key를 제거했다.
- 이전 sidebar/quick action 설계의 미사용 locale key를 추가 제거했다.

## Evidence

| area | result |
|---|---|
| dead state | `DashboardSidebarItem`, `activeSidebarItem`, `setActiveSidebarItem` 제거 |
| duplicated render | category mutation panel props를 단일 render 함수로 통합 |
| dead locale | sidebar footer 전용 locale key 제거 |
| diff | `implementation/diffs/005_REFACTOR_dashboard_state_and_category_cleanup.diff` |
| additional diff | `implementation/diffs/006_REFACTOR_dashboard_unused_locale_cleanup.diff` |

## Verification

| command | result | note |
|---|---|---|
| `pnpm test` | pass | core 50 tests, dashboard history 2 tests |
| `pnpm build` | pass | dashboard chunk-size warning only |
| `git diff --check` | pass | whitespace/error 없음 |
| `.codex/sh/pgg-gate.sh pgg-token dashboard-language-ux-settings-overhaul` | pass | token audit gate 조건 충족 |
| `.codex/sh/pgg-stage-commit.sh ... refactor` | publish_blocked | unrelated worktree changes present |
| `.codex/sh/pgg-stage-commit.sh ... refactor` | publish_blocked | second pass도 unrelated worktree changes 때문에 보류 |
