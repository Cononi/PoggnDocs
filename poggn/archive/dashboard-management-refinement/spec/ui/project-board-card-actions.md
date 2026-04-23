---
pgg:
  topic: "dashboard-management-refinement"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-23T02:24:55Z"
reactflow:
  node_id: "spec-project-board-actions"
  node_type: "doc"
  label: "spec/ui/project-board-card-actions.md"
state:
  summary: "project board 카드 구조, drag-and-drop, 삭제 가드를 정의한다."
  next: "task.md 승인"
---

# Project Board Card Actions Spec

## Goal

- 현재 category 기반 board 모델을 유지하면서 `add-img/1.png` 방향의 관리형 보드 표면, project card 액션, drag-and-drop, safe delete 흐름을 정의한다.

## Board Surface Requirements

- board는 category section 기반 구조를 유지한다.
- 각 category 안에서는 project card를 조밀한 관리형 grid/list 조합으로 보여 주며, active/inactive 분류는 유지한다.
- add project action은 board 본문 헤더 안에 둔다.
- top navigation이나 sidebar는 board action 버튼을 대신하지 않는다.
- board visual tone은 현재 dashboard theme를 유지하되 spacing, surface contrast, card hierarchy를 `add-img/1.png` 쪽으로 강화한다.

## Project Card Requirements

- card는 최소 project name, latest topic or root hint, installed version, latest badge, active count or latest stage를 보여 줘야 한다.
- card open action과 delete action은 서로 다른 클릭 타깃이어야 한다.
- delete action은 card 전체 클릭과 충돌하지 않는 우측 상단 또는 action rail에 둔다.
- latest/current/active 상태 표현은 badge/chip으로 유지할 수 있지만 card 정보 위계는 더 간결해야 한다.
- drag handle 또는 drag affordance가 명확해야 하며, 사용자는 card가 이동 가능한지 즉시 인지할 수 있어야 한다.

## Drag-And-Drop Requirements

- 같은 category 안 순서 변경을 지원해야 한다.
- category 간 이동을 지원해야 한다.
- drop 결과는 category의 `projectIds` ordering 또는 동등한 source-of-truth에 반영되어야 한다.
- no-op drop은 불필요한 mutation을 보내지 않아야 한다.
- DnD는 board의 category model을 깨지 않고, unassigned project는 default category rules로 수렴해야 한다.

## Delete Modal Requirements

- delete action은 항상 modal confirmation을 거쳐야 한다.
- modal은 `dashboard에서 항목만 삭제`와 `실제 프로젝트 폴더까지 삭제`를 명확히 구분해야 한다.
- 실제 프로젝트 폴더 삭제는 checkbox opt-in이 없으면 금지한다.
- modal은 대상 project 이름과 root path를 보여 줘야 한다.
- filesystem delete는 고위험 작업이므로 destructive styling과 경고 copy를 제공해야 한다.
- live mode가 아니면 delete action은 disabled 또는 read-only로 보여야 한다.

## Mutation And Error Rules

- dashboard 등록 삭제와 filesystem delete는 같은 endpoint를 쓰더라도 명시적 flag로 분기되어야 한다.
- filesystem delete 실패 시 dashboard 등록 상태를 자동으로 연쇄 삭제하지 말고 결과를 분리해 피드백해야 한다.
- drag-and-drop 실패 시 card ordering은 rollback 가능해야 한다.
- static snapshot에서는 board mutation이 일어나지 않으며 명확한 disabled explanation을 제공한다.

## Non-Requirements

- category 모델 자체를 kanban column 이외의 완전히 다른 구조로 바꾸는 것
- 보드에서 직접 project 상세 편집 폼을 여는 것
- checkbox 없이 filesystem delete를 허용하는 것
