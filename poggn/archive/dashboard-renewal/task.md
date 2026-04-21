---
pgg:
  topic: "dashboard-renewal"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-21T15:55:16Z"
reactflow:
  node_id: "task"
  node_type: "task"
  label: "task.md"
state:
  summary: "dashboard 리뉴얼 구현을 spec 경계대로 분해한다."
  next: "pgg-code"
---

# Task

| ID | Title | Spec Ref | Status | Notes |
|---|---|---|---|---|
| T-001 | `apps/dashboard`를 feature-based category 구조로 재편하고 `App.tsx`를 composition root로 축소한다 | `spec/infra/dashboard-feature-architecture.md` | done | `app`, `features`, `shared`, locale/theme/query/store wiring으로 분해하고 legacy root locale/theme 파일을 제거 |
| T-002 | Jira식 프로젝트 목록 보드와 category column, project card, selection UX를 구현한다 | `spec/ui/project-list-board.md`, `spec/infra/dashboard-feature-architecture.md` | done | hero + category column board, drag and drop, project card 요약과 current project selection을 분리 |
| T-003 | MUI CRUD 스타일 프로젝트 상세 워크스페이스와 summary/meta/workflow 패널 구조를 구현한다 | `spec/ui/project-detail-workspace.md`, `spec/infra/dashboard-feature-architecture.md` | done | summary header, meta overview, verification signal, workflow canvas를 독립 panel로 재배치 |
| T-004 | `Active Board`와 `Archive Board`를 분리하고 stage/`archive_type` 컬럼 기반 topic card 보드를 구현한다 | `spec/ui/topic-lifecycle-board.md`, `spec/infra/dashboard-topic-artifact-snapshot.md` | done | active는 proposal/plan-task/code/refactor/qa/blocked, archive는 feat/fix/docs/refactor/chore/remove lane으로 정리 |
| T-005 | recent archive artifact projection과 inspector panel/modal을 연결해 topic card에서 detail drill-down이 가능하게 한다 | `spec/ui/artifact-inspector.md`, `spec/infra/dashboard-topic-artifact-snapshot.md` | done | artifact group summary, document list, inspector preview, full dialog viewer를 workflow node click과 연결 |
| T-006 | snapshot/data adapter, locale, empty/error state, responsive behavior를 통합하고 verification 결과를 기록한다 | `spec/ui/project-list-board.md`, `spec/ui/project-detail-workspace.md`, `spec/ui/topic-lifecycle-board.md`, `spec/ui/artifact-inspector.md`, `spec/infra/dashboard-topic-artifact-snapshot.md`, `spec/infra/dashboard-feature-architecture.md` | done | `packages/core` snapshot에 archive/artifact 메타를 추가하고 workspace build + snapshot 재생성으로 통합 검증 |

## Audit Applicability

- `pgg-token`: `not_required` | task 분해 단계이며 token audit을 열 근거가 없다
- `pgg-performance`: `not_required` | 성능 측정 대상 구현이나 verification contract 변경이 아직 없다
