---
pgg:
  topic: "dashboard-workflow-timing-sync"
  stage: "code"
  status: "done"
  skill: "pgg-code"
  updated_at: "2026-04-28T15:04:00Z"
  archive_type: "fix"
  project_scope: "current-project"
---

# pgg-code Verify

## Verification Results

| Command | Result | Notes |
|---|---|---|
| `node --test scripts/dashboard-history-model.test.mjs` | PASS | 11/11 tests, duration 1.621s after implementation, 1.684s via `pnpm test:dashboard`, 1.710s via `pnpm test`. |
| `pnpm test:core` | PASS | 67/67 tests, duration 30.353s first run, 29.671s via `pnpm test`. |
| `pnpm test:dashboard` | PASS | 11/11 tests, duration 1.684s. |
| `pnpm test` | PASS | core 67/67 and dashboard 11/11. |
| `pnpm build:dashboard` | PASS | Vite build completed in 1.35s before snapshot and 1.22s during full build; chunk-size warning only. |
| `pnpm build` | PASS | core, dashboard, CLI build completed; dashboard chunk-size warning only. |
| `pnpm verify:version-history` | PASS | `{"status":"ok","preservedEntries":2,"appendedVersion":"0.1.2"}` |
| `pnpm build:readme` | PASS | Ran twice; no tracked generated Markdown diff remained. |

## Failure Log Analysis

- Initial `node --test scripts/dashboard-history-model.test.mjs` failed on timeline duration fixtures because `buildTimelineRows` used `completedAt.source` as the displayed duration.
- The failing actual value was `state/history.ndjson:stage-completed`; expected values were `7m` and unavailable fallback.
- Fix: added `formatWorkflowDuration` and replaced the timeline duration source label with elapsed interval formatting.
- One dashboard test assertion initially used `assert.deepEqual` against an Array from a VM context; this produced a prototype mismatch despite equal contents. The assertion now compares the joined ids string.
- Core routing fixtures passed without source changes; no core implementation patch was required.

## Performance Baseline

- `node --test scripts/dashboard-history-model.test.mjs`: 1.621s implementation run, 1.684s dashboard script run.
- `pnpm test:dashboard`: 1.684s.
- `pnpm build:dashboard`: 1.35s before snapshot, 1.22s during full build.
- `pnpm test`: core 29.671s plus dashboard 1.710s.
- pgg-performance remains required because the user explicitly reported excessive workflow time.

## Version Verification

- package.json was not changed because versionSource is `poggn/version-history.ndjson latest archived version`.
- targetVersion `4.0.2` remains pending for pgg-qa archive.
- `pnpm verify:version-history` passed.
