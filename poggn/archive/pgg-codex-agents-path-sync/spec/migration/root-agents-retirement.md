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
  id: "S2"
  owner: "software-architect"
---

# S2 Root Agents Retirement

## Requirement

`pgg update` must migrate managed path ownership from root `agents/*` to `.codex/agents/*` without deleting user-owned files.

## Scope

- Use existing `syncProject()` retirement behavior where possible.
- Add or update tests to prove safe retirement.
- Do not add a bespoke migration command unless existing sync behavior cannot satisfy the contract.

## Contract

- Prior managed root `agents/*` paths that match manifest checksums may be removed.
- Prior managed root `agents/*` paths that differ from manifest checksums must be backed up to `.pgg/backups/` and reported in sync conflicts before retirement.
- Files under root `agents/` that are not tracked in `.pgg/project.json` must be preserved.
- Empty root `agents/` may be removed only after all entries are gone.
- Final manifest must track `.codex/agents/*` and no root `agents/*`.

## Acceptance

- A fixture initialized with old manifest paths updates to new manifest paths.
- A modified old managed file produces a backup conflict.
- A non-managed root `agents/custom.toml` remains after update.
