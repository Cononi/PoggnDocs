---
pgg:
  topic: "pgg-git-onboarding-implementation-gap"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 95
  updated_at: "2026-04-27T11:31:00Z"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "2.6.1"
  short_name: "git-gap"
  working_branch: "ai/fix/2.6.1-git-gap"
  release_branch: "release/2.6.1-git-gap"
  project_scope: "current-project"
reactflow:
  node_id: "implementation-index"
  node_type: "doc"
  label: "implementation/index.md"
state:
  summary: "git onboarding gap 구현 diff와 검증 결과를 기록한다."
  next: "pgg-refactor"
---

# Implementation Index

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 001 | UPDATE | `packages/core/src/index.ts` | `implementation/diffs/001_UPDATE_packages_core_src_index_ts.diff` | `T1`, `T3` | core git onboarding request/result contract, injectable runner, local/fast/setup/defer orchestration 추가 |
| 002 | UPDATE | `packages/cli/src/index.ts` | `implementation/diffs/002_UPDATE_packages_cli_src_index_ts.diff` | `T2` | `pgg init`/`pgg git`에서 local/remote/defer onboarding flow와 non-TTY guardrail 연결 |
| 003 | UPDATE | `apps/dashboard/*` | `implementation/diffs/003_UPDATE_dashboard_git_setup_execution.diff` | `T3`, `T4` | git setup execution API, mutation wiring, ProjectSettings Stepper 입력/실행 UI, locale/model 확장 |
| 004 | UPDATE | `packages/core/test/git-onboarding.test.mjs` | `implementation/diffs/004_UPDATE_packages_core_test_git-onboarding_test_mjs.diff` | `T5` | mock runner 기반 local, FAST PATH, SETUP PATH, confirmation guard regression 추가 |
| 005 | UPDATE | `packages/core/dist/*`, `packages/cli/dist/*` | `implementation/diffs/005_UPDATE_dist_outputs.diff` | `T5` | build output 갱신 |
| 006 | UPDATE | `apps/dashboard/public/dashboard-data.json` | `implementation/diffs/006_UPDATE_dashboard_public_snapshot.diff` | `T5` | current active topic과 dashboard model 변경을 반영한 static snapshot 갱신 |
| 007 | UPDATE | `packages/core/src/index.ts` | `implementation/diffs/007_REFACTOR_packages_core_src_index_ts.diff` | `T1` | onboarding result 생성 중복 제거와 auth/branch/push 실패 시 early return 처리 |
| 008 | UPDATE | `packages/core/test/git-onboarding.test.mjs` | `implementation/diffs/008_REFACTOR_packages_core_test_git-onboarding_test_mjs.diff` | `T5` | auth validation 실패 시 branch/push를 실행하지 않는 회귀 테스트 추가 |
| 009 | UPDATE | `packages/core/dist/*` | `implementation/diffs/009_REFACTOR_core_dist_outputs.diff` | `T5` | refactor 후 core build output 갱신 |

## Verification

- `pnpm build`: pass
- `pnpm test`: pass, 49 tests
- Manual verification required: real GitHub/GitLab login, repository creation, and remote push with live credentials.

## Notes

- `pgg git=off` 상태이므로 task-scoped stage commit은 수행하지 않았다.
- Token 값은 request/result/manifest에 저장하지 않는 방향으로 core contract와 regression test를 추가했다.
- Remote-impact action은 `confirmRemoteMutation` 없이는 blocked result로 끝난다.
- Refactor 단계에서 auth/branch/push 실패가 발생하면 이후 destructive 단계로 진행하지 않도록 early return을 추가했다.
