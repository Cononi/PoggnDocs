---
pgg:
  topic: "dashboard-management-refinement"
  stage: "review"
  status: "reviewed"
  score: 95
  updated_at: "2026-04-23T03:14:53Z"
---

# code.review

## Experts

- 시니어 백엔드 엔지니어
- 테크 리드
- 코드 리뷰어

## Score

- 95

## Notes

- `DashboardApp.tsx`, `DashboardShellChrome.tsx`, store/model 변경으로 top navigation을 `Project`/`Settings` 두 축으로 줄이고 sidebar를 `MANAGEMENT` 아래 `Board`, `Category`, `Report`, `History`로 재정렬했다.
- `ProjectListBoard.tsx`는 delete button, delete confirmation modal, same-category reorder/category move drag-and-drop, current dashboard root delete guard를 추가했다.
- `SettingsWorkspace.tsx`는 page-level save를 제거하고 title/title icon field-level apply, language/theme immediate toggle, system toggle immediate mutation으로 바뀌었다.
- `shared/api/dashboard.ts`, `vite.config.ts`, `packages/core/src/index.ts`는 `axios` client, main settings patch, project delete route, title icon manifest/snapshot projection을 함께 맞췄다.
- `pnpm build`가 통과했다.
- residual risk는 `manual verification required`, history surface가 기존 backlog UI 재사용이라는 점, delete flow가 dev middleware/live API 기준으로만 검증됐다는 점이다.
