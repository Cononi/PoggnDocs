---
pgg:
  topic: "dashboard-optional-audit-token-metrics"
  stage: "task"
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
| T1 | `S1` | dashboard workflow Overview의 optional audit visibility를 실제 실행 evidence 기반으로 제한한다. | proposal | `pgg-token`/`pgg-performance`가 applicability 또는 static definition만으로 표시되지 않는다. |
| T2 | `S2` | timeline row와 bounds 생성 조건을 완료된 workflow progress evidence로 제한한다. | T1 | 진행 중/추가 진행/시작 전 flow가 timeline 완료 이력으로 표시되지 않는다. |
| T3 | `S3` | pgg token usage ledger schema와 stage/task/file artifact attribution 규칙을 구현 대상에 반영한다. | T1, T2 | `llm`/`local` source, actual/estimated, artifact ref를 포함한 record 구조가 생성 가능하다. |
| T4 | `S4` | init/update로 생성되는 workflow docs, skills, helper templates에 optional audit visibility와 token ledger 계약을 전파한다. | T3 | 새 프로젝트 또는 update된 프로젝트가 같은 계약 문서를 갖는다. |
| T5 | `S5` | dashboard snapshot/model/history ingestion이 flow/file token summary를 읽고 timeline/workflow 지표로 쓸 수 있게 한다. | T3 | dashboard model에서 flow/file별 llm/local token summary가 계산 가능하다. |

## 2. 구현 메모

- T1은 `apps/dashboard/src/features/history/historyModel.ts`의 `topicHasFlowEvidence`, `visibleWorkflowFlows`, optional `workflowFlowDefinitions` evidence 해석을 중심으로 진행한다.
- T2는 `buildTimelineRows`, `buildTimelineBounds`, `buildWorkflowSteps` 완료 계산의 기준 차이를 줄이는 작업이다.
- T3는 `state/token-usage.ndjson` 또는 동등 append-only topic-local ledger를 우선 후보로 설계한다. record는 stage, flow, task, event, artifact path, token source, token counts, estimated flag를 포함해야 한다.
- T4는 `.codex/add/WOKR-FLOW.md`, `.codex/add/STATE-CONTRACT.md`, `.codex/add/IMPLEMENTATION.md`, `.codex/add/REVIEW-RUBRIC.md`, `.codex/skills/pgg-*`, `.codex/sh/*.sh`, `packages/core/src/templates.ts`의 생성물 전파를 검토한다.
- T5는 `packages/core/src/index.ts`, `apps/dashboard/src/shared/model/dashboard.ts`, `apps/dashboard/src/features/history/historyModel.ts`, 필요 시 `apps/dashboard/src/shared/locale/dashboardLocale.ts`를 구현 후보로 본다.

## 3. 금지 사항

- optional audit를 모든 topic의 mandatory flow로 만들지 않는다.
- `required` applicability를 실행 완료 evidence로 취급하지 않는다.
- timeline에서 partial artifact나 updatedAt fallback만으로 완료 flow를 생성하지 않는다.
- token usage ledger에 prompt 전문 또는 전체 파일 내용을 비용 기록용으로 복사하지 않는다.
- plan 단계에서 code implementation을 수행하지 않는다.

## 4. Audit Applicability

- `pgg-token`: `required` | workflow 자산, state handoff, generated 문서 구조, token usage 기록 계약을 함께 바꾸는 topic이다.
- `pgg-performance`: `not_required` | dashboard 표시 조건과 token metrics 계약이 핵심이며 별도 성능 민감 runtime path나 선언된 performance verification contract는 없다.
