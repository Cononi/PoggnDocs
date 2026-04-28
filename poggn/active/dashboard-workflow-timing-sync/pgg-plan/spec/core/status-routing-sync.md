---
pgg:
  topic: "dashboard-workflow-timing-sync"
  stage: "plan"
  status: "approved"
  skill: "pgg-plan"
  updated_at: "2026-04-28T14:28:00Z"
reactflow:
  node_id: "spec-core-status-routing-sync"
  node_type: "spec"
  label: "core status routing sync"
---

# Spec: Core Status Routing Sync

## 목적

core status analyzer가 dashboard와 같은 workflow state를 추천하게 한다.
pgg-add가 완료되고 pgg-plan이 시작되었으며 plan 산출물이 완성된 topic은 `pgg-code`로 진행해야 한다.

## 구현 지점

- `packages/core/src/index.ts`
  - `resolveTopicStage`
  - `resolveMissingArtifactRecommendation`
  - `evaluateTopicStatus`
- `packages/core/test/status-analysis.test.mjs`

## 규칙

- proposal approval과 proposal review가 없으면 `pgg-add`.
- pgg-plan 산출물 중 하나라도 없으면 `pgg-plan`.
- `pgg-plan/plan.md`, `pgg-plan/task.md`, `pgg-plan/spec/*/*.md`, `pgg-plan/reviews/plan.review.md`, `pgg-plan/reviews/task.review.md`가 모두 있으면 `pgg-code`.
- pgg-plan started/progress history evidence는 pgg-plan이 시작되었음을 보여주지만, 완료 판단은 산출물 completeness와 review artifact를 함께 사용한다.
- required performance audit는 pgg-code/refactor 후 QA 전 recommendation으로 유지한다.

## 성공 기준

- complete plan artifact fixture는 `nextWorkflow=pgg-code`.
- incomplete plan artifact fixture는 `nextWorkflow=pgg-plan`.
- branch isolation, blocking issue, QA archive-ready 기존 테스트가 그대로 PASS한다.
