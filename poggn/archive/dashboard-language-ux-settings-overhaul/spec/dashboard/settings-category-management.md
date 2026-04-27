---
pgg:
  topic: "dashboard-language-ux-settings-overhaul"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-27T12:02:00Z"
  archive_type: "feat"
  project_scope: "current-project"
reactflow:
  node_id: "spec-dashboard-settings-category-management"
  node_type: "spec"
  label: "spec/dashboard/settings-category-management.md"
state:
  summary: "Settings category management 계약"
  next: "pgg-code"
---

# Spec: Settings Category Management

## 목적

카테고리 관리는 dashboard 설정 성격의 기능이다. Settings 메뉴에서 카테고리 추가, 삭제, 이름 변경, 기본값 지정, 표시 여부, 정렬을 관리할 수 있어야 한다.

## 요구사항

1. `DashboardSettingsView`에 `category` panel을 추가한다.
2. route query `panel=category`를 읽고 쓸 수 있어야 한다.
3. settings sidebar에는 `카테고리` 항목이 표시되어야 한다.
4. Settings category panel은 기존 category CRUD API를 사용한다.
5. 이미 있는 `CategoryManagementPanel`을 재사용하거나, 공용 component로 분리해 중복 구현을 피한다.
6. category 생성/수정은 `window.prompt`만 쓰는 방식보다 settings 화면 안의 form 또는 dialog를 우선한다.
7. live mode가 아니면 mutation action은 disabled 되어야 한다.

## 구현 기준

- `SettingsWorkspace` props에 `categories`와 category mutation handler를 추가하거나, `DashboardApp`에서 panel별 surface를 분기해 `CategoryManagementPanel`을 settings에 배치한다.
- Project 화면과 Settings 화면에 category management가 동시에 보일 경우, entry label과 route를 명확히 해 사용자가 같은 기능임을 이해할 수 있게 한다.
- locale key는 ko/en 모두 추가한다.
- category delete는 기존 API safety를 유지한다.

## 검증 기준

- `/settings?panel=category`에서 category management가 표시된다.
- create/rename/delete/default/visible/reorder mutation payload가 기존 endpoint로 전송된다.
- read-only/static snapshot mode에서는 mutation이 실행되지 않는다.
