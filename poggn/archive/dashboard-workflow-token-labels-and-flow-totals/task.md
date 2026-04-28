---
pgg:
  topic: "dashboard-workflow-token-labels-and-flow-totals"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-28T02:23:46Z"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "3.0.2"
  short_name: "dashboard-totals"
  working_branch: "ai/fix/3.0.2-dashboard-totals"
  release_branch: "release/3.0.2-dashboard-totals"
  project_scope: "current-project"
---

# Task

| Task ID | Spec | Status | Dependencies | Completion Criteria |
|---|---|---|---|---|
| T1 | S1 | done | proposal | Overview와 Timeline token chip label이 `LLM token`, `local token`으로 표시된다. |
| T2 | S2 | done | T1 | Overview는 topic-level tokenUsage 누적 합계를 계속 표시한다. |
| T3 | S3 | done | T1,T2 | Timeline row는 완료 flow별 tokenUsageRecords를 source별로 합산한다. |
| T4 | S1,S2,S3 | done | T1,T2,T3 | dashboard/core test와 dashboard build 검증 결과를 기록한다. |

## Audit Applicability

- `pgg-token`: `required` | dashboard token metric label과 flow-scoped token summary semantics를 수정하는 topic이다.
- `pgg-performance`: `not_required` | 표시와 집계 범위 수정이며 별도 성능 민감 runtime path는 없다.
