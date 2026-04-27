# Current State

## Topic

pgg-codex-subagent-schema-and-lang-sync

## Current Stage

refactor

## Goal

Codex subagent 공식 스키마에 맞게 generated agent files를 수정하고, init/update/lang으로 생성되는 문서형 자산의 ko/en 전환 누락을 바로잡는다.

## Document Refs

- proposal: `poggn/active/pgg-codex-subagent-schema-and-lang-sync/proposal.md`
- proposal review: `poggn/active/pgg-codex-subagent-schema-and-lang-sync/reviews/proposal.review.md`
- plan: `poggn/active/pgg-codex-subagent-schema-and-lang-sync/plan.md`
- task: `poggn/active/pgg-codex-subagent-schema-and-lang-sync/task.md`
- plan review: `poggn/active/pgg-codex-subagent-schema-and-lang-sync/reviews/plan.review.md`
- task review: `poggn/active/pgg-codex-subagent-schema-and-lang-sync/reviews/task.review.md`
- implementation index: `poggn/active/pgg-codex-subagent-schema-and-lang-sync/implementation/index.md`
- code review: `poggn/active/pgg-codex-subagent-schema-and-lang-sync/reviews/code.review.md`
- refactor review: `poggn/active/pgg-codex-subagent-schema-and-lang-sync/reviews/refactor.review.md`
- spec:
  - `poggn/active/pgg-codex-subagent-schema-and-lang-sync/spec/agents/codex-custom-agent-schema.md`
  - `poggn/active/pgg-codex-subagent-schema-and-lang-sync/spec/routing/pgg-routing-metadata-preservation.md`
  - `poggn/active/pgg-codex-subagent-schema-and-lang-sync/spec/i18n/generated-document-language-sync.md`
  - `poggn/active/pgg-codex-subagent-schema-and-lang-sync/spec/migration/current-generated-agent-assets.md`
  - `poggn/active/pgg-codex-subagent-schema-and-lang-sync/spec/qa/subagent-schema-and-lang-regression.md`
- workflow: `poggn/active/pgg-codex-subagent-schema-and-lang-sync/workflow.reactflow.json`
- dirty baseline: `poggn/active/pgg-codex-subagent-schema-and-lang-sync/state/dirty-worktree-baseline.txt`

## Constraints

- project scope: `current-project`
- archive type: `fix`
- version bump: `patch`
- target version: `2.3.3`
- short name: `codex-sync`
- working branch: `ai/fix/2.3.3-codex-sync`
- release branch: `release/2.3.3-codex-sync`

## Decisions

- auto mode: `on`
- teams mode: `off`
- current project language: `ko`
- official source: `https://developers.openai.com/codex/subagents`
- Codex custom agent files must use `name`, `description`, `developer_instructions`; optional fields must be config-compatible.
- pgg-specific routing metadata must not be emitted as unknown fields in `.codex/agents/*.toml`.
- `main.toml` under `.codex/agents/` cannot remain an unsupported routing manifest if Codex loads it as a standalone custom agent file.
- Generated docs/assets from `pgg init`, `pgg update`, and `pgg lang` must follow `.pgg/project.json` language consistently.
- plan status: reviewed
- task status: reviewed
- spec boundaries: S1 custom agent schema, S2 routing preservation, S3 generated language sync, S4 current asset migration, S5 regression proof
- implementation status: reviewed
- refactor status: reviewed
- routing manifest path: `.codex/add/AGENT-ROUTING.toml`
- `.codex/agents/main.toml`: removed from generated custom-agent load path
- custom agent files: generated with `name`, `description`, and `developer_instructions`

## User Question Record

- `$pgg-add agents 문서 에러가 많습니다. https://developers.openai.com/codex/subagents 참조 해주시고 하위 내용 수정 부탁드립니다.`
- `init, update로 생성되는 문서중에 lang에 따라 한글 영어 전환이 안되는게 있습니다.`
- Warnings include `unknown field category` in generated agent role files and `unknown field activation` in `.codex/agents/main.toml`.

## Audit Applicability

- [pgg-token]: [not_required] | The topic repairs generated schema and localization behavior; it does not change handoff size or token-cost strategy.
- [pgg-performance]: [not_required] | The topic affects generated workflow/config documents and tests, not runtime performance paths.

## Changed Files

