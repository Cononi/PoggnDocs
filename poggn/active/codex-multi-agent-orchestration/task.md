---
pgg:
  topic: "codex-multi-agent-orchestration"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-26T07:54:14Z"
  archive_type: "feat"
  project_scope: "current-project"
---

# Task

## Tasks

| Task | Spec | Scope | Done Criteria |
|---|---|---|---|
| T1 | S1 | Add pgg-managed `.codex/config.toml` generation and teams on/off sync. | `teamsMode=on` produces `multi_agent=true`; `off` produces `false`; defaults are `max_threads=4`, `max_depth=1`; tests cover both modes. |
| T2 | S2 | Create `agents/main.toml` and all role TOML files. | Every required and fallback agent has a TOML file with role, purpose, constraints, input contract, output contract, and project-agnostic behavior. |
| T3 | S3 | Implement two-primary-agent flow routing contract. | Each core flow and optional audit maps to exactly two primary agents; state-pack/handoff text references those two agents only. |
| T4 | S4 | Update AGENTS.md, pgg docs, skills, and generated templates. | Old 3-agent rosters are removed or replaced; template source and generated assets stay aligned. |
| T5 | S5 | Add token budget and context minimization rules. | Agent handoff uses `state/current.md` or `pgg-state-pack.sh`; `max_depth=1` and `max_threads=4` rationale is documented; required token audit path is preserved. |
| T6 | S6 | Validate Codex compatibility and add regression tests. | Local Codex feature/config facts are recorded; unsupported schema gets fallback handling; build/test/update pass. |

## File Ownership

- `T1`: `.codex/config.toml`, `.pgg/project.json` update helpers, CLI/core sync code.
- `T2`: `agents/*.toml`.
- `T3`: `.codex/add/EXPERT-ROUTING.md`, pgg skill docs, state-pack references.
- `T4`: `AGENTS.md`, `.codex/add/*.md`, `.codex/skills/*/SKILL.md`, `packages/core/src/templates.ts`, generated dist assets.
- `T5`: token-specific docs and generated handoff guidance.
- `T6`: tests under `packages/core/test/` and verification notes.

## Required Audit

- `pgg-token` is required after implementation/refactor and before QA.
- `pgg-performance` is not required unless implementation introduces runtime-heavy behavior not currently planned.

## Acceptance Checklist

- [ ] `.codex/config.toml` exists and is generated from pgg state.
- [ ] `codex features list` confirms `multi_agent` support in the local CLI used for verification.
- [ ] `agents/main.toml` lists all agents and the flow routing matrix.
- [ ] There are no remaining 3-primary-agent rosters in managed workflow docs.
- [ ] Each flow has exactly two primary agents.
- [ ] `pgg teams off` does not automatically spawn/use sub-agents.
- [ ] Token handoff rules prevent full-doc handoff by default.
- [ ] `pnpm build`, `pnpm test`, generated update, and required token audit pass.
