# Current State

## Topic

pgg-optional-git-init-and-active-isolation

## Current Stage

implementation

## Goal

pgg-code 구현과 code review가 완료되었고, 다음 단계에서 pgg-refactor가 변경 구조와 잔여 레거시를 점검한다.

## Constraints

- project scope: `current-project`
- archive type: `feat`
- version bump: `minor`
- target version: `3.1.0`
- short name: `optional-isolation`
- working branch: `ai/feat/3.1.0-optional-isolation`
- release branch: `release/3.1.0-optional-isolation`

## Proposal Decision

- status: `reviewed`
- score: `95`
- next: `pgg-plan`
- blocking issues: 없음

## Plan Decision

- status: `reviewed`
- score: `96`
- next: `pgg-code`
- blocking issues: 없음

## Next Action

`pgg-refactor`

## User Input Ref

- `proposal.md`의 `## 3. 사용자 입력 질문 기록`

## Scope Summary

- CLI `pgg init`/`pgg update`에서 git 없는 프로젝트를 정상 경로로 지원한다.
- dashboard project add는 MUI Linear Stepper 방식으로 순차 입력을 받는다.
- dashboard add에서 git 사용 여부를 먼저 선택하고, `git 사용 안 함`이면 git init/setup을 실행하지 않는다.
- `git mode=on`에서 여러 active topic은 각 topic의 `working_branch` checkout을 통해 격리한다.
- `git mode=off`에서 여러 active topic은 topic별 changed path ownership과 stage preflight로 서로 관여하지 않는 범위만 진행한다.

## Plan Summary

- S1: `spec/core/git-optional-init-update.md` | CLI/core init-update에서 `.git` 없는 프로젝트와 `gitMode: "off"`를 정상 경로로 고정한다.
- S2: `spec/dashboard/linear-stepper-project-add.md` | dashboard project add 모달을 Linear Stepper의 step별 입력 화면으로 전환한다.
- S3: `spec/workflow/git-mode-evidence-contract.md` | pgg-* flow와 helper가 git mode별 완료 evidence를 다르게 판단하게 한다.
- S4: `spec/runtime/multi-active-topic-isolation.md` | 여러 active topic의 branch/file isolation preflight를 정의한다.

## Task Summary

- T1: S1 구현 | core/CLI init-update에서 git-off 정상 경로를 보강하고 `.git` 없는 프로젝트 회귀 테스트를 추가한다.
- T2: S2 구현 | dashboard project add 모달을 Linear Stepper의 step별 입력 화면으로 전환하고 git 사용 여부 분기를 구현한다.
- T3: S3 구현 | WOKR-FLOW, STATE-CONTRACT, pgg-* skill, helper/template의 git mode별 evidence contract를 정렬한다.
- T4: S4 구현 | 여러 active topic의 git-on branch guard와 git-off file ownership/preflight를 status/runtime surface에 추가한다.

## Audit Applicability

- [pgg-token]: [not_required] | proposal 단계에서는 token audit보다 git optional contract와 active isolation 계획 분해가 우선이다.
- [pgg-performance]: [not_required] | 성능 변경이 아니라 init/dashboard/workflow 운영 계약 수정이다.

## Changed Files

