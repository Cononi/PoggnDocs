# Subagent Schema And Language Regression

## Purpose

Define the test and verification evidence required before QA can pass this topic.

## Required Tests

- Add or update `packages/core/test/skill-generation.test.mjs` coverage for generated Codex agent role files.
- Assert each generated role file includes `name`, `description`, and `developer_instructions`.
- Assert generated role files do not include unsupported top-level pgg metadata fields such as `category`.
- Assert `.codex/agents/main.toml` either does not exist as a managed invalid manifest or is valid according to the chosen S2 design.
- Assert routing references and state-pack output still expose the expected pgg primary agents.
- Assert Korean and English project generation produce language-appropriate workflow docs, skills, and agent instructions.
- Assert `updateProject` preserves language-specific generated output.
- Assert `updateProjectLanguage` rewrites language-sensitive managed output.

## Verification Commands

- `pnpm build`
- `pnpm test`
- `./.codex/sh/pgg-gate.sh pgg-code pgg-codex-subagent-schema-and-lang-sync`

## Acceptance

- All required commands pass or a concrete blocker is recorded.
- Tests fail against the old malformed agent template behavior.
- Tests prove the original reported warnings cannot be reintroduced by `pgg init` or `pgg update`.
