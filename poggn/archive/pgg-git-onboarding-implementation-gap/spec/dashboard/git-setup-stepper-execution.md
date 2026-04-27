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
  node_id: "spec-dashboard-git-setup-stepper-execution"
  node_type: "spec"
  label: "spec/dashboard/git-setup-stepper-execution.md"
state:
  summary: "dashboard git setup Stepper를 입력/실행 UI로 승격"
  next: "pgg-code"
---

# Spec: Dashboard Git Setup Stepper Execution

## 목적

project settings `git 정보 추가` modal이 안내만 하는 Stepper에서 실제 git setup 입력, 실행, 검증, 실패 복구를 제공하는 UI로 동작하게 한다.

## 요구사항

1. dashboard API는 project별 git setup 실행 endpoint를 제공해야 한다.
2. endpoint는 core git onboarding engine request/result contract를 사용해야 한다.
3. UI Stepper는 `local`, `fast`, `setup`, `defer` path를 표현해야 한다.
4. Stepper 각 단계는 현재 입력값, 실행 상태, 결과 message, 실패 사유를 보여 줘야 한다.
5. FAST PATH UI는 detected provider/owner/repository/remote URL을 보여 주고 계속 사용 또는 재설정을 선택하게 해야 한다.
6. SETUP PATH UI는 provider, auth method, owner, repository, visibility, create-if-missing, initialize README, default branch, remote URL, push confirmation 입력을 제공해야 한다.
7. auth method 선택지는 HTTPS token, SSH, provider CLI login을 제공하되 unavailable provider CLI는 disabled 또는 설명 상태여야 한다.
8. setup 성공 후 dashboard snapshot은 provider, owner, repository, remote URL, auth method, default branch, setup status/message를 즉시 반영해야 한다.
9. setup 실패 시 retry, 다른 auth method, 나중에 등록 action을 제공해야 한다.
10. live mode가 아니면 setup execution action은 disabled/read-only로 유지해야 한다.
11. ko/en locale에 모든 label, helper text, error/defer/success message를 추가해야 한다.

## 수용 기준

- modal이 `defer`와 `close`만 제공하는 상태에서 벗어난다.
- API endpoint가 core result를 dashboard snapshot update로 연결한다.
- UI compile에서 ProjectSnapshot/model/locale 누락이 없어야 한다.

## 제외

- OAuth browser callback server
- provider별 owner list 실제 network integration test
- dashboard 전역 settings 재설계
