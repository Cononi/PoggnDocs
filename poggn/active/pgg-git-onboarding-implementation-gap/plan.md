---
pgg:
  topic: "pgg-git-onboarding-implementation-gap"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-27T11:24:16Z"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "2.6.1"
  short_name: "git-gap"
  working_branch: "ai/fix/2.6.1-git-gap"
  release_branch: "release/2.6.1-git-gap"
  project_scope: "current-project"
reactflow:
  node_id: "plan"
  node_type: "doc"
  label: "plan.md"
state:
  summary: "git onboarding deferred placeholder gap을 core engine, CLI flow, dashboard Stepper 실행, 검증 계약으로 분해한다."
  next: "pgg-code"
---

# Plan

## 1. 목적

`test.md`와 proposal에서 확인된 git onboarding gap을 실제 동작 가능한 계획으로 분해한다. 현재 구현은 help, checklist, project settings shell, deferred metadata까지는 갖췄지만 `pgg init`/`pgg git`/dashboard에서 FAST PATH와 SETUP PATH를 실행하지 않는다.

이번 plan은 implementation 전에 다음 경계를 고정한다.

- core git onboarding engine과 command runner abstraction
- CLI `pgg init`/`pgg git` local/remote onboarding flow
- dashboard API와 MUI Stepper 입력/실행/복구 flow
- manifest/dashboard snapshot contract
- mock 기반 regression test와 manual verification contract

## 2. 현재 상태 요약

- `packages/core/src/index.ts`는 git setup metadata, remote URL parsing, inspection, defer/update helpers를 제공한다.
- `packages/cli/src/index.ts`는 localized help, init checklist, `deferGitSetup()`을 제공하지만 git setup 실행은 deferred 기록으로 끝난다.
- `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx`는 project settings tab과 Stepper shell을 갖고 있지만 입력/검증/실행 action이 없다.
- `apps/dashboard/vite.config.ts`는 branch prefix update와 git defer endpoint는 제공하지만 setup execution endpoint가 없다.
- `packages/core/test/git-onboarding.test.mjs`는 parser/default/deferred/detection 중심이며 FAST PATH, SETUP PATH, local path 실행 회귀 테스트가 없다.

## 3. 설계 방향

- setup orchestration은 core에 둔다. CLI와 dashboard는 같은 request/result contract를 사용한다.
- 실제 shell command 실행은 injectable command runner로 추상화한다. 테스트는 mock runner를 사용하고 실제 provider network는 QA에서 manual verification으로 남긴다.
- git setup은 `local`, `fast`, `setup`, `deferred`, `failed` 결과를 명시한다.
- destructive 또는 remote-impact action은 dry-run/confirm 단계를 거친다.
- token 값은 process input 또는 credential helper/CLI로만 다루고 manifest에는 저장하지 않는다.
- dashboard는 Stepper를 시각 안내에서 실행 UI로 승격한다. 각 단계는 입력값, 실행 상태, 실패 사유, retry/defer action을 갖는다.

## 4. Spec Map

| Spec | 목적 | 주요 파일 |
|---|---|---|
| `spec/core/git-onboarding-engine.md` | core setup engine, command runner, result contract | `packages/core/src/index.ts`, `packages/core/test/git-onboarding.test.mjs` |
| `spec/cli/init-and-git-onboarding-flow.md` | `pgg init`/`pgg git` interactive/non-TTY flow | `packages/cli/src/index.ts`, `packages/cli/dist/index.js` |
| `spec/dashboard/git-setup-stepper-execution.md` | dashboard API와 Stepper 실행 UI | `apps/dashboard/vite.config.ts`, `DashboardApp.tsx`, `ProjectDetailWorkspace.tsx`, locale/model |
| `spec/qa/git-onboarding-verification-contract.md` | mock tests, build/test, manual provider verification | `package.json`, `packages/core/test/*.mjs`, `qa/report.md` |

## 5. 작업 순서

1. core contract를 먼저 만든다. CLI/dashboard가 사용할 type과 result shape가 선행되어야 중복 구현을 막을 수 있다.
2. CLI flow를 연결한다. `pgg init` git 선택과 `pgg git` 활성화가 같은 engine을 호출하게 만든다.
3. dashboard API와 UI를 연결한다. API endpoint는 core engine result를 반환하고 UI는 Stepper state로 반영한다.
4. tests와 dist output을 갱신한다. mock runner 기반으로 외부 provider/network 없이 핵심 flow를 검증한다.
5. code review에서 secret handling, non-TTY guardrail, destructive action confirm 여부를 중점 확인한다.

## 6. 위험과 대응

| 위험 | 대응 |
|---|---|
| 실제 provider API/CLI가 로컬 test에서 불안정함 | core runner를 주입 가능하게 만들고 provider 실제 검증은 manual QA로 분리한다. |
| token 평문 저장 위험 | token은 manifest에 저장하지 않고 auth method/status만 기록한다. |
| remote add/set-url, commit, push가 되돌리기 어려움 | 실행 전 confirmation과 dry-run 가능한 inspection result를 제공한다. |
| CLI와 dashboard가 다른 setup semantics를 갖게 됨 | core request/result contract를 source of truth로 삼고 두 entrypoint가 같은 함수를 호출한다. |
| non-TTY 환경에서 interactive 질문이 실패함 | 명시 flag 없이는 설명 가능한 guardrail error를 반환한다. |

## 7. 검증 계획

- `pnpm build`
- `pnpm test`
- `packages/core/test/git-onboarding.test.mjs`에 mock runner 기반 FAST PATH, SETUP PATH, local path, deferred path, non-TTY compatible result test를 추가한다.
- dashboard build로 TypeScript/MUI state compile safety를 확인한다.
- 실제 GitHub/GitLab login, repository creation, remote push는 `manual verification required`로 QA에 기록한다.

## 8. Audit Applicability

- `pgg-token`: `not_required` | workflow handoff 구조 변경이 아니라 CLI/dashboard git setup 기능 gap 보완이다
- `pgg-performance`: `not_required` | git onboarding은 사용자 주도 setup flow이며 성능 민감 runtime 경로가 아니다

## 9. 완료 기준

- 모든 task가 spec에 연결되어 있다.
- `reviews/plan.review.md`와 `reviews/task.review.md`가 전문가 attribution을 포함한다.
- `pgg-gate.sh pgg-code pgg-git-onboarding-implementation-gap`가 통과한다.
- `state/current.md`가 다음 단계에 필요한 최소 context를 제공한다.
