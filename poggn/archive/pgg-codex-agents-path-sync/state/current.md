# Current State

## Topic

pgg-codex-agents-path-sync

## Current Stage

qa

## Goal

Codex agent routing 파일을 `.codex/agents/` 기준으로 생성하고 갱신하도록 pgg init/update 계약을 수정한다.

## Document Refs

- proposal: `poggn/active/pgg-codex-agents-path-sync/proposal.md`
- proposal review: `poggn/active/pgg-codex-agents-path-sync/reviews/proposal.review.md`
- plan: `poggn/active/pgg-codex-agents-path-sync/plan.md`
- task: `poggn/active/pgg-codex-agents-path-sync/task.md`
- plan review: `poggn/active/pgg-codex-agents-path-sync/reviews/plan.review.md`
- task review: `poggn/active/pgg-codex-agents-path-sync/reviews/task.review.md`
- spec:
  - `poggn/active/pgg-codex-agents-path-sync/spec/templates/codex-agent-template-paths.md`
  - `poggn/active/pgg-codex-agents-path-sync/spec/migration/root-agents-retirement.md`
  - `poggn/active/pgg-codex-agents-path-sync/spec/docs/routing-reference-sync.md`
  - `poggn/active/pgg-codex-agents-path-sync/spec/verification/init-update-path-regression.md`
  - `poggn/active/pgg-codex-agents-path-sync/workflow.reactflow.json`
- implementation: `poggn/active/pgg-codex-agents-path-sync/implementation/index.md`
- implementation diff:
  - `poggn/active/pgg-codex-agents-path-sync/implementation/diffs/001_UPDATE_template_agent_paths.diff`
  - `poggn/active/pgg-codex-agents-path-sync/implementation/diffs/002_UPDATE_agent_path_tests.diff`
  - `poggn/active/pgg-codex-agents-path-sync/implementation/diffs/003_UPDATE_routing_reference_docs.diff`
  - `poggn/active/pgg-codex-agents-path-sync/implementation/diffs/004_MOVE_managed_agent_files.diff`
- code review: `poggn/active/pgg-codex-agents-path-sync/reviews/code.review.md`
- refactor review: `poggn/active/pgg-codex-agents-path-sync/reviews/refactor.review.md`
- refactor diff:
  - `poggn/active/pgg-codex-agents-path-sync/implementation/diffs/005_UPDATE_agent_path_constants_refactor.diff`
- token audit: `poggn/active/pgg-codex-agents-path-sync/token/report.md`
- qa report: `poggn/active/pgg-codex-agents-path-sync/qa/report.md`

## Constraints

- project scope: `current-project`
- archive type: `fix`
- version bump: `patch`
- target version: `2.3.1`
- short name: `codex-sync`
- working branch: `ai/fix/2.3.1-codex-sync`
- release branch: `release/2.3.1-codex-sync`

## User Input Record

- `proposal.md#3-사용자-입력-질문-기록`

## Key Findings

- 현재 생성 템플릿과 manifest는 루트 `agents/main.toml`, `agents/*.toml`을 pgg-managed 파일로 사용한다.
- `pgg init`과 `pgg update`는 같은 `buildGeneratedFiles()`/managed manifest 경로 계약을 공유하므로 둘 다 수정 대상이다.
- `.codex/add/*` 문서와 `.codex/sh/pgg-state-pack.sh` 출력도 `agents/main.toml`을 참조하므로 함께 수정해야 한다.
- teams mode는 현재 `off`이며 `.codex/config.toml`의 `[features].multi_agent=false`와 동기화되어 있다.
- `syncProject()`는 더 이상 생성되지 않는 prior managed file을 retire하고, checksum이 다르면 `.pgg/backups/`에 백업 conflict를 남기는 기존 동작을 갖는다.

## Decisions

- archive_type: `fix`
- version_bump: `patch`
- target_version: `2.3.1`
- project_scope: `current-project`
- required path target: `.codex/agents/main.toml` and `.codex/agents/*.toml`
- out of scope: global Codex configuration and routing matrix changes
- migration policy: retire only prior pgg-managed root `agents/*`; preserve non-managed files under root `agents/`
- plan score: 93
- task score: 93
- implementation score: 94
- refactor score: 95
- pgg update result: created 12 `.codex/agents/*` files, retired 12 root `agents/*` managed files, and updated `.pgg/project.json`
- verification: `pnpm build` pass, `pnpm test` pass with 39 tests, `node packages/cli/dist/index.js update` pass, state-pack routing ref pass
- refactor result: `.codex/agents` path literals consolidated into template/test constants and helpers; generated update remained unchanged
- token audit score: 94
- token audit result: state-pack handoff is 258 words / 2,989 bytes, about 91.5% smaller than topic docs+specs and about 98.1% smaller than docs+specs+diff evidence
- QA score: 95
- QA decision: pass
- current-project verification: manual verification required because no verification command contract is declared

