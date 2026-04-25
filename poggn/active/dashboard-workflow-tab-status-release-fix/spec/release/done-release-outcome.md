---
pgg:
  topic: "dashboard-workflow-tab-status-release-fix"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-24T23:52:49Z"
---

# S4. Done Release Outcome

## 목적

Done flow를 release outcome으로 제한하고 실패/차단 상태를 completed와 분리한다.

## Outcome Mapping

- Done completed: QA pass, archive/version 기록, release publish 또는 release-ready evidence가 있다.
- QA failed: qa report가 fail이면 Done completed가 아니다.
- Release blocked: archive/release/publish가 blocker로 종료되면 Done completed가 아니다.
- Publish blocked: git publish가 blocked/not_attempted/failed면 completed와 별도 표시한다.

## 구현 경계

- 대상 후보: `apps/dashboard/src/features/history/historyModel.ts`, `apps/dashboard/src/shared/model/dashboard.ts`, `apps/dashboard/src/shared/utils/dashboard.tsx`, locale dictionary
- source 후보: `qa/report.md`, `version.json`, `poggn/version-history.ndjson`, git publish metadata, `state/history.ndjson`

## Acceptance

- active topic이 QA 전 단계에 있어도 Done completed로 표시되지 않는다.
- QA fail 또는 release blocked 상태는 completed count에 포함되지 않는다.
- archived topic은 version/archive evidence를 통해 Done completed로 표시된다.
