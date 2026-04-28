---
pgg:
  topic: "dashboard-workflow-progress-sync"
  stage: "task"
  status: "approved"
  skill: "pgg-plan"
  score: 94
  updated_at: "2026-04-28T13:30:51Z"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "4.0.1"
  short_name: "dashboard-progress-sync"
  working_branch: "ai/fix/4.0.1-dashboard-progress-sync"
  release_branch: "release/4.0.1-dashboard-progress-sync"
  project_scope: "current-project"
---

# Task

## T1. Core status evaluator 신규 stage/status 계약 테스트

- Files:
  - `packages/core/test/status-analysis.test.mjs`
- Code instructions:
  - Add a fixture topic whose `state/current.md` has `## Current Stage` value `pgg-add`.
  - Its `proposal.md` frontmatter status must be `approved`.
  - Include `pgg-add/requirements.md`, `pgg-add/acceptance-criteria.md`, `reviews/proposal.review.md`, and `state/history.ndjson` with verified pgg-add completion.
  - Assert `analyzeProjectStatus` returns `currentStage: "proposal"`, `progressStatus: "ready"`, `nextWorkflow: "pgg-plan"` for that topic.
  - Add a fixture with `Audit Applicability` line `- [pgg-performance]: required | measurement needed` and assert parser causes next workflow `pgg-performance` when report is absent.
- Verification:
  - Run `pnpm test:core`.
- Expected result:
  - New tests fail before implementation if core only accepts `reviewed` or only parses backtick audit format.
- Failure checks:
  - Check `normalizeStageName`, `resolveMissingArtifactRecommendation`, and `parseAuditApplicability` in `packages/core/src/index.ts`.

## T2. Dashboard workflow model regression tests

- Files:
  - `scripts/dashboard-history-model.test.mjs`
- Code instructions:
  - Add a helper that builds active topics with configurable `stage`, `files`, `workflow.nodes`, and `historyEvents`.
  - Add test: plan flow with only `stage-started`/`stage-progress` events must not have status `completed`.
  - Add test: plan flow with verified `stage-completed` must have status `completed`.
  - Add test: plan flow with verified completion followed by `requirements-added` must have status `updating`.
  - Add test: `pgg-performance` Audit Applicability text in files without `pgg-performance/report.md`, performance history event, or workflow node must not add a `performance` step.
- Verification:
  - Run `node --test scripts/dashboard-history-model.test.mjs`.
- Expected result:
  - Index-only completion regression is captured by a failing test before dashboard model implementation.
- Failure checks:
  - Check `buildWorkflowSteps`, `visibleWorkflowFlows`, `flowHasFullCompletionEvidence`, and `flowActiveTimestamp` in `apps/dashboard/src/features/history/historyModel.ts`.

## T3. Core status evaluator implementation

- Files:
  - `packages/core/src/index.ts`
- Code instructions:
  - Extend `normalizeStageName` to accept canonical Skill IDs:
    - `pgg-add` and `add` map to `proposal`.
    - `pgg-plan` maps to `plan` unless a task artifact exists; keep existing `task` behavior.
    - `pgg-code` and `code` map to `implementation`.
    - `pgg-refactor`, `pgg-token`, `pgg-performance`, `pgg-qa` map to their existing stages.
  - Replace the strict proposal gate check `proposalStatus !== "reviewed"` with an approval predicate that accepts `reviewed`, `approved`, `done`, and `pass`.
  - Update the missing artifact reason text from `proposal frontmatter status=reviewed` to `proposal approval status`.
  - Extend `parseAuditApplicability` to parse both supported formats:
    - `- \`pgg-performance\`: \`required\` | reason`
    - `- [pgg-performance]: required | reason`
  - Preserve `pgg-performanc` alias normalization.
- Verification:
  - Run `pnpm test:core`.
- Expected result:
  - Core status summary treats new pgg-add active topics as ready for pgg-plan after approved requirements.
