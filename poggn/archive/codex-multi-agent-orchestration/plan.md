---
pgg:
  topic: "codex-multi-agent-orchestration"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-26T07:54:14Z"
  archive_type: "feat"
  project_scope: "current-project"
---

# Plan

## Summary

Implement a pgg-managed Codex multi-agent orchestration contract. The feature will connect pgg `teamsMode` to Codex `multi_agent`, define a two-primary-agent routing matrix for each flow, create reusable agent TOML profiles, and update generated workflow documentation so pgg and Codex describe the same orchestration model.

## Compatibility Findings

- Local Codex CLI reports `multi_agent` as a known stable feature flag and `multi_agent_v2` as under development.
- Local Codex CLI help states config values are loaded from `~/.codex/config.toml`, and dotted `-c key=value` overrides are parsed as TOML.
- Local Codex CLI help states `--enable <FEATURE>` is equivalent to `-c features.<name>=true`.
- OpenAI Codex AGENTS.md documentation describes `child_agents_md` as a feature flag controlled through `[features]` in `config.toml`.
- OpenAI Codex AGENTS.md guidance says AGENTS.md instructions are scoped hierarchically and direct system/developer/user instructions take precedence.
- Project-local custom agent role loading has had compatibility risk in OpenAI Codex issue history, so implementation must not assume project-local roles are effective until verified locally.

## Architecture

### Source Of Truth

- `.pgg/project.json` remains the source of truth for `teamsMode`.
- `.codex/config.toml` becomes the pgg-managed project artifact for Codex multi-agent configuration.
- `agents/main.toml` becomes the source of truth for role index and flow routing.
- `.codex/add/EXPERT-ROUTING.md` mirrors the routing matrix in markdown for pgg workflow docs.

### Config Strategy

- When `teamsMode=on`, generated `.codex/config.toml` must set `[features].multi_agent=true`.
- When `teamsMode=off`, generated `.codex/config.toml` must set `[features].multi_agent=false`.
- Default token controls are `max_threads=4` and `max_depth=1`.
- If project-local Codex role config is not loaded by the current CLI, pgg must still keep `.codex/config.toml` and `agents/*.toml` as managed artifacts and expose the effective runtime path through CLI `-c` overrides or documented handoff.

### Agent Routing

Every flow gets exactly two primary agents:

| Flow | Agent 1 | Agent 2 |
|---|---|---|
| `pgg-add` | `product-manager` | `ux-ui-expert` |
| `pgg-plan` | `software-architect` | `domain-expert` |
| `pgg-code` | `senior-backend-engineer` | `tech-lead` |
| `pgg-refactor` | `software-architect` | `code-reviewer` |
| `pgg-qa` | `qa-test-engineer` | `sre-operations-engineer` |
| `pgg-token` | `tech-lead` | `code-reviewer` |
| `pgg-performance` | `qa-test-engineer` | `sre-operations-engineer` |

Support roles are not primary flow agents:

- `project-generalist`
- `docs-researcher`

## Specs

- `S1`: `spec/config/codex-config-and-teams-sync.md`
- `S2`: `spec/agents/agent-role-toml-contract.md`
- `S3`: `spec/routing/two-agent-flow-orchestration.md`
- `S4`: `spec/docs/generated-workflow-doc-sync.md`
- `S5`: `spec/token/multi-agent-context-budget.md`
- `S6`: `spec/verification/codex-schema-and-compatibility.md`

## Implementation Order

1. Add config generation and teams sync support.
2. Add agent TOML files and index.
3. Replace 3-agent rosters with two-primary-agent routing in docs and generated templates.
4. Update skills and workflow state-pack guidance to hand off minimal context to agents.
5. Add tests for config generation, teams on/off behavior, routing matrix, and generated docs.
6. Run required token audit after implementation because token optimization is a core requirement.

## Audit Applicability

- `pgg-token`: `required` | multi-agent orchestration increases context fan-out risk, so token budget and handoff minimization must be audited.
- `pgg-performance`: `not_required` | no runtime hot path or user-facing performance loop is planned; this is config, docs, templates, and workflow contract work.

## Verification Plan

- `pnpm build`
- `pnpm test`
- `codex features list` source inspection for `multi_agent`
- generated file inspection for `.codex/config.toml`, `agents/main.toml`, and flow routing matrix
- `node packages/cli/dist/index.js update` after template changes
- `./.codex/sh/pgg-gate.sh pgg-code codex-multi-agent-orchestration`
- required `pgg-token` audit before QA

## Risks

- Codex custom role config schema may change. Mitigation: implement schema as pgg-managed artifacts, verify current CLI behavior, and keep fallback to built-in roles or CLI overrides.
- Agent fan-out can multiply token use. Mitigation: two primary agents per flow, `max_depth=1`, `max_threads=4`, and `state/current.md` plus `pgg-state-pack.sh` handoff only.
- Generated docs can drift. Mitigation: keep routing matrix in template source and test generated skill/doc output.
