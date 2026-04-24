---
pgg:
  topic: "pgg-versioned-localized-commit-contract"
  stage: "review"
  status: "reviewed"
  score: 97
  updated_at: "2026-04-24T03:06:39Z"
---

# code.review

## Expert Notes

| Expert | Score | Summary | Evidence Checked | Blocking |
|---|---:|---|---|---|
| Senior backend engineer | 97 | Runtime helpers now derive versioned commit titles from proposal/archive metadata, keep dirty-worktree and branch recovery behavior, and add deterministic ko/en message validation. | `.codex/sh/pgg-stage-commit.sh`, `.codex/sh/pgg-git-publish.sh`, `packages/core/src/templates.ts`, `pnpm test` | none |
| Tech lead | 97 | The implementation keeps `archive_type` as convention and `version_bump` as semver impact while moving documentation and generated templates to the same contract. | `.codex/add/WOKR-FLOW.md`, `.codex/add/STATE-CONTRACT.md`, `README.md`, `packages/core/src/readme.ts` | none |
| Code reviewer | 98 | Regression coverage now includes versioned subjects, detailed body output, legacy title rejection, Korean/English language checks, generated asset assertions, and major handoff title updates. | `packages/core/test/git-publish.test.mjs`, `packages/core/test/skill-generation.test.mjs`, `packages/core/test/version-history.test.mjs`, `pnpm build`, `pnpm test` | none |

## Mandatory Criteria Check

- Single responsibility: helper changes keep title generation, validation, and body writing in distinct functions.
- Readability: generated docs and tests use the same `{convention}: [{version}]{commit message}` wording.
- Testability: new tests cover positive and negative runtime paths plus generated asset assertions.
- Explicit exceptions: invalid title/language/body cases return `commit_message_invalid` instead of silently publishing.

## Decision

Implementation is approved for `pgg-refactor`.
