---
pgg:
  topic: "dashboard-workflow-timing-sync"
  stage: "plan"
  status: "approved"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-28T14:28:00Z"
  archive_type: "fix"
  project_scope: "current-project"
state:
  summary: "2~5분 단위 dashboard workflow timing sync task"
  next: "pgg-code"
---

# Task

## Task 목록

| Task ID | 예상 시간 | 파일 | 목적 | Acceptance Criteria |
|---|---:|---|---|---|
| T1 | 3분 | `scripts/dashboard-history-model.test.mjs` | dashboard 시작 evidence/current step fixture 추가 | AC1, AC5, AC8 |
| T2 | 4분 | `scripts/dashboard-history-model.test.mjs` | timeline duration fixture 추가 | AC3, AC4, AC8 |
| T3 | 4분 | `apps/dashboard/src/features/history/historyModel.ts` | flow status runtime에서 started/progress evidence를 current로 유지 | AC1, AC2, AC5 |
| T4 | 4분 | `apps/dashboard/src/features/history/historyModel.ts` | elapsed duration helper와 timeline row duration 적용 | AC3, AC4 |
| T5 | 3분 | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | duration fallback locale 추가 | AC3, AC4 |
| T6 | 4분 | `packages/core/test/status-analysis.test.mjs` | core next workflow routing fixture 추가 | AC5, AC8 |
| T7 | 4분 | `packages/core/src/index.ts` | pgg-plan started/completed topic routing 보강 | AC5 |
| T8 | 3분 | `apps/dashboard/public/dashboard-data.json` | dashboard snapshot CLI 재생성 | AC1-AC8 |
| T9 | 3분 | `poggn/active/dashboard-workflow-timing-sync/state.json`, `state/current.md` | version/verification metadata 갱신 | Version Plan |
| T10 | 5분 | verification commands | 전체 검증과 성능 baseline 기록 | AC6, AC8 |

## T1. dashboard 시작 evidence/current step fixture 추가

- 파일: `scripts/dashboard-history-model.test.mjs`
- 코드 작성 지시:
  - `buildWorkflowSteps`를 사용하는 test를 추가한다.
  - fixture history는 add 완료와 plan 시작을 함께 둔다.
  - 예시 event:
    - `{ stage: "proposal", event: "stage-completed", source: "verified:pgg-add", ts: "2026-04-27T12:00:00Z" }`
    - `{ stage: "plan", event: "stage-started", source: "pgg-plan", ts: "2026-04-27T12:01:00Z" }`
  - topic override는 `{ stage: "pgg-plan" }`로 둔다.
  - assertion:
    - add step status는 `completed`
    - plan step status는 `current`
    - plan step status는 `pending`이 아님
- 검증 단계: `node --test scripts/dashboard-history-model.test.mjs`
- 예상 결과: 새 test가 현재 구현에서 실패하거나, 구현 후 PASS한다.
- 실패 시 확인: `normalizeFlowId`, `visibleWorkflowFlows`, `flowActiveTimestamp`, `latestUnresolvedFlowIndex`.

## T2. timeline duration fixture 추가

- 파일: `scripts/dashboard-history-model.test.mjs`
- 코드 작성 지시:
  - `buildTimelineRows` test를 추가한다.
  - fixture history는 plan start `2026-04-27T12:00:00Z`, plan verified completion `2026-04-27T12:07:00Z`를 포함한다.
  - `rows.find((row) => row.id === "plan")`의 `duration`이 `7m`, `7분`, 또는 test에서 정한 deterministic format과 일치해야 한다.
  - `duration`이 `state/history.ndjson:stage-completed`, `recorded`, `release`를 포함하지 않는다고 assert한다.
  - start만 있고 completion이 없는 flow는 timeline row에 포함하지 않거나, workflow step events에서 진행 중 fallback을 표시한다고 명시적으로 assert한다. 완료 timeline은 완료 flow만 표시하는 기존 계약을 유지한다.
- 검증 단계: `node --test scripts/dashboard-history-model.test.mjs`
- 예상 결과: 현재 `duration`이 source label이라 실패하고, T4 구현 후 PASS한다.
- 실패 시 확인: `buildTimelineRows`, `flowTimestampBundle`, `formatTimelineDateLine`.

