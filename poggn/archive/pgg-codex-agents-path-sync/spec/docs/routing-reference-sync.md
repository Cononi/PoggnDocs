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
  id: "S3"
  owner: "domain-expert"
---

# S3 Routing Reference Sync

## Requirement

All generated and checked-in workflow references must name `.codex/agents/main.toml` as the routing source.

## Scope

- `AGENTS.md`
- `.codex/add/WOKR-FLOW.md`
- `.codex/add/STATE-CONTRACT.md`
- `.codex/add/EXPERT-ROUTING.md`
- `.codex/sh/pgg-state-pack.sh`
- matching generator strings in `packages/core/src/templates.ts`
- generated skill docs only if they contain the old path

## Contract

- Use `.codex/agents/main.toml` for the Codex routing file.
- Do not change the two-primary-agent routing matrix.
- Do not change support-agent opt-in rules.
- Do not change `teamsMode` or `.codex/config.toml` semantics.

## Acceptance

- `pgg-state-pack.sh` emits `agent_routing_ref: .codex/agents/main.toml`.
- Managed docs and generated templates do not contain `agents/main.toml`.
- `EXPERT-ROUTING.md` and `.codex/agents/main.toml` are described as aligned.
