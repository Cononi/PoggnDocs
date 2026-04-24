---
pgg:
  topic: "pgg-versioned-localized-commit-contract"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 97
  updated_at: "2026-04-24T01:11:41Z"
  archive_type: "feat"
  version_bump: "major"
  target_version: "1.0.0"
  short_name: "commit-contract"
  project_scope: "current-project"
---

# Task

## Task List

| ID | Spec | Task | Depends On | Done When |
|---|---|---|---|---|
| T1 | S1 | Update stage, QA completion, and publish helper commit message generation/validation to canonical `{convention}: [{version}]{commit message}` subjects and detailed bodies. | proposal, S1 | Helpers emit and validate versioned subjects, write detailed body content, preserve dirty baseline and branch recovery behavior |
| T2 | S2 | Add `pgg lang` aware commit message language handling for helper-generated and helper-validated commit text. | T1, S2 | Korean projects require Korean message text, English projects require English message text, and footer/reference text remains unaffected |
| T3 | S3 | Update root and generated workflow docs, skills, README, and templates to describe the new commit contract and body detail requirements. | T1, S3 | No generated/root docs still describe `<archive_type>: <summary>` as canonical for new commits |
| T4 | S4 | Update convention and semver guidance so `feat|fix|docs|refactor|chore|remove` are clearly separated and breaking existing usage requires `major`. | T3, S4 | Proposal/state/readme surfaces explain convention selection and major/minor/patch decisions consistently |
| T5 | S5 | Add regression proof for versioned localized commits, detailed bodies, legacy-format rejection, and generated asset sync. | T1, T2, T3, T4, S5 | Test suite covers stage commit, publish commit, ko/en language behavior, docs/template output, and major bump guidance |

## Notes

- T1 should avoid changing task cadence or publish branch lifecycle.
- T2 should validate the commit message text portion, not issue footers such as `Refs: ...`.
- T3 should update both checked-in project docs and generator-managed strings.
- T4 should keep `archive_type` as the change category and `version_bump` as the semver impact.
- T5 should include negative coverage for the legacy `<archive_type>: <summary>` form where validation applies.

## Audit Applicability

- [pgg-token]: [not_required] | Token audit is not needed for commit governance implementation.
- [pgg-performance]: [not_required] | Performance audit is not needed for git message formatting and docs updates.
