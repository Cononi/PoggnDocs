# Spec: Progress Fixture Coverage

## Required Dashboard Fixtures

1. plan flow has `stage-started` and `stage-progress` only.
   - Expected: `plan` is `current` or non-completed, never `completed`.
2. plan flow has verified `stage-completed`.
   - Expected: `plan` is `completed`.
3. plan flow has verified `stage-completed`, then `requirements-added`.
   - Expected: `plan` is `updating`.
4. performance audit is required in text but has no audit event/report/node.
   - Expected: no `performance` workflow step.

## Required Core Fixtures

1. active topic with `Current Stage: pgg-add`, proposal status `approved`, pgg-add artifacts, and proposal review.
   - Expected: status analysis recommends `pgg-plan`.
2. active topic with bracket-style Audit Applicability `- [pgg-performance]: required | reason` and no performance report.
   - Expected: status analysis recommends `pgg-performance`.
3. legacy topic with proposal status `reviewed`.
   - Expected: existing status analysis tests still pass.

## Verification Commands

- `node --test scripts/dashboard-history-model.test.mjs`
- `pnpm test:core`
- `pnpm test:dashboard`
- `pnpm test`
- `pnpm build:dashboard`
- `pnpm build`
- `pnpm verify:version-history`
