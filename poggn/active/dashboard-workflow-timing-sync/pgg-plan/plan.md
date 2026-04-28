---
pgg:
  topic: "dashboard-workflow-timing-sync"
  stage: "plan"
  status: "approved"
  skill: "pgg-plan"
  score: 94
  updated_at: "2026-04-28T14:28:00Z"
  auto_mode: "on"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "4.0.2"
  project_scope: "current-project"
state:
  summary: "dashboard workflow 상태, duration, current/next flow routing을 evidence 기준으로 고정하는 구현 계획"
  next: "pgg-code"
---

# Plan

## 1. 승인된 설계 요약

- topic_name: `dashboard-workflow-timing-sync`
- active path: `poggn/active/dashboard-workflow-timing-sync`
- 사용자 문제: PGG flow가 실제로 시작되었는데 dashboard에서는 시작 전으로 보이고, 시작/완료 timestamp가 있어도 시간 측정이 제대로 표시되지 않으며, current/next flow가 실제 flow와 맞지 않는다.
- 목표: `state/history.ndjson`, topic artifact, workflow node evidence를 같은 source-of-truth로 해석해 dashboard workflow 상태, timeline duration, status analyzer의 next workflow 추천을 동기화한다.
- 승인 상태: `requirementsApproval=approved-by-auto-on-inference`, `acceptanceCriteriaApproval=approved-by-auto-on-inference`, `proposalReview=PASS`.

## 2. Version Metadata

- currentVersion: `4.0.1`
- targetVersion: `4.0.2`
- bumpType: `patch`
- convention: `fix`
- versionReason: workflow와 dashboard 상태/시간/flow routing이 동기화되지 않아 시작 전, 진행 중, 완료, 경과 시간이 사용자-facing dashboard에서 잘못 표시되는 버그 수정이다.
- versionSource: `poggn/version-history.ndjson latest archived version`
- packageJsonVersionObserved: `0.1.0`

## 3. 구현 전략

1. 먼저 `scripts/dashboard-history-model.test.mjs`에 실패하는 회귀 fixture를 추가한다.
2. `apps/dashboard/src/features/history/historyModel.ts`에서 flow별 start/progress/completion evidence를 기준으로 current/updating/pending 상태를 계산하게 보강한다.
3. 같은 파일에서 timeline row `duration`이 source label이 아니라 flow start/end interval을 표시하도록 별도 helper를 추가한다.
4. `packages/core/test/status-analysis.test.mjs`와 `packages/core/src/index.ts`에서 pgg-add 완료 후 pgg-plan 시작 evidence가 있는 active topic의 next workflow가 `pgg-code`로 추천되는지 검증한다.
5. `apps/dashboard/src/shared/locale/dashboardLocale.ts`에 duration fallback 문구를 추가하되, UI redesign은 하지 않는다.
6. dashboard snapshot은 CLI로 재생성하고 직접 patch하지 않는다.
7. version source는 archive helper가 `pgg-qa` PASS 후 `poggn/version-history.ndjson`에 기록하므로, pgg-code에서는 target version metadata와 `pnpm verify:version-history`만 검증한다.

## 4. 검증 전략

- 빠른 회귀: `node --test scripts/dashboard-history-model.test.mjs`
- core 상태 추천: `pnpm test:core`
- dashboard 모델: `pnpm test:dashboard`
- 전체 test: `pnpm test`
- dashboard build: `pnpm build:dashboard`
- 전체 build: `pnpm build`
- version ledger 보존: `pnpm verify:version-history`
- generated docs 안정성: `pnpm build:readme`

## 5. Test Plan

- dashboard workflow model test에 다음 fixture를 추가한다.
- 시작 evidence만 있는 flow: `stage-started`가 있으면 해당 step은 `pending`이 아니라 `current`다.
- 완료된 flow 뒤 다음 flow 시작: 완료된 flow는 `completed`, 다음 flow는 `current`다.
- 완료된 flow 뒤 `requirements-added`: 해당 flow는 `updating`이고 later flow가 있어도 unresolved revision이 사라지지 않는다.
- timeline duration: start `12:00`, complete `12:07`이면 `7m` 계열 문자열을 표시하고 `state/history.ndjson:stage-completed` 같은 source label을 표시하지 않는다.
- 진행 중 duration: start만 있고 complete가 없으면 `진행 중`/`In progress` fallback을 포함하고 완료 duration처럼 고정하지 않는다.
- optional audit required text만 있는 topic은 performance/token step이 visible workflow에 추가되지 않는다.
- core status analyzer test에 pgg-add 완료 후 pgg-plan started/progress가 있는 active topic이 `pgg-code`로 routing되는 fixture를 추가한다.

