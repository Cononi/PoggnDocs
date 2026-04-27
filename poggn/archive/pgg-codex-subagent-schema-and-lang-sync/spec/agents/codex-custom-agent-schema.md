# Codex Custom Agent Schema

## Purpose

Define the pgg-generated `.codex/agents/<role>.toml` format so Codex loads each file as a valid custom agent.

## Requirements

- Each standalone role file must define:
  - `name`
  - `description`
  - `developer_instructions`
- `name` is the source of truth Codex uses to identify the custom agent. Use spawn-friendly identifiers such as `product_manager`, `code_reviewer`, and `docs_researcher`.
- `description` must explain when the parent Codex process should use the agent.
- `developer_instructions` must carry the role purpose, input contract, output contract, constraints, and forbidden actions in prose.
- Optional fields may be used only when they are valid Codex config-compatible fields, such as `nickname_candidates`, `model`, `model_reasoning_effort`, `sandbox_mode`, `mcp_servers`, or `skills.config`.

## Forbidden Output

Generated role TOML files must not emit these pgg-only fields as top-level TOML keys:

- `id`
- `category`
- `purpose`
- `when_to_use`
- `input_contract`
- `output_contract`
- `constraints`
- `forbidden_actions`
- `handoff`

## Acceptance

- A generated role file can be read as a custom agent without the `unknown field category` warning.
- Role intent remains visible in `developer_instructions`.
- Support roles remain described as opt-in, but `category = "support"` is not emitted.
