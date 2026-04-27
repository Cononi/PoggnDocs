---
pgg:
  topic: "dashboard-audit-flow-i18n-surface"
  stage: "task"
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
  node_id: "task"
  node_type: "doc"
  label: "task.md"
state:
  summary: "spec 경계별 구현 task를 정의한다."
  next: "pgg-code"
---

# Task

## 1. Task 목록

| ID | Spec | 작업 | Dependencies | 완료 조건 |
|---|---|---|---|---|
| T1 | `S1` | dashboard workflow model에 `token` optional flow를 추가하고 token/performance 실행 evidence 감지를 정렬한다. | proposal | token/performance가 실행 evidence가 있을 때만 visible workflow에 포함된다. |
| T2 | `S2` | workflow label, status, detail, event, fallback 문구를 dashboard i18n dictionary 기반으로 전환한다. | T1 | ko/en 모두에서 workflow 표시 문자열이 dictionary 경유로 생성된다. |
| T3 | `S3` | pgg generated docs/helper 기록 언어가 pgg lang을 따르는 계약을 구현 대상과 검증 포인트에 반영한다. | T1, T2 | 새 pgg 기록 문서/요약/commit source가 manifest language와 불일치하지 않는다. |
| T4 | `S4` | optional audit 표시와 i18n 전환 회귀 검증 fixture 및 QA evidence 절차를 추가한다. | T1, T2, T3 | token 표시, performance 표시, optional 숨김, ko/en 전환 결과가 검증 가능하다. |

## 2. 구현 메모

- T1은 `apps/dashboard/src/features/history/historyModel.ts`의 `WorkflowFlowId`, `workflowFlowDefinitions`, `normalizeFlowId`, evidence matching 함수를 중심으로 진행한다.
- T2는 `apps/dashboard/src/shared/locale/dashboardLocale.ts`와 workflow rendering call site의 dictionary 전달 구조를 함께 봐야 한다.
- T3는 `.pgg/project.json` language, `packages/core/src/templates.ts`, `.codex/sh/*.sh` helper-generated text가 같은 언어 계약을 따르는지 확인한다.
- T4는 repository의 declared verification contract가 manual이므로 자동 검증 명령을 필수로 쓰지 않고, 실행한 검증은 수동 evidence로 남긴다.

## 3. 금지 사항

- optional audit를 모든 topic의 기본 mandatory flow로 만들지 않는다.
- 한국어/영어 번역문을 model 내부에 흩뿌리지 않는다.
- 저장 원본 enum 값을 표시 언어로 변환해 저장하지 않는다.
- plan 단계에서 code implementation을 수행하지 않는다.

## 4. Audit Applicability

- `pgg-token`: `required` | workflow 자산, state handoff, generated 문서 언어 계약과 dashboard projection을 함께 점검해야 한다.
- `pgg-performance`: `not_required` | 성능 민감 변경이나 선언된 성능 verification contract는 아직 없다.
