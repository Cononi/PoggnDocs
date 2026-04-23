---
pgg:
  topic: "dashboard-poggn-branding-cleanup"
  stage: "implementation"
  status: "reviewed"
  skill: "pgg-code"
  score: 95
  updated_at: "2026-04-23T00:59:47Z"
reactflow:
  node_id: "implementation-index"
  node_type: "doc"
  label: "implementation/index.md"
state:
  summary: "dashboard 브랜딩 정리 구현 diff와 검증 결과를 기록한다."
  next: "pgg-qa"
---

# Implementation Index

| ID | CRUD | path | diffRef | taskRef | note |
|---|---|---|---|---|---|
| 001 | UPDATE | `apps/dashboard/src/app/DashboardShellChrome.tsx` | `implementation/diffs/001_UPDATE_apps_dashboard_src_app_DashboardShellChrome_tsx.diff` | `T-001` | desktop launcher를 제거하고 `✨` brand mark 및 워드마크 spacing을 정리 |
| 002 | UPDATE | `apps/dashboard/index.html` | `implementation/diffs/002_UPDATE_apps_dashboard_index_html.diff` | `T-002` | 브라우저 `<title>`을 `POGGN`으로 통일 |
| 003 | UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/003_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` | `T-002` | ko/en fallback title surface를 `POGGN`으로 맞춤 |
| 004 | UPDATE | `.pgg/project.json` | `implementation/diffs/004_UPDATE__pgg_project_json.diff` | `T-003` | current-project dashboard title source를 `POGGN`으로 동기화 |

## Notes

- `apps/dashboard/public/dashboard-data.json`은 전체 삭제 상태의 기존 dirty 변경이 있어 이번 topic에서는 덮어쓰지 않았다.
- 검증은 `pnpm build`를 통과했다.
- `pgg-stage-commit.sh`는 unrelated dirty changes `.codex/add/WOKR-FLOW.md`, `apps/dashboard/public/dashboard-data.json` 때문에 implementation proof commit을 defer했다.
- current-project verification contract는 선언되지 않아 `manual verification required` 상태를 유지한다.
