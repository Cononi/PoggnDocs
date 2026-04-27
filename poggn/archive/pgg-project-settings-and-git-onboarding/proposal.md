---
pgg:
  topic: "pgg-project-settings-and-git-onboarding"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 97
  updated_at: "2026-04-27T05:55:43Z"
  auto_mode: "on"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "2.5.0"
  short_name: "project-onboarding"
  working_branch: "ai/feat/2.5.0-project-onboarding"
  release_branch: "release/2.5.0-project-onboarding"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "pgg CLI init/help, 프로젝트별 runtime 설정, dashboard project settings, git repository onboarding을 하나의 project-scoped settings feature로 확정한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

pgg-project-settings-and-git-onboarding

## 2. 변경 분류

- archive_type: `feat`
- version_bump: `minor`
- target_version: `2.5.0`
- short_name: `project-onboarding`
- working_branch: `ai/feat/2.5.0-project-onboarding`
- release_branch: `release/2.5.0-project-onboarding`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- `$pgg-add pgg 변경 사항이 많습니다.`
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
- `pgg init시 git 활성 시 흐름 인터렉티브는 아래와 같습니다. 참고로 pgg git 기능에서 활성 이후도 마찬가지 입니다. 초기 진입시 연결 확인을 통해 1,2번중 선택지로 가게 해야 합니다.`
- `FAST PATH: 이미 Git 연결된 경우 remote origin URL 파싱, repository 확인, 인증 확인, 인증 실패 시 HTTPS Token/SSH/Provider CLI Login, push 가능 여부 확인, 변경사항 commit, git push`
- `SETUP PATH: Git 연결이 없거나 새로 설정하는 경우 git init, GitHub/GitLab 선택, auth method 선택, 로그인 확인/처리, owner 후보 조회, repo name/visibility/create/README 선택, repository 생성, remote origin 연결, main branch, 최초 커밋, git push -u origin main`
- `git 내용 입력중 중간에 취소하고 나중에 등록하도록 할 수 있게 완료 생성 처리하는 것도 포함해주세요.`

## 4. 왜 하는가

- 현재 `pgg` help는 명령과 옵션만 나열하고, 각 기능이 무엇을 하는지 설명하지 않는다. 사용자는 `lang`, `auto`, `teams`, `git`, 향후 `auth`가 어떤 절차와 위험을 갖는지 바로 이해하기 어렵다.
- 현재 `pgg init`은 provider만 interactive로 고르고 `lang`, `auto`, `teams`, `git`은 flag가 없으면 기본값으로 확정한다. 프로젝트마다 다른 운영 모드를 초기 설정에서 명확히 고르는 흐름이 없다.
- 현재 개별 명령 `pgg lang`, `pgg auto`, `pgg teams`, `pgg git`은 단일 선택형으로 동작하지만, init 직후 사용자가 한 번에 project-scoped runtime 기능을 다중 선택하고 설명을 읽는 checklist가 없다.
- 현재 dashboard 전역 `SettingsWorkspace`가 `language`, `autoMode`, `teamsMode`, `gitMode`를 편집한다. 사용자는 project별 설정이어야 하는 항목을 dashboard 전역 설정처럼 오해할 수 있다.
- 현재 project detail 화면은 project metadata를 표시하지만, project sidebar 안의 독립 setting 화면과 MUI Tabs 기반 `기본`/`git` 설정 UI가 없다.
- 현재 git 기능은 publish helper에서 remote가 없으면 `remote_setup_required`, push 인증 실패 시 `auth_required`로 막히는 수준이다. repository 연결, provider 인증, owner/repo 선택, 최초 push를 guided setup으로 처리하지 못한다.
- 따라서 이번 변경은 단순 UI 이동이 아니라 CLI onboarding, manifest contract, dashboard settings IA, git repository setup orchestration을 묶는 `feat`/`minor` 범위가 적절하다.

## 5. 현재 구현 확인

- `packages/cli/src/index.ts`
  `printHelp()`는 usage와 command list만 출력한다. `init`은 provider만 `choose()`로 받고, `lang`, `auto`, `teams`, `git`은 옵션이 없으면 각각 `ko`, `on`, `off`, `off`로 고정한다. 현재 interactive helper는 단일 선택만 지원한다.
- `packages/core/src/index.ts`
  `createProjectManifest()`는 `language`, `autoMode`, `teamsMode`, `git.mode`를 프로젝트 manifest에 저장한다. `updateProjectLanguage()`, `updateProjectAutoMode()`, `updateProjectTeamsMode()`, `updateProjectGitMode()`도 이미 project root 기준으로 동작한다.
