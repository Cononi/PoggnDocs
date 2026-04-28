# Current State

## Topic

dashboard-workflow-progress-sync

## Current Stage

qa

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

- T1: Core status evaluator 신규 stage/status 계약 테스트 - PASS
- T2: Dashboard workflow model regression tests - PASS
- T3: Core status evaluator implementation - PASS
- T4: Dashboard workflow model implementation - PASS
- T5: Dashboard snapshot regeneration - PASS
- T6: Version verification task - PASS
- T7: Full verification - PASS

## Implementation Summary

- core status evaluator가 신규 Skill Framework stage id와 `approved` proposal status를 인식한다.
- bracket audit applicability 형식 `- [pgg-performance]: required | ...`를 파싱한다.
- dashboard workflow progress는 stage index가 아니라 trusted completion evidence로 완료를 계산한다.
- 완료 후 unresolved `requirements-added`는 `updating` 상태로 계산한다.
- optional audit flow는 실제 실행 evidence가 있을 때만 표시된다.
- dashboard snapshot은 CLI로 재생성했으며 generated JSON을 직접 수정하지 않았다.

## Refactor Summary

- `packages/core/src/index.ts`의 stage normalization switch를 `STAGE_NAME_ALIASES`로 분리했다.
- proposal approval status 비교를 `PROPOSAL_APPROVAL_STATUSES` Set으로 중앙화했다.
- dashboard unresolved runtime timestamp 판정을 `runtimeEntryHasUnresolvedTimestamp` helper로 분리했다.
- 동작 변경, Acceptance Criteria 변경, public API 변경, generated Markdown 직접 수정은 없다.

## QA Summary

- source of truth와 generated docs 안정성을 확인했다.
- docs generation은 `node packages/cli/dist/index.js update` 2회, `pnpm build:readme` 2회 모두 PASS다.
- technical checks는 `pnpm build`, `pnpm build:dashboard`, `pnpm test:core`, `pnpm test:dashboard`, `pnpm test`, `pnpm verify:version-history` 모두 PASS다.
- generated Markdown 직접 수정은 없다.
- archive destination은 사전 확인 시 존재하지 않는다.

## Verification Summary

- `node --test scripts/dashboard-history-model.test.mjs`: PASS, 7/7
- `pnpm test:core`: PASS, 65/65
- `pnpm test:dashboard`: PASS, 7/7
- `pnpm test`: PASS
- `pnpm build:dashboard`: PASS, Vite chunk-size warning only
- `pnpm build`: PASS, Vite chunk-size warning only
- `pnpm verify:version-history`: PASS
- `pnpm build:readme`: PASS, 2회 안정성 확인
- pgg-refactor before/after comparison: PASS
- pgg-refactor diff inspection: PASS

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
| UPDATE | `packages/core/src/index.ts` | 신규 Skill Framework status/stage parser 동기화 |
| UPDATE | `packages/core/test/status-analysis.test.mjs` | core regression fixture 추가 |
| UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | evidence-based workflow progress 계산 |
| UPDATE | `scripts/dashboard-history-model.test.mjs` | dashboard workflow progress regression fixture 추가 |
| UPDATE | `apps/dashboard/public/dashboard-data.json` | CLI-generated dashboard snapshot |
| CREATE | `pgg-code/task-results.md` | pgg-code task 결과 |
| CREATE | `pgg-code/verify.md` | 검증 결과 |
| CREATE | `pgg-code/reviews/review-1-spec-compliance.md` | 명세 준수 review |
| CREATE | `pgg-code/reviews/review-2-code-quality.md` | 코드 품질 review |
| UPDATE | `packages/core/src/index.ts` | 동작 보존 stage/status normalization 구조 개선 |
| UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | 동작 보존 runtime predicate 가독성 분리 |
| UPDATE | `packages/core/dist/index.js` | TypeScript build output |
| UPDATE | `packages/core/dist/index.js.map` | TypeScript build output |
| CREATE | `pgg-refactor/refactor-report.md` | refactor 결과 |
| CREATE | `pgg-refactor/before-after.md` | before/after 비교 |
| CREATE | `pgg-refactor/diff-inspection.md` | feature change 금지 diff inspection |
| CREATE | `pgg-refactor/verify.md` | refactor 검증 결과 |
| CREATE | `pgg-refactor/reviews/behavior-preservation.review.md` | 동작 보존 review |
| CREATE | `pgg-refactor/reviews/structure-quality.review.md` | 구조 품질 review |
| CREATE | `qa/report.md` | pgg-qa 최종 report |
| UPDATE | `metrics/token-usage.jsonl` | pgg-qa token accounting |

## Next

`archive`

## Git Publish Message

- title: fix: 4.0.1.dashboard progress sync
- why: history.ndjson flow evidence와 dashboard project overview workflow progress가 신규 PGG Skill Framework 상태 계약을 같은 방식으로 해석하게 한다.
- footer: Refs: dashboard-workflow-progress-sync
