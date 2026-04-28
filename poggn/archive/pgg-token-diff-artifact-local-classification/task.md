---
pgg:
  topic: "pgg-token-diff-artifact-local-classification"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-28T03:08:20Z"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "3.0.4"
  short_name: "token-classification"
  working_branch: "ai/fix/3.0.4-token-classification"
  release_branch: "release/3.0.4-token-classification"
  project_scope: "current-project"
---

# Task

| Task ID | Spec | Status | Dependencies | Completion Criteria |
|---|---|---|---|---|
| T1 | S1 | done | proposal | diff artifact token estimate가 LLM token에 합산되지 않는다. |
| T2 | S1,S2 | done | T1 | diff artifact token estimate가 local token에 합산된다. |
| T3 | S2 | done | T1,T2 | Overview와 Timeline이 같은 diff classification을 사용한다. |
| T4 | S3 | done | T1,T2,T3 | core dist와 dashboard model/test가 동기화된다. |

## Audit Applicability

- `pgg-token`: `required` | token source classification semantics를 수정하는 topic이다.
- `pgg-performance`: `not_required` | file classification 분기 추가이며 별도 성능 민감 path는 없다.
