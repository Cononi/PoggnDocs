---
pgg:
  topic: "pgg-codex-subagent-schema-and-lang-sync"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 97
  updated_at: "2026-04-27T02:00:00Z"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "2.3.3"
  short_name: "codex-sync"
  project_scope: "current-project"
---

# Implementation Index

## Summary

Implemented Codex custom agent schema alignment and generated language sync for pgg-managed assets.

## Changed Files

| # | CRUD | Path | Diff | Task | Notes |
|---:|---|---|---|---|---|
| 001 | UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/001_UPDATE_packages_core_src_templates_ts.diff` | T1, T2, T3 | agent role metadata is language-aware, role TOML emits only supported Codex custom agent fields, and routing manifest moves to `.codex/add/AGENT-ROUTING.toml` |
| 002 | UPDATE | `packages/core/test/skill-generation.test.mjs` | `implementation/diffs/002_UPDATE_packages_core_test_skill-generation_test_mjs.diff` | T5 | regression coverage for valid agent schema, no `.codex/agents/main.toml`, routing preservation, and language switching |
| 003 | UPDATE | `packages/core/dist/templates.js` | `implementation/diffs/003_UPDATE_packages_core_dist_templates_js.diff` | T4 | built template output synchronized from source |
| 004 | UPDATE | `packages/core/dist/templates.js.map` | `implementation/diffs/004_UPDATE_packages_core_dist_templates_js_map.diff` | T4 | built sourcemap synchronized from source |
| 005 | CREATE | `.codex/add/AGENT-ROUTING.toml` | `implementation/diffs/005_CREATE__codex_add_AGENT-ROUTING_toml.diff` | T2, T4 | pgg routing manifest now lives outside `.codex/agents/` so Codex does not parse it as a custom agent |
| 006 | UPDATE | `.codex/add/WOKR-FLOW.md` | `implementation/diffs/006_UPDATE__codex_add_WOKR-FLOW_md.diff` | T2, T4 | generated workflow docs reference the new routing manifest path and localized role names |
| 007 | UPDATE | `.codex/add/STATE-CONTRACT.md` | `implementation/diffs/007_UPDATE__codex_add_STATE-CONTRACT_md.diff` | T2, T4 | state contract references the new routing manifest path |
| 008 | UPDATE | `.codex/add/EXPERT-ROUTING.md` | `implementation/diffs/008_UPDATE__codex_add_EXPERT-ROUTING_md.diff` | T2, T4 | expert routing docs reference `.codex/add/AGENT-ROUTING.toml` and localized role names |
| 009 | UPDATE | `AGENTS.md` | `implementation/diffs/009_UPDATE_AGENTS_md.diff` | T2, T4 | root agent instructions reference the new routing manifest path |
| 010 | UPDATE | `.codex/sh/pgg-state-pack.sh` | `implementation/diffs/010_UPDATE__codex_sh_pgg-state-pack_sh.diff` | T2, T4 | state-pack handoff now reports `.codex/add/AGENT-ROUTING.toml` |
| 011 | UPDATE | `.pgg/project.json` | `implementation/diffs/011_UPDATE__pgg_project_json.diff` | T4 | managed file checksums and generated asset inventory updated |
| 012 | DELETE | `.codex/agents/main.toml` | `implementation/diffs/012_DELETE__codex_agents_main_toml.diff` | T2, T4 | invalid routing manifest removed from Codex custom agent load path |
| 013 | UPDATE | `.codex/agents/*.toml` | `implementation/diffs/013_UPDATE__codex_agents_role_files.diff` | T1, T3, T4 | generated role files now use `name`, `description`, and `developer_instructions` only |
| 014 | UPDATE | `packages/core/src/templates.ts`, `packages/core/test/skill-generation.test.mjs`, `packages/core/dist/templates.js`, `.codex/agents/*.toml`, `.pgg/project.json` | `implementation/diffs/014_REFACTOR_agent_language_classification.diff` | refactor | Korean generated agent classification text no longer uses mixed English phrases such as `primary agent roster` and `support agent` |
| 015 | UPDATE | `packages/core/src/templates.ts`, `packages/core/dist/templates.js`, `.codex/sh/pgg-stage-commit.sh`, `.codex/sh/pgg-git-publish.sh`, `.pgg/project.json` | `implementation/diffs/015_REFACTOR_stage_helper_deleted_path_staging.diff` | refactor | stage/publish helper staging now skips nonexistent untracked candidate paths while force-adding tracked ignored deletions |

## Generated Pgg Artifacts

| CRUD | Path | Notes |
|---|---|---|
| CREATE | `poggn/active/pgg-codex-subagent-schema-and-lang-sync/proposal.md` | pgg-add artifact |
| CREATE | `poggn/active/pgg-codex-subagent-schema-and-lang-sync/plan.md` | pgg-plan artifact |
| CREATE | `poggn/active/pgg-codex-subagent-schema-and-lang-sync/task.md` | pgg-plan artifact |
| CREATE | `poggn/active/pgg-codex-subagent-schema-and-lang-sync/spec/agents/codex-custom-agent-schema.md` | pgg-plan artifact |
| CREATE | `poggn/active/pgg-codex-subagent-schema-and-lang-sync/spec/routing/pgg-routing-metadata-preservation.md` | pgg-plan artifact |
| CREATE | `poggn/active/pgg-codex-subagent-schema-and-lang-sync/spec/i18n/generated-document-language-sync.md` | pgg-plan artifact |
| CREATE | `poggn/active/pgg-codex-subagent-schema-and-lang-sync/spec/migration/current-generated-agent-assets.md` | pgg-plan artifact |
| CREATE | `poggn/active/pgg-codex-subagent-schema-and-lang-sync/spec/qa/subagent-schema-and-lang-regression.md` | pgg-plan artifact |
| CREATE | `poggn/active/pgg-codex-subagent-schema-and-lang-sync/reviews/proposal.review.md` | pgg-add artifact |
| CREATE | `poggn/active/pgg-codex-subagent-schema-and-lang-sync/reviews/plan.review.md` | pgg-plan artifact |
| CREATE | `poggn/active/pgg-codex-subagent-schema-and-lang-sync/reviews/task.review.md` | pgg-plan artifact |
| CREATE | `poggn/active/pgg-codex-subagent-schema-and-lang-sync/implementation/index.md` | pgg-code artifact |
| CREATE | `poggn/active/pgg-codex-subagent-schema-and-lang-sync/implementation/diffs/*.diff` | pgg-code artifact |

## Verification

- `pnpm build`: pass
- `pnpm test`: pass
- `node packages/cli/dist/index.js update --cwd /config/workspace/poggn-ai`: pass, refreshed generated assets with no conflicts
- refactor verification: `pnpm build` pass, `pnpm test` pass after deleted/ignored path staging cleanup

## Notes

- `.codex/agents/main.toml` was removed intentionally because Codex loads files under `.codex/agents/` as standalone custom agents.
- The new routing manifest remains generated and managed at `.codex/add/AGENT-ROUTING.toml`.
- Pre-existing `add-img/*.png` dirty files remain untouched.
