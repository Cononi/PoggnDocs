---
pgg:
  topic: "dashboard-poggn-branding-cleanup"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-23T00:44:14Z"
reactflow:
  node_id: "plan"
  node_type: "doc"
  label: "plan.md"
state:
  summary: "dashboard 브랜딩 정리 범위를 shell, title surface, source sync 계약으로 분해한다."
  next: "pgg-code"
---

# Plan

## 목표

- dashboard 상단 브랜드명을 `POGGN`으로 통일하고, 브랜드 mark를 `✨`로 교체하며, 바둑판 런처 아이콘과 분산된 title source를 current-project 범위 안에서 일관되게 정리할 수 있도록 구현 계획을 확정한다.

## 결정 사항

- 헤더 브랜딩 표면은 `apps/dashboard/src/app/DashboardShellChrome.tsx`에서 정리하고, desktop shell의 `AppLauncherMark`는 제거한다.
- 브랜드 mark는 기존 polygon 기반 `BrandMark` 대신 단일 emoji `✨`를 사용한다.
- 브라우저 `<title>`, locale fallback title, 현재 프로젝트 dashboard title source는 모두 `POGGN`을 기준으로 맞춘다.
- runtime header binding은 `DashboardApp.tsx`의 `currentProject?.dashboardTitle ?? dictionary.dashboardFallbackTitle` 구조를 유지하되, upstream title source를 같은 브랜드명으로 정리한다.
- `.pgg/project.json`과 필요 시 정적 snapshot 결과를 함께 맞춰서 live mode와 static snapshot mode 사이의 표기 차이를 없앤다.
- 현재 dirty 상태인 `apps/dashboard/public/dashboard-data.json`은 기존 사용자 변경을 덮어쓰지 않도록 최소 반영 또는 재생성 여부를 신중히 판단한다.

## 접근 방식

- `spec/ui/dashboard-brand-shell.md`에서 헤더 텍스트, emoji mark, launcher 제거, compact/desktop spacing 기준을 정의한다.
- `spec/ui/dashboard-title-surfaces.md`에서 HTML title, locale fallback, runtime binding, settings 연동 표면의 문자열 계약을 정의한다.
- `spec/infra/dashboard-branding-source-sync.md`에서 manifest와 snapshot이 같은 title source를 공급하는 규칙과 dirty snapshot 처리 기준을 정의한다.
- `task.md`는 위 spec 경계대로 shell surface, title surface, source sync, verification 기록 순서로 분해한다.

## 단계별 실행

- 먼저 shell header에서 브랜드 텍스트, brand mark, launcher mark의 표면을 정리한다.
- 그 다음 HTML title과 locale fallback을 `POGGN`으로 통일해 브라우저와 빈 상태 fallback까지 같은 이름을 사용하게 만든다.
- 이어서 `.pgg/project.json`과 필요한 snapshot/data source를 동기화해 current project title이 runtime header에서 같은 값으로 보이게 만든다.
- 마지막으로 `pgg dashboard` 실행 결과 기준 수동 확인 또는 선언된 verification contract 결과를 기록한다.

## 완료 조건

- `plan.md`, `task.md`, `spec/ui/*.md`, `spec/infra/*.md`, `reviews/plan.review.md`, `reviews/task.review.md`가 모두 존재한다.
- shell, title surface, source sync의 책임 경계가 겹치지 않고 바로 구현 가능한 수준으로 정리된다.
- `POGGN`, `✨`, launcher 제거, dirty snapshot 주의 사항이 모두 문서에 명시된다.
- 후속 `pgg-code`가 파일 변경 순서와 검증 포인트를 추정 없이 바로 집행할 수 있다.

## Audit Applicability

- `pgg-token`: `not_required` | UI 브랜딩과 title source 정리 범위이며 token audit 대상 구조 변경이 아니다
- `pgg-performance`: `not_required` | 성능 민감 구현이나 verification contract 변경 범위가 아니다

## 전문가 평가 요약

- 소프트웨어 아키텍트: UI 표면과 data source sync를 분리해 작은 fix 범위에서도 구현 경계를 명확히 유지했다.
- 시니어 백엔드 엔지니어: header binding을 그대로 두고 upstream title source만 정리하는 접근이 회귀 위험을 줄인다.
- QA/테스트 엔지니어: live/static title surface, launcher 제거, dirty snapshot 주의가 acceptance 범위에 모두 포함되었다.
