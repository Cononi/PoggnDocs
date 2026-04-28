# Current State

## Topic

pgg-workflow-token-commit-contract

## Current Stage

qa

## Goal

workflow process 모바일 형태 유지, token 측정 정확도, task 행 단위 commit, pgg lang 기반 문서/주석 계약을 구현한다.

## Next Action

QA pass 상태다. archive helper를 실행해 version 기록과 release 처리를 진행한다.

## Constraints

- project scope: `current-project`
- archive type: `feat`
- version bump: `major`
- target version: `3.0.0`
- short name: `token-commit-contract`
- working branch: `ai/feat/3.0.0-token-commit-contract`
- release branch: `release/3.0.0-token-commit-contract`

## User Question Record Ref

- `proposal.md` 섹션 `3. 사용자 입력 질문 기록`

## Requirements Summary

- workflow process는 모바일에서도 세로 stack으로 바뀌지 않고 원래 형태를 유지한 채 동적으로 축소되어야 한다.
- token 표시는 LLM clip과 Local clip으로 분리한다.
- LLM token은 Codex response usage metadata 기반 실제 사용량만 요금 계산용 actual 값으로 기록한다.
- Local token은 shell/CLI/local helper 등 Codex 응답 외 사용자 시스템 실행에서 만들어진 token 또는 token-equivalent processing 값으로 분리한다.
- token 측정은 요금 계산 지표로 쓰일 수 있으므로 actual, unavailable, estimated를 엄격히 구분한다.
- `pgg-code`는 `task.md` Task 목록의 `T1...N` 행 1개 완료마다 commit 처리한다.
- task commit 제목은 작업 내용이며, body 최상단은 dependencies, 그 아래는 완료 조건, footer는 완료 조건에 명시된 각 task 내용으로 구성한다.
- 모든 pgg-* flow 문서와 pgg가 생성/수정하는 코드 주석은 pgg lang 설정 언어를 따른다.

## Scope

- dashboard workflow process responsive scaling
- dashboard token clip UI와 source별 summary
- token ledger schema와 actual/unavailable/estimated 측정 계약
- pgg-code task-row commit cadence와 commit message 구조
- pgg lang 기반 문서/주석 생성 계약
- `.codex/add/*`, `.codex/skills/pgg-*`, `.codex/sh/*.sh`, core templates/update path 전파

## Plan Summary

- `S1`: `spec/dashboard/mobile-workflow-process-scaling.md`
- `S2`: `spec/token/accurate-token-measurement-ledger.md`
- `S3`: `spec/dashboard/token-source-clips.md`
- `S4`: `spec/git/task-row-commit-governance.md`
- `S5`: `spec/i18n/pgg-lang-documentation-and-comments.md`
- `S6`: `spec/pgg/init-update-propagation.md`

## Task Summary

- `T1`: done | token ledger가 LLM actual, LLM unavailable, Local token을 정확히 분리해 집계하도록 core model과 tests를 보강했다.
- `T2`: done | dashboard Workflow Progress와 timeline/file token 표시를 LLM clip과 Local clip으로 분리했다.
- `T3`: done | 모바일 Workflow Progress process가 세로 stack으로 바뀌지 않고 형태 유지 scale down을 하도록 UI를 조정했다.
- `T4`: done | `pgg-code` task-row commit cadence와 task commit message body/footer 구조를 helper, skill, template, tests에 구현했다.
- `T5`: done | 모든 pgg-* flow 문서와 pgg 생성/수정 코드 주석이 pgg lang을 따르도록 문서/skill/review/QA 계약을 갱신했다.
- `T6`: done | source templates, generated workspace assets, dist, README, regression tests를 동기화해 init/update 전파를 보장했다.

## Out Of Scope

- 외부 billing API 정산
- provider별 token 단가표 관리
- 사용자가 직접 작성한 일반 애플리케이션 코드 주석 일괄 번역
- workflow core stage 순서 변경
- archive topic reactivation

## Implementation Summary

