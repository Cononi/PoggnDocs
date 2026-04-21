---
pgg:
  topic: "dashboard-renewal"
  stage: "review"
  status: "reviewed"
  score: 95
  updated_at: "2026-04-21T16:09:30Z"
---

# code.review

## Experts

- 시니어 백엔드 엔지니어
- 테크 리드
- 코드 리뷰어

## Score

- 95

## Notes

- `packages/core` snapshot이 archive metadata와 artifact summary를 함께 제공하도록 확장되어 active/archive board와 inspector가 snapshot만으로 동작한다.
- dashboard는 `app / features / shared` 구조로 재편되어 `App.tsx` 단일 결합을 해체했고, locale/theme/store/api/helper가 화면 컴포넌트에서 분리되었다.
- 프로젝트 목록은 category column 보드, 상세는 summary/workflow/lifecycle board/inspector 워크스페이스로 재구성되었다.
- active는 workflow lane, archive는 `archive_type` lane으로 분리해 current pgg topic lifecycle을 보드형으로 읽을 수 있게 했다.
- `pnpm --filter @pgg/dashboard build`, `pnpm --filter @pgg/core build`, `pnpm --filter @pgg/cli build`, `pnpm build`, snapshot 재생성이 모두 통과했다.
- dashboard production bundle은 여전히 500kB chunk warning을 남긴다. 기능 blocker는 아니지만 QA에서 성능 residual risk로 확인하는 편이 맞다.
