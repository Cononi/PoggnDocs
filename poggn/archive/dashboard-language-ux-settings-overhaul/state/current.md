# Current State

## Topic

dashboard-language-ux-settings-overhaul

## Current Stage

archive

## Goal

`pgg lang` 기반 문서 언어 일관성과 dashboard navigation, SpeedDial, settings category, mobile workflow, 삭제 안전장치, workflow 상태 표시를 함께 개편한다.

## Constraints

- project scope: `current-project`
- archive type: `feat`
- version bump: `minor`
- target version: `2.7.0`
- short name: `dashboard-overhaul`
- working branch: `ai/feat/2.7.0-dashboard-overhaul`
- release branch: `release/2.7.0-dashboard-overhaul`

## Proposal Decision

- status: `reviewed`
- score: `96`
- next: `pgg-plan`
- user question record: `proposal.md#3-사용자-입력-질문-기록`
- 기준안: 문서 언어 정책과 dashboard UX 개편을 하나의 compatible minor feature로 묶고, plan 단계에서 language contract와 dashboard UI/state contract를 분리한다.

## Plan Decision

- status: `reviewed`
- score: `96`
- next: `pgg-code`
- plan: `plan.md`
- task: `task.md`
- specs:
  - `spec/core/pgg-language-document-contract.md`
  - `spec/dashboard/shell-navigation-speed-dial.md`
  - `spec/dashboard/settings-category-management.md`
  - `spec/dashboard/mobile-workflow-ux.md`
  - `spec/dashboard/workflow-status-and-insight.md`
  - `spec/dashboard/project-form-delete-safety.md`
  - `spec/qa/dashboard-overhaul-verification.md`

## Implementation Decision

- status: `reviewed`
- score: `95`
- next: `pgg-refactor`
- implementation index: `implementation/index.md`
- code review: `reviews/code.review.md`
- diffs:
  - `implementation/diffs/001_UPDATE_pgg_language_document_contract.diff`
  - `implementation/diffs/002_UPDATE_dashboard_shell_settings_and_project_safety.diff`
  - `implementation/diffs/003_UPDATE_workflow_status_insight_and_mobile_progress.diff`
  - `implementation/diffs/004_UPDATE_dashboard_history_verification_tests.diff`
- verification:
  - `git diff --check`: pass
  - `pnpm test`: pass, core 50 tests와 dashboard history 2 tests
  - `pnpm build`: pass, dashboard chunk-size warning only
  - `pgg-stage-commit implementation`: publish_blocked, unrelated worktree changes present
  - `pgg-gate pgg-refactor`: pass
- manual QA remaining: desktop/mobile viewport, SpeedDial tooltip, category CRUD/read-only, project add/delete dialog visual check

## Refactor Decision

- status: `reviewed`
- score: `96`
- next: `pgg-token`
- cleanup: `refactor/cleanup.md`
- review: `reviews/refactor.review.md`
- diff: `implementation/diffs/005_REFACTOR_dashboard_state_and_category_cleanup.diff`
- additional diff: `implementation/diffs/006_REFACTOR_dashboard_unused_locale_cleanup.diff`
- cleanup summary:
  - unused `activeSidebarItem` store/type/action 제거
  - Settings category panel 렌더링 중복 제거
  - removed sidebar footer locale dead keys
  - removed unused legacy sidebar/quick action locale keys
- verification:
  - `pnpm test`: pass, core 50 tests와 dashboard history 2 tests
  - `pnpm build`: pass, dashboard chunk-size warning only
  - `git diff --check`: pass
  - `pgg-gate pgg-token`: pass
  - `pgg-stage-commit refactor`: publish_blocked, unrelated worktree changes present
  - `pgg-stage-commit refactor second pass`: publish_blocked, unrelated worktree changes present

## Token Audit Decision

- status: `reviewed`
- score: `96`
- next: `pgg-qa`
- report: `token/report.md`
- audit result:
  - `pgg-token`: required audit executed
  - recommended handoff: `pgg-state-pack.sh dashboard-language-ux-settings-overhaul`
  - measured state-pack payload: 3,511 bytes, 237 words
  - measured full docs/specs/diffs payload: 243,318 bytes
  - estimated reduction: 약 98.6%
- optimization actions:
  - next stage는 `state/current.md`, `token/report.md`, QA spec, 필요한 source file만 우선 열람한다.
  - `implementation/diffs/*.diff` 전체 복사는 피하고 실패 영역 diff만 선택적으로 연다.
  - generated sourcemap diff는 기본 prompt context에서 제외한다.
