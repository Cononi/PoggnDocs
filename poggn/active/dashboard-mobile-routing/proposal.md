---
pgg:
  topic: "dashboard-mobile-routing"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 95
  updated_at: "2026-04-27T08:36:06Z"
  auto_mode: "on"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "2.6.0"
  short_name: "dashboard-mobile-routing"
  working_branch: "ai/feat/2.6.0-dashboard-mobile-routing"
  release_branch: "release/2.6.0-dashboard-mobile-routing"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "dashboard를 URL 유지, 모바일 navigation, Speed Dial action, i18n 기본 등록, stage-blocked 상태 표시까지 포함해 재정렬하는 feature proposal을 확정한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

dashboard-mobile-routing

## 2. 변경 분류

- archive_type: `feat`
- version_bump: `minor`
- target_version: `2.6.0`
- short_name: `dashboard-mobile-routing`
- working_branch: `ai/feat/2.6.0-dashboard-mobile-routing`
- release_branch: `release/2.6.0-dashboard-mobile-routing`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- `$pgg-add dashboard 개편 사항입니다.`
- `- 현재는 / home 주소에서 이동을 하지만 uri로 모든 메뉴등과 해당 페이지에서 화면 유지를 위해 새로고침시 유지할 수 있게 각 화면 특성에 맞게 path와 query로 적절히 나눠 주세요.`
- `- api를 통해서 받아오는 데이터를 제외하고 모든 글은 i18n이 기본으로 등록되야 합니다.`
- `- setting 페이지 에서 헤더에 insights 버튼과, 최신 프로젝트 clip은 없어야 할 거 같습니다.`
- `- 최신 프로젝트 clip은 speed dial에서 클릭할 수 없는 버튼으로 최상단에 표기되었음 좋겟습니다.`
- `- 모바일 화면에서 불편한게 많습니다. 세팅 메뉴로 오면 홈으로 갈 수 없는 문제가 있습니다.`
- `- pc화면의 헤더에 프로젝트 추가 버튼을 제거하고, mui에 speed dial을 활용해서 프로젝트 추가 기능이 필요 합니다.`
- `- 모바일 화면에서는 mui의 speed dial이 홈, 프로젝트 추가가 기본이며, project화면 들어왓을때는 기존 pc화면에 사이드바에서 선택하던 프로젝트 선택과 달리 speed dial에서 프로젝트 선택 버튼으로 모달을 띄우도록 해야합니다.`
- `- 프로젝트 모달에서 프로젝트 삭제 기능이 필요합니다. 삭제 시 모달로 재확인 문구가 필요 합니다.`
- `- project의 insights 버튼도 speed dial로 이동해야 합니다.`
- `- mui의 bottom navigation을 모바일 화면에서 적용되게해서 활용 부탁드립니다.`
- `- workflow에 Overview내에 flow 상태중에 blocked 상태로 실패한 경우에 대해서도 상태값을 넣어 주세요. 상태값은 stage-blocked이며, 보여줄 화면에 플로우는 자물쇠 모양에 danger 색으로 누가봐도 실패라고 알아볼 수 잇어야 합니다.`

## 4. 왜 하는가

- 현재 dashboard는 `/` 또는 home entry 안에서 React state로 top menu, project detail section, settings panel, modal 상태를 유지한다. 새로고침하거나 URL을 공유하면 사용자가 보던 화면으로 복귀하기 어렵다.
- header에 project add, insights, latest project chip이 섞여 있어 settings 화면과 모바일 화면에서 primary action 우선순위가 흐려진다.
- 모바일 shell에서는 settings에 들어간 뒤 home으로 돌아가는 경로가 불명확하고, PC sidebar 중심 project selector 패턴이 좁은 화면에 그대로 노출되어 조작성이 떨어진다.
- dashboard 문자열은 API/snapshot에서 오는 데이터와 UI copy가 섞일 수 있으므로, API 데이터 외의 모든 고정 문구를 locale dictionary에 등록하는 기준이 필요하다.
- workflow overview는 실패/차단 상태를 `blocked` 또는 release outcome 중심으로 일부 계산하지만, 사용자 요구의 명시 상태값 `stage-blocked`와 자물쇠+dangertone 시각 표현을 아직 표준 상태로 보장하지 않는다.

## 5. 현재 구현 확인

