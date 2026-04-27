---
pgg:
  topic: "pgg-username-dashboard-workflow-refinement"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 96
  updated_at: "2026-04-27T12:58:00Z"
  auto_mode: "on"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "2.8.0"
  short_name: "username-dashboard-refinement"
  working_branch: "ai/feat/2.8.0-username-dashboard-refinement"
  release_branch: "release/2.8.0-username-dashboard-refinement"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "전역 사용자명 설정과 dashboard workflow/token UX 개선 요구사항을 proposal로 확정한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

전역 사용자명 설정과 dashboard workflow UX 정리

## 2. 변경 분류

- archive_type: `feat`
- version_bump: `minor`
- target_version: `2.8.0`
- short_name: `username-dashboard-refinement`
- working_branch: `ai/feat/2.8.0-username-dashboard-refinement`
- release_branch: `release/2.8.0-username-dashboard-refinement`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- `pgg config username {이름}`으로 사용자 명을 설정한다. 추후 다른 설정 값도 생길 수 있다.
- `pgg init` 시 사용자 명을 설정하지 않으면 진행되지 않도록 하고, 먼저 사용자 명 설정을 하라고 안내한다.
- `pgg settings` 기본 메뉴에서 사용자명을 변경할 수 있어야 한다.
- 사용자명은 사용자 PC에 설치된 pgg에 공통적으로 사용되는 값이며 모든 프로젝트에 공통적으로 사용된다.
- 사용자명은 Creator, Assignee, Timeline 등에 골고루 사용되는 명칭이다.
- dashboard project의 워크플로우 오버뷰에서 Recent Activity 부분은 제거해도 된다.
- dashboard project의 워크플로우 오버뷰에서 Workflow Progress 밑에 작은 글씨로 "워크 플로우를 눌르면 상세 내용을 볼 수 있습니다" 문구가 필요하다.
- dashboard project의 워크플로우 오버뷰에서 Workflow Progress 옆에 `Workflow Progress (총 사용 토큰 : xxx)` 형식으로 표기해야 한다.
- Codex LLM에 사용된 총 토큰이 얼마나 되는지 명확한 계산이 필요하다. 이 데이터를 가지고 토큰을 줄일 수 있어야 한다.
- dashboard project의 워크플로우 탭에서 `add-img/git.png` 이미지를 보고 git 영역을 동일하게 구현한다.
- dashboard project의 워크플로우 탭에서 timeline 모습은 `add-img/timeline.png`를 보고 동일하게 구현한다. 색감은 현 색감을 유지한다.
- dashboard project의 워크플로우 탭 timeline의 각 flow git commit 내용은 실제 flow별 git commit 내용과 100% 일치해야 한다. 색감은 현 색감을 유지한다.
- dashboard project의 워크플로우 탭 timeline의 flow 제목에는 해당 flow에서 사용된 total token 수를 표기하고, 파일 옆에는 파일별 token 사용량을 표기한다.
- 프로젝트 추가에서 git init 처리된 프로젝트가 아니면 해당 폴더에 `pgg init` 처리할 수 있도록 workflow를 진행한다. CLI에서 하던 설정 방식은 modal Stepper로 이어서 입력받는다.
- PROJECT INSIGHTS의 Sprint Progress에서 `완료`, `완료`, `진행중`, `진행중`, `차단`, `차단`처럼 중복 표기되는 상태는 하나씩만 나오게 한다. 최하단 프로젝트 인사이트 닫기 버튼을 제거한다.
- speed dial 최상단의 버전 표기는 제거한다. MUI의 Persistent action tooltips 기능을 적용해 dial 이름 label이 보이게 한다.
- 사이드바 최하단에 사용자 명이 적힌 칸이 필요하다.
- i18n 적용은 필수다.

## 4. 문제 정의

현재 pgg와 dashboard는 프로젝트별 workflow 정보를 보여주지만, 사용자를 식별하는 공통 이름과 Codex LLM token 사용량을 일관된 데이터로 다루지 못한다. 이 때문에 Creator, Assignee, Timeline, workflow progress, git commit timeline에서 누가 어떤 작업을 했고 얼마나 많은 token을 사용했는지 추적하기 어렵다.

또한 dashboard workflow tab과 project onboarding UI는 최신 reference image 및 사용자가 기대하는 MUI interaction pattern과 차이가 있다. git/timeline 영역은 reference image parity가 요구되며, 프로젝트 추가 중 pgg 초기화가 필요한 경우 CLI 흐름을 dashboard modal Stepper로 이어받아야 한다.

## 5. 제안 범위

- 전역 pgg 사용자명 설정을 추가한다.
  - CLI: `pgg config username {이름}`
  - CLI: `pgg init`은 전역 사용자명이 없으면 중단하고 설정 안내를 출력한다.
  - CLI/dashboard: `pgg settings` 기본 메뉴에서 사용자명 변경을 지원한다.
  - 저장 범위: 사용자 PC에 설치된 pgg 공통 설정이며 프로젝트별 `.pgg/project.json` 값이 아니다.
- 사용자명 표시 surface를 정렬한다.
  - Creator, Assignee, Timeline의 기본 표시명으로 사용한다.
  - dashboard sidebar 최하단에 현재 사용자명 영역을 추가한다.
- dashboard project workflow overview를 정리한다.
  - Recent Activity 제거
  - Workflow Progress 보조 문구 추가
  - `Workflow Progress (총 사용 토큰 : xxx)` heading 표기
  - workflow item click 시 상세로 진입 가능해야 한다.
