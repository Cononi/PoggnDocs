# Current State

## Topic

pgg-username-dashboard-workflow-refinement

## Current Stage

implementation

## Goal

전역 pgg 사용자명 설정과 dashboard workflow/token UX 개선 요구사항 구현을 완료하고 code review까지 기록했다.

## Constraints

- project scope: `current-project`
- archive type: `feat`
- version bump: `minor`
- target version: `2.8.0`
- short name: `username-dashboard-refinement`
- working branch: `ai/feat/2.8.0-username-dashboard-refinement`
- release branch: `release/2.8.0-username-dashboard-refinement`

## Proposal Decision

- status: `reviewed`
- score: `96`
- next: `pgg-plan`
- user question record: `proposal.md#3-사용자-입력-질문-기록`
- 기준안: 전역 username 설정, init username gate, settings username edit, dashboard workflow overview/token 표시, git/timeline reference parity, project add pgg init Stepper, insights/speed dial/sidebar 정리, i18n 필수 적용을 하나의 `feat` 범위로 확정

## Plan Decision

- status: `reviewed`
- score: `96`
- next: `pgg-code`
- plan: `plan.md`
- task: `task.md`
- specs:
  - `spec/config/global-username.md`
  - `spec/cli/init-username-gate.md`
  - `spec/dashboard/workflow-overview-token.md`
  - `spec/dashboard/workflow-git-timeline-reference.md`
  - `spec/dashboard/project-add-init-stepper.md`
  - `spec/dashboard/insights-speed-dial-sidebar.md`
  - `spec/i18n/username-workflow-copy.md`
  - `spec/qa/token-and-reference-regression.md`
- review refs: `reviews/plan.review.md`, `reviews/task.review.md`

## Implementation Decision

- status: `reviewed`
- score: `94`
- next: `pgg-refactor`
- implementation index: `implementation/index.md`
- code review: `reviews/code.review.md`
- summary:
  - core global username config API, dashboard snapshot projection, folder inspect/init API, topic token estimates 추가
  - CLI `pgg config username {name}`, `pgg settings`, `pgg init` username gate 추가
  - dashboard project add Stepper, sidebar username card, speed dial version removal, insights close removal 구현
  - workflow overview token heading/helper, Creator/Assignee username, timeline flow/file token과 actual stage-commit evidence 표시 구현
- additional user request:
  - LLM 실사용 token과 local 추정 token을 분리 표시한다.
  - workflow timeline을 `add-img/timeline.png` 기준 세로 timeline/date/card/files/git split 구조로 다시 맞춘다.
- additional implementation:
  - token usage contract에 `llmActualTokens`와 `localEstimatedTokens`를 분리 추가했다.
  - LLM actual evidence가 없는 경우 `기록 없음`으로 표시하고 local estimate는 file content 기반 값으로 표시한다.
  - timeline UI를 table row에서 vertical rail + stage card 구조로 변경했다.
- residual risk:
  - reference image parity는 browser screenshot/manual visual evidence가 QA/refactor 이후 필요하다
  - project add Stepper remote FAST/SETUP 세부 credential 입력 UX는 후속 polish 여지가 있다

## Scope Summary

- CLI/config: `pgg config username {이름}`을 추가하고 username이 없으면 `pgg init` 진행을 차단한다.
- Settings: `pgg settings` 기본 메뉴에서 전역 username을 변경한다.
- Global username: 사용자 PC에 설치된 pgg 공통값으로 모든 프로젝트에서 Creator, Assignee, Timeline, sidebar 사용자 영역에 사용한다.
- Workflow overview: Recent Activity 제거, Workflow Progress helper text 추가, `Workflow Progress (총 사용 토큰 : xxx)` heading 표기.
- Token accounting: 전체/flow/file token usage를 같은 기준으로 계산하고 Codex usage source와 추정 fallback 정책을 plan 단계에서 명확히 한다.
- Workflow tab: `add-img/git.png` git view와 `add-img/timeline.png` timeline view를 기준으로 구현하되 현재 dashboard 색감을 유지한다.
- Timeline data: flow별 git commit 내용은 실제 commit evidence와 100% 일치해야 하며 flow 제목 total token, file 옆 file token을 표시한다.
- Project add: git init/pgg init이 안 된 폴더는 modal Stepper에서 pgg init 설정을 이어서 받는다.
- Insights/speed dial/sidebar: Sprint Progress 중복 제거, insight close button 제거, speed dial version 제거, MUI Persistent action tooltips label 적용, sidebar 최하단 username 영역 추가.
- I18n: 신규 CLI/dashboard copy는 ko/en i18n 적용 필수.

