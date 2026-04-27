---
pgg:
  topic: "pgg-codex-agents-path-sync"
  stage: "spec"
  status: "approved"
  skill: "pgg-plan"
  score: 93
  updated_at: "2026-04-26T15:15:22Z"
  archive_type: "fix"
  project_scope: "current-project"
spec:
  id: "S1"
  owner: "software-architect"
---

# S1 Codex Agent Template Paths

## Requirement

pgg-generated Codex agent role files must live under `.codex/agents/`, not root `agents/`.

## Scope

- Change `agentTemplates()` in `packages/core/src/templates.ts`.
- Change `agentsMainToml()` source-of-truth text.
- Keep agent ids, role content, flow matrix, support roles, `max_threads`, and `max_depth` unchanged.

## Contract

- `main.toml`: `.codex/agents/main.toml`
- role files: `.codex/agents/<role-id>.toml`
- source-of-truth string: `.codex/agents/main.toml and .codex/add/EXPERT-ROUTING.md must stay aligned.`

## Acceptance

- New project initialization writes `.codex/agents/main.toml`.
- New project initialization does not create root `agents/main.toml`.
- All existing role ids continue to have generated TOML files.
