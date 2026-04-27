---
pgg:
  topic: "pgg-git-onboarding-implementation-gap"
  stage: "proposal"
  skill: "pgg-add"
  status: "reviewed"
  score: 96
  updated_at: "2026-04-27T11:21:17Z"
  auto_mode: "on"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "2.6.1"
  short_name: "git-gap"
  working_branch: "ai/fix/2.6.1-git-gap"
  release_branch: "release/2.6.1-git-gap"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "이전 project settings/git onboarding 요구 중 실제 연결/인증/remote/push 실행이 deferred placeholder로 남은 gap을 fix 범위로 확정한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

pgg-git-onboarding-implementation-gap

## 2. 변경 분류

- archive_type: `fix`
- version_bump: `patch`
- target_version: `2.6.1`
- short_name: `git-gap`
- working_branch: `ai/fix/2.6.1-git-gap`
- release_branch: `release/2.6.1-git-gap`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- `$pgg-add test.md 내용중 구현되지 않은 기능들이 있는거 같습니다.`
- `test.md`
  - `pgg 입력시 help 메시지가 나오는데 lang에 따라 어떤 기능인지 설명이 필요 합니다.`
  - `pgg 에서 lang, auth, teams, git 기능이 init으로 생성되는 프로젝트마다 다르게 적용되어야 합니다.`
  - `pgg init시 ai환경 선택 후 lang, auto, teams, git 기능 활성 할건지 인터렉티브 방식으로 체크 리스트를 만들어서 다중 체크 할 수 있게해서 초기 설정에 들어가야 합니다. 그리고 설명도 같이 적여있음 좋겠습니다.`
  - `모든 절차에서는 꼭 사용자가 이해할 수 있는 설명이 있어야 합니다. (lang에 따라 언어가 달라집니다.)`
  - `pgg dashboard에서 설정에서 lang, auto teams, git 설정은 빼주시고 앞으로 project 별로 사이드바에 설정 창이 따로 있고 거기서 설정하도록 해주시기 바랍니다.`
  - `pgg dashboard project 화면에 setting 메뉴 mui의 taps에 기본 탭에 lang, auto, teams 기능 토글 활성을 기존걸 옮겨서 넣어주시기 바랍니다.`
  - `pgg dashboard proejct 화면에 setting 메뉴 mui의 taps에 git 탭에 git 활성 유무 토글이 있고 활성 시 git 정보 추가 하기 버튼이 생기도록 합니다.`
  - `git 탭에 git 활성은 기존 git이 있다면 자동으로 온 상태여야 합니다.`
  - `git 탭에 git 설정 내용을 보여줍니다. 없다면 disabled 상태여야 합니다.`
  - `git 정보 추가 버튼을 누르면 모달창이 나오면 FAST PATH, SETUP PATH 절차를 진행하는데 mui의 stepper를 사용해서 만듭니다.`
  - `git 정보 입력 할때도 FAST PATH, SETUP PATH에서 로그인이나 연동 정보나 git push등 모두 처리가 가능 해야 합니다.`
  - `pgg init시 git에 체크가 되어 있다면 다음 절차에서 github나 gitlab등에 연결 할 수 있도록 리포짓 토리 연결에 필요한 정보를 받아야 합니다.`
  - `pgg init시 git 활성 시 다음 인터렉티브는 FAST PATH, SETUP PATH 로 흘러가야합니다.`
  - `pgg init시 git 활성 시 직후에는 local인지 remote연결인지 선택해야 합니다. local일 경우 git init만 처리합니다.`
  - `FAST PATH: 이미 Git 연결된 경우 remote origin URL 파싱, 사용자 확인, 인증 확인, 인증 실패 시 로그인 처리, push 가능 여부 확인, 변경사항 commit, push`
  - `SETUP PATH: Git 연결이 없거나 새로 설정하는 경우 git init, provider/auth/owner/repo/visibility/create/README/default branch/initial commit/push 절차`
  - `"defaultRemote": "origin", "workingBranchPrefix": "ai", "releaseBranchPrefix": "release"`

## 4. 왜 하는가

- `test.md`의 요구 중 help 설명, init checklist, project-scoped settings UI, 기본 git metadata는 일부 구현되어 있다.
- 그러나 git onboarding의 핵심인 FAST PATH/SETUP PATH 실행 흐름은 현재 코드에서 완성되지 않았다. `pgg git`은 git 활성화 또는 비활성화만 처리하고, 활성화 후 repository 연결은 `deferred` 상태로 남긴다.
- dashboard의 `git 정보 추가` modal은 MUI Stepper를 보여 주지만 provider/auth/owner/repo 입력, remote 설정, 인증 검증, commit/push 실행을 처리하지 않는다.
- 따라서 이전 feature의 미구현 잔여분을 새 기능 추가로 다시 넓히지 않고, 이미 확정된 요구를 실제 동작으로 마감하는 `fix`/`patch` topic으로 다룬다.