## Exclusions

- workflow 상태 모델 변경 제외
- git commit/release/archive ledger 규칙 변경 제외
- reference image와 무관한 dashboard 전체 테마 재설계 제외
- Codex 외 LLM provider usage 연동은 필수 범위에서 제외

## Plan Docs To Create

- created, see `Plan Decision`

## Active Specs

- S1: `spec/config/global-username.md`
- S2: `spec/cli/init-username-gate.md`
- S3: `spec/dashboard/workflow-overview-token.md`
- S4: `spec/dashboard/workflow-git-timeline-reference.md`
- S5: `spec/dashboard/project-add-init-stepper.md`
- S6: `spec/dashboard/insights-speed-dial-sidebar.md`
- S7: `spec/i18n/username-workflow-copy.md`
- S8: `spec/qa/token-and-reference-regression.md`

## Active Tasks

- T1: 전역 username core 모델
- T2: CLI config/settings/init username gate
- T3: Workflow overview token surface
- T4: Workflow tab git/timeline reference UI
- T5: Project add pgg init Stepper
- T6: Insights, speed dial, sidebar polish
- T7: I18n coverage
- T8: QA와 audit evidence 준비

## Audit Applicability

- `pgg-token`: `required` | token 사용량 자체를 dashboard 데이터로 노출하고 workflow/file 단위 계산 근거를 요구하므로 token 산정 audit가 필요하다.
- `pgg-performance`: `required` | workflow tab/timeline/reference parity와 project add Stepper가 dashboard 주요 화면 렌더링과 interaction surface를 바꾸므로 responsiveness 확인이 필요하다.

## Verification

- current-project verification contract: `manual verification required`
- reason: `.pgg/project.json` verification mode is `manual` and no commands are declared.
- reference assets: `add-img/git.png` exists, PNG 1536x1024
- reference assets: `add-img/timeline.png` exists, PNG 1536x1024
- evidence: `pnpm --filter @pgg/core build` passed
- evidence: `pnpm --filter @pgg/cli build` passed
- evidence: `pnpm --filter @pgg/dashboard build` passed with existing Vite chunk-size warning
- evidence: `pnpm test:core` passed with 53 tests
- evidence: `pnpm test:dashboard` passed with 2 tests
- evidence: `pnpm build` passed with existing Vite chunk-size warning
- evidence: manual CLI username gate check passed
- evidence: additional `pnpm --filter @pgg/core build` passed
- evidence: additional `pnpm --filter @pgg/dashboard build` passed with existing Vite chunk-size warning
- evidence: additional `pnpm test:dashboard` passed

## Changed Files

