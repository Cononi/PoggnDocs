---
pgg:
  topic: "dashboard-renewal"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 95
  updated_at: "2026-04-21T15:52:51Z"
  auto_mode: "on"
  archive_type: "feat"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "Jira 스타일 프로젝트 목록, MUI CRUD 스타일 상세, active/archive 스크럼 보드 분리 요구를 proposal로 확정한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

dashboard-renewal

## 2. 변경 분류

- archive_type: `feat`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- "`dashboard` 리뉴얼 입니다."
- "react + typescript 스타일 가이드: `https://react-typescript-style-guide.com`"
- "프로젝트 리스트 구현 화면 참조: Jira의 스크럼 보드"
- "프로젝트 상세 화면 구현 참조 코드: MUI `crud-dashboard` 템플릿"
- "프로젝트 상세 내에 active, archive는 스크럼 보드 식으로 관리하는게 좋을 거 같습니다."
- "필요한 기능: `poggn` 파일 내에 archive한 최근 폴더를 보고 그 형식에 어울리는 구현책을 마련해주시기 바랍니다."
- "필수: 모든 기능은 카테고리에 맞게 분리 해야 합니다."

## 4. 왜 하는가

- 현재 dashboard는 `apps/dashboard/src/App.tsx` 비중이 크고, 프로젝트 목록, 프로젝트 상세, workflow detail이 한 화면 책임에 가깝게 섞여 있어 리뉴얼 요구를 안전하게 확장하기 어렵다.
- 사용자는 프로젝트 목록을 Jira 스크럼 보드처럼 빠르게 훑고, 프로젝트 상세는 MUI CRUD dashboard처럼 운영 패널 중심으로 보고 싶어 한다.
- 최근 archive topic인 `pgg-qa-git-auto-commit-push`, `pgg-status-codex-skill`, `dashboard-mui-category-flow-enhancement`를 보면 공통적으로 `proposal.md`, `plan.md`, `task.md`, `state/current.md`, `workflow.reactflow.json`, `reviews/*`, `implementation/index.md`, `qa/*`, `version.json` 같은 lifecycle 산출물 묶음이 반복된다.
- 따라서 상세 화면은 단순 파일 목록이 아니라 active/archive topic을 스크럼 보드 카드로 관리하면서, 카드 내부에서 lifecycle 문서 카테고리를 읽을 수 있는 정보 구조가 필요하다.
- React + TypeScript 스타일 가이드가 요구하는 feature-based 구조와 관심사 분리를 따르지 않으면, 이번 리뉴얼은 화면만 바꾸고 다시 `App.tsx` 중심 결합도를 키우는 결과가 된다.

## 5. 무엇을 할 것인가

- 프로젝트 목록 화면은 Jira 스크럼 보드의 컬럼, 카드, 스윔레인 감각을 참고해 `category -> project card` 중심 보드로 재구성한다.
- 프로젝트 상세 화면은 MUI CRUD dashboard 템플릿의 패널형 레이아웃을 참고해 summary header, project meta, workflow panel, topic board panel을 나눈다.
- 프로젝트 상세 내부에는 `Active Board`, `Archive Board`를 분리하고, 각 보드에서 topic 카드를 stage/status 기준 컬럼으로 배치하는 스크럼 보드형 운영 뷰를 정의한다.
- 최근 archive 폴더 형식을 기준으로 카드/상세 패널이 `state/current.md`, `workflow.reactflow.json`, `reviews`, `implementation`, `qa`, `version` 존재 여부와 핵심 메타데이터를 읽을 수 있게 한다.
- React + TypeScript 스타일 가이드에 맞춰 dashboard 코드를 feature/category 단위로 분리하고, 화면별 hooks, data adapter, presentation component, shared UI를 분리한다.

## 6. 범위

### 포함

- Jira 스크럼 보드 감각을 반영한 프로젝트 목록 보드 UX 정의
- MUI CRUD dashboard 계열 레이아웃을 반영한 프로젝트 상세 정보 구조 정의
- 프로젝트 상세 내부의 `active` / `archive` 스크럼 보드 구조 정의
- 최근 archive topic 폴더 형식을 반영한 topic card/detail 데이터 모델 정의
- React + TypeScript 스타일 가이드 기반 feature/category 분리 원칙 고정
- 카테고리별 파일 책임과 후속 plan/spec 분해 기준 정의