- `.pgg/project.json`
  현재 프로젝트는 `language: ko`, `autoMode: on`, `git.mode: off`를 manifest에 갖고 있다. project-scoped 저장 위치는 이미 있으나 init/dashboard UX가 이를 충분히 드러내지 않는다.
- `apps/dashboard/src/features/settings/SettingsWorkspace.tsx`
  현재 전역 dashboard settings의 main/system/git panel 안에 language, auto, teams, git mode 토글과 branch prefix 편집이 섞여 있다.
- `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx`
  현재 project info surface는 provider/language/auto/teams/git mode를 읽기 전용 metric으로 보여 준다. project detail 내부 settings tab이나 git setup modal은 없다.
- `apps/dashboard/src/app/DashboardApp.tsx`
  현재 top-level settings route에서 `SettingsWorkspace`에 `onUpdateLanguage`, `onUpdateSystem`, `onApplyGitPrefixes`를 전달한다. project detail sidebar로 해당 mutation UI를 이동하는 routing/state 변경이 필요하다.
- `apps/dashboard/src/shared/model/dashboard.ts`
  `ProjectSnapshot`에 provider/language/autoMode/teamsMode/gitMode가 존재한다. 그러나 remote provider, owner, repo, auth method, visibility, setup status 같은 git connection state는 없다.
- `.codex/sh/pgg-git-publish.sh`
  publish 단계에서 remote 존재 여부와 push 실패를 감지하지만, remote origin URL 파싱, GitHub/GitLab setup, auth login, owner/repo 조회, repo 생성, 최초 commit/push를 interactive로 안내하지 않는다.

## 6. 무엇을 할 것인가

- `pgg` help를 language-aware 설명형 help로 바꾼다. `pgg lang`, `pgg auto`, `pgg teams`, `pgg git`, `pgg auth` 또는 동등한 인증/연동 기능이 무엇을 하는지 한국어/영어로 설명한다.
- 모든 interactive 절차는 현재 project language 또는 init에서 선택한 language에 맞춰 사용자가 이해할 수 있는 설명을 보여 준다.
- `pgg init`은 AI 환경 선택 후 `lang`, `auto`, `teams`, `git` 활성 여부를 다중 체크 checklist로 받는다. 각 항목에는 짧은 설명을 붙인다.
- init에서 git을 선택한 경우 바로 git repository 연결 단계로 이어진다. 이 흐름은 `pgg git`에서 활성화한 이후에도 같은 engine과 질문 구성을 재사용한다.
- git repository 연결 단계는 중간 취소를 실패로 처리하지 않는다. 사용자가 취소하면 project 생성 또는 설정 저장은 완료하고, git 연결은 `deferred` 상태로 남겨 나중에 dashboard나 `pgg git`에서 다시 이어갈 수 있게 한다.
- project manifest에는 프로젝트마다 lang/auto/teams/git/auth 또는 git connection metadata가 독립적으로 저장된다. 글로벌 사용자 설정과 project runtime 설정을 섞지 않는다.
- dashboard 전역 settings에서는 `lang`, `auto`, `teams`, `git` 설정을 제거한다. 전역 settings는 dashboard title/icon/theme/refresh 같은 dashboard-level 항목 중심으로 남긴다.
- project detail sidebar에 `설정` 메뉴를 추가하고, 그 안에서 MUI `Tabs`를 사용한다.
- project settings의 `기본` tab에는 기존 language 선택과 auto/teams toggle을 옮긴다.
- project settings의 `git` tab에는 git 활성 toggle, git 설정 요약, branch prefix, connection status, `git 정보 추가` button을 둔다.
- 기존 `.git`과 remote origin 또는 manifest git 설정이 감지되면 git 활성 toggle은 자동으로 on 상태로 표시한다.
- git 설정 내용이 없으면 git 상세 설정 영역은 disabled 상태로 보여 주고, 연결을 시작할 수 있는 `git 정보 추가` button만 명확히 둔다.
- `git 정보 추가` modal은 MUI `Stepper`로 FAST PATH와 SETUP PATH를 표현한다.
- FAST PATH는 기존 remote origin URL을 파싱해 provider/owner/repo를 보여 주고, 사용자에게 계속 사용 또는 재설정을 묻는다. 계속 사용하면 HTTPS token, SSH, provider CLI login 순으로 인증 확인과 복구를 진행하고 push 가능 여부를 검증한다.
- SETUP PATH는 `.git` 초기화, provider 선택, auth method 선택, 로그인 확인/처리, owner 후보 조회, repository name/visibility/create/README 선택, remote origin 연결, main branch 설정, 최초 commit 필요 여부 확인, `git push -u origin main`까지 guided로 처리한다.
- GitHub와 GitLab을 우선 지원하고, provider CLI login은 `gh`/`glab` availability를 감지해 가능한 경우에만 제안한다.
- git setup flow의 모든 입력 단계는 `취소하고 나중에 등록` 선택지를 제공한다. 취소 시 이미 생성된 `.pgg` project scaffold와 선택된 lang/auto/teams 값은 유지하고, git metadata에는 `mode: on`, `setupStatus: deferred` 또는 동등 상태와 재개 가능한 마지막 설명을 남긴다.

