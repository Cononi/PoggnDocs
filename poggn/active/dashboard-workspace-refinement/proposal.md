---
pgg:
  topic: "dashboard-workspace-refinement"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 96
  updated_at: "2026-04-23T07:52:00Z"
  auto_mode: "on"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "0.13.0"
  short_name: "dashboard-workspace-refinement"
  working_branch: "ai/feat/0.13.0-dashboard-workspace-refinement"
  release_branch: "release/0.13.0-dashboard-workspace-refinement"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "archive된 dashboard workspace를 jira-style board, workflow 탭, file tree, report/history summary 중심 후속 refinement로 확정한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

dashboard-workspace-refinement

## 2. 변경 분류

- archive_type: `feat`
- version_bump: `minor`
- target_version: `0.13.0`
- short_name: `dashboard-workspace-refinement`
- working_branch: `ai/feat/0.13.0-dashboard-workspace-refinement`
- release_branch: `release/0.13.0-dashboard-workspace-refinement`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- `1. 프로젝트 리스트는 jira의 칸반 보드 스타일이어야 합니다.`
- `2. 프로젝트 카드를 클릭하면 디테일 페이지로 가는거지 상세 열기 버튼이 아닙니다.`
- `3. 프로젝트 정보에 Current Project에서 dashboard port는 없어도 됩니다.`
- `4. 프로젝트 정보에 pgg버전외에 현재 프로젝트 버전도 나와야 합니다.`
- `5. 워크플로우에서 토픽은 좌측 사이드에서 선택해서 선택해서 볼 수 있어야 합니다.`
- `6. 워크플로우에서 타임라인,플로우는 mui 컴포넌트중 tap기능으로 되어야 합니다.`
- `7. 워크플로우에서 초기 질문 기록은 Wokr flow 카드로 옮기고 작은 글씨체로 넣어주세요.`
- `8. 워크플로우에서 타임라인, 워크플로우가 보여주는 내용은 각 워크 플로우 add, plan 등에서 생성, 진행된 내역을 보여줘야 합니다.`
- `9. 워크플로우에서 각 워크플로우,타임라인에서 생성된 내용에 현재 생성되거나 만들어진 테스크나 그 쪽에 어떤 파일을 작업중인지 진행중인 곳에 확실하게 강조 표시가 애니메이션 효과로 나타나야 합니다.`
- `10. 파일에서 파일트리를 보여주는게 add-img/3.png 디자인으로 해줘야 합니다. 폴더 구조로 파일트리를 만들어 주세요.`
- `11. 리포트 쪽에 렉이 너무 심합니다. 바로바로 볼 수 없고 테이블 형태로 바꿔주셧으면 좋겠습니다.`
- `12. 이력에는 토픽 선택이 필요 없습니다.`
- `13. 이력에 카드에 전체 보기 버튼은 제거해주세요.`
- `14. 이력의 카드에 내용은 간단하게 한번에 알아볼 수 잇는 핵심정보만 보이게 작은 카드로 해주세요.`
- `15. 이력의 카드를 눌르면 필요한 내용이 모달창으로 나오도록 해주세요.`

## 4. 왜 하는가

- `dashboard-project-workspace-redesign`는 `2026-04-23T07:35:31Z`에 `0.12.0`으로 archive됐고 project detail workspace를 실제 앱에 연결했지만, 이번 요청은 그 결과물의 interaction density와 information emphasis를 다시 다듬는 후속 feature다.
- 현재 project board는 강조 색과 metadata는 갖췄지만 Jira 칸반처럼 lane rhythm이 강하지 않고, card 하단의 `openProject` 버튼이 card 전체 click contract를 약화시킨다.
- 현재 project info는 generic `version`과 `dashboard port`를 함께 노출한다. 사용자는 port를 제거하고 `POGGN version` 외에 현재 프로젝트 자체 버전을 따로 보고 싶어 한다.
- 현재 workflow는 상단 `TextField select`로 topic을 고르고, `Button` 두 개로 `Timeline`/`Flow`를 전환한다. 사용자가 원하는 좌측 topic sidebar와 MUI Tabs 중심 interaction과 다르다.
- 현재 초기 질문 기록은 workflow 본문 안의 독립 패널에서 `body2` 카드 리스트로 렌더되고, current task/file 강조도 color chip 위주다. 사용자가 요구한 "작업중 위치를 한눈에 아는 애니메이션 강조"까지는 도달하지 못했다.
- 현재 files 섹션은 `relativePath` flat list를 렌더한다. `add-img/3.png`처럼 폴더 트리와 선택된 row emphasis를 가진 explorer형 탐색 경험은 아직 없다.
- 현재 report 섹션은 topic별 큰 카드들을 순회하면서 QA/review 버튼을 모두 렌더해 report topic 수가 많아질수록 무거워지기 쉽다. 사용자가 지적한 "렉"은 summary-first table 구조와 lazy modal opening으로 줄이는 편이 맞다.
- 현재 history는 `TopicLifecycleBoard`의 lane + selected topic contract와 artifact preview chip을 사용한다. 사용자는 topic selection 없는 compact history card와 click-to-modal detail을 원한다.
- 따라서 이번 요청은 단순 patch가 아니라 board, workflow, file explorer, report/history reading contract를 함께 refine하는 `feat`/`minor` 범위로 본다.

