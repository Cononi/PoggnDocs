---
pgg:
  topic: "dashboard-renewal"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-21T15:55:16Z"
reactflow:
  node_id: "plan"
  node_type: "doc"
  label: "plan.md"
state:
  summary: "dashboard 리뉴얼을 프로젝트 목록, 상세 워크스페이스, lifecycle 보드, artifact inspector, feature 구조, snapshot 계약으로 분해한다."
  next: "pgg-code"
---

# Plan

## 목표

- `apps/dashboard`를 Jira 스타일 프로젝트 목록 보드와 MUI CRUD 스타일 프로젝트 상세 워크스페이스로 재구성하고, 상세 내부 `active` / `archive` topic 운영 뷰를 current pgg artifact 구조에 맞는 스크럼 보드로 구현할 수 있게 계획을 확정한다.

## 결정 사항

- 프로젝트 목록은 category column 안에서 project card를 탐색하는 Jira식 보드로 설계한다.
- 프로젝트 상세는 summary header, project meta, workflow panel, topic board, artifact inspector로 나뉜 MUI 운영 워크스페이스로 설계한다.
- `Active Board`는 workflow stage 중심 컬럼을, `Archive Board`는 `archive_type` 중심 컬럼을 사용해 책임을 분리한다.
- topic 카드와 inspector는 최근 archive topic에서 반복되는 `proposal`, `plan`, `task`, `state/current`, `reviews`, `implementation`, `qa`, `version`, `workflow` artifact 묶음을 기준으로 메타데이터를 노출한다.
- dashboard 코드는 React + TypeScript style guide 기준으로 feature-based category 구조로 분리하고, `App.tsx`는 composition root 역할만 남긴다.
- dashboard client는 로컬 파일을 직접 읽지 않고 analyzer/snapshot 계층이 정규화한 project/topic/artifact projection만 사용한다.

## 접근 방식

- `spec/ui/project-list-board.md`에서 Jira식 목록 보드의 column/card/selection UX를 정의한다.
- `spec/ui/project-detail-workspace.md`에서 MUI CRUD 스타일 상세 레이아웃과 패널 책임을 정의한다.
- `spec/ui/topic-lifecycle-board.md`에서 `Active Board`, `Archive Board`의 컬럼 규칙과 card interaction을 정의한다.
- `spec/ui/artifact-inspector.md`에서 topic 카드 클릭 이후 표시할 artifact detail 패널과 modal 동작을 정의한다.
- `spec/infra/dashboard-topic-artifact-snapshot.md`에서 recent archive 형식을 반영한 snapshot/data adapter 계약을 정의한다.
- `spec/infra/dashboard-feature-architecture.md`에서 React + TypeScript style guide 기준의 feature/category 구조와 shared 경계를 정의한다.
- `task.md`는 위 spec 경계대로 `feature structure`, `project list`, `project detail`, `topic boards`, `artifact inspector`, `integration` 순서로 분해한다.

## 단계별 실행

- 현재 `apps/dashboard/src/App.tsx` 단일 중심 구조를 해체하고, `app`, `features`, `shared` 레이어를 먼저 고정한다.
- 프로젝트/category 탐색 보드를 구현해 현재 snapshot의 project selection 흐름을 board-first UX로 바꾼다.
- 상세 워크스페이스에서 summary, project metadata, workflow viewer, topic board, inspector 패널을 분리한다.
- active/archive topic을 별도 lifecycle board로 재구성하고, stage 및 `archive_type` 기준 컬럼 정렬을 적용한다.
- analyzer/snapshot을 확장해 topic card와 artifact inspector가 필요한 normalized metadata를 한 번에 공급한다.
- 마지막으로 responsive layout, locale wiring, empty/error state, manual verification note를 정리한다.

## 완료 조건

- `plan.md`, `task.md`, `spec/ui/*.md`, `spec/infra/*.md`, `reviews/plan.review.md`, `reviews/task.review.md`가 모두 존재한다.
- 프로젝트 목록, 상세 워크스페이스, active/archive board, artifact inspector, data adapter, feature 구조의 책임 경계가 충돌 없이 정리되어 있다.
- 최근 archive topic 형식을 어떤 필드로 카드와 inspector에 반영할지 구현 가능한 수준으로 고정되어 있다.
- 구현 단계가 `App.tsx` 분해, snapshot 확장, UI 재배치, category 책임 분리 순서로 바로 시작될 수 있다.

## Audit Applicability

- `pgg-token`: `not_required` | plan 단계 문서 설계만 수행하며 token audit 대상 구조 변경 검증은 아직 없다
- `pgg-performance`: `not_required` | 성능 민감 구현이나 verification contract 변경 범위가 아니다

## 전문가 평가 요약

- 소프트웨어 아키텍트: 화면 구조 spec과 data/feature structure spec을 분리해 후속 구현 충돌을 줄인 계획이다.
- 시니어 백엔드 엔지니어: current snapshot을 직접 소비하는 영역과 새로 정규화해야 할 artifact projection 영역이 명확히 나뉘었다.
- QA/테스트 엔지니어: active/archive board 분리, inspector fallback, manual verification required 처리까지 acceptance 범위가 plan 단계에서 잡혀 있다.
