---
pgg:
  topic: "dashboard-poggn-branding-cleanup"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-23T00:44:14Z"
reactflow:
  node_id: "spec-dashboard-title-surfaces"
  node_type: "doc"
  label: "spec/ui/dashboard-title-surfaces.md"
state:
  summary: "dashboard title이 노출되는 브라우저와 런타임 표면의 문자열 계약을 정의한다."
  next: "task.md 승인"
---

# Dashboard Title Surfaces Spec

## Goal

- 사용자가 dashboard를 여는 즉시 보게 되는 브라우저 title과 런타임 header title이 모두 `POGGN`을 기준으로 일관되게 보이도록 문자열 표면 계약을 정의한다.

## Surface Inventory

- `apps/dashboard/index.html`의 HTML `<title>`
- `apps/dashboard/src/shared/locale/dashboardLocale.ts`의 `title`, `dashboardFallbackTitle`
- `apps/dashboard/src/app/DashboardApp.tsx`의 `currentProject?.dashboardTitle ?? dictionary.dashboardFallbackTitle` binding
- settings/workspace에서 읽고 쓰는 `dashboardTitle` 값이 다시 shell header에 반영되는 경로

## String Rules

- 기본 브랜드명은 `POGGN`이다.
- `pgg dashboard`, `poggn dashboard` 같은 복합 표기는 기본 title surface에서 사용하지 않는다.
- locale fallback은 ko/en 모두 같은 기본 브랜드명 `POGGN`을 사용한다.
- current project title이 비어 있거나 fallback이 필요할 때도 `POGGN`만 노출되어야 한다.

## Behavior Rules

- runtime binding 구조는 유지하되 upstream source를 정리해 별도 분기 로직을 늘리지 않는다.
- settings에서 title을 수정하는 UX 자체는 바꾸지 않지만, 기본값/초기값이 다시 복합 표기로 회귀하지 않도록 한다.
- search index가 `dashboardTitle`을 사용하더라도 브랜드명 정리로 인한 기능 회귀가 없어야 한다.

## Non-Requirements

- 브라우저 title의 페이지별 동적 변경
- 설정 UX 개편
- locale 키 구조 리팩터링
