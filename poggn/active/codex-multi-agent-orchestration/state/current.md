# Current State

## Topic

codex-multi-agent-orchestration

## Current Stage

refactor

## Goal

Codex multi-agent 설정과 pgg teams mode를 연결해, teams가 켜졌을 때만 Codex sub-agent 기능을 활성화하고 flow별 2-agent orchestration을 범용 agent TOML과 문서 계약으로 관리한다.

## Document Refs

- proposal: `poggn/active/codex-multi-agent-orchestration/proposal.md`
- proposal review: `poggn/active/codex-multi-agent-orchestration/reviews/proposal.review.md`
- plan: `poggn/active/codex-multi-agent-orchestration/plan.md`
- task: `poggn/active/codex-multi-agent-orchestration/task.md`
- plan review: `poggn/active/codex-multi-agent-orchestration/reviews/plan.review.md`
- task review: `poggn/active/codex-multi-agent-orchestration/reviews/task.review.md`
- spec:
  - `poggn/active/codex-multi-agent-orchestration/spec/config/codex-config-and-teams-sync.md`
  - `poggn/active/codex-multi-agent-orchestration/spec/agents/agent-role-toml-contract.md`
  - `poggn/active/codex-multi-agent-orchestration/spec/routing/two-agent-flow-orchestration.md`
  - `poggn/active/codex-multi-agent-orchestration/spec/docs/generated-workflow-doc-sync.md`
  - `poggn/active/codex-multi-agent-orchestration/spec/token/multi-agent-context-budget.md`
  - `poggn/active/codex-multi-agent-orchestration/spec/verification/codex-schema-and-compatibility.md`
- workflow: `poggn/active/codex-multi-agent-orchestration/workflow.reactflow.json`
- dirty baseline: `poggn/active/codex-multi-agent-orchestration/state/dirty-worktree-baseline.txt`
- implementation: `poggn/active/codex-multi-agent-orchestration/implementation/index.md`
- implementation diff:
  - `poggn/active/codex-multi-agent-orchestration/implementation/diffs/001_UPDATE_packages_core_templates.diff`
  - `poggn/active/codex-multi-agent-orchestration/implementation/diffs/002_UPDATE_generated_workflow_docs_and_helpers.diff`
  - `poggn/active/codex-multi-agent-orchestration/implementation/diffs/003_CREATE_codex_config_and_agents.diff`
  - `poggn/active/codex-multi-agent-orchestration/implementation/diffs/004_UPDATE_core_skill_generation_tests.diff`
  - `poggn/active/codex-multi-agent-orchestration/implementation/diffs/005_UPDATE_project_manifest.diff`
- code review: `poggn/active/codex-multi-agent-orchestration/reviews/code.review.md`
- token audit: `poggn/active/codex-multi-agent-orchestration/token/report.md`
- refactor review: `poggn/active/codex-multi-agent-orchestration/reviews/refactor.review.md`
- refactor diff: `poggn/active/codex-multi-agent-orchestration/implementation/diffs/006_UPDATE_state_pack_route_refactor.diff`

## Constraints

- project scope: `current-project`
- archive type: `feat`
- version bump: `minor`
- target version: `2.3.0`
- short name: `codex-orchestration`
- working branch: `ai/feat/2.3.0-codex-orchestration`
- release branch: `release/2.3.0-codex-orchestration`

## Decisions

