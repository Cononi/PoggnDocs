---
pgg:
  topic: "pgg-username-dashboard-workflow-refinement"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-27T13:14:00Z"
  archive_type: "feat"
  project_scope: "current-project"
---

# Spec: Token And Reference Regression

## Scope

QA와 optional audit에서 검증할 token, reference image, i18n, CLI/dashboard regression 기준.

## Required Verification

- Core/CLI:
  - username missing init gate
  - `pgg config username {이름}`
  - `pgg settings` username update
  - global username shared across project roots
- Dashboard data:
  - snapshot exposes global username
  - token totals deterministic fallback calculation
  - flow/file token aggregation
  - commit evidence parity with source
- Dashboard UI:
  - Workflow overview Recent Activity removed
  - Workflow Progress token heading/helper present
  - git/timeline reference checklist against `add-img/git.png`, `add-img/timeline.png`
  - project add Stepper for non-pgg/non-git folder
  - Sprint Progress dedupe
  - speed dial version removed and labels visible
  - sidebar username card visible
  - ko/en i18n switch coverage

## Evidence To Record Later

- `implementation/index.md` changed files and diff refs
- `token/report.md` token source and estimate audit
- `performance/report.md` dashboard build/render evidence
- `qa/report.md` CLI/core/dashboard verification result
- screenshot/manual visual notes for reference parity

## Acceptance Criteria

- Required audits are completed before QA pass.
- QA does not mark visual reference parity as pass without direct screenshot/manual evidence.
- Token numbers are reproducible from documented source/fallback rules.
