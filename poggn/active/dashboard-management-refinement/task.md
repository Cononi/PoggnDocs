---
pgg:
  topic: "dashboard-management-refinement"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-23T02:24:55Z"
  auto_mode: "on"
reactflow:
  node_id: "task"
  node_type: "task"
  label: "task.md"
state:
  summary: "dashboard management refinement 구현 작업을 shell, board, category/history, settings, infra 기준으로 분해한다."
  next: "pgg-code"
---

# Task

## 1. Audit Applicability

- [pgg-token]: [not_required] | dashboard UI/shared-state 구현이 중심이며 token audit가 핵심이 아니다
- [pgg-performance]: [not_required] | interaction 재정렬과 data client 변경이 우선이며 성능 측정 gate는 아니다

## 2. 작업 목록

| Task ID | Spec Ref | 작업 요약 | 선행 조건 | 완료 기준 |
|---|---|---|---|---|
| T1 | `S5` | `apps/dashboard/src/shared/api/dashboard.ts`를 axios 기반 client로 재구성하고 snapshot/model/store/locale에 `History`, title icon, delete guard, language/theme preference에 필요한 필드를 추가한다. | proposal, S5 | `fetch` 직접 호출이 제거되고 sidebar/settings/title icon/delete flow를 지탱하는 타입과 locale key가 준비된다 |
| T2 | `S1`, `S5` | `DashboardShellChrome.tsx`, `DashboardApp.tsx`, store selection 흐름을 `Project`/`Settings` top menu와 `MANAGEMENT` sidebar 구조로 재편한다. | T1, S1, S5 | top nav는 `Project`, `Settings`만 유지하고 utility strip은 latest project + `Insight`만 남으며, project sidebar는 `Board`, `Category`, `Report`, `History` 순서로 동작한다 |
| T3 | `S2`, `S5` | `ProjectListBoard`와 관련 board model을 add-img/1 방향의 card layout으로 재구성하고 drag-and-drop reorder/category move, delete modal, filesystem delete checkbox guard를 구현한다. | T1, T2, S2, S5 | project card가 delete/open/drag 상호작용을 구분하고, delete modal이 안전 가드를 제공하며, board가 category 구조를 유지한 채 카드 이동을 지원한다 |
| T4 | `S3`, `S5` | `Category` 화면을 table 기반 CRUD surface로 바꾸고 `Report`, `History`를 별도 표면으로 분리한다. | T1, T2, S3, S5 | category table이 default/add/edit/delete를 지원하고, report/history가 목적이 다른 테이블 뷰로 렌더링된다 |
| T5 | `S4`, `S5` | `SettingsWorkspace`와 관련 shell title surface를 재구성해 title/title icon sync, language/theme toggle, immediate/apply mutation 모델, add-img/2 스타일 정렬을 구현한다. | T1, T2, S4, S5 | page-level save 버튼 없이 settings가 동작하고, title/title icon은 field-level apply로 shell/browser surface에 반영되며, select/radius 스타일이 재정렬된다 |
| T6 | `S1`, `S2`, `S3`, `S4`, `S5` | responsive/empty/error state, i18n wiring, manual verification note, 통합 interaction 회귀를 점검하고 구현 기록을 남긴다. | T3, T4, T5 | compact shell, delete guard, history/report, settings immediate/apply, title/icon sync, manual verification required가 통합적으로 확인된다 |

## 3. 구현 메모

- T1은 `shared/model/dashboard.ts`, `shared/store/dashboardStore.ts`, `shared/locale/dashboardLocale.ts`, `shared/api/dashboard.ts`를 함께 봐야 한다.
- T1은 `themeMode`를 서버 mutation으로 보내지 않고 기존 local storage persistence를 재사용하는 방향이 적절하다.
- T2는 기존 `backlog`/`project-settings` 기반 enum을 `category`/`history` 중심으로 재정의하면서 detail surface 진입 경로를 별도 state로 유지해야 한다.
- T3는 `projectBoard.ts`의 category/project ordering 모델을 유지하면서 drag-and-drop 결과를 mutation payload로 투영해야 한다.
- T3는 delete modal이 dashboard 등록 삭제와 filesystem 삭제를 구분해야 하므로 `dangerousDeleteRoot` 같은 명시적 payload flag가 필요하다.
- T4는 `RecentActivityTable` 재사용 여부와 신규 `History` table 분리가 핵심이며, category visibility/order 기존 기능을 회귀시키지 않도록 주의해야 한다.
- T5는 title/title icon, refresh interval, git prefixes처럼 입력 필드가 있는 설정은 field-level apply 버튼을 사용하고, toggle/select는 즉시 반영하는 규칙을 지켜야 한다.
- T6는 verification contract 미선언 상태를 유지해야 하므로 framework 명령 추론 실행 대신 `manual verification required` 기록을 남겨야 한다.

## 4. 검증 체크리스트

- top navigation이 `Project`, `Settings`만 보여 주고 검색, 우측 settings utility, avatar가 제거되는지 확인한다.
- project sidebar가 `MANAGEMENT` 라벨과 `Board`, `Category`, `Report`, `History`만 노출하는지 확인한다.
- board의 add project 진입이 top nav가 아니라 board 본문 안에서 동작하는지 확인한다.
- project card가 version, latest, active/stage 메타데이터와 delete/open/drag interaction을 함께 제공하는지 확인한다.
- delete modal에서 filesystem delete checkbox를 체크하지 않으면 실제 프로젝트 경로 삭제가 일어나지 않는지 확인한다.
- category table이 default 변경, 생성, 수정, 삭제를 지원하고 기존 category visibility/order 정보가 사라지지 않는지 확인한다.
- `Report`와 `History`가 다른 데이터 시각 목적을 가지는지 확인한다.
- settings main에서 title/title icon, language, dark mode를 다루고 browser title/shell branding이 함께 반영되는지 확인한다.
- settings 전체에서 page-level save 버튼이 제거되고 field-level apply 또는 immediate mutation 규칙이 지켜지는지 확인한다.
- dropdown/select 반경과 필드 styling이 기존 dashboard tone과 맞고 MUI 기본 이질감이 줄어드는지 확인한다.
- API client가 axios 기반으로 통일되고 live/static fallback error semantics가 유지되는지 확인한다.
- current-project verification contract가 없으므로 QA/기록에 `manual verification required`가 남는지 확인한다.