- `archive_type=feat`, `version_bump=minor`, `target_version=2.3.0`.
- Codex config는 project-local `.codex/config.toml` 생성을 우선 검토한다.
- `multi_agent` 값은 `.pgg/project.json`의 `teamsMode`에서 파생한다.
- 기본 token optimization 값은 `max_threads=4`, `max_depth=1`로 제안한다.
- 각 core flow와 optional audit는 정확히 2개의 primary agent만 사용한다.
- `agents/main.toml`을 agent index/main page로 두고 flow routing matrix를 유지한다.
- 범용 fallback/support agent로 `project-generalist`, `docs-researcher`를 추가 제안한다.
- plan 단계에서 Codex CLI config schema와 custom agent role mapping을 primary source 또는 installed behavior로 검증한다.
- Local Codex CLI evidence: `multi_agent` is a stable feature flag, `multi_agent_v2` is under development, and config overrides use dotted TOML paths.
- Plan decomposes work into six specs: config sync, agent TOML contract, two-agent routing, generated docs sync, token budget, Codex compatibility verification.
- Required implementation order is config sync, agent files, routing docs, generated templates, tests, then required token audit.
- Implementation centralizes agent role definitions and flow routing in `packages/core/src/templates.ts`.
- Generated `.codex/config.toml` keeps `[features].multi_agent=false` while current `.pgg/project.json` `teamsMode` is `off`; tests verify it changes to `true` when teams mode is turned on.
- Generated `agents/main.toml` is the agent main page and assigns exactly two primary agents to every core flow and optional audit.
- Generated `agents/*.toml` covers Product Manager, UX/UI Expert, Domain Expert, Software Architect, Senior Backend Engineer, Tech Lead, Code Reviewer, QA/Test Engineer, SRE/Operations Engineer, Project Generalist, and Docs Researcher.
- `pgg-state-pack.sh` now emits `multi_agent`, `agent_max_threads`, `agent_max_depth`, `agent_routing_ref`, and stage-specific `primary_agents` for minimal teams handoff.
- Implementation evidence uses local installed Codex behavior: `codex features list` reports `multi_agent` as stable, and the current value remains `false` because teams mode is off.
- Token audit confirms state-pack handoff is 156 words / 2,475 bytes.
- Token audit compares naive two-agent proposal/plan/task/spec handoff at 6,016 words with state-pack two-agent handoff at 312 words, an estimated 94.8% reduction.
- Token audit confirms implementation diffs are the largest token surface at 16,527 words and must stay opt-in by diff ref.
- Refactor moves state-pack primary agent case generation to helpers backed by `FLOW_AGENT_ROUTES`, removing duplicated route literals from `statePackSh()`.
- Refactor adds pgg flow-name aliases such as `pgg-code`, `pgg-token`, and `pgg-refactor` to state-pack route matching while preserving the existing compact comma-separated `primary_agents` output.

## User Question Record

- `$pgg-add codex가 사용하는 멀티 에이전트(서브 에이전트) 기능이 필요합니다.`
- `config.toml : codex가 사용하는 설정파일로 그외 추가 기능 구현 필요하며 multi_agent는 teams가 on일때 true false 처리하고 에이전트 개수와 깊이는 알아서 최적의 세팅 해주세요. 토큰 최적화로`
- `[features] multi_agent = true`
- `[agents] max_threads = x, max_depth = x`
- `AGENTS.md : 전체 에이전트들을 제어하기 위한 공통 규약 과 제약 입니다.`
- `agents/*.toml : AGNETS.md에 설명한 기능 모두 각 파일이 있어야 합니다. 에이전트 메인 페이지 설정이 필요합니다.`
- `각 flow에서 필요한 agents를 2개 사용하도록 만들어야 합니다.`
- `에이전트들은 전부 범용으로 어떤 프로젝트에서도 최선책을 보여줘야 합니다.`
- `절대적으로 따라야 하는건 codex 가이드 라인에서 권장하거나 가이드에 지침대로 해야 합니다.`

## Audit Applicability

- `pgg-token`: `required` | multi-agent orchestration과 token 최적화가 핵심 요구사항이므로 handoff/context/token surface 검토가 필요하다.
- `pgg-performance`: `not_required` | 실제 runtime 성능 최적화보다 config/document/workflow contract 변경이 중심이며 성능 계측 대상이 아직 없다.
- `pgg-token result`: `pass` | `poggn/active/codex-multi-agent-orchestration/token/report.md`

## Git Publish Message

- title: feat: 2.3.0.codex 멀티 에이전트
- why: pgg teams mode가 Codex sub-agent 설정과 연결되지 않아 flow별 agent orchestration, token 최적화, 공통 agent 규약을 프로젝트 내부 설정과 문서로 관리해야 한다.
- footer: Refs: codex-multi-agent-orchestration

## Changed Files

