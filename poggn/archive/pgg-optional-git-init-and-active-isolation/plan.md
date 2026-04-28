---
pgg:
  topic: "pgg-optional-git-init-and-active-isolation"
  stage: "plan"
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
  summary: "git optional init/update, dashboard Linear Stepper, pgg flow evidence, 다중 active isolation 구현 계획을 확정한다."
  next: "pgg-code"
---

# Plan

## 1. 목표

`pgg init`과 dashboard project add에서 git을 선택 기능으로 분리하고, 여러 active topic이 동시에 존재할 때 `git mode=on/off`에 맞는 격리 규칙을 pgg workflow 전반에 반영한다.

## 2. Audit Applicability

- [pgg-token]: [not_required] | 이번 plan은 workflow/runtime contract와 dashboard UX 분해가 중심이며 token 사용량 측정이 blocking 조건이 아니다.
- [pgg-performance]: [not_required] | 성능 민감 경로가 아니라 init/dashboard/workflow 상태 계약 변경이다.

## 3. Spec 구성

| Spec ID | 파일 | 목적 | 핵심 범위 |
|---|---|---|---|
| S1 | `spec/core/git-optional-init-update.md` | CLI/core init-update에서 `.git` 없는 프로젝트와 `gitMode: "off"`를 정상 경로로 고정한다. | `createProjectManifest`, `initializeProject`, `updateProject`, `inspectProjectGitSetup`, CLI feature 선택, git-off 회귀 테스트 |
| S2 | `spec/dashboard/linear-stepper-project-add.md` | dashboard project add 모달을 Linear Stepper 입력 흐름으로 전환한다. | step state, root inspection, username, basic settings, git usage 선택, category/confirm, locale, dashboard build |
| S3 | `spec/workflow/git-mode-evidence-contract.md` | pgg-* flow와 helper가 git mode별 완료 evidence를 다르게 판단하게 한다. | WOKR-FLOW, STATE-CONTRACT, skill 문서, generated templates, gate/stage helper, git-off completion evidence |
| S4 | `spec/runtime/multi-active-topic-isolation.md` | 여러 active topic의 branch/file isolation preflight를 정의한다. | git-on working branch guard, git-off changed path ownership, dirty baseline, status evaluator, dashboard/status surface |

## 4. 구현 순서

1. S1에서 core/CLI의 git-off 정상 경로와 회귀 테스트를 먼저 고정한다.
2. S2에서 dashboard project add Stepper를 실제 step별 입력 화면으로 바꾸고 git 사용 여부 분기를 UI에 반영한다.
3. S3에서 pgg workflow 문서, skill, helper, template가 git mode별 evidence contract를 같은 의미로 설명하게 맞춘다.
4. S4에서 여러 active topic이 있을 때 git-on branch 격리와 git-off file ownership preflight를 runtime/status surface에 연결한다.
5. 모든 spec 구현 뒤 generated asset sync와 dashboard snapshot/build/test를 실행해 checked-in 문서와 runtime이 어긋나지 않게 한다.

## 5. 검증 전략

- core/CLI: `.git` 없는 임시 디렉터리에서 `initializeProject`, `updateProject`, CLI `init --git off` 또는 동등 경로가 git 명령 없이 성공하는지 테스트한다.
- dashboard: Stepper가 현재 step의 입력만 렌더링하고, `git 사용 안 함` 선택 시 request에 `gitMode: "off"`가 들어가며 `gitSetup`이 생기지 않는지 확인한다.
- git onboarding: `git 사용` 선택 시에만 local/defer setup 요청이 만들어지고 `runProjectGitOnboarding`이 호출되는지 확인한다.
- workflow: `git mode=off`에서 stage commit/publish helper가 실패 대신 skip/evidence를 남기고, 완료 판단은 artifact/history/changed files로 처리되는지 확인한다.
- multi-active: active topic 2개 이상 fixture에서 `git mode=on` branch mismatch와 `git mode=off` path collision을 각각 차단하는지 확인한다.
- 통합: `pnpm build`, `pnpm test`, dashboard build, current-project verification contract 결과를 QA에 기록한다.

## 6. 리스크와 가드레일

- dashboard에는 이미 Stepper 표시가 있으므로 단순 컴포넌트 추가가 아니라 step별 입력 전환 상태가 필요하다. S2에서 active step, next/back/confirm, validation 조건을 명확히 둔다.
- `detectProjectGitConfig`는 기존 `.git` 또는 remote를 감지하면 `git.mode`를 `on`으로 보정할 수 있다. S1에서 사용자가 명시적으로 git-off를 선택한 경우 자동 감지와 사용자 선택이 충돌하지 않게 정책을 정한다.
- git-off에서 commit evidence가 없다는 이유로 workflow 완료가 계속 막히면 git optional 방향과 충돌한다. S3에서 git-off evidence fallback을 필수 수용 기준으로 둔다.
- git-off 다중 active isolation은 git branch만큼 강하지 않으므로 같은 changed path 또는 ownership 미기록 상태를 conservative blocker로 처리한다.
- active branch 자동 merge/publish까지 한 번에 구현하면 위험이 커진다. S4는 branch isolation과 merge readiness 조건까지만 정의하고 고급 merge automation은 제외한다.

## 7. 완료 기준

- `task.md`가 S1-S4 구현 작업을 명확히 분해한다.
- 각 spec이 구현 대상 파일, 요구사항, 수용 기준, 제외 범위를 포함한다.
- plan/task review가 소프트웨어 아키텍트와 도메인 전문가 attribution을 남긴다.
- `state/current.md`가 다음 단계 `pgg-code`용 최소 문맥으로 갱신된다.
