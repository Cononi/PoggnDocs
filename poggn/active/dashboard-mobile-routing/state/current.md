# Current State

## Topic

dashboard-mobile-routing

## Current Stage

qa

## Goal

dashboard URL/mobile action 구현, refactor, QA 결과를 검증하고 archive한다.

## Confirmed Scope

- dashboard screen state를 path와 query로 나눠 새로고침, 뒤로가기, 직접 URL 진입 시 동일 화면과 선택 상태를 복원한다.
- path는 home/projects/settings 같은 primary screen을 표현하고, query는 selected project, project section, settings panel, topic/file/detail selection, 필요한 modal context를 담당한다.
- API/snapshot으로 받아오는 데이터 값을 제외한 모든 UI 고정 문구는 `dashboardLocale` i18n dictionary에 등록한다.
- settings 화면 header에서는 insights button과 latest project chip을 노출하지 않는다.
- PC header의 project add button을 제거하고 MUI Speed Dial action으로 이동한다.
- latest project summary는 Speed Dial 최상단에 표시하되 클릭할 수 없는 non-interactive item으로 제공한다.
- 모바일 Speed Dial 기본 action은 home, project add이며, project 화면에서는 project selector action을 추가한다.
- project selector action은 project selector modal을 열고, modal 내부에서 project delete action을 제공한다.
- project delete는 별도 confirmation modal의 재확인을 반드시 거친다.
- project insights action은 Speed Dial로 이동한다.
- 모바일 화면에는 MUI Bottom Navigation을 적용해 home/projects/settings 이동을 제공한다.
- workflow overview flow status에 `stage-blocked`를 추가하고 blocked failure는 lock icon과 danger color로 명확하게 표시한다.
- route-state adapter는 외부 router dependency 없이 browser History API와 `popstate`를 사용해 app/store와 동기화한다.
- implementation task는 S1-S5 spec 경계를 그대로 따른다.

## Constraints

- project scope: `current-project`
- archive type: `feat`
- version bump: `minor`
- target version: `2.6.0`
- short name: `dashboard-mobile-routing`
- working branch: `ai/feat/2.6.0-dashboard-mobile-routing`
- release branch: `release/2.6.0-dashboard-mobile-routing`
- auto mode: `on`
- teams mode: `off`
- git mode: `on`
- current-project verification contract가 없으므로 이후 QA에는 `manual verification required`를 남겨야 한다.
- MUI Speed Dial과 Bottom Navigation은 기존 `@mui/material` dependency를 사용한다.

## Open Items

- status: pass

## User Question Record

- ref: `proposal.md` -> `## 3. 사용자 입력 질문 기록`

## Audit Applicability

- [pgg-token]: [not_required] | dashboard UI routing과 interaction 재배치가 핵심이며 token workflow audit 대상이 아니다
- [pgg-performance]: [not_required] | 성능 민감 계산이나 검증 계약 변경보다 navigation/state/UI 표현 변경이 중심이다

## Planning Notes

- route map과 query schema는 `spec/ui/dashboard-route-state.md`에 확정했다.
- responsive action matrix는 `spec/ui/responsive-speed-dial-bottom-nav.md`에 확정했다.
- project selector delete flow는 기존 confirmation dialog를 재사용하는 방향으로 확정했다.
- i18n spec은 "API 데이터 제외, 고정 UI copy 포함" 기준을 명시했다.
- `stage-blocked`는 기존 `blocked` 계산과 호환되는 type/model/rendering mapping으로 계획했다.

## Active Specs

- `S1`: `spec/ui/dashboard-route-state.md`
- `S2`: `spec/ui/responsive-speed-dial-bottom-nav.md`
- `S3`: `spec/ui/project-selector-delete-flow.md`
- `S4`: `spec/infra/dashboard-i18n-coverage.md`
- `S5`: `spec/ui/workflow-stage-blocked.md`

## Active Tasks

- `T1`: done
- `T2`: done
- `T3`: done
- `T4`: done
- `T5`: done

## Implementation Summary

- `apps/dashboard/src/app/dashboardRouteState.ts`를 추가해 path/query parsing, serialization, History API write를 분리했다.
- `DashboardApp.tsx`가 route-level state를 URL과 동기화하고 `/home`, `/projects`, `/settings` 및 `project`, `section`, `panel`, `topic`, `file`, `insights`, `modal` query를 반영한다.
- PC header의 project add/insights/latest chip을 제거하고 MUI Speed Dial로 add, insights, project selector, home, latest summary를 제공한다.
- 모바일 Bottom Navigation으로 home/projects/settings 이동을 제공한다.
- project selector modal에서 project delete action을 제공하고 기존 delete confirmation dialog로 연결한다.
- route-level fields를 localStorage persistence에서 제외해 URL과 store 충돌을 줄였다.
- workflow model에 `stage-blocked`를 추가하고 blocked evidence를 lock icon + danger tone으로 렌더링한다.
- 새 UI copy는 `dashboardLocale` ko/en key로 등록했다.

## Refactor Summary

- route-state UI projection과 Bottom Navigation value 계산을 `dashboardRouteState.ts`로 이동해 `DashboardApp.tsx`의 route 조립 책임을 줄였다.
- route 초기 상태를 한 번만 읽도록 `initialRouteState`를 도입했다.
- `workflowProgressStatusStageBlocked` locale key를 실제 `stage-blocked` 렌더링에 연결했다.
- 화면에 surfacing하지 않는 `routeStateRepaired` locale copy를 제거했다.

