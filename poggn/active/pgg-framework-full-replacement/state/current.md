# Current State

## Topic

pgg-framework-full-replacement

## Current Stage

pgg-refactor

## Goal

기존 PGG workflow, generated docs 구조, CLI/public API routing, dashboard workflow model, git lifecycle, token accounting, QA 계약을 신규 TypeScript Skill Framework 기준으로 전면 교체한다.

## Version

- currentVersion: `3.2.0`
- targetVersion: `4.0.0`
- bumpType: `major`
- convention: `feat`
- versionSource: `poggn/version-history.ndjson latest archived version`

## Git

- pggGit: `on`
- baseBranch: `release/3.2.0-dashboard-view`
- workingBranch: `ai/feat/4.0.0-framework-replacement`
- releaseBranch: `release/4.0.0-framework-replacement`

## Artifacts

- `pgg-add/requirements.md`
- `pgg-add/acceptance-criteria.md`
- `pgg-plan/plan.md`
- `pgg-plan/task.md`
- `pgg-plan/spec/core/source-of-truth.md`
- `pgg-plan/spec/docs/generated-docs.md`
- `pgg-plan/spec/cli/public-api-routing.md`
- `pgg-plan/spec/dashboard/workflow-model.md`
- `pgg-plan/spec/git/lifecycle.md`
- `pgg-plan/spec/qa/verification-matrix.md`
- `pgg-plan/reviews/plan.review.md`
- `pgg-plan/reviews/task.review.md`
- `pgg-code/dirty-worktree-baseline.txt`
- `pgg-code/task-results.md`
- `pgg-code/verify.md`
- `pgg-code/reviews/review-1-spec-compliance.md`
- `pgg-code/reviews/review-2-code-quality.md`
- `pgg-refactor/report.md`
- `pgg-refactor/before-after.md`
- `pgg-refactor/diff-inspection.md`
- `pgg-refactor/reviews/behavior-preservation.review.md`
- `pgg-refactor/reviews/structure-quality.review.md`
- `proposal.md`
- `state.json`
- `metrics/token-usage.jsonl`

## Next

`pgg-qa`에서 source of truth, generated docs, versioning, git lifecycle, completion message, token accounting, technical checks, archive/release readiness를 최종 검증한다.