## 6. 생성할 테스트 목록

- `scripts/dashboard-history-model.test.mjs`
  - `started plan evidence marks plan current instead of pending`
  - `completed add and started plan routes visible current step to plan`
  - `timeline rows render elapsed duration from flow start and completion evidence`
  - `in-progress timeline duration does not use completion source label`
- `packages/core/test/status-analysis.test.mjs`
  - `analyzeProjectStatus treats pgg-plan started topics with complete plan artifacts as ready for pgg-code`
  - `analyzeProjectStatus keeps pgg-plan in progress when required plan artifacts are missing`

## 7. 성공/실패 기준

- PASS: AC1-AC8이 모두 테스트 또는 구현 검증에 연결된다.
- PASS: dashboard timeline duration이 event source string 대신 elapsed interval 또는 진행 중 fallback을 표시한다.
- PASS: pgg-add 완료 후 pgg-plan이 시작된 topic은 plan 산출물이 모두 있으면 `pgg-code`, 산출물이 없으면 `pgg-plan`으로 추천된다.
- PASS: optional audit는 required applicability만으로 visible workflow step에 표시되지 않는다.
- FAIL: `stage-started` evidence가 있는 flow가 `pending` 또는 시작 전으로 남는다.
- FAIL: `duration`이 `state/history.ndjson:*`, `recorded`, `release` 같은 source label로 표시된다.
- FAIL: dashboard snapshot을 손으로 수정한다.

## 8. 경계값/예외/회귀 기준

- timestamp가 invalid이면 duration은 `workflowRecordUnavailable`을 표시한다.
- start가 completion보다 늦으면 음수 duration을 표시하지 않고 unavailable fallback을 표시한다.
- 완료 evidence가 low confidence인 `topic.updatedAt` fallback뿐이면 completed duration으로 사용하지 않는다.
- archive topic은 done flow를 release/archive evidence 기준으로 completed 처리한다.
- optional `pgg-token`, `pgg-performance`는 실제 event/file/node evidence가 있을 때만 dashboard workflow에 표시한다.
- active topic에서 later flow evidence가 더 최신이면 이전 flow의 stale active timestamp는 current로 남지 않는다.

## 9. 성능 기준과 pgg-performance 필요 여부

- pgg-performance: `required`
- 측정 대상: workflow model test 실행 시간, dashboard build 시간, full test/build 시간.
- 지표:
  - `node --test scripts/dashboard-history-model.test.mjs` wall-clock seconds
  - `pnpm test:dashboard` wall-clock seconds
  - `pnpm build:dashboard` wall-clock seconds
- baseline 방법: pgg-code 시작 시 같은 명령을 1회 실행해 `pgg-code/verify.md` 또는 `pgg-performance/report.md`에 기록한다.
- 성공 기준: dashboard model test는 5초 이내, dashboard build는 기존 baseline 대비 20% 초과 증가 없음. 환경 변동으로 초과하면 로그와 원인을 기록하고 functional regression과 분리한다.
- 실패 기준: 새 duration/status fixture 때문에 dashboard model test가 5초를 초과하거나 build 시간이 baseline 대비 20% 초과 증가하고 원인이 이번 변경으로 확인된다.

## 10. 병렬화 가능한 작업

- T1/T2 테스트 추가는 core와 dashboard가 분리되어 병렬화 가능하다.
- T3/T4 dashboard model 구현은 같은 파일을 수정하므로 순차 처리한다.
- T6 core status analyzer 수정은 T3/T4와 병렬 가능하다.
- T8 snapshot regeneration은 구현과 테스트가 PASS한 뒤에만 실행한다.

## 11. 예상 병목

- `apps/dashboard/public/dashboard-data.json`은 generated snapshot이므로 코드 수정 후 CLI로 재생성해야 하고 diff가 클 수 있다.
- duration format은 locale key와 test dictionary fallback을 함께 맞춰야 한다.
- active topic state와 artifact existence를 함께 쓰는 core status analyzer는 fixture가 부족하면 wrong-flow routing을 재현하지 못한다.

## 12. Audit Applicability

- [pgg-token]: not_required | token/handoff 구조 변경은 아니다.
- [pgg-performance]: required | 사용자가 workflow 진행 시간이 과도하다고 보고했으므로 pgg-code 후 duration/status 변경이 test/build 시간에 미치는 영향을 측정해야 한다.
