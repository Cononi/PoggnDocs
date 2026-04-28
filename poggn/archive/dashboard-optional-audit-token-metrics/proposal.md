---
pgg:
  topic: "dashboard-optional-audit-token-metrics"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 95
  updated_at: "2026-04-27T23:24:03Z"
  auto_mode: "on"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "2.9.0"
  short_name: "dashboard-metrics"
  working_branch: "ai/feat/2.9.0-dashboard-metrics"
  release_branch: "release/2.9.0-dashboard-metrics"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "dashboard optional audit 표시 조건과 pgg token usage 기록 계약을 확정한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

dashboard optional audit token metrics

## 2. 변경 분류

- archive_type: `feat`
- version_bump: `minor`
- target_version: `2.9.0`
- short_name: `dashboard-metrics`
- working_branch: `ai/feat/2.9.0-dashboard-metrics`
- release_branch: `release/2.9.0-dashboard-metrics`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- 대시보드의 프로젝트에 워크플로우의 Overview에서 플로우 표시할때 pgg-token, pgg-performance 는 정말 진행되었을때만 표기 해야합니다.
- Performance, token은 pgg flow에서 진짜 flow속에 필요하다고 판단될때만 flow에 사용됩니다.
- 각 flow 작업마다, 파일 생성할때마다 토큰이 얼마나 들었는지 llm인지 local 사용 토큰인지 구분해서 처리 하고 기록하게 해야합니다. 타임라인이나 워크플로우에 중요한 지표로 쓸 수 있습니다. init이나 update를 통해 차후 프로젝트 들이 적용될 수 잇어야 합니다.
- dashboard에서 timeline에 플로우가 표시 되려면 실제로 workflow progress에서 진행이 완료 상태여야 표기 되도록 해야합니다.

## 4. 문제 정의

이전 topic에서 dashboard workflow에 optional audit flow surface가 추가되었지만, `pgg-token`과 `pgg-performance`가 정적 workflow 정의나 applicability 값만으로 Overview에 드러나면 사용자는 실제로 audit가 수행된 것으로 오해한다. optional audit는 core workflow가 아니며, flow 안에서 필요하다고 판단되어 실제 stage evidence가 생긴 경우에만 사용자-facing workflow에 나타나야 한다.

또한 timeline은 작업의 시간 순 evidence를 보여 주는 표면이므로, flow가 단순히 정의되어 있거나 진행 중인 상태만으로 timeline에 완성된 flow처럼 노출되면 workflow 신뢰도가 떨어진다. 사용자는 timeline flow 표시를 실제 workflow progress의 `완료` 상태에 묶길 원한다.

마지막으로 현재 pgg workflow는 각 flow 작업과 파일 생성에 사용된 token 비용을 구조적으로 기록하지 않는다. 이후 dashboard timeline/workflow에서 비용, LLM 사용량, local processing 비용을 지표로 쓰려면 stage별, task별, file artifact별 token usage ledger가 필요하며, 이 계약은 `pgg init`/`pgg update`로 생성되는 후속 프로젝트에도 적용되어야 한다.

## 5. 범위

- dashboard Overview에서 `pgg-token`, `pgg-performance` flow는 실제 실행 evidence가 있을 때만 표시한다.
- optional audit의 실행 evidence는 audit stage의 `stage-started`, `stage-progress`, verified/final `stage-completed`, audit report, audit review, workflow node detail 중 실제 실행을 증명하는 source로 제한한다.
- `Audit Applicability`의 `required` 또는 static flow definition만으로 optional audit flow를 표시하지 않는다.
- dashboard timeline은 workflow progress에서 해당 flow가 `완료`로 계산된 경우에만 flow item을 표시한다.
- `pgg-token`과 `pgg-performance`는 pgg flow 내부에서 필요하다고 판단된 경우에만 열리는 optional audit로 유지한다.
- 각 flow 작업, task completion, file creation/update/delete artifact마다 token usage를 기록하는 계약을 정의한다.
- token usage record는 `source: llm | local`을 구분하고, 가능하면 `input_tokens`, `output_tokens`, `total_tokens`, `estimated`, `provider`, `model`, `artifact_path`, `stage`, `event`를 포함한다.
- LLM token은 provider/model usage metadata가 있을 때 실측값으로 기록하고, local token은 local parser/generator/helper가 계산하거나 추정한 processing token/byte 기반 비용으로 분리 기록한다.
- dashboard workflow/timeline은 token usage summary를 flow/file 단위 주요 지표로 사용할 수 있어야 한다.
- `.codex/add/*`, `.codex/skills/pgg-*`, `.codex/sh/*.sh`, core templates/update path에 새 계약이 반영되어 `pgg init` 또는 `pgg update` 이후 프로젝트에도 같은 산출물 구조가 생겨야 한다.

## 6. 제외 범위