## T3. flow status runtime 보강

- 파일: `apps/dashboard/src/features/history/historyModel.ts`
- 코드 작성 지시:
  - `flowHasFullCompletionEvidence`는 그대로 trusted completion만 인정한다.
  - `flowActiveTimestamp`에서 `stage-started`, `stage-progress` event의 flow id가 현재 flow와 맞으면 completedAt이 없을 때 active timestamp를 반환한다.
  - `runtimeEntryHasUnresolvedTimestamp`가 later flow evidence만으로 현재 flow의 started evidence를 지우지 않도록, completed evidence가 없는 active flow는 current 후보로 유지한다.
  - stale active timestamp 제거는 완료된 flow에만 적용한다.
- 검증 단계: `node --test scripts/dashboard-history-model.test.mjs`
- 예상 결과: T1 fixture에서 plan이 `current`로 계산된다.
- 실패 시 확인: `completedAt` confidence, `laterFlowHasNewerEvidence`, `effectiveCurrentIndex`.

## T4. elapsed duration helper와 timeline 적용

- 파일: `apps/dashboard/src/features/history/historyModel.ts`
- 코드 작성 지시:
  - `formatWorkflowDuration(startedAt: string | null, endedAt: string | null, language: HistoryLanguage, unavailable: string): string` helper를 추가한다.
  - start/end가 없거나 invalid이면 `unavailable`을 반환한다.
  - end가 start보다 빠르면 `unavailable`을 반환한다.
  - 60초 미만은 `1m` 또는 `1분`으로 올림 처리한다.
  - 60분 미만은 `<N>m` 또는 `<N>분`으로 표시한다.
  - 24시간 미만은 `<H>h <M>m` 또는 `<H>시간 <M>분`으로 표시한다.
  - 24시간 이상은 `<D>d <H>h` 또는 `<D>일 <H>시간`으로 표시한다.
  - `buildTimelineRows`에서 `duration: completedAt.source ?? "recorded"`를 제거하고 `duration: formatWorkflowDuration(timestamps.startedAt.value, completedAt.value, language, dictionary.workflowRecordUnavailable)`를 사용한다.
- 검증 단계: `node --test scripts/dashboard-history-model.test.mjs`
- 예상 결과: T2 fixture가 PASS하고 timeline duration이 source label을 표시하지 않는다.
- 실패 시 확인: UTC timestamp parse, language 분기, dictionary fallback.

## T5. duration fallback locale 추가

- 파일: `apps/dashboard/src/shared/locale/dashboardLocale.ts`
- 코드 작성 지시:
  - 한국어 locale에 `workflowDurationUnavailable: "시간 기록 없음"`을 추가한다.
  - 영어 locale에 `workflowDurationUnavailable: "duration unavailable"`을 추가한다.
  - T4에서 unavailable fallback은 `dictionary.workflowDurationUnavailable ?? dictionary.workflowRecordUnavailable`을 사용한다.
- 검증 단계: `pnpm test:dashboard`
- 예상 결과: locale key 누락 없이 dashboard model test가 PASS한다.
- 실패 시 확인: `DashboardLocale`는 index signature이지만 test dictionary는 Proxy라 key 접근이 문자열로 반환된다.

## T6. core next workflow routing fixture 추가

- 파일: `packages/core/test/status-analysis.test.mjs`
- 코드 작성 지시:
  - `analyzeProjectStatus treats pgg-plan started topics with complete plan artifacts as ready for pgg-code` test를 추가한다.
  - topic files:
    - `proposal.md`
    - `reviews/proposal.review.md`
    - `pgg-plan/plan.md`
    - `pgg-plan/task.md`
    - `pgg-plan/spec/dashboard/timing.md`
    - `pgg-plan/reviews/plan.review.md`
    - `pgg-plan/reviews/task.review.md`
    - `state/current.md` with Current Stage `pgg-plan` and Next `pgg-code`
    - `state/history.ndjson` with pgg-add verified completion and pgg-plan stage-started/stage-progress
  - assertion:
    - `currentStage` is `plan` or `task` only if existing normalization requires task because task artifact exists. The expected value must match the implementation contract.
    - `progressStatus` is `ready`
    - `nextWorkflow` is `pgg-code`