## 7. 범위

### 포함

- CLI help i18n 및 command 설명 확장
- CLI interactive checklist 입력 컴포넌트 추가
- `pgg init` project-scoped lang/auto/teams/git 초기 설정 UX
- `pgg git` 또는 연결 기능의 FAST PATH/SETUP PATH shared onboarding engine
- project manifest git connection/auth metadata contract 확장
- dashboard 전역 settings에서 project runtime settings 제거
- project detail sidebar의 settings menu 추가
- MUI Tabs 기반 project settings `기본`/`git` tab UI
- git setup modal과 MUI Stepper flow
- GitHub/GitLab remote URL parsing, auth method 선택, owner/repo/visibility/create/README/main branch/initial commit/push flow
- dashboard/API/store/model/locale update와 한국어/영어 설명 문구

### 제외

- GitHub/GitLab 외 provider의 완전 지원
- 외부 secret manager, OAuth web app, hosted backend 인증 서비스
- dashboard 전역 title/icon/theme/refresh 설정 제거
- pgg core workflow stage 계약 자체 변경
- pgg publish commit message governance 재설계
- 이미 archive된 topic의 재활성화

## 8. 제약 사항

- project scope는 `current-project`로 제한한다.
- 현재 pgg teams는 `off`이고 `.codex/config.toml`의 `multi_agent=false`와 일치한다.
- CLI는 non-TTY 환경에서 명시 flag 없이 interactive 질문을 요구하면 기존처럼 설명 가능한 오류를 내야 한다.
- checklist와 stepper 문구는 `ko`/`en` 모두 제공해야 한다.
- git token은 평문으로 manifest에 저장하지 않는다. 저장이 필요하면 OS credential helper 또는 provider CLI/SSH에 위임하고, manifest에는 method/status/remote metadata만 남긴다.
- git setup 명령은 실제 push/commit/remote 변경을 수행하므로 사용자가 선택한 path와 확인 결과를 단계별로 보여 줘야 한다.
- 사용자가 git setup 도중 취소하면 init/update 전체를 rollback하지 않는다. repository 생성, remote 변경, commit, push처럼 되돌리기 어려운 단계는 실행 전 확인을 받고, 실행 전 취소는 no-op deferred completion으로 끝낸다.
- 기존 `.git` 또는 `origin`이 있는 프로젝트는 SETUP PATH보다 FAST PATH를 먼저 제안해야 한다.
- dashboard live mode가 아니면 설정 변경과 git setup 실행 UI는 disabled 또는 read-only로 동작해야 한다.
- branch prefix 편집은 기존 auto mode guardrail과 충돌하지 않게 유지하되, 위치는 project settings git tab으로 옮긴다.

## 9. auto mode 처리

- poggn auto mode: `on`
- auto mode가 `on`이므로 아래 기준안을 proposal 단계에서 확정한다.
- `pgg init`의 기본 language는 기존처럼 `ko`를 추천하지만, checklist 전에 명시적으로 선택하게 한다.
- `auto`는 기본 on, `teams`는 기본 off, `git`은 기존 git/remote 감지 시 on 추천, 감지되지 않으면 off 추천으로 둔다.
- `auth`는 별도 토글보다 git setup 안의 auth method와 login state로 다룬다. 단, help에서는 인증/연동 기능 설명을 제공한다.
- dashboard project settings는 MUI Tabs의 `기본`과 `git` 두 탭으로 시작한다.
- git setup modal은 FAST PATH/SETUP PATH를 같은 Stepper component 안에서 보여 주되, 초기 감지 결과에 따라 시작 path를 결정한다.
- git setup 취소는 `cancelled` error가 아니라 `deferred` completion으로 기록한다. 사용자는 나중에 project settings의 `git 정보 추가` 또는 `pgg git`으로 재개한다.

## 10. 기준안

