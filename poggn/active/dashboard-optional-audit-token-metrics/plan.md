---
pgg:
  topic: "dashboard-optional-audit-token-metrics"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-27T23:32:03Z"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "2.9.0"
  short_name: "dashboard-metrics"
  project_scope: "current-project"
reactflow:
  node_id: "plan"
  node_type: "doc"
  label: "plan.md"
state:
  summary: "optional audit 표시 조건, timeline 완료 게이트, token usage 기록 계약을 spec 단위로 분해한다."
  next: "pgg-code"
---

# Plan

## 1. 목표

dashboard Overview에서 `pgg-token`, `pgg-performance`를 실제 실행된 경우에만 표시하고, timeline은 workflow progress가 `완료`인 flow만 보여 주며, pgg flow/task/file artifact별 token usage를 `llm`과 `local` source로 구분해 기록할 수 있도록 구현 경계를 확정한다.

## 2. 계획 요약

| Spec | 범위 | 산출 기대 |
|---|---|---|
| `S1` | optional audit flow visibility | `pgg-token`, `pgg-performance`가 applicability나 static definition만으로 표시되지 않고 실제 실행 evidence로만 표시된다. |
| `S2` | timeline completion gating | timeline row와 timeline bounds가 완료된 workflow progress evidence만 사용한다. |
| `S3` | token usage ledger schema | flow/task/file artifact 단위 token usage record와 `llm`/`local` source 구분이 정의된다. |
| `S4` | init/update propagation | `.codex/add`, skill, shell helper, core template/update path에 새 계약이 전파된다. |
| `S5` | dashboard token summary ingestion | dashboard snapshot/model이 flow/file token summary를 읽고 timeline/workflow 지표로 사용할 수 있다. |

## 3. 작업 순서

1. `S1`에서 optional audit visibility의 신뢰 evidence와 숨김 조건을 먼저 고정한다.
2. `S2`에서 timeline row 생성 조건을 `WorkflowStep.status === completed`와 같은 완료 계산으로 정렬한다.
3. `S3`에서 token usage ledger 저장 위치, ndjson schema, source 구분, 실측/추정 규칙을 정의한다.
4. `S4`에서 current-project 자산과 `packages/core/src/templates.ts` 및 update/install 경로 전파 범위를 확정한다.
5. `S5`에서 core snapshot type, dashboard shared model, history model summary ingestion 경계를 정리한다.

## 4. 설계 제약

- plan 단계에서는 source code를 변경하지 않는다.
- optional audit는 core workflow에 상시 표시되는 flow가 아니라 실제 실행 evidence가 있는 경우에만 노출된다.
- `Audit Applicability: required`는 audit 필요성 판단이며 실행 evidence나 완료 evidence가 아니다.
- timeline은 진행 중, 추가 진행, 시작 전 상태의 flow를 완료 이력처럼 보여 주지 않는다.
- token usage 기록은 prompt 전문이나 전체 문서 전문을 저장하지 않고 metrics와 artifact ref 중심으로 남긴다.
- `llm` token은 provider/model usage metadata가 있으면 actual로 기록하고, `local` token은 parser/helper/generator가 계산하거나 추정한 값으로 분리한다.
- current-project verification manifest가 manual이므로 plan 단계는 자동 project verification command를 선언하지 않는다.

## 5. Audit Applicability

- `pgg-token`: `required` | workflow 자산, state handoff, generated 문서 구조, token usage 기록 계약을 함께 바꾸는 topic이다.
- `pgg-performance`: `not_required` | dashboard 표시 조건과 token metrics 계약이 핵심이며 별도 성능 민감 runtime path나 선언된 performance verification contract는 없다.

## 6. 검증 전략

- `pgg-gate.sh pgg-code dashboard-optional-audit-token-metrics`로 plan/task/spec/review 산출물 존재를 확인한다.
- `workflow.reactflow.json`은 JSON parse로 검증한다.
- 구현 단계에서는 focused model tests 또는 dashboard build를 수동 검증 evidence로 남긴다.
- QA 단계에서는 `pgg-token` required audit report가 존재해야 한다.

## 7. 다음 단계 인계

- `task.md`의 T1부터 T5까지 순서대로 구현한다.
- 구현 전 각 `spec/*/*.md`의 Acceptance Criteria를 먼저 확인한다.
- 다음 flow는 `pgg-code`다.