| CRUD | path | note |
|---|---|---|
| CREATE | `poggn/active/pgg-username-dashboard-workflow-refinement/proposal.md` | proposal 확정 |
| CREATE | `poggn/active/pgg-username-dashboard-workflow-refinement/reviews/proposal.review.md` | proposal 전문가 review |
| CREATE | `poggn/active/pgg-username-dashboard-workflow-refinement/state/current.md` | 다음 단계 handoff state |
| CREATE | `poggn/active/pgg-username-dashboard-workflow-refinement/workflow.reactflow.json` | proposal workflow metadata |
| CREATE | `poggn/active/pgg-username-dashboard-workflow-refinement/state/history.ndjson` | proposal stage evidence |
| CREATE | `poggn/active/pgg-username-dashboard-workflow-refinement/plan.md` | plan 확정 |
| CREATE | `poggn/active/pgg-username-dashboard-workflow-refinement/task.md` | task 분해 |
| CREATE | `poggn/active/pgg-username-dashboard-workflow-refinement/spec/config/global-username.md` | 전역 username spec |
| CREATE | `poggn/active/pgg-username-dashboard-workflow-refinement/spec/cli/init-username-gate.md` | CLI username gate spec |
| CREATE | `poggn/active/pgg-username-dashboard-workflow-refinement/spec/dashboard/workflow-overview-token.md` | workflow overview/token spec |
| CREATE | `poggn/active/pgg-username-dashboard-workflow-refinement/spec/dashboard/workflow-git-timeline-reference.md` | workflow git/timeline reference spec |
| CREATE | `poggn/active/pgg-username-dashboard-workflow-refinement/spec/dashboard/project-add-init-stepper.md` | project add init Stepper spec |
| CREATE | `poggn/active/pgg-username-dashboard-workflow-refinement/spec/dashboard/insights-speed-dial-sidebar.md` | insights/speed dial/sidebar spec |
| CREATE | `poggn/active/pgg-username-dashboard-workflow-refinement/spec/i18n/username-workflow-copy.md` | i18n copy spec |
| CREATE | `poggn/active/pgg-username-dashboard-workflow-refinement/spec/qa/token-and-reference-regression.md` | QA regression spec |
| CREATE | `poggn/active/pgg-username-dashboard-workflow-refinement/reviews/plan.review.md` | plan 전문가 review |
| CREATE | `poggn/active/pgg-username-dashboard-workflow-refinement/reviews/task.review.md` | task 전문가 review |
| CREATE | `poggn/active/pgg-username-dashboard-workflow-refinement/implementation/index.md` | implementation index |
| CREATE | `poggn/active/pgg-username-dashboard-workflow-refinement/implementation/diffs/*.diff` | implementation diffs |
| CREATE | `poggn/active/pgg-username-dashboard-workflow-refinement/reviews/code.review.md` | code 전문가 review |
| UPDATE | `packages/core/src/index.ts` | global username, token estimates, dashboard init APIs |
| UPDATE | `packages/cli/src/index.ts` | username config/settings/init gate |
| UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | username/token/init contracts |
| UPDATE | `apps/dashboard/vite.config.ts` | live username/project inspect/init endpoints |
| UPDATE | `apps/dashboard/src/app/DashboardApp.tsx` | project add Stepper and username mutation |
| UPDATE | `apps/dashboard/src/app/DashboardShellChrome.tsx` | sidebar username card and speed dial cleanup |
| UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | overview token heading and timeline token labels |
| UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | actual flow files and stage-commit timeline rows |
| UPDATE | `apps/dashboard/src/features/backlog/InsightsRail.tsx` | bottom close button removal |
| UPDATE | `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx` | global user propagation |
| UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | ko/en copy |
| CREATE | `packages/core/test/global-username.test.mjs` | username regression tests |
| UPDATE | `packages/core/dist/index.d.ts` | rebuilt core output |
| UPDATE | `packages/core/dist/index.js` | rebuilt core output |
| UPDATE | `packages/core/dist/index.js.map` | rebuilt core output |
| UPDATE | `packages/cli/dist/index.js` | rebuilt CLI output |
| UPDATE | `packages/cli/dist/index.js.map` | rebuilt CLI output |
| UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | additional split token display and timeline reference layout |
| UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | additional split token timeline model |
| UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | additional token/timeline i18n labels |
| UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | additional split token contract |
| UPDATE | `packages/core/src/index.ts` | additional split token fields |
| UPDATE | `packages/core/dist/index.d.ts` | additional rebuilt core output |
| UPDATE | `packages/core/dist/index.js` | additional rebuilt core output |
| UPDATE | `packages/core/dist/index.js.map` | additional rebuilt core output |

## Dirty Worktree Baseline

- `.pgg/project.json`
- `add-img/git.png`
- `add-img/timeline.png`
- `test.md`

## Expert Review

- 프로덕트 매니저: 96, blocking issue 없음
- UX/UI 전문가: 95, blocking issue 없음
- 소프트웨어 아키텍트: 96, blocking issue 없음
- 도메인 전문가: 96, blocking issue 없음
- 시니어 백엔드 엔지니어: 94, blocking issue 없음
- 테크 리드: 94, blocking issue 없음
- overall score: 94
- review refs: `reviews/proposal.review.md`, `reviews/plan.review.md`, `reviews/task.review.md`, `reviews/code.review.md`

## Git Publish Message

- title: feat: 2.8.0.사용자명과 워크플로우 정리
- why: 전역 사용자명 설정을 pgg CLI와 dashboard 전반에 연결하고, workflow overview/tab에서 token usage와 git timeline 정보를 정확하게 볼 수 있도록 정리한다.
- footer: Refs: pgg-username-dashboard-workflow-refinement

## Next

`pgg-refactor`

## Next Action

Run `pgg-refactor` for `pgg-username-dashboard-workflow-refinement` using `state/current.md`, `implementation/index.md`, and `reviews/code.review.md`.
