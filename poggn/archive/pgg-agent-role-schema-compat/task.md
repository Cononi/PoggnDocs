---
pgg:
  topic: "pgg-agent-role-schema-compat"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 94
  updated_at: "2026-04-27T00:53:17Z"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "2.3.2"
  short_name: "agent-compat"
  working_branch: "ai/fix/2.3.2-agent-compat"
  release_branch: "release/2.3.2-agent-compat"
  project_scope: "current-project"
---

# Task

## Tasks

| Task | Spec | Scope | Done Criteria |
|---|---|---|---|
| T1 | S1 | Make every individual `.codex/agents/*.toml` role file compatible with the Codex role schema. | `category` no longer appears as a rejected first-class field in individual role files; role identity, purpose, usage, contracts, constraints, forbidden actions, and handoff guidance remain available. |
| T2 | S2 | Make `.codex/agents/main.toml` compatible while preserving pgg routing semantics. | `activation` no longer appears as a rejected top-level field; routing matrix still maps each core/optional flow to exactly two primary agents; support roles remain opt-in. |
| T3 | S2 | Refresh managed metadata if agent TOML checksum tracking requires it. | `.pgg/project.json` managed file entries stay consistent with changed agent files, or implementation review explains why no refresh is required. |
| T4 | S3 | Verify the malformed role warning is gone. | The same startup/validation path no longer emits `Ignoring malformed agent role definition`, or manual evidence documents why the closest available validation is sufficient. |
| T5 | S3 | Record implementation evidence for the pgg workflow. | `implementation/index.md`, `implementation/diffs/*.diff`, and `reviews/code.review.md` record changed files, rationale, verification, and any residual risk. |

## File Ownership

- `T1`: `.codex/agents/code-reviewer.toml`, `.codex/agents/docs-researcher.toml`, `.codex/agents/domain-expert.toml`, `.codex/agents/product-manager.toml`, `.codex/agents/project-generalist.toml`, `.codex/agents/qa-test-engineer.toml`, `.codex/agents/senior-backend-engineer.toml`, `.codex/agents/software-architect.toml`, `.codex/agents/sre-operations-engineer.toml`, `.codex/agents/tech-lead.toml`, `.codex/agents/ux-ui-expert.toml`
- `T2`: `.codex/agents/main.toml`, with cross-checks against `.codex/add/EXPERT-ROUTING.md` and `.codex/add/WOKR-FLOW.md`
- `T3`: `.pgg/project.json` only if checksum metadata must be refreshed
- `T4`: verification notes in `implementation/index.md` and `reviews/code.review.md`
- `T5`: `poggn/active/pgg-agent-role-schema-compat/implementation/*`, `poggn/active/pgg-agent-role-schema-compat/reviews/code.review.md`

## Acceptance Checklist

- [x] No changed file reaches outside current-project scope.
- [x] Individual role TOML files no longer contain rejected `category` first-class fields.
- [x] `.codex/agents/main.toml` no longer contains rejected top-level `activation`.
- [x] pgg flow routing still lists exactly two primary agents per core/optional flow.
- [x] `project-generalist` and `docs-researcher` remain support/opt-in roles in pgg docs or accepted routing metadata.
- [x] Codex startup/validation no longer reports malformed agent role definitions for this project.
- [x] `./.codex/sh/pgg-gate.sh pgg-code pgg-agent-role-schema-compat` passes.

## Audit Applicability

- [pgg-token]: not_required | This fix reduces invalid local config metadata and does not expand context handoff or agent fan-out.
- [pgg-performance]: not_required | This is configuration compatibility work and does not affect runtime performance paths.
