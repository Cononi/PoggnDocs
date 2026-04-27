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
  version_bump: "minor"
  target_version: "2.7.0"
  short_name: "dashboard-overhaul"
  working_branch: "ai/feat/2.7.0-dashboard-overhaul"
  release_branch: "release/2.7.0-dashboard-overhaul"
reactflow:
  node_id: "plan-dashboard-language-ux-settings-overhaul"
  node_type: "plan"
  label: "plan.md"
state:
  summary: "문서 언어 계약과 dashboard UX 개편 구현 계획"
  next: "pgg-code"
---

# Plan: Dashboard Language UX Settings Overhaul

## 1. 목표

이번 변경은 `pgg lang` 기반 문서 언어 일관성과 dashboard의 핵심 UX 부채를 함께 정리한다. 구현은 기존 data model과 route 구조를 깨지 않는 compatible minor release로 진행한다.

## 2. 설계 원칙

- 문서 언어 정책은 새로 생성되는 `poggn` workflow 문서에 적용한다. 기존 archive 문서의 소급 번역은 하지 않는다.
- dashboard UI 변경은 기존 MUI 기반 구조 안에서 해결하고 새 UI 라이브러리를 추가하지 않는다.
- category CRUD는 이미 있는 core API와 `CategoryManagementPanel`을 최대한 재사용한다.
- mobile UX는 bottom navigation 제거 후 TopNavigation, Drawer, SpeedDial 중심으로 단순화한다.
- workflow status는 최신 unresolved blocked evidence만 실패로 보고, 이후 completion evidence가 있으면 완료가 우선한다.
- 삭제 안전장치는 실제 filesystem 삭제 옵션에만 두 번째 확인 체크를 요구한다.

## 3. Spec 구성

- `spec/core/pgg-language-document-contract.md`: `pgg lang` 기반 workflow 문서 생성 언어 계약.
- `spec/dashboard/shell-navigation-speed-dial.md`: 상단 navigation, dashboard title source, SpeedDial persistent tooltip/version/mobile action 계약.
- `spec/dashboard/settings-category-management.md`: Settings category panel과 category CRUD 재사용 계약.
- `spec/dashboard/mobile-workflow-ux.md`: 모바일 drawer, bottom navigation 제거, workflow progress 세로 배치, tab border 계약.
- `spec/dashboard/workflow-status-and-insight.md`: Sprint Progress 중복 제거와 refactor success 상태 계산 계약.
- `spec/dashboard/project-form-delete-safety.md`: 프로젝트 추가 form 개선과 삭제 double confirmation 계약.
- `spec/qa/dashboard-overhaul-verification.md`: 자동/수동 검증 기준.

## 4. 구현 순서

1. Core/helper language contract를 먼저 정리한다.
2. Dashboard model/route/locale 타입을 확장한다.
3. Settings category panel과 project add/delete dialog를 구현한다.
4. TopNavigation/SpeedDial/sidebar/mobile bottom navigation을 정리한다.
5. Workflow progress/insight/status 계산을 수정한다.
6. Build/test와 UI manual verification checklist를 남긴다.

## 5. 영향 범위

- `.codex/sh/pgg-new-topic.sh`
- `packages/core/src/templates.ts`
- `packages/core/src/index.ts`
- `packages/core/test/*.test.mjs`
- `apps/dashboard/src/app/*`
- `apps/dashboard/src/features/settings/SettingsWorkspace.tsx`
- `apps/dashboard/src/features/project-list/CategoryManagementPanel.tsx`
- `apps/dashboard/src/features/backlog/InsightsRail.tsx`
- `apps/dashboard/src/features/history/historyModel.ts`
- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
- `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx`
- `apps/dashboard/src/shared/model/dashboard.ts`
- `apps/dashboard/src/shared/locale/dashboardLocale.ts`

## 6. 검증 전략

- `pnpm build`로 core/CLI/dashboard compile과 locale key 누락을 확인한다.
- `pnpm test`로 core template/helper language, category/status 계산 회귀를 확인한다.
- 모바일/desktop UI는 QA에서 수동 검증 항목으로 분리한다.
- `pgg-token` audit는 required로 남겨 language/template/state handoff 변경의 context 비용과 산출물 범위를 점검한다.

## 7. Audit Applicability

- `pgg-token`: `required` | workflow 문서 생성 언어 정책과 helper/template output이 바뀌므로 state handoff와 generated 문서 범위 점검이 필요하다.
- `pgg-performance`: `not_required` | UI 표시와 상태 계산 정정 중심이며 성능 민감 runtime 경로가 아니다.

## 8. Plan Decision

- status: `reviewed`
- score: `96`
- next: `pgg-code`
- blocking issue: 없음
