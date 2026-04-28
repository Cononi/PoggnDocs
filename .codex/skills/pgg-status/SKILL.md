---
name: "pgg-status"
description: "현재 active topic 상태를 읽고 각 topic이 다음에 어떤 워크플로우로 가야 하는지 설명한다."
---

# Skill: pgg-status

## Purpose

현재 프로젝트의 active topic을 읽고 각 topic의 현재 stage, 진행 상태, 다음 workflow, 판단 근거를 설명한다.

## Scope

- core workflow stage가 아니라 standalone 운영 skill로 취급한다
- 기본 조회 범위는 현재 프로젝트의 `poggn/active/<topic>`만 사용한다
- 사용자가 범위를 넓히지 않는 한 `poggn/archive`는 읽지 않는다
- 추천된 workflow를 자동 실행하지 않는다

## Read Order

- current-project에 이미 있는 공유 status evaluator 결과, 예를 들면 `pgg status` 또는 `analyzeProjectStatus`를 먼저 사용한다
- 공유 status 결과가 없거나 부족할 때만 topic 문서를 직접 읽는다
- fallback에서는 `state/current.md`를 우선하고, `proposal.md`, `plan.md`, `task.md`, `qa/report.md`, artifact 존재 여부는 보조 근거로만 사용한다

## Response Contract

- 짧은 요약과 읽기 쉬운 topic별 구조로 답한다
- 최소 포함 항목은 topic, current stage, progress status, next workflow, reason이다
- 근거가 충분하면 ready, in-progress, blocked, archive-ready, manual-check-required 성격을 구분해 드러낸다
- 사용자가 JSON을 명시적으로 요구하지 않으면 raw JSON만 그대로 출력하지 않는다
- reason에는 `state/current.md`, 공유 status evaluator, artifact 기반 fallback 중 어떤 근거를 썼는지 드러낸다

## Guardrails

- current-project 범위를 벗어나지 않는다
- 상태를 설명하는 동안 topic 문서를 수정하지 않는다
- 근거가 없거나 충돌하면 진행 상태를 지어내지 않는다
- 근거가 약하면 추측 대신 `manual check required` 또는 `blocked`로 설명한다

## Language Contract

- 이 skill이 작성하는 pgg 문서, state/history 문구, review/QA 산출물은 `.pgg/project.json`의 `language` 값을 따른다.
- 이 skill이 생성하거나 수정하는 pgg-managed 코드 주석은 `pgg lang`을 따른다.
- 사용자가 작성한 기존 코드 주석은 해당 task 범위에서 수정하는 경우에만 언어 계약을 적용한다.
