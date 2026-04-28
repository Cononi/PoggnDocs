---
pgg:
  topic: "dashboard-workflow-timing-sync"
  stage: "refactor"
  status: "done"
  skill: "pgg-refactor"
  updated_at: "2026-04-28T15:20:00Z"
  archive_type: "fix"
  project_scope: "current-project"
---

# pgg-refactor Report

## Status

PASS

## Refactor Target

- `apps/dashboard/src/features/history/historyModel.ts`

## Before Behavior Definition

- `buildWorkflowSteps` marks started flow evidence as current instead of pending.
- `buildTimelineRows` renders workflow elapsed duration from flow-scoped start and completion timestamps.
- invalid, missing, or negative workflow intervals render `workflowDurationUnavailable`.
- optional audit steps stay hidden unless execution evidence exists.
- completed flow token totals remain scoped to the completed flow.

## Refactor Summary

- `topicHasFlowArtifactEvidence` now delegates artifact and workflow-node matching to `flowFiles` and `flowNodes`.
- `formatWorkflowDuration` now separates interval parsing/calculation from locale-specific duration formatting.
- no Acceptance Criteria, public API, locale keys, fixtures, generated docs, or snapshot behavior changed.

## Required Improvement Categories

- structure improvement: shared flow evidence helpers are reused instead of repeating matching logic.
- duplication removal: file/node flow matching duplication was removed from `topicHasFlowArtifactEvidence`.
- performance impact: neutral; no algorithmic expansion, no new IO, and no bundle-visible dependency added.
- readability separation: duration validation/calculation and duration text formatting are separate functions.
- responsibility separation: flow evidence matching, duration parts calculation, and locale rendering each have a narrower responsibility.

## Verification

| Command | Before | After | Result |
|---|---:|---:|---|
| `node --test scripts/dashboard-history-model.test.mjs` | PASS, 11/11, 1755.549ms | PASS, 11/11, 1649.924ms | same pass set |
| `pnpm test:dashboard` | PASS, 11/11, 1682.268ms | PASS, 11/11, 1625.106ms | same pass set |
| `pnpm test` | not rerun as before baseline in this flow | PASS, core 67/67 and dashboard 11/11 | additional regression check |
| `pnpm build:dashboard` | pgg-performance baseline PASS | PASS, Vite built in 1.38s | build/typecheck pass |
| `pnpm build` | pgg-performance baseline PASS | PASS, Vite built in 1.33s | full build pass |
| `pnpm build:readme` | pgg-code baseline PASS twice | PASS twice | generated docs stable |

## Behavior Preservation Evidence

- before and after dashboard history model tests covered the same 11 cases and all passed.
- before and after `pnpm test:dashboard` ran the same test file and all 11 cases passed.
- full `pnpm test` remained green after the refactor.
- build and generated docs completed without tracked generated Markdown edits.

## pgg-performance Need

- not required next.
- this refactor does not introduce caching, concurrency, file processing, bundle splitting, or algorithmic behavior changes.
- pgg-performance already passed for this topic before refactor, and after build/test timings remained within the same small range.

## Next Flow

`pgg-qa`
