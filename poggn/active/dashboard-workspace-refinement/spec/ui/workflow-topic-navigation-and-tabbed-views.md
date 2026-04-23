---
pgg:
  topic: "dashboard-workspace-refinement"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-23T07:52:00Z"
reactflow:
  node_id: "spec-workflow-shell"
  node_type: "doc"
  label: "spec/ui/workflow-topic-navigation-and-tabbed-views.md"
state:
  summary: "workflow topic selection과 tabbed view shell 규칙을 정의한다."
  next: "task.md 승인"
---

# Workflow Topic Navigation And Tabbed Views Spec

## Goal

- workflow section을 좌측 topic navigation과 tabbed content 중심의 명확한 reading shell로 정리한다.

## Topic Navigation Requirements

- workflow section 안에서 topic 선택은 좌측 sidebar surface에서 이뤄져야 한다.
- 상단 dropdown/select는 primary topic chooser가 아니어야 한다.
- 좌측 sidebar는 active/archive topic을 구분하거나 최소한 현재 선택 topic을 명확히 읽을 수 있어야 한다.
- topic selection은 workflow, modal, file/report/history preview가 공유하는 selected topic state와 연결돼야 한다.

## View Switching Requirements

- `Timeline`과 `Flow` 전환은 MUI `Tabs`와 `Tab`을 사용해야 한다.
- 버튼 두 개를 나란히 둔 custom toggle은 기본 계약이 아니다.
- `Timeline`과 `Flow`는 같은 selected topic과 같은 artifact source를 공유해야 한다.
- tab 변경은 view mode만 바꿔야 하며 selected topic, modal context, current highlight 의미를 바꾸면 안 된다.

## Workflow Summary Card Requirements

- 초기 질문 기록은 workflow 상단 summary card 내부로 이동해야 한다.
- 초기 질문 record typography는 현재 body copy보다 작은 caption/body-small tone이어야 한다.
- summary card는 질문 기록, selected topic 핵심 상태, current stage 정도를 함께 보여 줄 수 있다.
- 질문 기록이 없는 topic은 empty state를 보여 주되 내용을 추측하면 안 된다.

## Layout Guardrails

- project detail 전역 sidebar와 workflow 내부 topic sidebar의 책임은 겹치면 안 된다.
- 모바일/좁은 폭에서는 topic sidebar가 stack 또는 drawer처럼 재배치될 수 있지만, interaction contract 자체는 유지해야 한다.

## Non-Requirements

- workflow section 바깥 global sidebar에 topic chooser를 다시 추가하는 것
- tab마다 서로 다른 topic source를 허용하는 것
