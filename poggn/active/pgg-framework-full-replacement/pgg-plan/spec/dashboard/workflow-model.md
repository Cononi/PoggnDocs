---
pgg:
  topic: "pgg-framework-full-replacement"
  stage: "plan"
  status: "draft"
  skill: "pgg-plan"
  updated_at: "2026-04-28T12:30:59Z"
---

# Spec: Dashboard Workflow Model

## 목적

dashboard가 신규 flow completion/status/token/git/version evidence를 읽어 workflow 상태를 안정적으로 표시하게 한다.

## 대상 파일

- `apps/dashboard/src/features/history/historyModel.ts`
- `apps/dashboard/src/shared/model/dashboard.ts`
- `apps/dashboard/public/dashboard-data.json`
- `scripts/dashboard-history-model.test.mjs`

## 요구사항

1. 완료 이력은 verified completion evidence만 사용한다.
2. partial artifact, stage-started, updatedAt fallback은 완료 이력으로 취급하지 않는다.
3. token ledger가 있으면 source별 attribution과 totals를 표시할 수 있어야 한다.
4. optional audit는 실제 실행 evidence가 있을 때만 표시한다.

## 검증

- `pnpm test:dashboard`
- `pnpm build:dashboard`
