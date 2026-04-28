---
pgg:
  topic: "pgg-token-accounting-and-reactflow-retirement"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-28T03:23:52Z"
  archive_type: "fix"
  project_scope: "current-project"
state:
  summary: "토큰 산정 수정과 React Flow 산출물 제거 task를 확정한다."
  next: "pgg-code"
---

# Task

| Task ID | Spec | 작업 | Dependencies | 완료 조건 |
|---|---|---|---|---|
| T1 | S1 | dashboard token aggregation을 실제 usage metadata 우선 계약으로 수정한다. | 없음 | metadata 없는 LLM record와 artifact baseline이 actual LLM 합계에 들어가지 않는다. |
| T2 | S2 | `workflow.reactflow.json` 신규 생성과 필수 artifact 요구를 제거한다. | T1 | new-topic helper와 template이 workflow JSON을 만들지 않고, missing workflow doc이 partial health를 만들지 않는다. |
| T3 | S1, S2 | 회귀 테스트와 pgg implementation 산출물을 갱신한다. | T1, T2 | token usage/status 테스트와 build가 통과하고 implementation diff/index/review가 남는다. |

## Audit Applicability

- `pgg-token`: `required` | token usage 산정과 workflow artifact 제거 검증이 필요하다.
- `pgg-performance`: `not_required` | 성능 민감 변경이 아니다.
