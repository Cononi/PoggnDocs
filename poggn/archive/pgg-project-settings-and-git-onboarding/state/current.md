# Current State

## Topic

pgg-project-settings-and-git-onboarding

## Current Stage

qa

## Goal

pgg CLI init/help, 프로젝트별 runtime 설정, dashboard project settings, git repository onboarding 구현 후 구조 정리와 dead code 제거를 완료했다.

## Constraints

- project scope: `current-project`
- archive type: `feat`
- version bump: `minor`
- target version: `2.5.0`
- short name: `project-onboarding`
- working branch: `ai/feat/2.5.0-project-onboarding`
- release branch: `release/2.5.0-project-onboarding`

## Proposal Decision

- status: `reviewed`
- score: `97`
- next: `pgg-plan`
- user question record: `proposal.md#3-사용자-입력-질문-기록`
- 기준안: pgg help 설명 i18n, init checklist, project-scoped settings, dashboard project settings tabs, git setup FAST PATH/SETUP PATH Stepper, git setup deferred completion을 하나의 `feat` 범위로 확정

## Plan Decision

- status: `reviewed`
- score: `96`
- next: `pgg-code`
- plan: `plan.md`
- task: `task.md`
- specs:
  - `spec/cli/localized-help-and-init-checklist.md`
  - `spec/config/project-scoped-settings-and-git-state.md`
  - `spec/git/fast-setup-path-and-deferred-completion.md`
  - `spec/dashboard/project-settings-tabs-and-git-stepper.md`
  - `spec/qa/verification-and-regression-contract.md`

## Implementation Decision

- status: `reviewed`
- score: `95`
- next: `pgg-refactor`
- implementation index: `implementation/index.md`
- code review: `reviews/code.review.md`
- verification:
  - `pnpm build`: pass
  - `pnpm test`: pass
  - `pgg-gate pgg-refactor`: pass
  - `pgg-stage-commit refactor`: `publish_blocked` | unrelated worktree changes present, commit deferred
  - `pgg-stage-commit`: `publish_blocked` | unrelated worktree changes present, commit deferred
  - `pgg-gate pgg-code`: pass

## Refactor Decision

- status: `reviewed`
- score: `96`
- next: `pgg-qa`
- refactor review: `reviews/refactor.review.md`
- cleanup:
  - removed legacy global settings mutation props and unused runtime/branch draft state
  - removed unused `SystemToggle`
  - extracted project git setup helper functions
- verification:
  - `pnpm build`: pass
  - `pnpm test`: pass

## QA Decision

- status: `done`
- score: `96`
- report: `qa/report.md`
- decision: `pass`
- required audits: none
- verification:
  - `pnpm build`: pass
  - `pnpm test`: pass, 44 tests
  - `pgg-gate pgg-code`: pass
  - `pgg-gate pgg-refactor`: pass
  - `pgg-gate pgg-qa` archive path: pass
- manual verification required: GitHub/GitLab real login, repository creation, and push
- archive status: archived, version `2.5.0`
- publish result: `published`
- push status: `success`
- publish commit: `5beab8385152fbd46bcb9d04bcb0dbb630b6f5c8`
- release branch: `release/2.5.0-project-onboarding`
- published at: `2026-04-27T08:09:33Z`
- publish retryable: `true`
- rollback eligible: `true`
- cleanup status: `completed`
- publish reason: release branch push completed successfully

## Git Publish Message

- title: feat: 2.5.0.git 설정 온보딩
- why: pgg init과 dashboard project settings에서 프로젝트별 lang, auto, teams, git 설정을 명확히 관리하고, git 연결을 중간에 취소해도 나중에 등록할 수 있도록 deferred 상태와 검증 가능한 기본값을 남긴다.
- footer: Refs: pgg-project-settings-and-git-onboarding

## Scope Summary

- CLI: `pgg` help는 lang별 기능 설명을 포함하고, `pgg init`은 provider 선택 뒤 lang/auto/teams/git checklist를 제공한다.
- Runtime config: `.pgg/project.json`을 project-scoped source of truth로 유지하고 git connection/auth metadata를 확장한다.
- Git defaults: `defaultRemote: origin`, `workingBranchPrefix: ai`, `releaseBranchPrefix: release`는 git 설정 기본값으로 유지한다.
- Dashboard: 전역 settings에서 lang/auto/teams/git을 제거하고 project detail sidebar의 `설정` 메뉴로 이동한다.
- Project settings UI: MUI Tabs의 `기본` tab은 lang/auto/teams, `git` tab은 git toggle/settings/setup button/branch prefix를 담당한다.
- Git onboarding: 기존 remote가 있으면 FAST PATH, 없거나 재설정이면 SETUP PATH로 진행하며 GitHub/GitLab, HTTPS token, SSH, provider CLI login을 우선 지원한다.
- Git deferred completion: git 정보 입력 중 취소하면 project 생성/설정 저장은 완료하고 git 연결은 `deferred` 상태로 남겨 나중에 `git 정보 추가` 또는 `pgg git`에서 재개한다.
- Implemented: core manifest/snapshot now exposes git setup state and remote metadata; CLI help/init/git deferred flows are localized; dashboard project settings has `기본`/`git` tabs and git setup Stepper; tests cover parser/default/deferred/fast-path detection.

## Current Implementation Notes

