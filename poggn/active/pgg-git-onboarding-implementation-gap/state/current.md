# Current State

## Topic

pgg-git-onboarding-implementation-gap

## Current Stage

refactor

## Goal

`test.md` 중 이전 구현에서 남은 git onboarding 미구현 gap을 실제 CLI/dashboard setup 실행 흐름으로 마감한다.

## Constraints

- project scope: `current-project`
- archive type: `fix`
- version bump: `patch`
- target version: `2.6.1`
- short name: `git-gap`
- working branch: `ai/fix/2.6.1-git-gap`
- release branch: `release/2.6.1-git-gap`

## Proposal Decision

- status: `reviewed`
- score: `96`
- next: `pgg-plan`
- user question record: `proposal.md#3-사용자-입력-질문-기록`
- 기준안: 기존 `pgg-project-settings-and-git-onboarding` 범위 중 FAST PATH/SETUP PATH가 deferred 안내로만 남은 부분을 `fix`/`patch`로 보완한다.

## Plan Decision

- status: `reviewed`
- score: `96`
- next: `pgg-code`
- plan: `plan.md`
- task: `task.md`
- specs:
  - `spec/core/git-onboarding-engine.md`
  - `spec/cli/init-and-git-onboarding-flow.md`
  - `spec/dashboard/git-setup-stepper-execution.md`
  - `spec/qa/git-onboarding-verification-contract.md`

## Current Implementation Findings

- CLI help와 init checklist는 일부 구현되어 있다.
- `pgg git` 활성 흐름은 `updateProjectGitMode()`와 `deferProjectGitSetup()` 중심이며 실제 repository 연결/인증/remote/push setup flow로 이어지지 않는다.
- dashboard project settings와 MUI Stepper는 존재하지만 `git 정보 추가` modal은 입력/검증/실행 없이 defer 또는 close만 제공한다.
- core에는 git metadata와 remote URL parsing helper가 있으나 GitHub/GitLab setup orchestration API는 확인되지 않았다.

## Scope Summary

- CLI: `pgg init` git 선택 후 local/remote path, `pgg git` 활성 후 FAST PATH/SETUP PATH 실행을 구현한다.
- Core: command runner abstraction과 git onboarding result contract를 추가한다.
- Dashboard: setup 실행 API와 Stepper 입력/실행/재시도/defer UI를 추가한다.
- Manifest: token은 저장하지 않고 provider/owner/repository/remote/auth method/setup status만 저장한다.

## Active Specs

- `spec/core/git-onboarding-engine.md`
- `spec/cli/init-and-git-onboarding-flow.md`
- `spec/dashboard/git-setup-stepper-execution.md`
- `spec/qa/git-onboarding-verification-contract.md`

## Active Tasks

- `T1`: Core Git Onboarding Engine
- `T2`: CLI Init/Git Flow
- `T3`: Dashboard API And Snapshot Contract
- `T4`: Dashboard Stepper Execution UI
- `T5`: Verification And Build Outputs

## Implementation Decision

- status: `reviewed`
- score: `95`
- next: `pgg-refactor`
- implementation index: `implementation/index.md`
- code review: `reviews/code.review.md`
- verification:
  - `pnpm build`: pass
  - `pnpm test`: pass, 48 tests

## Refactor Decision

- status: `reviewed`
- score: `96`
- next: `pgg-qa`
- refactor review: `reviews/refactor.review.md`
- cleanup:
  - centralized repeated `ProjectGitOnboardingResult` construction with `createGitOnboardingResult()`
  - stopped remote onboarding after auth, branch, or push command failure
  - added regression coverage for auth validation failure before branch/push
- verification:
  - `pnpm build`: pass
  - `pnpm test`: pass, 49 tests
  - `pgg-stage-commit refactor`: pending

## Audit Applicability

- `pgg-token`: `not_required` | workflow handoff 구조 변경이 아니라 CLI/dashboard git setup 기능 gap 보완이다
- `pgg-performance`: `not_required` | git onboarding은 사용자 주도 setup flow이며 성능 민감 runtime 경로가 아니다

## Expert Review

