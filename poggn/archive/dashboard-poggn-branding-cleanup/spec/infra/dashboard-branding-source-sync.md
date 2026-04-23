---
pgg:
  topic: "dashboard-poggn-branding-cleanup"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-23T00:44:14Z"
reactflow:
  node_id: "spec-dashboard-branding-source-sync"
  node_type: "doc"
  label: "spec/infra/dashboard-branding-source-sync.md"
state:
  summary: "manifest와 snapshot이 같은 dashboard 브랜드명을 공급하는 동기화 규칙을 정의한다."
  next: "task.md 승인"
---

# Dashboard Branding Source Sync Spec

## Goal

- live dashboard와 static snapshot mode가 같은 브랜드명을 공급하도록 current-project 내부 source sync 규칙을 정의한다.

## Source Rules

- current project의 dashboard title source는 `.pgg/project.json`을 기준으로 본다.
- dashboard client는 `currentProject?.dashboardTitle ?? dictionary.dashboardFallbackTitle` 경로를 유지하고, source sync는 upstream data를 정리하는 방식으로 해결한다.
- static snapshot output이 dashboard title을 포함하면 live mode와 동일하게 `POGGN`을 반영해야 한다.
- `apps/dashboard/public/dashboard-data.json`은 이미 dirty 상태이므로 무조건 재생성하지 않고, 실제 title surface 반영 필요가 확인된 경우에만 안전하게 업데이트한다.

## Consistency Rules

- `.pgg/project.json`, live API snapshot, static snapshot surface 사이에 브랜드명 불일치가 남지 않아야 한다.
- `dashboardShell.ts`의 검색 인덱싱이 `dashboardTitle`을 사용해도 기존 탐색 동작이 깨지지 않아야 한다.
- default title source를 정리하더라도 프로젝트별 커스텀 title override 기능 자체는 유지한다.

## Verification Rules

- verification contract가 선언되지 않았으면 `manual verification required` 상태를 유지한다.
- 검증 기록은 최소한 live shell title, browser title, launcher 제거 여부를 포함해야 한다.
- static snapshot surface를 수정한 경우에는 dirty 파일을 덮어쓴 범위와 근거를 함께 남긴다.

## Non-Requirements

- snapshot schema 변경
- analyzer 구조 리팩터링
- current-project 밖 registry/manifest 동기화
