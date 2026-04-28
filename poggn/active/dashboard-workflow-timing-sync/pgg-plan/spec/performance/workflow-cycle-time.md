---
pgg:
  topic: "dashboard-workflow-timing-sync"
  stage: "plan"
  status: "approved"
  skill: "pgg-plan"
  updated_at: "2026-04-28T14:28:00Z"
reactflow:
  node_id: "spec-performance-workflow-cycle-time"
  node_type: "spec"
  label: "workflow cycle time"
---

# Spec: Workflow Cycle Time

## 목적

사용자가 보고한 "workflow 진행 방식이 너무 많은 시간을 소비"한다는 문제를 기능 버그와 성능 측정으로 분리한다.

## 측정 대상

- `node --test scripts/dashboard-history-model.test.mjs`
- `pnpm test:dashboard`
- `pnpm build:dashboard`
- 필요 시 `pnpm test`, `pnpm build`

## 기록 위치

- pgg-code 중간 검증: `poggn/active/dashboard-workflow-timing-sync/pgg-code/verify.md`
- required audit 결과: `poggn/active/dashboard-workflow-timing-sync/pgg-performance/report.md` 또는 `performance/report.md`

## 성공 기준

- dashboard model test는 5초 이내다.
- dashboard build는 baseline 대비 20% 초과 증가하지 않는다.
- 초과 시 functional failure와 환경 변동을 분리한 원인 기록이 있어야 한다.

## 제외

- LLM 응답 시간 최적화.
- repository 전체 architecture redesign.
- dashboard UI redesign.
