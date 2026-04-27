---
pgg:
  topic: "pgg-git-onboarding-implementation-gap"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-27T11:24:16Z"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "2.6.1"
  short_name: "git-gap"
  working_branch: "ai/fix/2.6.1-git-gap"
  release_branch: "release/2.6.1-git-gap"
  project_scope: "current-project"
reactflow:
  node_id: "task"
  node_type: "doc"
  label: "task.md"
state:
  summary: "spec 경계별 git onboarding gap 구현 task"
  next: "pgg-code"
---

# Task

## T1. Core Git Onboarding Engine

- spec: `spec/core/git-onboarding-engine.md`
- files:
  - `packages/core/src/index.ts`
  - `packages/core/test/git-onboarding.test.mjs`
- scope:
  - git onboarding request/result type 추가
  - injectable command runner 추가
  - local/FAST PATH/SETUP PATH/deferred result 처리
  - setup 성공/defer/failure manifest update helper 연결
  - token 미저장 보장
- done:
  - mock runner tests가 local, fast, setup, deferred path를 검증한다.

## T2. CLI Init/Git Flow

- spec: `spec/cli/init-and-git-onboarding-flow.md`
- files:
  - `packages/cli/src/index.ts`
  - `packages/cli/dist/index.js`
  - `packages/cli/dist/index.js.map`
- depends_on: `T1`
- scope:
  - `pgg init` git 선택 후 local/remote/defer prompt 연결
  - `pgg git --value on` 또는 interactive 활성 후 onboarding engine 호출
  - FAST PATH/SETUP PATH localized prompts 구성
  - non-TTY guardrail message 정리
  - setup result output 정리
- done:
  - `pgg git --value on`이 단순 deferred로만 끝나지 않는다.
  - init scaffold는 git setup 취소 시 rollback되지 않는다.

## T3. Dashboard API And Snapshot Contract

- spec: `spec/dashboard/git-setup-stepper-execution.md`
- files:
  - `apps/dashboard/vite.config.ts`
  - `apps/dashboard/src/app/DashboardApp.tsx`
  - `apps/dashboard/src/shared/model/dashboard.ts`
  - `packages/core/src/index.ts`
- depends_on: `T1`
- scope:
  - project git setup execution endpoint 추가
  - endpoint request validation과 core result mapping
  - dashboard mutation hook wiring
  - ProjectSnapshot에 필요한 setup request/result fields 반영
- done:
  - setup API 실행 후 snapshot에 git connection metadata가 반영된다.

## T4. Dashboard Stepper Execution UI

- spec: `spec/dashboard/git-setup-stepper-execution.md`
- files:
  - `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx`
  - `apps/dashboard/src/shared/locale/dashboardLocale.ts`
  - `apps/dashboard/src/shared/model/dashboard.ts`
- depends_on: `T3`
- scope:
  - Stepper에 local/fast/setup/defer path 선택 추가
  - provider/auth/repository/default branch/push confirmation 입력 추가
  - loading/success/failure/retry/defer state 추가
  - live mode disabled 상태 유지
  - ko/en locale 문구 추가
- done:
  - `git 정보 추가` modal이 defer/close만 있는 상태에서 벗어난다.

## T5. Verification And Build Outputs

- spec: `spec/qa/git-onboarding-verification-contract.md`
- files:
  - `packages/core/test/git-onboarding.test.mjs`
  - `packages/core/dist/index.d.ts`
  - `packages/core/dist/index.js`
  - `packages/core/dist/index.js.map`
  - `packages/cli/dist/index.js`
  - `packages/cli/dist/index.js.map`
- depends_on: `T1`, `T2`, `T3`, `T4`
- scope:
  - mock regression tests 추가
  - build/test 실행
  - dist output 갱신
  - manual provider verification 항목 QA로 전달
- done:
  - `pnpm build`와 `pnpm test`가 통과한다.
  - 실제 provider login/repository creation/push는 QA에서 manual verification으로 분리된다.

## Audit Applicability

- `pgg-token`: `not_required` | workflow handoff 구조 변경이 아니라 CLI/dashboard git setup 기능 gap 보완이다
- `pgg-performance`: `not_required` | git onboarding은 사용자 주도 setup flow이며 성능 민감 runtime 경로가 아니다
