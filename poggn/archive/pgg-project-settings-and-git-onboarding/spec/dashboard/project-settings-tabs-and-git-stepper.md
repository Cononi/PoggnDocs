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

# Spec S4: Dashboard Project Settings Tabs And Git Stepper

## Objective

dashboard 전역 settings에서 project runtime 설정을 제거하고, project detail sidebar 안의 settings 화면으로 `기본`/`git` 탭을 이동한다.

## Requirements

- 전역 settings는 dashboard title/icon/theme/refresh 같은 dashboard-level 설정만 유지한다.
- project detail sidebar에는 `설정` 메뉴가 추가된다.
- project settings는 MUI `Tabs`를 사용하며 초기 탭은 `기본`, `git`이다.
- `기본` 탭은 language, auto mode, teams mode를 편집한다.
- `git` 탭은 git 활성 toggle, setup status, provider/owner/repo/remote/default branch/auth method 요약, branch prefix 편집, `git 정보 추가` button을 제공한다.
- `git` 탭은 `defaultRemote: origin`, `workingBranchPrefix: ai`, `releaseBranchPrefix: release` 기본값을 보여 주고, 값이 없으면 해당 기본값으로 표시한다.
- 기존 `.git` 또는 remote origin이 감지되면 git toggle은 자동 on으로 표시된다.
- 연결 정보가 없거나 deferred 상태면 상세 설정은 disabled/read-only로 보이고 setup/retry button을 제공한다.
- `git 정보 추가` modal은 MUI `Stepper`로 FAST PATH와 SETUP PATH 단계를 표현한다.
- 각 단계에는 lang별 설명과 취소/나중에 등록 action이 있어야 한다.
- live mode가 아니면 mutation UI는 disabled/read-only로 동작한다.

## Acceptance Criteria

- 사용자는 전역 settings에서 lang/auto/teams/git을 더 이상 수정하지 않는다.
- project detail settings `기본` 탭에서 language/auto/teams를 수정할 수 있다.
- project detail settings `git` 탭에서 현재 git 상태를 확인하고 setup modal을 열 수 있다.
- project detail settings `git` 탭에서 default remote와 branch prefix 기본값이 유지된다.
- deferred git state는 실패처럼 보이지 않고 나중에 등록 가능한 상태로 보인다.
- 한국어/영어 locale 문구가 모두 채워진다.

## Implementation Notes

- `apps/dashboard/src/features/settings/SettingsWorkspace.tsx`는 dashboard-level 설정만 남긴다.
- `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx` 또는 신규 feature module에 `ProjectSettingsWorkspace`를 둔다.
- `DashboardApp.tsx`, `dashboardStore.ts`, `dashboardShell.ts`, `DashboardShellChrome.tsx`의 sidebar/routing 상태를 갱신한다.
- MUI Stepper modal은 CLI setup engine과 같은 상태 vocabulary를 사용한다.
