---
pgg:
  topic: "dashboard-poggn-branding-cleanup"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-23T00:44:14Z"
reactflow:
  node_id: "spec-dashboard-brand-shell"
  node_type: "doc"
  label: "spec/ui/dashboard-brand-shell.md"
state:
  summary: "dashboard 상단 shell의 브랜드 텍스트와 아이콘 규칙을 정의한다."
  next: "task.md 승인"
---

# Dashboard Brand Shell Spec

## Goal

- `DashboardShellChrome`의 상단 shell이 `POGGN` 브랜드를 가장 먼저 읽히는 표면이 되도록 텍스트, mark, launcher 장식을 정리한다.

## Surface Rules

- shell 브랜드 텍스트는 `POGGN` 단일 워드마크만 사용한다.
- 브랜드 텍스트 왼쪽 mark는 기존 polygon 형태 대신 emoji `✨`를 사용한다.
- desktop shell에서 `AppLauncherMark` 3x3 바둑판 아이콘은 제거한다.
- compact shell에서는 기존 menu 버튼 흐름을 유지하고, 브랜드 표면은 텍스트와 emoji 위계를 해치지 않게 유지한다.
- 브랜드 그룹은 header 내 다른 nav item보다 먼저 읽히고, spacing 조정만으로 균형을 맞춘다.

## Interaction Rules

- launcher 제거는 기능 추가가 아니라 장식 제거이므로 별도 대체 버튼을 만들지 않는다.
- `projects`와 `settings` 등 기존 nav interaction은 유지한다.
- 브랜드 텍스트 클릭/hover에 새 동작을 추가하지 않는다.

## Responsive Rules

- desktop에서는 launcher 제거 뒤 남는 좌측 공간이 과하게 비지 않도록 브랜드 그룹 spacing을 재조정한다.
- compact shell에서는 menu 버튼과 브랜드 텍스트가 줄바꿈 없이 안정적으로 보인다.
- emoji mark는 작은 화면에서도 텍스트보다 과도하게 커 보이지 않아야 한다.

## Non-Requirements

- 새 로고 시스템 구축
- 브랜드 애니메이션 추가
- navigation IA 변경
