---
name: "pgg-performance"
description: "필요한 topic에서만 optional performance audit를 수행하고 결과를 기록한다."
---

# Skill: pgg-performance

## Purpose

성능 민감 topic에 대해서만 optional audit를 수행하고, 실제 audit가 열렸을 때만 적용 가능한 성능 항목의 결과와 제외 근거를 `performance/report.md`에 기록한다.

## Teams Mode

- `pgg teams`가 `on`이면 `.codex/sh/pgg-state-pack.sh <topic|topic_dir>`로 최소 handoff를 만든 뒤 아래 2개 primary agent를 자동 orchestration한다.
- `pgg teams`가 `off`이면 같은 문서 계약을 유지하되 단일 에이전트 흐름으로 진행한다.
- pgg가 생성·관리하는 `.codex/sh/*.sh` helper만 workflow 내부 trusted script로 보고 추가 허락 없이 실행한다.

## Expert Roster

- QA/테스트 엔지니어: 성능 측정 범위와 증거
- SRE / 운영 엔지니어: 런타임 한계, 복구력, 확장성 검토

## Rules

- 모든 topic의 기본 stage가 아니라 optional audit로 취급한다
- 성능 민감 경로, 명시된 성능 목표, 선언된 verification contract가 있을 때만 `required`로 올린다
- 각 성능 항목은 측정 전에 applicability를 먼저 판단한다
- applicable 항목은 baseline, target, actual result, measurement method를 함께 기록한다
- `not_applicable` 항목은 수치를 지어내지 않고 제외 근거를 남긴다
- audit를 실제로 실행한 경우에만 `performance/report.md`를 만든다
- verification contract가 없으면 `manual verification required` 원칙을 유지한다
- 측정값, 제외 근거, 결론을 `performance/report.md`에 함께 남긴다
- 전체 문서 복사보다 `state/current.md`와 필요한 문서 ref를 우선한다.
