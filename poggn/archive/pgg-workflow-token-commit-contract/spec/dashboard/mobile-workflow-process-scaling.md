---
pgg:
  topic: "pgg-workflow-token-commit-contract"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 97
  updated_at: "2026-04-28T00:47:54Z"
reactflow:
  node_id: "spec-dashboard-mobile-workflow-process-scaling"
  node_type: "spec"
  label: "spec/dashboard/mobile-workflow-process-scaling.md"
state:
  summary: "모바일 workflow process가 세로 stack으로 바뀌지 않고 같은 형태를 유지하며 축소되는 표시 계약"
  next: "pgg-code"
---

# Spec: 모바일 Workflow Process 형태 유지

## 목적

dashboard의 Workflow Progress process가 모바일 viewport에서도 desktop과 같은 단계 배열 형태를 유지하고, 가용 폭에 맞춰 전체 process가 동적으로 축소되게 한다.

## 현재 동작

- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`의 `workflowProgressTrackSx`는 `xs`에서 `gridTemplateColumns: "1fr"`를 사용해 workflow step을 세로 stack으로 배치한다.
- 사용자는 모바일에서도 process의 단계 관계와 진행 구조를 한눈에 비교하기를 원한다.

## 요구사항

1. `xs`/mobile에서도 workflow step node는 세로 stack으로 재배치되지 않는다.
2. step 수에 따른 원래 process 형태를 유지하되 container 폭에 맞춰 track 전체를 scale down 한다.
3. scale down은 node, connector, label, current/completed/updating/blocked/pending 상태 표현을 함께 축소해야 한다.
4. 축소 후에도 버튼 hit target과 focus outline이 사용 가능해야 한다.
5. 긴 label 또는 상태 텍스트가 앞뒤 node와 겹치거나 container 밖으로 clipping되지 않아야 한다.
6. desktop/tablet layout은 기존 `md` 이상 process 사용성을 유지해야 한다.
7. 모바일 screenshot 또는 Playwright 검증으로 세로 stack이 사라지고 형태가 유지되는지 확인해야 한다.

## 구현 기준

- 주요 대상: `apps/dashboard/src/features/history/HistoryWorkspace.tsx`.
- `workflowProgressTrackSx`는 mobile에서도 `repeat(stepCount, ...)` 또는 동등한 고정 형태 track을 유지해야 한다.
- container width, `stepCount`, 최소 node 폭을 기준으로 scale 값을 계산하거나 CSS `transform: scale(...)`/`zoom`/container query에 준하는 안정적 방식을 사용한다.
- scale 적용 시 layout height는 축소된 시각 높이와 맞아야 하며, 다음 section과 겹치지 않아야 한다.
- 필요하면 workflow step node 내부 text size/spacing은 container-relative 상수로 조정하되 viewport width 기반 font scaling은 사용하지 않는다.

## 수용 기준

- 375px 폭 모바일에서 Workflow Progress step들이 세로로 나열되지 않는다.
- 375px, 768px, desktop viewport에서 workflow process node와 connector가 서로 겹치지 않는다.
- process track이 card 밖으로 가로 overflow를 만들지 않는다.
- keyboard focus와 click/tap으로 step detail dialog를 열 수 있다.
- 기존 status 색상과 완료/진행/추가 진행/차단/시작 전 의미가 유지된다.

## 제외

- workflow stage 의미, flow 순서, optional audit visibility 계산 변경.
- dashboard 전체 responsive redesign.