- `TopicTokenUsageRecord`에 `usageMetadataAvailable` field를 추가했다.
- LLM actual 합계는 `source=llm`, `measurement=actual`, `estimated=false`, `usageMetadataAvailable=true` record만 포함한다.
- LLM unavailable record와 usage metadata가 없는 LLM actual 후보는 요금용 actual 합계에서 제외된다.
- dashboard shared model과 core dist output을 source 변경에 맞춰 갱신했다.
- Workflow Progress title에서 token 결합 문구를 제거하고 LLM/Local token을 별도 clip row로 표시한다.
- timeline row와 file preview도 같은 token clip helper를 사용한다.
- Workflow Progress track은 mobile에서도 `repeat(stepCount, minmax(0, 1fr))` 형태를 유지한다.
- mobile connector는 vertical line이 아니라 horizontal connector를 유지하고, node/icon/text는 clamp 기반 sizing으로 container 폭에 맞춰 줄어든다.
- `.codex/sh/pgg-stage-commit.sh`는 `PGG_TASK_ID`, `PGG_TASK_DEPENDENCIES`, `PGG_TASK_COMPLETION_CRITERIA`를 받아 commit body와 `stage-commit` evidence에 기록한다.
- task commit body는 `Dependencies`가 최상단, 그 아래 pgg lang에 맞는 완료 조건 section, 이후 Why/Changes 순서로 작성된다.
- task completion criteria가 있으면 footer fallback도 완료 조건 기반으로 만들어진다.
- generated template와 current workspace pgg-code/WOKR 문서가 Task 목록 `T1...N` 행 단위 commit cadence를 설명한다.
- generated pgg 문서, state/history 문구, commit message, pgg 생성/수정 코드 주석이 `pgg lang`을 따르도록 source template, README, 현재 workspace pgg 문서, pgg-* skill에 Language Contract를 추가했다.
- code review와 QA가 pgg 생성/수정 문서와 코드 주석 언어 위반을 확인하도록 review rubric을 갱신했다.
- ko/en fixture에서 generated workflow 문서와 pgg comment rule이 project language를 따르는지 검증하는 회귀 테스트를 추가했다.
- `pgg update` 재실행이 `status: unchanged`, `conflicts: 0`으로 끝나 source template와 현재 workspace generated asset의 계약 유지가 확인됐다.
- update 과정에서 source template의 task commit body default env 계약이 `.codex/sh/pgg-stage-commit.sh`, `.codex/sh/pgg-git-publish.sh`에 동기화됐다.

## Verification

- `pnpm --filter @pgg/core test`: pass, 54 tests.
- `pnpm --filter @pgg/dashboard build`: pass, Vite chunk-size warning only.
- `rg` mobile stack/vertical connector pattern check: pass, workflow process track의 xs `1fr` stack과 vertical connector 패턴 없음.
- `pnpm --filter @pgg/core test`: first run failed because shared publish helper builder referenced unset task env; after template default-value fix, pass, 54 tests.
- `pnpm --filter @pgg/core test`: first T5 run failed because the new Korean assertion was stricter than the actual localized sentence; after regex adjustment, pass, 55 tests.
- `node packages/cli/dist/index.js update`: first run updated helper files and reported one checksum conflict for the already-modified stage commit helper; second run returned `status: unchanged`, `conflicts: 0`.
- `pnpm --filter @pgg/core test`: pass, 55 tests.
- `pnpm --filter @pgg/dashboard build`: pass, Vite chunk-size warning only.
- `./.codex/sh/pgg-gate.sh pgg-qa pgg-workflow-token-commit-contract`: fail, required `pgg-token` report missing.
- `./.codex/sh/pgg-gate.sh pgg-token pgg-workflow-token-commit-contract`: pass.
- dashboard snapshot token summary: `llmActualTokens=null`, `localEstimatedTokens=151584`, `ledgerRecordCount=0`, `source=estimated`.
- `pnpm --filter @pgg/core test`: pass, 55 tests.
- `./.codex/sh/pgg-gate.sh pgg-qa pgg-workflow-token-commit-contract`: pass.
- `pnpm --filter @pgg/core test`: pass, 55 tests.
- `pnpm --filter @pgg/dashboard build`: pass, Vite chunk-size warning only.

## Audit Applicability

- `pgg-token`: `required` | token 측정 정확도, source 분리, actual/unavailable/estimated 계약을 직접 변경하는 topic이다.
- `pgg-performance`: `not_required` | 모바일 workflow process scaling은 UI layout 계약이며 별도 성능 민감 runtime path나 선언된 performance verification contract는 없다.

## Git Publish Message

- title: feat: 3.0.0.token commit contract
- why: workflow process는 모바일에서도 같은 형태를 유지해야 하고, token 비용 지표는 LLM actual과 Local source를 분리해야 하며, pgg-code task 행 단위 commit과 pgg lang 문서/주석 계약이 workflow 신뢰성을 결정한다.
- footer: Refs: pgg-workflow-token-commit-contract

