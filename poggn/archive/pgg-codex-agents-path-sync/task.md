---
pgg:
  topic: "pgg-codex-agents-path-sync"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 93
  updated_at: "2026-04-26T15:15:22Z"
  archive_type: "fix"
  project_scope: "current-project"
---

# Task

## Tasks

| Task | Spec | Scope | Done Criteria |
|---|---|---|---|
| T1 | S1 | Move generated Codex agent template paths from `agents/*` to `.codex/agents/*`. | `pgg init` creates `.codex/agents/main.toml` and all role files; generated `main.toml` self-reference uses `.codex/agents/main.toml`. |
| T2 | S2 | Preserve safe migration behavior for existing root `agents/*` managed files. | `pgg update` retires prior managed root agent paths, backs up modified managed files, preserves non-managed files, and leaves manifest tracking only `.codex/agents/*`. |
| T3 | S3 | Synchronize generated docs, skills, root `AGENTS.md`, and state-pack routing references. | No managed workflow doc or helper still points to `agents/main.toml`; state-pack emits `.codex/agents/main.toml`. |
| T4 | S4 | Update regression tests for init/update path and migration behavior. | Tests assert `.codex/agents/*` creation, manifest entries, root managed path retirement, and state-pack routing ref. |
| T5 | S4 | Run verification and record evidence. | `pnpm build`, `pnpm test`, `node packages/cli/dist/index.js update`, `pgg-gate pgg-code`, and required token-audit follow-up are recorded. |

## File Ownership

- `T1`: `packages/core/src/templates.ts`, generated `.codex/agents/*.toml`
- `T2`: `packages/core/test/skill-generation.test.mjs`, `.pgg/project.json`, retired root `agents/*` files during sync
- `T3`: `AGENTS.md`, `.codex/add/WOKR-FLOW.md`, `.codex/add/STATE-CONTRACT.md`, `.codex/add/EXPERT-ROUTING.md`, `.codex/sh/pgg-state-pack.sh`, `.codex/skills/*/SKILL.md` only where path text appears
- `T4`: `packages/core/test/skill-generation.test.mjs`
- `T5`: `implementation/index.md`, `implementation/diffs/*.diff`, `reviews/code.review.md`

## Required Audit

- `pgg-token` is required after implementation/refactor and before QA.
- `pgg-performance` is not required unless implementation introduces runtime-heavy behavior outside the current plan.

## Acceptance Checklist

- [ ] `buildGeneratedFiles()` returns `.codex/agents/main.toml` and `.codex/agents/*.toml`.
- [ ] Generated `agentsMainToml()` source-of-truth text references `.codex/agents/main.toml`.
- [ ] `pgg init` fixture creates `.codex/agents/main.toml`.
- [ ] `pgg update` manifest tracks `.codex/agents/*` and does not track root `agents/*`.
- [ ] Modified prior root managed files are backed up before retirement.
- [ ] Non-managed root `agents/` files are preserved.
- [ ] `pgg-state-pack.sh` emits `agent_routing_ref: .codex/agents/main.toml`.
- [ ] Search shows no managed workflow path reference to `agents/main.toml`.
- [ ] `pnpm build` and `pnpm test` pass or any failure is documented with cause.
