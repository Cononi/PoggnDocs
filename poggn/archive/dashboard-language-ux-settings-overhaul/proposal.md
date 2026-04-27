---
pgg:
  topic: "dashboard-language-ux-settings-overhaul"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 96
  updated_at: "2026-04-27T11:56:14Z"
  auto_mode: "on"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "2.7.0"
  short_name: "dashboard-overhaul"
  working_branch: "ai/feat/2.7.0-dashboard-overhaul"
  release_branch: "release/2.7.0-dashboard-overhaul"
  project_scope: "current-project"
reactflow:
  node_id: "proposal-dashboard-language-ux-settings-overhaul"
  node_type: "proposal"
  label: "proposal.md"
state:
  summary: "pgg 문서 언어 정책과 dashboard 모바일/설정/SpeedDial/워크플로우 UX 개편 proposal"
  next: "pgg-plan"
---

# Proposal: Dashboard Language UX Settings Overhaul

## 1. 제목

Dashboard language and UX settings overhaul

## 2. 변경 분류

- archive_type: `feat`
- version_bump: `minor`
- target_version: `2.7.0`
- short_name: `dashboard-overhaul`
- working_branch: `ai/feat/2.7.0-dashboard-overhaul`
- release_branch: `release/2.7.0-dashboard-overhaul`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- `$pgg-add 기능 개편 입니다.`
- `pgg lang에 따라서 poggn내에 만들어지는 모든 문서는 해당 언어로 설정된 언어로 작성되야 합니다.`
- `상단 헤더에 네비게이션에서 프로젝트와 설정 버튼의 간격이 좁아서 글이 2칸 으로 되버립니다.`
- `mui의 speed dial 기능이 Persistent action tooltips을 사용해서 만들었으면 좋겠습니다. 그리고 !버튼은 아무것도 기능하지 않는거 같습니다.`
- `spped dial 젤 마지막에 현재 clip으로 pgg 버전이 적혀 있었음 좋겠습니다.`
- `네비게이션의 타이틀 이름은 dashboard title 설정 값으로 고정값 입니다.`
- `spped dial에서 프로젝트 선택은 mobile 화면에만 보여야 합니다.`
- `insight에서 Sprint Progress에 진행중같은 내용이 2개로 겹쳐서 나옵니다. 한개만 나오게 해주세요.`
- `speed dial에 프로젝트 추가 에서 입력칸과 카테고리 선택이 좀 많이 못생기고 크기가 동일하지 않습니다. 좀 더 세련되게 만들어주세요.`
- `사이드바 하단에 Status sync is managed within company settings. 쪽 자체를 없애주세요. 해당 버튼과 기능은 필요가 없습니다.`
- `모바일 화면에서는 Project에서 사이드바에 WORKSPACE는 안보여야 합니다.`
- `모바일 화면에서 bottom navigation은 제거 해주세요.`
- `모바일 화면에서 workflow progress가 가로가 아닌 세로로 보이게 해주세요.`
- `workflow에서 탭 클릭하면 탭 하단에 이어지는 선이 없어야 합니다. 정확히 탭 버튼 영역만큼의 선이 없어서 연결되는 컴포넌트와 경계선이 그 부분만 없어서 자연스럽게 이어져야 합니다.`
- `settings 메뉴에 카테고리를 만들고 카테고리 화면에는 카테고리 리스트 관리 삭제 추가가 가능해야한다.`
- `workflow에서 refactor가 결국 성공해서 넘어 갔는데 단계 실패라고 명시되어 있습니다. 상태 관리가 이상한거 같습니다.`
- `프로젝트 삭제할 때 체크 하면 다시 한번 더 외부에 백업하지 않았다면 다시는 프로젝트를 되돌릴 수 없습니다 정말 삭제 하시겠습니까? 라는 멘트와 함께 체크를 다시 받도록 하나 더 생성해서 삭제하도록 유도하게 해야 한다.`

## 4. 문제 정의

현재 dashboard와 pgg workflow 산출물에는 세 가지 문제가 섞여 있다.

- `pgg lang`는 CLI 문구와 일부 generated asset에 반영되지만, `poggn/active`와 `poggn/archive` 아래 생성되는 workflow 문서 전체가 설정 언어를 일관되게 따르도록 강제하는 계약이 부족하다.
- dashboard의 모바일/상단 navigation/SpeedDial/설정/프로젝트 삭제 UI가 최근 기능 증가를 따라가지 못해 공간이 좁거나, 동작하지 않는 action이 있거나, 불필요한 navigation이 남아 있다.
- workflow progress와 insight 표시가 stage evidence를 정확히 해석하지 못하거나 중복 표시를 만들어 사용자가 실제 진행 상태를 오해할 수 있다.

## 5. 제안 범위

### pgg 문서 언어 정책

- `pgg lang` 값에 따라 `poggn` 내부에 새로 생성되는 proposal, plan, task, spec, review, implementation, refactor, QA, audit, state 문서의 본문 언어를 설정 언어로 생성하도록 계약화한다.
- helper와 template에서 한국어/영어 문서 생성 경로가 섞이는 부분을 점검하고, 적어도 새 topic 이후 생성 문서에는 선택 언어가 우선 적용되도록 한다.
- 기존 archive 문서의 일괄 번역은 범위에서 제외한다. 이번 topic은 이후 생성 문서의 언어 일관성을 목표로 한다.

