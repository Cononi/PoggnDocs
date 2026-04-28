---
name: "pgg-token"
description: "필요한 topic에서만 현재 pgg 워크플로우의 token optional audit를 수행한다."
---

# Skill: pgg-token

## Purpose

현재 pgg 워크플로우에 대해 필요한 경우에만 optional audit를 수행하고, token 비용 기여 요인과 최적화 액션을 실제 audit가 열렸을 때만 `token/report.md`에 기록한다.

## Teams Mode

- `pgg teams`가 `on`이면 `.codex/sh/pgg-state-pack.sh <topic|topic_dir>`로 최소 handoff를 만든 뒤 아래 2개 primary agent를 자동 orchestration한다.
- `pgg teams`가 `off`이면 같은 문서 계약을 유지하되 단일 에이전트 흐름으로 진행한다.
- pgg가 생성·관리하는 `.codex/sh/*.sh` helper만 workflow 내부 trusted script로 보고 추가 허락 없이 실행한다.

## Expert Roster

- 테크 리드: token 최적화 방향과 trade-off 판단
- 코드 리뷰어: 문서/프롬프트/중복 비용 검토

## Rules

- 모든 topic의 기본 stage가 아니라 optional audit로 취급한다
- workflow 자산, handoff 구조, helper, template, generated 문서가 token 비용에 직접 영향을 줄 때만 `required`로 올린다
- 측정 범위는 pgg workflow와 generated asset 내부로 제한한다
- 어떤 stage, helper, 문서, handoff가 token 비용에 기여하는지 식별한다
- token audit는 `state/token-usage.ndjson` 또는 동등 ledger의 coverage, `llm`/`local` source 분리, actual/estimated 표시, dashboard summary 사용 가능성을 확인한다.
- 모든 최적화 제안은 측정값 또는 근거 있는 추정과 연결한다
- audit를 실제로 실행한 경우에만 `token/report.md`를 만든다
- 측정값, 최적화 액션, 개선 후 결과를 `token/report.md`에 함께 남긴다
- 전체 문서 복사보다 `state/current.md`와 필요한 문서 ref를 우선한다.

## Language Contract

- 이 skill이 작성하는 pgg 문서, state/history 문구, review/QA 산출물은 `.pgg/project.json`의 `language` 값을 따른다.
- 이 skill이 생성하거나 수정하는 pgg-managed 코드 주석은 `pgg lang`을 따른다.
- 사용자가 작성한 기존 코드 주석은 해당 task 범위에서 수정하는 경우에만 언어 계약을 적용한다.
