---
pgg:
  topic: "pgg-dashboard-flow-token-accounting-enforcement"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 96
  updated_at: "2026-04-28T02:52:18Z"
  auto_mode: "on"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "3.0.3"
  short_name: "dashboard-enforcement"
  working_branch: "ai/fix/3.0.3-dashboard-enforcement"
  release_branch: "release/3.0.3-dashboard-enforcement"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "dashboard가 모든 flow의 LLM token과 local token을 계산해 Overview와 Timeline에 보이도록 강제한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

pgg-dashboard-flow-token-accounting-enforcement

## 2. 변경 분류

- archive_type: `fix`
- version_bump: `patch`
- target_version: `3.0.3`
- short_name: `dashboard-enforcement`
- working_branch: `ai/fix/3.0.3-dashboard-enforcement`
- release_branch: `release/3.0.3-dashboard-enforcement`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- 왜 도대체 llm token과 local token을 계산하지 않죠? 각 flow마다 계산해서 dashboard에서 오버뷰,타임라인에서 분명히 보여줬어야 합니다.
- 앞으로 이후에 생성되는 모든 프로젝트들도 마찬 가지 입니다.
- llm token은 llm과 소통을 통해서 생성해서 전달받은 것들의 모든 토큰이며, local token은 shell, git등과 같은 실행해서 만들어진것 입니다.

## 4. 문제 정의

이전 변경은 dashboard가 token ledger record를 읽고 표시하는 경로를 개선했지만, ledger가 없거나 LLM record가 부족한 flow에서 token을 반드시 계산하도록 보장하지 못했다. 사용자는 flow별 LLM token과 local token이 Overview와 Timeline에 분명히 표시되어야 한다고 요구한다.

정의는 명확하다. LLM token은 LLM과 소통해 생성되고 전달받은 모든 산출물 token이다. local token은 shell, git, build/test, state-pack 같은 local 실행으로 만들어진 token이다. 두 값은 서로 다른 영역이며 dashboard에서 flow별로 계산되어야 한다.

## 5. 범위

- dashboard Overview는 topic 전체 flow 산출물 기준 LLM token 총합과 local 실행 record 총합을 표시한다.
- dashboard Timeline은 완료된 각 flow마다 LLM token과 local token을 계산해 표시한다.
- LLM token은 flow 산출물 file token estimate와 LLM source record artifact estimate를 합산한다.
- local token은 `source: "local"` token usage record만 합산한다.
- token ledger가 부족해도 flow artifact가 있으면 LLM token은 0이 아니라 산출물 estimate로 계산한다.
- 이후 `pgg init`/`pgg update`로 생성되는 프로젝트도 같은 dashboard/core/template semantics를 갖는다.

## 6. 제외 범위

- 외부 provider billing API 연동.
- prompt/response 전문을 ledger에 저장하는 방식.
- shell/git 모든 command를 전역 wrapper로 자동 계측하는 기능.
- 금액 환산 UI.

## 7. 제약 사항

- LLM token과 local token은 서로 합산하지 않는다.
- local token은 LLM artifact fallback으로 증가하면 안 된다.
- Timeline은 완료된 flow만 표시한다는 기존 gating을 유지한다.
- generated template과 현재 프로젝트 source/dist 산출물을 함께 동기화한다.

## 8. 기준안

| 항목 | 기준안 | 상태 |
|---|---|---|
| LLM token | LLM source record + flow 산출물 token estimate | resolved |
| local token | local source record만 합산 | resolved |
| Overview | topic 전체 flow LLM/local 총합 표시 | resolved |
| Timeline | 완료 flow별 LLM/local 측정치 표시 | resolved |
| Future projects | core/template update로 init/update 생성 프로젝트에 전파 | resolved |

## 9. 성공 기준

- token ledger가 없어도 flow 산출물이 있으면 dashboard Timeline row의 LLM token이 계산된다.
- Overview는 topic 전체 LLM token 총합을 flow 산출물 기준으로 계산한다.
- local token은 local record가 없으면 0이며 LLM 산출물 때문에 증가하지 않는다.
- local record가 있으면 해당 flow Timeline row와 Overview total에만 local token으로 반영된다.
- 이후 생성 프로젝트가 같은 core/dashboard model semantics를 사용한다.

## 10. Audit Applicability

- `pgg-token`: `required` | token 계산 semantics와 generated project propagation을 수정하는 topic이다.
- `pgg-performance`: `not_required` | 계산 범위는 snapshot data와 flow artifact 목록이며 별도 runtime performance contract는 없다.

## 11. Git Publish Message

- title: fix: 3.0.3.flow token 계산
- why: dashboard가 ledger record 존재 여부에 의존하지 않고 각 flow의 LLM token과 local token을 계산해 Overview와 Timeline에 명확히 보여야 한다.
- footer: Refs: pgg-dashboard-flow-token-accounting-enforcement

## 12. 전문가 평가 요약

- 프로덕트 매니저: 사용자의 핵심 요구는 표시명보다 계산 보장이다. flow 산출물 기반 LLM token fallback과 local record-only 합산을 제품 규칙으로 고정해야 한다.
- UX/UI 전문가: Overview는 전체 누적, Timeline은 완료 flow별 측정치로 보여야 사용자가 어느 단계에서 token이 늘었는지 읽을 수 있다.

## 13. 다음 단계

`pgg-plan`에서 flow artifact LLM 계산, local record-only 계산, Overview/Timeline summary, generated project propagation spec으로 전개한다.
