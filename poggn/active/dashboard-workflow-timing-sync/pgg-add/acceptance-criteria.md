---
pgg:
  topic: "dashboard-workflow-timing-sync"
  stage: "add"
  status: "approved"
  skill: "pgg-add"
  updated_at: "2026-04-28T14:16:49Z"
  archive_type: "fix"
  project_scope: "current-project"
---

# Acceptance Criteria

## AC1. 시작 evidence와 dashboard 상태 동기화

Given topic `state/history.ndjson`에 특정 flow의 `stage-started` 또는 `stage-progress` evidence가 있을 때,
When dashboard가 workflow progress와 current flow를 계산하면,
Then 해당 flow는 시작 전이 아니라 진행 중 또는 추가 진행 상태로 표시된다.

## AC2. 완료 evidence와 dashboard 상태 동기화

Given flow에 verified `stage-completed`, `stage-commit`, archive evidence, 또는 later-flow evidence가 있을 때,
When dashboard overview와 topic detail이 같은 topic을 표시하면,
Then 두 화면은 같은 flow를 완료 상태로 계산한다.

## AC3. 시간 측정 기준 일치

Given flow의 시작 evidence와 완료 evidence가 모두 있을 때,
When dashboard가 duration 또는 elapsed time을 표시하면,
Then 같은 flow의 시작 timestamp와 완료 timestamp를 사용하며 음수, 0으로 고정, wrong-flow 기준 시간 계산이 발생하지 않는다.

## AC4. 시작만 있고 완료가 없는 flow의 경과 시간

Given flow에 시작 evidence는 있지만 완료 evidence가 없을 때,
When dashboard가 duration 또는 elapsed time을 표시하면,
Then 완료 시간처럼 고정하지 않고 진행 중 기준의 elapsed time 또는 명확한 pending duration 상태를 표시한다.

## AC5. wrong-flow routing 방지

Given 이전 flow가 완료되었고 다음 flow가 시작되었거나 추가 요구사항으로 되돌아간 topic이 있을 때,
When dashboard가 current flow와 next flow를 계산하면,
Then 실제 unresolved evidence가 있는 flow를 가리키며 완료된 다른 flow를 현재 flow로 잘못 표시하지 않는다.

## AC6. workflow 시간 소비 원인 분리

Given workflow 진행이 과도하게 오래 걸린다는 사용자 요구가 있을 때,
When pgg-plan이 구현 task를 작성하면,
Then 상태 계산 오류, 불필요한 flow 반복, optional audit 오인, snapshot/build 비용 중 무엇을 측정하거나 제외할지 pass/fail 기준으로 분리한다.

## AC7. optional audit 표시 규칙 유지

Given `pgg-token` 또는 `pgg-performance`가 required 후보 또는 applicability로만 기록되고 실제 실행 evidence가 없을 때,
When dashboard가 workflow progress를 표시하면,
Then optional audit flow를 실제 시작/진행/완료된 flow처럼 표시하지 않는다.

## AC8. 회귀 검증

Given 시작 전, 진행 중, 완료, 추가 진행, wrong-flow routing, duration 계산 fixture가 있을 때,
When core/dashboard workflow model test를 실행하면,
Then 각 fixture의 상태와 시간 계산이 STATE-CONTRACT와 같은 결과로 검증된다.
