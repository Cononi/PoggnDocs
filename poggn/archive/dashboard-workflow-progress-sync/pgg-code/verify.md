# pgg-code Verification

## Commands

| Command | Result | Notes |
|---|---:|---|
| `node --test scripts/dashboard-history-model.test.mjs` | PASS | 7/7 tests passed. |
| `pnpm test:core` | PASS | 65/65 tests passed. |
| `pnpm test:dashboard` | PASS | 7/7 tests passed. |
| `pnpm test` | PASS | core 65/65 and dashboard 7/7 passed. |
| `pnpm build:dashboard` | PASS | Vite build succeeded; chunk-size warning only. |
| `pnpm build` | PASS | core, cli, dashboard builds succeeded; dashboard chunk-size warning only. |
| `pnpm verify:version-history` | PASS | `{"status":"ok","preservedEntries":2,"appendedVersion":"0.1.2"}`. |
| `pnpm build:readme` | PASS | Docs generation first run completed. |
| `pnpm build:readme` | PASS | Docs generation second run completed; no README diff. |
| `PGG_HOME=/tmp/pgg-dashboard-progress-sync-home node packages/cli/dist/index.js dashboard --snapshot-only` | PASS | Generated `apps/dashboard/public/dashboard-data.json`; includes `dashboard-workflow-progress-sync`. |

## Snapshot Notes

The default global registry contained stale `/tmp` projects from previous tests. To avoid unrelated generated snapshot churn, the snapshot command used a temporary `PGG_HOME` containing only registered projects whose root directory still exists. The global registry was not edited.

## Missing Scripts

- `lint`: no root `package.json` script.
- dedicated `snapshot`: no root `package.json` script; dashboard snapshot generation used the existing CLI command from the approved plan.