### Dashboard 상단과 전역 action UX

- 상단 navigation의 프로젝트/설정 버튼은 줄바꿈 없이 읽히도록 spacing, min-width, typography를 조정한다.
- navigation title은 항상 dashboard title 설정 값을 source of truth로 사용하고, 화면 상태 또는 프로젝트 이름으로 임의 대체하지 않는다.
- MUI SpeedDial은 Persistent action tooltips 형태로 구성하고, 동작 없는 정보 버튼은 제거하거나 명확한 read-only action으로 재설계한다.
- SpeedDial 마지막에는 현재 pgg version을 Chip 또는 read-only tooltip action으로 표시한다.
- SpeedDial의 프로젝트 선택 action은 모바일 화면에서만 노출한다.
- 모바일 bottom navigation은 제거하고 SpeedDial/상단 navigation 중심으로 동선을 단순화한다.

### Dashboard project/settings UX

- Settings 메뉴에 `카테고리` panel을 추가하고, 카테고리 리스트 관리, 추가, 이름 변경, 삭제, 기본값 지정, 표시 여부, 정렬을 설정 화면에서 처리할 수 있게 한다.
- 기존 Project 화면에 있던 category management와 기능이 중복되지 않도록 route/state와 sidebar entry를 정리한다.
- SpeedDial의 프로젝트 추가 dialog는 입력칸과 카테고리 선택의 크기와 밀도를 맞추고, 현재 디자인보다 정돈된 card/form layout으로 개선한다.
- 사이드바 하단의 `Status sync is managed within company settings.` 안내와 설정 이동 버튼은 제거한다.
- 모바일 Project drawer에서는 `WORKSPACE` 섹션과 project selector card를 숨긴다.
- 프로젝트 삭제 시 기존 위험 체크 이후, 외부 백업이 없다면 복구할 수 없다는 문구와 함께 두 번째 확인 체크를 요구한다.

### Insight와 workflow 상태 UX

- Insight의 `Sprint Progress`에서 같은 상태가 중복 표시되는 현상을 제거한다.
- 모바일 workflow progress는 가로 배치 대신 세로 배치로 표시한다.
- workflow tab 클릭 시 active tab 영역만 하단 경계선이 끊기고 연결 컴포넌트와 자연스럽게 이어지도록 tab border 처리를 조정한다.
- refactor가 성공 후 다음 단계로 넘어간 경우에도 단계 실패로 보이는 상태 계산을 수정한다. `stage-blocked`는 실제 blocked/fail evidence가 최신 unresolved 상태일 때만 표시되어야 한다.

## 6. 제외 범위

- 기존 archive 전체 문서의 소급 번역.
- dashboard의 신규 대시보드 정보구조 전체 재설계.
- 실제 원격 저장소, 외부 백업, cloud sync 기능 추가.
- MUI 외 UI 라이브러리 도입.

## 7. 성공 기준

- `pgg lang=ko`이면 새 workflow 문서 본문이 한국어로 생성되고, `pgg lang=en`이면 영어로 생성된다.
- dashboard 상단 navigation에서 프로젝트/설정 텍스트가 두 줄로 깨지지 않는다.
- SpeedDial action tooltip은 persistent하게 보이고, 동작 없는 `!` action은 사용자에게 혼란을 주지 않는다.
- SpeedDial에는 현재 pgg version이 read-only로 표시되고, 프로젝트 선택 action은 모바일에서만 보인다.
- 모바일 화면에서 bottom navigation이 제거되고 workflow progress가 세로로 표시된다.
- Settings 화면에서 카테고리 관리가 가능하다.
- Sprint Progress의 중복 status label이 사라진다.
- 성공한 refactor stage가 실패 상태로 표시되지 않는다.
- 프로젝트 삭제는 위험 체크와 복구 불가 확인 체크를 모두 통과해야 실행된다.

## 8. 검증 방향

- `pnpm build`로 dashboard TypeScript/Vite compile과 locale key 연결을 검증한다.
- `pnpm test`로 core language/template/state parsing 회귀와 workflow 상태 계산 회귀를 검증한다.
- UI 확인은 desktop과 mobile viewport에서 수동 검증 항목으로 남긴다.
- category settings, project add dialog, delete double confirmation은 live mode와 read-only mode 동작을 분리해 확인한다.

## 9. Audit Applicability

- `pgg-token`: `required` | `pgg lang`에 따른 workflow 문서 생성 정책과 helper/template 문구가 바뀌므로 generated 문서와 state handoff 범위를 점검해야 한다.
- `pgg-performance`: `not_required` | dashboard UI 표시와 workflow state 계산 정정 중심이며 성능 민감 runtime 경로가 아니다.

## 10. Proposal Decision

- status: `reviewed`
- score: `96`
- next: `pgg-plan`
- 결정: 요구사항을 `feat`/`minor` 개편으로 묶고, plan 단계에서 pgg language contract, dashboard navigation/SpeedDial/mobile, settings category, workflow status 계산, deletion safety를 별도 spec으로 분해한다.
