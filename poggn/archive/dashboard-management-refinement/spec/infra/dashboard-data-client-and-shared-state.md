---
pgg:
  topic: "dashboard-management-refinement"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-23T02:24:55Z"
reactflow:
  node_id: "spec-data-client-state"
  node_type: "doc"
  label: "spec/infra/dashboard-data-client-and-shared-state.md"
state:
  summary: "axios client, snapshot/model/store/locale 확장 기준을 정의한다."
  next: "task.md 승인"
---

# Dashboard Data Client And Shared State Spec

## Goal

- dashboard UI 재정렬을 지탱할 axios data client, snapshot/model/store/locale/theme 경계를 current-project 범위 안에서 정의한다.

## API Client Requirements

- `apps/dashboard/src/shared/api/dashboard.ts`의 직접 `fetch` 호출은 axios 기반 client로 교체한다.
- client는 live snapshot(`GET /api/dashboard/snapshot`) 우선, static snapshot(`/dashboard-data.json?ts=...`) fallback 구조를 유지해야 한다.
- request helper는 JSON headers, error normalization, live/static fallback semantics를 공통 처리해야 한다.
- mutation helper는 current-project `main`, `refresh`, `git`, `system`, category action, project delete/reorder action을 같은 client 패턴으로 호출할 수 있어야 한다.
- project delete mutation은 filesystem delete 여부를 명시적 flag로 전달해야 한다.

## Snapshot And Model Requirements

- `ProjectSnapshot` 또는 동등한 read model은 dashboard title icon source, language setting, latest project metadata, history view projection을 담을 수 있어야 한다.
- `DashboardSidebarItem`은 `board`, `category`, `report`, `history` 중심으로 재정의되어야 한다.
- `DashboardWorkspaceMode`는 board/category/report/history/settings/detail 같은 실제 surface 구성을 반영할 수 있어야 한다.
- `DashboardSnapshot`은 report/history가 필요한 projection을 별도 계산 없이 읽을 수 있을 정도의 데이터를 제공해야 한다.
- category ordering과 project ordering source-of-truth는 기존 `ProjectCategory.projectIds`를 활용하되, reorder mutation과 UI 기대치가 일치해야 한다.

## Store And Persistence Requirements

- zustand store는 top menu, sidebar item, selected project, selected topic, insight rail open, theme mode, detail selection을 복원할 수 있어야 한다.
- theme mode는 기존 local storage persistence를 재사용한다.
- language 변경은 current-project metadata mutation 결과를 snapshot 재조회 후 반영한다.
- settings field draft는 전역 store가 아니라 각 패널 local state로 둘 수 있지만, shell-level selection state와 혼합되면 안 된다.

## Locale Requirements

- locale dictionary에는 `MANAGEMENT`, `Category`, `Report`, `History`, delete modal, filesystem delete checkbox, title icon, apply action, language/theme helper, style-aligned select labels 등 신규 copy가 추가되어야 한다.
- 새 UI copy는 inline string으로 넣지 않는다.
- `ko/en` parity를 유지한다.

## Error And Guard Rules

- live API 실패 시 사용자는 field-level 또는 surface-level feedback를 받아야 한다.
- static snapshot에서는 mutation이 비활성화되고 명확한 설명 copy를 보여 줘야 한다.
- axios migration은 성공/실패 의미를 바꾸면 안 되며 기존 dashboard snapshot loading contract를 유지해야 한다.
- current-project verification contract가 없으므로 data client 변경 후에도 검증 기록은 `manual verification required`를 유지한다.

## Non-Requirements

- server-side 권한 모델 추가
- current-project 밖 다중 workspace 동시 편집
- dashboard theme mode를 서버 설정으로 승격하는 것
