---
pgg:
  topic: "pgg-project-settings-and-git-onboarding"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-27T06:08:10Z"
  auto_mode: "on"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "2.5.0"
  short_name: "project-onboarding"
  working_branch: "ai/feat/2.5.0-project-onboarding"
  release_branch: "release/2.5.0-project-onboarding"
  project_scope: "current-project"
reactflow:
  node_id: "plan"
  node_type: "doc"
  label: "plan.md"
state:
  summary: "pgg project-scoped settings와 git onboarding을 CLI, config, git engine, dashboard UI, QA spec로 분해한다."
  next: "pgg-code"
---

# Plan

## 1. 목표

- `pgg` help와 모든 interactive 절차가 lang별로 이해 가능한 설명을 제공하게 한다.
- `pgg init`에서 AI 환경 선택 뒤 language와 auto/teams/git 초기 값을 project별로 고르는 checklist 흐름을 만든다.
- git 활성 시 FAST PATH/SETUP PATH repository 연결을 제공하고, 중간 취소는 실패가 아니라 deferred completion으로 처리한다.
- dashboard 전역 settings에서 project runtime 설정을 제거하고 project detail sidebar settings로 이동한다.
- project settings는 MUI Tabs의 `기본`/`git` 탭과 git setup Stepper modal로 구성한다.

## 2. Spec 분해

| Spec ID | path | 목적 | 구현 핵심 |
|---|---|---|---|
| S1 | `spec/cli/localized-help-and-init-checklist.md` | CLI help i18n과 init checklist를 정의한다. | `packages/cli/src/index.ts`, CLI locale/helper |
| S2 | `spec/config/project-scoped-settings-and-git-state.md` | project-scoped settings와 git connection state contract를 고정한다. | `packages/core/src/index.ts`, manifest schema, dashboard snapshot model |
| S3 | `spec/git/fast-setup-path-and-deferred-completion.md` | FAST/SETUP PATH와 deferred completion engine을 정의한다. | core git onboarding service, provider adapters, CLI/dashboard API entry |
| S4 | `spec/dashboard/project-settings-tabs-and-git-stepper.md` | dashboard settings IA 이동과 project settings tabs/stepper UI를 정의한다. | `DashboardApp.tsx`, `ProjectDetailWorkspace.tsx`, settings feature, locale/store |
| S5 | `spec/qa/verification-and-regression-contract.md` | 자동/수동 검증 경계를 정의한다. | CLI/core tests, dashboard build/type check, manual provider verification |

## 3. 구현 순서

1. S2에서 manifest와 snapshot의 source of truth를 먼저 확장한다.
2. S1에서 CLI help locale과 init checklist 입력 흐름을 만든다.
3. S3에서 shared git onboarding engine을 구현하고 CLI `pgg git` 및 init에서 재사용한다.
4. S4에서 dashboard 전역 settings를 정리하고 project detail settings tabs와 git Stepper modal을 연결한다.
5. S5에서 parser, deferred completion, locale, dashboard build 회귀 검증을 추가한다.

## 4. 설계 결정

| 항목 | 결정 |
|---|---|
| settings source | `.pgg/project.json`을 project runtime 설정의 source of truth로 유지한다. |
| auth storage | token/password는 저장하지 않고 auth method/status만 metadata로 남긴다. |
| git defaults | `defaultRemote: origin`, `workingBranchPrefix: ai`, `releaseBranchPrefix: release`를 git 기본값으로 유지한다. |
| git cancel | 중간 취소는 `deferred` completion으로 기록하고 project 생성은 완료한다. |
| dashboard IA | lang/auto/teams/git은 전역 settings가 아니라 project detail settings로 이동한다. |
| provider | GitHub/GitLab 우선 지원, provider CLI login은 `gh`/`glab` 감지 기반으로 제공한다. |
| verification | 실제 provider push는 credentials/network 때문에 manual verification으로 분리한다. |

## 5. 리스크와 가드레일

- git setup은 remote 변경, repo 생성, commit, push를 수행할 수 있으므로 irreversible 단계 전 확인을 둔다.
- deferred completion은 실패처럼 보이면 안 되며, dashboard와 CLI 모두 재개 경로를 보여 줘야 한다.
- manifest에 민감 정보가 저장되면 안 된다.
- git connection metadata 확장 중에도 default remote와 branch prefix 기본값이 바뀌면 안 된다.
- 전역 settings 제거가 dashboard title/icon/theme/refresh 설정까지 지우면 안 된다.
- teams mode 변경은 `.codex/config.toml` multi-agent 동기화를 계속 유지해야 한다.
- non-TTY 환경은 interactive prompt 대신 explicit flags 또는 명확한 오류를 사용한다.

## 6. 검증 전략

- CLI help locale과 init flag path는 자동 테스트 또는 script로 검증한다.
- manifest normalize와 git remote URL parser는 fixture 기반 단위 테스트로 검증한다.
- git setup deferred path는 mock adapter로 검증하고 실제 provider push는 QA manual item으로 남긴다.
- dashboard settings 이동은 `pnpm build`와 관련 test로 확인한다.

## 7. Audit Applicability

- `pgg-token`: `not_required` | workflow handoff 구조가 아니라 pgg CLI/dashboard feature 확장이다
- `pgg-performance`: `not_required` | 성능 민감 path가 아니라 onboarding/settings UX와 git orchestration이다

## 8. 완료 기준

- spec과 task가 CLI, manifest, git engine, dashboard UI, verification 경계를 빠짐없이 연결한다.
- `task.md`의 모든 task가 spec ref를 갖는다.
- plan/task review에서 blocking issue가 없다.
- `pgg-code`가 구현 파일과 검증 순서를 추가 해석 없이 바로 실행할 수 있다.
