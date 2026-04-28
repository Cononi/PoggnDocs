# Current State

## Topic

dashboard-workflow-timing-sync

## Current Stage

qa

## Goal

workflow evidence와 dashboard의 상태, 시간 측정, current/next flow 표시를 같은 기준으로 동기화한다.

## Constraints

- project scope: `current-project`
- archive type: `fix`
- version bump: `patch`
- target version: `4.0.2`
- short name: `dashboard-timing-sync`
- working branch: `ai/fix/4.0.2-dashboard-timing-sync`
- release branch: `release/4.0.2-dashboard-timing-sync`

## User Input

- `$pgg-add 현재 work flow 진행 방식이 너무 많은 시간을 소비합니다. 그리고 work flow와 dashboard가 완벽히 동기화 되지 않고 있어서 각 flow가 시작되었으나 시작전으로 표기되며, 시작이 완료 되었는데 불구하고 제대로된 시간 측정이 안되고 맞는 flow가 아닙니다.`

## Requirements Summary

- flow가 시작되었으면 dashboard에서 시작 전으로 표시되지 않아야 한다.
- flow 시작/완료 timestamp와 dashboard duration 계산 기준이 같아야 한다.
- dashboard current flow와 next flow는 실제 unresolved evidence가 있는 flow를 가리켜야 한다.
- workflow가 오래 걸리는 원인은 상태 계산 오류, 불필요한 반복, optional audit 오인, generated snapshot/build 비용으로 분리해 측정 가능해야 한다.

## Acceptance Criteria Summary

- 시작 evidence가 있는 flow는 진행 중 또는 추가 진행으로 표시된다.
- 완료 evidence가 있는 flow는 overview와 detail에서 동일하게 완료로 계산된다.
- duration은 같은 flow의 start/end evidence를 사용한다.
- 시작만 있고 완료가 없는 flow는 완료 duration으로 고정되지 않는다.
- current/next flow는 wrong-flow routing을 일으키지 않는다.
- workflow 시간 소비 원인이 측정 가능한 task로 분리된다.
- optional audit는 실제 실행 evidence 없이 표시되지 않는다.
- regression fixture가 상태와 시간 계산을 검증한다.

## Approval

- requirementsApproval: `approved-by-auto-on-inference`
- acceptanceCriteriaApproval: `approved-by-auto-on-inference`
- proposalReview: `PASS`, score `93`
- planApproval: `approved-by-auto-on`
- planReview: `PASS`, score `94`
- taskReview: `PASS`, score `95`

## Plan Summary

- dashboard workflow model은 started/progress evidence를 시작 전으로 표시하지 않는다.
- timeline duration은 evidence source label이 아니라 start/end timestamp interval을 표시한다.
- core status analyzer는 pgg-plan started topic의 artifact completeness를 보고 `pgg-code` 또는 `pgg-plan`으로 routing한다.
- pgg-performance는 required로 기록하고 pgg-code 이후 workflow cycle time과 build/test timing을 측정한다.

## Implementation Summary

- `buildTimelineRows`의 `duration`이 `completedAt.source` 대신 flow start/end timestamp elapsed interval을 표시한다.
- `formatWorkflowDuration`은 invalid timestamp, missing timestamp, negative interval을 unavailable fallback으로 처리한다.
- dashboard model tests는 started flow current 상태, current step routing, elapsed duration, invalid duration fallback, optional audit hidden behavior를 검증한다.
- core status analyzer tests는 complete pgg-plan topic이 `pgg-code`로, incomplete pgg-plan topic이 `pgg-plan`으로 routing되는지 검증한다.
- dashboard snapshot은 `node packages/cli/dist/index.js dashboard --snapshot-only`로 재생성했다.

## Verification Summary

- `node --test scripts/dashboard-history-model.test.mjs`: PASS, 11/11
- `pnpm test:core`: PASS, 67/67
- `pnpm test:dashboard`: PASS, 11/11
- `pnpm test`: PASS
- `pnpm build:dashboard`: PASS, Vite chunk-size warning only
- `pnpm build`: PASS, Vite chunk-size warning only
- `pnpm verify:version-history`: PASS
- `pnpm build:readme`: PASS twice

## Git Result

- pgg-code implementation commit: `ea162b180a34fee79de1675cb9429bb6119a7bbd`
- commit title: `fix: 4.0.2.workflow 시간 측정`

## Performance Summary

- pgg-performance status: `PASS`
- pgg-performance commit: `cb1816496875182ca690265c6003986acae5966c`
- dashboard model test: median `1.625s`, p95 `1.663s`, target `<=5s`
- dashboard test script: median `1.894s`, p95 `2.050s`, target `<=5s`
- dashboard build Vite internal: median `1.02s`, p95 `1.08s`, baseline `1.35s`, max allowed `1.62s`
- performance regression: `not_detected`
- report: `pgg-performance/report.md`

## Refactor Summary

- pgg-refactor status: `PASS`
- pgg-refactor commit: `429db95d61d3cbcc7093d8282fb332328155bea5`
- target: `apps/dashboard/src/features/history/historyModel.ts`
- structure: `topicHasFlowArtifactEvidence` now reuses `flowFiles` and `flowNodes` instead of repeating flow file/node matching logic.
- readability: workflow duration parsing/calculation is separated from locale-specific duration text formatting.
- behavior preservation: before/after `node --test scripts/dashboard-history-model.test.mjs` and `pnpm test:dashboard` both passed 11/11.
- additional verification: `pnpm test`, `pnpm build:dashboard`, `pnpm build`, and `pnpm build:readme` twice passed.
- pgg-performance next: not required; no algorithmic, IO, bundle, cache, or concurrency behavior changed.
- report: `pgg-refactor/report.md`

