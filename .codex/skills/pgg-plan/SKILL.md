---
name: "pgg-plan"
description: "승인된 proposal을 plan, task, spec 문서로 전개한다."
---

# Skill: pgg-plan

## Purpose

`plan.md`, `task.md`, 관련 `spec/*/*.md`, `plan/task` 리뷰를 생성한다.

## Teams Mode

- `pgg teams`가 `on`이면 `.codex/sh/pgg-state-pack.sh <topic|topic_dir>`로 최소 handoff를 만든 뒤 아래 2개 primary agent를 자동 orchestration한다.
- `pgg teams`가 `off`이면 같은 문서 계약을 유지하되 단일 에이전트 흐름으로 진행한다.
- pgg가 생성·관리하는 `.codex/sh/*.sh` helper만 workflow 내부 trusted script로 보고 추가 허락 없이 실행한다.

## Stage Events

- stage 시작 시 `state/history.ndjson`에 `{"stage":"plan","event":"stage-started","source":"pgg-plan"}`를 남긴다.
- 중간 산출물이나 추가 정리는 `stage-progress`로만 남긴다.
- 사용자 추가 요구가 있으면 plan 작업 전에 `requirements-added`를 남긴다.
- plan/task/spec/review와 gate가 검증된 뒤에만 `source:"verified"` 계열 `stage-completed`를 남긴다.

## Expert Roster

- 소프트웨어 아키텍트: spec 경계와 시스템 영향
- 도메인 전문가: domain constraint와 용어 정합성

## Rules

- 구현하지 않는다
- spec 없이 task를 만들지 않는다
- task는 spec 경계로 분해한다
- 현재 프로젝트 내부 확인/기록 절차는 자동 처리한다
- proposal이 현재 프로젝트 밖 범위를 가리키면 자동 진행하지 않는다
- `reviews/plan.review.md`와 `reviews/task.review.md`를 모두 남긴다
- review 문서에는 전문가 attribution을 남긴다
- 전체 문서 복사보다 `state/current.md`와 필요한 문서 ref를 우선한다.
