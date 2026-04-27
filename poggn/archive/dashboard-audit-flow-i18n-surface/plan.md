---
pgg:
  topic: "dashboard-audit-flow-i18n-surface"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-27T04:43:54Z"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "2.4.0"
  short_name: "dashboard-surface"
  project_scope: "current-project"
reactflow:
  node_id: "plan"
  node_type: "doc"
  label: "plan.md"
state:
  summary: "dashboard optional audit flow 표시와 pgg lang/i18n 전환 계약을 spec 단위로 분해한다."
  next: "pgg-code"
---

# Plan

## 1. 목표

dashboard project workflow가 실제 실행된 `pgg-token`, `pgg-performance` optional audit를 flow로 표시하고, pgg 기록 문서와 dashboard 고정 표시값이 pgg lang 및 i18n dictionary를 통해 언어 전환되도록 구현 경계를 확정한다.

## 2. 계획 요약

| Spec | 범위 | 산출 기대 |
|---|---|---|
| `S1` | dashboard workflow optional audit flow 모델 | `token` flow 추가, `performance` evidence 보강, optional flow visibility 유지 |
| `S2` | dashboard workflow i18n 표시 계약 | flow label/status/detail/event/fallback 문구의 locale dictionary 경유 |
| `S3` | pgg language contract | generated docs/helper 기록이 `.pgg/project.json` language를 따르는 검증 경계 |
| `S4` | QA와 회귀 증거 | token/performance evidence fixture, ko/en 전환, optional 숨김/표시 회귀 검증 |

## 3. 작업 순서

1. `S1`에서 workflow model의 flow id, normalize, evidence path, history event matching 계약을 먼저 고정한다.
2. `S2`에서 `historyModel`과 dashboard locale 사이의 표시 문자열 경계를 정리한다.
3. `S3`에서 pgg generated docs/helper 기록 언어의 source-of-truth와 신규 산출물 언어 규칙을 명시한다.
4. `S4`에서 fixture와 수동 검증 절차를 설계하고, current-project verification contract 부재를 명확히 남긴다.

## 4. 설계 제약

- 구현 단계 전까지 source code를 변경하지 않는다.
- optional audit는 실행 evidence가 있을 때만 workflow에 나타난다.
- 저장 데이터의 enum/status 원본값은 지역화하지 않고 표시 계층에서만 i18n을 적용한다.
- `token`과 `pgg-token`, `performance`와 `pgg-performance`는 dashboard workflow 해석에서 같은 flow로 정규화한다.
- `state/history.ndjson` event, `workflow.reactflow.json` node, topic files가 모두 flow evidence 후보가 되어야 한다.
- 현재 project verification manifest는 manual mode이므로 자동 검증 명령은 필수 계약으로 선언하지 않는다.

## 5. Audit Applicability

- `pgg-token`: `required` | workflow 자산, state handoff, generated 문서 언어 계약과 dashboard projection을 함께 점검해야 한다.
- `pgg-performance`: `not_required` | 성능 민감 변경이나 선언된 성능 verification contract는 아직 없다.

## 6. 검증 전략

- `pgg-gate.sh pgg-code dashboard-audit-flow-i18n-surface`로 plan/task/spec/review 산출물 존재를 확인한다.
- 자동 project verification contract는 없으므로 구현 검증은 QA에서 `manual verification required`로 시작한다.
- 구현 단계에서는 가능한 범위에서 dashboard build 또는 focused model assertion을 증거로 남기되, 이는 current-project verification contract가 아니라 수동 검증 증거로 기록한다.

## 7. 다음 단계 인계

- `task.md`의 T1부터 T4까지 순서대로 구현한다.
- 구현 전 `spec/*/*.md`의 Acceptance Criteria를 먼저 확인한다.
- 다음 flow는 `pgg-code`다.
