# S6: Codex Schema And Compatibility Verification

## Purpose

Ensure implementation follows current Codex behavior instead of inventing unsupported config keys.

## Evidence To Record

- `codex --help` config section.
- `codex features list` entries for `multi_agent`, `multi_agent_v2`, and `child_agents_md`.
- Official OpenAI Codex AGENTS.md guidance for hierarchical project instructions.
- Official or primary-source evidence for project-local agent role support if used.

## Compatibility Rules

- `features.multi_agent` can be used because the local CLI reports it as a known stable feature.
- `multi_agent_v2` must not be treated as default behavior while local CLI reports it under development.
- `child_agents_md` must remain opt-in unless implementation explicitly supports it.
- If custom agent role files are not consumed by Codex runtime, pgg can still manage `agents/*.toml` as orchestration metadata and must document how the parent Codex process maps roles to built-in sub-agent calls.

## Acceptance

- Plan/code review records the local Codex CLI evidence.
- Tests do not require internet access.
- Docs do not claim unsupported runtime behavior as guaranteed.
- Fallback behavior is explicit when runtime role loading is unavailable.
