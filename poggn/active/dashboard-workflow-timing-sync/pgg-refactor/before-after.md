---
pgg:
  topic: "dashboard-workflow-timing-sync"
  stage: "refactor"
  artifact: "before-after"
  updated_at: "2026-04-28T15:20:00Z"
---

# Before / After Comparison

## Baseline Commands

| Command | Before Result | After Result | Comparison |
|---|---|---|---|
| `node --test scripts/dashboard-history-model.test.mjs` | PASS, 11/11, duration_ms `1755.549339` | PASS, 11/11, duration_ms `1649.923763` | equivalent observable behavior |
| `pnpm test:dashboard` | PASS, 11/11, duration_ms `1682.268401` | PASS, 11/11, duration_ms `1625.106290` | equivalent observable behavior |

## Additional After Checks

| Command | Result | Notes |
|---|---|---|
| `pnpm test` | PASS | core 67/67 and dashboard 11/11 |
| `pnpm build:dashboard` | PASS | Vite chunk-size warning only; existing warning class |
| `pnpm build` | PASS | core, dashboard, CLI build completed; Vite chunk-size warning only |
| `pnpm build:readme` | PASS twice | generated docs stable |

## Observable Behavior Contract

- started workflow evidence still maps to current workflow state.
- completed workflow evidence still maps to completed workflow state.
- timeline duration still uses start/end elapsed interval.
- invalid duration intervals still use the unavailable fallback.
- optional audit visibility still requires execution evidence.

## Result

PASS: before and after behavior is equivalent for the covered dashboard workflow state and duration fixtures.
