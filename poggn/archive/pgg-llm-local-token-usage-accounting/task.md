---
pgg:
  topic: "pgg-llm-local-token-usage-accounting"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-28T01:56:51Z"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "3.0.1"
  short_name: "llm-accounting"
  working_branch: "ai/fix/3.0.1-llm-accounting"
  release_branch: "release/3.0.1-llm-accounting"
  project_scope: "current-project"
---

# Task

| Task ID | Spec | Status | Dependencies | Completion Criteria |
|---|---|---|---|---|
| T1 | S1 | done | proposal | LLM source record가 metadata 없이 zero total이어도 artifact content token estimate로 LLM 값에 반영된다. |
| T2 | S2 | done | T1 | topic/file summary에서 LLM fallback과 local ledger-only 합산이 분리되고 test가 이를 검증한다. |
| T3 | S3 | done | T1 | state-pack script와 generated template의 token summary가 raw total zero만 사용하지 않는다. |
| T4 | S1,S2,S3 | done | T1,T2,T3 | core test, dashboard build, state-pack smoke check 결과가 기록된다. |

## Audit Applicability

- `pgg-token`: `required` | token usage ledger 해석과 dashboard token summary semantics를 바꾸는 topic이다.
- `pgg-performance`: `not_required` | 집계 로직과 표시 semantics 수정이며 별도 성능 민감 path나 performance contract는 없다.