- Failure checks:
  - If older tests fail, verify legacy `proposal`/`reviewed` fixtures still pass.

## T4. Dashboard workflow model implementation

- Files:
  - `apps/dashboard/src/features/history/historyModel.ts`
- Code instructions:
  - Ensure `buildWorkflowSteps` does not mark a flow `completed` only because its index is before the current stage.
  - Completion must come from one of:
    - trusted completion event: `stage-commit`, `version-recorded`, `archived`, or verified/final/gate `stage-completed`
    - trusted workflow node completion
    - archive bucket completion for non-Done flows
    - Done flow release completion
  - Keep `stage-started` and `stage-progress` as active/current evidence only.
  - If completion evidence is followed by unresolved `requirements-added`, `updated`, or `revised` event for the same flow, status must be `updating`.
  - Keep optional audit visibility tied to actual execution evidence, not Audit Applicability text.
- Verification:
  - Run `node --test scripts/dashboard-history-model.test.mjs`.
- Expected result:
  - Overview/detail workflow steps align with STATE-CONTRACT status meanings.
- Failure checks:
  - Check `latestUnresolvedFlowIndex`, `flowUpdatingTimestamp`, and `visibleWorkflowFlows` if `updating` priority is wrong.

## T5. Dashboard snapshot regeneration

- Files:
  - `apps/dashboard/public/dashboard-data.json`
- Code instructions:
  - After T3 and T4 pass, run `node packages/cli/dist/index.js dashboard --snapshot-only`.
  - Review the diff to confirm it is generated snapshot output and includes active topic `dashboard-workflow-progress-sync`.
  - Do not hand-edit `apps/dashboard/public/dashboard-data.json`.
- Verification:
  - Run `pnpm build:dashboard`.
- Expected result:
  - Dashboard can load regenerated data with the new active topic and status model.
- Failure checks:
  - If snapshot generation fails, run `pnpm build` first and retry CLI from `packages/cli/dist/index.js`.

## T6. Version verification task

- Files:
  - `poggn/version-history.ndjson`
  - `poggn/active/dashboard-workflow-progress-sync/state.json`
- Code instructions:
  - Do not edit `package.json` version because `versionSource` is `poggn/version-history.ndjson latest archived version`.
  - Record in implementation artifacts that targetVersion `4.0.1` will be written by pgg-qa archive.
  - Verify `poggn/version-history.ndjson` latest archived version remains `4.0.0` before QA and will append `4.0.1` only on archive.
- Verification:
  - Run `pnpm verify:version-history`.
- Expected result:
  - Version history preservation passes and no premature ledger append happens during pgg-code.
- Failure checks:
  - If package version changes appear, revert that unrelated version edit before pgg-code commit.

## T7. Full verification

- Files:
  - `packages/core/src/index.ts`
  - `apps/dashboard/src/features/history/historyModel.ts`
  - `packages/core/test/status-analysis.test.mjs`
  - `scripts/dashboard-history-model.test.mjs`
  - `apps/dashboard/public/dashboard-data.json`
- Code instructions:
  - Run commands in this order:
    1. `node --test scripts/dashboard-history-model.test.mjs`
    2. `pnpm test:core`
    3. `pnpm test:dashboard`
    4. `pnpm test`
    5. `pnpm build:dashboard`
    6. `pnpm build`
    7. `pnpm verify:version-history`
  - Record command results in `poggn/active/dashboard-workflow-progress-sync/pgg-code/verify.md`.
- Expected result:
  - All commands pass. Vite chunk-size warnings are acceptable if build exits 0.
- Failure checks:
  - If core and dashboard disagree, compare `TopicSummary.historyEvents` from `buildDashboardSnapshot` with `buildWorkflowSteps` fixture input.

## Audit Applicability

- [pgg-token]: not_required | task scope does not change token accounting or handoff structure.
- [pgg-performance]: not_required | no declared performance target and no runtime hot path.
