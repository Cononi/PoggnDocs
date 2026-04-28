# Spec: Core Status Evaluator Sync

## Purpose

Make `analyzeProjectStatus` understand the new PGG Skill Framework vocabulary while preserving legacy topic compatibility.

## Stage Normalization

| Input | Normalized stage |
|---|---|
| `pgg-add`, `add`, `proposal` | `proposal` |
| `pgg-plan`, `plan` | `plan` |
| `task` | `task` |
| `pgg-code`, `code`, `implementation` | `implementation` |
| `pgg-refactor`, `refactor` | `refactor` |
| `pgg-token`, `token` | `token` |
| `pgg-performance`, `performance` | `performance` |
| `pgg-qa`, `qa` | `qa` |

## Proposal Approval

`resolveMissingArtifactRecommendation` must accept proposal status values `reviewed`, `approved`, `done`, and `pass` as approved proposal evidence.
The old `reviewed` value remains valid for archived legacy topics.

## Audit Applicability Parsing

The parser must support both current generated Markdown styles:

- `- \`pgg-performance\`: \`required\` | reason`
- `- [pgg-performance]: required | reason`

`pgg-performanc` remains a compatibility alias for `pgg-performance`.

## Non-Goals

- Do not change archive branch lifecycle.
- Do not force optional audits into dashboard progress without execution evidence.
- Do not append `poggn/version-history.ndjson` during pgg-code.