## QA Summary

- pgg-qa status: `PASS`
- pgg-qa commit: `9c038bf0f7014bb79e8f4c72dcd562bef5f2654d`
- report: `pgg-qa/report.md`
- compatibility report: `qa/report.md`
- source of truth: PASS, TypeScript Skill registry exists and generator output is stable.
- generated docs: PASS, `pnpm build:readme` ran twice and `node packages/cli/dist/index.js update` ran twice with no generated diff.
- technical checks: PASS, `pnpm build`, `pnpm test:core`, `pnpm test:dashboard`, `pnpm test`, `pnpm build:dashboard`, and `pnpm verify:version-history` passed.
- token accounting: PASS, JSONL schema validated and QA records were added.
- archive readiness: PASS, archive destination was absent and remote `origin` was readable.
- next: archive to `poggn/archive/dashboard-workflow-timing-sync`, record version `4.0.2`, publish `release/4.0.2-dashboard-timing-sync`.

## Active Specs

- `pgg-plan/spec/dashboard/flow-evidence-and-routing.md`
- `pgg-plan/spec/dashboard/duration-semantics.md`
- `pgg-plan/spec/core/status-routing-sync.md`
- `pgg-plan/spec/testing/regression-fixtures.md`
- `pgg-plan/spec/performance/workflow-cycle-time.md`

## Active Tasks

- T1: dashboard 시작 evidence/current step fixture 추가
- T2: timeline duration fixture 추가
- T3: flow status runtime 보강
- T4: elapsed duration helper와 timeline 적용
- T5: duration fallback locale 추가
- T6: core next workflow routing fixture 추가
- T7: core routing 보강
- T8: dashboard snapshot CLI 재생성
- T9: version/verification metadata 갱신
- T10: 전체 검증과 성능 baseline 기록

## Audit Applicability

- [pgg-token]: not_required | token/handoff 비용 변경 요구는 아니다.
- [pgg-performance]: required | workflow 진행 시간이 과도하다는 사용자 요구가 있으므로 pgg-code 후 cycle time과 build/test timing을 측정해야 한다.

## Changed Files

| CRUD | Path | Reason |
|---|---|---|
| CREATE | `state.json` | 신규 Skill Framework pgg-add state |
| CREATE | `pgg-add/requirements.md` | 요구사항 정리 |
| CREATE | `pgg-add/acceptance-criteria.md` | Acceptance Criteria 초안 |
| CREATE | `proposal.md` | compatibility proposal |
| CREATE | `reviews/proposal.review.md` | pgg-add review 기록 |
| CREATE | `state/current.md` | 다음 단계 handoff state |
| CREATE | `state/history.ndjson` | pgg-add progress/completion evidence |
| CREATE | `metrics/token-usage.jsonl` | token accounting |
| CREATE | `pgg-plan/plan.md` | 구현 계획 |
| CREATE | `pgg-plan/task.md` | 2~5분 단위 task |
| CREATE | `pgg-plan/spec/dashboard/flow-evidence-and-routing.md` | dashboard 상태 evidence 계약 |
| CREATE | `pgg-plan/spec/dashboard/duration-semantics.md` | duration 계산 계약 |
| CREATE | `pgg-plan/spec/core/status-routing-sync.md` | core routing 계약 |
| CREATE | `pgg-plan/spec/testing/regression-fixtures.md` | regression fixture 계약 |
| CREATE | `pgg-plan/spec/performance/workflow-cycle-time.md` | 성능 측정 기준 |
| CREATE | `pgg-plan/reviews/plan.review.md` | plan review |
| CREATE | `pgg-plan/reviews/task.review.md` | task review |
| UPDATE | `scripts/dashboard-history-model.test.mjs` | dashboard workflow status and duration regression tests |
| UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | elapsed workflow duration formatting |
| UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | duration unavailable locale |
| UPDATE | `packages/core/test/status-analysis.test.mjs` | pgg-plan routing regression tests |
| UPDATE | `apps/dashboard/public/dashboard-data.json` | CLI-generated dashboard snapshot |
| CREATE | `pgg-code/task-results.md` | pgg-code task results |
| CREATE | `pgg-code/verify.md` | verification and performance baseline |
| CREATE | `pgg-code/reviews/review-1-spec-compliance.md` | spec compliance review |
| CREATE | `pgg-code/reviews/review-2-code-quality.md` | code quality review |
| CREATE | `implementation/index.md` | compatibility implementation summary |
| CREATE | `reviews/code.review.md` | compatibility code review summary |
| CREATE | `pgg-performance/report.md` | performance audit report |
| CREATE | `pgg-performance/benchmark-results.json` | machine-readable benchmark summary |
| UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | behavior-preserving helper reuse and duration responsibility split |
| CREATE | `pgg-refactor/report.md` | pgg-refactor report |
| CREATE | `pgg-refactor/before-after.md` | before/after behavior comparison |
| CREATE | `pgg-refactor/diff-inspection.md` | feature-change-free diff inspection |
| CREATE | `reviews/refactor.review.md` | pgg-refactor compatibility review for archive gate |
| CREATE | `pgg-qa/report.md` | final QA matrix report |
| CREATE | `qa/report.md` | archive helper compatibility QA report |

## Next

`pgg-add`

## Git Publish Message

- title: fix: 4.0.2.dashboard timing sync
- why: workflow evidence와 dashboard 상태, 시간 측정, current/next flow 표시가 같은 source-of-truth를 사용하게 한다.
- footer: Refs: dashboard-workflow-timing-sync