| CRUD | path | diffRef |
|---|---|---|
| CREATE | `poggn/active/codex-multi-agent-orchestration/proposal.md` | |
| CREATE | `poggn/active/codex-multi-agent-orchestration/reviews/proposal.review.md` | |
| CREATE | `poggn/active/codex-multi-agent-orchestration/state/current.md` | |
| CREATE | `poggn/active/codex-multi-agent-orchestration/state/history.ndjson` | |
| CREATE | `poggn/active/codex-multi-agent-orchestration/state/dirty-worktree-baseline.txt` | |
| CREATE | `poggn/active/codex-multi-agent-orchestration/workflow.reactflow.json` | |
| CREATE | `poggn/active/codex-multi-agent-orchestration/plan.md` | |
| CREATE | `poggn/active/codex-multi-agent-orchestration/task.md` | |
| CREATE | `poggn/active/codex-multi-agent-orchestration/spec/config/codex-config-and-teams-sync.md` | |
| CREATE | `poggn/active/codex-multi-agent-orchestration/spec/agents/agent-role-toml-contract.md` | |
| CREATE | `poggn/active/codex-multi-agent-orchestration/spec/routing/two-agent-flow-orchestration.md` | |
| CREATE | `poggn/active/codex-multi-agent-orchestration/spec/docs/generated-workflow-doc-sync.md` | |
| CREATE | `poggn/active/codex-multi-agent-orchestration/spec/token/multi-agent-context-budget.md` | |
| CREATE | `poggn/active/codex-multi-agent-orchestration/spec/verification/codex-schema-and-compatibility.md` | |
| CREATE | `poggn/active/codex-multi-agent-orchestration/reviews/plan.review.md` | |
| CREATE | `poggn/active/codex-multi-agent-orchestration/reviews/task.review.md` | |
| UPDATE | `packages/core/src/templates.ts` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/001_UPDATE_packages_core_templates.diff` |
| UPDATE | `packages/core/dist/templates.js` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/001_UPDATE_packages_core_templates.diff` |
| UPDATE | `packages/core/dist/templates.js.map` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/001_UPDATE_packages_core_templates.diff` |
| UPDATE | `packages/core/test/skill-generation.test.mjs` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/004_UPDATE_core_skill_generation_tests.diff` |
| UPDATE | `.pgg/project.json` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/005_UPDATE_project_manifest.diff` |
| CREATE | `.codex/config.toml` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/003_CREATE_codex_config_and_agents.diff` |
| CREATE | `agents/main.toml` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/003_CREATE_codex_config_and_agents.diff` |
| CREATE | `agents/product-manager.toml` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/003_CREATE_codex_config_and_agents.diff` |
| CREATE | `agents/ux-ui-expert.toml` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/003_CREATE_codex_config_and_agents.diff` |
| CREATE | `agents/domain-expert.toml` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/003_CREATE_codex_config_and_agents.diff` |
| CREATE | `agents/software-architect.toml` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/003_CREATE_codex_config_and_agents.diff` |
| CREATE | `agents/senior-backend-engineer.toml` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/003_CREATE_codex_config_and_agents.diff` |
| CREATE | `agents/tech-lead.toml` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/003_CREATE_codex_config_and_agents.diff` |
| CREATE | `agents/code-reviewer.toml` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/003_CREATE_codex_config_and_agents.diff` |
| CREATE | `agents/qa-test-engineer.toml` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/003_CREATE_codex_config_and_agents.diff` |
| CREATE | `agents/sre-operations-engineer.toml` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/003_CREATE_codex_config_and_agents.diff` |
| CREATE | `agents/project-generalist.toml` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/003_CREATE_codex_config_and_agents.diff` |
| CREATE | `agents/docs-researcher.toml` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/003_CREATE_codex_config_and_agents.diff` |
| UPDATE | `AGENTS.md` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/002_UPDATE_generated_workflow_docs_and_helpers.diff` |
| UPDATE | `.codex/add/WOKR-FLOW.md` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/002_UPDATE_generated_workflow_docs_and_helpers.diff` |
| UPDATE | `.codex/add/STATE-CONTRACT.md` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/002_UPDATE_generated_workflow_docs_and_helpers.diff` |
| CREATE | `.codex/add/EXPERT-ROUTING.md` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/002_UPDATE_generated_workflow_docs_and_helpers.diff` |
| UPDATE | `.codex/sh/pgg-state-pack.sh` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/002_UPDATE_generated_workflow_docs_and_helpers.diff` |
| UPDATE | `.codex/skills/pgg-add/SKILL.md` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/002_UPDATE_generated_workflow_docs_and_helpers.diff` |
| CREATE | `.codex/skills/pgg-plan/SKILL.md` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/002_UPDATE_generated_workflow_docs_and_helpers.diff` |
| CREATE | `.codex/skills/pgg-code/SKILL.md` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/002_UPDATE_generated_workflow_docs_and_helpers.diff` |
| CREATE | `.codex/skills/pgg-refactor/SKILL.md` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/002_UPDATE_generated_workflow_docs_and_helpers.diff` |
| CREATE | `.codex/skills/pgg-qa/SKILL.md` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/002_UPDATE_generated_workflow_docs_and_helpers.diff` |
| CREATE | `.codex/skills/pgg-token/SKILL.md` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/002_UPDATE_generated_workflow_docs_and_helpers.diff` |
| CREATE | `.codex/skills/pgg-performance/SKILL.md` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/002_UPDATE_generated_workflow_docs_and_helpers.diff` |
| CREATE | `poggn/active/codex-multi-agent-orchestration/implementation/index.md` | |
| CREATE | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/001_UPDATE_packages_core_templates.diff` | |
| CREATE | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/002_UPDATE_generated_workflow_docs_and_helpers.diff` | |
| CREATE | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/003_CREATE_codex_config_and_agents.diff` | |
| CREATE | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/004_UPDATE_core_skill_generation_tests.diff` | |
| CREATE | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/005_UPDATE_project_manifest.diff` | |
| CREATE | `poggn/active/codex-multi-agent-orchestration/reviews/code.review.md` | |
| UPDATE | `poggn/active/codex-multi-agent-orchestration/workflow.reactflow.json` | |
| CREATE | `poggn/active/codex-multi-agent-orchestration/token/report.md` | |
| UPDATE | `packages/core/src/templates.ts` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/006_UPDATE_state_pack_route_refactor.diff` |
| UPDATE | `packages/core/dist/templates.js` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/006_UPDATE_state_pack_route_refactor.diff` |
| UPDATE | `packages/core/dist/templates.js.map` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/006_UPDATE_state_pack_route_refactor.diff` |
| UPDATE | `packages/core/test/skill-generation.test.mjs` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/006_UPDATE_state_pack_route_refactor.diff` |
| UPDATE | `.codex/sh/pgg-state-pack.sh` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/006_UPDATE_state_pack_route_refactor.diff` |
| UPDATE | `.pgg/project.json` | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/006_UPDATE_state_pack_route_refactor.diff` |
| CREATE | `poggn/active/codex-multi-agent-orchestration/implementation/diffs/006_UPDATE_state_pack_route_refactor.diff` | |
| CREATE | `poggn/active/codex-multi-agent-orchestration/reviews/refactor.review.md` | |

## Last Expert Score

- phase: refactor
- score: 96
- blocking issues: none

## Open Items

- status: ready_for_qa
- required audit: `pgg-token` completed

## Verification

- proposal document review: pass
- plan document review: pass
- task document review: pass
- `./.codex/sh/pgg-gate.sh pgg-add codex-multi-agent-orchestration`: pass
- `./.codex/sh/pgg-gate.sh pgg-plan codex-multi-agent-orchestration`: pass
- `git diff --check`: pass
- `workflow.reactflow.json` parse: pass
- `node --check packages/core/dist/templates.js`: pass
- local Codex CLI feature inspection: pass
- `pnpm --filter @pgg/core build`: pass
- `pnpm --filter @pgg/core test`: pass, 38 tests
- `pnpm build`: pass
- `pnpm test`: pass, 38 tests
- `bash -n .codex/sh/pgg-state-pack.sh`: pass
- `codex features list`: pass, `multi_agent` stable and currently false because teams mode is off
- stale three-agent routing search: pass
- `./.codex/sh/pgg-state-pack.sh codex-multi-agent-orchestration`: pass
- `./.codex/sh/pgg-gate.sh pgg-code codex-multi-agent-orchestration`: pass
- token audit measurements: pass
- `./.codex/sh/pgg-gate.sh pgg-token codex-multi-agent-orchestration`: pass
- `pnpm --filter @pgg/core test`: pass, 38 tests
- `pnpm build`: pass
- `pnpm test`: pass, 38 tests
- refactor review: pass
- `./.codex/sh/pgg-gate.sh pgg-refactor codex-multi-agent-orchestration`: pass
- current-project verification contract: `manual verification required`
