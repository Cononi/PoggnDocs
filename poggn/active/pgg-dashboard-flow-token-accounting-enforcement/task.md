---
pgg:
  topic: "pgg-dashboard-flow-token-accounting-enforcement"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-28T02:56:00Z"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "3.0.3"
  short_name: "dashboard-enforcement"
  working_branch: "ai/fix/3.0.3-dashboard-enforcement"
  release_branch: "release/3.0.3-dashboard-enforcement"
  project_scope: "current-project"
---

# Task

| Task ID | Spec | Status | Dependencies | Completion Criteria |
|---|---|---|---|---|
| T1 | S1 | done | proposal | ledger가 없어도 flow artifact token estimate가 LLM token으로 계산된다. |
| T2 | S2 | done | T1 | local token은 `source: "local"` record만 합산하고 artifact estimate로 증가하지 않는다. |
| T3 | S3 | done | T1,T2 | Overview는 topic 전체, Timeline은 완료 flow별 LLM/local token을 표시한다. |
| T4 | S4 | done | T1,T2,T3 | core dist/template과 generated project path에 같은 semantics가 반영된다. |
| T5 | S1,S2,S3,S4 | done | T1,T2,T3,T4 | dashboard/core test와 dashboard build 검증 결과가 기록된다. |

## Audit Applicability

- `pgg-token`: `required` | token 계산 semantics와 generated project propagation을 수정하는 topic이다.
- `pgg-performance`: `not_required` | 계산 범위는 snapshot data와 flow artifact 목록이며 별도 runtime performance contract는 없다.
