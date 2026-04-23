---
pgg:
  topic: "dashboard-management-refinement"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 95
  updated_at: "2026-04-23T02:20:27Z"
  auto_mode: "on"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "0.11.0"
  short_name: "dashboard-management-refinement"
  working_branch: "ai/feat/0.11.0-dashboard-management-refinement"
  release_branch: "release/0.11.0-dashboard-management-refinement"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "dashboard의 navigation, management sidebar, settings interaction, project board governance를 add-img 기준으로 재정렬하는 feature proposal을 확정한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

dashboard-management-refinement

## 2. 변경 분류

- archive_type: `feat`
- version_bump: `minor`
- target_version: `0.11.0`
- short_name: `dashboard-management-refinement`
- working_branch: `ai/feat/0.11.0-dashboard-management-refinement`
- release_branch: `release/0.11.0-dashboard-management-refinement`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- `1. fetch -> axios 로 교체`
- `2. 타이틀에 어울리는 svg 아이콘 추가`
- `3. 사이드바에 PLANNING -> MANAGEMENT로 변경`
- `4. Project 내에 사이드바 순서 Board , Category, Report, History 순으로 정렬`
- `5. 사이드바에 Development 제거`
- `6. 네비게이션에 메뉴에 Project, Settings 두개만 활성`
- `7. 네비게이션 우측 끝에 Avatar 부분 제거`
- `8. 네비에이션 끝에 insight 버튼, latest Project만 유지하고 나머지 검색, Settings제거`
- `9. Settings Main에 Dashboard Title이 홈페이지 Title이름에도 영향 가게 변경 및 Title Icon(svg 포함) 추가 및 변경 기능 추가`
- `10. Settings에 설정 변경 기능 저장 안눌러도 되도록 하고 저장 버튼 제거, 단 (타이틀같은 내용들은 따로 변경 버튼을 해당 input옆에 생성해서 처리하도록 변경)`
- `11. Settings Main에 한영 전환, 다크모드 설정 토글이 있엇음 좋겠습니다.`
- `12. 현재 option을 선택하는 드롭바의 형태가 이질감이 크게 느껴집니다. 현 디자인과 동일하게 해주시고 redius도 현 디자인과 구조에 맞추시길 바랍니다.`
- `13. Setting의 메뉴의 설정하는 각 화면들이 현디자인과 mui을 사용해서 최대한 비슷하게 add-img 2.의 2.png 의 느낌이 나도록 해야할거 같습니다. 기능은 유지입니다.`
- `14. Project board 내에 화면 디자인이 add-img폴더의 1.png 디자인을 보고 해주셔야 할거 같습니다. mui와 현재 가능한 디자인 영역내에서 최대한 끌어 내서 입니다. 물론 현재 카테고리 방식은 유지입니다.`
- `15. Project board의 각 프로젝트 카드에서 프로젝트 삭제 버튼이 있어야 합니다. 삭제 시 모달로 뜨고 실제 프로젝트까지 삭제도 가능해야하는데 이 것은 매우 위험함으로 실제 프로젝트 삭제 폴더 까지 삭제라는 체크박스에 체크가 되면 삭제되야 합니다.`
- `16. Project board의 각 프로젝트 카드는 드래그앤 드랍으로 순서변경, 카테고리 변경이 가능해야 합니다.`
- `17. Project의 Category 화면에서는 default 변경, 카테고리 추가, 삭제, 수정이 가능해야합니다. 테이블 형태로 보여주세요.`
- `디자인 참고: add-img/1.png, add-img/2.png`

## 4. 왜 하는가

- 현재 dashboard는 이미 `Projects/Settings` 상위 shell, project board, category 관리, report table, settings workspace를 갖고 있지만, 상단 utility 영역, sidebar 용어, 선택 UI, settings 저장 흐름, board 카드 상호작용이 한 디자인 언어로 정렬되어 있지 않다.
- 사용자는 이번 변경에서 단순 문구 수정이 아니라 `Project` 중심 navigation 단순화, `MANAGEMENT` sidebar 재구성, Settings의 즉시 반영 UX, title/title icon 편집, dark mode/language toggle, project deletion guard, drag-and-drop, category CRUD table까지 한 묶음으로 요구했다.
- `add-img/1.png`와 `add-img/2.png`는 board와 settings의 시각 방향을 명확히 제시하지만, 현재 구현은 MUI 기본 표면과 서로 다른 radius/select 스타일이 섞여 있어 참고 이미지와 체감 차이가 크다.
- 프로젝트 폴더 실제 삭제는 데이터 손실 위험이 높기 때문에, UI 재설계와 함께 삭제 안전장치 계약을 문서 단계에서 먼저 고정해야 한다.
- 따라서 이번 요청은 기존 대시보드의 일부 라벨을 다듬는 수준이 아니라, navigation, board, category governance, settings interaction model을 함께 재정렬하는 `feat`/`minor` 범위가 적절하다.

