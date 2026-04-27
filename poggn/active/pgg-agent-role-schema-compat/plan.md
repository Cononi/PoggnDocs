---
pgg:
  topic: "pgg-agent-role-schema-compat"
  stage: "plan"
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

# Plan

## Summary

Fix the local Codex agent role configuration so Codex no longer ignores project-managed role definitions as malformed. The implementation should remove or relocate fields rejected by the current Codex deserializer while preserving pgg's two-primary-agent routing contract in accepted configuration, markdown source-of-truth, and handoff state.

## Planning Findings

- The user reported Codex rejecting individual `.codex/agents/*.toml` files because of unknown field `category`.
- The user reported Codex rejecting `.codex/agents/main.toml` because of unknown field `activation`.
- Current `.codex/config.toml` has `multi_agent=false`, `max_threads=4`, and `max_depth=1`; teams mode remains off for this topic.
- `.codex/add/EXPERT-ROUTING.md` and `.codex/add/WOKR-FLOW.md` already preserve the primary/support routing semantics outside role TOML.
- The archived `codex-multi-agent-orchestration` spec introduced `category` as a required role field, so this topic supersedes that requirement for Codex runtime compatibility.

## Architecture

### Runtime-Compatible TOML Surface

The `.codex/agents` files must prefer fields accepted by the current Codex role deserializer. Unsupported metadata such as `category` and `activation` must not remain as first-class TOML keys if they cause the entire role file to be ignored.

### Routing Semantics Preservation

Primary/support role classification remains part of pgg workflow semantics. It should be preserved in:

- `.codex/add/EXPERT-ROUTING.md`
- `.codex/add/WOKR-FLOW.md`
- `.codex/agents/main.toml` only through accepted fields
- Role descriptions only if the Codex schema accepts that representation

### Verification-First Schema Boundary

Implementation must verify the exact warning path after changes. The acceptance evidence is not merely that TOML parses syntactically, but that Codex no longer emits `Ignoring malformed agent role definition` for the project-managed role files.

## Specs

- `S1`: `spec/agents/role-file-schema-compatibility.md`
- `S2`: `spec/config/main-routing-schema-compatibility.md`
- `S3`: `spec/verification/malformed-agent-warning-regression.md`

## Implementation Order

1. Update individual role TOML files to remove unsupported first-class `category` keys while preserving role purpose and contracts.
2. Update `.codex/agents/main.toml` to remove unsupported first-class `activation` and keep routing/budget metadata in accepted shape.
3. Check whether any pgg managed metadata needs checksum refresh because `.codex/agents/*.toml` are listed in `.pgg/project.json`.
4. Verify the warning no longer appears in the same startup path or closest available local Codex validation path.
5. Record implementation diffs, code review, and verification evidence in the code stage.

## Audit Applicability

- [pgg-token]: not_required | This fix reduces invalid local config metadata and does not expand context handoff or agent fan-out.
- [pgg-performance]: not_required | This is configuration compatibility work and does not affect runtime performance paths.

## Verification Plan

- Inspect `.codex/agents/*.toml` and `.codex/agents/main.toml` for removed unsupported keys.
- Run a TOML parse check if an available local parser exists.
- Run the same `$pgg-add`/Codex startup path or closest available local command that previously produced `Ignoring malformed agent role definition`.
- Run `./.codex/sh/pgg-gate.sh pgg-code pgg-agent-role-schema-compat` after plan/task/spec/reviews exist.
- Preserve manual verification notes if Codex warning reproduction requires an interactive startup outside automated commands.

## Risks

- Codex role schema may reject additional fields after `category` and `activation` are removed. Mitigation: verify after each compatibility change and keep the code task scoped to all currently rejected role files.
- Moving classification out of role TOML can make primary/support semantics less visible. Mitigation: keep the routing docs and state-pack output as the source for pgg workflow semantics.
- `.pgg/project.json` managed file checksums may become stale. Mitigation: include metadata refresh as a task, but only after confirming the repository's managed-file update pattern.
