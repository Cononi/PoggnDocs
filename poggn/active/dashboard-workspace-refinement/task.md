---
pgg:
  topic: "dashboard-workspace-refinement"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-23T07:52:00Z"
  auto_mode: "on"
reactflow:
  node_id: "task"
  node_type: "task"
  label: "task.md"
state:
  summary: "dashboard workspace refinement 구현 작업을 data foundation, board/info, workflow, file tree, report/history 기준으로 분해한다."
  next: "pgg-code"
---

# Task

## 1. Audit Applicability

- [pgg-token]: [not_required] | token handoff 구조가 아니라 dashboard UI/workspace refinement가 중심이다
- [pgg-performance]: [required] | report lag 완화가 acceptance에 포함되므로 후속 audit가 필요하다

## 2. 작업 목록

| Task ID | Spec Ref | 작업 요약 | 선행 조건 | 완료 기준 |
|---|---|---|---|---|
| T1 | `S1`, `S2`, `S4`, `S5` | `shared/model`, snapshot builder, store/selectors를 보강해 `POGGN version`, `project version`, workflow topic sidebar data, folder tree nodes, report/history summary row contract를 수용하는 foundation을 만든다. | proposal, S1, S2, S4, S5 | UI가 generic `installedVersion` 하나에 의존하지 않고, topic tree/history/report surface가 필요한 normalized data를 공유한다 |
| T2 | `S1` | `ProjectListBoard.tsx`와 관련 board helpers를 Jira-style lane rhythm과 card-wide navigation contract로 재구성하고, 하단 open CTA를 제거한다. | T1, S1 | board가 Jira-style cadence를 갖고, card 전체가 detail 진입 affordance가 되며 delete/live controls는 안전하게 분리된다 |
| T3 | `S1`, `S2` | `ProjectDetailWorkspace.tsx`, sidebar wiring, locale copy를 조정해 project info에서 port를 제거하고 version metrics를 분리하며, workflow topic 좌측 sidebar와 tab shell을 연결한다. | T1, T2, S1, S2 | project info가 `POGGN version`/`project version`을 구분하고 workflow topic selection이 left sidebar + MUI Tabs로 동작한다 |
| T4 | `S2`, `S3` | workflow summary card, initial question typography, stage/task/file provenance projection, flow/timeline animation highlight, modal parity를 구현한다. | T1, T3, S2, S3 | initial question record가 compact card로 옮겨지고, current task/file이 flow/timeline 양쪽에서 animation-enabled highlight로 드러난다 |
| T5 | `S4` | files surface를 folder hierarchy explorer와 preview split layout으로 교체하고, selected file sync 및 topic-scoped edit/delete guard를 유지한다. | T1, T3, S4 | files가 flat list가 아니라 folder tree로 보이고 edit/delete는 topic root guard 안에서 그대로 동작한다 |
| T6 | `S5` | report를 dense table-first surface로 바꾸고, history를 compact card + modal detail 구조로 재설계하며, topic selection dependency와 full-view CTA를 제거한다. | T1, T3, S5 | report가 table 기반으로 즉시 읽히고 history가 compact card click-to-modal 계약으로 단순화된다 |
| T7 | `S1`, `S2`, `S3`, `S4`, `S5` | board/detail/workflow/files/report/history 통합 회귀를 정리하고 `manual verification required` 및 `pgg-performance required` 상태를 후속 stage로 넘긴다. | T2, T3, T4, T5, T6 | interaction, data contract, lazy modal opening, reduced-motion fallback, performance audit requirement가 통합적으로 기록된다 |

## 3. 구현 메모

- T1은 현재 `ProjectSnapshot.installedVersion`이 사실상 POGGN version 의미로만 읽히는 문제를 먼저 해소해야 한다.
- T1은 report/history/file tree용 derived data를 매 render마다 비싸게 재구성하지 않도록 selector/helper 경계를 분리하는 편이 안전하다.
- T2는 card 전체 클릭과 delete button 공존 문제를 처리해야 하므로 pointer/keyboard access contract를 함께 고려해야 한다.
- T2는 Jira-style board라고 해서 기존 category 기반 grouping을 버리는 것이 아니라 lane density와 card cadence를 재해석하는 방향으로 가야 한다.
- T3는 workflow section만 좌측 topic sidebar를 쓰더라도 project detail 전역 sidebar와 책임이 겹치지 않게 해야 한다.
- T3는 locale에서 `version` 하나로 뭉친 copy를 `POGGN version`, `project version`으로 분리할 가능성이 높다.
- T4는 current highlight animation이 `flow`와 `timeline`에서 의미가 다르게 보이지 않도록 공통 status token을 써야 한다.
- T4는 `prefers-reduced-motion` 대응을 명시적으로 넣어 animation requirement와 접근성을 함께 만족해야 한다.
- T5는 tree node가 folder/file 혼합 구조가 되므로 normalized path, expanded state, selected leaf state를 분리해 관리해야 한다.
- T6는 report table row click 시 detail modal을 lazy opening해야 하며, 목록 단계에서 모든 qa/review detail을 prefetch하지 않는 것이 성능상 유리하다.
- T6는 history에서 topic selection을 없애더라도 active/archive/stage 문맥을 card metadata로 충분히 보여 줘야 한다.
- T7은 current-project verification contract가 없으므로 구현/QA 기록에 `manual verification required`를 유지해야 하며, `pgg-performance` audit 필요성도 빠뜨리면 안 된다.

## 4. 검증 체크리스트

- project board가 Jira-style lane/card rhythm으로 보이고 하단 open button이 제거됐는지 확인한다.
- card 전체 클릭으로 detail workspace에 들어가고 delete action은 독립적으로 동작하는지 확인한다.
- project info에서 `dashboard port`가 사라지고 `POGGN version`과 `project version`이 분리돼 보이는지 확인한다.
- workflow topic을 좌측 sidebar에서 바꿀 수 있고 `Timeline`/`Flow` 전환이 MUI Tabs인지 확인한다.
- 초기 질문 기록이 workflow summary card 내부의 작은 텍스트로 보이는지 확인한다.
- flow/timeline이 add/plan/code/refactor/qa stage 산출물과 current task/file을 같은 source로 보여 주는지 확인한다.
- current item 강조가 animation-enabled 상태이며 `prefers-reduced-motion`일 때 정적 강조로 fallback 되는지 확인한다.
- files가 실제 folder tree explorer 형태로 보이고 선택/편집/삭제가 topic root guard 안에서 동작하는지 확인한다.
- report가 dense table-first surface로 즉시 보이고, modal detail은 row click 시 lazy opening 되는지 확인한다.
- history에 topic 선택 UI가 없고 compact card에 핵심 정보만 보이며 card click으로 modal detail이 열리는지 확인한다.
- current-project verification contract가 없으므로 기록에 `manual verification required`가 남는지 확인한다.
- report lag 완화 여부를 후속 `pgg-performance` audit 대상으로 남겼는지 확인한다.
