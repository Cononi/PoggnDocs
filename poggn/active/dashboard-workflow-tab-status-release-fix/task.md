---
pgg:
  topic: "dashboard-workflow-tab-status-release-fix"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-24T23:52:49Z"
  auto_mode: "on"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "2.2.4"
  short_name: "dashboard-fix"
  working_branch: "ai/fix/2.2.4-dashboard-fix"
  release_branch: "release/2.2.4-dashboard-fix"
  project_scope: "current-project"
reactflow:
  node_id: "task"
  node_type: "task"
  label: "task.md"
state:
  summary: "tab visual, strict completion, stage event recording, Done outcome, dashboard ingestion, QA acceptance를 구현 task로 분해한다."
  next: "pgg-code"
---

# Task

## 1. Audit Applicability

- [pgg-token]: [not_required] | handoff token 최적화가 아니라 dashboard tab/status와 pgg evidence contract 정합이 핵심이다
- [pgg-performance]: [not_required] | UI geometry와 상태 evidence 계산/기록 수정이며 별도 성능 계측이 필요한 데이터 규모 변경은 없다

## 2. 작업 목록

| Task ID | Spec Ref | 작업 요약 | 선행 조건 | 완료 기준 |
|---|---|---|---|---|
| T1 | S3 | pgg stage event recording 경로를 확인하고 시작/진행/추가/완료 event append 계약을 구현한다. | proposal, S3 | `pgg-xx` stage 시작은 `stage-started`, 중간은 `stage-progress`, 추가 요구는 `requirements-added`, 완전 종료는 verified/final completion evidence로 남는다 |
| T2 | S2 | dashboard flow completion predicate를 엄격화한다. | T1, S2 | partial artifact, `reviewed`, workflow node existence, `updatedAt` fallback만으로 현재 flow가 완료되지 않는다 |
| T3 | S5 | dashboard status ingestion priority를 history/workflow/completion evidence 중심으로 정리한다. | T1-T2, S5 | `stage-started`/`stage-progress`는 `진행 중`, unresolved revision은 `추가 진행`, full completion evidence는 `완료`로 계산된다 |
| T4 | S4 | Done release outcome과 QA fail/release blocked/publish blocked 표시를 분리한다. | T2-T3, S4 | Done completed는 QA pass + archive/version/release evidence에만 표시되고 실패/차단은 완료와 구분된다 |
| T5 | S1 | Workflow History tab visual을 `add-img/9.png` 기준으로 수정한다. | S1 | selected tab bottom line이 없고, panel top line은 selected tab 바깥에서만 이어지며 inactive tab은 unboxed다 |
| T6 | S6 | QA acceptance evidence를 기록한다. | T1-T5, S6 | pgg gates, source checks, tab visual evidence candidate, strict completion scenarios, Done outcome checks가 implementation/QA 산출물에 남는다 |

## 3. 구현 메모

- T1 주 변경 후보는 `.codex/sh/pgg-stage-commit.sh`, `.codex/sh/pgg-new-topic.sh`, `.codex/sh/pgg-archive.sh`, `.codex/skills/pgg-*`, `packages/core/src/templates.ts`다.
- T1은 전역 생성물과 runtime helper가 같은 계약을 갖는지 함께 확인한다. 문서에만 규칙이 있고 실제 event append가 없으면 미완료다.
- T2 주 변경 후보는 `apps/dashboard/src/features/history/historyModel.ts`의 `isCompletionEvent`, `flowTimestampBundle`, `buildWorkflowSteps`, `topicStageIsComplete` 주변이다.
- T2는 `stage-completed`의 source가 verified/final/gate/qa 계열인지 확인하고, `reviewed`/`approved` status alone을 current flow completion으로 승격하지 않는다.
- T3은 `state/history.ndjson` event와 `workflow.reactflow.json` node detail timestamp/status를 우선 source로 쓰고, broad fallback은 confidence를 낮춘다.
- T4는 `version.json`, `poggn/version-history.ndjson`, archive metadata, git publish metadata, QA report result를 outcome source로 사용한다.
- T5 주 변경 후보는 `apps/dashboard/src/features/history/HistoryWorkspace.tsx`의 `HISTORY_TAB_*`, `buildHistoryTabBounds`, selected `ButtonBase` sx, panel `::before`/`::after` top-line segment다.
- T6은 current-project verification contract가 manual임을 유지한다. declared command 없이 framework command를 공식 verification으로 간주하지 않는다.

## 4. 검증 체크리스트

- `pgg-plan` 또는 다음 stage 시작 event가 들어오면 Plan flow가 `진행 중`으로 계산될 수 있다.
- 완료 조건이 전부 끝나기 전인 flow는 `완료`로 표시되지 않는다.
- 문서 일부 생성, review draft, `updatedAt`, workflow node existence는 completed evidence가 아니다.
- 추가 요구 뒤 unresolved state는 `추가 진행`으로 표시되고, completion evidence 뒤 해소된다.
- 이전 완료 flow는 새 flow 진행 때문에 `시작 전`으로 되돌아가지 않는다.
- Done은 QA pass + archive/version/release evidence가 있을 때만 completed다.
- QA fail, release blocked, publish blocked는 Done completed가 아니다.
- selected tab은 `add-img/9.png`처럼 하단 선이 없고 content panel과 연결된다.
- inactive tab은 box/card처럼 보이지 않는다.
- tab/panel line은 desktop/mobile 주요 viewport에서 끊기거나 겹치지 않는다.
- state/current.md에는 next stage와 핵심 결정만 유지되고 전체 문서 복사는 없다.