- 검증 단계: `pnpm test:core`
- 예상 결과: status analyzer no longer routes started plan topics back to pgg-plan when plan artifacts are complete.
- 실패 시 확인: `resolveTopicStage`, `resolveMissingArtifactRecommendation`, `STAGE_TO_WORKFLOW`.

## T7. core routing 보강

- 파일: `packages/core/src/index.ts`
- 코드 작성 지시:
  - `resolveTopicStage`가 `state/current.md`의 `pgg-plan`을 읽었고 `pgg-plan/task.md`가 있더라도 status analyzer가 missing plan artifacts를 먼저 검사한 뒤 complete이면 next workflow를 `pgg-code`로 추천하게 유지한다.
  - 필요한 경우 `rawTopicStage === "pgg-plan" && artifacts.hasTask ? "task" : normalizeStageName(topic.stage)` 조건을 주석 없이 더 명확한 helper로 분리한다.
  - `resolveMissingArtifactRecommendation`의 plan artifact list는 이미 `pgg-plan/*` 경로를 포함하므로 경로 이름은 바꾸지 않는다.
- 검증 단계: `pnpm test:core`
- 예상 결과: T6 fixture가 PASS한다.
- 실패 시 확인: proposal approval status, `hasSpec`, `hasPlanReview`, `hasTaskReview`.

## T8. dashboard snapshot CLI 재생성

- 파일: `apps/dashboard/public/dashboard-data.json`
- 코드 작성 지시:
  - 직접 patch하지 않는다.
  - 구현과 test가 PASS한 뒤 `node packages/cli/dist/index.js dashboard` 또는 기존 dashboard snapshot 생성 command를 사용한다.
  - generated diff에 `dashboard-workflow-timing-sync` topic이 포함되면 active topic state가 반영된 결과인지 확인한다.
- 검증 단계: `pnpm build:dashboard`
- 예상 결과: generated dashboard snapshot과 dashboard build가 PASS한다.
- 실패 시 확인: CLI dist가 최신 build인지, 먼저 `pnpm build`가 필요한지.

## T9. version/verification metadata 갱신

- 파일:
  - `poggn/active/dashboard-workflow-timing-sync/state.json`
  - `poggn/active/dashboard-workflow-timing-sync/state/current.md`
- 코드 작성 지시:
  - `currentFlow`를 `pgg-plan`에서 pgg-code 완료 시점에 맞춰 갱신할 수 있도록 pgg-code가 자신의 stage에서 `pggCodeStatus`, `verificationCommands`, `projectVersionUpdated`를 추가한다.
  - version source는 `poggn/version-history.ndjson latest archived version`이므로 pgg-code는 `package.json` version을 수정하지 않는다.
  - `projectVersionUpdated`는 `not_applicable_until_pgg_qa_archive`로 기록한다.
  - `pnpm verify:version-history`가 PASS해야 한다.
- 검증 단계: `pnpm verify:version-history`
- 예상 결과: ledger 보존 검증 PASS, targetVersion `4.0.2`는 QA archive 때 기록할 값으로 유지된다.
- 실패 시 확인: `poggn/version-history.ndjson` 직접 수정 여부, archive helper version metadata.

## T10. 전체 검증과 성능 baseline 기록

- 파일:
  - `poggn/active/dashboard-workflow-timing-sync/pgg-code/verify.md`
  - `poggn/active/dashboard-workflow-timing-sync/pgg-performance/report.md` 또는 `performance/report.md`
- 코드 작성 지시:
  - pgg-code는 다음 명령을 실행하고 결과를 기록한다.
    - `node --test scripts/dashboard-history-model.test.mjs`
    - `pnpm test:core`
    - `pnpm test:dashboard`
    - `pnpm test`
    - `pnpm build:dashboard`
    - `pnpm build`
    - `pnpm verify:version-history`
  - pgg-performance는 required이므로 dashboard model test, dashboard build, full build/test wall-clock 시간을 baseline과 actual로 기록한다.
- 검증 단계: 위 명령 전체 PASS.
- 예상 결과: functional checks PASS, timing metrics가 report에 남는다.
- 실패 시 확인: 첫 실패 명령의 stderr, Vite warning과 실제 실패 구분, duration helper의 locale-dependent assertion.
