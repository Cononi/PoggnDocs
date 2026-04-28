---
pgg:
  topic: "dashboard-workflow-timing-sync"
  stage: "proposal"
  status: "approved"
  skill: "pgg-add"
  score: 93
  updated_at: "2026-04-28T14:16:49Z"
  auto_mode: "on"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "4.0.2"
  short_name: "dashboard-timing-sync"
  working_branch: "ai/fix/4.0.2-dashboard-timing-sync"
  release_branch: "release/4.0.2-dashboard-timing-sync"
  project_scope: "current-project"
state:
  summary: "workflow evidence와 dashboard의 상태, 시간 측정, current/next flow 표시를 같은 기준으로 동기화한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

Dashboard workflow timing sync

## 2. 변경 분류

- archive_type: `fix`
- version_bump: `patch`
- target_version: `4.0.2`
- short_name: `dashboard-timing-sync`
- working_branch: `ai/fix/4.0.2-dashboard-timing-sync`
- release_branch: `release/4.0.2-dashboard-timing-sync`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- `$pgg-add 현재 work flow 진행 방식이 너무 많은 시간을 소비합니다. 그리고 work flow와 dashboard가 완벽히 동기화 되지 않고 있어서 각 flow가 시작되었으나 시작전으로 표기되며, 시작이 완료 되었는데 불구하고 제대로된 시간 측정이 안되고 맞는 flow가 아닙니다.`

## 4. 문제 정의

PGG flow의 실제 실행 evidence와 dashboard 표시 모델이 완전히 동기화되지 않았다.
그 결과 flow가 시작되었는데 시작 전으로 표시되거나, 완료/시작 timestamp가 있어도 duration이 맞지 않거나, dashboard가 실제 진행해야 하는 flow가 아닌 다른 flow를 가리키는 문제가 남아 있다.

## 5. 기능 목적

dashboard overview, topic detail/history timeline, core analyzer가 같은 flow evidence 규칙을 공유하게 한다.
상태와 시간 계산은 flow별 시작/완료 evidence를 기준으로 해야 하며, next/current flow routing은 unresolved evidence가 있는 실제 flow를 가리켜야 한다.

## 6. 포함 범위

- flow 시작/완료 evidence와 dashboard 상태 계산 동기화
- duration 또는 elapsed time 계산 기준 명확화
- current flow와 next flow routing 불일치 재현 및 수정 task 정의
- workflow 시간 소비 원인 측정 task 분리
- optional audit 표시 규칙 회귀 방지
- representative fixture 기반 regression test 추가 또는 갱신

## 7. 제외 범위

- pgg-add 단계에서 구현 코드, 테스트 코드, generated Markdown 직접 수정
- archive history destructive rewrite
- dashboard 전체 redesign
- 신규 core flow 추가

## 8. Acceptance Criteria 초안

- 시작 evidence가 있는 flow는 시작 전으로 표시되지 않는다.
- 완료 evidence가 있는 flow는 overview와 detail에서 동일하게 완료로 계산된다.
- duration은 같은 flow의 start/end evidence를 사용한다.
- 시작만 있고 완료가 없는 flow는 진행 중 elapsed time 또는 pending duration으로 표시된다.
- current/next flow는 실제 unresolved evidence가 있는 flow를 가리킨다.
- workflow 시간 소비 원인이 측정 가능한 task로 분리된다.
- optional audit는 실제 실행 evidence가 있을 때만 표시된다.
- regression fixture가 상태와 시간 계산을 검증한다.

## 9. Audit Applicability

- [pgg-token]: not_required | token/handoff 비용 변경 요구는 아니다.
- [pgg-performance]: required_candidate | workflow 진행 시간이 과도하다는 사용자 요구가 있으므로 pgg-plan에서 cycle time 측정 필요성을 확정해야 한다.

## 10. 승인 상태

- requirements: approved by auto-on inference from user report
- acceptance criteria: approved by auto-on inference from user report
- next flow: `pgg-plan`
