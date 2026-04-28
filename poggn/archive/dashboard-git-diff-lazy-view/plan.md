---
pgg:
  topic: "dashboard-git-diff-lazy-view"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-28T05:30:44Z"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "3.2.0"
  short_name: "dashboard-view"
  working_branch: "ai/feat/3.2.0-dashboard-view"
  release_branch: "release/3.2.0-dashboard-view"
  project_scope: "current-project"
state:
  summary: "diff 본문 저장을 Git ref 기반 지연 조회 계약으로 전환하는 구현 계획을 확정한다."
  next: "pgg-code"
---

# Plan

## 목표

- 신규 pgg code/refactor flow가 `implementation/diffs/*.diff` 본문 파일을 기본 산출물로 만들지 않게 한다.
- 변경 파일 evidence는 파일명, CRUD, taskRef, Git 조회 메타데이터 중심으로 유지한다.
- dashboard는 code 변경 파일명을 먼저 보여주고, 사용자가 선택할 때만 Git diff를 조회해 표시한다.

## 설계 방향

- pgg 문서 계약은 `implementation/index.md`를 중심으로 유지하되 `diffRef` 필드를 Git 기반 `diffSource`/`gitRef` 계약으로 대체하거나 호환 필드로 낮춘다.
- `pgg git=on`에서는 task-scoped commit 또는 stage completion commit/range를 기준으로 파일별 diff를 재현한다.
- `pgg git=off`나 commit 전 상태는 현재 working tree/cached diff만 임시 조회로 허용하고, archive 가능한 durable evidence로 보지는 않는다.
- dashboard snapshot은 변경 파일 목록과 lazy-load metadata만 포함하고, diff 본문은 live API에서 선택 시 조회한다.
- static snapshot만 있는 환경은 Git diff live 조회가 불가능하므로 unavailable 상태와 기존 embedded content fallback을 분리한다.

## Spec 구성

- `spec/workflow/git-diff-artifact-contract.md`: pgg workflow, helper, template, state 계약.
- `spec/dashboard/lazy-diff-view.md`: dashboard data model, API, UI lazy-load 계약.
- `spec/verification/storage-and-regression.md`: 저장량, token, performance, regression 검증 계약.

## 구현 순서

1. workflow 문서와 generated template의 diff artifact 계약을 먼저 갱신한다.
2. core snapshot/model에 Git diff metadata와 lazy detail 조회 함수를 추가한다.
3. dashboard API와 client fetch 함수를 추가해 selected file diff를 live Git에서 조회한다.
4. history/workflow UI가 diff 파일 content를 전제로 하지 않도록 파일명 목록과 loading/error/unavailable 상태를 구현한다.
5. 테스트와 generated asset update를 실행해 현재 workspace와 template 출력의 계약을 맞춘다.

## 완료 조건

- `task.md`의 T1-T5가 모두 완료 가능하도록 spec과 acceptance criteria가 연결되어 있다.
- 신규 topic에서 `.diff` 본문 파일 없이도 code flow 변경 파일 목록과 dashboard lazy diff 조회가 동작한다.
- 기존 `.diff` 파일이 있는 archive topic은 호환 fallback으로 계속 열 수 있다.
- token/performance audit가 required로 유지된다.

## Audit Applicability

- [pgg-token]: required | diff 본문 제거 전후의 dashboard snapshot과 topic 파일 token surface를 비교해야 한다.
- [pgg-performance]: required | lazy diff API와 UI 표시 응답성을 확인해야 한다.

## Git Publish Message

- title: feat: 3.2.0.Git 기반 diff 지연 조회
- why: pgg code flow의 diff 본문 중복 저장을 줄이고 dashboard가 변경 파일 선택 시 Git에서 필요한 diff만 조회하도록 전환한다.
- footer: Refs: dashboard-git-diff-lazy-view