## 5. 현재 구현 확인

- `packages/cli/src/index.ts`
  - `printHelp()`는 lang별 설명을 출력한다.
  - `chooseMany()` 기반 checklist는 존재한다.
  - `deferGitSetup()`은 `inspectProjectGitSetup()` 결과를 출력하고 `deferProjectGitSetup()`을 호출하지만 FAST PATH/SETUP PATH 질문이나 실행을 진행하지 않는다.
  - `pgg git --value on`은 `updateProjectGitMode()`만 호출한다.
- `packages/core/src/index.ts`
  - `inspectProjectGitSetup()`, remote URL parser, git setup status metadata, `deferProjectGitSetup()`, `updateProjectGitConnection()`은 존재한다.
  - GitHub/GitLab repository 생성, auth login, owner 후보 조회, remote add/set-url, initial commit, push orchestration을 묶는 실행 API는 확인되지 않는다.
- `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx`
  - project settings `기본`/`git` tab과 `git 정보 추가` modal은 존재한다.
  - Stepper는 안내용이며 `deferGitSetup`과 `close`만 제공한다. 입력 form, 인증/remote/push 실행 action, 실패 복구 step은 없다.
- `apps/dashboard/vite.config.ts`
  - git 관련 API는 branch prefix update와 defer endpoint가 중심이다.
  - setup 실행 endpoint는 확인되지 않는다.
- `apps/dashboard/src/features/settings/SettingsWorkspace.tsx`
  - 전역 settings에서 project runtime toggle은 제거된 상태다.

## 6. 무엇을 할 것인가

- `pgg git`과 `pgg init`의 git 활성 흐름을 같은 git onboarding engine으로 연결한다.
- git 활성 직후 사용자가 `local` 또는 `remote` 연결을 선택하게 한다.
- `local`은 `.git`이 없으면 `git init`만 수행하고 manifest에는 `mode:on`, `setupStatus:configured`, `connectionKind:local` 또는 동등 metadata를 남긴다.
- `remote`는 초기 inspection 결과에 따라 FAST PATH 또는 SETUP PATH로 들어간다.
- FAST PATH는 기존 `origin` URL을 파싱해 provider/owner/repository를 보여 주고 `계속 사용` 또는 `재설정`을 묻는다. 계속 사용 시 인증 가능성, push 가능성, 필요 시 commit/push를 검증한다.
- SETUP PATH는 `.git` 초기화, provider 선택, auth method 선택, 로그인 확인/처리, owner 후보 조회, repository name/visibility/create/README/default branch/remote origin/initial commit/push를 단계적으로 처리한다.
- CLI와 dashboard는 같은 core 실행 결과 contract를 사용한다. dashboard는 MUI Stepper 각 단계에서 입력과 실행 상태를 보여 주고, 실패 시 재시도/다른 auth method/나중에 등록을 제공한다.
- 실제 token 값은 manifest에 저장하지 않는다. manifest에는 provider, owner, repository, remote URL, auth method, setup status, last checked message만 저장한다.
- `취소하고 나중에 등록`은 계속 지원하되, 사용자가 명시적으로 선택한 경우에만 deferred로 남긴다. 단순 활성화 성공 경로가 자동 deferred로 끝나면 안 된다.

## 7. 범위

### 포함

- CLI `pgg init` git 선택 후 local/remote path 선택
- CLI `pgg git` 활성 후 FAST PATH/SETUP PATH 실행
- core git onboarding engine과 결과 contract
- dashboard project settings git modal의 입력/실행 Stepper
- dashboard API endpoint for git setup execution/defer
- GitHub/GitLab remote URL parsing 결과 재사용
- HTTPS token, SSH, provider CLI login 선택/검증 UX
- remote add/set-url, default branch, initial commit 필요 여부, push 가능성 검증
- ko/en 설명 문구와 실패/취소 메시지
- 회귀 테스트와 mock 기반 git/provider command 검증

### 제외

- GitHub/GitLab 외 provider 완전 지원
- 실제 OAuth web flow 또는 외부 secret manager 구축
- 이미 archive된 `pgg-project-settings-and-git-onboarding` topic 재활성화
- publish commit governance 재설계
- dashboard 전역 settings 구조 재변경

## 8. 제약 사항

