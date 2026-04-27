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
  node_id: "spec-qa-git-onboarding-verification-contract"
  node_type: "spec"
  label: "spec/qa/git-onboarding-verification-contract.md"
state:
  summary: "git onboarding mock regression과 manual provider QA 계약"
  next: "pgg-code"
---

# Spec: Git Onboarding Verification Contract

## 목적

git onboarding은 실제 provider/network/credential 상태에 영향을 받으므로 자동 검증과 수동 검증의 경계를 명확히 한다.

## 자동 검증 요구사항

1. `pnpm build`가 통과해야 한다.
2. `pnpm test`가 통과해야 한다.
3. core tests는 mock runner로 다음을 검증해야 한다.
   - local path는 `git init`만 실행한다.
   - FAST PATH는 existing origin parsing과 auth/push validation command sequence를 만든다.
   - SETUP PATH는 git init, remote add/set-url, default branch, initial commit, push command sequence를 만든다.
   - deferred path는 setupStatus `deferred`와 localized message를 남긴다.
   - token 값은 manifest/result snapshot에 저장되지 않는다.
4. dashboard build는 model/locale/Stepper state compile safety를 보장해야 한다.
5. pgg gate는 `pgg-code`, `pgg-refactor`, `pgg-qa`에서 통과해야 한다.

## 수동 검증 요구사항

1. GitHub HTTPS token login과 push 가능성은 manual verification으로 기록한다.
2. GitHub SSH auth와 push 가능성은 manual verification으로 기록한다.
3. GitLab provider CLI 또는 SSH/HTTPS path는 환경이 있을 때 manual verification으로 기록한다.
4. 실제 repository creation은 테스트 계정/샌드박스 repo가 있을 때만 수행하고, 없으면 `manual verification required`로 남긴다.
5. destructive command 전 confirmation이 표시되는지 수동 확인한다.

## QA 보고 기준

- 자동 검증 결과와 수동 검증 미수행 사유를 분리한다.
- provider credential 부재는 실패가 아니라 환경 제약으로 기록한다.
- secret 미저장 여부는 manifest inspection 또는 test evidence로 남긴다.

## Audit Applicability

- `pgg-token`: `not_required` | workflow handoff 구조 변경이 아니다
- `pgg-performance`: `not_required` | setup flow이며 성능 민감 runtime 경로가 아니다