- `apps/dashboard/src/app/DashboardApp.tsx`
  `activeTopMenu`, `activeDetailSection`, `activeSettingsView`, `selectedProjectId`, `insightsRailOpen`, modal state를 app 내부 state로 관리한다. route path/query와의 source-of-truth 계약은 없다.
- `apps/dashboard/src/app/DashboardShellChrome.tsx`
  header에 project add button, insights button, latest project chip이 있고, project selector dialog는 선택 중심 UI다. project 삭제 확인 dialog는 `DashboardApp.tsx`에 이미 존재하지만 selector modal 안 action으로 연결되지 않는다.
- `apps/dashboard/src/shared/locale/dashboardLocale.ts`
  dashboard i18n dictionary가 존재한다. 이번 변경은 새 copy를 전부 이 dictionary에 추가하고, API 데이터와 UI copy의 경계를 분명히 해야 한다.
- `apps/dashboard/src/features/history/historyModel.ts`
  workflow flow status는 `completed | current | updating | pending | blocked`를 사용하고 failure 감지 로직이 있다. 요구된 `stage-blocked`는 별도 status contract와 visual mapping으로 추가해야 한다.
- `apps/dashboard/package.json`
  `@mui/material`과 `@mui/icons-material`이 이미 있어 MUI Speed Dial, Bottom Navigation, lock/danger icon 표현은 추가 dependency 없이 구현 가능하다.

## 6. 무엇을 할 것인가

- dashboard screen state를 route path와 query로 분리한다.
- top-level path는 home/projects/settings 등 화면 전환을 표현한다.
- project id, project section, settings panel, topic/file/detail selection, modal deep-link 필요 여부는 화면 특성에 맞춰 query로 유지한다.
- 새로고침, 뒤로가기, 직접 URL 진입 시 동일 화면과 선택 상태가 복원되어야 한다.
- UI 고정 문자열은 API로 받아오는 데이터 값을 제외하고 기본 i18n key로 등록한다.
- settings 화면 header에서는 insights button과 latest project chip을 노출하지 않는다.
- latest project chip은 header에서 제거하고 Speed Dial 최상단에 클릭 불가 action 또는 disabled summary item으로 표시한다.
- PC header의 project add button을 제거하고 MUI Speed Dial의 project add action으로 이동한다.
- 모바일 기본 Speed Dial action은 home, project add를 제공한다.
- 모바일 project 화면에서는 Speed Dial에 project selector action을 추가하고, 이 action이 project selector modal을 연다.
- project selector modal에는 project delete action을 추가하고, 삭제 전 별도 confirmation modal로 재확인을 요구한다.
- project insights action은 header/sidebar가 아니라 Speed Dial action으로 이동한다.
- 모바일 화면에는 MUI Bottom Navigation을 적용해 home/projects/settings 등 주요 화면 이동을 제공한다.
- workflow overview flow status에 `stage-blocked`를 추가하고, blocked failure 상태는 lock icon과 danger color로 명확히 표시한다.

## 7. 범위

### 포함

- `apps/dashboard/src/app/DashboardApp.tsx` route-state source-of-truth, URL 복원, modal/action wiring 정리
- `apps/dashboard/src/app/DashboardShellChrome.tsx` header cleanup, Speed Dial, Bottom Navigation, project selector modal action 재배치
- `apps/dashboard/src/shared/locale/dashboardLocale.ts` 신규 UI copy 전부 등록 및 ko/en 대응
- `apps/dashboard/src/shared/model/dashboard.ts` 또는 관련 view model type의 route/status/action type 보강
- `apps/dashboard/src/features/history/historyModel.ts`의 workflow flow status model에 `stage-blocked` 추가
- workflow overview/rendering surface에서 lock icon과 danger tone mapping 적용
- project deletion confirmation flow를 project selector modal entry point와 연결

### 제외

- dashboard 외 app/package의 별도 UI 개편
- API로 받아오는 실제 project/topic 데이터 값의 번역 또는 변환
- project persistence schema 변경을 동반하는 삭제 정책 변경
- 인증, 권한, 외부 라우터 서비스 연동
- QA archive 또는 release publish 처리

## 8. 제약 사항

