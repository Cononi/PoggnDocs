---
pgg:
  topic: "pgg-project-settings-and-git-onboarding"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 95
  updated_at: "2026-04-27T07:00:49Z"
  archive_type: "feat"
  project_scope: "current-project"
---

# Implementation Index

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 001 | UPDATE | `packages/core/src/index.ts` | `implementation/diffs/001_UPDATE_packages_core_src_index_ts.diff` | `T1/T3/T4` | git connection metadata, remote parser, setup inspection, deferred setup helpers, snapshot fields |
| 002 | UPDATE | `packages/cli/src/index.ts` | `implementation/diffs/002_UPDATE_packages_cli_src_index_ts.diff` | `T2/T4` | localized help, init language/checklist flow, git deferred setup output |
| 003 | UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/003_UPDATE_dashboard_model.diff` | `T1/T5/T6` | project git setup fields and project detail settings section type |
| 004 | UPDATE | `apps/dashboard/vite.config.ts` | `implementation/diffs/004_UPDATE_dashboard_api.diff` | `T4/T6` | dashboard API endpoint for deferred git setup |
| 005 | UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/005_UPDATE_dashboard_app.diff` | `T5/T6` | project-scoped settings mutation callbacks |
| 006 | UPDATE | `apps/dashboard/src/app/DashboardShellChrome.tsx` | `implementation/diffs/006_UPDATE_dashboard_shell.diff` | `T5` | project sidebar settings menu and global settings sidebar cleanup |
| 007 | UPDATE | `apps/dashboard/src/features/settings/SettingsWorkspace.tsx` | `implementation/diffs/007_UPDATE_global_settings_workspace.diff` | `T5` | removed project runtime controls from global settings surface |
| 008 | UPDATE | `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx` | `implementation/diffs/008_UPDATE_project_detail_settings.diff` | `T6` | project settings tabs, git summary, default branch prefix fields, deferred setup stepper |
| 009 | UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/009_UPDATE_dashboard_locale.diff` | `T2/T6` | ko/en labels for project settings and git setup |
| 010 | UPDATE | `packages/core/dist/index.d.ts`, `packages/core/dist/index.js`, `packages/core/dist/index.js.map`, `packages/cli/dist/index.js`, `packages/cli/dist/index.js.map` | `implementation/diffs/010_UPDATE_dist_outputs.diff` | `T1/T2/T3/T4` | rebuilt package outputs |
| 011 | CREATE | `packages/core/test/git-onboarding.test.mjs` | `implementation/diffs/011_CREATE_packages_core_test_git-onboarding_test_mjs.diff` | `T7` | parser, defaults preservation, deferred setup, fast path inspection tests |
| 012 | UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/012_REFACTOR_dashboard_app_settings_props.diff` | `refactor` | removed legacy global settings mutation props |
| 013 | UPDATE | `apps/dashboard/src/features/settings/SettingsWorkspace.tsx` | `implementation/diffs/013_REFACTOR_global_settings_dead_code.diff` | `refactor` | removed dead project runtime state and unused SystemToggle |
| 014 | UPDATE | `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx` | `implementation/diffs/014_REFACTOR_project_settings_helpers.diff` | `refactor` | extracted git connection and setup step helper logic |

## Verification

- `pnpm build`
- `pnpm test`
- `./.codex/sh/pgg-stage-commit.sh pgg-project-settings-and-git-onboarding implementation ...` -> `publish_blocked`
- `./.codex/sh/pgg-gate.sh pgg-code pgg-project-settings-and-git-onboarding`
- `pnpm build` after refactor
- `pnpm test` after refactor

## Notes

- Existing dirty baseline paths such as `.pgg/project.json` and `add-img/*.png` were not treated as implementation changes for this topic.
- Stage commit was attempted because `pgg git=on`, but the helper deferred the commit due unrelated worktree changes.
- Actual GitHub/GitLab login, repository creation, and push remain manual verification items because credentials and network access are environment-dependent.