## 5. 현재 구현 확인

- `apps/dashboard/src/features/project-list/ProjectListBoard.tsx`
  현재 card는 hover accent와 metadata를 제공하지만, card 자체가 아니라 하단 `openProject` 버튼이 detail 진입 CTA다. Jira board처럼 column 밀도와 card-wide click contract를 강화할 여지가 있다.
- `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx`
  detail sidebar 구조는 이미 `프로젝트 정보`, `워크플로우`, `이력`, `리포트`, `파일`로 나뉘어 있다. 다만 workflow topic selection은 상단 dropdown이고, view switch는 button toggle이며, 초기 질문 기록은 별도 panel이다.
- `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx`
  project info에는 `dashboardDefaultPort`가 노출되고, version은 `installedVersion` 한 종류만 보여 준다. 현재 project version과 POGGN version을 분리한 metric contract가 없다.
- `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx`
  report는 topic card 반복 렌더링, files는 flat list, history는 `TopicLifecycleBoard` 기반이며 selected topic과 preview action이 결합돼 있다.
- `apps/dashboard/src/features/topic-board/TopicLifecycleBoard.tsx`
  history card는 selection state와 `openViewer` chip을 갖고 있어, 사용자가 원하는 "전체 보기 버튼 제거 + compact 핵심 정보 + card click modal"과 정확히 맞지 않는다.
- `apps/dashboard/src/shared/model/dashboard.ts`
  현재 project snapshot에는 `installedVersion`과 `dashboardDefaultPort`만 있고, current project version을 별도 surface로 표현할 field contract가 없다.
- `apps/dashboard/src/shared/ui/ArtifactDocumentContent.tsx`
  markdown/diff renderer는 이미 존재한다. 이번 범위는 renderer 신규 도입보다 modal orchestration, tree/table/history interaction refinement에 가깝다.

## 6. 무엇을 할 것인가

- project list는 Jira 칸반 보드에 가까운 lane cadence와 card density로 재정의한다.
- project card는 하단 `상세 열기` 성격의 별도 버튼 없이 카드 전체 클릭으로 detail workspace에 진입하게 한다.
- project info에서는 `dashboard port`를 제거하고, `POGGN version`과 `project version`을 분리해 노출한다.
- workflow section에서는 topic을 좌측 sidebar에서 고를 수 있게 하고, `Timeline`/`Flow` 전환은 MUI `Tabs` 기반으로 고정한다.
- 초기 질문 기록은 workflow 상단 summary card 내부의 작은 typography/caption tone으로 옮긴다.
- workflow timeline/flow는 add, plan, code, refactor, qa 등 각 stage에서 생성되거나 진행된 artifact와 task/file 상태를 직접 보여 주는 contract로 강화한다.
- workflow와 timeline의 현재 진행 항목은 단순 색상 대신 pulse/glow 계열 animation으로 강조하되 `prefers-reduced-motion`에서는 정적 강조로 fallback한다.
- files는 `add-img/3.png`의 좌측 explorer 느낌을 참고한 folder tree 구조로 바꾸고, topic relative path를 실제 folder hierarchy로 구성한다.
- report는 dense table-first surface로 바꾸고 detail은 row click modal로 lazy opening해 즉시 읽히는 방향으로 정리한다.
- history는 topic selection 없이 compact card만 보여 주고, `전체 보기` 버튼 없이 card click으로 modal detail을 연다.

## 7. 범위

### 포함

- `apps/dashboard/src/features/project-list/ProjectListBoard.tsx`의 Jira-style board rhythm, card-wide click, CTA 정리
- `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx`의 workflow topic sidebar, MUI Tabs, compact question card, animated current-state emphasis
- project info metric contract에서 `dashboard port` 제거와 `POGGN version` / `project version` 분리
- report table, history compact cards, detail modal contract 정리
- file browser를 flat list에서 folder tree explorer로 재구성
- 필요한 shared model/store/api/snapshot contract 보강

### 제외

- dashboard 밖 다른 app/package 화면 재설계
- pgg core workflow 문서 포맷 자체 변경
- topic 외부 arbitrary filesystem explorer
- `add-img/3.png`의 픽셀 단위 복제
- current-project verification contract 부재를 임의로 해소하기 위한 새로운 검증 명령 도입

## 8. 제약 사항

