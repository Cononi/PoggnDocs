---
pgg:
  topic: "dashboard-renewal"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-21T15:55:16Z"
reactflow:
  node_id: "spec-topic-lifecycle-board"
  node_type: "doc"
  label: "spec/ui/topic-lifecycle-board.md"
state:
  summary: "active/archive topic을 분리한 lifecycle board 규칙을 정의한다."
  next: "task.md 승인"
---

# Topic Lifecycle Board Spec

## Goal

- 프로젝트 상세 내부에서 active topic과 archived topic을 서로 다른 운영 목적의 스크럼 보드로 보여주는 규칙을 정의한다.

## Active Board

- `Active Board`는 workflow 진행 상태를 읽는 보드다.
- 기본 column은 `proposal`, `plan`, `code`, `refactor`, `qa`, `blocked`로 해석한다.
- topic card는 현재 stage, next action, last expert score, blocking issue, active spec/task 수를 표시한다.
- `state/current.md`가 존재하면 해당 값을 우선 근거로 사용한다.
- 카드 클릭 시 해당 topic의 workflow panel과 inspector selection이 동기화되어야 한다.

## Archive Board

- `Archive Board`는 완료된 topic을 change category 중심으로 읽는 보드다.
- 기본 column은 `feat`, `fix`, `docs`, `refactor`, `chore`, `remove`를 사용한다.
- archive card는 version, archived 시각, recent QA status, 핵심 artifact completeness를 보여준다.
- column 내 정렬은 `archivedAt` 내림차순을 기본으로 한다.

## Card Rules

- card는 topic 이름, 대표 상태 chip, score, 핵심 artifact badge를 가진다.
- artifact badge는 `proposal`, `plan`, `task`, `spec`, `review`, `implementation`, `qa`, `version`, `workflow` 존재 여부를 요약한다.
- 파일이 누락된 topic은 정상 card처럼 보이게 숨기지 말고 partial 상태로 표시해야 한다.

## Interaction Rules

- board 전환은 active와 archive 책임을 섞지 않아야 한다.
- 현재 선택 topic이 archive board에 있으면 active board 전환 시 selection을 보존하지 않는다.
- board는 drag and drop으로 topic 상태를 변경하는 편집 도구가 아니라 읽기 중심 운영 뷰다.

## Non-Requirements

- topic stage 직접 수정
- archive topic 복원
- workflow helper 실행 자동화
