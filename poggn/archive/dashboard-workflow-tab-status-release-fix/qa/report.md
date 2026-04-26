---
pgg:
  topic: "dashboard-workflow-tab-status-release-fix"
  stage: "qa"
  status: "done"
  skill: "pgg-qa"
  score: 97
  updated_at: "2026-04-26T07:11:47Z"
  archive_type: "fix"
  project_scope: "current-project"
reactflow:
  node_id: "qa-report"
  node_type: "review"
  label: "qa/report.md"
state:
  summary: "Workflow tab visual/status/release outcome fixes and refactor were verified; archive is allowed."
  next: "archive"
---

# QA Report

## Test Plan

- Verify that Workflow tab rendering changed toward the `add-img/9.png` reference by source inspection of selected-tab borders, panel connection, and inactive-tab styling.
- Verify that workflow step status no longer completes from partial artifacts, `reviewed`, workflow node presence, or `updatedAt` fallback alone.
- Verify that pgg stage evidence exists for `stage-started`, `stage-progress`, `stage-completed`, and `stage-commit` so dashboard can distinguish `진행 중`, `추가 진행`, and `완료`.
- Verify that Done is completed only by archive/version/release evidence, while publish blocked/failed/not attempted remains blocked rather than completed.
- Verify required audits, build/test/gates, and dashboard snapshot readiness before archive.

## Audit Applicability

- `pgg-token`: `not_required` | handoff token 최적화가 아니라 dashboard tab/status와 pgg evidence contract 정합이 핵심이다.
- `pgg-performance`: `not_required` | UI geometry와 상태 evidence 계산/기록 수정이며 별도 성능 계측이 필요한 데이터 규모 변경은 없다.

## Execution Results

- `pnpm build`
  - pass
  - dashboard, core, cli build succeeded.
  - Vite still reports the existing large chunk warning: `index-BdL1fMkX.js 1,825.39 kB`, but this is not a build failure.
- `pnpm test`
  - pass
  - core regression suite passed: 37 tests, 0 failed.
- `./.codex/sh/pgg-gate.sh pgg-qa dashboard-workflow-tab-status-release-fix`
  - pass
  - QA stage prerequisites are present.
- `git diff --check`
  - pass
  - no whitespace errors in the QA diff.
- source inspection
  - pass
  - `historyModel.ts` completion evidence excludes untrusted `reviewed` status and uses `releaseOutcomeForTopic` for Done completion/blocked decisions.
  - `HistoryWorkspace.tsx` selected tabs use panel background, connected border, bottom mask, and transparent inactive tabs.
  - dashboard flow status no longer treats plain `reviewed` as completed.
- current-project verification contract
  - `manual verification required`
  - No declared current-project verification command exists, so no additional app-specific command was inferred.
- visual reference
  - manual evidence required
  - `add-img/9.png` remains the reference. Browser screenshot automation is not available in this workspace dependency set, so visual parity should be checked manually in the running dashboard.

## Test Evidence

- build: `pnpm build` -> pass
- tests: `pnpm test` -> pass, 37 tests
- gate: `./.codex/sh/pgg-gate.sh pgg-qa dashboard-workflow-tab-status-release-fix` -> `{"gate":"pass","stage":"pgg-qa"}`
- diff hygiene: `git diff --check` -> pass
- source evidence:
  - [historyModel.ts](/config/workspace/poggn-ai/apps/dashboard/src/features/history/historyModel.ts:505)
  - [HistoryWorkspace.tsx](/config/workspace/poggn-ai/apps/dashboard/src/features/history/HistoryWorkspace.tsx:194)
  - [dashboard.tsx](/config/workspace/poggn-ai/apps/dashboard/src/shared/utils/dashboard.tsx:1)
- state evidence: [state/history.ndjson](/config/workspace/poggn-ai/poggn/active/dashboard-workflow-tab-status-release-fix/state/history.ndjson:1)
- refactor evidence: [reviews/refactor.review.md](/config/workspace/poggn-ai/poggn/active/dashboard-workflow-tab-status-release-fix/reviews/refactor.review.md:1)

## Expert Notes

| Expert | Score | Core Judgment | Evidence Checked | Blocking Issue |
|---|---:|---|---|---|
| QA/테스트 엔지니어 | 97 | build, regression tests, pgg gate, source inspection이 통과했고 archive 가능한 상태다. | `pnpm build`, `pnpm test`, `pgg-qa` gate, `git diff --check` | 없음 |
| 코드 리뷰어 | 97 | strict completion, Done release outcome, selected-tab geometry, status helper refactor가 approved spec 범위 안에서 유지된다. | `historyModel.ts`, `HistoryWorkspace.tsx`, `reviews/code.review.md`, `reviews/refactor.review.md` | 없음 |
| SRE / 운영 엔지니어 | 96 | verification contract는 manual이지만 그 제약이 QA에 기록됐고, release/publish blocked 상태를 Done completed와 분리하는 운영 로그 기준이 갖춰졌다. | `.pgg/project.json`, `state/current.md`, `state/history.ndjson`, `pgg-qa` gate | 없음 |

## Decision

pass

## Archive

- archive: allowed
- rollback: none
- blocking issues: none

## Git Publish Message

- title: fix: 2.2.4.워크플로우 상태 표시
- why: Workflow 탭이 add-img/9.png와 다르게 보이고 pgg stage 시작/추가/완료 evidence가 dashboard 상태로 안정적으로 반영되지 않아, 탭 visual과 flow status 기록/계산 및 Done release outcome 표시를 함께 바로잡아야 한다.
- footer: Refs: dashboard-workflow-tab-status-release-fix

## Residual Risks

- Browser screenshot parity against `add-img/9.png` remains manual because no declared verification command or browser automation dependency is available.
- The existing dashboard bundle size warning remains and should be tracked separately from this status/release fix.