### 제외

- 이번 proposal 단계에서 실제 React 컴포넌트 구현
- archive topic의 과거 문서 구조를 일괄 마이그레이션하는 작업
- 인증, 협업, 서버 동기화, 권한 관리
- 사용자 임의 문서를 dashboard에서 직접 생성/편집하는 기능
- 참조 사이트 UI를 그대로 복제하는 작업

## 7. 제약 사항

- 구현 범위는 `current-project` 안에서만 다룬다.
- `archive_type`은 `feat`로 고정한다.
- `auto mode`는 `on`이므로 이번 proposal에서 기본안을 선결정한다.
- 프로젝트 목록은 Jira 스크럼 보드의 정보 구조를 참고하되, 실제 구현은 현재 repo의 React/MUI 스택에 맞게 재해석해야 한다.
- 프로젝트 상세는 MUI CRUD dashboard 템플릿의 패널 구조를 참고하되, 현 pgg topic 문서 구조를 소비할 수 있어야 한다.
- 모든 기능은 카테고리 책임별로 분리해야 하며, 화면 컴포넌트와 데이터 파싱 로직을 한 파일에 다시 몰아넣지 않는다.

## 8. auto mode 처리

- poggn auto mode: `on`
- 미확정 항목은 기본 추천으로 모두 해소한다.

## 9. 기준안

| 항목 | 기준안 | 상태 |
|---|---|---|
| 프로젝트 목록 정보 구조 | Jira 스크럼 보드처럼 category column 안에 project card를 배치하고, 카드에서 상태/버전/최근 토픽 요약을 바로 본다. | resolved |
| 프로젝트 상세 레이아웃 | MUI CRUD dashboard식 상단 summary + 우측/하단 운영 패널 구조로 나눈다. | resolved |
| active/archive 관리 방식 | 상세 내부에 `Active Board`, `Archive Board`를 분리하고 stage/status 컬럼 기반 topic 카드 보드로 관리한다. | resolved |
| 최근 archive 포맷 반영 | topic 카드는 `proposal`, `plan`, `task`, `state/current`, `reviews`, `implementation`, `qa`, `version`, `workflow` 존재 여부와 핵심 메타를 사용한다. | resolved |
| 코드 구조 | React + TypeScript style guide 기준 feature-based category 구조를 따른다. | resolved |
| 기능 카테고리 분리 | 최소한 `project-list`, `project-detail`, `topic-board`, `artifact-inspector`, `shared` 카테고리로 책임을 분리한다. | resolved |

## 10. 성공 기준

- plan 단계 전에 프로젝트 목록, 프로젝트 상세, active/archive 보드, artifact detail의 역할 경계가 명확히 나뉜다.
- 최근 archive topic 형식을 기준으로 어떤 메타데이터를 카드와 상세 패널에 노출할지 합의된다.
- `App.tsx` 중심 구조를 해체하고 feature/category 단위로 분리해야 한다는 점이 문서에 고정된다.
- active/archive가 단순 tab 전환이 아니라 스크럼 보드형 운영 뷰라는 점이 명확해진다.
- 후속 `pgg-plan`에서 spec을 카테고리별로 바로 분해할 수 있을 정도로 범위와 제약이 정리된다.

## 11. 전문가 평가 요약

- 프로덕트 매니저: 프로젝트 목록과 프로젝트 상세의 목표가 분리되어 있어 후속 task 분해 기준이 명확하다.
- UX/UI 전문가: Jira식 보드 탐색과 MUI CRUD식 운영 패널을 조합하되, active/archive를 각각 보드로 분리한 판단이 사용 흐름에 맞다.
- 도메인 전문가: 최근 archive 폴더의 반복 구조를 카드 메타데이터 기준으로 삼으면 current pgg 문서 체계를 바꾸지 않고도 상세 운영 화면을 설계할 수 있다.

## 12. 다음 단계

`pgg-plan`에서 `project-list`, `project-detail`, `topic-board`, `artifact-inspector`, `data-adapter` 카테고리로 spec/task를 분리해 전개
