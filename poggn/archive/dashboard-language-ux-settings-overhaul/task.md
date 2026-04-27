---
pgg:
  topic: "dashboard-language-ux-settings-overhaul"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-27T12:02:00Z"
  archive_type: "feat"
  project_scope: "current-project"
reactflow:
  node_id: "task-dashboard-language-ux-settings-overhaul"
  node_type: "task"
  label: "task.md"
state:
  summary: "dashboard overhaul task breakdown"
  next: "pgg-code"
---

# Task Breakdown

## T1. PGG 문서 언어 계약

- spec: `spec/core/pgg-language-document-contract.md`
- 대상: `.codex/sh/pgg-new-topic.sh`, `packages/core/src/templates.ts`, generated helper template, core tests
- 완료 조건:
  - `pgg lang=ko` 신규 topic 기본 문서가 한국어 본문을 생성한다.
  - `pgg lang=en` 신규 topic 기본 문서가 영어 본문을 생성한다.
  - proposal/state/review/task/spec/QA 생성 가이드가 언어 정책을 명시한다.
  - 기존 archive 문서는 변경하지 않는다.

## T2. Dashboard shell navigation과 SpeedDial

- spec: `spec/dashboard/shell-navigation-speed-dial.md`
- 대상: `DashboardShellChrome.tsx`, `DashboardApp.tsx`, locale/model
- 완료 조건:
  - TopNavigation project/settings 버튼이 줄바꿈 없이 표시된다.
  - dashboard title은 `project.dashboardTitle` 또는 manifest dashboard title 값만 사용한다.
  - SpeedDial은 persistent tooltip action을 사용한다.
  - 동작 없는 `!` action은 제거되거나 read-only version action으로 명확해진다.
  - pgg version action은 마지막에 표시된다.
  - project selector action은 mobile에서만 보인다.

## T3. Settings category management

- spec: `spec/dashboard/settings-category-management.md`
- 대상: `SettingsWorkspace.tsx`, `CategoryManagementPanel.tsx`, `DashboardApp.tsx`, route/model/locale
- 완료 조건:
  - Settings sidebar에 category panel이 추가된다.
  - category list, create, rename, delete, default, visible, reorder가 settings에서 가능하다.
  - Project 화면과 Settings 화면의 category management 진입점이 중복 혼란 없이 정리된다.
  - read-only mode에서는 mutation action이 비활성화된다.

## T4. Mobile workflow UX

- spec: `spec/dashboard/mobile-workflow-ux.md`
- 대상: `DashboardShellChrome.tsx`, `DashboardApp.tsx`, `HistoryWorkspace.tsx`, workflow progress UI
- 완료 조건:
  - mobile bottom navigation이 렌더링되지 않는다.
  - mobile Project drawer에서 `WORKSPACE` section과 project selector card가 숨겨진다.
  - mobile workflow progress가 세로 배치로 보인다.
  - workflow tab active border는 active tab 하단만 끊겨 panel과 자연스럽게 이어진다.

## T5. Workflow status와 insight 중복 정리

- spec: `spec/dashboard/workflow-status-and-insight.md`
- 대상: `historyModel.ts`, `InsightsRail.tsx`, 관련 tests
- 완료 조건:
  - Sprint Progress에 같은 status label이 중복 표시되지 않는다.
  - refactor 완료 이후 QA/archive로 넘어간 topic은 refactor를 `단계 실패`로 표시하지 않는다.
  - blocked/fail evidence가 이후 completion evidence로 해소된 경우 completed가 우선한다.

## T6. Project add form과 delete safety

- spec: `spec/dashboard/project-form-delete-safety.md`
- 대상: `DashboardApp.tsx`, `DashboardShellChrome.tsx`, locale
- 완료 조건:
  - project add dialog 입력과 category select가 같은 높이/밀도/폭을 가진다.
  - form layout은 desktop/mobile에서 안정적으로 보인다.
  - 실제 root 삭제 옵션을 체크하면 복구 불가 문구와 두 번째 확인 체크가 필요하다.
  - 두 체크가 모두 통과하지 않으면 filesystem delete payload가 전송되지 않는다.

## T7. Verification과 산출물 기록

- spec: `spec/qa/dashboard-overhaul-verification.md`
- 대상: build/test, implementation index/diff, reviews
- 완료 조건:
  - `pnpm build` 통과.
  - `pnpm test` 통과.
  - dashboard desktop/mobile manual verification checklist 작성.
  - `pgg-token` audit required 상태 유지.

## 의존 순서

1. T1
2. T2, T3, T6
3. T4, T5
4. T7

## Audit Applicability

- `pgg-token`: `required` | T1에서 workflow 문서 생성 언어 계약과 helper/template output이 바뀐다.
- `pgg-performance`: `not_required` | runtime hot path 변경이 아니다.