- 프로덕트 매니저: 96, blocking issue 없음
- UX/UI 전문가: 96, blocking issue 없음
- 소프트웨어 아키텍트: 96, blocking issue 없음
- 도메인 전문가: 96, blocking issue 없음
- overall score: 96

## Changed Files

| CRUD | path | note |
|---|---|---|
| CREATE | `poggn/active/pgg-git-onboarding-implementation-gap/proposal.md` | gap remediation proposal 확정 |
| CREATE | `poggn/active/pgg-git-onboarding-implementation-gap/reviews/proposal.review.md` | proposal 전문가 review |
| CREATE | `poggn/active/pgg-git-onboarding-implementation-gap/state/current.md` | 다음 단계 handoff state |
| CREATE | `poggn/active/pgg-git-onboarding-implementation-gap/workflow.reactflow.json` | proposal workflow metadata |
| CREATE | `poggn/active/pgg-git-onboarding-implementation-gap/state/history.ndjson` | proposal stage evidence |
| CREATE | `poggn/active/pgg-git-onboarding-implementation-gap/state/dirty-worktree-baseline.txt` | topic 생성 시점 dirty worktree baseline |
| CREATE | `poggn/active/pgg-git-onboarding-implementation-gap/plan.md` | plan 확정 |
| CREATE | `poggn/active/pgg-git-onboarding-implementation-gap/task.md` | task 분해 |
| CREATE | `poggn/active/pgg-git-onboarding-implementation-gap/spec/core/git-onboarding-engine.md` | core git onboarding spec |
| CREATE | `poggn/active/pgg-git-onboarding-implementation-gap/spec/cli/init-and-git-onboarding-flow.md` | CLI init/git flow spec |
| CREATE | `poggn/active/pgg-git-onboarding-implementation-gap/spec/dashboard/git-setup-stepper-execution.md` | dashboard setup Stepper spec |
| CREATE | `poggn/active/pgg-git-onboarding-implementation-gap/spec/qa/git-onboarding-verification-contract.md` | verification contract spec |
| CREATE | `poggn/active/pgg-git-onboarding-implementation-gap/reviews/plan.review.md` | plan 전문가 review |
| CREATE | `poggn/active/pgg-git-onboarding-implementation-gap/reviews/task.review.md` | task 전문가 review |
| CREATE | `poggn/active/pgg-git-onboarding-implementation-gap/implementation/index.md` | implementation diff index |
| CREATE | `poggn/active/pgg-git-onboarding-implementation-gap/implementation/diffs/*.diff` | implementation diffs |
| CREATE | `poggn/active/pgg-git-onboarding-implementation-gap/reviews/code.review.md` | code 전문가 review |
| CREATE | `poggn/active/pgg-git-onboarding-implementation-gap/reviews/refactor.review.md` | refactor 전문가 review |
| UPDATE | `packages/core/src/index.ts` | git onboarding engine/result contract |
| UPDATE | `packages/cli/src/index.ts` | init/git onboarding flow |
| UPDATE | `apps/dashboard/vite.config.ts` | git setup execution endpoint |
| UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | git setup mutation wiring |
| UPDATE | `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx` | setup Stepper execution UI |
| UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | git setup request model |
| UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | ko/en setup labels |
| UPDATE | `packages/core/test/git-onboarding.test.mjs` | mock regression coverage |
| UPDATE | `packages/core/dist/index.d.ts` | core type build output |
| UPDATE | `packages/core/dist/index.js` | core build output |
| UPDATE | `packages/core/dist/index.js.map` | core sourcemap build output |
| UPDATE | `packages/cli/dist/index.js` | CLI build output |
| UPDATE | `packages/cli/dist/index.js.map` | CLI sourcemap build output |
| UPDATE | `apps/dashboard/public/dashboard-data.json` | static snapshot update |

## Next Step

`pgg-qa`에서 자동 검증 결과와 실제 GitHub/GitLab credential 기반 manual verification 제약을 분리해 최종 판정한다.

## Next Action

Run `pgg-qa` for `pgg-git-onboarding-implementation-gap`.
