---
pgg:
  topic: "dashboard-jira-insights-parity"
  stage: "review"
  status: "reviewed"
  score: 96
  updated_at: "2026-04-22T14:46:04Z"
---

# proposal.review

## Experts

- 프로덕트 매니저
- UX/UI 전문가
- 도메인 전문가

## Score

- 96

## Attribution

- 프로덕트 매니저: 현재 dashboard의 기본 사용 흐름이 project board browsing에 가깝고, 사용자 요청은 backlog operating workspace 자체를 바꾸는 것이므로 `feat` + `minor` 범위 판단이 적절하다.
- UX/UI 전문가: `Insights.png`의 핵심 구조는 top navigation, left contextual sidebar, center dense list, right analytics rail의 동시 존재이며, 이 4개 축을 명시적으로 proposal 범위에 고정한 점이 중요하다.
- 도메인 전문가: pgg 데이터 모델은 Jira issue 모델과 다르므로 presentation parity를 우선하고 domain data source는 유지하는 기준안이 현실적이며 plan 단계 리스크를 줄인다.

## Notes

- 현재 `ProjectListBoard`의 category grid와 `ProjectDetailWorkspace`의 workflow/detail split가 reference IA와 다르다는 문제 정의가 충분히 구체적이다.
- plan 단계에서는 visual token 변경과 backlog row data mapping을 별도 spec으로 분리해야 구현 복잡도를 관리할 수 있다.
- right insights rail을 기본 노출 panel로 고정한 결정은 이후 responsive 규칙과 chart surface 정의를 함께 다루게 만든다.
