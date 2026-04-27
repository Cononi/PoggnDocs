---
pgg:
  topic: "pgg-project-settings-and-git-onboarding"
  stage: "review"
  status: "reviewed"
  score: 95
  updated_at: "2026-04-27T07:00:49Z"
---

# code.review

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 시니어 백엔드 엔지니어 | 95 | core에 git setup state, remote parser, deferred setup helper, snapshot fields를 추가했고 CLI는 localized help와 init checklist, git deferred completion을 같은 contract로 사용한다. 기본값 `origin`/`ai`/`release`도 normalize와 tests로 고정했다. | 없음 |
| 테크 리드 | 94 | dashboard 전역 settings에서 project runtime controls를 제거하고 project detail settings tab으로 이동한 구조가 plan과 맞다. 다만 실제 provider API login/repo creation/push는 credential-dependent manual verification으로 남겨 QA에서 분리 확인해야 한다. | 없음 |

## Residual Risks

- GitHub/GitLab owner 조회, repository 생성, 실제 push는 현재 환경 credentials와 network가 필요해 자동 테스트에서는 parser/deferred/local detection까지만 검증했다.
- dashboard Stepper는 deferred setup과 상태 표시를 먼저 연결했고, provider별 full remote creation wizard는 후속 QA/manual verification 범위에서 실제 credential로 확인해야 한다.
- `pgg git=on` stage commit helper는 실행했지만 topic 시작 전 dirty baseline과 별개인 unrelated worktree 변경이 남아 있어 `publish_blocked`로 commit을 defer했다.

## Verification

- `pnpm build`
- `pnpm test`
- `./.codex/sh/pgg-stage-commit.sh pgg-project-settings-and-git-onboarding implementation ...` -> `publish_blocked`
- `./.codex/sh/pgg-gate.sh pgg-code pgg-project-settings-and-git-onboarding`

## Decision

- pass
