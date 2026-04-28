# Implementation Index

## T1

- task: core/CLI init-update에서 git-off 정상 경로를 보강하고 `.git` 없는 프로젝트 회귀 테스트를 추가한다.
- status: done
- changed files:
  - UPDATE `packages/core/dist/index.js`
  - UPDATE `packages/core/dist/index.js.map`
  - UPDATE `packages/core/src/index.ts`
  - UPDATE `packages/core/test/git-onboarding.test.mjs`
- diff: `implementation/diffs/001_UPDATE_core_git_optional_init.diff`
- verification:
  - `pnpm --filter @pgg/core test` pass, 58 tests passed

## T2

- task: dashboard project add 모달을 Linear Stepper의 step별 입력 화면으로 전환하고 git 사용 여부 분기를 구현한다.
- status: done
- changed files:
  - UPDATE `apps/dashboard/src/app/DashboardApp.tsx`
  - UPDATE `apps/dashboard/src/shared/locale/dashboardLocale.ts`
- diff: `implementation/diffs/002_UPDATE_dashboard_project_add_stepper.diff`
- verification:
  - `pnpm --filter @pgg/dashboard build` pass

## T3

- task: WOKR-FLOW, STATE-CONTRACT, pgg-* skill, helper/template의 git mode별 evidence contract를 정렬한다.
- status: done
- changed files:
  - UPDATE `.codex/add/WOKR-FLOW.md`
  - UPDATE `.codex/add/STATE-CONTRACT.md`
  - UPDATE `.codex/skills/pgg-code/SKILL.md`
  - UPDATE `.codex/skills/pgg-refactor/SKILL.md`
  - UPDATE `.codex/skills/pgg-qa/SKILL.md`
  - UPDATE `.pgg/project.json`
  - UPDATE `packages/core/src/templates.ts`
  - UPDATE `packages/core/dist/templates.js`
  - UPDATE `packages/core/dist/templates.js.map`
- diff: `implementation/diffs/003_UPDATE_git_mode_evidence_contract.diff`
- verification:
  - `pnpm --filter @pgg/core build` pass
  - `node packages/cli/dist/index.js update` pass, generated docs synchronized

## T4

- task: 여러 active topic의 git-on branch guard와 git-off file ownership/preflight를 status/runtime surface에 추가한다.
- status: done
- changed files:
  - UPDATE `packages/core/dist/index.d.ts`
  - UPDATE `packages/core/dist/index.js`
  - UPDATE `packages/core/dist/index.js.map`
  - UPDATE `packages/core/src/index.ts`
  - UPDATE `packages/core/test/status-analysis.test.mjs`
- diff: `implementation/diffs/004_UPDATE_multi_active_isolation.diff`
- verification:
  - `pnpm --filter @pgg/core test` pass, 60 tests passed