| CRUD | path | diff |
|---|---|---|
| CREATE | `poggn/active/pgg-codex-subagent-schema-and-lang-sync/proposal.md` | 없음 |
| CREATE | `poggn/active/pgg-codex-subagent-schema-and-lang-sync/reviews/proposal.review.md` | 없음 |
| CREATE | `poggn/active/pgg-codex-subagent-schema-and-lang-sync/state/current.md` | 없음 |
| CREATE | `poggn/active/pgg-codex-subagent-schema-and-lang-sync/state/history.ndjson` | 없음 |
| CREATE | `poggn/active/pgg-codex-subagent-schema-and-lang-sync/state/dirty-worktree-baseline.txt` | 없음 |
| CREATE | `poggn/active/pgg-codex-subagent-schema-and-lang-sync/workflow.reactflow.json` | 없음 |
| CREATE | `poggn/active/pgg-codex-subagent-schema-and-lang-sync/plan.md` | 없음 |
| CREATE | `poggn/active/pgg-codex-subagent-schema-and-lang-sync/task.md` | 없음 |
| CREATE | `poggn/active/pgg-codex-subagent-schema-and-lang-sync/spec/agents/codex-custom-agent-schema.md` | 없음 |
| CREATE | `poggn/active/pgg-codex-subagent-schema-and-lang-sync/spec/routing/pgg-routing-metadata-preservation.md` | 없음 |
| CREATE | `poggn/active/pgg-codex-subagent-schema-and-lang-sync/spec/i18n/generated-document-language-sync.md` | 없음 |
| CREATE | `poggn/active/pgg-codex-subagent-schema-and-lang-sync/spec/migration/current-generated-agent-assets.md` | 없음 |
| CREATE | `poggn/active/pgg-codex-subagent-schema-and-lang-sync/spec/qa/subagent-schema-and-lang-regression.md` | 없음 |
| CREATE | `poggn/active/pgg-codex-subagent-schema-and-lang-sync/reviews/plan.review.md` | 없음 |
| CREATE | `poggn/active/pgg-codex-subagent-schema-and-lang-sync/reviews/task.review.md` | 없음 |
| CREATE | `poggn/active/pgg-codex-subagent-schema-and-lang-sync/implementation/index.md` | 없음 |
| CREATE | `poggn/active/pgg-codex-subagent-schema-and-lang-sync/reviews/code.review.md` | 없음 |
| CREATE | `.codex/add/AGENT-ROUTING.toml` | `implementation/diffs/005_CREATE__codex_add_AGENT-ROUTING_toml.diff` |
| UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/001_UPDATE_packages_core_src_templates_ts.diff` |
| UPDATE | `packages/core/test/skill-generation.test.mjs` | `implementation/diffs/002_UPDATE_packages_core_test_skill-generation_test_mjs.diff` |
| UPDATE | `packages/core/dist/templates.js` | `implementation/diffs/003_UPDATE_packages_core_dist_templates_js.diff` |
| UPDATE | `packages/core/dist/templates.js.map` | `implementation/diffs/004_UPDATE_packages_core_dist_templates_js_map.diff` |
| UPDATE | `.codex/add/WOKR-FLOW.md` | `implementation/diffs/006_UPDATE__codex_add_WOKR-FLOW_md.diff` |
| UPDATE | `.codex/add/STATE-CONTRACT.md` | `implementation/diffs/007_UPDATE__codex_add_STATE-CONTRACT_md.diff` |
| UPDATE | `.codex/add/EXPERT-ROUTING.md` | `implementation/diffs/008_UPDATE__codex_add_EXPERT-ROUTING_md.diff` |
| UPDATE | `AGENTS.md` | `implementation/diffs/009_UPDATE_AGENTS_md.diff` |
| UPDATE | `.codex/sh/pgg-state-pack.sh` | `implementation/diffs/010_UPDATE__codex_sh_pgg-state-pack_sh.diff` |
| UPDATE | `.pgg/project.json` | `implementation/diffs/011_UPDATE__pgg_project_json.diff` |
| DELETE | `.codex/agents/main.toml` | `implementation/diffs/012_DELETE__codex_agents_main_toml.diff` |
| UPDATE | `.codex/agents/*.toml` | `implementation/diffs/013_UPDATE__codex_agents_role_files.diff` |
| UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/014_REFACTOR_agent_language_classification.diff` |
| UPDATE | `packages/core/test/skill-generation.test.mjs` | `implementation/diffs/014_REFACTOR_agent_language_classification.diff` |
| UPDATE | `packages/core/dist/templates.js` | `implementation/diffs/014_REFACTOR_agent_language_classification.diff` |
| UPDATE | `packages/core/dist/templates.js.map` | `implementation/diffs/014_REFACTOR_agent_language_classification.diff` |
| UPDATE | `.codex/agents/*.toml` | `implementation/diffs/014_REFACTOR_agent_language_classification.diff` |
| UPDATE | `.pgg/project.json` | `implementation/diffs/014_REFACTOR_agent_language_classification.diff` |
| UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/015_REFACTOR_stage_helper_deleted_path_staging.diff` |
| UPDATE | `packages/core/dist/templates.js` | `implementation/diffs/015_REFACTOR_stage_helper_deleted_path_staging.diff` |
| UPDATE | `packages/core/dist/templates.js.map` | `implementation/diffs/015_REFACTOR_stage_helper_deleted_path_staging.diff` |
| UPDATE | `.codex/sh/pgg-stage-commit.sh` | `implementation/diffs/015_REFACTOR_stage_helper_deleted_path_staging.diff` |
| UPDATE | `.codex/sh/pgg-git-publish.sh` | `implementation/diffs/015_REFACTOR_stage_helper_deleted_path_staging.diff` |
| UPDATE | `.pgg/project.json` | `implementation/diffs/015_REFACTOR_stage_helper_deleted_path_staging.diff` |
| CREATE | `poggn/active/pgg-codex-subagent-schema-and-lang-sync/reviews/refactor.review.md` | 없음 |

## Last Expert Score

- phase: refactor
- score: 98
- blocking issues: none

## Open Items

- none

## Verification

- Proposal evidence checked against official OpenAI Codex subagents documentation.
- Local template source and generated malformed agent files inspected.
- `./.codex/sh/pgg-gate.sh pgg-code pgg-codex-subagent-schema-and-lang-sync`: pass
- `pnpm build`: pass
- `pnpm test`: pass
- `node packages/cli/dist/index.js update --cwd /config/workspace/poggn-ai`: pass, no conflicts
- refactor cleanup verified mixed Korean/English role classification text was removed from generated agent files
- refactor cleanup verified deleted/ignored candidate path staging works through `pnpm test`

## Next Action

`pgg-qa`

## Git Publish Message

- title: fix: 2.3.3.Codex agent schema sync
- why: Generated Codex agent files must match the official custom agent schema and generated workflow documents must follow the configured project language so init, update, and lang results are usable without parser warnings or mixed-language docs.
- footer: Refs: pgg-codex-subagent-schema-and-lang-sync
