---
pgg:
  topic: "pgg-codex-subagent-schema-and-lang-sync"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-27T01:46:29Z"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "2.3.3"
  short_name: "codex-sync"
  project_scope: "current-project"
state:
  summary: "Codex custom agent schema, pgg routing metadata, generated language sync, current asset migration, and regression proof are split into implementation-ready specs."
  next: "pgg-code"
---

# Plan

## Goal

Fix pgg-generated Codex subagent assets so Codex can load custom agents without malformed-role warnings, while keeping pgg two-agent routing documented and making generated docs/skills/agent instructions follow `pgg lang=ko|en` during init, update, and lang changes.

## Confirmed Scope

- Align `.codex/agents/*.toml` generation with the official Codex custom agent schema from `https://developers.openai.com/codex/subagents`.
- Ensure each custom agent file has `name`, `description`, and `developer_instructions`.
- Remove pgg-only `category`, `activation`, `roles`, `flows`, and similar unsupported fields from files Codex loads as standalone custom agents.
- Preserve pgg's exact two-primary-agent workflow routing and support-agent opt-in rule in generated workflow docs and handoff output.
- Decide how `.codex/agents/main.toml` is handled so it no longer triggers malformed agent role parsing.
- Make generated document and agent text switch consistently for `language=ko` and `language=en`.
- Update source templates, built dist output, checked-in generated files, and regression tests together.

## Spec Boundaries

| ID | Spec | Purpose | Main Surfaces |
|---|---|---|---|
| S1 | `spec/agents/codex-custom-agent-schema.md` | Define valid Codex custom agent TOML output for all pgg role files. | `packages/core/src/templates.ts`, `.codex/agents/*.toml`, `packages/core/dist/templates.js` |
| S2 | `spec/routing/pgg-routing-metadata-preservation.md` | Preserve pgg routing without putting unsupported manifest fields in Codex agent files. | `.codex/add/EXPERT-ROUTING.md`, `.codex/add/WOKR-FLOW.md`, `.codex/add/STATE-CONTRACT.md`, `.codex/sh/pgg-state-pack.sh` |
| S3 | `spec/i18n/generated-document-language-sync.md` | Define ko/en language behavior for generated docs, skills, and agent instructions. | `packages/core/src/templates.ts`, `.codex/skills/*.md`, `AGENTS.md`, `README.md`, generated agent descriptions/instructions |
| S4 | `spec/migration/current-generated-agent-assets.md` | Bring the current repo's generated files and manifest records into the new contract. | `.codex/agents/*.toml`, `.pgg/project.json`, managed file checksums, dist output |
| S5 | `spec/qa/subagent-schema-and-lang-regression.md` | Define regression proof for schema validity, routing preservation, and language sync. | `packages/core/test/skill-generation.test.mjs`, `pnpm test`, `pnpm build` |

## Implementation Order

1. Implement S1 first so the generator emits valid custom agent files.
2. Resolve S2 before updating current files, so `.codex/agents/main.toml` has one clear destination or valid schema.
3. Implement S3 language sync in templates before refreshing generated files.
4. Apply S4 to the checked-in generated assets and manifest records after template behavior is stable.
5. Add S5 tests and run build/test verification after implementation.

## Risk Controls

- Do not add new pgg workflow stages or change the two-primary-agent matrix.
- Do not rely on unsupported Codex TOML fields, even if they are useful pgg metadata.
- Do not move user-owned or unmanaged agent files outside current-project generated assets.
- Do not touch user global `~/.codex` configuration.
- Preserve `.codex/config.toml` `[agents] max_threads=4` and `max_depth=1`.
- Keep update behavior compatible with existing managed-file backup/conflict handling.
- If `.codex/agents/main.toml` is removed or relocated, update all generated references such as state-pack `agent_routing_ref`.

## Audit Applicability

- [pgg-token]: [not_required] | The work repairs schema and localization of generated assets, without introducing a token-budget or handoff-size change.
- [pgg-performance]: [not_required] | The work affects generated config/docs/tests rather than runtime performance paths.

## Validation Strategy

- Run the trusted pgg gate for `pgg-code` after plan artifacts are written.
- Later implementation verification should run `pnpm build` so `dist` output matches source templates.
- Later implementation verification should run `pnpm test`, with focused assertions in `packages/core/test/skill-generation.test.mjs`.
- Add tests that generated agent TOML files do not contain `category`, `purpose`, `when_to_use`, `activation`, `roles`, or `flows` as top-level schema fields.
- Add tests that generated role TOML contains `name`, `description`, and `developer_instructions`.
- Add tests that Korean and English initialization/language update output differs in user-facing docs and agent instructions as expected.

## Handoff

Next stage: `pgg-code`

Use `state/current.md` first, then the spec files listed in this plan.
