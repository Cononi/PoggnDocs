---
pgg:
  topic: "pgg-versioned-localized-commit-contract"
  stage: "qa"
  status: "done"
  skill: "pgg-qa"
  score: 98
  updated_at: "2026-04-24T03:46:44Z"
  archive_type: "feat"
  version_bump: "major"
  target_version: "1.0.0"
  project_scope: "current-project"
---
# QA Report

## Scope

Validate the versioned localized commit contract across runtime helpers, generated templates/docs, semver guidance, regression tests, refactor cleanup, and archive readiness.

## Audit Applicability

- [pgg-token]: [not_required] | The topic changes workflow/runtime contracts and generated docs, but no token-cost measurement is needed.
- [pgg-performance]: [not_required] | Git message formatting, docs, and tests are not performance-sensitive paths.

## Test Plan

- Confirm helper syntax after implementation/refactor.
- Confirm full workspace build succeeds.
- Confirm core regression tests cover versioned titles, legacy rejection, ko/en language validation, detailed body output, generated docs, and semver handoff.
- Confirm pgg gate accepts the topic for QA/archive.
- Confirm dirty baseline paths remain outside implementation/refactor commits.

## Test Evidence

- `bash -n .codex/sh/pgg-git-publish.sh`: pass
- `bash -n .codex/sh/pgg-stage-commit.sh`: pass
- `pnpm build`: pass
- `pnpm test`: pass, 36 tests passed
- `./.codex/sh/pgg-gate.sh pgg-qa pgg-versioned-localized-commit-contract`: pass
- `git status --short`: only pre-existing baseline paths remained before QA report creation: `apps/dashboard/public/dashboard-data.json`, `add-img/5.png`

## Review Notes

| Expert | Score | Core Judgment | Evidence Checked | Blocking |
|---|---:|---|---|---|
| QA/test engineer | 98 | Required regression coverage is present and passing for the new subject format, language validation, detailed body output, legacy rejection, generated assets, and major handoff behavior. | `pnpm test`, `packages/core/test/git-publish.test.mjs`, `packages/core/test/skill-generation.test.mjs`, `packages/core/test/version-history.test.mjs` | none |
| Code reviewer | 98 | Runtime and generated helper paths are aligned after refactor, with the checked-in publish helper using the same summary extraction pipeline as generated templates. | `.codex/sh/pgg-git-publish.sh`, `packages/core/src/templates.ts`, `implementation/diffs/016_UPDATE__codex_sh_pgg-git-publish_sh__refactor.diff` | none |
| SRE/operations engineer | 97 | Archive prerequisites are satisfied: state is ready for QA, version metadata is complete, baseline dirty paths are recorded, and publish metadata uses the versioned subject contract. | `state/current.md`, `state/dirty-worktree-baseline.txt`, `Git Publish Message`, `pgg-gate.sh` | none |

## Residual Risk

- `apps/dashboard/public/dashboard-data.json` and `add-img/5.png` are pre-existing dirty baseline paths and intentionally remain outside this topic's commits.
- Dashboard build still emits the existing chunk-size warning; it is unrelated to this workflow contract change.

## Decision

pass

## Git Publish Message

- title: feat: [1.0.0]versioned commit contract
- why: Commit subjects need convention, version, and project-language-aware wording so task and release history stays understandable across generated pgg projects.
- footer: Refs: pgg-versioned-localized-commit-contract
