---
pgg:
  topic: "dashboard-workspace-refinement"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-23T07:52:00Z"
  auto_mode: "on"
reactflow:
  node_id: "plan"
  node_type: "doc"
  label: "plan.md"
state:
  summary: "dashboard workspace refinement를 board/project-info, workflow navigation/highlighting, file tree, report/history summary spec으로 분해한다."
  next: "pgg-code"
---

# Plan

## 1. 목표

- `dashboard-project-workspace-redesign`로 연결된 current detail workspace를 유지하면서, project list와 detail reading 경험을 Jira-style density와 summary-first interaction으로 다시 정리한다.
- project card를 CTA button 중심이 아니라 card-wide navigation affordance로 바꾸고, board 자체를 Jira 칸반 보드에 가까운 column rhythm으로 재구성한다.
- project info에서는 불필요한 `dashboard port`를 제거하고 `POGGN version`과 `project version`을 분리해 정보 해석 오류를 줄인다.
- workflow는 topic selection, initial question record, view switching을 더 명확한 layout으로 재배치하고, stage/task/file 진행 상태를 현재보다 강하게 강조한다.
- files, report, history를 flat list/large cards 중심에서 tree/table/compact modal 중심으로 바꿔 즉시성, 탐색성, 성능을 함께 개선한다.

## 2. Audit Applicability

- [pgg-token]: [not_required] | workflow token/handoff 구조 변경이 아니라 dashboard interaction refinement가 중심이다
- [pgg-performance]: [required] | report lag complaint가 explicit requirement이며 list-to-table/lazy modal 변경의 효과를 확인해야 한다

## 3. Spec 분해

| Spec ID | path | 목적 | 구현 핵심 |
|---|---|---|---|
| S1 | `spec/ui/project-board-and-project-info-refinement.md` | project list visual rhythm과 project info metric contract를 refinement한다. | Jira-style kanban lane, card-wide click, open button 제거, port 제거, POGGN/project version 분리 |
| S2 | `spec/ui/workflow-topic-navigation-and-tabbed-views.md` | workflow information architecture를 좌측 topic sidebar와 MUI Tabs 중심으로 재정의한다. | left topic sidebar, tabbed timeline/flow, compact question card, shared selected-topic state |
| S3 | `spec/ui/workflow-progress-highlighting-and-artifacts.md` | workflow/timeline의 source artifact contract와 current progress emphasis를 강화한다. | add/plan/code/refactor/qa provenance, current task/file animation highlight, modal parity, reduced-motion fallback |
| S4 | `spec/ui/file-tree-navigation-and-folder-layout.md` | files surface를 folder tree explorer와 preview split layout으로 정리한다. | `add-img/3.png` 참고 tree styling, hierarchical folders, selected row sync, topic-scoped edit/delete |
| S5 | `spec/ui/report-table-and-history-modal-summary.md` | report/history를 summary-first table/card + modal detail 구조로 재설계한다. | dense report table, lazy detail modal, no topic selection in history, compact cards, no full-view CTA |

## 4. 구현 순서

1. S1에서 board interaction contract와 project info data contract를 먼저 고정해 data model과 navigation affordance의 기반을 닫는다.
2. S2에서 workflow topic selection과 MUI Tabs layout을 먼저 정리해, 이후 강조/animation 규칙이 안정적인 shell 위에서 동작하게 한다.
3. S3에서 workflow/timeline artifact projection과 current-state 강조 contract를 정의해 실제 stage/task/file provenance 경계를 고정한다.
4. S4에서 flat file list를 folder tree explorer로 바꾸는 레이아웃과 selection contract를 분리한다.
5. S5에서 report/history를 summary-first surface로 정리하고 modal lazy opening 규칙을 명시한다.
6. `task.md`는 shared data foundation -> board/info -> workflow shell -> workflow emphasis -> files -> report/history -> integration 순서로 구현 단위를 자른다.

## 5. 검증 전략

