---
pgg:
  topic: "pgg-optional-git-init-and-active-isolation"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-28T04:44:32Z"
  auto_mode: "on"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "3.1.0"
  short_name: "optional-isolation"
  working_branch: "ai/feat/3.1.0-optional-isolation"
  release_branch: "release/3.1.0-optional-isolation"
  project_scope: "current-project"
state:
  summary: "S1-S4 spec 경계별 구현 task를 정의한다."
  next: "pgg-code"
---

# Task

## 1. Audit Applicability

- [pgg-token]: [not_required] | task 분해 단계에서는 token audit보다 구현 경계와 검증 계약 확정이 우선이다.
- [pgg-performance]: [not_required] | 성능 측정 대상이 아니라 init/dashboard/workflow 상태 계약 변경이다.

## 2. 작업 목록

| Task ID | Spec Ref | 작업 요약 | 선행 조건 | 완료 기준 |
|---|---|---|---|---|
| T1 | `S1` | core/CLI init-update에서 git-off 정상 경로를 보강하고 `.git` 없는 프로젝트 회귀 테스트를 추가한다. | proposal, S1 | `gitMode: "off"` init/update가 git 명령 없이 성공하고, 기존 git-on onboarding 테스트가 유지됨 |
| T2 | `S2` | dashboard project add 모달을 Linear Stepper의 step별 입력 화면으로 전환하고 git 사용 여부 분기를 구현한다. | T1, S2 | git 사용 안 함 선택 시 `gitSetup` 없이 등록되고, git 사용 선택 시에만 setup step/request가 활성화됨 |
| T3 | `S3` | WOKR-FLOW, STATE-CONTRACT, pgg-* skill, helper/template의 git mode별 evidence contract를 정렬한다. | T1, S3 | git-off stage가 commit 부재로 막히지 않고 artifact/history/changed files evidence를 완료 판단에 사용함 |
| T4 | `S4` | 여러 active topic의 git-on branch guard와 git-off file ownership/preflight를 status/runtime surface에 추가한다. | T1, T3, S4 | branch mismatch와 path collision fixture가 각각 blocker로 평가되고, 비충돌 topic은 진행 가능함 |

## 3. 구현 메모

- T1은 `packages/core/src/index.ts`, `packages/cli/src/index.ts`, `packages/core/test/git-onboarding.test.mjs`, `packages/core/test/skill-generation.test.mjs`를 우선 확인한다.
- T2는 [DashboardApp.tsx](/config/workspace/poggn-ai/apps/dashboard/src/app/DashboardApp.tsx:1207)의 project add dialog와 [dashboardLocale.ts](/config/workspace/poggn-ai/apps/dashboard/src/shared/locale/dashboardLocale.ts:245)를 중심으로 수정한다.
- T3은 `.codex/add/*`, `.codex/skills/pgg-*`, `.codex/sh/*`, `packages/core/src/templates.ts`의 generated contract를 함께 맞춘다.
- T4는 `analyzeProjectStatus`, `listTopicSummaries`, `state/dirty-worktree-baseline.txt`, `state/current.md`의 changed files 기록을 우선 활용한다.

## 4. 검증 체크리스트

- `.git` 없는 임시 프로젝트에서 pgg init/update가 성공한다.
- `gitMode: "off"` 프로젝트 snapshot이 `gitSetupStatus: "none"` 또는 명확한 off 상태를 유지한다.
- dashboard Stepper는 한 번에 모든 입력을 노출하지 않는다.
- dashboard Stepper는 back/next/cancel/save 상태와 validation disabled 상태를 가진다.
- `git 사용 안 함` 선택 시 `git init` 또는 `runProjectGitOnboarding`이 호출되지 않는다.
- `git 사용` 선택 시에만 local/defer/remote setup 입력이 노출된다.
- `git mode=on` 다중 active topic에서 현재 branch와 topic `working_branch` 불일치가 차단된다.
- `git mode=off` 다중 active topic에서 같은 changed path ownership 충돌이 차단된다.
- pgg-code, pgg-refactor, pgg-qa가 git mode별 evidence 차이를 문서와 helper에서 같은 의미로 다룬다.
- `pnpm build`, `pnpm test`, dashboard build 결과를 QA에 기록한다.
