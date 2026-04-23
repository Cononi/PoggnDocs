---
pgg:
  topic: "dashboard-workspace-refinement"
  stage: "review"
  status: "reviewed"
  score: 95
  updated_at: "2026-04-23T08:25:51Z"
---

# code.review

## Experts

- 시니어 백엔드 엔지니어
- 테크 리드
- 코드 리뷰어

## Score

- 95

## Notes

- `packages/core/src/index.ts`, `shared/model`, `shared/utils`, `DashboardApp.tsx`가 함께 바뀌면서 `pggVersion`/`projectVersion` data contract와 dashboard rendering이 end-to-end로 연결됐다.
- `ProjectListBoard.tsx`는 category를 Jira-style column rhythm으로 재구성하고 card-wide click contract를 적용해 별도 open button dependency를 제거했다.
- `ProjectDetailWorkspace.tsx`는 workflow topic sidebar, MUI Tabs, compact initial question card, animated current node/item, table-first report, compact history card, folder tree explorer까지 한 surface로 흡수했다.
- `shared/utils/dashboard.tsx`의 folder tree builder와 preferred artifact selector로 files/report/history modal selection 중복을 줄였다.
- `pnpm --filter @pgg/dashboard build`가 통과했다.
- residual risk는 `manual verification required`, `pgg-performance required` audit 미실행, 그리고 Vite bundle chunk warning이 남아 있다는 점이다.
