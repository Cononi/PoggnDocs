# Current State

## Topic

dashboard-audit-flow-i18n-surface

## Current Stage

refactor

## Goal

dashboard workflow가 실행된 token/performance optional audit를 flow에 표시하고, pgg 기록 문서와 dashboard 고정 표시값이 pgg lang 및 i18n dictionary를 따르도록 확정한다.

## Constraints

- project scope: `current-project`
- archive type: `feat`
- version bump: `minor`
- target version: `2.4.0`
- short name: `dashboard-surface`
- working branch: `ai/feat/2.4.0-dashboard-surface`
- release branch: `release/2.4.0-dashboard-surface`

## User Question Record Ref

- `proposal.md` 섹션 `3. 사용자 입력 질문 기록`

## Requirements Summary

- dashboard project workflow는 `pgg-token` 또는 `pgg-performance`가 실행된 topic에서 해당 optional audit flow를 표시해야 한다.
- optional audit flow는 실행 evidence가 있을 때만 나타나야 하며, 실행 evidence가 없으면 core workflow를 불필요하게 늘리지 않는다.
- 모든 pgg 기록 문서와 내용은 `.pgg/project.json`의 `language` 값에 맞춰 작성되어야 한다.
- stage/status/fixed display values는 원본 enum을 직접 번역해 저장하지 않고 i18n dictionary를 통해 표시해야 한다.
- dashboard workflow label/status/detail/event/fallback 문구는 ko/en 모두 전환 가능해야 한다.

## Scope

- dashboard workflow/history model의 `token` optional flow 추가
- token/performance optional audit evidence 감지
- dashboard workflow 표시 문자열의 i18n dictionary 경유
- pgg generated docs/helper 기록 언어 계약 검증

## Plan Summary

- `S1`: `spec/workflow/optional-audit-flow-surface.md`
- `S2`: `spec/i18n/dashboard-workflow-i18n.md`
- `S3`: `spec/pgg-language/generated-doc-language-contract.md`
- `S4`: `spec/qa/audit-flow-i18n-regression.md`

## Task Summary

- `T1`: done | dashboard workflow model에 `token` optional flow와 audit evidence 감지를 추가했다.
- `T2`: done | workflow 표시 문자열을 dashboard i18n dictionary 기반으로 전환했다.
- `T3`: done | pgg generated docs/helper 기록 언어가 pgg lang을 따르는 계약을 반영했다.
- `T4`: done | optional audit 표시와 ko/en 전환 회귀 검증 증거를 준비했다.

## Out Of Scope

- 신규 언어 추가
- 모든 topic에 token/performance audit 강제
- core workflow 순서 변경
- 외부 번역 서비스 연동

## Audit Applicability

- `pgg-token`: `required` | workflow 자산, state handoff, generated 문서 언어 계약과 dashboard projection을 함께 점검해야 한다.
- `pgg-performance`: `not_required` | 성능 민감 변경이나 선언된 성능 verification contract는 아직 없다.

## Verification

- `pnpm --filter @pgg/dashboard build`: pass
- `pnpm --filter @pgg/core build`: pass
- `pnpm --filter @pgg/core test`: pass, 41 tests
- refactor `pnpm --filter @pgg/dashboard build`: pass
- current-project verification contract: manual verification required

## Git Publish Message

- title: feat: 2.4.0.dashboard audit i18n
- why: dashboard workflow가 실행된 token/performance optional audit를 flow로 보여 주고, pgg lang과 dashboard i18n dictionary를 통해 문서 및 고정 표시값 언어를 일관되게 전환해야 한다.
- footer: Refs: dashboard-audit-flow-i18n-surface

## Review Summary

- proposal review: approved
- plan review: approved
- task review: approved
- code review: approved
- refactor review: approved
- score: `96`
- experts: 소프트웨어 아키텍트, 코드 리뷰어
- blocking issues: 없음

## Next Workflow

- `pgg-token`

## Changed Files

