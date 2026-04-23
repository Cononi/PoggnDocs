---
pgg:
  topic: "dashboard-management-refinement"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-23T02:24:55Z"
  auto_mode: "on"
reactflow:
  node_id: "plan"
  node_type: "doc"
  label: "plan.md"
state:
  summary: "dashboard management refinement를 shell, board, category/history, settings, data-client spec으로 분해한다."
  next: "pgg-code"
---

# Plan

## 1. 목표

- 현재 dashboard를 `Project` / `Settings` 두 상위 메뉴와 `MANAGEMENT` 중심 sidebar로 다시 정렬한다.
- `Board` 표면은 `add-img/1.png` 방향을 참고해 project card 정보 위계, drag-and-drop, 삭제 가드, category 기반 흐름을 강화한다.
- `Category`, `Report`, `History`를 서로 다른 책임을 가진 운영 표면으로 분리해 기존 board/settings 중심 구조의 혼잡을 줄인다.
- `Settings`는 page-level save 버튼을 없애고, toggle/select는 즉시 반영, text/number/icon 입력은 field-level apply 방식으로 고정한다.
- dashboard title/title icon, browser title, favicon-like shell branding, language/theme preference, `fetch -> axios` 전환, shared state/model/API 확장 범위를 문서로 고정해 `pgg-code`가 추가 해석 없이 구현에 들어갈 수 있게 한다.

## 2. Audit Applicability

- [pgg-token]: [not_required] | dashboard UI, shared state, API client 설계가 중심이며 workflow token 구조 변경은 없다
- [pgg-performance]: [not_required] | 이번 단계는 interaction/spec 문서화 범위이며 성능 측정이나 verification contract 변경이 아니다

## 3. Spec 분해

| Spec ID | path | 목적 | 구현 핵심 |
|---|---|---|---|
| S1 | `spec/ui/shell-navigation-and-management-sidebar.md` | 상단 `Project`/`Settings` 메뉴와 `MANAGEMENT` sidebar 정보 구조를 정의한다. | top navigation 정리, utility strip 축소, project/settings 문맥 분리, responsive shell |
| S2 | `spec/ui/project-board-card-actions.md` | project board 카드의 시각 구조와 상호작용을 정의한다. | add-img/1 기반 board 밀도, card metadata, drag-and-drop, delete modal guard |
| S3 | `spec/ui/category-table-and-history-surface.md` | `Category`, `Report`, `History` 표면의 책임과 테이블 계약을 정의한다. | category table CRUD, report/history 구분, row actions, existing category model 보존 |
| S4 | `spec/ui/settings-title-icon-and-preferences.md` | settings 각 패널의 편집 규칙과 스타일 정렬 기준을 정의한다. | title/title icon sync, language/theme toggle, field-level apply, save-less UX, add-img/2 스타일 |
| S5 | `spec/infra/dashboard-data-client-and-shared-state.md` | axios client, snapshot/model/store/locale/theme 확장 기준을 정의한다. | `fetch -> axios`, delete payload, history/sidebar enums, title icon data, locale/store persistence |

## 4. 구현 순서

1. S5에서 axios client, snapshot/model/store/locale 경계를 먼저 고정해 shell, board, settings가 같은 source-of-truth를 쓰게 맞춘다.
2. S1에서 top navigation과 `MANAGEMENT` sidebar 구조를 재정의해 `DashboardShellChrome.tsx`와 store selection 흐름을 단순화한다.
3. S2에서 board 카드 구조, drag-and-drop, delete modal guard를 정의해 가장 큰 interaction 변화를 먼저 닫는다.
4. S3에서 `Category`, `Report`, `History`를 별도 표면으로 분리해 table/view 계약과 현재 category data 모델의 유지 범위를 고정한다.
5. S4에서 settings의 immediate/apply mutation 규칙, title/title icon sync, language/theme toggle, style alignment를 확정한다.
6. `task.md`에서는 infra -> shell -> board -> category/history -> settings -> integration 검증 순서로 구현 단위를 자른다.

## 5. 검증 전략

