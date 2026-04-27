---
pgg:
  topic: "pgg-project-settings-and-git-onboarding"
  stage: "review"
  status: "reviewed"
  score: 96
  updated_at: "2026-04-27T07:20:30Z"
---

# refactor.review

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 소프트웨어 아키텍트 | 96 | 전역 settings에서 project runtime 설정을 제거한 뒤 남은 props/state를 삭제해 dashboard global/project settings 책임 경계가 더 명확해졌다. project git setup step 계산도 helper로 분리되어 렌더링 함수의 조건식이 단순해졌다. | 없음 |
| 코드 리뷰어 | 96 | unused `SystemToggle`, legacy mutation props, branch/runtime draft state를 제거해 dead code와 혼동 가능성을 낮췄다. build/test가 통과해 기존 기능 회귀는 발견되지 않았다. | 없음 |

## Cleanup Evidence

- Removed legacy global settings props: `onApplyGitPrefixes`, `onUpdateLanguage`, `onUpdateSystem`
- Removed unused global settings draft state for branch prefix and runtime toggles
- Removed unused `SystemToggle`
- Extracted `isGitConnectionKnown()` and `buildGitSetupSteps()` helpers

## Verification

- `pnpm build`
- `pnpm test`
- `./.codex/sh/pgg-gate.sh pgg-refactor pgg-project-settings-and-git-onboarding`
- `./.codex/sh/pgg-stage-commit.sh pgg-project-settings-and-git-onboarding refactor ...` -> `publish_blocked`

## Residual Risks

- `pgg git=on` refactor commit helper was attempted, but unrelated worktree changes caused a deferred `publish_blocked` result.

## Decision

- pass