## 5. 무엇을 할 것인가

- top navigation은 `Project`, `Settings` 두 메뉴만 활성화하고, 우측 utility strip은 `Insight` 버튼과 latest project indicator만 남긴다.
- navigation 우측의 검색, 별도 settings utility, avatar surface는 제거한다.
- project sidebar의 상위 섹션 명칭은 `PLANNING`에서 `MANAGEMENT`로 바꾸고, `Development` 섹션은 제거하며, 주요 순서는 `Board`, `Category`, `Report`, `History`로 재정렬한다.
- `Board`는 현재 category 기반 구성을 유지하되 `add-img/1.png`의 카드 밀도와 정보 위계를 참고해 MUI 범위 안에서 더 강한 management board 표면으로 재구성한다.
- 각 project card에는 삭제 버튼을 추가하고, 삭제 시 modal을 띄운다. modal 안의 `실제 프로젝트 폴더까지 삭제` 체크박스가 선택된 경우에만 filesystem delete를 허용한다.
- project card는 drag-and-drop으로 같은 category 안 순서 변경과 category 간 이동을 모두 지원한다.
- `Category` 화면은 table 형태로 바꾸고, default 변경, 추가, 수정, 삭제를 모두 같은 관리 표면에서 수행하게 한다.
- `Settings > Main`은 dashboard title이 shell title과 HTML homepage title에 동시에 반영되도록 연결하고, title icon SVG를 추가/교체할 수 있게 한다.
- settings 공통 UX는 global save 버튼을 제거하고 즉시 반영 중심으로 바꾼다. 단 title/title icon처럼 의도적 적용이 필요한 필드는 input 옆의 개별 apply 버튼으로 처리한다.
- `Settings > Main`에는 language toggle(`ko/en`)과 dark mode toggle을 추가한다.
- settings 각 화면은 기능을 유지하되 `add-img/2.png` 분위기와 현재 디자인 언어에 맞도록 MUI 컴포넌트 밀도, radius, select/dropdown 표면을 재정렬한다.
- data fetch layer는 dashboard 범위에서 기존 `fetch` 의존을 `axios` 기반으로 정리하는 후속 plan 대상으로 포함한다.

## 6. 범위

### 포함

- `apps/dashboard/src/app/DashboardShellChrome.tsx`의 top navigation, sidebar label/order, utility strip 재구성
- `apps/dashboard/src/app/DashboardApp.tsx`의 active menu, modal flow, board/settings wiring 변경
- `apps/dashboard/src/features/project-list/ProjectListBoard.tsx`와 관련 board model의 카드 재배치, delete modal, drag-and-drop contract
- `apps/dashboard/src/features/project-list/CategoryManagementPanel.tsx`의 table 기반 CRUD 운영 표면 정리
- `apps/dashboard/src/features/reports/*` 또는 신규 history surface를 포함한 `Report`/`History` menu 재구성
- `apps/dashboard/src/features/settings/SettingsWorkspace.tsx`의 save-less interaction, title/title icon apply flow, dark mode/language toggle, select 스타일 정리
- `apps/dashboard/src/shared/api/dashboard.ts`와 관련 API 유틸의 `fetch -> axios` 전환
- dashboard title/icon source가 shell title, HTML `<title>`, current-project metadata와 연결되는 범위
- locale/store/model/theme 수준의 menu label, toggle label, delete warning, table header, icon/title editor surface 확장

### 제외

- dashboard 밖의 다른 app/package 구조 개편
- non-SVG asset pipeline 전체 재작성
- multi-user 권한 모델, 서버 동기화, 원격 삭제 정책 추가
- `add-img` reference의 픽셀 단위 복제
- verification contract 자체 변경이나 pgg core workflow 변경

## 7. 제약 사항

- 구현 범위는 `current-project` 내부 dashboard와 현재 프로젝트 메타데이터 surface로 한정한다.
- 현재 프로젝트는 `auto mode=on`, `teams mode=off`, `git mode=on`이므로 proposal에서 미정 항목은 기준안으로 선확정한다.
- 기존 dirty baseline에 직전 archive topic 문서들이 포함되어 있으므로, 새 topic은 그 변경을 되돌리지 않고 공존해야 한다.
- select/dropdown 재설계는 MUI 기반을 유지하되 현재 dashboard tone, spacing, radius 체계와 어긋나는 기본 드롭다운 인상을 줄이는 쪽으로 제한한다.
- project delete flow는 metadata removal과 filesystem delete를 같은 행위로 취급하지 않는다. 실제 폴더 삭제는 modal 내부 명시적 체크가 없으면 금지한다.
- board redesign은 현재 category assignment 모델을 유지해야 하며, drag-and-drop은 그 모델을 깨지 않는 범위에서만 정의한다.
- title icon은 SVG 자산 계약을 우선으로 하고, shell title과 browser title 간 정합성을 깨지 않아야 한다.