| CRUD | path | diff |
|---|---|---|
| CREATE | `poggn/active/pgg-optional-git-init-and-active-isolation` | topic artifacts |
| UPDATE | `packages/core/dist/index.js` | `implementation/diffs/001_UPDATE_core_git_optional_init.diff` |
| UPDATE | `packages/core/dist/index.js.map` | `implementation/diffs/001_UPDATE_core_git_optional_init.diff` |
| UPDATE | `packages/core/src/index.ts` | `implementation/diffs/001_UPDATE_core_git_optional_init.diff` |
| UPDATE | `packages/core/test/git-onboarding.test.mjs` | `implementation/diffs/001_UPDATE_core_git_optional_init.diff` |
| UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/002_UPDATE_dashboard_project_add_stepper.diff` |
| UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/002_UPDATE_dashboard_project_add_stepper.diff` |
| UPDATE | `.codex/add/WOKR-FLOW.md` | `implementation/diffs/003_UPDATE_git_mode_evidence_contract.diff` |
| UPDATE | `.codex/add/STATE-CONTRACT.md` | `implementation/diffs/003_UPDATE_git_mode_evidence_contract.diff` |
| UPDATE | `.codex/skills/pgg-code/SKILL.md` | `implementation/diffs/003_UPDATE_git_mode_evidence_contract.diff` |
| UPDATE | `.codex/skills/pgg-refactor/SKILL.md` | `implementation/diffs/003_UPDATE_git_mode_evidence_contract.diff` |
| UPDATE | `.codex/skills/pgg-qa/SKILL.md` | `implementation/diffs/003_UPDATE_git_mode_evidence_contract.diff` |
| UPDATE | `.pgg/project.json` | `implementation/diffs/003_UPDATE_git_mode_evidence_contract.diff` |
| UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/003_UPDATE_git_mode_evidence_contract.diff` |
| UPDATE | `packages/core/dist/templates.js` | `implementation/diffs/003_UPDATE_git_mode_evidence_contract.diff` |
| UPDATE | `packages/core/dist/templates.js.map` | `implementation/diffs/003_UPDATE_git_mode_evidence_contract.diff` |
| UPDATE | `packages/core/dist/index.d.ts` | `implementation/diffs/004_UPDATE_multi_active_isolation.diff` |
| UPDATE | `packages/core/dist/index.js` | `implementation/diffs/004_UPDATE_multi_active_isolation.diff` |
| UPDATE | `packages/core/dist/index.js.map` | `implementation/diffs/004_UPDATE_multi_active_isolation.diff` |
| UPDATE | `packages/core/src/index.ts` | `implementation/diffs/004_UPDATE_multi_active_isolation.diff` |
| UPDATE | `packages/core/test/status-analysis.test.mjs` | `implementation/diffs/004_UPDATE_multi_active_isolation.diff` |

## Implementation Status

- T1: done | `pnpm --filter @pgg/core test` pass, 58 tests passed
- T2: done | `pnpm --filter @pgg/dashboard build` pass
- T3: done | `pnpm --filter @pgg/core build` pass, `node packages/cli/dist/index.js update` pass
- T4: done | `pnpm --filter @pgg/core test` pass, 60 tests passed

## Verification

- `pnpm build`: pass
- `pnpm test`: pass, core 60 tests passed, dashboard history model 3 tests passed

## Last Expert Score

- phase: implementation
- score: 96
- blocking issues: 없음

## Expert Summary

- 프로덕트 매니저: git optional mode는 주요 제품 경로로 승격해야 하며, init/dashboard에서 git을 쓰지 않는 흐름이 완료 가능해야 한다.
- UX/UI 전문가: Linear Stepper로 project add 입력을 단계화하고 git 사용 여부에 따라 후속 step을 분기하는 방향이 적절하다.
- 소프트웨어 아키텍트: spec 경계를 core/CLI, dashboard UX, workflow evidence, multi-active runtime으로 나누는 구조가 구현 순서와 책임 경계를 명확히 한다.
- 도메인 전문가: `git mode=off`를 공식 mode로 정의하고, active topic 충돌을 branch evidence와 file ownership evidence로 분리한 점이 pgg workflow 도메인과 맞다.

## Git Publish Message

- title: feat: 3.1.0.git 선택 흐름
- why: git을 사용하지 않는 프로젝트도 pgg init과 dashboard 등록 및 workflow 진행을 정상 경로로 지원해야 하며, 여러 active topic이 동시에 있을 때 git-on branch 격리와 git-off 파일 범위 격리 규칙이 필요하다.
- footer: Refs: pgg-optional-git-init-and-active-isolation
