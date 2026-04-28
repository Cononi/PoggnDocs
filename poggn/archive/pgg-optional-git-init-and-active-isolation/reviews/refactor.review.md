---
pgg:
  topic: "pgg-optional-git-init-and-active-isolation"
  stage: "refactor"
  status: "reviewed"
  score: 96
  updated_at: "2026-04-28T05:17:51Z"
---

# refactor.review

## 전문가 메모

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 소프트웨어 아키텍트 | 96 | multi-active isolation 평가를 git-on branch 검증, git-off changed path ownership 검증, ownership inversion helper로 분리했다. 기존 status API와 blocker 문구는 유지하면서 분기별 책임이 작아졌다. | 없음 |
| 코드 리뷰어 | 96 | refactor는 함수 추출과 dist 갱신에 한정되어 동작 변경 위험이 낮다. 기존 branch mismatch와 changed-path collision 회귀 테스트가 모두 통과했다. | 없음 |

## 정리 내용

- `buildTopicIsolationIssues`는 git mode 라우팅만 담당하도록 단순화했다.
- `buildGitOnTopicIsolationIssues`는 working branch metadata/current branch mismatch 판단을 전담한다.
- `buildGitOffTopicIsolationIssues`와 `invertChangedFileOwnership`은 state changed files 기반 path collision 판단을 전담한다.

## 검증

- `pnpm --filter @pgg/core build`: pass
- `pnpm --filter @pgg/core test`: pass, 60 tests passed

## 결정

- refactor review: pass
- next: `pgg-qa`
- blocking issues: 없음
