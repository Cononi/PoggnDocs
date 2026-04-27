---
pgg:
  topic: "dashboard-audit-flow-i18n-surface"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 95
  updated_at: "2026-04-27T04:55:08Z"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "2.4.0"
  short_name: "dashboard-surface"
  project_scope: "current-project"
reactflow:
  node_id: "implementation-index"
  node_type: "doc"
  label: "implementation/index.md"
state:
  summary: "dashboard optional audit flow와 i18n language contract 구현 기록"
---

# Implementation Index

## Summary

dashboard workflow model에 `token` optional flow를 추가하고, token/performance 실행 evidence를 file, workflow node, history event 기준으로 감지하도록 정렬했다. workflow 표시 문자열은 dashboard locale dictionary를 통해 ko/en 전환되도록 바꾸고, `pgg-new-topic` helper/template은 manifest language에 따라 새 proposal/state 사용자-facing 문구를 생성하도록 보강했다.

## Task Results

| Task | Status | Result |
|---|---|---|
| T1 | done | `WorkflowFlowId`에 `token`을 추가하고 `pgg-token`/`pgg-performance` stage alias 및 history event evidence를 flow visibility에 반영했다. |
| T2 | done | workflow label/detail/event/fallback/count 문구를 `dashboardLocale` dictionary key로 전환했다. |
| T3 | done | `.codex/sh/pgg-new-topic.sh`와 `packages/core/src/templates.ts`가 `.pgg/project.json` language를 읽어 ko/en 생성 문구를 선택하게 했다. |
| T4 | done | dashboard build, core build, core test로 optional flow/i18n compile path와 new-topic language regression을 검증했다. |

## Changed Files

| CRUD | Path | Diff |
|---|---|---|
| UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | `implementation/diffs/001_UPDATE_apps_dashboard_src_features_history_historyModel_ts.diff` |
| UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | `implementation/diffs/002_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx.diff` |
| UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/003_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` |
| UPDATE | `.codex/sh/pgg-new-topic.sh` | `implementation/diffs/004_UPDATE__codex_sh_pgg-new-topic_sh.diff` |
| UPDATE | `packages/core/src/templates.ts` | `implementation/diffs/005_UPDATE_packages_core_src_templates_ts.diff` |
| UPDATE | `packages/core/dist/templates.js` | `implementation/diffs/006_UPDATE_packages_core_dist_templates_js.diff` |
| UPDATE | `packages/core/dist/templates.js.map` | `implementation/diffs/007_UPDATE_packages_core_dist_templates_js_map.diff` |
| UPDATE | `packages/core/test/version-history.test.mjs` | `implementation/diffs/008_UPDATE_packages_core_test_version-history_test_mjs.diff` |
| CREATE | `poggn/active/dashboard-audit-flow-i18n-surface/implementation/index.md` | n/a |
| CREATE | `poggn/active/dashboard-audit-flow-i18n-surface/implementation/diffs/*.diff` | n/a |

## Verification

- `pnpm --filter @pgg/dashboard build`: pass
- `pnpm --filter @pgg/core build`: pass
- `pnpm --filter @pgg/core test`: pass, 41 tests

## Refactor

- `HistoryWorkspace`가 `WorkflowStep.label`을 사용하도록 정리해 flow label dictionary mapping 중복을 제거했다.
- workflow overview meta title, progress helper, log title 문구를 locale key로 이동해 표시 계층 i18n 경계를 더 일관되게 만들었다.
- 추가 검증: `pnpm --filter @pgg/dashboard build` pass

## Notes

- current-project verification contract는 manual mode라 자동 검증 명령 후보로 선언하지 않았다.
- `pgg-performance`는 not_required 상태를 유지한다.
- `pgg-token`은 required이므로 후속 optional audit에서 `token/report.md`가 필요하다.