- verification:
  - `git diff --check`: pass
  - `pgg-gate pgg-qa`: pass
  - `pgg-stage-commit token`: not_supported, helper supports `implementation|refactor|qa` only

## QA Decision

- status: `done`
- score: `95`
- next: `archive`
- report: `qa/report.md`
- automated verification:
  - `pnpm test`: pass, core 50 tests와 dashboard history 2 tests
  - `pnpm build`: pass, dashboard chunk-size warning only
  - `git diff --check`: pass
  - `pgg-gate pgg-code`: pass
  - `pgg-gate pgg-refactor`: pass
  - `pgg-gate pgg-token`: pass
  - `pgg-gate pgg-qa`: pass
- manual checklist: source-level evidence로 pass, 실제 browser viewport visual smoke test는 미실행
- decision: `pass`

## Archive Outcome

- status: `archived`
- version: `2.7.0`
- previous version: `2.6.1`
- version file: `version.json`
- version history: `poggn/version-history.ndjson`
- qa completion commit: `publish_blocked`, unrelated worktree changes present
- git publish: `published`
- push status: `success`
- release branch: `release/2.7.0-dashboard-overhaul`
- published commit: `22108f710ae2ebfb1c9cbfd9a04e51c66bab380d`
- published at: `2026-04-27T12:50:02Z`
- cleanup status: `completed`
- note: QA completion stage commit remained blocked before archive, but release branch publish completed by manual retry.

## Requirement Summary

- `pgg lang`에 따라 `poggn` 내부 새 workflow 문서가 설정 언어로 생성되어야 한다.
- 상단 navigation의 프로젝트/설정 버튼은 줄바꿈 없이 표시되어야 한다.
- dashboard title은 dashboard title 설정 값을 고정 source of truth로 사용해야 한다.
- MUI SpeedDial은 persistent action tooltip을 사용하고, 동작 없는 정보 action은 제거하거나 read-only 의미를 명확히 해야 한다.
- SpeedDial 마지막에는 현재 pgg version을 Chip/read-only action으로 보여야 한다.
- SpeedDial의 프로젝트 선택 action은 mobile 화면에서만 보여야 한다.
- Sprint Progress 중복 상태 label은 하나로 정리해야 한다.
- 프로젝트 추가 dialog는 root path 입력과 category select가 같은 밀도와 크기의 세련된 form으로 보여야 한다.
- 사이드바 하단 status sync 안내와 설정 이동 버튼은 제거해야 한다.
- 모바일 Project drawer에서는 `WORKSPACE` 섹션을 숨기고 bottom navigation을 제거해야 한다.
- 모바일 workflow progress는 세로로 보여야 한다.
- workflow tab은 active tab 영역만 하단 border가 끊겨 연결된 panel과 자연스럽게 이어져야 한다.
- Settings 메뉴에는 category 관리 panel이 있어야 하며 추가, 삭제, 이름 변경, 기본값 지정, 표시 여부, 정렬이 가능해야 한다.
- 성공한 refactor stage가 실패로 표시되는 workflow state 계산을 수정해야 한다.
- 프로젝트 삭제는 위험 체크 후 복구 불가 문구와 두 번째 확인 체크를 요구해야 한다.

## Current Findings

- `apps/dashboard/src/app/DashboardShellChrome.tsx`에 TopNavigation, DashboardSpeedDial, mobile BottomNavigation, ProjectContextSidebar, ProjectSelectorDialog가 있다.
- `apps/dashboard/src/features/settings/SettingsWorkspace.tsx`는 main/refresh/git/system panel만 받으며 category panel은 없다.
- `apps/dashboard/src/features/project-list/CategoryManagementPanel.tsx`는 이미 category CRUD UI를 제공하므로 Settings panel에서 재사용 가능성이 높다.
- `apps/dashboard/src/app/DashboardApp.tsx`의 프로젝트 추가 dialog는 TextField와 select TextField를 단순 Stack으로 배치한다.
- `apps/dashboard/src/features/backlog/InsightsRail.tsx`의 Sprint Progress는 donut과 legend 모두 같은 item label을 렌더링할 수 있다.
- `apps/dashboard/src/features/history/historyModel.ts`의 workflow status 계산은 blocked evidence와 completion evidence 우선순위 점검이 필요하다.
- `.codex/sh/pgg-new-topic.sh`, `packages/core/src/templates.ts`, 관련 helper/template 생성 경로가 문서 언어 정책의 주요 변경 후보이다.

## Scope Summary

