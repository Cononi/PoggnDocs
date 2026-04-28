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
