# Current State

## Topic

pgg-versioned-localized-commit-contract

## Current Stage

implementation

## Goal

Implement versioned, localized commit message governance across pgg task commits, QA completion commits, publish commits, workflow docs, and generated assets.

## Document Refs

- proposal: `poggn/active/pgg-versioned-localized-commit-contract/proposal.md`
- proposal review: `poggn/active/pgg-versioned-localized-commit-contract/reviews/proposal.review.md`
- plan: `poggn/active/pgg-versioned-localized-commit-contract/plan.md`
- task: `poggn/active/pgg-versioned-localized-commit-contract/task.md`
- plan review: `poggn/active/pgg-versioned-localized-commit-contract/reviews/plan.review.md`
- task review: `poggn/active/pgg-versioned-localized-commit-contract/reviews/task.review.md`
- implementation index: `poggn/active/pgg-versioned-localized-commit-contract/implementation/index.md`
- code review: `poggn/active/pgg-versioned-localized-commit-contract/reviews/code.review.md`
- spec:
  - `poggn/active/pgg-versioned-localized-commit-contract/spec/git/versioned-commit-subject-and-body.md`
  - `poggn/active/pgg-versioned-localized-commit-contract/spec/i18n/commit-message-language-contract.md`
  - `poggn/active/pgg-versioned-localized-commit-contract/spec/docs/generated-workflow-commit-contract.md`
  - `poggn/active/pgg-versioned-localized-commit-contract/spec/version/convention-and-major-bump-contract.md`
  - `poggn/active/pgg-versioned-localized-commit-contract/spec/qa/regression-proof-for-versioned-localized-commits.md`
- workflow: `poggn/active/pgg-versioned-localized-commit-contract/workflow.reactflow.json`
- dirty baseline: `poggn/active/pgg-versioned-localized-commit-contract/state/dirty-worktree-baseline.txt`

## Decisions

- project scope: `current-project`
- archive type: `feat`
- version bump: `major`
- target version: `1.0.0`
- short name: `commit-contract`
- working branch: `ai/feat/1.0.0-commit-contract`
- release branch: `release/1.0.0-commit-contract`
- auto mode: `on`
- teams mode: `off`
- git mode: `on`
- current project language: `en`
- canonical commit subject: `{convention}: [{version}]{commit message}`
- commit text language: Korean when `pgg lang=ko`, English when `pgg lang=en`
- allowed conventions: `feat`, `fix`, `docs`, `refactor`, `chore`, `remove`
- task-by-task commit cadence remains unchanged
- detailed commit bodies are required
- major version bump is required when existing user behavior is broken
- implementation status: runtime helpers, generated templates/docs, README, and regression tests are complete

## User Question Record

- `$pgg-add 버전 관리 방식을 변경 하겠습니다. 변경 내용은 기능, 문서 모두 반영해서 차 후 다른 프로젝트에서도 이어져야 합니다.`
- `commit할때 변경 내용이 너무 단순해서 뭐가 바뀐건지 제목만으로 알 수 없습니다.`
- `commit 메시지를 pgg lang이 ko면 한글로, en이면 영어로 해주셔야 합니다.`
- `commit 규격이 {convention}: [{version}]{commit message} 입니다.`
- `commit body에는 상세하게 어떤 내용이 바뀐지 적혀 있어야 합니다.`
- `work flow에서 하는 테스크당 코밋은 기존대로 유지합니다.`
- `앞으로 major 버전은 기존 사용자가 쓰던 방식이 깨졌다면 올려야 합니다. minor, patch는 그대로 유지 합니다.`
- `feat, fix, docs, refactor, chore, remove 를 명확하게 구분합니다.`

## Audit Applicability

- [pgg-token]: [not_required] | The topic changes workflow semantics and generated assets, not token-cost or handoff-size behavior.
- [pgg-performance]: [not_required] | The topic affects git/runtime/documentation governance rather than runtime performance.

## Changed Files

