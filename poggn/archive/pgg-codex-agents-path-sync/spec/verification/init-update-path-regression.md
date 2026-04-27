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
  id: "S4"
  owner: "domain-expert"
---

# S4 Init Update Path Regression

## Requirement

Tests must prove both new initialization and existing-project update behavior for `.codex/agents/*`.

## Scope

- Update `packages/core/test/skill-generation.test.mjs`.
- Add migration-specific assertions either in the existing teams-mode test or a new focused test.
- Use existing project sync APIs instead of shelling out where the tests already use core APIs.

## Required Assertions

- `AGENTS_MAIN_PATH` equals `.codex/agents/main.toml`.
- `initializeProject()` creates `.codex/agents/main.toml`.
- initial manifest contains `.codex/agents/main.toml`.
- `updateProjectTeamsMode()` preserves `.codex/agents/docs-researcher.toml` and `.codex/agents/qa-test-engineer.toml` manifest entries.
- update migration does not leave root `agents/main.toml` as a managed path.
- state-pack generated content includes `agent_routing_ref: .codex/agents/main.toml`.

## Verification Commands

- `pnpm build`
- `pnpm test`
- `node packages/cli/dist/index.js update`
- `./.codex/sh/pgg-gate.sh pgg-code pgg-codex-agents-path-sync`
