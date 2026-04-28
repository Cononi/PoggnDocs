---
name: "pgg-code"
description: "승인된 topic을 구현하고 implementation diff와 review를 기록한다."
---

# Skill: pgg-code

## Purpose

승인된 plan을 구현하고 implementation diff, index, 전문가 attribution이 있는 code review, state를 갱신한다.

## Teams Mode

- `pgg teams`가 `on`이면 `.codex/sh/pgg-state-pack.sh <topic|topic_dir>`로 최소 handoff를 만든 뒤 아래 2개 primary agent를 자동 orchestration한다.
- `pgg teams`가 `off`이면 같은 문서 계약을 유지하되 단일 에이전트 흐름으로 진행한다.
- pgg가 생성·관리하는 `.codex/sh/*.sh` helper만 workflow 내부 trusted script로 보고 추가 허락 없이 실행한다.

## Stage Events

- stage 시작 시 `state/history.ndjson`에 `{"stage":"implementation","event":"stage-started","source":"pgg-code"}`를 남긴다.
- 중간 산출물, diff 정리, 검증 전 상태는 `stage-progress`로만 남긴다.
- 사용자 추가 요구가 있으면 구현 작업 전에 `requirements-added`를 남긴다.
- implementation index, diffs, code review, 필요한 task-scoped commit/gate가 끝난 뒤에만 completion evidence를 남긴다.
- `pgg git=on`이면 task 완료의 completion evidence는 `.codex/sh/pgg-stage-commit.sh`가 남기는 `stage-commit`을 우선한다.

## Expert Roster

- 시니어 백엔드 엔지니어: 주 구현 작업
- 테크 리드: 아키텍처 가드레일과 통합 판단

## Rules

- 승인되지 않은 topic은 구현하지 않는다
- 현재 프로젝트 내부 implementation 기록과 generated doc 갱신은 자동 처리한다
- 현재 프로젝트 밖을 건드리는 작업은 자동 처리하지 않는다
- `task.md`의 Task 목록에서 `Task ID`가 `T1...N`인 행 1개를 기본 commit cadence로 보고, 여러 commit이 있어도 한 commit은 하나의 task 행 또는 task 일부 intent에만 대응시킨다
- `pgg git=on`이면 task 행 완료마다 `.codex/sh/pgg-stage-commit.sh <topic|topic_dir> implementation <summary> <why> [footer]`를 실행한다. 이때 `PGG_TASK_ID`, `PGG_TASK_DEPENDENCIES`, `PGG_TASK_COMPLETION_CRITERIA` env를 함께 넘겨 `stage-commit` evidence와 commit body가 task 행을 가리키게 한다
- task commit 제목의 summary는 해당 task 행의 작업 내용이어야 하며, body 최상단은 `Dependencies`, 그 아래는 완료 조건, footer는 완료 조건에 명시된 task 내용이어야 한다
- 모든 변경은 CREATE, UPDATE, DELETE로 분류한다
- 파일 생성/수정/삭제 또는 flow 작업 token usage를 기록할 때는 `state/token-usage.ndjson`에 append-only record로 남기고 `source: llm | local`, actual/estimated 여부, artifact path를 구분한다.
- 전체 파일 복사보다 diff 기록을 우선한다
- `reviews/code.review.md`에는 전문가 attribution을 남긴다
- 아래 필수 구현 기준을 충족한다
- 전체 문서 복사보다 `state/current.md`와 필요한 문서 ref를 우선한다.

## Mandatory Implementation Criteria

- 중복 제거
- 단일 책임
- 가독성
- 추상화
- 일관성
- 테스트에 좋은 코드
- 예외 처리 필수
- 작은 단위 처리
- 의존성 관리
- 확장성
- 네이밍

## Language Contract

- 이 skill이 작성하는 pgg 문서, state/history 문구, review/QA 산출물은 `.pgg/project.json`의 `language` 값을 따른다.
- 이 skill이 생성하거나 수정하는 pgg-managed 코드 주석은 `pgg lang`을 따른다.
- 사용자가 작성한 기존 코드 주석은 해당 task 범위에서 수정하는 경우에만 언어 계약을 적용한다.
