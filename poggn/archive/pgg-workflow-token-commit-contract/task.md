---
pgg:
  topic: "pgg-workflow-token-commit-contract"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 97
  updated_at: "2026-04-28T00:47:54Z"
  auto_mode: "on"
reactflow:
  node_id: "task"
  node_type: "doc"
  label: "task.md"
state:
  summary: "pgg-code가 수행할 spec 경계별 작업 목록을 정의한다."
  next: "pgg-code"
---

# Task

## 1. Audit Applicability

- [pgg-token]: [required] | token 측정 정확도, source 분리, actual/unavailable/estimated 계약을 직접 변경하는 topic이다.
- [pgg-performance]: [not_required] | 모바일 workflow process scaling은 UI layout 계약이며 별도 성능 민감 runtime path나 선언된 performance verification contract는 없다.

## 2. 작업 목록

| Task ID | Spec Ref | 작업 요약 | 선행 조건 | 완료 기준 |
|---|---|---|---|---|
| T1 | `S2` | token ledger가 LLM actual, LLM unavailable, Local token을 정확히 분리해 집계하도록 core model과 tests를 보강한다. | proposal, S2 | Codex response usage metadata 기반 LLM actual만 actual 합계에 포함되고, LLM unavailable과 Local estimated가 별도 source로 유지됨 |
| T2 | `S3` | dashboard Workflow Progress와 timeline/file token 표시를 LLM clip과 Local clip으로 분리한다. | T1, S3 | 결합 문구가 사라지고 LLM/Local clip이 별도 표시되며 null LLM actual이 `0`처럼 보이지 않음 |
| T3 | `S1` | 모바일 Workflow Progress process가 세로 stack으로 바뀌지 않고 형태 유지 scale down을 하도록 UI를 조정한다. | T2, S1 | 375px 모바일에서 step track이 같은 process 형태를 유지하고 node/connector/text overlap과 horizontal overflow가 없음 |
| T4 | `S4` | `pgg-code` task-row commit cadence와 task commit message body/footer 구조를 helper, skill, template, tests에 구현한다. | T1, S4 | `task.md` T1...N 행 완료마다 별도 commit/defer evidence가 남고, 제목/body/footer가 task row 계약을 만족함 |
| T5 | `S5` | 모든 pgg-* flow 문서와 pgg 생성/수정 코드 주석이 pgg lang을 따르도록 문서/skill/review/QA 계약을 갱신한다. | T4, S5 | ko/en language fixture에서 generated pgg 문서와 pgg 생성/수정 주석 지침이 pgg lang과 일치함 |
| T6 | `S6` | source templates, generated workspace assets, dist, README, regression tests를 동기화해 init/update 전파를 보장한다. | T1, T2, T3, T4, T5, S6 | `pgg update` 이후 계약이 유지되고 core test/dashboard build 및 필요한 UI 검증 evidence가 남음 |

## 3. 구현 메모

- T1은 요금 지표의 기준이므로 먼저 끝내야 한다. LLM unavailable을 actual로 합산하지 않는 회귀 테스트가 핵심이다.
- T2는 T1의 source별 model을 UI로 드러낸다. title 문자열에 token 값을 넣지 말고 chip row로 분리한다.
- T3는 `workflowProgressTrackSx`의 mobile `1fr` stack을 제거하는 작업이다. scale 적용 후 layout height와 interaction을 같이 확인한다.
- T4는 기존 stage commit helper의 message builder를 바꿀 수 있으므로 기존 git publish tests를 깨지 않게 유지한다.
- T5는 pgg가 생성하거나 수정하는 주석에만 적용한다. 기존 사용자 코드 주석 전체 번역은 하지 않는다.
- T6는 source template와 generated file drift를 막는 마무리 작업이다. dist가 관리되는 파일이면 build 산출물까지 반영한다.

## 4. 검증 체크리스트

- token ledger parser가 malformed record를 무해하게 무시하고 valid record만 source별 집계한다.
- LLM actual은 `source=llm`, `measurement=actual`, `estimated=false` record만 합산한다.
- Local token은 Local clip에만 표시되고 LLM actual로 fallback되지 않는다.
- Workflow Progress title에 `(LLM 실사용 : ... / Local : ...)` 결합 문구가 없다.
- 모바일 workflow process가 세로 stack으로 재배치되지 않는다.
- task-row commit history event가 task id와 task source를 남긴다.
- commit body는 dependencies section 다음 완료 조건 section 순서다.
- commit footer에는 완료 조건에 명시된 task 내용이 들어간다.
- pgg lang이 `ko`일 때 pgg 생성 문서와 주석 지침이 한국어다.
- `pgg update`, core test, dashboard build 또는 선언된 verification contract 결과가 QA에 기록된다.
