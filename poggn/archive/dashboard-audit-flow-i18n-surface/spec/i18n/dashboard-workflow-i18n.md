---
pgg:
  topic: "dashboard-audit-flow-i18n-surface"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-27T04:43:54Z"
  archive_type: "feat"
  project_scope: "current-project"
reactflow:
  node_id: "spec-i18n-dashboard-workflow"
  node_type: "spec"
  label: "spec/i18n/dashboard-workflow-i18n.md"
state:
  summary: "dashboard workflow 고정 표시값 i18n 계약"
---

# Spec: Dashboard Workflow I18n

## Problem

workflow history model에는 `Add`, `Plan`, `No stage artifact`, `Next action`, `source unknown` 같은 표시 문자열이 직접 포함되어 있다. 이 구조는 dashboard locale 전환과 분리되며 pgg lang 기반 운영 화면에서 언어가 섞일 수 있다.

## Requirements

1. workflow flow label은 locale dictionary에서 읽어야 한다.
2. workflow status label은 기존 `workflowProgressStatus*` dictionary 또는 동등한 locale key를 통해 표시해야 한다.
3. flow detail fallback, event sentence, unknown source, related file count, next action 문구는 locale dictionary를 통해 생성해야 한다.
4. `token` flow label과 `performance` flow label은 ko/en dictionary 모두에 있어야 한다.
5. 저장 데이터의 raw enum, stage, event name은 변경하지 않고 presentation layer에서만 지역화해야 한다.
6. dashboard UI는 `HistoryLanguage` 또는 project language를 기준으로 같은 dictionary를 사용해야 한다.

## Acceptance Criteria

- ko dictionary에서 token/performance label과 workflow fallback/event 문구를 읽을 수 있다.
- en dictionary에서 token/performance label과 workflow fallback/event 문구를 읽을 수 있다.
- `buildWorkflowSteps` 또는 그 주변 adapter가 하드코딩된 workflow display text 대신 locale helper를 사용한다.
- topic stage/status 원본값은 snapshot data에서 변경되지 않는다.

## Non-goals

- `.pgg/project.json`의 language 값을 dashboard UI 설정과 독립된 새 설정으로 복제하지 않는다.
- enum 저장값을 번역 문자열로 바꾸지 않는다.
