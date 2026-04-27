# S1: Role File Schema Compatibility

## Purpose

Ensure every individual `.codex/agents/*.toml` role definition can be deserialized by the current Codex role loader.

## Required Behavior

- Role files must not include first-class keys that Codex rejects as unknown fields.
- The reported rejected `category` key must be removed from individual role TOML files.
- Role identity and behavior guidance must remain available through accepted fields:
  - `id`
  - `name`
  - `purpose`
  - `when_to_use`
  - `input_contract`
  - `output_contract`
  - `constraints`
  - `forbidden_actions`
  - `handoff`

## Scope

Applies to every individual role file under `.codex/agents` except `main.toml`.

## Acceptance

- Codex no longer reports `unknown field category` for individual role TOML files.
- No role file is deleted.
- Role descriptions still let the parent process understand each expert's intended use.
- Support-role behavior is preserved outside rejected first-class fields.
