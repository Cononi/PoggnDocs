---
pgg:
  topic: "pgg-optional-git-init-and-active-isolation"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-28T04:44:32Z"
state:
  summary: "다중 active topic의 git-on branch guard와 git-off file ownership preflight를 정의한다."
  next: "pgg-code"
---

# Spec S4: multi-active topic isolation

## 목적

active topic이 여러 개일 때 git 사용 여부에 따라 충돌을 줄이는 격리 규칙을 적용한다. `git mode=on`은 topic working branch를 기준으로, `git mode=off`는 파일 소유권과 changed path preflight를 기준으로 한다.

## 현재 동작

- topic 생성 시 `working_branch`와 `release_branch` metadata가 기록된다.
- `pgg git=on`일 때 helper가 일부 governed working branch recovery를 시도한다.
- active topic이 여러 개일 때 서로 같은 파일을 건드리는지 판단하는 명시 preflight는 부족하다.
- `analyzeProjectStatus`는 active topic 상태를 분류하지만 branch/path isolation blocker를 별도 도메인으로 드러내지는 않는다.

## 요구사항

1. active topic이 2개 이상이고 `git mode=on`이면 stage 시작 전 현재 branch와 topic `working_branch`를 확인한다.
2. `git mode=on`에서 현재 branch가 다르면 checkout recovery를 시도하거나 blocker를 남기고 구현을 진행하지 않는다.
3. `git mode=on`에서 release/publish 전에는 topic branch가 최신 base 또는 merge-ready 상태인지 최소 조건을 확인한다.
4. active topic이 2개 이상이고 `git mode=off`이면 branch checkout을 시도하지 않는다.
5. `git mode=off`에서는 각 topic의 `state/current.md` Changed Files, implementation diff index, dirty baseline, 현재 worktree changed path를 이용해 file ownership set을 만든다.
6. `git mode=off`에서 두 active topic의 ownership set이 같은 path를 포함하면 stage 시작 전 blocker로 표시한다.
7. ownership 정보가 없거나 불완전하면 conservative blocker 또는 manual check required로 처리한다.
8. status/dashboard surface는 branch mismatch, path collision, manual ownership check를 사용자가 볼 수 있게 노출한다.
9. 비충돌 active topic은 서로 관여하지 않는 범위로 계속 진행할 수 있어야 한다.

## 구현 대상

- `packages/core/src/index.ts`의 status/project analysis 영역
- `packages/core/test/status-analysis.test.mjs`
- `.codex/sh/pgg-gate.sh`
- `.codex/sh/pgg-stage-commit.sh`
- `.codex/sh/pgg-archive.sh`
- `apps/dashboard/src/features/history` 또는 topic/status 표시 영역
- `apps/dashboard/src/shared/model/dashboard.ts`
- `apps/dashboard/src/shared/locale/dashboardLocale.ts`
- pgg skill/template 문서

## 수용 기준

- git-on 다중 active fixture에서 wrong branch는 blocker로 평가된다.
- git-on correct branch 또는 recoverable checkout은 진행 가능 상태를 유지한다.
- git-off 다중 active fixture에서 같은 changed path를 가진 topic들은 blocker로 평가된다.
- git-off 다중 active fixture에서 path가 겹치지 않는 topic들은 진행 가능 상태로 평가된다.
- dashboard/status가 blocker reason을 한국어/영어 locale로 표시한다.

## 제외

- 자동 merge, rebase, squash, cherry-pick 구현
- git-off에서 파일 잠금 daemon 또는 OS-level lock 구현
- topic 간 conflict 자동 해결
