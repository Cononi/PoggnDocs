---
pgg:
  topic: "pgg-versioned-localized-commit-contract"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 97
  updated_at: "2026-04-24T01:11:41Z"
  archive_type: "feat"
  version_bump: "major"
  target_version: "1.0.0"
  short_name: "commit-contract"
  project_scope: "current-project"
state:
  summary: "Versioned localized commit governance is split into runtime, language, generated-doc, semver, and QA regression specs."
  next: "pgg-code"
---

# Plan

## Goal

Change pgg commit governance so automatic task, QA completion, and publish commits use `{convention}: [{version}]{commit message}`, respect `pgg lang`, include detailed bodies, and carry the same convention/semver rules into generated assets for future projects.

## Confirmed Scope

- Keep task-by-task commit cadence for `pgg-code` and `pgg-refactor`.
- Apply the new subject contract to stage-local commits, QA completion commits, and publish commits.
- Use `pgg lang=ko` for Korean commit text and `pgg lang=en` for English commit text.
- Require detailed commit bodies that explain concrete changed content.
- Keep allowed conventions limited to `feat`, `fix`, `docs`, `refactor`, `chore`, and `remove`.
- Clarify major bump selection: major is required when existing user-facing usage is broken.
- Update runtime helpers, generated templates/docs, root workflow docs, skills, README, and tests.

## Spec Boundaries

| ID | Spec | Purpose | Main Surfaces |
|---|---|---|---|
| S1 | `spec/git/versioned-commit-subject-and-body.md` | Define helper behavior for versioned subjects and detailed commit bodies. | `.codex/sh/pgg-stage-commit.sh`, `.codex/sh/pgg-git-publish.sh`, `.codex/sh/pgg-archive.sh`, generated helper templates |
| S2 | `spec/i18n/commit-message-language-contract.md` | Define how commit message text follows `pgg lang=ko|en`. | `.pgg/project.json`, helper validation, generated docs, tests |
| S3 | `spec/docs/generated-workflow-commit-contract.md` | Align root docs, generated docs, skills, and templates with the new contract. | `.codex/add/*.md`, `.codex/skills/*.md`, `README.md`, `packages/core/src/templates.ts`, `packages/core/src/readme.ts` |
| S4 | `spec/version/convention-and-major-bump-contract.md` | Clarify convention selection and major/minor/patch decisions. | proposal/state templates, README, version docs, `pgg-new-topic` guidance |
| S5 | `spec/qa/regression-proof-for-versioned-localized-commits.md` | Define acceptance checks and regression tests. | `packages/core/test/*.mjs`, helper smoke tests, generated asset assertions |

## Implementation Order

1. Implement S1 first so helpers share a single subject/body contract.
2. Add S2 language handling before updating docs, so generated wording describes actual runtime behavior.
3. Update S3 and S4 together across root and generated assets to avoid old/new contract drift.
4. Add S5 tests after runtime and docs changes so each assertion proves an implemented behavior.
5. Record implementation diffs and review evidence before refactor.

## Risk Controls

- Keep command signatures backward-compatible where feasible; if arguments stay the same, only generated subject/body formatting changes.
- Do not loosen dirty-worktree baseline handling, branch recovery, or empty-change commit protections.
- Treat the old `<archive_type>: <summary>` subject as legacy and reject it where helper validation expects the new canonical form.
- Avoid heuristic language checks that block valid footer/reference text; language validation applies to the commit message text portion, not `Refs:` footers.
- Preserve version ledger append-only behavior and existing `version_bump` calculation.

## Audit Applicability

- [pgg-token]: [not_required] | The change updates workflow/runtime contracts and generated docs, but does not require measuring token cost.
- [pgg-performance]: [not_required] | Git message formatting and docs generation are not performance-sensitive paths.

## Validation Strategy

- Run the trusted pgg gate for `pgg-code` after plan artifacts are written.
- Use existing package tests as the primary regression surface: `pnpm test` in later stages when implementation exists.
- Add helper-level tests for stage commits and publish commits using the new subject contract.
- Add generated asset assertions for both Korean and English wording.
- Add semver/convention tests or assertions proving `major` can be selected for breaking user workflow changes independently of convention.

## Handoff

Next stage: `pgg-code`

Use [state/current.md](/config/workspace/poggn-ai/poggn/active/pgg-versioned-localized-commit-contract/state/current.md) first, then the spec files listed above.
