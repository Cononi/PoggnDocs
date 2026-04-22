---
pgg:
  topic: "dashboard-jira-insights-parity"
  stage: "review"
  status: "reviewed"
  score: 95
  updated_at: "2026-04-22T15:02:00Z"
---

# code.review

## Experts

- 시니어 백엔드 엔지니어
- 테크 리드
- 코드 리뷰어

## Score

- 95

## Notes

- dashboard는 `Insights.png`를 기준으로 top global nav, project context sidebar, backlog workspace, insights rail을 갖는 Jira형 shell로 재구성되었다.
- backlog는 기존 project card grid를 dense row surface로 대체했고, current snapshot/recent activity를 그대로 사용해 row metadata와 analytics widget을 계산한다.
- shell state는 localStorage 복원 기반으로 정리되어 selected project, sidebar item, filter, right rail open 상태가 refresh 이후에도 유지된다.
- theme와 locale는 reference parity 기준으로 한 번에 정리되어 dark chrome, blue accent, compact density, locale-only copy 규칙을 같이 맞춘다.
- `pnpm build:dashboard`, `pnpm build`, `pnpm test`가 모두 통과했다.
- residual risk는 dashboard production bundle chunk size warning과 verification contract 미선언에 따른 `manual verification required`다.
