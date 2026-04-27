---
pgg:
  topic: "pgg-agent-role-schema-compat"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 95
  updated_at: "2026-04-27T01:19:27Z"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "2.3.2"
  short_name: "agent-compat"
  working_branch: "ai/fix/2.3.2-agent-compat"
  release_branch: "release/2.3.2-agent-compat"
  project_scope: "current-project"
---

# Implementation Index

## Summary

Removed Codex-rejected first-class agent role metadata from project-managed `.codex/agents` TOML files and refreshed the corresponding `.pgg/project.json` managed-file checksums. The pgg routing contract remains in `.codex/agents/main.toml` flow entries and `.codex/add/EXPERT-ROUTING.md`.

## Changed Files

| Type | Path | Notes | Diff |
|---|---|---|---|
| UPDATE | `.codex/agents/main.toml` | Removed rejected top-level `activation` and role-level `category` fields; retained budgets, role index, flow routing, and support role list. | `implementation/diffs/001_UPDATE_codex_agents_schema_compat.diff` |
| UPDATE | `.codex/agents/code-reviewer.toml` | Removed rejected `category` field. | `implementation/diffs/001_UPDATE_codex_agents_schema_compat.diff` |
| UPDATE | `.codex/agents/docs-researcher.toml` | Removed rejected `category` field. | `implementation/diffs/001_UPDATE_codex_agents_schema_compat.diff` |
| UPDATE | `.codex/agents/domain-expert.toml` | Removed rejected `category` field. | `implementation/diffs/001_UPDATE_codex_agents_schema_compat.diff` |
| UPDATE | `.codex/agents/product-manager.toml` | Removed rejected `category` field. | `implementation/diffs/001_UPDATE_codex_agents_schema_compat.diff` |
| UPDATE | `.codex/agents/project-generalist.toml` | Removed rejected `category` field. | `implementation/diffs/001_UPDATE_codex_agents_schema_compat.diff` |
| UPDATE | `.codex/agents/qa-test-engineer.toml` | Removed rejected `category` field. | `implementation/diffs/001_UPDATE_codex_agents_schema_compat.diff` |
| UPDATE | `.codex/agents/senior-backend-engineer.toml` | Removed rejected `category` field. | `implementation/diffs/001_UPDATE_codex_agents_schema_compat.diff` |
| UPDATE | `.codex/agents/software-architect.toml` | Removed rejected `category` field. | `implementation/diffs/001_UPDATE_codex_agents_schema_compat.diff` |
| UPDATE | `.codex/agents/sre-operations-engineer.toml` | Removed rejected `category` field. | `implementation/diffs/001_UPDATE_codex_agents_schema_compat.diff` |
| UPDATE | `.codex/agents/tech-lead.toml` | Removed rejected `category` field. | `implementation/diffs/001_UPDATE_codex_agents_schema_compat.diff` |
| UPDATE | `.codex/agents/ux-ui-expert.toml` | Removed rejected `category` field. | `implementation/diffs/001_UPDATE_codex_agents_schema_compat.diff` |
| UPDATE | `.pgg/project.json` | Refreshed changed agent TOML checksums and manifest timestamp. | `implementation/diffs/002_UPDATE_pgg_project_manifest_checksums.diff` |

## Task Results

- T1: done | Individual role TOML files no longer contain rejected first-class `category` keys.
- T2: done | `.codex/agents/main.toml` no longer contains rejected `activation` or `category` keys while preserving two-agent flow routing.
- T3: done | `.pgg/project.json` managed checksums match changed agent files.
- T4: done | Local Codex startup/help and feature-list commands emitted no malformed role warnings.
- T5: done | Implementation index, diff artifacts, and code review were recorded.

## Verification

- `rg -n "^(category|activation)\\s*=" .codex/agents`: no matches
- `node -e "JSON.parse(require('fs').readFileSync('.pgg/project.json','utf8')); console.log('project json ok')"`: pass
- managed checksum validation for `.codex/agents/*`: pass
- `codex --help`: pass, no `Ignoring malformed agent role definition` warning observed
- `codex features list`: pass, no `Ignoring malformed agent role definition` warning observed; `multi_agent` remains stable and false
- `./.codex/sh/pgg-gate.sh pgg-code pgg-agent-role-schema-compat`: pass

## Residual Risk

The exact interactive `$pgg-add` warning path is represented by local Codex startup/help and feature-list validation. If Codex later tightens the role schema further, additional unsupported keys may need the same compatibility treatment.
