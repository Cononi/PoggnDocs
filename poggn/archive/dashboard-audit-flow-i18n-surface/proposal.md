---
pgg:
  topic: "dashboard-audit-flow-i18n-surface"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 94
  updated_at: "2026-04-27T04:40:44Z"
  auto_mode: "on"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "2.4.0"
  short_name: "dashboard-surface"
  working_branch: "ai/feat/2.4.0-dashboard-surface"
  release_branch: "release/2.4.0-dashboard-surface"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "dashboard workflow가 optional audit flow와 pgg lang 기반 i18n 계약을 일관되게 표시하도록 proposal을 확정한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

dashboard audit flow i18n surface

## 2. 변경 분류

- archive_type: `feat`
- version_bump: `minor`
- target_version: `2.4.0`
- short_name: `dashboard-surface`
- working_branch: `ai/feat/2.4.0-dashboard-surface`
- release_branch: `release/2.4.0-dashboard-surface`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- dashboard에서 워크플로우의 flow에서 token이나 performance가 실행 됐다면 token이나 performance도 dashboard project의 워크플로우에 flow상에 표기 해야 합니다.
- 그리고 모든 pgg의 기능은 flow의 기록되는 문서나 내용은 pgg lang에 설정된 언어를 따라가야합니다. 영어면 영어로, 한글이면 한글로 작성 해야 합니다.
- 특정 상태값이나 고정된 값들은 모두 언어 전환이 가능해야 합니다.
- 모든 전환은 i18n에 의해 이루어 집니다.

## 4. 문제 정의

현재 dashboard workflow 모델은 optional audit 중 `performance`만 흐름 정의에 포함하고, `pgg-token` 실행 여부는 workflow flow로 직접 드러나지 않는다. 또한 일부 stage/status/detail 문구와 workflow event 문구가 코드에 하드코딩되어 있어 `pgg lang` 또는 dashboard 언어 전환과 분리될 수 있다.

이 topic은 dashboard project workflow가 실제 실행된 `pgg-token`, `pgg-performance` audit를 core workflow와 같은 flow 표면에 표시하고, pgg가 생성하거나 기록하는 문서/내용 및 dashboard 고정값 표시가 `pgg lang`와 i18n dictionary를 통해 전환되도록 계약을 정렬한다.

## 5. 범위

- `apps/dashboard` workflow/history 모델에 `token` flow를 추가하고 `performance`와 같은 optional audit 표시 규칙을 적용한다.
- `token/report.md`, `reviews/token.review.md`, workflow node stage, `state/history.ndjson` event evidence 중 하나라도 있으면 token flow가 workflow timeline/flow 표면에 나타나야 한다.
- `performance/report.md`, `reviews/performance.review.md`, workflow node stage, `state/history.ndjson` event evidence 중 하나라도 있으면 performance flow가 workflow timeline/flow 표면에 나타나야 한다.
- optional audit flow는 실행 evidence가 없으면 기존처럼 숨겨져야 하며, 실행 evidence가 있으면 core workflow 사이에서 누락 없이 상태를 계산해야 한다.
- pgg generated docs, helper-generated messages, commit/publish message source, state handoff 요약은 `.pgg/project.json`의 `language` 값(`ko` 또는 `en`)을 따라 작성되어야 한다.
- dashboard stage label, flow label, flow status, workflow event 문장, fallback/detail text, 고정 상태값은 `dashboardLocale` 또는 동등 i18n dictionary를 통해 렌더링되어야 한다.

## 6. 제외 범위

- 새로운 언어 추가. 이번 범위는 기존 `ko`, `en` 전환 계약 정렬로 제한한다.
- optional audit를 모든 topic에서 mandatory stage로 바꾸는 동작.
- pgg core workflow 순서 자체 변경.
- 외부 번역 서비스 연동.

## 7. 성공 기준

- token audit가 실행된 topic은 dashboard project workflow에 `Token` flow가 표시되고, 실행되지 않은 topic에서는 표시되지 않는다.
- performance audit가 실행된 topic은 dashboard project workflow에 `Performance` flow가 표시되고, 실행되지 않은 topic에서는 표시되지 않는다.
- token/performance flow의 상태는 공통 4상태 모델(`시작 전`, `진행 중`, `추가 진행`, `완료`)을 같은 evidence 기준으로 계산한다.
- dashboard의 workflow flow label/status/detail/event/fallback 문구가 하드코딩 문자열이 아니라 i18n dictionary 경유로 표시된다.
- pgg lang이 `ko`이면 새로 기록되는 pgg 문서와 workflow 기록 요약은 한글, `en`이면 영어로 작성된다.
- 상태값과 고정값은 저장 원본 enum을 바꾸지 않고 표시 계층에서 지역화한다.

## 8. 구현 방향

- `WorkflowFlowId`에 `token`을 추가하고 workflow definition에 optional `pgg-token` flow를 정의한다.
- `normalizeFlowId`, artifact path pattern, history event flow/stage 해석에서 `token`과 `pgg-token`을 동일 flow로 정규화한다.
- `visibleWorkflowFlows`가 optional audit report, review, workflow node, history event evidence를 모두 실행 증거로 인정하도록 보강한다.
- `historyModel`의 flow labels, detail fallback, event sentences, count labels 등 표시 문자열을 locale dictionary 입력 기반으로 계산하도록 분리한다.
- `dashboardLocale`에 token/performance flow label과 workflow event/fallback/status 문구를 ko/en 모두 추가한다.
- pgg template/helper 생성 문자열 중 새로 다루는 flow 기록 문서는 manifest language를 읽어 ko/en variant를 생성하도록 plan/spec에서 검증 대상을 명시한다.

## 9. Audit Applicability

- `pgg-token`: `required` | workflow 자산, state handoff, generated 문서 언어 계약과 dashboard projection을 함께 점검해야 한다.
- `pgg-performance`: `not_required` | 성능 민감 변경이나 선언된 성능 verification contract는 아직 없다.

## 10. Git Publish Message

- title: feat: 2.4.0.dashboard audit i18n
- why: dashboard workflow가 실행된 token/performance optional audit를 flow로 보여 주고, pgg lang과 dashboard i18n dictionary를 통해 문서 및 고정 표시값 언어를 일관되게 전환해야 한다.
- footer: Refs: dashboard-audit-flow-i18n-surface

## 11. 다음 단계

- `pgg-plan`에서 dashboard workflow 모델, dashboard i18n, pgg language contract를 각각 spec으로 분리한다.
- optional audit evidence fixture와 ko/en locale 전환 검증을 task에 포함한다.
