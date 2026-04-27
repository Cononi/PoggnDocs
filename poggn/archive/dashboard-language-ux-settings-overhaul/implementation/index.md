---
pgg:
  topic: "dashboard-language-ux-settings-overhaul"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 95
  updated_at: "2026-04-27T12:23:22Z"
  archive_type: "feat"
  project_scope: "current-project"
reactflow:
  node_id: "implementation-dashboard-language-ux-settings-overhaul"
  node_type: "implementation"
  label: "implementation/index.md"
state:
  summary: "dashboard language and UX overhaul implementation"
  next: "pgg-refactor"
---

# Implementation Index

## Summary

`pgg lang` 기반 신규 workflow 문서 skeleton, dashboard shell/navigation/SpeedDial, settings category panel, mobile workflow UX, Sprint Progress 중복 제거, workflow blocked 상태 우선순위, project add/delete 안전 UX를 구현했다.

## Task Coverage

| Task | status | evidence |
|---|---|---|
| T1 | complete | `.codex/sh/pgg-new-topic.sh`, `packages/core/src/templates.ts`, `packages/core/test/skill-generation.test.mjs` |
| T2 | complete | `DashboardShellChrome.tsx`, `DashboardApp.tsx` |
| T3 | complete | `SettingsWorkspace.tsx`, settings category route/panel wiring |
| T4 | complete | mobile bottom navigation 제거, mobile drawer/workflow progress responsive 처리 |
| T5 | complete | Sprint Progress dedupe, blocked evidence보다 이후 completion evidence 우선 |
| T6 | complete | project add form visual refinement, dangerous delete double confirmation |
| T7 | complete | build/test/diff/review 기록 |

## Diff Artifacts

| file | scope |
|---|---|
| `implementation/diffs/001_UPDATE_pgg_language_document_contract.diff` | pgg 신규 topic 문서 언어 skeleton과 core 회귀 테스트 |
| `implementation/diffs/002_UPDATE_dashboard_shell_settings_and_project_safety.diff` | dashboard shell, SpeedDial, settings category, project add/delete safety |
| `implementation/diffs/003_UPDATE_workflow_status_insight_and_mobile_progress.diff` | mobile workflow progress, Sprint Progress dedupe, workflow status 계산 |
| `implementation/diffs/004_UPDATE_dashboard_history_verification_tests.diff` | root test script와 dashboard history model 회귀 테스트 |
| `implementation/diffs/005_REFACTOR_dashboard_state_and_category_cleanup.diff` | legacy dashboard sidebar state와 category panel 중복 제거 |
| `implementation/diffs/006_REFACTOR_dashboard_unused_locale_cleanup.diff` | legacy sidebar/quick action locale dead key 제거 |

## Verification

| command | result | note |
|---|---|---|
| `git diff --check` | pass | whitespace/error 없음 |
| `pnpm test` | pass | core 50 tests, dashboard history 2 tests |
| `pnpm build` | pass | dashboard chunk-size warning만 존재 |
| `.codex/sh/pgg-stage-commit.sh ... implementation` | publish_blocked | unrelated worktree changes present |
| `.codex/sh/pgg-gate.sh pgg-refactor dashboard-language-ux-settings-overhaul` | pass | refactor gate 조건 충족 |
| `.codex/sh/pgg-gate.sh pgg-token dashboard-language-ux-settings-overhaul` | pass | token audit gate 조건 충족 |
| `.codex/sh/pgg-stage-commit.sh ... refactor` | publish_blocked | unrelated worktree changes present |

## Manual QA Remaining

- desktop/mobile 실제 viewport에서 TopNavigation, SpeedDial persistent tooltip, mobile project selector visibility를 확인한다.
- Settings category panel의 CRUD/read-only 상태를 화면에서 확인한다.
- project add/delete dialog의 시각 밀도와 double confirmation UX를 화면에서 확인한다.