- navigation 검증: top nav가 `Project`, `Settings`만 노출하고 우측 utility에 latest project indicator와 `Insight`만 남는지 확인한다.
- sidebar 검증: project 문맥은 `MANAGEMENT` 아래 `Board`, `Category`, `Report`, `History`만 노출하고 `Development` 섹션이 제거되는지 확인한다.
- board 검증: card가 version, latest badge, stage/activity 정보를 유지하면서 drag-and-drop reorder/category move와 delete action을 함께 제공하는지 확인한다.
- delete guard 검증: project delete modal이 metadata removal과 filesystem delete를 분리하고, checkbox opt-in 없이 실제 폴더 삭제를 허용하지 않는지 확인한다.
- category/history 검증: category table이 default/add/edit/delete를 지원하고, `Report`와 `History`가 서로 다른 테이블 목적을 갖는지 확인한다.
- settings 검증: page-level save 버튼 없이 toggle/select는 즉시 반영되고 text/number/icon 계열은 field-level apply로 동작하는지 확인한다.
- title/icon 검증: dashboard title은 shell title과 browser `document.title`에 반영되고, SVG title icon은 shell brand mark와 favicon surface를 함께 갱신할 수 있는지 확인한다.
- client/state 검증: `fetch` 직접 호출이 제거되고 axios client/fallback/error handling으로 일원화되며, sidebar/settings/theme/language 관련 state가 예측 가능하게 복원되는지 확인한다.
- workflow 검증: current-project verification contract가 없으므로 구현/QA 기록에 `manual verification required`가 유지되는지 확인한다.

## 6. 리스크와 가드레일

- backlog 중심 구조와 새 `Board/Category/Report/History` 구조가 반쯤 섞이면 navigation이 더 혼란스러워진다. S1에서 top menu와 sidebar enum을 먼저 재정의한다.
- drag-and-drop과 delete action을 같은 카드에 얹을 때 클릭 충돌이 발생할 수 있다. S2에서 card open, drag handle, delete trigger의 hit area를 분리한다.
- 실제 폴더 삭제를 일반 삭제와 동일한 endpoint로 처리하면 사고 가능성이 커진다. S2/S5에서 explicit flag와 modal copy를 동시에 강제한다.
- `Board Settings`를 제거하면서 category visibility/order 같은 기존 운영 기능이 사라질 수 있다. S3에서 category table이 기존 governance 일부를 흡수하거나 read-only로라도 보존하게 정의한다.
- settings를 save-less로 바꾸면서 지나친 mutation spam이 생길 수 있다. S4에서 toggle/select only immediate, text/number/icon field-level apply 규칙을 고정한다.
- title icon을 shell mark, favicon, locale title과 각각 다르게 저장하면 branding source가 다시 분산된다. S4/S5에서 current-project metadata를 단일 source-of-truth로 둔다.
- `language`는 project metadata 기반인데 `themeMode`는 local storage 기반이다. S5에서 이 차이를 명시해 잘못된 서버 mutation 추가를 막는다.

## 7. 완료 기준

- `plan.md`, `task.md`, `spec/ui/*.md`, `spec/infra/*.md`, `reviews/plan.review.md`, `reviews/task.review.md`가 모두 생성되어 있다.
- `pgg-code`가 top navigation, management sidebar, board card actions, category/history table, settings mutation model, axios client migration 범위를 spec/task만 보고 파악할 수 있다.
- `state/current.md`가 active specs, active tasks, audit applicability, git publish message, next action을 최소 컨텍스트로 유지한다.
- 이후 구현에서 `History` 의미, delete guard, title/icon sync, immediate/apply settings 규칙을 다시 토론할 필요가 없을 정도로 기준이 고정되어 있다.

## 8. 전문가 평가 요약

- 소프트웨어 아키텍트: shell, board actions, category/history, settings, data client를 분리한 spec 구성이 현재 dashboard 구조 변화 경계와 맞다.
- 시니어 백엔드 엔지니어: axios client 전환과 delete payload/source-of-truth 정리를 별도 infra spec으로 뺀 점이 실제 구현 경로에 유리하다.
- QA/테스트 엔지니어: delete checkbox guard, immediate/apply settings semantics, title/icon sync, manual verification required가 검증 전략에 포함되어 누락 위험이 낮다.
