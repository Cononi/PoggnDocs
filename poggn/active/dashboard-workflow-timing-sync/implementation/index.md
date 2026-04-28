---
pgg:
  topic: "dashboard-workflow-timing-sync"
  stage: "code"
  status: "done"
  skill: "pgg-code"
  updated_at: "2026-04-28T15:04:00Z"
---

# Implementation Index

## Summary

Dashboard workflow timeline duration now displays elapsed wall-clock time between trusted flow start and completion evidence instead of an evidence source label.
Regression tests cover started flow status, current flow routing, optional audit visibility, duration formatting, invalid intervals, and core pgg-plan routing.

## Changed Files

- `scripts/dashboard-history-model.test.mjs`
- `apps/dashboard/src/features/history/historyModel.ts`
- `apps/dashboard/src/shared/locale/dashboardLocale.ts`
- `packages/core/test/status-analysis.test.mjs`
- `apps/dashboard/public/dashboard-data.json`

## Verification

All pgg-code verification commands passed. See `pgg-code/verify.md`.
