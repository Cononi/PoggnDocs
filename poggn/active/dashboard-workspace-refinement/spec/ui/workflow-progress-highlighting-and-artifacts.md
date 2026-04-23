---
pgg:
  topic: "dashboard-workspace-refinement"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-23T07:52:00Z"
reactflow:
  node_id: "spec-workflow-progress"
  node_type: "doc"
  label: "spec/ui/workflow-progress-highlighting-and-artifacts.md"
state:
  summary: "workflow/timeline artifact provenance와 current progress 강조 규칙을 정의한다."
  next: "task.md 승인"
---

# Workflow Progress Highlighting And Artifacts Spec

## Goal

- workflow timeline/flow가 실제 stage 산출물과 current task/file 진행 상태를 더 분명하게 보여 주도록 contract를 강화한다.

## Artifact Provenance Requirements

- workflow와 timeline은 `proposal`, `plan`, `task`, `spec`, `implementation`, `reviews`, `qa`, `workflow` 등 실제 topic artifact에서 읽을 수 있는 정보만 사용해야 한다.
- add, plan, code, refactor, qa 단계에서 생성되거나 진행된 내역이 source artifact로 드러나야 한다.
- node/item은 최소 stage, title, source path, artifact kind, updated state를 읽을 수 있어야 한다.
- stage/task/file 상태를 추측으로 생성하면 안 된다.

## Current Progress Requirements

- 현재 진행중인 stage/task/file은 flow와 timeline 양쪽에서 가장 눈에 띄는 강조를 받아야 한다.
- 강조는 color만으로 끝나면 안 되고 pulse, glow, ring 같은 animation-enabled cue를 포함해야 한다.
- animation은 current item에 한정하고, done/upcoming item까지 같은 수준의 motion을 적용하면 안 된다.
- `prefers-reduced-motion` 환경에서는 정적 outline, badge, contrast 강화 같은 fallback을 제공해야 한다.

## Flow And Timeline Parity Requirements

- flow와 timeline은 같은 current item 의미를 공유해야 한다.
- 한쪽에서 current file로 표시한 artifact가 다른 쪽에서 done/upcoming으로 보이면 안 된다.
- timeline은 단순 node dump가 아니라 시간/진행 흐름을 읽기 쉬운 list surface일 수 있지만 source contract는 동일해야 한다.

## Detail Interaction Requirements

- flow node click과 timeline item click은 동일한 modal/document viewer contract로 연결돼야 한다.
- modal은 stage, task/file relevance, source path를 함께 보여 줄 수 있어야 한다.
- diff artifact는 diff viewer로, markdown/text artifact는 해당 renderer contract로 분기해야 한다.

## Non-Requirements

- artifact source가 없는 current task/file을 heuristic으로 창조하는 것
- animation을 모든 node/item에 광범위하게 적용하는 것