- board 검증: project list가 Jira-style lane cadence와 card-wide click affordance를 갖고, card 하단 open CTA가 제거되는지 확인한다.
- project info 검증: `dashboard port`가 제거되고 `POGGN version`과 `project version`이 별도 label/value로 표시되는지 확인한다.
- workflow navigation 검증: topic 선택이 좌측 sidebar에서 가능하고 `Timeline`/`Flow` 전환이 MUI Tabs로 동작하는지 확인한다.
- question record 검증: 초기 질문 기록이 workflow summary card 내부의 작은 typography로 표시되는지 확인한다.
- provenance 검증: workflow/timeline이 add, plan, code, refactor, qa 산출물과 current task/file을 같은 source로 보여 주는지 확인한다.
- emphasis 검증: 현재 진행 항목이 flow/timeline 양쪽에서 animation-enabled highlight로 분명히 드러나고 `prefers-reduced-motion`에서는 정적 fallback이 동작하는지 확인한다.
- file tree 검증: files surface가 folder hierarchy로 렌더되고 tree selection과 preview/edit/delete가 topic root guard 안에서 동작하는지 확인한다.
- report/history 검증: report는 dense table-first surface, history는 topic selection 없는 compact card surface가 되고 양쪽 모두 click-to-modal detail을 제공하는지 확인한다.
- performance 검증: report/detail surface에서 inline heavy card 렌더링을 줄이고 lazy modal opening으로 interaction lag가 완화되는지 후속 `pgg-performance` audit에서 확인한다.
- workflow/process 검증: current-project verification contract가 없으므로 후속 구현과 QA에서도 `manual verification required`를 유지한다.

## 6. 리스크와 가드레일

- current snapshot에는 `project version` field가 없어 UI만 먼저 바꾸면 잘못된 version 의미를 계속 재사용하게 된다. S1/T1에서 data contract를 먼저 보강한다.
- board card를 전체 클릭으로 바꾸는 과정에서 delete action까지 navigation으로 흡수되면 live-mode destructive control이 오작동할 수 있다. S1에서 nested action stopPropagation contract를 명시한다.
- workflow topic sidebar가 selected topic state와 분리되면 flow/timeline/modal selection이 어긋날 수 있다. S2에서 shared selected-topic store contract를 유지한다.
- current progress animation이 과하면 dense workflow UI의 가독성을 해칠 수 있다. S3에서 current item에만 제한하고 reduced-motion fallback을 둔다.
- file tree를 folder hierarchy로 만들 때 상대경로 normalization이 흔들리면 topic root guard가 약해질 수 있다. S4에서 tree node는 항상 normalized relative path를 source of truth로 사용한다.
- report/history를 modal 기반으로 바꾸면서 detail 문서를 목록 단계에서 미리 읽으면 성능 이점을 잃는다. S5에서 lazy detail loading/opening을 기본 계약으로 둔다.
- history에서 topic selection을 없애더라도 현재 어떤 topic이 modal에 열렸는지는 명확해야 한다. S5에서 card click 시 modal header에 topic/stage/version을 고정한다.

## 7. 완료 기준

- `plan.md`, `task.md`, `spec/ui/*.md`, `reviews/plan.review.md`, `reviews/task.review.md`가 모두 생성되어 있다.
- `pgg-code`가 board/info, workflow navigation/highlighting, file tree, report/history summary contract를 spec/task만 보고 구현할 수 있다.
- `state/current.md`가 active specs, active tasks, audit applicability, changed files, next action을 최소 handoff 형식으로 유지한다.
- `pgg-performance`가 왜 `required`인지와 어떤 acceptance를 확인해야 하는지가 plan/task/state에 일관되게 기록된다.

## 8. 전문가 평가 요약

- 소프트웨어 아키텍트: board/info, workflow shell, workflow emphasis, file tree, report/history summary로 나눈 경계가 시스템 책임과 UI surface를 자연스럽게 분리한다.
- 시니어 백엔드 엔지니어: `project version` data contract, topic selection state, tree path normalization, lazy modal loading을 foundation 우선으로 배치한 순서가 실제 구현 경로와 맞다.
- QA/테스트 엔지니어: card-wide navigation, version metric 분리, MUI Tabs, animation fallback, file tree guard, report lag 완화, history modal contract가 acceptance 수준으로 충분히 드러난다.
