---
pgg:
  topic: "dashboard-workflow-progress-sync"
  stage: "add"
  status: "approved"
  skill: "pgg-add"
  updated_at: "2026-04-28T13:21:25Z"
  archive_type: "fix"
  project_scope: "current-project"
---

# Acceptance Criteria

## AC1. history event와 overview progress 상태 동기화

Given topic `state/history.ndjson`에 `stage-started` 또는 `stage-progress`만 있는 flow가 있을 때,
When dashboard project overview가 workflow progress를 계산하면,
Then 해당 flow는 완료가 아니라 진행 중으로 표시된다.

## AC2. 완료 evidence 기준 반영

Given flow의 필수 artifact/review/verification 또는 `stage-commit`, verified/final `stage-completed`, archive/later-flow evidence가 있을 때,
When dashboard project overview와 topic detail이 같은 topic을 표시하면,
Then 두 화면은 같은 flow를 완료 상태로 계산한다.

## AC3. 추가 진행 상태 반영

Given 완료된 flow 뒤에 unresolved `requirements-added` 또는 revision event가 append되었을 때,
When dashboard project overview가 workflow progress를 계산하면,
Then 해당 flow는 완료로 고정되지 않고 추가 진행이 필요한 상태로 표시된다.

## AC4. optional audit 표시 규칙

Given `pgg-token` 또는 `pgg-performance`가 `Audit Applicability`에서 `required`로 표시되어 있지만 실제 실행 evidence가 없을 때,
When dashboard workflow progress를 표시하면,
Then optional audit flow는 실행된 flow처럼 표시되지 않는다.

## AC5. 신규 Skill Framework 의도와 dashboard 문구 일치

Given 신규 PGG Skill Framework의 core flow가 `pgg-add -> pgg-plan -> pgg-code -> pgg-refactor -> pgg-qa`이고 `pgg-performance`가 조건부 helper일 때,
When dashboard project overview가 workflow progress와 next action을 표시하면,
Then UI 문구와 계산 기준은 이 flow 의도를 벗어나지 않는다.

## AC6. 회귀 테스트

Given 대표 history fixture가 시작 전, 진행 중, 추가 진행, 완료, optional audit 미실행 상태를 포함할 때,
When project overview workflow progress model 테스트를 실행하면,
Then 각 fixture의 상태가 STATE-CONTRACT와 같은 결과로 검증된다.