## Review Summary

- proposal review: approved
- plan review: approved
- task review: approved
- code review: approved
- refactor review: approved
- token audit: approved
- qa review: pass
- score: `98`
- plan score: `97`
- task score: `97`
- code score: `98`
- refactor score: `98`
- token score: `98`
- qa score: `98`
- experts: 프로덕트 매니저, UX/UI 전문가, 소프트웨어 아키텍트, 도메인 전문가, 시니어 백엔드 엔지니어, 테크 리드, 코드 리뷰어
- blocking issues: 없음. 이전 QA blocking issue였던 required `token/report.md` 누락은 해소됨.

## Next Workflow

- archive

## Changed Files

| CRUD | Path | Diff |
|---|---|---|
| ADD | `poggn/active/pgg-workflow-token-commit-contract/proposal.md` | pending |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/reviews/proposal.review.md` | pending |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/state/current.md` | pending |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/state/history.ndjson` | pending |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/state/dirty-worktree-baseline.txt` | pending |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/workflow.reactflow.json` | pending |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/plan.md` | pending |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/task.md` | pending |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/spec/dashboard/mobile-workflow-process-scaling.md` | pending |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/spec/token/accurate-token-measurement-ledger.md` | pending |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/spec/dashboard/token-source-clips.md` | pending |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/spec/git/task-row-commit-governance.md` | pending |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/spec/i18n/pgg-lang-documentation-and-comments.md` | pending |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/spec/pgg/init-update-propagation.md` | pending |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/reviews/plan.review.md` | pending |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/reviews/task.review.md` | pending |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/implementation/index.md` | pending |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/implementation/diffs/001_UPDATE_packages_core_src_index_ts.diff` | pending |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/implementation/diffs/002_UPDATE_packages_core_test_dashboard_token_usage_test_mjs.diff` | pending |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/implementation/diffs/003_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.diff` | pending |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/implementation/diffs/004_UPDATE_packages_core_dist_index.diff` | pending |
| UPDATE | `packages/core/src/index.ts` | `implementation/diffs/001_UPDATE_packages_core_src_index_ts.diff` |
| UPDATE | `packages/core/test/dashboard-token-usage.test.mjs` | `implementation/diffs/002_UPDATE_packages_core_test_dashboard_token_usage_test_mjs.diff` |
| UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/003_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.diff` |
| UPDATE | `packages/core/dist/index.d.ts` | `implementation/diffs/004_UPDATE_packages_core_dist_index.diff` |
| UPDATE | `packages/core/dist/index.js` | `implementation/diffs/004_UPDATE_packages_core_dist_index.diff` |
| UPDATE | `packages/core/dist/index.js.map` | `implementation/diffs/004_UPDATE_packages_core_dist_index.diff` |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/implementation/diffs/005_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx.diff` | pending |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/implementation/diffs/006_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` | pending |
| UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | `implementation/diffs/005_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx.diff` |
| UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/006_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/implementation/diffs/007_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_mobile_process.diff` | pending |
| UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | `implementation/diffs/007_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_mobile_process.diff` |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/implementation/diffs/008_UPDATE__codex_sh_pgg-stage-commit_sh.diff` | pending |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/implementation/diffs/009_UPDATE_packages_core_src_templates_ts.diff` | pending |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/implementation/diffs/010_UPDATE_packages_core_test_git-publish_test_mjs.diff` | pending |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/implementation/diffs/011_UPDATE_pgg_code_commit_contract_docs.diff` | pending |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/implementation/diffs/012_UPDATE_packages_core_dist_templates.diff` | pending |
| UPDATE | `.codex/sh/pgg-stage-commit.sh` | `implementation/diffs/008_UPDATE__codex_sh_pgg-stage-commit_sh.diff` |
| UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/009_UPDATE_packages_core_src_templates_ts.diff` |
| UPDATE | `packages/core/test/git-publish.test.mjs` | `implementation/diffs/010_UPDATE_packages_core_test_git-publish_test_mjs.diff` |
| UPDATE | `.codex/skills/pgg-code/SKILL.md` | `implementation/diffs/011_UPDATE_pgg_code_commit_contract_docs.diff` |
| UPDATE | `.codex/add/WOKR-FLOW.md` | `implementation/diffs/011_UPDATE_pgg_code_commit_contract_docs.diff` |
| UPDATE | `packages/core/dist/templates.js` | `implementation/diffs/012_UPDATE_packages_core_dist_templates.diff` |
| UPDATE | `packages/core/dist/templates.js.map` | `implementation/diffs/012_UPDATE_packages_core_dist_templates.diff` |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/implementation/diffs/013_UPDATE_packages_core_src_pgg_lang_contract.diff` | pending |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/implementation/diffs/014_UPDATE_packages_core_test_skill_generation_pgg_lang.diff` | pending |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/implementation/diffs/015_UPDATE_current_workspace_pgg_lang_docs.diff` | pending |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/implementation/diffs/016_UPDATE_packages_core_dist_pgg_lang_contract.diff` | pending |
| UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/013_UPDATE_packages_core_src_pgg_lang_contract.diff` |
| UPDATE | `packages/core/src/readme.ts` | `implementation/diffs/013_UPDATE_packages_core_src_pgg_lang_contract.diff` |
| UPDATE | `packages/core/test/skill-generation.test.mjs` | `implementation/diffs/014_UPDATE_packages_core_test_skill_generation_pgg_lang.diff` |
| UPDATE | `AGENTS.md` | `implementation/diffs/015_UPDATE_current_workspace_pgg_lang_docs.diff` |
| UPDATE | `README.md` | `implementation/diffs/015_UPDATE_current_workspace_pgg_lang_docs.diff` |
| UPDATE | `.codex/add/STATE-CONTRACT.md` | `implementation/diffs/015_UPDATE_current_workspace_pgg_lang_docs.diff` |
| UPDATE | `.codex/add/WOKR-FLOW.md` | `implementation/diffs/015_UPDATE_current_workspace_pgg_lang_docs.diff` |
| UPDATE | `.codex/add/REVIEW-RUBRIC.md` | `implementation/diffs/015_UPDATE_current_workspace_pgg_lang_docs.diff` |
| UPDATE | `.codex/skills/pgg-add/SKILL.md` | `implementation/diffs/015_UPDATE_current_workspace_pgg_lang_docs.diff` |
| UPDATE | `.codex/skills/pgg-plan/SKILL.md` | `implementation/diffs/015_UPDATE_current_workspace_pgg_lang_docs.diff` |
| UPDATE | `.codex/skills/pgg-code/SKILL.md` | `implementation/diffs/015_UPDATE_current_workspace_pgg_lang_docs.diff` |
| UPDATE | `.codex/skills/pgg-refactor/SKILL.md` | `implementation/diffs/015_UPDATE_current_workspace_pgg_lang_docs.diff` |
| UPDATE | `.codex/skills/pgg-token/SKILL.md` | `implementation/diffs/015_UPDATE_current_workspace_pgg_lang_docs.diff` |
| UPDATE | `.codex/skills/pgg-performance/SKILL.md` | `implementation/diffs/015_UPDATE_current_workspace_pgg_lang_docs.diff` |
| UPDATE | `.codex/skills/pgg-qa/SKILL.md` | `implementation/diffs/015_UPDATE_current_workspace_pgg_lang_docs.diff` |
| UPDATE | `.codex/skills/pgg-status/SKILL.md` | `implementation/diffs/015_UPDATE_current_workspace_pgg_lang_docs.diff` |
| UPDATE | `packages/core/dist/templates.js` | `implementation/diffs/016_UPDATE_packages_core_dist_pgg_lang_contract.diff` |
| UPDATE | `packages/core/dist/templates.js.map` | `implementation/diffs/016_UPDATE_packages_core_dist_pgg_lang_contract.diff` |
| UPDATE | `packages/core/dist/readme.js` | `implementation/diffs/016_UPDATE_packages_core_dist_pgg_lang_contract.diff` |
| UPDATE | `packages/core/dist/readme.js.map` | `implementation/diffs/016_UPDATE_packages_core_dist_pgg_lang_contract.diff` |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/implementation/diffs/017_UPDATE_current_workspace_update_synced_helpers.diff` | pending |
| UPDATE | `.codex/sh/pgg-stage-commit.sh` | `implementation/diffs/017_UPDATE_current_workspace_update_synced_helpers.diff` |
| UPDATE | `.codex/sh/pgg-git-publish.sh` | `implementation/diffs/017_UPDATE_current_workspace_update_synced_helpers.diff` |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/reviews/code.review.md` | pending |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/reviews/refactor.review.md` | pending |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/qa/report.md` | pending |
| ADD | `poggn/active/pgg-workflow-token-commit-contract/token/report.md` | pending |