## 8. auto mode 처리

- poggn auto mode: `on`
- auto mode가 `on`이므로 다음 기준안을 proposal에서 확정한다.
- top navigation label은 `Project`, `Settings` 두 개만 남긴다.
- project sidebar 순서는 `Board`, `Category`, `Report`, `History`로 고정하고, section label은 `MANAGEMENT`를 사용한다.
- settings sidebar는 기존 기능 유지 원칙에 따라 `Main`, `Refresh`, `Git`, `System`을 유지하되 화면 스타일만 재정렬한다.
- settings는 토글/선택 계열은 즉시 반영으로 처리하고, title/title icon 계열은 필드 옆 apply 버튼으로 처리한다.
- project delete modal의 기본 동작은 dashboard 등록/표면 삭제이며, 실제 filesystem delete는 체크박스 opt-in으로만 허용한다.
- board visual reference는 `add-img/1.png`, settings visual reference는 `add-img/2.png`를 기준안으로 사용한다.

## 9. 기준안

| 항목 | 기준안 | 상태 |
|---|---|---|
| 상단 메뉴 | `Project`, `Settings`만 활성화한다. | resolved |
| 상단 우측 utility | latest project indicator와 `Insight` 버튼만 남긴다. | resolved |
| avatar/search/settings utility | 모두 제거한다. | resolved |
| project sidebar label | `PLANNING`을 `MANAGEMENT`로 변경한다. | resolved |
| project sidebar order | `Board`, `Category`, `Report`, `History` 순서로 고정한다. | resolved |
| development section | 제거한다. | resolved |
| board visual direction | category 구조는 유지하고 `add-img/1.png`의 밀도와 카드 위계를 참고한다. | resolved |
| category management | table 기반으로 default 변경, 추가, 수정, 삭제를 지원한다. | resolved |
| project card deletion | modal 확인이 필요하며 filesystem delete는 명시적 checkbox opt-in일 때만 허용한다. | resolved |
| project card movement | drag-and-drop으로 순서 변경과 category 이동을 지원한다. | resolved |
| title and icon | dashboard title은 shell/homepage title에 함께 반영되고 title icon SVG를 편집 가능하게 한다. | resolved |
| settings persistence | global save 버튼은 제거하고 기본은 즉시 반영, 일부 필드는 개별 apply 버튼을 둔다. | resolved |
| settings main toggles | language(`ko/en`)와 dark mode toggle을 제공한다. | resolved |
| select styling | 현재 디자인과 맞는 radius/field styling으로 재정렬한다. | resolved |
| settings visual direction | 기능은 유지하고 `add-img/2.png` 톤에 맞춘다. | resolved |
| data client | dashboard 범위의 `fetch` 호출은 `axios`로 정리한다. | resolved |

## 10. 성공 기준

- 사용자가 dashboard 진입 후 상단 메뉴를 `Project`, `Settings` 두 축으로만 인지하고, 우측 utility는 latest project와 insight만 보게 된다.
- project sidebar가 `MANAGEMENT` 문맥으로 정리되고 `Board`, `Category`, `Report`, `History` 흐름이 명확해진다.
- board는 기존 category model을 유지하면서도 project card 삭제/이동/정렬 상호작용을 제공한다.
- category screen이 table 기반 관리 표면으로 바뀌고 default/category CRUD가 한 화면에서 명확히 드러난다.
- settings는 global save 없이도 자연스럽게 동작하고, title/title icon만 개별 apply 행위로 분리된다.
- dashboard title/title icon 변경이 shell branding과 browser title에 함께 반영된다.
- 후속 `pgg-plan`이 navigation, board, category governance, settings interaction, api client, title/icon sync spec으로 바로 분해될 수 있다.

## 11. 전문가 평가 요약

- 프로덕트 매니저: navigation 단순화와 settings/board interaction 재정렬을 한 topic으로 묶은 판단이 사용자 요구와 가장 직접적으로 대응한다.
- UX/UI 전문가: `add-img/1.png`, `add-img/2.png`를 픽셀 복제가 아니라 board/settings visual direction으로 사용하고, select/radius/utility strip까지 같이 정리한 범위 설정이 적절하다.
- 도메인 전문가: category model 유지, safe delete checkbox, title/title icon source sync, `fetch -> axios` 정리를 함께 다루는 방향이 현재 dashboard 구조와 자연스럽게 맞물린다.

## 12. 다음 단계

`pgg-plan`에서 다음 축으로 spec/task를 분해한다.

- navigation and sidebar information architecture
- project board card actions, delete guard, and drag-and-drop contract
- category table governance and history/report surface split
- settings interaction model, title/icon sync, and style alignment
- dashboard API client migration from `fetch` to `axios`
