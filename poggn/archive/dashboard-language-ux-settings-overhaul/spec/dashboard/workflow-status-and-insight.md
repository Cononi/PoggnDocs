---
pgg:
  topic: "dashboard-language-ux-settings-overhaul"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-27T12:02:00Z"
  archive_type: "feat"
  project_scope: "current-project"
reactflow:
  node_id: "spec-dashboard-workflow-status-and-insight"
  node_type: "spec"
  label: "spec/dashboard/workflow-status-and-insight.md"
state:
  summary: "workflow status evidence와 Sprint Progress 중복 제거 계약"
  next: "pgg-code"
---

# Spec: Workflow Status And Insight

## 목적

workflow status는 stage evidence의 최신 상태를 정확히 반영해야 한다. 완료된 refactor가 `단계 실패`로 보이면 사용자는 실제 진행 상태를 신뢰할 수 없다. Sprint Progress도 같은 상태 label을 중복 표시하지 않아야 한다.

## 요구사항

1. `stage-blocked`는 최신 unresolved blocked/fail evidence가 있을 때만 표시한다.
2. 같은 flow에 이후 `stage-completed`, `stage-commit`, archive/publish completion evidence가 있으면 completion이 blocked보다 우선한다.
3. archive topic은 done flow 외 이전 flow가 completion evidence 또는 archive outcome으로 완료 처리되어야 한다.
4. Sprint Progress는 donut label과 legend label이 같은 내용을 중복으로 노출하지 않도록 한다.
5. 진행중/완료/실패 같은 status label은 한 번만 읽히게 한다.

## 구현 기준

- `historyModel.ts`의 `flowHasBlockedEvidence`, `flowTimestampBundle`, `buildWorkflowSteps` 우선순위를 점검한다.
- blocked evidence는 timestamp 기준으로 이후 completion evidence가 있으면 해소된 것으로 본다.
- timestamp가 없는 low confidence artifact fallback은 실제 blocked event보다 낮은 우선순위를 가진다.
- `InsightsRail.tsx`는 progressWidget item label을 donut 내부와 legend에서 중복 강조하지 않도록 display strategy를 바꾼다.

## 테스트 기준

- refactor에 blocked/fail evidence가 있어도 이후 stage-completed 또는 stage-commit이 있으면 completed로 계산되는 fixture를 추가한다.
- archive topic의 refactor flow가 `stage-blocked`가 아닌 completed로 표시되는 fixture를 추가한다.
- Sprint Progress item rendering은 duplicate label이 없는 구조로 검증한다.