| CRUD | Path | Diff |
|---|---|---|
| ADD | `poggn/active/dashboard-audit-flow-i18n-surface/proposal.md` | pending |
| ADD | `poggn/active/dashboard-audit-flow-i18n-surface/reviews/proposal.review.md` | pending |
| ADD | `poggn/active/dashboard-audit-flow-i18n-surface/state/history.ndjson` | pending |
| ADD | `poggn/active/dashboard-audit-flow-i18n-surface/state/dirty-worktree-baseline.txt` | pending |
| ADD | `poggn/active/dashboard-audit-flow-i18n-surface/plan.md` | pending |
| ADD | `poggn/active/dashboard-audit-flow-i18n-surface/task.md` | pending |
| ADD | `poggn/active/dashboard-audit-flow-i18n-surface/spec/workflow/optional-audit-flow-surface.md` | pending |
| ADD | `poggn/active/dashboard-audit-flow-i18n-surface/spec/i18n/dashboard-workflow-i18n.md` | pending |
| ADD | `poggn/active/dashboard-audit-flow-i18n-surface/spec/pgg-language/generated-doc-language-contract.md` | pending |
| ADD | `poggn/active/dashboard-audit-flow-i18n-surface/spec/qa/audit-flow-i18n-regression.md` | pending |
| ADD | `poggn/active/dashboard-audit-flow-i18n-surface/reviews/plan.review.md` | pending |
| ADD | `poggn/active/dashboard-audit-flow-i18n-surface/reviews/task.review.md` | pending |
| ADD | `poggn/active/dashboard-audit-flow-i18n-surface/state/current.md` | pending |
| ADD | `poggn/active/dashboard-audit-flow-i18n-surface/workflow.reactflow.json` | pending |
| UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | `implementation/diffs/001_UPDATE_apps_dashboard_src_features_history_historyModel_ts.diff` |
| UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | `implementation/diffs/002_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx.diff` |
| UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/003_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` |
| UPDATE | `.codex/sh/pgg-new-topic.sh` | `implementation/diffs/004_UPDATE__codex_sh_pgg-new-topic_sh.diff` |
| UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/005_UPDATE_packages_core_src_templates_ts.diff` |
| UPDATE | `packages/core/dist/templates.js` | `implementation/diffs/006_UPDATE_packages_core_dist_templates_js.diff` |
| UPDATE | `packages/core/dist/templates.js.map` | `implementation/diffs/007_UPDATE_packages_core_dist_templates_js_map.diff` |
| UPDATE | `packages/core/test/version-history.test.mjs` | `implementation/diffs/008_UPDATE_packages_core_test_version-history_test_mjs.diff` |
| ADD | `poggn/active/dashboard-audit-flow-i18n-surface/implementation/index.md` | pending |
| ADD | `poggn/active/dashboard-audit-flow-i18n-surface/implementation/diffs/001_UPDATE_apps_dashboard_src_features_history_historyModel_ts.diff` | pending |
| ADD | `poggn/active/dashboard-audit-flow-i18n-surface/implementation/diffs/002_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx.diff` | pending |
| ADD | `poggn/active/dashboard-audit-flow-i18n-surface/implementation/diffs/003_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` | pending |
| ADD | `poggn/active/dashboard-audit-flow-i18n-surface/implementation/diffs/004_UPDATE__codex_sh_pgg-new-topic_sh.diff` | pending |
| ADD | `poggn/active/dashboard-audit-flow-i18n-surface/implementation/diffs/005_UPDATE_packages_core_src_templates_ts.diff` | pending |
| ADD | `poggn/active/dashboard-audit-flow-i18n-surface/implementation/diffs/006_UPDATE_packages_core_dist_templates_js.diff` | pending |
| ADD | `poggn/active/dashboard-audit-flow-i18n-surface/implementation/diffs/007_UPDATE_packages_core_dist_templates_js_map.diff` | pending |
| ADD | `poggn/active/dashboard-audit-flow-i18n-surface/implementation/diffs/008_UPDATE_packages_core_test_version-history_test_mjs.diff` | pending |
| ADD | `poggn/active/dashboard-audit-flow-i18n-surface/implementation/diffs/009_REFACTOR_apps_dashboard_src_features_history_HistoryWorkspace_tsx.diff` | pending |
| ADD | `poggn/active/dashboard-audit-flow-i18n-surface/implementation/diffs/010_REFACTOR_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` | pending |
| ADD | `poggn/active/dashboard-audit-flow-i18n-surface/reviews/code.review.md` | pending |
| ADD | `poggn/active/dashboard-audit-flow-i18n-surface/reviews/refactor.review.md` | pending |