- project scope는 `current-project`로 제한한다.
- 현재 pgg teams는 `off`이고 `.codex/config.toml`의 `multi_agent=false`와 일치한다.
- 현재 프로젝트의 git mode는 `.pgg/project.json` 기준 `off`다. 이번 proposal은 workflow topic 문서만 만들며 실제 git remote 변경이나 push는 수행하지 않는다.
- git token은 평문으로 `.pgg/project.json`에 저장하지 않는다.
- remote 변경, repository 생성, commit, push처럼 되돌리기 어려운 단계는 실행 전 사용자 확인과 dry-run 가능한 검증 경로를 둔다.
- non-TTY CLI 환경에서는 명시 옵션 없이 interactive git setup을 요구하지 않는다. 실행 불가 시 어떤 flag 또는 dashboard 경로가 필요한지 설명해야 한다.
- provider CLI(`gh`, `glab`)는 설치 여부를 감지하고 없으면 선택지를 비활성화하거나 대체 auth method를 안내한다.
- dashboard live mode가 아니면 setup 실행 action은 disabled/read-only여야 한다.

## 9. auto mode 처리

- poggn auto mode: `on`
- auto mode가 `on`이므로 이번 proposal에서는 미구현 gap을 `fix`로 확정한다.
- `archive_type`: `fix`
- `version_bump`: `patch`
- `target_version`: `2.6.1`
- `branch`: `ai/fix/2.6.1-git-gap`

## 10. 기준안

| 항목 | 기준안 | 상태 |
|---|---|---|
| gap 판단 | 기존 topic의 요구 중 실제 repository 연결/인증/remote/push 실행이 placeholder로 남은 부분을 대상으로 한다. | resolved |
| CLI entrypoint | `pgg init`과 `pgg git`은 동일한 git onboarding engine을 사용한다. | resolved |
| local path | git 활성 직후 local 선택 시 `.git` 초기화만 수행하고 configured local 상태를 저장한다. | resolved |
| FAST PATH | 기존 origin 파싱, 사용자 확인, auth 검증/복구, push 가능성 검증을 수행한다. | resolved |
| SETUP PATH | provider/auth/owner/repo/create/remote/default branch/initial commit/push를 단계적으로 수행한다. | resolved |
| dashboard modal | Stepper가 안내만 하는 UI가 아니라 입력, 실행, 검증, 실패 복구를 제공한다. | resolved |
| defer 처리 | 사용자가 명시적으로 나중에 등록을 선택한 경우에만 deferred completion으로 남긴다. | resolved |
| secret 처리 | token은 manifest에 저장하지 않고 method/status/metadata만 저장한다. | resolved |

## 11. 성공 기준

- `pgg init`에서 git을 선택하면 local 또는 remote 연결 path를 선택할 수 있다.
- `pgg git --value on` 또는 interactive `pgg git`은 단순 deferred가 아니라 FAST PATH/SETUP PATH 실행으로 이어진다.
- 기존 remote origin이 있는 프로젝트는 provider/owner/repository를 보여 주고 계속 사용 또는 재설정을 선택할 수 있다.
- 인증 실패 시 HTTPS token, SSH, provider CLI login 중 가능한 방식으로 복구할 수 있다.
- SETUP PATH는 repository가 없으면 생성 여부를 묻고, remote origin 설정과 initial push까지 처리하거나 사용자가 명시적으로 deferred 처리할 수 있다.
- dashboard `git 정보 추가` modal에서 provider/auth/repository/default branch/push 단계의 입력과 실행 결과를 확인할 수 있다.
- setup 성공 후 `.pgg/project.json`과 dashboard snapshot에 provider, owner, repository, remote URL, auth method, setup status가 반영된다.
- setup 취소는 실패가 아니라 deferred로 저장되고 나중에 CLI 또는 dashboard에서 재개할 수 있다.
- mock 기반 테스트가 FAST PATH, SETUP PATH, local path, deferred path, non-TTY guardrail을 검증한다.

## 12. Audit Applicability

- `pgg-token`: `not_required` | workflow handoff 구조 변경이 아니라 CLI/dashboard git setup 기능 gap 보완이다
- `pgg-performance`: `not_required` | git onboarding은 사용자 주도 setup flow이며 성능 민감 runtime 경로가 아니다

## 13. 전문가 평가 요약

- 프로덕트 매니저: 사용자의 지적은 새 요구가 아니라 기존에 약속된 git onboarding 완성도 gap이다. 실제 setup 실행 없이 deferred만 남는 현재 동작은 성공 기준을 만족하지 못하므로 fix topic으로 분리하는 판단이 맞다.
- UX/UI 전문가: 현재 Stepper는 흐름을 보여 주지만 사용자의 입력과 복구 행동을 받지 않는다. git 연결은 실패 가능성이 높은 작업이므로 단계별 입력, 확인, 재시도, 나중에 등록이 같은 UI 안에 있어야 한다.

## 14. 다음 단계

`pgg-plan`에서 다음 축으로 spec/task를 분해한다.

- core git onboarding engine과 command runner abstraction
- CLI init/git local/remote FAST PATH/SETUP PATH
- dashboard API and MUI Stepper execution flow
- manifest/dashboard snapshot contract
- mock 기반 regression test와 manual verification contract
