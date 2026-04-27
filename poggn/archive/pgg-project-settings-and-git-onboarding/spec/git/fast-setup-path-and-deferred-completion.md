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

# Spec S3: Git FAST/SETUP Path And Deferred Completion

## Objective

`pgg init`에서 git을 선택하거나 `pgg git`을 활성화한 뒤 repository 연결을 FAST PATH 또는 SETUP PATH로 안내하고, 사용자가 중간 취소해도 project 생성은 완료되게 한다.

## Requirements

- 초기 진입은 `.git`과 remote origin 감지 결과에 따라 FAST PATH 또는 SETUP PATH를 추천한다.
- FAST PATH는 remote origin URL을 파싱해 provider, owner, repository name을 보여 주고 계속 사용 또는 재설정을 묻는다.
- FAST PATH는 HTTPS token, SSH, provider CLI login 중 가능한 auth method를 선택하게 하고 인증 및 push 가능 여부를 검증한다.
- SETUP PATH는 필요 시 `git init`, provider 선택, auth method 선택, login 검증, owner 후보 조회, repo name 입력, visibility 선택, repo 존재 확인, 생성 여부, README 초기화 여부, remote origin 연결, main branch 설정, 최초 commit, `git push -u origin main`을 단계화한다.
- SETUP PATH에서 remote를 연결할 때 기본 remote name은 manifest git 설정의 `defaultRemote`를 사용하며, 값이 없으면 `origin`을 사용한다.
- git onboarding은 `workingBranchPrefix: ai`, `releaseBranchPrefix: release` 기본값을 보존하고, 사용자가 git tab에서 명시적으로 바꾸기 전에는 변경하지 않는다.
- GitHub/GitLab을 우선 지원하고 `gh`/`glab`이 없으면 provider CLI login 선택지를 disabled 또는 unavailable로 표시한다.
- destructive 또는 irreversible 단계 전에는 사용자 확인을 받는다.
- 모든 입력 단계는 `취소하고 나중에 등록` 경로를 제공한다.
- 중간 취소는 error가 아니라 deferred completion으로 반환한다.

## Deferred Completion Contract

- `pgg init`은 git setup이 deferred여도 `.pgg` project scaffold와 선택한 lang/auto/teams/git mode 저장을 완료한다.
- git mode가 on이고 setup이 끝나지 않은 경우 manifest에는 `setupStatus: deferred`와 마지막 안전 설명을 남긴다.
- dashboard git tab은 deferred 상태를 read-only 안내와 `git 정보 추가` 재개 button으로 보여 준다.
- `pgg git`은 deferred 상태에서 같은 setup engine을 재개한다.
- remote 변경, repo 생성, commit, push가 이미 실행된 뒤 취소하면 결과를 rollback하지 않고 현재 완료/실패 상태를 명확히 기록한다.

## Acceptance Criteria

- 기존 remote가 있으면 FAST PATH가 provider/owner/repo를 파싱해 확인한다.
- remote가 없으면 SETUP PATH가 repository 생성과 remote 연결에 필요한 정보를 단계별로 수집한다.
- auth 실패 시 HTTPS token, SSH, provider CLI login 복구 경로가 표시된다.
- setup 중 취소해도 init 결과는 `created` 또는 동등 완료 상태이며 git setup은 `deferred`로 남는다.
- push 성공 시 git setup은 `configured` 상태가 되고 remote/default branch metadata가 저장된다.
- push 성공 후에도 `defaultRemote`, `workingBranchPrefix`, `releaseBranchPrefix` 기본값은 유지되거나 사용자 입력값으로만 갱신된다.

## Implementation Notes

- core에 git onboarding service를 두고 CLI와 dashboard API가 공유한다.
- provider API 호출이 필요한 owner/repo 조회와 repo 생성은 auth method별 adapter로 분리한다.
- shell publish helper의 remote/auth guardrail은 유지하고, setup engine은 publish 전에 필요한 remote 상태를 준비하는 역할로 둔다.
