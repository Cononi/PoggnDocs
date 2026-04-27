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
  node_id: "spec-core-git-onboarding-engine"
  node_type: "spec"
  label: "spec/core/git-onboarding-engine.md"
state:
  summary: "core git onboarding engine과 result contract"
  next: "pgg-code"
---

# Spec: Core Git Onboarding Engine

## 목적

CLI와 dashboard가 같은 git setup semantics를 사용하도록 core에 onboarding engine과 command runner abstraction을 둔다.

## 요구사항

1. core는 `local`, `fast`, `setup`, `deferred`, `failed` 결과를 구분하는 request/result contract를 export해야 한다.
2. engine은 `inspectProjectGitSetup()`과 `parseGitRemoteUrl()`을 재사용해야 한다.
3. command execution은 injectable runner를 사용해야 하며 test는 실제 git/provider command를 실행하지 않아야 한다.
4. local path는 `.git`이 없으면 `git init`만 실행하고 manifest에 local configured 상태를 남겨야 한다.
5. FAST PATH는 existing remote를 파싱하고 provider/owner/repository 확인, auth method validation, push 가능성 validation을 결과로 남겨야 한다.
6. SETUP PATH는 git init, provider, auth method, owner, repository, visibility, README 초기화 여부, default branch, remote origin, initial commit, push 단계를 모델링해야 한다.
7. engine은 remote-impact command 실행 전 confirmation input이 없으면 pending/blocked result를 반환해야 한다.
8. token 값은 result, manifest, snapshot에 저장하지 않아야 한다.
9. setup 성공 시 `updateProjectGitConnection()` 또는 동등 helper로 provider, owner, repository, remote URL, auth method, default branch, setup status/message를 저장해야 한다.
10. setup 취소는 error가 아니라 `deferred` result와 `setupStatus: deferred`로 기록해야 한다.

## 수용 기준

- core test에서 mock runner로 local path, FAST PATH, SETUP PATH, deferred path가 검증된다.
- manifest에는 secret 없이 connection metadata만 남는다.
- CLI/dashboard가 재사용 가능한 exported API가 존재한다.

## 제외

- 실제 OAuth web flow
- GitHub/GitLab 외 provider 완전 지원
- provider network 통합 테스트
