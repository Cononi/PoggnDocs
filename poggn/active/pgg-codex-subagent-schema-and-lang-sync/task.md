---
pgg:
  topic: "pgg-codex-subagent-schema-and-lang-sync"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-27T01:46:29Z"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "2.3.3"
  short_name: "codex-sync"
  project_scope: "current-project"
---

# Task

## Task List

| ID | Spec | Task | Depends On | Done When |
|---|---|---|---|---|
| T1 | S1 | Rewrite generated Codex role TOML templates to use only official custom agent fields and move pgg role metadata into `developer_instructions`. | proposal, S1 | Generated role files include `name`, `description`, `developer_instructions` and no unsupported top-level pgg metadata fields. |
| T2 | S2 | Fix `.codex/agents/main.toml` handling and routing references so pgg routing remains available without malformed Codex agent parsing. | T1, S2 | No generated file under `.codex/agents/` contains unsupported routing manifest fields; workflow docs/state-pack still expose the two-agent routing matrix. |
| T3 | S3 | Localize generated docs, skills, and agent descriptions/instructions for both `ko` and `en`. | T1, T2, S3 | `pgg init`, `pgg update`, and `pgg lang` generated text follows the manifest language for relevant managed documents. |
| T4 | S4 | Refresh current checked-in generated assets, dist files, and manifest-managed checksums to match the new templates. | T1, T2, T3, S4 | Current `.codex/agents/*.toml` no longer trigger the reported parser warnings and `.pgg/project.json` managed file records are consistent. |
| T5 | S5 | Add regression tests for custom agent schema validity, routing preservation, and language switching. | T1, T2, T3, T4, S5 | `pnpm build` and `pnpm test` pass with targeted coverage for the reported warnings and lang sync behavior. |

## Notes

- T1 must keep role intent, input limits, output contract, and forbidden actions in `developer_instructions` rather than unsupported TOML keys.
- T2 must update any references that currently treat `.codex/agents/main.toml` as a routing manifest if that file is removed, renamed, or converted.
- T3 should cover generated skill files where English entries still omit newer Korean metadata such as `version_bump`, `target_version`, branch naming, or audit applicability wording.
- T4 must not revert unrelated dirty files recorded in the topic baseline.
- T5 should validate generated content through public project sync APIs instead of brittle string-only assumptions where possible.

## Audit Applicability

- [pgg-token]: [not_required] | No token audit is required for schema and localization repair.
- [pgg-performance]: [not_required] | No performance audit is required for generated config/docs and tests.
