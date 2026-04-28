---
pgg:
  topic: "pgg-optional-git-init-and-active-isolation"
  stage: "review"
  status: "reviewed"
  score: 95
  updated_at: "2026-04-28T04:40:12Z"
---

# proposal.review

## 전문가 메모

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 프로덕트 매니저 | 95 | 요구는 단순 UI 보정이 아니라 git optional product mode 확정, init/dashboard 진입 장벽 제거, 다중 active topic 운영 규칙까지 포함하는 `feat` 범위다. | 없음 |
| UX/UI 전문가 | 95 | 프로젝트 추가 모달은 Linear Stepper로 분리하는 편이 적합하다. git 사용 여부를 먼저 결정하고 선택 결과에 맞는 입력만 보여주면 git init 강제처럼 보이는 문제가 줄어든다. | 없음 |

## 결정

- proposal: approved
- archive_type: `feat`
- version_bump: `minor`
- target_version: `3.1.0`
- short_name: `optional-isolation`
- working_branch: `ai/feat/3.1.0-optional-isolation`
- release_branch: `release/3.1.0-optional-isolation`
- blocking issues: 없음

## 근거

- 현재 core manifest는 `git.mode`를 지원하지만 init/update/dashboard/workflow 문서와 helper가 git-off 정상 경로를 충분히 주요 흐름으로 설명하지 못한다.
- dashboard project add는 `gitMode`를 보낼 수 있으나 입력이 한 화면에 밀집되어 git 사용 여부와 git setup path의 단계적 관계가 약하다.
- 다중 active topic은 git-on일 때 branch isolation, git-off일 때 file ownership/preflight가 각각 필요하다.