- project scope는 `current-project` dashboard 범위다.
- 현재 프로젝트 설정은 `auto mode=on`, `teams mode=off`, `git mode=on`이다.
- baseline은 가장 최근 archive인 `dashboard-project-workspace-redesign`이며, 이미 반영된 detail workspace 구조는 유지한 채 refinement만 추가해야 한다.
- `project version`은 current project 내부에서 안전하게 읽을 수 있는 manifest/version source만 사용해야 하며, 임의 경로 추측은 허용하지 않는다.
- workflow current-state animation은 강조를 분명히 해야 하지만 motion overload로 가독성을 해치면 안 된다.
- files tree는 topic 내부 artifact만 보여 주고 edit/delete 범위도 같은 topic root guard를 유지해야 한다.
- report/history modal은 필요한 시점에만 detail을 열어 렌더해야 하며, 목록 화면에서 모든 detail 문서를 미리 풀렌더하지 않는다.

## 9. auto mode 처리

- poggn auto mode: `on`
- auto mode가 `on`이므로 이번 proposal에서 아래 기준안을 확정한다.
- board visual direction은 Jira-style kanban lane rhythm을 우선한다.
- project card interaction은 별도 detail button 없이 card-wide click으로 고정한다.
- project info에서 `dashboard port`는 제거한다.
- version metric은 `POGGN version`과 `project version` 두 필드로 분리한다.
- workflow topic selection은 좌측 sidebar로 이동한다.
- workflow `Timeline` / `Flow` 전환은 MUI `Tabs`/`Tab`을 사용한다.
- current task/file emphasis는 animation-enabled state로 설계하되 reduced-motion fallback을 제공한다.
- files는 folder tree explorer layout으로 전환한다.
- report 성능 이슈가 명시됐으므로 `pgg-performance` applicability는 `required`로 둔다.
- semver는 `0.12.0 -> 0.13.0` minor로 확정한다.

## 10. 기준안

| 항목 | 기준안 | 상태 |
|---|---|---|
| project list visual | Jira-style kanban lane rhythm과 compact card density를 사용한다. | resolved |
| project detail entry | 카드 전체 클릭으로 detail workspace에 진입하고 별도 open button은 제거한다. | resolved |
| current project metrics | `dashboard port`는 제거하고 `POGGN version` / `project version`을 별도 표기한다. | resolved |
| workflow topic navigation | top dropdown 대신 좌측 topic sidebar로 선택한다. | resolved |
| workflow view switch | MUI `Tabs`/`Tab`으로 `Timeline`/`Flow`를 전환한다. | resolved |
| initial question record | workflow summary card 안의 작은 글씨/caption tone으로 이동한다. | resolved |
| workflow content source | add/plan/code/refactor/qa stage 산출물과 진행중 task/file을 직접 반영한다. | resolved |
| current progress emphasis | flow/timeline 양쪽에서 animation 기반 current highlight를 제공한다. | resolved |
| files | `add-img/3.png` 감성의 folder tree explorer로 정리한다. | resolved |
| report | dense table-first surface와 modal detail로 바꾼다. | resolved |
| history | topic selection 없이 compact card만 보여 주고 click-to-modal detail로 연다. | resolved |

## 11. 성공 기준

- project board가 현재보다 Jira 칸반에 가까운 lane/card rhythm으로 읽힌다.
- project card 하단의 별도 detail CTA가 사라지고 카드 전체가 navigation affordance를 가진다.
- project info에서 `dashboard port`가 사라지고 `POGGN version`과 `project version`이 분리되어 보인다.
- workflow page 좌측에서 topic을 바꿀 수 있고, content area 전환은 MUI Tabs로 동작한다.
- 초기 질문 기록이 workflow summary card 안에서 작은 텍스트로 정리된다.
- flow/timeline이 각 stage 산출물과 진행중 task/file을 동일 source로 보여 주며 current item을 강하게 강조한다.
- files가 flat list가 아니라 실제 folder hierarchy tree로 보인다.
- report 목록이 즉시 읽히는 table surface가 되고, history는 compact card + modal detail로 단순해진다.

## 12. Audit Applicability

- [pgg-token]: [not_required] | token handoff 구조가 아니라 dashboard UI/workspace refinement가 중심이다
- [pgg-performance]: [required] | 사용자가 report lag를 직접 문제로 지적했고 table-first/lazy modal 구조가 성능 acceptance와 연결된다

## 13. 전문가 평가 요약

- 프로덕트 매니저: 이미 archive된 workspace redesign의 후속 범위를 board, workflow, report/history refinement로 좁힌 결정이 사용자 요구와 일치한다.
- UX/UI 전문가: Jira-style board, 좌측 topic sidebar, MUI Tabs, compact history card, tree explorer 방향이 현 UI의 정보 밀도 문제를 정확히 겨냥한다.
- 도메인 전문가: 현재 renderer와 detail workspace 기반은 이미 있으므로 이번 topic은 interaction/data projection refinement로 current-project 범위 안에서 안전하게 진행 가능하다.

## 14. 다음 단계

`pgg-plan`에서 다음 축으로 spec/task를 분해한다.

- board + project info metric refinement
- workflow topic navigation + tabbed views
- workflow artifact provenance + animated current emphasis
- file tree explorer contract
- report table + history compact modal contract
