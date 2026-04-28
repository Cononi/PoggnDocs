---
pgg:
  topic: "dashboard-workflow-timing-sync"
  stage: "plan"
  status: "approved"
  skill: "pgg-plan"
  updated_at: "2026-04-28T14:28:00Z"
reactflow:
  node_id: "spec-testing-regression-fixtures"
  node_type: "spec"
  label: "regression fixtures"
---

# Spec: Regression Fixtures

## Dashboard Fixtures

- started flow current:
  - add completed at `12:00`
  - plan started at `12:01`
  - expected add `completed`, plan `current`
- duration elapsed:
  - plan started at `12:00`
  - plan completed at `12:07`
  - expected timeline duration `7m`/`7분`
- source label prevention:
  - same duration fixture
  - expected duration does not include `state/history.ndjson`, `recorded`, `release`
- optional audit hidden:
  - state/current.md has `- [pgg-performance]: required | measurement needed`
  - no performance event/report/node
  - expected no performance step

## Core Fixtures

- complete pgg-plan:
  - proposal approved
  - all pgg-plan artifacts present
  - pgg-plan history started/progress exists
  - expected `ready`, `pgg-code`
- incomplete pgg-plan:
  - proposal approved
  - pgg-plan started
  - missing task review or spec
  - expected `ready` or `in_progress` with `pgg-plan`, according to existing recommendation contract

## Commands

- `node --test scripts/dashboard-history-model.test.mjs`
- `pnpm test:core`
- `pnpm test:dashboard`
- `pnpm test`
