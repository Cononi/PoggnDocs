---
pgg:
  topic: "pgg-username-dashboard-workflow-refinement"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-27T13:14:00Z"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "2.8.0"
  short_name: "username-dashboard-refinement"
  working_branch: "ai/feat/2.8.0-username-dashboard-refinement"
  release_branch: "release/2.8.0-username-dashboard-refinement"
  project_scope: "current-project"
state:
  summary: "전역 사용자명, token accounting, dashboard workflow reference UI를 구현 가능한 spec 경계로 분해한다."
  next: "pgg-code"
---

# Plan

## 1. 목표

전역 pgg 사용자명을 CLI, core snapshot, dashboard UI에서 공통으로 사용하고, dashboard project workflow surface에서 token usage와 git/timeline evidence를 정확하게 표시한다. 동시에 project add flow, PROJECT INSIGHTS, speed dial, sidebar username 영역을 i18n 기준으로 정리한다.

## 2. 구현 전략

1. Core에 전역 사용자 설정 모델을 추가한다.
   - project manifest가 아니라 사용자 PC 공통 pgg 설정으로 저장한다.
   - `packages/core/src/index.ts`에서 read/update API와 snapshot projection을 제공한다.
   - dashboard와 CLI가 같은 API를 사용한다.

2. CLI command surface를 확장한다.
   - `pgg config username {이름}`을 추가한다.
   - `pgg init` 시작 전에 전역 username 존재 여부를 검사하고 없으면 중단한다.
   - `pgg settings` 기본 메뉴에서 username을 수정할 수 있게 한다.
   - help text와 error 안내는 ko/en으로 제공한다.

3. Dashboard snapshot model을 확장한다.
   - `DashboardSnapshot` 또는 `ProjectSnapshot`에 current user display name을 노출한다.
   - Creator, Assignee, Timeline completedBy 기본값과 sidebar 최하단 사용자 영역은 이 값을 사용한다.

4. Workflow overview token accounting을 추가한다.
   - `TopicSummary`에 token usage summary를 추가하거나 `historyModel.ts`에서 topic files/history/commit evidence를 기반으로 계산한다.
   - token source 우선순위는 실제 Codex usage evidence, pgg token report, deterministic fallback estimate 순서로 둔다.
   - fallback estimate는 `ceil(characters / 4)`로 통일하고 UI에는 source를 표시할 수 있어야 한다.

5. Workflow tab git/timeline reference UI를 정렬한다.
   - `add-img/git.png`와 `add-img/timeline.png`를 plan/spec 기준 reference로 둔다.
   - 현재 dashboard 색감과 theme token은 유지한다.
   - timeline commit row는 `state/history.ndjson`, `git/*.json`, stage commit evidence, publish metadata에서 파생된 실제 commit과 일치해야 한다.

6. Project add modal을 pgg init Stepper로 확장한다.
   - 등록 대상 폴더가 `.pgg/project.json` 없음 또는 `.git` 없음이면 modal Stepper로 init/setup path를 제공한다.
   - CLI init의 provider/lang/auto/teams/git 의미를 유지한다.
   - username gate와 git setup deferred behavior를 dashboard에서도 동일하게 적용한다.

7. Dashboard polish를 분리 적용한다.
   - Workflow overview Recent Activity 제거
   - Workflow Progress helper text 추가
   - PROJECT INSIGHTS Sprint Progress status dedupe와 close button 제거
   - SpeedDial version action 제거 및 Persistent action tooltips label 유지
   - Sidebar bottom username card 추가

## 3. 시스템 영향

- `packages/core/src/index.ts`
  - global user config type/API, username validation, dashboard snapshot projection, topic token summary, project registration/init support를 담당한다.
- `packages/cli/src/index.ts`
  - `config`, `settings` command, `init` username gate, localized help/error를 담당한다.
- `apps/dashboard/src/shared/model/dashboard.ts`
  - global username, token usage, project add initialization request/response type을 추가한다.
- `apps/dashboard/vite.config.ts`
  - username settings endpoint, project add init/onboarding endpoint를 추가한다.
- `apps/dashboard/src/app/DashboardApp.tsx`
  - project add Stepper state/mutation과 username update mutation을 연결한다.
- `apps/dashboard/src/app/DashboardShellChrome.tsx`
  - sidebar username card와 speed dial action list를 정리한다.
- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
  - workflow overview, task summary Creator/Assignee, git/timeline layout, token 표시를 정리한다.
- `apps/dashboard/src/features/history/historyModel.ts`
  - token summary, flow commit evidence, timeline row data shape를 계산한다.
- `apps/dashboard/src/features/backlog/InsightsRail.tsx`
  - Sprint Progress status dedupe와 close button 제거를 반영한다.
- `apps/dashboard/src/shared/locale/dashboardLocale.ts`
  - 신규 CLI/dashboard copy와 labels를 ko/en 모두 추가한다.

## 4. Spec 구성

- S1: `spec/config/global-username.md`
- S2: `spec/cli/init-username-gate.md`
- S3: `spec/dashboard/workflow-overview-token.md`
- S4: `spec/dashboard/workflow-git-timeline-reference.md`
- S5: `spec/dashboard/project-add-init-stepper.md`
- S6: `spec/dashboard/insights-speed-dial-sidebar.md`
- S7: `spec/i18n/username-workflow-copy.md`
- S8: `spec/qa/token-and-reference-regression.md`

## 5. 구현 순서

1. S1, S2로 전역 username API와 CLI gate를 먼저 만든다.
2. S5로 dashboard project add init Stepper가 core API를 사용할 수 있게 한다.
3. S3, S4로 workflow overview/timeline data model과 UI를 정리한다.
4. S6으로 sidebar, speed dial, insights polish를 적용한다.
5. S7로 모든 신규 copy를 ko/en dictionary에 연결한다.
6. S8 기준으로 token, screenshot/manual visual, build/test verification을 수행한다.

## 6. 위험과 대응

- 실제 Codex token usage source가 topic별로 없을 수 있다.
  - 대응: source priority와 fallback estimate를 명시하고, UI에 source confidence를 표시한다.
- "reference와 완전히 동일" 요구는 pixel-perfect 자동 판정이 어렵다.
  - 대응: `add-img/git.png`, `add-img/timeline.png` 기준 레이아웃/밀도/정보 배치 checklist와 screenshot evidence로 검증한다.
- username은 전역 설정이라 project manifest와 혼동될 수 있다.
  - 대응: 저장 위치와 precedence를 S1에서 고정하고 `.pgg/project.json`에 저장하지 않는다.
- project add modal에서 init과 git setup을 같이 처리하면 실패 경로가 복잡하다.
  - 대응: Stepper를 username check, project init, git setup, category registration으로 나누고 각 단계의 deferred/cancel state를 분리한다.

## 7. Audit Applicability

- `pgg-token`: `required` | token usage 계산/표시가 핵심 기능이며 source priority와 fallback estimate 검증이 필요하다.
- `pgg-performance`: `required` | workflow timeline UI, token aggregation, project add Stepper가 dashboard 주요 화면과 interaction cost에 영향을 준다.

## 8. Verification Contract

- current-project verification contract: `manual verification required`
- declared commands: 없음
- code 단계 후보 검증:
  - `pnpm build`
  - `pnpm test`
  - `pnpm --filter @pgg/dashboard build`
  - dashboard visual check with `add-img/git.png`, `add-img/timeline.png`
  - manual CLI check for username gate and settings flow

## 9. Handoff

- next: `pgg-code`
- primary context: `state/current.md`
- implementation must follow all S1-S8 specs.