| CRUD | path | diff |
|---|---|---|
| CREATE | `poggn/active/pgg-versioned-localized-commit-contract/proposal.md` | 없음 |
| CREATE | `poggn/active/pgg-versioned-localized-commit-contract/reviews/proposal.review.md` | 없음 |
| CREATE | `poggn/active/pgg-versioned-localized-commit-contract/plan.md` | 없음 |
| CREATE | `poggn/active/pgg-versioned-localized-commit-contract/task.md` | 없음 |
| CREATE | `poggn/active/pgg-versioned-localized-commit-contract/spec/git/versioned-commit-subject-and-body.md` | 없음 |
| CREATE | `poggn/active/pgg-versioned-localized-commit-contract/spec/i18n/commit-message-language-contract.md` | 없음 |
| CREATE | `poggn/active/pgg-versioned-localized-commit-contract/spec/docs/generated-workflow-commit-contract.md` | 없음 |
| CREATE | `poggn/active/pgg-versioned-localized-commit-contract/spec/version/convention-and-major-bump-contract.md` | 없음 |
| CREATE | `poggn/active/pgg-versioned-localized-commit-contract/spec/qa/regression-proof-for-versioned-localized-commits.md` | 없음 |
| CREATE | `poggn/active/pgg-versioned-localized-commit-contract/reviews/plan.review.md` | 없음 |
| CREATE | `poggn/active/pgg-versioned-localized-commit-contract/reviews/task.review.md` | 없음 |
| CREATE | `poggn/active/pgg-versioned-localized-commit-contract/implementation/index.md` | 없음 |
| CREATE | `poggn/active/pgg-versioned-localized-commit-contract/reviews/code.review.md` | 없음 |
| CREATE | `poggn/active/pgg-versioned-localized-commit-contract/implementation/diffs/001_UPDATE__codex_sh_pgg-stage-commit_sh.diff` | 없음 |
| CREATE | `poggn/active/pgg-versioned-localized-commit-contract/implementation/diffs/002_UPDATE__codex_sh_pgg-git-publish_sh.diff` | 없음 |
| CREATE | `poggn/active/pgg-versioned-localized-commit-contract/implementation/diffs/003_UPDATE_packages_core_src_templates_ts.diff` | 없음 |
| CREATE | `poggn/active/pgg-versioned-localized-commit-contract/implementation/diffs/004_UPDATE__codex_add_WOKR-FLOW_md.diff` | 없음 |
| CREATE | `poggn/active/pgg-versioned-localized-commit-contract/implementation/diffs/005_UPDATE__codex_add_STATE-CONTRACT_md.diff` | 없음 |
| CREATE | `poggn/active/pgg-versioned-localized-commit-contract/implementation/diffs/006_UPDATE_AGENTS_md.diff` | 없음 |
| CREATE | `poggn/active/pgg-versioned-localized-commit-contract/implementation/diffs/007_UPDATE_README_md.diff` | 없음 |
| CREATE | `poggn/active/pgg-versioned-localized-commit-contract/implementation/diffs/008_UPDATE_packages_core_src_readme_ts.diff` | 없음 |
| CREATE | `poggn/active/pgg-versioned-localized-commit-contract/implementation/diffs/009_UPDATE_packages_core_test_git-publish_test_mjs.diff` | 없음 |
| CREATE | `poggn/active/pgg-versioned-localized-commit-contract/implementation/diffs/010_UPDATE_packages_core_test_skill-generation_test_mjs.diff` | 없음 |
| CREATE | `poggn/active/pgg-versioned-localized-commit-contract/implementation/diffs/011_UPDATE_packages_core_test_version-history_test_mjs.diff` | 없음 |
| CREATE | `poggn/active/pgg-versioned-localized-commit-contract/implementation/diffs/012_UPDATE_packages_core_dist_templates_js.diff` | 없음 |
| CREATE | `poggn/active/pgg-versioned-localized-commit-contract/implementation/diffs/013_UPDATE_packages_core_dist_templates_js_map.diff` | 없음 |
| CREATE | `poggn/active/pgg-versioned-localized-commit-contract/implementation/diffs/014_UPDATE_packages_core_dist_readme_js.diff` | 없음 |
| CREATE | `poggn/active/pgg-versioned-localized-commit-contract/implementation/diffs/015_UPDATE_packages_core_dist_readme_js_map.diff` | 없음 |
| CREATE | `poggn/active/pgg-versioned-localized-commit-contract/state/current.md` | 없음 |
| CREATE | `poggn/active/pgg-versioned-localized-commit-contract/state/history.ndjson` | 없음 |
| CREATE | `poggn/active/pgg-versioned-localized-commit-contract/state/dirty-worktree-baseline.txt` | 없음 |
| CREATE | `poggn/active/pgg-versioned-localized-commit-contract/workflow.reactflow.json` | 없음 |
| UPDATE | `.codex/sh/pgg-stage-commit.sh` | `implementation/diffs/001_UPDATE__codex_sh_pgg-stage-commit_sh.diff` |
| UPDATE | `.codex/sh/pgg-git-publish.sh` | `implementation/diffs/002_UPDATE__codex_sh_pgg-git-publish_sh.diff` |
| UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/003_UPDATE_packages_core_src_templates_ts.diff` |
| UPDATE | `.codex/add/WOKR-FLOW.md` | `implementation/diffs/004_UPDATE__codex_add_WOKR-FLOW_md.diff` |
| UPDATE | `.codex/add/STATE-CONTRACT.md` | `implementation/diffs/005_UPDATE__codex_add_STATE-CONTRACT_md.diff` |
| UPDATE | `AGENTS.md` | `implementation/diffs/006_UPDATE_AGENTS_md.diff` |
| UPDATE | `README.md` | `implementation/diffs/007_UPDATE_README_md.diff` |
| UPDATE | `packages/core/src/readme.ts` | `implementation/diffs/008_UPDATE_packages_core_src_readme_ts.diff` |
| UPDATE | `packages/core/test/git-publish.test.mjs` | `implementation/diffs/009_UPDATE_packages_core_test_git-publish_test_mjs.diff` |
| UPDATE | `packages/core/test/skill-generation.test.mjs` | `implementation/diffs/010_UPDATE_packages_core_test_skill-generation_test_mjs.diff` |
| UPDATE | `packages/core/test/version-history.test.mjs` | `implementation/diffs/011_UPDATE_packages_core_test_version-history_test_mjs.diff` |
| UPDATE | `packages/core/dist/templates.js` | `implementation/diffs/012_UPDATE_packages_core_dist_templates_js.diff` |
| UPDATE | `packages/core/dist/templates.js.map` | `implementation/diffs/013_UPDATE_packages_core_dist_templates_js_map.diff` |
| UPDATE | `packages/core/dist/readme.js` | `implementation/diffs/014_UPDATE_packages_core_dist_readme_js.diff` |
| UPDATE | `packages/core/dist/readme.js.map` | `implementation/diffs/015_UPDATE_packages_core_dist_readme_js_map.diff` |

## Last Expert Score

- phase: implementation
- score: 97
- blocking issues: none

## Open Items

- none

## Verification

- `pnpm build`: pass
- `pnpm test`: pass

## Next Action

`pgg-refactor`

## Git Publish Message

- title: feat: [1.0.0]versioned commit contract
- why: Commit subjects need convention, version, and project-language-aware wording so task and release history stays understandable across generated pgg projects.
- footer: Refs: pgg-versioned-localized-commit-contract
