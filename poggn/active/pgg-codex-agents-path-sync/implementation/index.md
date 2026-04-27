---
pgg:
  topic: "pgg-codex-agents-path-sync"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 94
  updated_at: "2026-04-26T15:27:23Z"
  archive_type: "fix"
  project_scope: "current-project"
---

# Implementation Index

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 001 | UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/001_UPDATE_template_agent_paths.diff` | `T1`, `T3` | Generated agent paths and routing reference strings now use `.codex/agents/main.toml`. |
| 001 | UPDATE | `packages/core/dist/templates.js` | `implementation/diffs/001_UPDATE_template_agent_paths.diff` | `T1`, `T3` | Built dist output after template source changes. |
| 001 | UPDATE | `packages/core/dist/templates.js.map` | `implementation/diffs/001_UPDATE_template_agent_paths.diff` | `T1`, `T3` | Built source map output after template source changes. |
| 002 | UPDATE | `packages/core/test/skill-generation.test.mjs` | `implementation/diffs/002_UPDATE_agent_path_tests.diff` | `T2`, `T4` | Tests now assert `.codex/agents/*` generation and old root managed-file retirement behavior. |
| 003 | UPDATE | `AGENTS.md` | `implementation/diffs/003_UPDATE_routing_reference_docs.diff` | `T3` | Root workflow instruction now references `.codex/agents/main.toml`. |
| 003 | UPDATE | `.codex/add/WOKR-FLOW.md` | `implementation/diffs/003_UPDATE_routing_reference_docs.diff` | `T3` | Workflow routing contract now references `.codex/agents/main.toml`. |
| 003 | UPDATE | `.codex/add/STATE-CONTRACT.md` | `implementation/diffs/003_UPDATE_routing_reference_docs.diff` | `T3` | State handoff contract now references `.codex/agents/main.toml`. |
| 003 | UPDATE | `.codex/add/EXPERT-ROUTING.md` | `implementation/diffs/003_UPDATE_routing_reference_docs.diff` | `T3` | Expert routing source of truth now references `.codex/agents/main.toml`. |
| 003 | UPDATE | `.codex/sh/pgg-state-pack.sh` | `implementation/diffs/003_UPDATE_routing_reference_docs.diff` | `T3` | State-pack now emits `agent_routing_ref: .codex/agents/main.toml`. |
| 004 | CREATE | `.codex/agents/*.toml` | `implementation/diffs/004_MOVE_managed_agent_files.diff` | `T1`, `T2` | pgg update created the managed Codex agent files under `.codex/agents/`. |
| 004 | DELETE | `agents/*.toml` | `implementation/diffs/004_MOVE_managed_agent_files.diff` | `T2` | pgg update retired prior root managed agent files. |
| 004 | UPDATE | `.pgg/project.json` | `implementation/diffs/004_MOVE_managed_agent_files.diff` | `T2` | Manifest now tracks `.codex/agents/*` and no root `agents/*` managed paths. |
| 005 | UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/005_UPDATE_agent_path_constants_refactor.diff` | `T1`, `T3` | Refactored `.codex/agents` path literals into constants and role-path helper. |
| 005 | UPDATE | `packages/core/test/skill-generation.test.mjs` | `implementation/diffs/005_UPDATE_agent_path_constants_refactor.diff` | `T4` | Refactored test path assertions to use shared local constants/helpers. |
| 005 | UPDATE | `packages/core/dist/templates.js` | `implementation/diffs/005_UPDATE_agent_path_constants_refactor.diff` | `T1`, `T3` | Built dist output after refactor. |
| 005 | UPDATE | `packages/core/dist/templates.js.map` | `implementation/diffs/005_UPDATE_agent_path_constants_refactor.diff` | `T1`, `T3` | Built source map output after refactor. |

## Verification Evidence

- `pnpm build`: pass
- `node packages/cli/dist/index.js update`: pass, created 12 `.codex/agents/*` files and retired 12 root `agents/*` managed files
- `pnpm test`: pass, 39 tests
- `.codex/sh/pgg-state-pack.sh pgg-codex-agents-path-sync`: pass, emits `agent_routing_ref: .codex/agents/main.toml`
- refactor `node packages/cli/dist/index.js update`: pass, unchanged

## Notes

- `.codex/agents/*` is ignored by `.gitignore`, so staging must force-add these managed files.
- The pre-existing unrelated `add-img/*.png` files remain outside this topic and are covered by the dirty baseline.
