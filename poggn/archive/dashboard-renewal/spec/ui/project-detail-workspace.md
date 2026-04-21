---
pgg:
  topic: "dashboard-renewal"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-21T15:55:16Z"
reactflow:
  node_id: "spec-project-detail-workspace"
  node_type: "doc"
  label: "spec/ui/project-detail-workspace.md"
state:
  summary: "MUI CRUD 스타일 프로젝트 상세 워크스페이스와 패널 책임을 정의한다."
  next: "task.md 승인"
---

# Project Detail Workspace Spec

## Goal

- 선택된 프로젝트를 MUI CRUD dashboard 계열의 운영 워크스페이스로 보여주되, pgg 문서 구조에 맞는 summary/meta/workflow/topic panel 책임을 분리한다.

## Workspace Layout

- 상단 summary header는 프로젝트명, rootDir, generated 시각, quick status chip을 보여준다.
- overview/meta panel은 provider, language, auto mode, teams mode, git mode, version, verification mode를 요약한다.
- workflow panel은 선택된 topic의 `workflow.reactflow.json` 기반 시각화를 포함한다.
- topic board panel은 `Active Board`와 `Archive Board`를 전환 또는 동시 배치 가능한 구조로 가진다.
- inspector panel 또는 modal은 topic/artifact drill-down 결과를 표시한다.

## MUI Composition Rules

- layout과 surface는 MUI container, grid, card, tabs, drawer, dialog 계열로 구성한다.
- theme token과 typography는 현재 dashboard theme를 확장하는 방향으로 유지한다.
- 각 panel은 독립적인 header, body, empty state를 가져야 한다.
- 패널 간 상태 공유는 query/store 계층으로만 연결하고 presentation component 내부에서 직접 엮지 않는다.

## Responsive Rules

- desktop에서는 multi-panel workspace를 유지한다.
- tablet 이하에서는 topic board와 inspector를 우선순위 기반 stacked layout 또는 drawer/modal로 전환한다.
- summary header의 핵심 메타는 작은 화면에서도 한 번에 읽혀야 한다.

## Detail Semantics

- 상세 워크스페이스는 프로젝트 단위 운영 화면이지 전역 registry 관리 화면이 아니다.
- project card의 요약보다 더 깊은 정보만 보여주고 중복 정보는 최소화한다.
- workflow 선택, topic 선택, artifact 선택 상태가 서로 충돌하지 않게 단일 selection model을 유지한다.

## Non-Requirements

- 프로젝트 설정 편집 전용 관리 콘솔
- 파일 시스템 브라우저 전체 탐색기
- 멀티 프로젝트 동시 비교