- Codex LLM token accounting을 추가한다.
  - workflow 전체 total token, flow별 total token, 파일별 token을 같은 산정 기준으로 계산한다.
  - 실제 Codex usage source가 있으면 해당 값을 우선하고, 추정 산정이 필요한 경우 plan 단계에서 근거와 UI 표기 정책을 분리한다.
  - dashboard는 token을 줄이기 위한 분석 자료로 사용할 수 있게 계산 출처와 집계 범위를 명확히 표시한다.
- dashboard project workflow tab을 reference image 기준으로 개선한다.
  - git 영역은 `add-img/git.png`를 기준으로 레이아웃, 밀도, 정보 배치를 맞춘다.
  - timeline 영역은 `add-img/timeline.png`를 기준으로 레이아웃과 상태 표현을 맞추되 현재 dashboard 색감은 유지한다.
  - timeline에 표시되는 각 flow git commit 내용은 실제 commit evidence와 일치해야 한다.
  - flow 제목에는 flow total token, 파일 라인에는 파일별 token을 표시한다.
- project add flow를 확장한다.
  - 선택한 폴더가 git init 또는 pgg init 상태가 아니면 dashboard modal Stepper에서 pgg init 설정을 이어서 받는다.
  - 기존 CLI init 설정 흐름과 값 의미를 유지하되 dashboard 입력 UI로 제공한다.
- PROJECT INSIGHTS와 speed dial을 정리한다.
  - Sprint Progress 상태 중복 제거
  - 프로젝트 인사이트 닫기 버튼 제거
  - speed dial version 표시 제거
  - MUI Persistent action tooltips pattern으로 action label 표시
- 모든 신규/변경 문구는 i18n 적용 대상이다.

## 6. 제외 범위

- pgg workflow 단계 자체의 상태 모델 변경은 제외한다.
- git commit 생성 규칙, release branch 규칙, archive ledger 포맷 변경은 제외한다.
- reference image와 무관한 dashboard 전체 테마 재설계는 제외한다.
- Codex 외 다른 LLM provider의 과금/usage 연동은 이번 proposal의 필수 범위에서 제외한다.

## 7. 성공 기준

- 전역 username이 없는 상태에서 `pgg init`은 진행되지 않고 `pgg config username {이름}` 안내를 제공한다.
- username은 한 PC의 모든 pgg 프로젝트에서 공통으로 읽히며 Creator, Assignee, Timeline, sidebar 사용자 영역에 반영된다.
- dashboard workflow overview에서 Recent Activity가 제거되고, Workflow Progress heading/보조 문구/token total이 i18n 문구로 표시된다.
- token total은 전체/flow/file 단위로 같은 기준에서 계산되며, 계산 source와 집계 범위가 plan/spec에 명확히 기록된다.
- workflow tab의 git/timeline UI는 `add-img/git.png`, `add-img/timeline.png` reference를 기준으로 visual parity 검토가 가능해야 한다.
- timeline commit 내용은 flow별 git commit evidence와 불일치하지 않아야 한다.
- 프로젝트 추가 중 pgg init이 필요한 폴더는 modal Stepper에서 설정을 완료하거나 취소 상태를 명확히 남긴다.
- Sprint Progress 상태는 중복 없이 하나씩 표시되고, 프로젝트 인사이트 닫기 버튼은 제거된다.
- speed dial은 version text 없이 Persistent action tooltip label을 제공한다.
- 모든 신규 UI text와 CLI 안내는 ko/en i18n key를 갖는다.

## 8. 계획 단계 요청

- `spec/config/global-username.md`: 전역 username 저장 위치, precedence, validation, migration 없음/있음 결정
- `spec/cli/init-username-gate.md`: `pgg config username`, `pgg init`, `pgg settings` CLI behavior
- `spec/dashboard/workflow-overview-token.md`: overview heading, helper text, Recent Activity removal, token aggregation
- `spec/dashboard/workflow-git-timeline-reference.md`: `add-img/git.png`, `add-img/timeline.png` parity criteria and current color preservation
- `spec/dashboard/project-add-init-stepper.md`: non-git/non-pgg folder onboarding modal Stepper
- `spec/dashboard/insights-speed-dial-sidebar.md`: Sprint Progress dedupe, speed dial persistent labels, sidebar username area
- `spec/i18n/username-workflow-copy.md`: ko/en copy coverage
- `spec/qa/token-and-reference-regression.md`: token calculation verification, git commit data parity, screenshot/manual visual regression

## 9. Audit Applicability

- `pgg-token`: `required` | 이번 변경은 token 사용량 자체를 dashboard 데이터로 노출하고 workflow/file 단위 계산 근거를 요구하므로 token 산정 audit가 필요하다.
- `pgg-performance`: `required` | workflow tab/timeline/reference parity와 project add Stepper는 dashboard 주요 화면 렌더링과 interaction surface를 바꾸므로 responsiveness 확인이 필요하다.

## 10. Git Publish Message

- title: feat: 2.8.0.사용자명과 워크플로우 정리
- why: 전역 사용자명 설정을 pgg CLI와 dashboard 전반에 연결하고, workflow overview/tab에서 token usage와 git timeline 정보를 정확하게 볼 수 있도록 정리한다.
- footer: Refs: pgg-username-dashboard-workflow-refinement
