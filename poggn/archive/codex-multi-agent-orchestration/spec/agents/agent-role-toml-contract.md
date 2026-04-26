# S2: Agent Role TOML Contract

## Purpose

Define reusable project-agnostic agent profiles that any pgg-managed project can use.

## Required Files

- `agents/main.toml`
- `agents/product-manager.toml`
- `agents/ux-ui-expert.toml`
- `agents/domain-expert.toml`
- `agents/software-architect.toml`
- `agents/senior-backend-engineer.toml`
- `agents/tech-lead.toml`
- `agents/code-reviewer.toml`
- `agents/qa-test-engineer.toml`
- `agents/sre-operations-engineer.toml`
- `agents/project-generalist.toml`
- `agents/docs-researcher.toml`

## Required Fields

Each role TOML must include:

- `id`
- `name`
- `category`
- `purpose`
- `when_to_use`
- `input_contract`
- `output_contract`
- `constraints`
- `forbidden_actions`
- `handoff`

`agents/main.toml` must additionally include:

- role index
- flow routing matrix
- default concurrency and depth limits
- fallback/support role rules
- source-of-truth notes

## Behavior Rules

- Agent descriptions must be generic enough for any project.
- Agents do not own global workflow decisions; the parent Codex process synthesizes and decides.
- Agents do not run destructive commands.
- Agents receive minimal context and must not request full-topic documents by default.
- Agent output must be concise, attributable, and easy to place into pgg review notes.

## Acceptance

- All required files exist.
- TOML parses successfully.
- Flow primary agents are defined in `agents/main.toml`.
- No duplicate role file is created for QA/test despite the repeated user wording.
