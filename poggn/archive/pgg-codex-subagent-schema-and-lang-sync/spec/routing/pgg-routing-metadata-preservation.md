# Pgg Routing Metadata Preservation

## Purpose

Keep pgg's workflow routing contract while preventing Codex from loading pgg routing metadata as invalid custom agent TOML.

## Requirements

- The two-primary-agent matrix remains unchanged:
  - `pgg-add`: product manager, UX/UI expert
  - `pgg-plan`: software architect, domain expert
  - `pgg-code`: senior backend engineer, tech lead
  - `pgg-refactor`: software architect, code reviewer
  - `pgg-qa`: QA/test engineer, SRE/operations engineer
  - `pgg-token`: tech lead, code reviewer
  - `pgg-performance`: QA/test engineer, SRE/operations engineer
- `project-generalist` and `docs-researcher` remain support roles and are opt-in only.
- If `.codex/agents/main.toml` stays under `.codex/agents/`, it must be a valid standalone custom agent file.
- If routing metadata remains a manifest, it must move to a path Codex does not parse as a custom agent file, and all generated references must point there.
- `.codex/config.toml` remains the source for `[agents] max_threads=4` and `max_depth=1`.
- `pgg-state-pack.sh` must continue to expose `primary_agents`, `agent_max_threads`, `agent_max_depth`, and a valid `agent_routing_ref`.

## Forbidden Output

No file under `.codex/agents/` may contain unsupported routing manifest keys such as:

- `activation`
- `source_of_truth`
- `token_budget`
- `[[roles]]`
- `[[flows]]`
- `[support]`

unless those keys are represented inside `developer_instructions` of a valid custom agent file.

## Acceptance

- The reported `unknown field activation` warning is gone.
- Generated workflow docs still explain the same two-agent routing matrix.
- State-pack output points to the surviving routing reference.