## Verification

- proposal document review: pass
- plan document review: pass
- task document review: pass
- `./.codex/sh/pgg-gate.sh pgg-plan dashboard-mobile-routing`: pass
- `pnpm --filter @pgg/dashboard build`: pass
- `./.codex/sh/pgg-gate.sh pgg-code dashboard-mobile-routing`: pass
- implementation stage commit: `017e6a279fecee4dfccf0c7b98276856cf58aeb7`
- refactor `pnpm --filter @pgg/dashboard build`: pass
- `./.codex/sh/pgg-gate.sh pgg-refactor dashboard-mobile-routing`: pass
- `./.codex/sh/pgg-gate.sh pgg-qa dashboard-mobile-routing`: pass
- QA report: pass
- current-project verification contract: `manual verification required`

## Git Publish Message

- title: feat: 2.6.0.dashboard mobile routing
- why: dashboard가 내부 state 중심으로 화면을 유지해 새로고침과 모바일 navigation에서 불편이 발생하므로 URL 상태 복원, Speed Dial action, Bottom Navigation, project selector/delete flow, i18n 기본 등록, stage-blocked 실패 표시 기준을 하나의 feature로 정리한다.
- footer: Refs: dashboard-mobile-routing

## Changed Files

| CRUD | path | diff |
|---|---|---|
| CREATE | `poggn/active/dashboard-mobile-routing/proposal.md` | 없음 |
| CREATE | `poggn/active/dashboard-mobile-routing/reviews/proposal.review.md` | 없음 |
| CREATE | `poggn/active/dashboard-mobile-routing/state/current.md` | 없음 |
| CREATE | `poggn/active/dashboard-mobile-routing/state/history.ndjson` | 없음 |
| CREATE | `poggn/active/dashboard-mobile-routing/state/dirty-worktree-baseline.txt` | 없음 |
| CREATE | `poggn/active/dashboard-mobile-routing/workflow.reactflow.json` | 없음 |
| CREATE | `poggn/active/dashboard-mobile-routing/plan.md` | 없음 |
| CREATE | `poggn/active/dashboard-mobile-routing/task.md` | 없음 |
| CREATE | `poggn/active/dashboard-mobile-routing/spec/ui/dashboard-route-state.md` | 없음 |
| CREATE | `poggn/active/dashboard-mobile-routing/spec/ui/responsive-speed-dial-bottom-nav.md` | 없음 |
| CREATE | `poggn/active/dashboard-mobile-routing/spec/ui/project-selector-delete-flow.md` | 없음 |
| CREATE | `poggn/active/dashboard-mobile-routing/spec/infra/dashboard-i18n-coverage.md` | 없음 |
| CREATE | `poggn/active/dashboard-mobile-routing/spec/ui/workflow-stage-blocked.md` | 없음 |
| CREATE | `poggn/active/dashboard-mobile-routing/reviews/plan.review.md` | 없음 |
| CREATE | `poggn/active/dashboard-mobile-routing/reviews/task.review.md` | 없음 |
| CREATE | `apps/dashboard/src/app/dashboardRouteState.ts` | `implementation/diffs/003_CREATE_apps_dashboard_src_app_dashboardRouteState_ts.diff` |
| UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/001_UPDATE_apps_dashboard_src_app_DashboardApp_tsx.diff` |
| UPDATE | `apps/dashboard/src/app/DashboardShellChrome.tsx` | `implementation/diffs/002_UPDATE_apps_dashboard_src_app_DashboardShellChrome_tsx.diff` |
| UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | `implementation/diffs/004_UPDATE_apps_dashboard_src_shared_model_dashboard_ts.diff` |
| UPDATE | `apps/dashboard/src/shared/store/dashboardStore.ts` | `implementation/diffs/005_UPDATE_apps_dashboard_src_shared_store_dashboardStore_ts.diff` |
| UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/006_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` |
| UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | `implementation/diffs/007_UPDATE_apps_dashboard_src_features_history_historyModel_ts.diff` |
| UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | `implementation/diffs/008_UPDATE_apps_dashboard_src_features_history_HistoryWorkspace_tsx.diff` |
| CREATE | `poggn/active/dashboard-mobile-routing/implementation/index.md` | 없음 |
| CREATE | `poggn/active/dashboard-mobile-routing/reviews/code.review.md` | 없음 |
| UPDATE | `apps/dashboard/src/app/dashboardRouteState.ts` | `implementation/diffs/009_REFACTOR_apps_dashboard_src_app_dashboardRouteState_ts.diff` |
| UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | `implementation/diffs/010_REFACTOR_apps_dashboard_src_app_DashboardApp_tsx.diff` |
| UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | `implementation/diffs/011_REFACTOR_apps_dashboard_src_features_history_HistoryWorkspace_tsx.diff` |
| UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/012_REFACTOR_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` |
| CREATE | `poggn/active/dashboard-mobile-routing/reviews/refactor.review.md` | 없음 |
| CREATE | `poggn/active/dashboard-mobile-routing/qa/report.md` | 없음 |

## Last Expert Score

- phase: qa
- score: 94
- blocking issues: 없음

## Next Action

archive allowed