| 항목 | 기준안 | 상태 |
|---|---|---|
| help 설명 | lang별 command 설명과 기능 요약을 출력한다. | resolved |
| init 설정 | AI 환경 선택 후 lang 선택과 auto/teams/git checklist를 진행한다. | resolved |
| project 설정 저장 | `.pgg/project.json`을 project-scoped source of truth로 유지하고 git connection metadata를 확장한다. | resolved |
| auth 위치 | 별도 독립 토글이 아니라 git setup flow의 auth method/login 단계로 처리한다. | resolved |
| dashboard 전역 settings | lang/auto/teams/git은 제거하고 dashboard-level 설정만 남긴다. | resolved |
| project settings 위치 | project detail sidebar의 `설정` 메뉴로 이동한다. | resolved |
| project settings 기본 tab | language, auto, teams toggle을 제공한다. | resolved |
| project settings git tab | git toggle, git 설정 요약, branch prefix, `git 정보 추가` button을 제공한다. | resolved |
| git 자동 on | `.git`, remote origin, manifest git connection 중 유효 신호가 있으면 on으로 표시한다. | resolved |
| git disabled 상태 | 연결 정보가 없으면 상세 설정은 disabled/read-only로 보이고 setup button을 제공한다. | resolved |
| git setup modal | MUI Stepper로 FAST PATH/SETUP PATH를 안내한다. | resolved |
| FAST PATH | remote origin 파싱, repository 확인, auth 검증/복구, push 가능성 검증, 필요 시 commit/push를 수행한다. | resolved |
| SETUP PATH | git init부터 provider/auth/owner/repo/create/remote/main/initial commit/push까지 수행한다. | resolved |
| git setup 취소 | 입력 중 언제든 취소하고 나중에 등록할 수 있으며, project 생성은 완료되고 git setup은 deferred 상태로 남긴다. | resolved |
| provider | GitHub/GitLab을 우선 지원한다. | resolved |

## 11. 성공 기준

- `pgg` 단독 실행 또는 help 출력에서 각 command가 무엇을 하는지 lang에 맞춰 설명된다.
- `pgg init`에서 provider 선택 뒤 language와 auto/teams/git 기능을 다중 체크로 설정할 수 있고, 선택 결과가 project manifest에 저장된다.
- init에서 git을 선택하면 기존 연결 감지 후 FAST PATH 또는 SETUP PATH로 이어지고 repository 연결에 필요한 정보를 수집한다.
- `pgg git` 활성 이후에도 init과 같은 git setup flow를 재사용한다.
- dashboard 전역 settings에서 lang/auto/teams/git 설정이 사라진다.
- project detail sidebar의 settings 메뉴에서 `기본` tab이 language/auto/teams를 편집한다.
- project settings `git` tab이 git toggle, 현재 설정 요약, disabled state, setup button, branch prefix를 제공한다.
- 기존 `.git`/origin이 있는 프로젝트는 git toggle이 자동 on으로 표시되고 remote provider/owner/repo 정보가 보인다.
- `git 정보 추가` modal이 MUI Stepper로 FAST PATH/SETUP PATH를 진행하고, 인증/remote/push 실패를 사용자가 이해할 수 있는 문구로 설명한다.
- 사용자가 git 정보 입력 중 취소해도 `pgg init` 또는 dashboard 설정 저장은 완료되고, git 설정은 deferred/read-only 안내와 재개 버튼으로 남는다.
- 한국어/영어 locale에서 CLI와 dashboard 설명 문구가 모두 누락 없이 제공된다.

## 12. Audit Applicability

- `pgg-token`: `not_required` | workflow handoff 문서 구조 변경이 아니라 pgg CLI/dashboard 기능 확장이다
- `pgg-performance`: `not_required` | 주된 범위는 onboarding UX와 git setup orchestration이며 성능 민감 경로가 아니다

## 13. 전문가 평가 요약

- 프로덕트 매니저: 사용자의 요구는 pgg runtime 설정을 project별 onboarding으로 명확히 만드는 제품 기능이다. CLI init, help, dashboard project settings, git setup을 한 topic으로 묶고, git setup 취소를 deferred completion으로 처리하는 것이 실제 도입 흐름과 맞다.
- UX/UI 전문가: 전역 settings에서 project runtime toggle을 제거하고 project detail settings로 옮기는 판단이 정보 구조를 단순화한다. MUI Tabs와 Stepper에 `취소하고 나중에 등록` 경로를 명확히 두면 복잡한 git 연결을 부담 없이 시작할 수 있다.

## 14. 다음 단계

`pgg-plan`에서 다음 축으로 spec/task를 분해한다.

- CLI localized help and interactive checklist
- project manifest git connection/auth metadata contract
- shared git onboarding engine for FAST PATH and SETUP PATH
- dashboard global settings cleanup and project settings tabs
- git setup modal Stepper, API/store/model/locale integration
