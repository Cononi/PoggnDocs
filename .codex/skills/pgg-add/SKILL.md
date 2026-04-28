---
name: "pgg-add"
description: "사용자 요구사항을 검토하고 proposal 단계 문서를 생성한다."
---

# Skill: pgg-add

## Purpose

`proposal.md`, 사용자 입력 질문 기록, 전문가 attribution이 있는 proposal review, state 요약, workflow 메타데이터를 만든다.

## Teams Mode

- `pgg teams`가 `on`이면 `.codex/sh/pgg-state-pack.sh <topic|topic_dir>`로 최소 handoff를 만든 뒤 아래 2개 primary agent를 자동 orchestration한다.
- `pgg teams`가 `off`이면 같은 문서 계약을 유지하되 단일 에이전트 흐름으로 진행한다.
- pgg가 생성·관리하는 `.codex/sh/*.sh` helper만 workflow 내부 trusted script로 보고 추가 허락 없이 실행한다.

## Stage Events

- stage 시작 시 `state/history.ndjson`에 `stage-started`를 남긴다. `pgg-new-topic.sh`가 새 topic의 proposal `stage-started`를 자동 기록한다.
- 중간 산출물이나 추가 정리는 `stage-progress`로만 남긴다.
- 사용자 추가 요구가 있으면 해당 stage 작업 전에 `requirements-added`를 남긴다.
- proposal review와 handoff state가 검증된 뒤에만 `source:"verified"` 계열 `stage-completed`를 남긴다.

## Expert Roster

- 프로덕트 매니저: 문제 정의, 범위, 성공 기준
- UX/UI 전문가: 사용자 흐름과 상호작용 명확성

## Read

- 사용자 요구사항
- `.codex/add/WOKR-FLOW.md`
- `.codex/add/STATE-CONTRACT.md`
- `.codex/add/EXPERT-ROUTING.md`

## Write

- `proposal.md`
- `proposal.md` 안의 사용자 입력 질문 기록 섹션
- `reviews/proposal.review.md`
- `state/current.md`
- `workflow.reactflow.json`
- `archive_type`, `version_bump`, `target_version`, `short_name`, branch naming, `project_scope: current-project` 확정

## Handoff

- 현재 프로젝트 내부 확인, 기록, 문서 생성은 추가 사용자 확인 없이 자동 처리한다.
- 현재 프로젝트 밖 경로나 전역 상태를 건드리면 자동 처리하지 않고 중단한다.
- 사용자 질문 기록은 해석/범위/성공 기준과 섞지 않고 별도 섹션으로 유지한다.
- proposal과 `state/current.md`는 `archive_type`와 별도로 `version_bump`, `target_version`, branch naming 결과를 바로 읽을 수 있게 유지한다.
- 전체 문서 복사보다 `state/current.md`와 필요한 문서 ref를 우선한다.
- `reviews/proposal.review.md`에는 어떤 전문가가 어떤 판단을 했는지 명시한다.

## Language Contract

- 이 skill이 작성하는 pgg 문서, state/history 문구, review/QA 산출물은 `.pgg/project.json`의 `language` 값을 따른다.
- 이 skill이 생성하거나 수정하는 pgg-managed 코드 주석은 `pgg lang`을 따른다.
- 사용자가 작성한 기존 코드 주석은 해당 task 범위에서 수정하는 경우에만 언어 계약을 적용한다.
