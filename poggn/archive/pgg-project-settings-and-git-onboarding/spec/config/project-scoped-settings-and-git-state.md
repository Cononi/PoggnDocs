---
pgg:
  topic: "pgg-project-settings-and-git-onboarding"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-27T06:08:10Z"
  archive_type: "feat"
  project_scope: "current-project"
---

# Spec S2: Project-Scoped Settings And Git State

## Objective

project별 runtime 설정과 git connection 상태를 `.pgg/project.json` 중심으로 일관되게 저장하고 dashboard snapshot/API가 읽을 수 있게 한다.

## Requirements

- `language`, `autoMode`, `teamsMode`, `git.mode`는 project-scoped setting으로 유지한다.
- git connection metadata는 provider, owner, repository, remote name, remote URL, auth method, setup status, visibility, default branch를 표현할 수 있어야 한다.
- 기존 git 기본값은 유지한다: `defaultRemote: origin`, `workingBranchPrefix: ai`, `releaseBranchPrefix: release`.
- git connection metadata를 확장해도 branch prefix와 default remote는 git 설정 영역에서 계속 관리되고, 값이 없을 때 위 기본값으로 normalize된다.
- token 또는 password는 manifest에 저장하지 않는다.
- `setupStatus`는 최소 `none`, `detected`, `configured`, `deferred`, `failed` 또는 동등 상태를 구분해야 한다.
- 기존 manifest schema와 호환되도록 normalize/migration fallback을 제공한다.
- dashboard snapshot의 `ProjectSnapshot`은 git 설정 요약과 disabled/deferred 상태를 표시할 수 있어야 한다.
- `.codex/config.toml`의 multi-agent 값은 teams mode와 계속 동기화된다.

## Acceptance Criteria

- 기존 manifest가 없어도 기본 git state는 안전하게 `off`/`none`으로 normalize된다.
- 기존 manifest가 없어도 `defaultRemote`, `workingBranchPrefix`, `releaseBranchPrefix`는 각각 `origin`, `ai`, `release`로 normalize된다.
- 기존 `.git` 또는 `origin`이 있으면 snapshot에서 git 활성 신호와 remote metadata가 감지된다.
- dashboard와 CLI가 같은 project manifest 값을 source of truth로 사용한다.
- 민감 정보가 `.pgg/project.json`, dashboard snapshot, topic 문서에 저장되지 않는다.

## Implementation Notes

- `packages/core/src/index.ts`의 `ProjectManifest`, `ProjectGitConfig`, `normalizeProjectGitConfig()`를 확장한다.
- `normalizeProjectGitConfig()`의 현재 기본값인 `origin`/`ai`/`release`는 유지한다.
- dashboard model인 `apps/dashboard/src/shared/model/dashboard.ts`의 `ProjectSnapshot`에 git connection summary를 추가한다.
- registry/global config와 project runtime config의 책임을 문서와 타입으로 분리한다.
