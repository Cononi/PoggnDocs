---
pgg:
  topic: "dashboard-git-diff-lazy-view"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 94
  updated_at: "2026-04-28T05:27:37Z"
  auto_mode: "on"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "3.2.0"
  short_name: "dashboard-view"
  working_branch: "ai/feat/3.2.0-dashboard-view"
  release_branch: "release/3.2.0-dashboard-view"
  project_scope: "current-project"
state:
  summary: "pgg diff 산출물 본문 저장을 Git 기반 지연 조회 방식으로 전환한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

dashboard-git-diff-lazy-view

## 2. 문제 정의

- 현재 `pgg-code`와 관련 flow가 `implementation/diffs/*.diff`에 파일별 diff 본문을 저장하면서 `poggn/active`와 `poggn/archive` 용량이 지속 증가한다.
- Git에 이미 남아 있는 변경 이력과 같은 내용을 pgg 산출물에도 중복 저장하는 구조라, archive가 많아질수록 저장소와 dashboard snapshot이 무거워진다.
- dashboard는 diff 파일을 문서처럼 읽는 현재 구조 때문에 변경 파일명만 확인하고 싶은 경우에도 diff 본문을 같이 다루게 된다.

## 3. 사용자 입력 질문 기록

- 현재 poggn active와 archive에 code flow에서 diff문서를 남기게 되면 상당한 용량 차지를 하고 있습니다.
- git 에서 해당 file diff 내용을 찾을 수는 없나요?
- dashboard에서도 code 에서 변경 파일명만 표기하고 누르면 git diff로 가져와서 읽도록 처리했음 좋겠습니다.

## 4. 제안

- `implementation/diffs/*.diff` 본문 파일 생성을 기본 산출물에서 제거하거나 opt-in으로 낮춘다.
- `implementation/index.md`와 `state/current.md`에는 변경 파일의 `CRUD`, `path`, `taskRef`, `gitRef` 또는 `commitRange`, `diffCommand` 같은 조회 메타데이터만 남긴다.
- `pgg git=on`에서는 task-scoped commit 또는 stage completion commit을 기준으로 `git show <commit> -- <path>` 또는 `git diff <base>..<head> -- <path>` 형태로 파일 diff를 재구성할 수 있게 한다.
- `pgg git=off` 또는 아직 commit 전 상태는 durable diff가 없으므로 `git diff -- <path>`/`git diff --cached -- <path>` 기반 임시 조회로 표시하고, archive 전에는 commit 기반 ref가 남도록 completion 조건을 명확히 한다.
- dashboard는 code/implementation 영역에서 변경 파일명 목록을 먼저 표시하고, 사용자가 파일을 선택할 때만 local API 또는 snapshot builder가 Git diff 내용을 가져와 `DiffViewer`에 전달한다.

## 5. 범위

### 포함

- pgg workflow 계약 문서의 diff artifact 규칙 정리
- `.codex/sh/pgg-diff.sh`, `.codex/sh/pgg-diff-index.sh`, stage commit helper 또는 관련 template의 Git diff 조회 메타데이터 지원
- `packages/core/src/templates.ts`와 생성 산출물의 diff 저장 지침 갱신
- dashboard data model, history model, artifact viewer의 lazy diff 조회/표시 흐름
- 관련 테스트와 dashboard snapshot 생성 로직 보강

### 제외

- 과거 archive topic의 `.diff` 파일 일괄 삭제
- remote Git 서버나 GitHub API 연동
- Git 이력이 없는 외부 파일의 영구 diff 복원
- pgg core workflow 순서 변경

## 6. 변경 분류

- archive_type: `feat`
- version_bump: `minor`
- target_version: `3.2.0`
- short_name: `dashboard-view`
- working_branch: `ai/feat/3.2.0-dashboard-view`
- release_branch: `release/3.2.0-dashboard-view`
- project_scope: `current-project`

## 7. 성공 기준

- 신규 code/refactor flow가 대용량 `implementation/diffs/*.diff` 본문 파일을 기본 생성하지 않는다.
- 변경 파일 목록은 `implementation/index.md`와 `state/current.md`에서 파일명 중심으로 유지된다.
- 각 변경 파일 row에는 dashboard가 Git diff를 조회하는 데 필요한 최소 ref가 있다.
- dashboard에서 code 변경 파일명을 누르면 해당 파일 diff가 Git에서 조회되어 열린다.
- Git ref가 부족한 경우 dashboard가 명확한 fallback 또는 unavailable 상태를 표시한다.
- `poggn/active`와 `poggn/archive`의 신규 topic 저장량이 diff 본문 중복 저장 없이 유지된다.

## 8. 제약 사항

- Git 기반 조회는 local repository 내부에서만 수행하며 현재 프로젝트 범위를 벗어나지 않는다.
- archive topic은 active로 되돌리지 않는다.
- dashboard timeline은 기존 완료 evidence 기준을 유지한다.
- 기존 topic 문서를 마이그레이션하더라도 과거 diff 증거를 무단 삭제하지 않는다.
- generated template과 현재 workspace 산출물의 계약이 서로 어긋나지 않아야 한다.

## 9. 미확정 항목

| 항목 | 기본 제안 | 상태 |
|---|---|---|
| 과거 `.diff` 파일 처리 | 신규 flow부터 lazy diff로 전환하고 과거 archive 정리는 별도 topic으로 분리 | resolved |
| Git ref 단위 | task-scoped commit이 있으면 commit 단위, 없으면 stage completion range | resolved |
| dashboard 조회 방식 | 파일 목록은 snapshot에 포함하고 diff 본문은 선택 시 local Git에서 조회 | resolved |

## 10. Audit Applicability

- [pgg-token]: required | diff 본문 중복 저장과 dashboard snapshot 용량을 줄이는 변경이므로 token/storage surface를 재측정해야 한다.
- [pgg-performance]: required | dashboard가 diff를 지연 조회하므로 파일 선택 응답성과 대형 diff 처리 비용을 확인해야 한다.

## 11. Git Publish Message

- title: feat: 3.2.0.Git 기반 diff 지연 조회
- why: pgg code flow의 diff 본문 중복 저장을 줄이고 dashboard가 변경 파일 선택 시 Git에서 필요한 diff만 조회하도록 전환한다.
- footer: Refs: dashboard-git-diff-lazy-view

## 12. 다음 단계

- `pgg-plan`에서 Git ref 기록 계약, dashboard lazy-load API, fallback 상태, 테스트 범위를 상세 spec/task로 분리한다.