- optional audit를 모든 topic에서 mandatory stage로 바꾸는 작업.
- token 비용을 외부 billing API와 정산하는 기능.
- provider별 가격표 관리 또는 금액 환산 UI.
- dashboard 전체 timeline redesign.
- archive된 topic을 active로 되돌리는 작업.

## 7. 제약 사항

- 사용자-facing flow status는 `시작 전`, `진행 중`, `추가 진행`, `완료` 네 상태 계약을 유지한다.
- optional audit flow는 core workflow 순서에 항상 끼워 넣지 않는다. 실제 실행 evidence가 없는 경우 숨김 상태가 기본이다.
- `required` applicability는 audit 필요성의 판단 결과이지 실행 완료 증거가 아니다.
- timeline 표시 조건은 workflow progress의 완료 계산과 같아야 하며, partial artifact나 draft/reviewed frontmatter만으로 완료 처리하지 않는다.
- token usage 기록은 전체 문서 전문 복사나 prompt 전문 저장을 기본값으로 삼지 않는다. metrics, source, artifact ref 중심으로 기록한다.
- current-project verification contract가 manual이면 후속 QA에서 임의 framework command를 공식 검증으로 추론 실행하지 않는다.

## 8. 기준안

| 항목 | 기준안 | 상태 |
|---|---|---|
| Optional audit visibility | `pgg-token`, `pgg-performance`는 실제 실행 evidence가 있을 때만 Overview에 표시 | resolved |
| Applicability handling | `required`는 표시 evidence가 아니라 audit 필요성 판단값 | resolved |
| Optional audit use | Performance/token은 flow 안에서 필요하다고 판단될 때만 사용 | resolved |
| Timeline visibility | workflow progress가 `완료`인 flow만 timeline flow item으로 표시 | resolved |
| Progress completion | verified/final completion evidence 또는 stage commit/archive/later-flow evidence 기준 | resolved |
| Token record scope | flow 작업, task completion, file artifact 생성/수정/삭제 단위 기록 | resolved |
| Token source | `llm`과 `local`을 분리하고 추정값은 `estimated: true`로 표시 | resolved |
| Future propagation | `pgg init`/`pgg update` generated asset에도 계약 반영 | resolved |

## 9. 성공 기준

- 실행 evidence가 없는 topic에서는 Overview에 `pgg-token`과 `pgg-performance` flow가 나타나지 않는다.
- `Audit Applicability`가 `required`여도 실제 audit stage/report/review/history evidence가 없으면 optional audit flow를 표시하지 않는다.
- 실제 `pgg-token` 또는 `pgg-performance`가 실행된 topic에서는 Overview가 해당 flow를 표시하고 공통 4상태 모델로 상태를 계산한다.
- dashboard timeline은 workflow progress에서 `완료`로 계산된 flow만 표시한다.
- 진행 중, 추가 진행, 시작 전 상태의 flow가 timeline에서 완료 flow처럼 보이지 않는다.
- 각 pgg flow 작업과 file artifact 생성/수정/삭제는 token usage record를 남길 수 있는 schema와 저장 위치를 갖는다.
- token usage는 `llm`과 `local` source를 구분하며, 실측/추정 여부가 기록된다.
- dashboard workflow/timeline model은 flow/file 단위 token summary를 읽을 수 있다.
- `pgg init` 또는 `pgg update` 후 생성되는 프로젝트도 optional audit visibility와 token usage 기록 계약을 유지한다.

## 10. Audit Applicability

- `pgg-token`: `required` | workflow 자산, state handoff, generated 문서 구조, token usage 기록 계약을 함께 바꾸는 topic이다.
- `pgg-performance`: `not_required` | dashboard 표시 조건과 token metrics 계약이 핵심이며 별도 성능 민감 runtime path나 선언된 performance verification contract는 없다.

## 11. Git Publish Message

- title: feat: 2.9.0.audit token metrics
- why: dashboard가 optional audit flow를 실제 실행 evidence가 있을 때만 보여 주고, timeline은 완료된 workflow progress만 표시해야 하며, 각 flow와 file artifact의 llm/local token usage를 후속 프로젝트까지 기록할 수 있어야 한다.
- footer: Refs: dashboard-optional-audit-token-metrics

## 12. 전문가 평가 요약

- 프로덕트 매니저: 이번 요구는 optional audit를 core workflow처럼 상시 노출하지 않도록 제품 의미를 바로잡고, token usage를 운영 지표로 사용할 수 있게 만드는 feature 범위다.
- UX/UI 전문가: Overview와 timeline은 서로 다른 신뢰 신호를 가져야 한다. Overview는 실제 optional audit 실행 여부를 보여 주고, timeline은 완료된 flow만 표시해야 사용자가 진행 중 작업을 완료 이력으로 오해하지 않는다.

## 13. 다음 단계

`pgg-plan`에서 optional audit visibility spec, timeline completion gating spec, token usage ledger schema spec, init/update propagation spec, dashboard token summary ingestion spec으로 분리해 plan/task를 전개한다.
