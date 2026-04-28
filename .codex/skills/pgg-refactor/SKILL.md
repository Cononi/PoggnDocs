---
name: "pgg-refactor"
description: "레거시 코드를 제거하고 기능 구조를 개선한다."
---

# Skill: pgg-refactor

## Purpose

구현된 topic을 리팩터링하고 레거시 코드를 제거하며, `reviews/refactor.review.md`와 state를 갱신한다.

## Teams Mode

- `pgg teams`가 `on`이면 `.codex/sh/pgg-state-pack.sh <topic|topic_dir>`로 최소 handoff를 만든 뒤 아래 2개 primary agent를 자동 orchestration한다.
- `pgg teams`가 `off`이면 같은 문서 계약을 유지하되 단일 에이전트 흐름으로 진행한다.
- pgg가 생성·관리하는 `.codex/sh/*.sh` helper만 workflow 내부 trusted script로 보고 추가 허락 없이 실행한다.

## Stage Events

- stage 시작 시 `state/history.ndjson`에 `{"stage":"refactor","event":"stage-started","source":"pgg-refactor"}`를 남긴다.
- 중간 산출물이나 검증 전 상태는 `stage-progress`로만 남긴다.
- 사용자 추가 요구가 있으면 refactor 작업 전에 `requirements-added`를 남긴다.
- refactor review, cleanup evidence, 필요한 task-scoped commit/gate가 끝난 뒤에만 completion evidence를 남긴다.
- `pgg git=on`이면 refactor task 완료의 completion evidence는 `.codex/sh/pgg-stage-commit.sh`가 남기는 `stage-commit`을 우선한다.
- `pgg git=off`이면 refactor commit을 시도하지 않고 cleanup evidence, refactor review, verification 결과, `Changed Files`, verified `stage-completed`를 completion evidence로 사용한다.

## Expert Roster

- 소프트웨어 아키텍트: 구조 경계와 단순화 판단
- 코드 리뷰어: 회귀와 dead code 검토

## Rules

- 승인된 계획 밖으로 제품 범위를 넓히지 않는다
- 현재 프로젝트 내부 refactor 기록과 generated doc 갱신은 자동 처리한다
- 현재 프로젝트 밖을 건드리는 작업은 자동 처리하지 않는다
- 제거 대상은 대체 또는 삭제 의도가 명확할 때만 정리한다
- `pgg git=on`이면 refactor task 완료마다 `.codex/sh/pgg-stage-commit.sh <topic|topic_dir> refactor <summary> <why> [footer]`를 실행하고 제목은 `{convention}: {version}.{commit message}` 형식, `pgg lang` 기반 메시지 언어, 상세 body를 유지한다
- `pgg git=off`이면 `.codex/sh/pgg-stage-commit.sh`를 실행하지 않고 refactor evidence와 state/history로 완료를 증명한다
- `reviews/refactor.review.md`에는 전문가 attribution을 남긴다
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
