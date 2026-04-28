---
pgg:
  topic: "dashboard-workflow-progress-sync"
  stage: "proposal"
  status: "approved"
  skill: "pgg-add"
  score: 92
  updated_at: "2026-04-28T13:21:25Z"
  auto_mode: "on"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "4.0.1"
  short_name: "dashboard-progress-sync"
  working_branch: "ai/fix/4.0.1-dashboard-progress-sync"
  release_branch: "release/4.0.1-dashboard-progress-sync"
  project_scope: "current-project"
state:
  summary: "history.ndjson flow evidence와 dashboard project overview workflow progress 상태를 신규 PGG Skill Framework 의도에 맞게 동기화한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

Dashboard workflow progress sync

## 2. 변경 분류

- archive_type: `fix`
- version_bump: `patch`
- target_version: `4.0.1`
- short_name: `dashboard-progress-sync`
- working_branch: `ai/fix/4.0.1-dashboard-progress-sync`
- release_branch: `release/4.0.1-dashboard-progress-sync`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- `$pgg-add 현재 history.ndjson 에 생성되는 flow와 dashboard에서 project의 overview에서 워크플로우 프로그래스 상태랑 싱크가 맞지 않는거 같습니다. 그리고 현재 시스템에 바뀐 의도와 dashboard가 다른거 같습니다.`

## 4. 문제 정의

topic별 `state/history.ndjson`에 기록되는 flow event와 dashboard project overview의 workflow progress 계산/표시가 같은 상태 계약을 따르지 않는 것으로 보인다.
신규 PGG Skill Framework에서는 flow 상태 evidence가 `시작 전`, `진행 중`, `추가 진행`, `완료`로 계산되어야 하지만, dashboard는 이 의도와 다른 progress 또는 next action을 보여줄 수 있다.

## 5. 기능 목적

dashboard overview, topic detail/history timeline, core status model이 같은 source of truth와 같은 상태 evidence 규칙을 공유하게 만든다.
특히 `stage-started`, `stage-progress`, `requirements-added`, verified `stage-completed`, `stage-commit`, archive/later-flow evidence의 의미를 dashboard가 신규 STATE-CONTRACT와 일치시켜야 한다.

## 6. 포함 범위

- history event stream과 dashboard overview workflow progress 계산 기준 비교
- 신규 PGG Skill Framework core flow와 optional audit 표시 의도 반영
- overview와 topic detail/history timeline의 상태 문구 및 next action 동기화
- representative fixture 기반 regression test 추가 또는 갱신

## 7. 제외 범위

- pgg-add 단계에서 구현 코드, 테스트 코드, generated Markdown 직접 수정
- dashboard 전체 redesign
- 기존 archive history를 destructive하게 재작성하는 migration
- 신규 workflow stage 추가

## 8. Acceptance Criteria 초안

- `stage-started`/`stage-progress`만 있는 flow는 project overview에서 완료가 아니라 진행 중으로 표시된다.
- 완료 evidence가 있는 flow는 overview와 detail에서 동일하게 완료로 계산된다.
- 완료 후 unresolved `requirements-added` 또는 revision event는 추가 진행 상태를 만든다.
- optional audit는 실제 실행 evidence가 있을 때만 dashboard workflow progress에 표시된다.
- dashboard 문구와 next action은 신규 core flow와 조건부 helper flow 의도를 따른다.
- history/progress fixture test가 위 상태를 검증한다.

## 9. Audit Applicability

- [pgg-token]: not_required | token/handoff 비용 변경 요구가 아니라 dashboard 상태 동기화 버그 수정이다.
- [pgg-performance]: not_required | 성능, 처리량, 메모리, 응답 시간 요구가 없다.

## 10. 승인 상태

- requirements: approved by auto-on inference from user report
- acceptance criteria: approved by auto-on inference from user report
- next flow: `pgg-plan`
