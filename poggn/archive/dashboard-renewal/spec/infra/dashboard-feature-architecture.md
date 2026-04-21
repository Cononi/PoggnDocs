---
pgg:
  topic: "dashboard-renewal"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-21T15:55:16Z"
reactflow:
  node_id: "spec-dashboard-feature-architecture"
  node_type: "doc"
  label: "spec/infra/dashboard-feature-architecture.md"
state:
  summary: "React + TypeScript style guide 기준 dashboard feature/category 구조를 정의한다."
  next: "task.md 승인"
---

# Dashboard Feature Architecture Spec

## Goal

- React + TypeScript style guide에 맞춰 `apps/dashboard`를 feature-based category 구조로 재편하고, 현재 단일 `App.tsx` 중심 결합을 해체하는 기준을 정의한다.

## Target Structure

- `src/app`: app shell, provider wiring, route-level composition
- `src/features/project-list`: project list board UI, hooks, adapters, types
- `src/features/project-detail`: detail workspace, summary/meta/workflow composition
- `src/features/topic-board`: active/archive lifecycle board UI와 selection helpers
- `src/features/artifact-inspector`: inspector panel, modal viewer, artifact group helpers
- `src/shared`: theme, locale, reusable UI primitives, common hooks, store helpers

## Boundary Rules

- feature는 자기 책임의 component, hook, adapter, type을 feature 내부에 둔다.
- 여러 feature가 공유하는 domain shape만 `shared` 또는 별도 entity layer로 올린다.
- data fetching/query key/fetcher는 feature 경계 또는 shared data adapter에 두고 presentation component에 inline으로 두지 않는다.
- locale key는 feature 책임 단위로 나누고 inline copy 신규 추가를 금지한다.
- feature-scoped `index.ts`는 허용하되 app-wide wildcard barrel은 피한다.

## App Composition Rules

- `App.tsx` 또는 동등한 app root는 provider와 상위 layout composition만 담당한다.
- feature 간 selection state는 shared store 또는 app-level coordinator를 통해 전달한다.
- workflow viewer와 inspector는 독립 feature로 유지하되 project-detail workspace에서 조합한다.

## Migration Rules

- 기존 `App.tsx`, `dashboardLocale.ts`, `theme.ts`, `styles.css`의 역할은 새 구조로 분해하되 한 번에 삭제 가능한 순서로 옮긴다.
- 구현 단계에서 feature 폴더 도입 후 legacy file을 제거하는 방향으로 진행한다.
- 새 구조에서도 TanStack Query, Zustand, React Flow, MUI 사용은 유지한다.

## Non-Requirements

- route 기반 다중 페이지 앱 전환
- 디자인 시스템 전체 재작성
- 상태 관리 라이브러리 교체