## Active Specs

- S1 `spec/templates/codex-agent-template-paths.md` | generated agent paths move to `.codex/agents/*`
- S2 `spec/migration/root-agents-retirement.md` | prior root managed paths retire safely on update
- S3 `spec/docs/routing-reference-sync.md` | docs/helpers refer to `.codex/agents/main.toml`
- S4 `spec/verification/init-update-path-regression.md` | init/update regression coverage

## Active Tasks

- T1 S1 | done | generated Codex agent template paths moved to `.codex/agents/*`
- T2 S2 | done | tests verify safe retirement/backups/preservation for old root `agents/*`
- T3 S3 | done | docs, root `AGENTS.md`, and state-pack references synchronized
- T4 S4 | done | regression tests updated for init/update path behavior
- T5 S4 | done | build, update, tests, state-pack verification recorded

## Acceptance Criteria

- `pgg init` creates `.codex/agents/main.toml` and `.codex/agents/*.toml`.
- `pgg update` tracks `.codex/agents/*` in `.pgg/project.json`.
- generated docs, skills, and state-pack output refer to `.codex/agents/main.toml`.
- root `agents/` is not left as a pgg-managed path after update.
- tests cover init/update path expectations.

## Audit Applicability

- [pgg-token]: [required] | workflow assets and state handoff references change.
- [pgg-performance]: [not_required] | no runtime performance-sensitive behavior is in scope.

## Changed Files

| CRUD | path | note |
|---|---|---|
| C | `poggn/active/pgg-codex-agents-path-sync` | topic documents, specs, implementation diffs, reviews, state, workflow |
| C | `.codex/agents` | generated Codex agent files under the new managed path |
| D | `agents` | retired prior root managed agent files |
| U | `packages/core/src/templates.ts` | generated path and routing reference source |
| U | `packages/core/dist/templates.js` | built template output |
| U | `packages/core/dist/templates.js.map` | built template source map |
| U | `packages/core/test/skill-generation.test.mjs` | init/update path and migration tests |
| C | `poggn/active/pgg-codex-agents-path-sync/reviews/refactor.review.md` | attributed refactor review |
| C | `poggn/active/pgg-codex-agents-path-sync/implementation/diffs/005_UPDATE_agent_path_constants_refactor.diff` | refactor diff evidence |
| C | `poggn/active/pgg-codex-agents-path-sync/token/report.md` | required token audit report |
| C | `poggn/active/pgg-codex-agents-path-sync/qa/report.md` | QA report and archive decision |
| U | `AGENTS.md` | root workflow routing reference |
| U | `.codex/add/WOKR-FLOW.md` | generated workflow routing reference |
| U | `.codex/add/STATE-CONTRACT.md` | generated state contract routing reference |
| U | `.codex/add/EXPERT-ROUTING.md` | generated expert routing source reference |
| U | `.codex/sh/pgg-state-pack.sh` | state-pack routing reference output |
| U | `.pgg/project.json` | managed file manifest now tracks `.codex/agents/*` |

## Dirty Worktree Baseline

- `add-img/4.png`
- `add-img/5.png`
- `add-img/6.png`
- `add-img/7.png`
- `add-img/8.png`
- `add-img/9.png`
- `add-img/10.png`
- `add-img/11.png`
- `add-img/12.png`

## Review Summary

- proposal score: 91
- plan score: 93
- task score: 93
- code score: 94
- refactor score: 95
- token score: 94
- QA score: 95
- blocking issues: none
- review refs:
  - `reviews/proposal.review.md`
  - `reviews/plan.review.md`
  - `reviews/task.review.md`
  - `reviews/code.review.md`
  - `reviews/refactor.review.md`
  - `token/report.md`
  - `qa/report.md`

## Verification Evidence

- `pnpm build`: pass
- `node packages/cli/dist/index.js update`: pass
- `pnpm test`: pass, 39 tests
- `.codex/sh/pgg-state-pack.sh pgg-codex-agents-path-sync`: pass, `agent_routing_ref: .codex/agents/main.toml`
- refactor `pnpm build`: pass
- refactor `pnpm test`: pass, 39 tests
- refactor `node packages/cli/dist/index.js update`: pass, unchanged
- token audit: pass, state-pack measured at 258 words / 2,989 bytes
- QA gate: pass
- current-project verification: manual verification required

## Git Publish Message

- title: fix: 2.3.1.Codex agents 경로 정렬
- why: Codex agent routing 파일이 루트 agents/에 생성되어 Codex 전용 설정 구조와 맞지 않는다. init/update 템플릿, managed manifest, 문서, state-pack 출력, 테스트 기준을 .codex/agents/로 맞춰 경로 이중화와 handoff 혼선을 줄인다.
- footer: Refs: pgg-codex-agents-path-sync

## Next Action

Run `.codex/sh/pgg-archive.sh pgg-codex-agents-path-sync` because QA passed.