- 작업 범위는 `current-project` 내부 dashboard 코드와 topic 문서로 제한한다.
- `pgg teams=off`, `pgg git=on`, verification contract 미선언 상태다. 후속 QA에는 `manual verification required`를 유지한다.
- MUI Speed Dial과 Bottom Navigation은 기존 MUI dependency를 사용한다.
- header에서 제거되는 action은 기능 제거가 아니라 Speed Dial/Bottom Navigation로 이동하는 것으로 해석한다.
- latest project summary는 Speed Dial 최상단에 표시하되 클릭으로 route 이동이나 project 선택을 발생시키지 않는 non-interactive item이어야 한다.
- URL 설계는 화면 복원과 공유 가능성을 우선하되, volatile UI state를 과도하게 query에 넣지 않는다.

## 9. auto mode 처리

- poggn auto mode: `on`
- auto mode가 `on`이므로 아래 기준안을 proposal 단계에서 확정한다.
- route-state는 path가 primary screen, query가 selected project/section/panel/topic/file/modal context를 담당한다.
- settings path에서는 header insights/latest project 노출을 제거한다.
- project add, insights, latest project summary, mobile project selector는 Speed Dial로 통합한다.
- mobile primary navigation은 Bottom Navigation으로 제공한다.
- project selector modal의 delete action은 confirmation dialog를 반드시 거친다.
- workflow blocked failure status는 `stage-blocked`로 모델링한다.
- semver는 `2.5.0 -> 2.6.0` minor로 확정한다.

## 10. 기준안

| 항목 | 기준안 | 상태 |
|---|---|---|
| URL state | path는 screen, query는 project/section/panel/selection 상태 유지 | resolved |
| i18n | API 데이터 외 모든 고정 문구 dictionary 등록 | resolved |
| settings header | settings에서는 insights button/latest chip 미노출 | resolved |
| project add | PC header 제거 후 Speed Dial action으로 이동 | resolved |
| latest project | Speed Dial 최상단 non-interactive summary로 표시 | resolved |
| mobile navigation | Bottom Navigation으로 home/projects/settings 이동 | resolved |
| mobile Speed Dial | 기본 home/add, project 화면에서 selector action 추가 | resolved |
| project delete | selector modal delete action + confirmation modal | resolved |
| project insights | Speed Dial action으로 이동 | resolved |
| workflow blocked | `stage-blocked`, lock icon, danger tone | resolved |
| semver | `feat` + `minor` (`2.6.0`) | resolved |

## 11. Audit Applicability

- [pgg-token]: [not_required] | dashboard UI routing과 interaction 재배치가 핵심이며 token workflow audit 대상이 아니다
- [pgg-performance]: [not_required] | 성능 민감 계산이나 검증 계약 변경보다 navigation/state/UI 표현 변경이 중심이다

## 12. 성공 기준

- URL 직접 진입과 새로고침 후에도 주요 screen, selected project, project section, settings panel이 복원된다.
- API/snapshot 데이터 값을 제외한 새 UI copy가 locale dictionary를 통해 ko/en으로 제공된다.
- settings 화면 header에는 insights button과 latest project chip이 보이지 않는다.
- project add와 project insights가 header가 아닌 Speed Dial에서 동작한다.
- latest project summary가 Speed Dial 최상단에 non-interactive item으로 표시된다.
- 모바일에서는 Bottom Navigation으로 home/projects/settings 이동이 가능하고 settings에서 home 복귀가 막히지 않는다.
- 모바일 project 화면에서는 Speed Dial project selector action으로 modal을 열 수 있다.
- project selector modal에서 project delete를 시작할 수 있고, 삭제 전 confirmation modal 문구가 표시된다.
- workflow overview에서 blocked failure flow가 `stage-blocked` status, lock icon, danger color로 표시된다.
- 다음 단계가 `state/current.md`만으로 URL/i18n/mobile/action/status 범위를 이어받을 수 있다.

## 13. 전문가 평가 요약

- 프로덕트 매니저: 새로고침 복원, 모바일 이동성, action 재배치, 실패 상태 시각화를 하나의 dashboard navigation feature로 묶는 범위가 사용자 문제를 직접 해결한다.
- UX/UI 전문가: header의 과밀한 action을 Speed Dial과 Bottom Navigation으로 분리하고, project selector/delete/insights를 화면 맥락별 action으로 제공하는 구조가 PC와 모바일 모두에서 더 명확하다.

## 14. 다음 단계

- `pgg-plan`에서 route map, query schema, responsive navigation spec, Speed Dial action matrix, project selector deletion flow, i18n key coverage, `stage-blocked` status rendering spec으로 분해한다.