- Core/helper: `pgg lang` 기반 workflow 문서 생성 언어 계약과 template/helper 회귀 테스트를 추가한다.
- Dashboard shell: top navigation, SpeedDial, mobile bottom navigation 제거, mobile sidebar workspace 숨김을 정리한다.
- Dashboard settings: category management panel을 settings route에 추가하고 기존 CategoryManagementPanel 재사용 또는 구조 개선을 적용한다.
- Dashboard forms: project add dialog와 delete double confirmation UX를 개선한다.
- Dashboard workflow/insight: Sprint Progress 중복, workflow mobile layout, tab border, refactor success status 계산을 수정한다.

## Active Specs

- `spec/core/pgg-language-document-contract.md`
- `spec/dashboard/shell-navigation-speed-dial.md`
- `spec/dashboard/settings-category-management.md`
- `spec/dashboard/mobile-workflow-ux.md`
- `spec/dashboard/workflow-status-and-insight.md`
- `spec/dashboard/project-form-delete-safety.md`
- `spec/qa/dashboard-overhaul-verification.md`

## Active Tasks

- `T1`: PGG 문서 언어 계약
- `T2`: Dashboard shell navigation과 SpeedDial
- `T3`: Settings category management
- `T4`: Mobile workflow UX
- `T5`: Workflow status와 insight 중복 정리
- `T6`: Project add form과 delete safety
- `T7`: Verification과 산출물 기록

## Audit Applicability

- `pgg-token`: `required` | workflow 문서 생성 언어 정책과 helper/template output이 바뀌므로 state handoff와 generated 문서 범위를 점검해야 한다.
- `pgg-performance`: `not_required` | dashboard UI와 상태 계산 정정 중심이며 성능 민감 runtime 경로가 아니다.

## Expert Review

- 프로덕트 매니저: 96, blocking issue 없음
- UX/UI 전문가: 96, blocking issue 없음
- overall score: 96

## Changed Files