- `packages/cli/src/index.ts`의 `printHelp()`는 command list 중심이고 기능 설명이 부족하다.
- `packages/cli/src/index.ts`의 `choose()`는 단일 선택만 지원하므로 init checklist에는 다중 선택 helper가 필요하다.
- `packages/core/src/index.ts`에는 project manifest와 lang/auto/teams/git update API가 이미 있어 저장 경계는 활용 가능하다.
- `normalizeProjectGitConfig()`의 기존 `origin`/`ai`/`release` 기본값은 유지해야 한다.
- `apps/dashboard/src/features/settings/SettingsWorkspace.tsx`가 현재 lang/auto/teams/git을 전역 settings에 노출한다.
- `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx`는 project 설정 값을 읽기 전용 metric으로 보여 주지만 settings tab은 없다.
- `.codex/sh/pgg-git-publish.sh`는 remote/push/auth 실패를 감지하지만 repository setup wizard는 제공하지 않는다.

## Audit Applicability

- `pgg-token`: `not_required` | workflow handoff 문서 구조 변경이 아니라 pgg CLI/dashboard 기능 확장이다
- `pgg-performance`: `not_required` | 주된 범위는 onboarding UX와 git setup orchestration이며 성능 민감 경로가 아니다

## Expert Review

- 프로덕트 매니저: 97, blocking issue 없음
- UX/UI 전문가: 96, blocking issue 없음
- overall score: 97

## Changed Files

| CRUD | path | note |
|---|---|---|
| CREATE | `poggn/active/pgg-project-settings-and-git-onboarding/proposal.md` | proposal 확정 |
| CREATE | `poggn/active/pgg-project-settings-and-git-onboarding/reviews/proposal.review.md` | proposal 전문가 review |
| CREATE | `poggn/active/pgg-project-settings-and-git-onboarding/state/current.md` | 다음 단계 handoff state |
| CREATE | `poggn/active/pgg-project-settings-and-git-onboarding/workflow.reactflow.json` | proposal workflow metadata |
| CREATE | `poggn/active/pgg-project-settings-and-git-onboarding/state/history.ndjson` | proposal stage evidence |
| CREATE | `poggn/active/pgg-project-settings-and-git-onboarding/plan.md` | plan 확정 |
| CREATE | `poggn/active/pgg-project-settings-and-git-onboarding/task.md` | task 분해 |
| CREATE | `poggn/active/pgg-project-settings-and-git-onboarding/spec/cli/localized-help-and-init-checklist.md` | CLI help/init checklist spec |
| CREATE | `poggn/active/pgg-project-settings-and-git-onboarding/spec/config/project-scoped-settings-and-git-state.md` | project settings/git state spec |
| CREATE | `poggn/active/pgg-project-settings-and-git-onboarding/spec/git/fast-setup-path-and-deferred-completion.md` | git onboarding/deferred spec |
| CREATE | `poggn/active/pgg-project-settings-and-git-onboarding/spec/dashboard/project-settings-tabs-and-git-stepper.md` | dashboard project settings spec |
| CREATE | `poggn/active/pgg-project-settings-and-git-onboarding/spec/qa/verification-and-regression-contract.md` | verification spec |
| CREATE | `poggn/active/pgg-project-settings-and-git-onboarding/reviews/plan.review.md` | plan 전문가 review |
| CREATE | `poggn/active/pgg-project-settings-and-git-onboarding/reviews/task.review.md` | task 전문가 review |
| CREATE | `poggn/active/pgg-project-settings-and-git-onboarding/implementation/index.md` | implementation index |
| CREATE | `poggn/active/pgg-project-settings-and-git-onboarding/implementation/diffs/*.diff` | implementation diffs |
| CREATE | `poggn/active/pgg-project-settings-and-git-onboarding/reviews/code.review.md` | code 전문가 review |
| UPDATE | `packages/core/src/index.ts` | git setup metadata/parser/deferred helpers |
| UPDATE | `packages/cli/src/index.ts` | localized help/init checklist/deferred git flow |
| UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | git setup snapshot fields/settings section |
| UPDATE | `apps/dashboard/vite.config.ts` | git defer API route |
| UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | project-scoped settings mutations |
| UPDATE | `apps/dashboard/src/app/DashboardShellChrome.tsx` | project settings sidebar item |
| UPDATE | `apps/dashboard/src/features/settings/SettingsWorkspace.tsx` | global settings cleanup |
| UPDATE | `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx` | project settings tabs/git stepper |
| UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | ko/en project settings labels |
| UPDATE | `packages/core/dist/index.d.ts` | rebuilt package output |
| UPDATE | `packages/core/dist/index.js` | rebuilt package output |
| UPDATE | `packages/core/dist/index.js.map` | rebuilt package output |
| UPDATE | `packages/cli/dist/index.js` | rebuilt package output |
| UPDATE | `packages/cli/dist/index.js.map` | rebuilt package output |
| CREATE | `packages/core/test/git-onboarding.test.mjs` | git onboarding regression tests |
| CREATE | `poggn/active/pgg-project-settings-and-git-onboarding/reviews/refactor.review.md` | refactor 전문가 review |
| UPDATE | `poggn/active/pgg-project-settings-and-git-onboarding/implementation/index.md` | refactor diff refs 추가 |
| CREATE | `poggn/active/pgg-project-settings-and-git-onboarding/implementation/diffs/012_REFACTOR_dashboard_app_settings_props.diff` | refactor diff |
| CREATE | `poggn/active/pgg-project-settings-and-git-onboarding/implementation/diffs/013_REFACTOR_global_settings_dead_code.diff` | refactor diff |
| CREATE | `poggn/active/pgg-project-settings-and-git-onboarding/implementation/diffs/014_REFACTOR_project_settings_helpers.diff` | refactor diff |
| CREATE | `poggn/active/pgg-project-settings-and-git-onboarding/qa/report.md` | QA report |

## Next Step

Done. Functional QA, archive/version 기록, release branch publish, and ai branch cleanup are complete.
