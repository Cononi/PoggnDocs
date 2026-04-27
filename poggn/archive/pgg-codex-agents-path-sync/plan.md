---
pgg:
  topic: "pgg-codex-agents-path-sync"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 93
  updated_at: "2026-04-26T15:15:22Z"
  archive_type: "fix"
  project_scope: "current-project"
---

# Plan

## Summary

Move the pgg-managed Codex agent routing files from root `agents/` to `.codex/agents/`, and make `pgg init`, `pgg update`, generated documentation, state-pack output, manifest tracking, and tests use the same path contract.

## Current Findings

- `packages/core/src/templates.ts` currently creates `agents/main.toml` and `agents/*.toml` through `agentTemplates()`.
- Generated workflow docs and root `AGENTS.md` text still refer to `agents/main.toml`.
- `.codex/sh/pgg-state-pack.sh` currently emits `agent_routing_ref: agents/main.toml`.
- `.pgg/project.json` currently tracks root `agents/*` as managed files.
- `packages/core/test/skill-generation.test.mjs` asserts `AGENTS_MAIN_PATH = "agents/main.toml"` and manifest entries under `agents/`.
- `syncProject()` retires prior managed files that are no longer generated, backs up modified managed files, removes unchanged managed files, and prunes empty parent directories.

## Architecture

### Path Contract

- New source path: `.codex/agents/main.toml`
- New role paths: `.codex/agents/<role-id>.toml`
- Routing reference text: `.codex/agents/main.toml`
- Unchanged: `.codex/config.toml`, `.codex/add/*`, `.codex/skills/*`, `.codex/sh/*`

### Init Behavior

`initializeProject()` should continue to call `buildGeneratedFiles()` through `syncProject()`. Changing the generated template paths is sufficient for new projects to receive `.codex/agents/*`.

### Update Behavior

`updateProject()` should continue to call `syncProject()` with the existing manifest. Once `buildGeneratedFiles()` no longer returns root `agents/*`, `syncProject()` will retire prior managed root agent files.

Migration policy:

- If a root `agents/*` file matches its stored checksum, `pgg update` may remove it as a retired managed file.
- If a root `agents/*` file differs from its stored checksum, `pgg update` must back it up under `.pgg/backups/`, report a conflict, and then retire the managed path.
- If root `agents/` contains non-managed user files, they must not be deleted. Empty parent cleanup may remove the directory only when no entries remain.
- `.pgg/project.json` must end with `.codex/agents/*` entries and no root `agents/*` managed entries.

## Specs

- `S1`: `spec/templates/codex-agent-template-paths.md`
- `S2`: `spec/migration/root-agents-retirement.md`
- `S3`: `spec/docs/routing-reference-sync.md`
- `S4`: `spec/verification/init-update-path-regression.md`

## Implementation Order

1. Update template path constants and generated agent source-of-truth text to `.codex/agents/*`.
2. Update generated documentation strings and checked-in generated docs/helpers that reference `agents/main.toml`.
3. Run `pgg update` or equivalent generated sync so `.pgg/project.json`, `.codex/agents/*`, and retired root managed files reflect the new contract.
4. Update path-focused tests and add migration assertions for managed root `agents/*` retirement.
5. Run build/test and pgg gate checks.
6. Run required token audit after implementation/refactor because workflow handoff references change.

## Audit Applicability

- `pgg-token`: `required` | workflow handoff and generated routing references change.
- `pgg-performance`: `not_required` | this is a generated file path and documentation contract change, not a runtime hot path.

## Verification Plan

- `pnpm build`
- `pnpm test`
- `node packages/cli/dist/index.js update`
- inspect `.pgg/project.json` for `.codex/agents/*` managed paths and no root `agents/*` managed paths
- inspect `.codex/sh/pgg-state-pack.sh` output for `agent_routing_ref: .codex/agents/main.toml`
- `./.codex/sh/pgg-gate.sh pgg-code pgg-codex-agents-path-sync`
- required `pgg-token` audit before QA

## Risks

- User-modified root agent files could be overwritten or lost. Mitigation: rely on existing checksum conflict backup behavior and add test coverage.
- Generated docs may drift from template source. Mitigation: search for `agents/main.toml` and test key generated outputs.
- Existing root `agents/` directory may contain non-managed user files. Mitigation: only retire prior managed paths and let empty parent pruning remove the directory only if it is empty.