| CRUD | path | note |
|---|---|---|
| CREATE | `poggn/active/dashboard-language-ux-settings-overhaul/proposal.md` | 기능 개편 proposal 확정 |
| CREATE | `poggn/active/dashboard-language-ux-settings-overhaul/reviews/proposal.review.md` | proposal 전문가 review |
| CREATE | `poggn/active/dashboard-language-ux-settings-overhaul/state/current.md` | 다음 단계 handoff state |
| CREATE | `poggn/active/dashboard-language-ux-settings-overhaul/workflow.reactflow.json` | proposal workflow metadata |
| CREATE | `poggn/active/dashboard-language-ux-settings-overhaul/state/history.ndjson` | proposal stage evidence |
| CREATE | `poggn/active/dashboard-language-ux-settings-overhaul/state/dirty-worktree-baseline.txt` | topic 생성 시점 dirty worktree baseline |
| CREATE | `poggn/active/dashboard-language-ux-settings-overhaul/plan.md` | 구현 계획 |
| CREATE | `poggn/active/dashboard-language-ux-settings-overhaul/task.md` | task breakdown |
| CREATE | `poggn/active/dashboard-language-ux-settings-overhaul/spec/core/pgg-language-document-contract.md` | pgg lang 문서 생성 계약 |
| CREATE | `poggn/active/dashboard-language-ux-settings-overhaul/spec/dashboard/shell-navigation-speed-dial.md` | navigation/SpeedDial 계약 |
| CREATE | `poggn/active/dashboard-language-ux-settings-overhaul/spec/dashboard/settings-category-management.md` | settings category 계약 |
| CREATE | `poggn/active/dashboard-language-ux-settings-overhaul/spec/dashboard/mobile-workflow-ux.md` | mobile workflow UX 계약 |
| CREATE | `poggn/active/dashboard-language-ux-settings-overhaul/spec/dashboard/workflow-status-and-insight.md` | workflow status/insight 계약 |
| CREATE | `poggn/active/dashboard-language-ux-settings-overhaul/spec/dashboard/project-form-delete-safety.md` | add/delete safety 계약 |
| CREATE | `poggn/active/dashboard-language-ux-settings-overhaul/spec/qa/dashboard-overhaul-verification.md` | verification contract |
| CREATE | `poggn/active/dashboard-language-ux-settings-overhaul/reviews/plan.review.md` | plan 전문가 review |
| CREATE | `poggn/active/dashboard-language-ux-settings-overhaul/reviews/task.review.md` | task 전문가 review |
| UPDATE | `.codex/sh/pgg-new-topic.sh` | 신규 topic 문서 skeleton 언어 분기 |
| UPDATE | `packages/core/src/templates.ts` | managed helper template 언어 분기 동기화 |
| UPDATE | `packages/core/dist/templates.js` | generated core dist 갱신 |
| UPDATE | `packages/core/dist/templates.js.map` | generated core dist sourcemap 갱신 |
| UPDATE | `packages/core/test/skill-generation.test.mjs` | pgg lang ko/en 신규 topic skeleton 회귀 테스트 |
| UPDATE | `package.json` | dashboard history model 회귀 테스트를 root test에 포함 |
| CREATE | `scripts/dashboard-history-model.test.mjs` | workflow blocked/completion 우선순위 회귀 테스트 |
| UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | settings category panel, mobile nav 제거, add/delete dialog UX |
| UPDATE | `apps/dashboard/src/app/DashboardShellChrome.tsx` | top nav spacing, SpeedDial persistent tooltip/version, sidebar footer 제거 |
| UPDATE | `apps/dashboard/src/app/dashboardRouteState.ts` | settings category route와 bottom navigation 제거 |
| UPDATE | `apps/dashboard/src/features/backlog/InsightsRail.tsx` | Sprint Progress duplicate label dedupe |
| UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | mobile vertical workflow progress와 tab border 연결 UX |
| UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | blocked evidence보다 이후 completion evidence 우선 |
| UPDATE | `apps/dashboard/src/features/settings/SettingsWorkspace.tsx` | category settings panel 타입 허용 |
| UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | delete double confirmation locale |
| UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | settings view category 추가, bottom nav type 제거 |
| CREATE | `poggn/active/dashboard-language-ux-settings-overhaul/implementation/index.md` | implementation summary와 verification |
| CREATE | `poggn/active/dashboard-language-ux-settings-overhaul/implementation/diffs/001_UPDATE_pgg_language_document_contract.diff` | pgg language contract diff |
| CREATE | `poggn/active/dashboard-language-ux-settings-overhaul/implementation/diffs/002_UPDATE_dashboard_shell_settings_and_project_safety.diff` | shell/settings/project safety diff |
| CREATE | `poggn/active/dashboard-language-ux-settings-overhaul/implementation/diffs/003_UPDATE_workflow_status_insight_and_mobile_progress.diff` | workflow/insight/mobile progress diff |
| CREATE | `poggn/active/dashboard-language-ux-settings-overhaul/implementation/diffs/004_UPDATE_dashboard_history_verification_tests.diff` | dashboard history verification test diff |
| CREATE | `poggn/active/dashboard-language-ux-settings-overhaul/reviews/code.review.md` | implementation 전문가 review |
| UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | legacy category branch 제거와 category panel 렌더링 중복 통합 |
| UPDATE | `apps/dashboard/src/shared/store/dashboardStore.ts` | unused activeSidebarItem persistence/API 제거 |
| UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | unused DashboardSidebarItem/store field 제거 |
| UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | removed sidebar footer locale dead key 제거 |
| CREATE | `poggn/active/dashboard-language-ux-settings-overhaul/refactor/cleanup.md` | refactor cleanup evidence |
| CREATE | `poggn/active/dashboard-language-ux-settings-overhaul/reviews/refactor.review.md` | refactor 전문가 review |
| CREATE | `poggn/active/dashboard-language-ux-settings-overhaul/implementation/diffs/005_REFACTOR_dashboard_state_and_category_cleanup.diff` | dashboard state/category cleanup diff |
| CREATE | `poggn/active/dashboard-language-ux-settings-overhaul/implementation/diffs/006_REFACTOR_dashboard_unused_locale_cleanup.diff` | unused dashboard locale cleanup diff |
| CREATE | `poggn/active/dashboard-language-ux-settings-overhaul/token/report.md` | required token audit report |
| CREATE | `poggn/active/dashboard-language-ux-settings-overhaul/qa/report.md` | QA report and release decision |

## Next Step

Archive, version 기록, release branch publish가 완료됐다.

## Next Action

Release branch `release/2.7.0-dashboard-overhaul` is published. Keep or clean unrelated local `add-img/git.png`, `add-img/timeline.png`, and `test.md` separately.

## Git Publish Message

- title: feat: 2.7.0.dashboard UX와 문서 언어 개편
- why: pgg 문서 언어 정책과 dashboard navigation, SpeedDial, settings, mobile workflow UX를 하나의 개편으로 정리해야 한다
- footer: Refs: dashboard-language-ux-settings-overhaul
