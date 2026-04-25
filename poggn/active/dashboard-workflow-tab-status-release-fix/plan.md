---
pgg:
  topic: "dashboard-workflow-tab-status-release-fix"
  stage: "plan"
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
  node_id: "plan"
  node_type: "doc"
  label: "plan.md"
state:
  summary: "Workflow tab visual, strict flow completion, stage event recording, Done release outcome, dashboard ingestion, QA acceptance를 spec으로 분해한다."
  next: "pgg-code"
---

# Plan

## 1. 목표

- Workflow History tab을 `add-img/9.png`처럼 selected tab과 content panel이 하나로 이어지는 형태로 맞춘다.
- selected tab의 bottom border, underline, 불필요한 선택 라인을 제거하고, inactive tab은 box 없이 text control로 유지한다.
- 모든 flow는 `시작 전`, `진행 중`, `추가 진행`, `완료` 4상태를 같은 evidence contract로 표시한다.
- `pgg-add`, `pgg-plan`, `pgg-code`, `pgg-refactor`, `pgg-qa` 시작 시 해당 flow가 `진행 중`으로 바뀔 수 있도록 stage event recording contract를 구현 경계로 둔다.
- 모든 flow는 stage별 필수 산출물, review, verification, commit/release evidence가 완전히 끝나야만 `완료`가 된다.
- 중간 산출물, `reviewed` frontmatter, workflow node 존재, `updatedAt` fallback은 완료가 아니라 progress evidence로 취급한다.
- Done flow는 release outcome으로 제한하고, QA fail/release blocked/publish blocked를 Done completed와 분리한다.
- dashboard 상태 계산 문제와 pgg event 기록 절차 문제를 각각 확인해, 둘 중 하나만 고치는 누락을 막는다.

## 2. Audit Applicability

- [pgg-token]: [not_required] | handoff token 최적화가 아니라 dashboard tab/status와 pgg evidence contract 정합이 핵심이다
- [pgg-performance]: [not_required] | UI geometry와 상태 evidence 계산/기록 수정이며 별도 성능 계측이 필요한 데이터 규모 변경은 없다

## 3. Spec 분해

| Spec ID | path | 목적 | 구현 핵심 |
|---|---|---|---|
| S1 | `spec/ui/workflow-tab-reference.md` | `add-img/9.png` 기준의 tab/panel visual contract를 정의한다. | `HistoryWorkspace.tsx`, tab constants, selected tab mask, panel top line |
| S2 | `spec/model/strict-flow-completion.md` | flow별 완전 종료 조건과 partial evidence 금지를 정의한다. | `historyModel.ts`, completion predicates, status priority |
| S3 | `spec/telemetry/pgg-stage-event-recording.md` | pgg stage 시작/진행/완료/추가 요구 event 기록 계약을 정의한다. | `.codex/sh/*.sh`, `.codex/skills/pgg-*`, `packages/core/src/templates.ts` |
| S4 | `spec/release/done-release-outcome.md` | Done flow와 QA fail/release blocked/publish blocked 표시를 정의한다. | `historyModel.ts`, archive/version/publish metadata, locale labels |
| S5 | `spec/model/dashboard-status-ingestion.md` | dashboard가 history/workflow/frontmatter/archive evidence를 읽는 우선순위를 정의한다. | dashboard snapshot parser, `historyModel.ts`, workflow node detail |
| S6 | `spec/qa/workflow-tab-status-acceptance.md` | visual/source/model/release acceptance와 manual verification boundary를 정의한다. | source review, screenshot/pixel check candidate, pgg gate, build candidate |

## 4. 구현 순서

1. S3을 먼저 적용해 pgg stage 시작 시 `stage-started`, 중간 작업 시 `stage-progress`, 추가 요구 시 `requirements-added`, 완전 종료 시 verified/final completion evidence가 남는 계약을 확정한다.
2. S2와 S5를 적용해 dashboard가 partial artifact와 completion evidence를 분리하고, 현재 flow를 너무 빨리 `완료`로 만들지 않게 한다.
3. S4를 적용해 Done을 release outcome으로만 계산하고 실패/차단 release 상태를 completed와 분리한다.
4. S1을 적용해 `add-img/9.png` 기준 tab/panel shape를 재구성한다.
5. S6 기준으로 tab visual, strict completion, event ingestion, Done outcome, regression risk를 검증하고 implementation evidence를 남긴다.

## 5. 검증 전략

- `state/history.ndjson`에 stage start/progress/completion/revision event가 있을 때 dashboard flow status가 기대 상태로 계산되는지 source-level로 확인한다.
- 현재 stage에 partial artifact가 있어도 verified/final completion evidence가 없으면 `완료`가 아닌 `진행 중` 또는 `추가 진행`으로 남는지 확인한다.
- Add/Plan/Code/Refactor/QA의 stage별 완료 조건이 spec과 구현에서 같은 기준인지 확인한다.
- Done은 archived/version/release evidence가 있을 때만 completed이고, QA fail/release blocked/publish blocked는 separate outcome으로 표시되는지 확인한다.
- `add-img/9.png` 기준으로 selected tab bottom line이 사라지고 panel top line이 selected tab 바깥에서만 이어지는지 확인한다.
- current-project verification contract는 `manual verification required`다. 구현 단계에서는 pgg gate, source checks, 가능한 dashboard build/visual evidence를 별도 evidence 후보로 기록한다.

## 6. 리스크와 가드레일

- pgg core workflow 순서와 stage 이름은 변경하지 않는다.
- `추가 사항`은 사용자-facing 표기에서 기존 계약의 `추가 진행`으로 정규화한다.
- 완료 기준을 강화해도 과거 archive topic의 history가 부족한 경우에는 보수적으로 fallback하되 completed를 과대 표시하지 않는다.
- `stage-completed`는 verified/final source일 때만 completion evidence로 본다.
- `reviewed`, `approved`, artifact 존재는 later-flow advancement 또는 governed completion evidence 없이 현재 flow completion으로 승격하지 않는다.
- visual tab 수정은 History tab/panel surface에 한정하고 dashboard 전체 레이아웃 재설계를 하지 않는다.
- `add-img/9.png` 파일 자체는 수정하지 않는다.

## 7. 완료 기준

- `plan.md`, `task.md`, `spec/*/*.md`, `reviews/plan.review.md`, `reviews/task.review.md`가 생성되어 있다.
- task는 spec 경계를 그대로 따른다.
- `state/current.md`가 next stage를 `pgg-code`로 갱신하고, 전체 문서 복사 없이 필요한 refs/결정/검증 상태만 유지한다.
- `workflow.reactflow.json`에 plan/task/review node가 추가되어 있다.
- `pgg-plan` gate와 `pgg-code` gate가 통과한다.

## 8. 전문가 평가 요약

- 소프트웨어 아키텍트: UI tab, status model, telemetry recording, release outcome, ingestion, QA를 분리해 원인 진단과 구현 경계를 명확히 했다.
- 시니어 백엔드 엔지니어: completion predicate 강화와 event append 경로가 핵심 회귀 지점이다. `reviewed`/artifact fallback을 completion에서 분리해야 중간 완료 표시가 사라진다.
- QA/테스트 엔지니어: visual reference, strict completion, additional requirement state, Done outcome, manual verification boundary가 observable acceptance로 분해되어 있다.
