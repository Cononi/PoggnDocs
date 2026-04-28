---
pgg:
  topic: "dashboard-workflow-token-labels-and-flow-totals"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 95
  updated_at: "2026-04-28T02:21:20Z"
  auto_mode: "on"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "3.0.2"
  short_name: "dashboard-totals"
  working_branch: "ai/fix/3.0.2-dashboard-totals"
  release_branch: "release/3.0.2-dashboard-totals"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "dashboard workflow token 지표의 명칭과 flow별 누적/완료 반영 기준을 정리한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

dashboard-workflow-token-labels-and-flow-totals

## 2. 변경 분류

- archive_type: `fix`
- version_bump: `patch`
- target_version: `3.0.2`
- short_name: `dashboard-totals`
- working_branch: `ai/fix/3.0.2-dashboard-totals`
- release_branch: `release/3.0.2-dashboard-totals`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- dashboard에서 workflow의 오버뷰, 타임라인에서 llm 실사용, local 사용이 아닌 llm token, local token 으로 표기해야 합니다.
- dashboard에서 workflow의 오버뷰에서 llm token은 flow마다 진행될때마다 추가되어 총 사용량 표기, local token도 총사용량 표기를 해야합니다.
- dashboard에서 workflow의 타임라인에서 llm token, local token은 각 flow가 완료 될 때마다 측정치를 적용해야 합니다.
- 토큰은 이전 작업에서 진행됐던것 처럼 llm와 local은 전혀 다른 영역입니다.

## 4. 문제 정의

현재 dashboard workflow token 지표는 `LLM 실사용`, `local 사용`처럼 사용량 성격을 설명하는 문구로 표시된다. 하지만 이전 작업에서 확정된 의미는 LLM 생성 산출물 token과 local 처리 token이 서로 다른 영역이라는 점이다. 사용자는 dashboard Overview와 Timeline 모두에서 이를 `llm token`, `local token`이라는 명확한 metric label로 보고 싶어 한다.

또한 Overview는 workflow 전체의 현재 누적치를 보여야 한다. 각 flow가 진행되며 token ledger가 늘어나면 `llm token`과 `local token` 총합도 함께 증가해야 한다. Timeline은 완료 이력 표면이므로 flow가 완료될 때마다 해당 flow에 귀속된 token 측정치를 적용해 표시해야 한다.

## 5. 범위

- dashboard workflow Overview와 Timeline token label을 `LLM token`, `local token`으로 변경한다.
- Korean locale도 `LLM token`, `local token`을 사용한다.
- Overview token total은 topic ledger 전체 기준으로 flow 진행에 따라 누적된 총 사용량을 표시한다.
- Timeline token 값은 완료된 flow row에 귀속된 flow/stage token record만 합산한다.
- LLM token과 local token은 서로 다른 source 영역으로 유지하고 서로 fallback/합산하지 않는다.
- existing token ledger parsing과 artifact fallback semantics는 유지한다.

## 6. 제외 범위

- provider billing API 연동.
- token 가격 환산 UI.
- workflow timeline 전체 redesign.
- 모든 shell/git command 자동 계측 wrapper.
- archived topic을 active로 되돌리는 작업.

## 7. 제약 사항

- Timeline은 완료된 flow만 표시한다는 기존 completion gating을 유지한다.
- Overview는 topic total, Timeline row는 flow-scoped total이라는 차이를 유지한다.
- LLM token은 LLM source record와 artifact fallback 기준만 사용한다.
- local token은 local source record만 사용한다.
- dashboard UI 문구 외 pgg workflow 문서의 기존 용어는 필요한 범위에서만 변경한다.

## 8. 기준안

| 항목 | 기준안 | 상태 |
|---|---|---|
| Label | `LLM 실사용/local 사용` 대신 `LLM token/local token` | resolved |
| Overview total | topic ledger 전체 누적 token summary 표시 | resolved |
| Timeline flow token | 완료된 flow row마다 해당 flow/stage token record 합산 | resolved |
| Source separation | LLM과 local은 서로 다른 metric으로 유지 | resolved |

## 9. 성공 기준

- dashboard Overview chip이 `LLM token`, `local token`으로 표시된다.
- dashboard Timeline chip도 `LLM token`, `local token`으로 표시된다.
- Overview의 LLM/local token은 topic 전체 ledger 누적 합계다.
- Timeline row의 LLM/local token은 완료된 flow에 귀속된 token record만 반영한다.
- LLM token과 local token은 서로 다른 source로 계산되며 local fallback이 LLM에 섞이거나 LLM fallback이 local에 섞이지 않는다.
- core/dashboard regression test 또는 기존 test 갱신으로 flow-scoped token 합산을 검증한다.

## 10. Audit Applicability

- `pgg-token`: `required` | dashboard token metric label과 flow-scoped token summary semantics를 수정하는 topic이다.
- `pgg-performance`: `not_required` | 표시와 집계 범위 수정이며 별도 성능 민감 runtime path는 없다.

## 11. Git Publish Message

- title: fix: 3.0.2.workflow token 표시
- why: dashboard workflow Overview와 Timeline에서 LLM token과 local token을 같은 사용량처럼 보이지 않게 분리 표기하고, Overview는 topic 누적치, Timeline은 완료 flow별 측정치를 보여야 한다.
- footer: Refs: dashboard-workflow-token-labels-and-flow-totals

## 12. 전문가 평가 요약

- 프로덕트 매니저: 사용자는 비용 지표를 billing이 아니라 workflow token metric으로 이해하고 있으므로 label을 `token` 중심으로 바꾸는 것이 정확하다.
- UX/UI 전문가: Overview는 총합, Timeline은 완료 flow별 측정치라는 정보 구조가 명확해야 반복 작업 중 token 증가 흐름을 읽을 수 있다.

## 13. 다음 단계

`pgg-plan`에서 locale label spec, overview total spec, timeline flow-scoped token spec, regression verification spec으로 분리한다.
