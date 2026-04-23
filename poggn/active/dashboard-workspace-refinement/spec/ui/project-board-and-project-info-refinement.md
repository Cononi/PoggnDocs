---
pgg:
  topic: "dashboard-workspace-refinement"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-23T07:52:00Z"
reactflow:
  node_id: "spec-board-info"
  node_type: "doc"
  label: "spec/ui/project-board-and-project-info-refinement.md"
state:
  summary: "project board와 project info metric refinement 규칙을 정의한다."
  next: "task.md 승인"
---

# Project Board And Project Info Refinement Spec

## Goal

- project list를 Jira-style kanban rhythm으로 재정의하고 project info metric에서 버전 의미를 명확하게 분리한다.

## Project Board Requirements

- project list는 category 기반 grouping을 유지하되 lane spacing, header, card density가 Jira-style board처럼 읽혀야 한다.
- project card는 전체 surface가 detail workspace navigation affordance여야 한다.
- 별도의 `상세 열기` 또는 `openProject` CTA button은 존재하지 않아야 한다.
- destructive/live-mode action이 card 내부에 남아야 한다면 card-wide navigation과 충돌하지 않도록 별도 hit target과 propagation guard를 가져야 한다.
- active workflow project 강조는 separate lane가 아니라 card accent, badge, metadata hierarchy로 처리할 수 있다.

## Project Info Requirements

- `Current Project` 정보 영역에서 `dashboard port`는 제거해야 한다.
- version surface는 최소 `POGGN version`과 `project version` 두 필드로 분리해야 한다.
- `POGGN version`은 현재 dashboard/pgg 설치 버전을 의미해야 하고 `project version`은 현재 프로젝트 자체 manifest/version source를 의미해야 한다.
- `project version` source가 없으면 `unknown` fallback을 쓰되, `POGGN version`과 같은 값을 임의 재사용하면 안 된다.
- version label은 두 값의 의미가 혼동되지 않도록 locale copy도 분리해야 한다.

## Data Contract Requirements

- project snapshot/model에는 `POGGN version`과 `project version`을 구분할 수 있는 field contract가 필요하다.
- `project version`은 current project 내부에서 안전하게 읽을 수 있는 선언적 source만 사용해야 한다.
- board card summary와 project info detail이 같은 version source를 공유해야 한다.

## Non-Requirements

- category 체계 자체를 제거하는 것
- project outside manifest를 임의로 탐색해 version을 찾는 것
- board를 Jira의 픽셀 단위 복제품으로 만드는 것
