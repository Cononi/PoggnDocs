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
  node_id: "spec-qa-audit-flow-i18n-regression"
  node_type: "spec"
  label: "spec/qa/audit-flow-i18n-regression.md"
state:
  summary: "optional audit flow와 i18n 회귀 검증 계약"
---

# Spec: Audit Flow I18n Regression

## Problem

optional audit flow와 i18n 표시는 snapshot data, model helper, UI dictionary가 함께 맞아야 하므로 단일 UI 확인만으로는 회귀를 잡기 어렵다.

## Requirements

1. token audit evidence가 있는 topic fixture를 준비하거나 기존 fixture를 확장해야 한다.
2. performance audit evidence가 있는 topic fixture를 준비하거나 기존 fixture를 확장해야 한다.
3. optional audit evidence가 없는 topic은 token/performance flow가 숨겨지는 사례를 유지해야 한다.
4. ko/en dictionary 전환 시 flow label/status/detail/event fallback이 각각 지역화되는지 확인해야 한다.
5. current-project verification contract가 manual mode이면 자동 검증 미실행 사유를 QA report에 남겨야 한다.
6. `pgg-token` applicability가 required이므로 구현 후 token audit report가 필요하다.

## Acceptance Criteria

- token evidence topic의 workflow steps에 `token` flow가 포함된다.
- performance evidence topic의 workflow steps에 `performance` flow가 포함된다.
- no audit evidence topic의 workflow steps에는 optional audit flow가 표시되지 않는다.
- ko/en 표시 문자열이 dictionary 기반으로 전환된다.
- QA는 `manual verification required` 상태와 실제 수행한 수동 증거를 분리해 기록한다.

## Non-goals

- 성능 벤치마크를 새로 강제하지 않는다.
- 외부 서비스 기반 번역 검증을 추가하지 않는다.
