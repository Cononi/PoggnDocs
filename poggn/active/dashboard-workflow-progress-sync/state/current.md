# Current State

## Topic

dashboard-workflow-progress-sync

## Current Stage

pgg-plan

## Goal

`state/history.ndjson` flow evidence와 dashboard project overview workflow progress 상태를 신규 PGG Skill Framework 의도에 맞게 동기화한다.

## Constraints

- project scope: `current-project`
- archive type: `fix`
- version bump: `patch`
- target version: `4.0.1`
- short name: `dashboard-progress-sync`
- working branch: `ai/fix/4.0.1-dashboard-progress-sync`
- release branch: `release/4.0.1-dashboard-progress-sync`

## User Input

- `$pgg-add 현재 history.ndjson 에 생성되는 flow와 dashboard에서 project의 overview에서 워크플로우 프로그래스 상태랑 싱크가 맞지 않는거 같습니다. 그리고 현재 시스템에 바뀐 의도와 dashboard가 다른거 같습니다.`

## Requirements Summary

- dashboard project overview의 workflow progress 상태가 `state/history.ndjson` event 의미와 동기화되어야 한다.
- 신규 PGG Skill Framework의 상태 evidence 규칙이 dashboard overview, topic detail, history timeline에 일관되게 반영되어야 한다.
- optional audit flow는 실제 실행 evidence가 있을 때만 progress에 표시되어야 한다.
- 완료 후 unresolved `requirements-added`/revision은 추가 진행 상태로 드러나야 한다.

## Acceptance Criteria Summary

- 시작/진행 event만 있는 flow는 완료로 표시되지 않는다.
- verified completion, stage commit, archive/later-flow evidence가 있는 flow는 overview와 detail에서 동일하게 완료로 계산된다.
- 완료 후 unresolved 추가 요구사항 event는 추가 진행 상태를 만든다.
- optional audit required applicability만으로 flow를 표시하지 않는다.
- dashboard 문구와 next action은 신규 core flow 의도와 일치한다.
- regression fixture test가 상태 계산을 검증한다.

## Plan Summary

- core status evaluator가 신규 Skill Framework stage/status 표현을 인식하게 한다.
- dashboard workflow model은 stage index가 아니라 trusted completion evidence를 기준으로 완료를 계산한다.
- `stage-started`와 `stage-progress`는 진행 중 evidence이며 완료 evidence가 아니다.
- 완료 후 unresolved `requirements-added`, `updated`, `revised`는 추가 진행 상태로 표시한다.
- optional audit는 actual execution evidence가 있을 때만 workflow progress에 표시한다.
- dashboard snapshot은 CLI로 재생성하고 직접 편집하지 않는다.

## Active Specs

- `pgg-plan/spec/core/status-evaluator-sync.md`
- `pgg-plan/spec/dashboard/workflow-progress-state.md`
- `pgg-plan/spec/testing/progress-fixtures.md`

## Active Tasks

- T1: Core status evaluator 신규 stage/status 계약 테스트
- T2: Dashboard workflow model regression tests
- T3: Core status evaluator implementation
- T4: Dashboard workflow model implementation
- T5: Dashboard snapshot regeneration
- T6: Version verification task
- T7: Full verification

## Approval

- requirementsApproval: `approved-by-auto-on-inference`
- acceptanceCriteriaApproval: `approved-by-auto-on-inference`
- proposalReview: `PASS`, score `92`
- planApproval: `approved-by-auto-on`
- planReview: `PASS`, score `94`
- taskReview: `PASS`, score `95`

## Audit Applicability

- [pgg-token]: not_required | token/handoff 비용 변경 요구가 아니다.
- [pgg-performance]: not_required | 상태 계산과 표시 동기화 버그 수정이며 성능 요구가 없다.

## Changed Files

| CRUD | Path | Reason |
|---|---|---|
| CREATE | `state.json` | 신규 Skill Framework pgg-add state |
| CREATE | `pgg-add/requirements.md` | 요구사항 정리 |
| CREATE | `pgg-add/acceptance-criteria.md` | Acceptance Criteria 초안 |
| CREATE | `metrics/token-usage.jsonl` | token accounting |
| UPDATE | `proposal.md` | compatibility proposal 보강 |
| UPDATE | `reviews/proposal.review.md` | pgg-add review 기록 |
| UPDATE | `state/current.md` | handoff state 보강 |
| UPDATE | `state/history.ndjson` | pgg-add progress/completion evidence |
| CREATE | `pgg-plan/plan.md` | 구현 계획 |
| CREATE | `pgg-plan/task.md` | 2~5분 단위 task |
| CREATE | `pgg-plan/spec/core/status-evaluator-sync.md` | core status 계약 |
| CREATE | `pgg-plan/spec/dashboard/workflow-progress-state.md` | dashboard progress 상태 계약 |
| CREATE | `pgg-plan/spec/testing/progress-fixtures.md` | 회귀 fixture 계약 |
| CREATE | `pgg-plan/reviews/plan.review.md` | plan review |
| CREATE | `pgg-plan/reviews/task.review.md` | task review |

## Next

`pgg-code`

## Git Publish Message

- title: fix: 4.0.1.dashboard progress sync
- why: history.ndjson flow evidence와 dashboard project overview workflow progress가 신규 PGG Skill Framework 상태 계약을 같은 방식으로 해석하게 한다.
- footer: Refs: dashboard-workflow-progress-sync
