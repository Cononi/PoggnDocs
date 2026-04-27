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
  - timeline flow 연결선은 overview flow처럼 이어지고 완료 check 색상은 overview completed 색상과 일치해야 한다.
  - 생성 파일 row는 파일명 위에 LLM/Local token label을 보여야 한다.
  - 문서는 신규/기존 적용 프로젝트 모두에서 LLM actual과 Local estimated token 사용량을 분리 측정하도록 명시해야 한다.
  - 완료 timeline의 연결선이 check 원을 관통해 보이면 안 된다.
  - timeline 순서는 내림차순이어야 한다.
  - 완료 check 배경은 검정색이 아니라 overview completed node 모양과 같아야 한다.
  - timeline header의 필터/더보기/접기 버튼을 제거한다.
  - 우측 폴더 트리는 폴더를 그대로 클릭해 펼쳐서 볼 수 있어야 한다.
  - timeline의 모든 파일 보기는 timeline text 확장이 아니라 우측 file tree를 현재 flow 생성 파일 목록으로 전환해야 한다.
  - 초기 우측 file tree는 전체 파일을 보여준다.
  - flow file 보기 이후 검색창 옆 두 icon button 대신 reset button을 보여준다.
  - timeline 생성파일 목록은 최대 3개씩만 표시한다.
  - 우측 file tree에 LLM/Local token 정보도 같이 표시한다.
  - timeline 선은 overview flow처럼 똑바르게 끊기지 않고 이어져야 한다.
  - 생성 파일 목록의 파일 클릭 시 modal로 파일 내용을 볼 수 있고 LLM/Local token 사용량을 표기해야 한다.
  - file tree에서는 LLM/Local token 표시를 제거한다.
  - flow 순서는 실제 pgg workflow 순서와 같아야 한다.
  - 시간은 실제 flow 완료 시간으로 표기해야 한다.
  - 파일 상세 modal은 timeline 생성 파일이 아니라 우측 file tree의 file 클릭에서 열려야 한다.
  - 완료 표시 색은 flow마다 다른 색이어야 한다.
  - timeline은 workflow 역순으로 표시해야 한다.
  - timeline 생성 파일 row에는 file-level LLM/Local token을 제외하고, 각 flow title/header에는 total LLM/Local token을 유지한다.
  - timeline 선과 완료 check background는 파란색으로 채워야 하고 뒷선이 check 뒤로 보이면 안 된다.
  - 마지막/bottom flow는 아래 flow가 없으므로 check 아래로 선이 넘어가면 안 된다.
  - commit 내용은 flow card에서 최대 3개만 표시하고 모든 커밋 보기는 modal로 추가 commit list를 보여줘야 한다.
  - timeline flow check line은 overview completed 상태와 같은 색/표면으로 이어지고, MUI custom connector/step icon 방식의 vertical Stepper로 적용해야 한다.
  - timeline 아래에 workflow 최초 start와 최종 end/completion 시간을 표기해야 한다.
  - timeline 우측 file tree의 file modal은 markdown, code highlight, line number, diff 변경/문맥 강조를 제공해야 한다.
  - project sidebar 파일 메뉴는 `프로젝트 파일`로 이름을 바꾸고 topic 선택 없이 현재 프로젝트 전체 파일을 조회해야 한다.
