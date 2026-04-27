---
pgg:
  topic: "pgg-username-dashboard-workflow-refinement"
  stage: "task"
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
  summary: "plan specs를 구현 가능한 task로 분해한다."
  next: "pgg-code"
---

# Task

## T1. 전역 username core 모델

- Spec: `spec/config/global-username.md`
- 구현 범위:
  - 전역 user config 저장/읽기/update API 추가
  - username validation과 normalization 추가
  - dashboard snapshot에 current user display name projection
  - Creator/Assignee/Timeline fallback에서 사용할 공통 value 제공
- 완료 조건:
  - project manifest가 아닌 전역 저장소를 사용한다.
  - username이 비어 있으면 API가 명확한 empty state를 반환한다.
  - core tests가 username read/update/validation을 검증한다.

## T2. CLI config/settings/init username gate

- Spec: `spec/cli/init-username-gate.md`
- 구현 범위:
  - `pgg config username {이름}` command 추가
  - `pgg settings` 기본 메뉴에 username edit 추가
  - `pgg init` username missing gate 추가
  - help text와 error message ko/en 추가
- 완료 조건:
  - username이 없으면 `pgg init`은 project 파일을 만들지 않는다.
  - 안내 문구는 `pgg config username {이름}`을 포함한다.
  - CLI tests가 success/missing/invalid username을 검증한다.

## T3. Workflow overview token surface

- Spec: `spec/dashboard/workflow-overview-token.md`
- 구현 범위:
  - workflow overview Recent Activity 제거
  - Workflow Progress heading에 total token 표시
  - Workflow Progress helper text 추가
  - topic/flow/file token aggregation model 추가
- 완료 조건:
  - `Workflow Progress (총 사용 토큰 : xxx)` 형식이 ko/en i18n으로 표시된다.
  - workflow step click 상세 진입은 유지된다.
  - token source와 fallback estimate가 snapshot/model에서 추적된다.

## T4. Workflow tab git/timeline reference UI

- Spec: `spec/dashboard/workflow-git-timeline-reference.md`
- 구현 범위:
  - `add-img/git.png` 기준 git commit panel 재구성
  - `add-img/timeline.png` 기준 timeline table/tree 재구성
  - flow title total token, file row token 표시
  - actual commit evidence와 UI commit text 일치 보장
- 완료 조건:
  - reference image checklist를 충족한다.
  - 현재 dashboard 색감과 theme token을 유지한다.
  - commit title/hash/author/time은 실제 evidence에서만 표시한다.

## T5. Project add pgg init Stepper

- Spec: `spec/dashboard/project-add-init-stepper.md`
- 구현 범위:
  - project add modal을 Stepper로 전환
  - non-pgg folder init path 지원
  - non-git folder git init/setup/defer path 지원
  - category registration까지 이어지는 mutation flow 추가
- 완료 조건:
  - `.pgg/project.json` 없는 폴더를 dashboard에서 초기화할 수 있다.
  - username이 없으면 dashboard Stepper도 init을 막고 설정 안내를 보여준다.
  - 취소/defer 상태가 명확하게 표시된다.

## T6. Insights, speed dial, sidebar polish

- Spec: `spec/dashboard/insights-speed-dial-sidebar.md`
- 구현 범위:
  - Sprint Progress status dedupe
  - Project Insights close button 제거
  - SpeedDial version action 제거
  - Persistent action tooltips label 유지/보정
  - Sidebar bottom username card 추가
- 완료 조건:
  - Sprint Progress status는 완료/진행중/차단이 각각 한 번만 표시된다.
  - speed dial에는 version chip/action이 없다.
  - sidebar bottom card는 username empty state까지 표시한다.

## T7. I18n coverage

- Spec: `spec/i18n/username-workflow-copy.md`
- 구현 범위:
  - 신규 dashboard copy ko/en dictionary 추가
  - CLI message ko/en 추가
  - hard-coded UI text 제거 또는 dictionary 연결
- 완료 조건:
  - 새로 추가된 사용자-facing 문구는 ko/en key를 가진다.
  - Workflow overview/timeline/project add/settings/sidebar/speed dial copy가 dictionary 기반이다.

## T8. QA와 audit evidence 준비

- Spec: `spec/qa/token-and-reference-regression.md`
- 구현 범위:
  - token audit용 측정 근거 기록
  - performance audit용 dashboard build/interaction evidence 기록
  - screenshot/manual visual regression checklist 준비
- 완료 조건:
  - required `pgg-token`, `pgg-performance` 단계가 실행 가능하도록 evidence path가 준비된다.
  - QA에서 token calculation, commit parity, i18n, visual reference check를 검증할 수 있다.

## Audit Applicability

- `pgg-token`: `required` | token usage 기능의 계산 근거와 비용 절감 분석 surface가 핵심이다.
- `pgg-performance`: `required` | dashboard workflow tab과 project add Stepper UI 변경은 주요 interactive surface다.
