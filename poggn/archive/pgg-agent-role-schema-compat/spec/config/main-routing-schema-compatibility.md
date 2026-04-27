# S2: Main Routing Schema Compatibility

## Purpose

Keep `.codex/agents/main.toml` useful for pgg routing while avoiding fields the current Codex loader rejects.

## Required Behavior

- `.codex/agents/main.toml` must not include rejected top-level fields.
- The reported rejected `activation` key must be removed or represented through an accepted field if one exists.
- Agent budget remains:
  - `max_threads = 4`
  - `max_depth = 1`
- Each flow remains mapped to exactly two primary agents:
  - `pgg-add`: `product-manager`, `ux-ui-expert`
  - `pgg-plan`: `software-architect`, `domain-expert`
  - `pgg-code`: `senior-backend-engineer`, `tech-lead`
  - `pgg-refactor`: `software-architect`, `code-reviewer`
  - `pgg-qa`: `qa-test-engineer`, `sre-operations-engineer`
  - `pgg-token`: `tech-lead`, `code-reviewer`
  - `pgg-performance`: `qa-test-engineer`, `sre-operations-engineer`

## Documentation Preservation

If Codex does not accept role classification metadata in TOML, primary/support semantics must remain preserved in `.codex/add/EXPERT-ROUTING.md`, `.codex/add/WOKR-FLOW.md`, and generated handoff state.

## Acceptance

- Codex no longer reports `unknown field activation` for `.codex/agents/main.toml`.
- Routing docs and `pgg-state-pack.sh` output still expose the expected two primary agents for this topic.
- `multi_agent=false` remains unchanged while pgg teams mode is off.