- additional implementation:
  - token usage contract에 `llmActualTokens`와 `localEstimatedTokens`를 분리 추가했다.
  - LLM actual evidence가 없는 경우 `기록 없음`으로 표시하고 local estimate는 file content 기반 값으로 표시한다.
  - timeline UI를 table row에서 vertical rail + stage card 구조로 변경했다.
  - timeline rail/check 색상을 overview completed 색상으로 정렬하고 생성 파일 token chips를 파일명 위로 이동했다.
  - token 관련 spec/QA 문서에 모든 project topic snapshot의 LLM actual/Local estimated 분리 측정 계약을 추가했다.
  - check 원 배경을 불투명 처리하고 rail 시작 위치를 원 밖으로 내려 선이 원 내부를 관통해 보이지 않게 했다.
  - timeline row를 최신 timestamp 기준 내림차순으로 정렬했다.
  - completed check를 overview와 같은 success soft fill로 되돌리고 rail은 원 아래 edge부터 이어지게 했다.
  - timeline header action button 그룹을 제거했다.
  - 우측 file tree folder row에 click toggle 상태를 추가했다.
  - timeline file action이 선택 flow 파일 목록을 우측 file tree source로 설정하도록 변경했다.
  - reset button은 flow/search filter를 해제하고 topic 전체 파일 tree로 복구한다.
  - 우측 file search 옆 table/list icon button을 제거했다.
  - timeline card 내부 생성 파일 목록을 `slice(0, 3)`으로 제한했다.
  - 우측 file tree file row에 LLM actual과 Local estimated token chip을 추가했다.
  - timeline rail endpoint를 completed circle 외곽 ring 기준으로 맞췄다.
  - topic file snapshot에 text content를 포함하도록 core/dashboard model을 확장했다.
  - timeline을 row별 선분 대신 단일 vertical rail로 변경했다.
  - 생성 파일 row 클릭 시 file content modal을 열고 modal에서 LLM/Local token을 표시한다.
  - 우측 file tree의 LLM/Local token chip은 제거했다.
  - timeline row 정렬을 timestamp 내림차순에서 실제 workflow definition 순서로 되돌렸다.
  - timeline date/time은 `flowTimestampBundle(...).completedAt`을 우선 사용하고, completion evidence가 없을 때만 trusted updated evidence로 fallback한다.
  - file preview modal trigger를 timeline 생성 파일 row에서 우측 file tree file row로 이동했다.
  - timeline row 순서를 actual workflow reverse order로 변경했다.
  - completed check node 색상을 row tone별 primary/secondary/success/neutral로 분리했다.
  - generated file row에서 file-level LLM/Local token chip을 제거했고 flow header total token chip은 유지했다.
  - timeline rail/check를 MUI vertical Stepper 구조로 전환하고 custom connector/step icon이 overview completed success 색/soft fill/border/shadow를 공유하게 했다.
  - StepContent connector가 마지막/bottom flow 아래로 이어지지 않게 하여 terminal overshoot를 제거했다.
  - commit list는 flow card에서 `slice(0, 3)`로 제한하고, 4개 이상일 때 `모든 커밋 보기` modal로 전체 commit list를 표시한다.
  - timeline 하단에 최초 start와 최종 end/completion 시간 요약을 추가했다.
  - timeline file preview modal을 공통 artifact renderer로 연결해 markdown, syntax highlight, line number, diff 강조를 적용했다.
  - project snapshot에 node_modules/.git 등 generated-heavy 경로를 제외한 전체 project file tree와 live project file content API를 추가했다.
  - Project Files 페이지에서 topic 선택 sidebar를 제거하고 현재 project 전체 파일 tree를 직접 표시하도록 바꿨다.
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
- evidence: follow-up `pnpm --filter @pgg/dashboard build` passed with existing Vite chunk-size warning
- evidence: follow-up `pnpm test:dashboard` passed
- evidence: follow-up descending timeline `pnpm --filter @pgg/dashboard build` passed with existing Vite chunk-size warning
- evidence: follow-up descending timeline `pnpm test:dashboard` passed
- evidence: follow-up timeline controls `pnpm --filter @pgg/dashboard build` passed with existing Vite chunk-size warning
- evidence: follow-up timeline controls `pnpm test:dashboard` passed
- evidence: follow-up flow file tree `pnpm --filter @pgg/dashboard build` passed with existing Vite chunk-size warning
- evidence: follow-up flow file tree `pnpm test:dashboard` passed
- evidence: follow-up file tree tokens `pnpm --filter @pgg/dashboard build` passed with existing Vite chunk-size warning
- evidence: follow-up file tree tokens `pnpm test:dashboard` passed
- evidence: follow-up file modal `pnpm --filter @pgg/core build` passed
- evidence: follow-up file modal `pnpm --filter @pgg/dashboard build` passed with existing Vite chunk-size warning
- evidence: follow-up file modal `pnpm test:dashboard` passed
- evidence: follow-up order/time `pnpm --filter @pgg/dashboard build` passed with existing Vite chunk-size warning
- evidence: follow-up order/time `pnpm test:dashboard` passed
- evidence: follow-up reverse/tone `pnpm --filter @pgg/dashboard build` passed with existing Vite chunk-size warning
- evidence: follow-up reverse/tone `pnpm test:dashboard` passed
- evidence: follow-up blue rail/check and commit modal `pnpm --filter @pgg/dashboard build` passed with existing Vite chunk-size warning
- evidence: follow-up blue rail/check and commit modal `pnpm test:dashboard` passed
- evidence: follow-up vertical Stepper overview-completed connector `pnpm --filter @pgg/dashboard build` passed with existing Vite chunk-size warning
- evidence: follow-up vertical Stepper overview-completed connector `pnpm test:dashboard` passed
- evidence: follow-up project files and highlighted preview `pnpm --filter @pgg/core build` passed
- evidence: follow-up project files and highlighted preview `pnpm --filter @pgg/dashboard build` passed with existing Vite chunk-size warning
- evidence: follow-up project files and highlighted preview `pnpm test:dashboard` passed
- evidence: follow-up project files and highlighted preview `pnpm test:core` passed
- evidence: `./.codex/sh/pgg-gate.sh pgg-refactor pgg-username-dashboard-workflow-refinement` passed

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
| UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | follow-up timeline rail/check color and generated file token label placement |
| UPDATE | `poggn/active/pgg-username-dashboard-workflow-refinement/spec/dashboard/workflow-overview-token.md` | LLM actual/Local estimated split token measurement contract |
| UPDATE | `poggn/active/pgg-username-dashboard-workflow-refinement/spec/dashboard/workflow-git-timeline-reference.md` | timeline rail/check color and file token placement criteria |
| UPDATE | `poggn/active/pgg-username-dashboard-workflow-refinement/spec/qa/token-and-reference-regression.md` | QA criteria for split tokens across project snapshots |
| UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | rail no longer visually crosses completed check circles |
| UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | timeline rows sorted newest first |
| UPDATE | `poggn/active/pgg-username-dashboard-workflow-refinement/spec/dashboard/workflow-git-timeline-reference.md` | newest-first timeline and rail/check separation criteria |
| UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | overview-style completed check, timeline header action removal, clickable file tree folder expansion |
| UPDATE | `poggn/active/pgg-username-dashboard-workflow-refinement/spec/dashboard/workflow-git-timeline-reference.md` | timeline controls and file tree folder expansion criteria |
| UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | timeline file action scopes right file tree to selected flow and reset restores all files |
| UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | flow-scoped file tree and reset i18n labels |
| UPDATE | `poggn/active/pgg-username-dashboard-workflow-refinement/spec/dashboard/workflow-git-timeline-reference.md` | flow file tree/reset behavior criteria |
| UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | timeline generated files capped at 3 and right file tree file rows include LLM/Local token chips |
| UPDATE | `poggn/active/pgg-username-dashboard-workflow-refinement/spec/dashboard/workflow-git-timeline-reference.md` | max 3 generated files, file tree token chips, and rail endpoint criteria |
| UPDATE | `packages/core/src/index.ts` | topic file content included for dashboard file preview modal |
| UPDATE | `packages/core/dist/index.d.ts` | rebuilt core output |
| UPDATE | `packages/core/dist/index.js` | rebuilt core output |
| UPDATE | `packages/core/dist/index.js.map` | rebuilt core output |
| UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | topic file content field |
| UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | timeline file rows carry content |
| UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | single timeline rail, generated file content modal, remove file tree token chips |
| UPDATE | `poggn/active/pgg-username-dashboard-workflow-refinement/spec/dashboard/workflow-git-timeline-reference.md` | single rail and file modal criteria |
| UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | timeline rows follow actual workflow order and display completion evidence time |
| UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | right file tree file click opens preview modal; timeline generated file click removed |
| UPDATE | `poggn/active/pgg-username-dashboard-workflow-refinement/spec/dashboard/workflow-git-timeline-reference.md` | actual workflow order, completion time, and right file tree preview criteria |
| UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | timeline rows follow reverse actual workflow order |
| UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | completed checks use flow tone colors and generated file rows hide file-level token chips |
| UPDATE | `poggn/active/pgg-username-dashboard-workflow-refinement/spec/dashboard/workflow-git-timeline-reference.md` | reverse workflow order, flow-tone checks, flow-header token criteria |
| UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | blue rail/check, terminal connector cutoff, commit list cap, full commit modal |
| UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | view all commits i18n label |
| UPDATE | `poggn/active/pgg-username-dashboard-workflow-refinement/spec/dashboard/workflow-git-timeline-reference.md` | blue rail/check and commit modal acceptance criteria |
| UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | MUI vertical Stepper timeline with overview completed connector/check styling |
| UPDATE | `poggn/active/pgg-username-dashboard-workflow-refinement/spec/dashboard/workflow-git-timeline-reference.md` | vertical Stepper and overview completed connector/check criteria |
| UPDATE | `packages/core/src/index.ts` | project-wide file snapshot and live project file content API support |
| UPDATE | `packages/core/dist/index.d.ts` | rebuilt core type output |
| UPDATE | `packages/core/dist/index.js` | rebuilt core output |
| UPDATE | `packages/core/dist/index.js.map` | rebuilt core sourcemap |
| UPDATE | `apps/dashboard/vite.config.ts` | dashboard project file content GET/PATCH/DELETE routes |
| UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | project snapshot file list contract |
| UPDATE | `apps/dashboard/src/shared/api/dashboard.ts` | project file content client API |
| UPDATE | `apps/dashboard/src/features/project-detail/ProjectDetailWorkspace.tsx` | Project Files page shows project-wide file tree without topic selector |
| UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | timeline start/end summary and highlighted file preview modal |
| UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | timeline first-start/final-end summary model |
| UPDATE | `apps/dashboard/src/shared/ui/ArtifactDocumentContent.tsx` | markdown/code highlighting and line numbers |
| UPDATE | `apps/dashboard/src/shared/ui/DiffViewer.tsx` | line-numbered diff add/remove/context highlighting |
| UPDATE | `apps/dashboard/src/shared/utils/dashboard.tsx` | project file artifact selection helper |
| UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | Project Files and timeline start/end labels |
| UPDATE | `poggn/active/pgg-username-dashboard-workflow-refinement/spec/dashboard/workflow-git-timeline-reference.md` | timeline start/end and file modal render criteria |

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
