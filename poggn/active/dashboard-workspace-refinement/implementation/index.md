---
pgg:
  topic: "dashboard-workspace-refinement"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 95
  updated_at: "2026-04-23T08:25:51Z"
reactflow:
  node_id: "implementation-index"
  node_type: "doc"
  label: "implementation/index.md"
state:
  summary: "dashboard workspace refinement 구현 diff와 검증 결과를 기록한다."
  next: "pgg-refactor"
---

# Implementation Index

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 001 | UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/001_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.diff` | `T1`, `T7` | top navigation latest project version source를 `projectVersion/pggVersion` 기준으로 정리 |
| 002 | UPDATE | `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx` | `implementation/diffs/002_UPDATE_apps_dashboard_src_features_project-detail_ProjectDetailWorkspace_tsx.diff` | `T3`, `T4`, `T5`, `T6` | workflow topic sidebar, MUI Tabs, compact question card, animated current emphasis, history/report/files 구조를 재구성 |
| 003 | UPDATE | `apps/dashboard/src/features/project-list/ProjectListBoard.tsx` | `implementation/diffs/003_UPDATE_apps_dashboard_src_features_project-list_ProjectListBoard_tsx.diff` | `T2` | Jira-style column rhythm과 card-wide click contract로 board를 재구성 |
| 004 | UPDATE | `apps/dashboard/src/features/project-list/projectBoard.ts` | `implementation/diffs/004_UPDATE_apps_dashboard_src_features_project-list_projectBoard_ts.diff` | `T1`, `T2` | board search/source helper가 `projectVersion`/`pggVersion`을 인식하도록 보강 |
| 005 | UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/005_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` | `T3`, `T4`, `T6` | `POGGN version`, `project version`, `current focus`, `expert reviews` copy를 추가 |
| 006 | UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/006_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.diff` | `T1` | `ProjectSnapshot`에 `pggVersion`과 `projectVersion` contract를 추가 |
| 007 | UPDATE | `apps/dashboard/src/shared/utils/dashboard.tsx` | `implementation/diffs/007_UPDATE_apps_dashboard_src_shared_utils_dashboard_tsx.diff` | `T1`, `T4`, `T5`, `T6` | workflow node 강조, folder tree builder, preferred artifact selector를 공통 helper로 추가 |
| 008 | UPDATE | `packages/core/src/index.ts` | `implementation/diffs/008_UPDATE_packages_core_src_index_ts.diff` | `T1` | dashboard snapshot builder가 root `package.json` 기반 `projectVersion`을 읽고 `pggVersion`을 분리해 제공 |
| 009 | CREATE | `poggn/active/dashboard-workspace-refinement/implementation/index.md` | 없음 | `T7` | implementation 산출물 인덱스를 기록 |
| 010 | CREATE | `poggn/active/dashboard-workspace-refinement/reviews/code.review.md` | 없음 | `T7` | 코드 리뷰 요약과 잔여 리스크를 기록 |
| 011 | UPDATE | `poggn/active/dashboard-workspace-refinement/state/current.md` | 없음 | `T7` | implementation 단계 최소 handoff 상태로 갱신 |
| 012 | UPDATE | `poggn/active/dashboard-workspace-refinement/state/history.ndjson` | 없음 | `T7` | implementation stage event를 추가 |

## Notes

- project info에서 `dashboard port`를 제거하고 `POGGN version`과 `project version`을 별도 metric으로 노출한다.
- workflow는 좌측 topic sidebar와 MUI Tabs 기반 shell로 재구성했고, 현재 진행 node/timeline item은 animation-enabled highlight를 사용한다.
- files는 flat list에서 folder tree explorer로 전환됐고, topic-relative path 기반 edit/delete guard는 유지했다.
- report는 dense table-first surface로 바뀌었고, history는 topic selection 없는 compact card + modal open contract로 단순화됐다.
- `pnpm --filter @pgg/dashboard build`가 통과했다.
- current-project verification contract는 없으므로 `manual verification required`를 유지한다.
- `pgg-performance` applicability는 `required`지만 아직 audit를 실행하지 않았으므로 후속 stage에서 확인이 필요하다.
- unrelated untracked file `add-img/3.png`는 topic baseline 참고 자산으로 남아 있으며 이번 구현 변경셋에는 포함하지 않았다.
