---
pgg:
  topic: "pgg-git-onboarding-implementation-gap"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-27T11:24:16Z"
  archive_type: "fix"
  project_scope: "current-project"
reactflow:
  node_id: "spec-cli-init-and-git-onboarding-flow"
  node_type: "spec"
  label: "spec/cli/init-and-git-onboarding-flow.md"
state:
  summary: "CLI init/git local, FAST PATH, SETUP PATH flow"
  next: "pgg-code"
---

# Spec: CLI Init And Git Onboarding Flow

## 목적

`pgg init`에서 git을 선택하거나 `pgg git`을 활성화한 뒤, 단순 deferred 기록이 아니라 local/remote onboarding flow를 진행한다.

## 요구사항

1. `pgg init`에서 checklist에 git이 선택되면 project scaffold 생성 후 git onboarding flow로 이어져야 한다.
2. `pgg git --value on` 또는 interactive `pgg git`은 core git onboarding engine을 호출해야 한다.
3. git 활성 직후 사용자는 `local`, `remote`, `나중에 등록` 중 하나를 선택할 수 있어야 한다.
4. `local` 선택 시 `.git`이 없으면 `git init`만 수행하고 push/remote 질문을 하지 않아야 한다.
5. `remote` 선택 시 기존 origin이 있으면 FAST PATH를 먼저 제안해야 한다.
6. 기존 origin이 없거나 사용자가 reconfigure를 선택하면 SETUP PATH로 이동해야 한다.
7. FAST PATH는 provider/owner/repository 감지 결과를 설명하고 계속 사용 여부를 확인해야 한다.
8. SETUP PATH는 provider, auth method, owner, repository, visibility, create-if-missing, initialize README, default branch, remote, initial commit, push confirmation을 순서대로 받아야 한다.
9. non-TTY 환경에서는 필수 interactive input이 없을 때 어떤 flags 또는 dashboard path가 필요한지 설명하는 error를 반환해야 한다.
10. 모든 prompt와 result message는 project language 또는 init language에 맞춰 ko/en을 제공해야 한다.
11. `취소하고 나중에 등록`은 `deferred` success result로 끝나야 하며 init scaffold를 rollback하지 않아야 한다.

## 수용 기준

- `pgg git --value on`이 자동으로 deferred만 남기는 동작에서 벗어난다.
- CLI output은 setup path, provider, owner, repository, status/message를 JSON 또는 명확한 localized text로 드러낸다.
- non-TTY guardrail이 test 또는 code review에서 확인된다.

## 제외

- 비밀 token 저장
- TTY가 없는 상태에서 임의 default remote 생성
- GitHub/GitLab 외 provider wizard
