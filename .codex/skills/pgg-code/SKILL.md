---
name: "pgg-code"
description: "승인된 pgg-plan을 테스트 우선으로 구현하고 실패 분석, review, token 기록, 조건부 task commit을 수행한다."
---

# Skill: pgg-code

## Purpose

`pgg-code`는 승인된 `pgg-plan`을 기반으로 테스트 우선 구현, 실패 분석, 수정, 재검증을 수행하는 Skill이다.
각 task는 실제 테스트 코드 생성, 실제 구현 코드 작성, 테스트 실행, 실패 로그 분석, 수정 후 재실행, Review 1, Review 2, token 기록, 조건부 task commit 순서로 완료한다.
pgg-code artifact는 `poggn/active/{topic_name}/pgg-code/` 아래에 저장하고, 애플리케이션 실제 소스코드는 pgg-plan에 명시된 실제 파일 경로에 생성하거나 수정한다.

## Teams Mode

- `pgg teams`가 `on`이고 환경이 지원하면 메인 에이전트가 모든 코드를 직접 작성하지 않고 각 task마다 fresh subagent를 생성하거나 위임한다.
- 각 subagent는 특정 task, 관련 파일 경로, 관련 Acceptance Criteria, 필요한 검증 단계, version 정보만 받는다.
- 각 subagent는 깨끗한 context로 시작하며 이전 task나 전체 대화 맥락을 불필요하게 받지 않는다.
- subagent 작업 완료 후 메인 에이전트는 Review 1: 명세 준수와 Review 2: 코드 품질을 반드시 수행한다.
- `pgg teams`가 `on`이면 아래 2개 primary agent 관점을 사용한다.
- `pgg teams`가 `off`이면 단일 에이전트가 같은 문서 계약과 review 계약을 수행한다.

## State and Workspace

- 항상 `poggn/active/{topic_name}/state.json`을 먼저 읽는다.
- `state.json`에서 currentFlow, approval, pggGit, currentVersion, targetVersion, bumpType, convention, versionSource를 확인한다.
- 승인된 plan/task/Acceptance Criteria가 없거나 targetVersion이 없으면 구현하지 않고 `pgg-plan`으로 되돌린다.
- pgg-code 산출물은 `poggn/active/{topic_name}/pgg-code/` 아래에 저장한다.
- token 기록은 `poggn/active/{topic_name}/metrics/token-usage.jsonl`에 남긴다.
- 작업 전 dirty worktree가 있으면 상태를 기록하고 기존 사용자 변경사항을 덮어쓰지 않는다.

## Expert Roster

- 시니어 백엔드 엔지니어: 주 구현 작업
- 테크 리드: 아키텍처 가드레일과 통합 판단

## 필수 실행 순서

1. 실제 테스트 코드를 생성한다.
2. 실제 구현 코드를 작성한다.
3. 테스트를 실행한다.
4. 실패 로그를 분석한다.
5. 수정 후 테스트를 재실행한다.
6. project version bump를 적용한다.
7. verify를 수행한다.

## task 단위 실행 순서

1. task 시작을 기록한다.
2. 실제 테스트 코드를 생성한다.
3. 실제 구현 코드를 작성한다.
4. 테스트를 실행한다.
5. 실패 로그를 분석한다.
6. 수정 후 재실행한다.
7. Review 1: 명세 준수를 수행한다.
8. Review 2: 코드 품질을 수행한다.
9. token 기록을 완료한다.
10. git 저장소이고 pgg git = on이면 task commit을 수행한다.
11. task 완료를 보고한다.

## Review 1: 명세 준수

- task 만족 여부를 확인한다.
- Acceptance Criteria 만족 여부를 확인한다.
- 승인된 plan 준수 여부를 확인한다.
- 필요한 테스트 생성 여부를 확인한다.
- 필요한 검증 실행 여부를 확인한다.
- version bump task 수행 여부를 확인한다.
- 실패하면 task를 수정하도록 되돌리고 관련 테스트를 다시 실행한 뒤 다시 review한다.

## Review 2: 코드 품질

- 가독성을 확인한다.
- 중복을 확인한다.
- 에러 처리를 확인한다.
- 네이밍을 확인한다.
- 책임 분리를 확인한다.
- 유지보수성을 확인한다.
- 불필요한 dependency 여부를 확인한다.
- 실패하면 task를 수정하도록 되돌리고 관련 테스트를 다시 실행한 뒤 다시 review한다.

## Project Version Bump

- pgg-add에서 결정되고 pgg-plan에 포함된 targetVersion을 실제 project version에 반영한다.
- npm 라이브러리라면 기본적으로 `package.json` version을 targetVersion으로 수정한다.
- 기존 프로젝트에 다른 version source가 있으면 그 구조를 따른다.
- `state.json`에 projectVersionUpdated, versionSource, currentVersion, targetVersion을 기록한다.
- version bump 검증은 versionSource의 실제 값이 targetVersion과 일치해야 PASS다.

## task별 git commit 규칙

- task 1개가 완료될 때마다 commit을 수행한다. 단, pgg git = on이고 git 저장소가 있을 경우에만 commit한다.
- git 저장소 확인 명령은 `git rev-parse --is-inside-work-tree`이다.
- task commit 조건은 pgg git = on, git 저장소, 해당 task 테스트 통과, 실패 로그 분석과 수정 loop 완료, Review 1 통과, Review 2 통과, 해당 task token 기록 완료다.
- pgg git = off이면 commit하지 않고 완료 메시지에 생략 사유를 기록한다.
- git 저장소가 아니면 commit하지 않고 완료 메시지에 생략 사유를 기록한다.
- commit message 형식은 `{convention}. {version} {message}`이다.
- 예: `feat. 1.3.0 pgg-code task-1 add login validation test`
- 권장 footer: `PGG-Flow: pgg-code`, `PGG-Task: task-1`, `PGG-Verify: passed`, `PGG-Token-Usage: poggn/active/{topic_name}/metrics/token-usage.jsonl`
- push는 하지 않는다.
- task와 무관한 파일을 commit하지 않는다.
- commit 실패 시 실패 이유를 완료 메시지에 기록한다.
- git identity 문제로 commit이 불가능한 경우 global config를 변경하지 않는다.

## Token Accounting

- 기록 위치는 `poggn/active/{topic_name}/metrics/token-usage.jsonl`이다.
- token 기록은 task commit 전에 완료되어야 한다.
- commit이 생성되면 token record에 commitSha를 연결해야 한다.
- task별 token 기록 요약을 pgg-code artifact와 completion message에 포함한다.

## pgg-performance 유도 조건

- pgg-plan에 성능 기준이 있으면 pgg-performance를 next flow 후보로 추천한다.
- 성능에 영향을 줄 수 있는 코드가 작성되면 pgg-performance를 추천할 수 있다.
- 대량 데이터 처리, 반복문, DB query, 네트워크 요청, 캐싱, 동시성, 파일 처리, 번들 크기 관련 변경이면 pgg-performance를 추천할 수 있다.
- 성능 회귀 가능성이 있거나 테스트만으로 성능 근거가 부족하면 pgg-performance를 추천할 수 있다.
- 기본 정상 next flow는 pgg-refactor이고, 성능 측정 필요성이 명확하면 pgg-performance를 추천한다.

## Completion Message

- 완료된 task 목록, task별 테스트 결과, task별 실패 로그 분석 요약, task별 review 결과, task별 token 기록 요약을 포함한다.
- task별 commit SHA 또는 commit 생략 사유, project version bump 결과, 전체 verify 결과, pgg-performance 필요 여부, 다음 flow 추천을 포함한다.
- 기본 정상 완료의 마지막 문장은 정확히 `다음 flow를 실행하세요: pgg-refactor`이다.
- 성능 측정 필요 시 마지막 문장은 정확히 `다음 flow를 실행하세요: pgg-performance`이다.
- 실패 또는 미완료 시 마지막 문장은 정확히 `다음 flow를 실행하세요: pgg-code`이다.
- 마지막 문장 뒤에는 아무것도 출력하지 않는다.

## Rules

- generated Markdown은 TypeScript Skill 정의와 generator에서만 갱신하고 직접 patch하지 않는다.
- repository가 실제 multi-agent runtime을 제공하지 않으면 새 runtime을 임의로 만들지 않는다.
- teams/subagent 동작은 Skill 정의와 generated documentation에 표현하고, 기존 runtime command가 있을 때만 기존 구조 안에서 신규 core로 연결한다.
- 현재 프로젝트 밖을 건드리는 작업은 자동 처리하지 않는다.
- 모든 변경은 CREATE, UPDATE, DELETE로 분류한다.

## 공통 Skill 정의

- Skill ID: `pgg-code`
- Skill 이름: PGG Code
- 목적: `pgg-code`는 승인된 `pgg-plan`을 기반으로 테스트 우선 구현, 실패 분석, 수정, 재검증을 수행하는 Skill이다. 범용 AI 에이전트가 plan의 task를 실제 repository 파일에 적용하되, 각 task마다 테스트, 구현, 실패 로그 분석, 두 단계 review, token 기록, 조건부 git commit까지 닫힌 loop로 끝내도록 가르친다.
- 대상 에이전트: 승인된 plan을 읽고 실제 테스트 코드와 실제 구현 코드를 작성하며, 실패를 분석해 수정하고 재검증하는 AI 개발 에이전트. `teams on` 환경에서는 메인 에이전트가 모든 코드를 직접 작성하지 않고 task별 fresh subagent에 제한된 handoff를 위임한 뒤 review한다.

### Trigger 조건

- `pgg-plan`이 PASS이고 구현 승인이 완료된 후 실행한다.
- `poggn/active/{topic_name}/state.json`의 currentFlow, approval, targetVersion, pggGit 정보를 확인한 뒤 시작한다.
- 승인된 plan/task/Acceptance Criteria가 없거나 targetVersion이 없으면 구현하지 않고 `pgg-plan`으로 되돌린다.

### 입력

- `poggn/active/{topic_name}/state.json`
- `poggn/active/{topic_name}/pgg-plan/` 아래의 승인된 plan, task, Acceptance Criteria, 검증 전략
- pgg-add에서 결정되고 pgg-plan에 포함된 currentVersion, targetVersion, bumpType, convention, versionSource
- task별 실제 파일 경로, 생성할 테스트, 필요한 검증 단계
- 작업 전 dirty worktree baseline과 사용자 변경사항

### 출력

- `poggn/active/{topic_name}/pgg-code/` 아래의 implementation report, task 결과, 실패 로그 분석, review 결과, verify 결과
- plan에 명시된 실제 project path의 테스트 코드와 구현 코드 변경
- project version bump 결과와 `state.json`의 projectVersionUpdated, versionSource, currentVersion, targetVersion 갱신
- `poggn/active/{topic_name}/metrics/token-usage.jsonl`의 task별 token record와 commitSha 연결
- task별 commit SHA 또는 commit 생략 사유
- pgg-performance 필요 여부와 다음 flow 추천

### 절대 규칙

- 항상 `poggn/active/{topic_name}/state.json`을 먼저 읽는다.
- pgg-code artifact는 `poggn/active/{topic_name}/pgg-code/` 아래에 저장한다.
- 애플리케이션 실제 소스코드는 pgg-plan에 명시된 실제 파일 경로에 생성하거나 수정한다.
- 필수 실행 순서는 실제 테스트 코드 생성, 실제 구현 코드 작성, 테스트 실행, 실패 로그 분석, 수정 후 재실행, project version bump 적용, verify 수행이다.
- generated Markdown은 TypeScript Skill 정의와 generator에서만 갱신하고 직접 patch하지 않는다.
- repository가 실제 multi-agent runtime을 제공하지 않으면 새 runtime을 임의로 만들지 않는다.
- teams/subagent 동작은 Skill 정의와 generated documentation에 표현하고, 기존 runtime command가 있을 때만 기존 구조 안에서 신규 core로 연결한다.
- push는 하지 않는다.
- 기존 사용자 변경사항을 덮어쓰지 않고 task와 무관한 파일을 commit하지 않는다.

### 금지 패턴

- 테스트 없이 구현부터 작성
- 실패 로그를 읽지 않고 같은 테스트를 반복 실행
- review 실패를 무시하고 task 완료 처리
- token 기록 전에 task commit 생성
- pgg git off인데 commit 시도
- git 저장소가 아닌데 commit 시도
- generated Markdown 직접 수정
- versionSource를 무시하고 package.json만 추정 수정
- subagent에게 전체 repository context나 불필요한 이전 대화 context를 전달

### Mode-Specific Behavior

#### auto off

- 승인된 pgg-plan과 task를 먼저 확인한다.
- 승인되지 않았거나 scope/dependency 변경이 필요하면 구현 전에 사용자 승인을 받는다.
- 각 task 완료 시 테스트 결과, 실패 로그 분석, review 결과, token 기록, commit 결과 또는 생략 사유를 보고한다.
- 정상 완료 시 마지막 문장은 `다음 flow를 실행하세요: pgg-refactor` 또는 성능 측정 필요 시 `다음 flow를 실행하세요: pgg-performance`이다.

#### auto on

- 승인된 plan 안에서 테스트 우선 구현 loop를 자율적으로 수행한다.
- 실패 원인을 추론해 최소 수정으로 재실행한다.
- 가정, 불확실성, 실패 분석, review 결과, commit 생략 사유를 pgg-code artifact에 기록한다.
- 성능 측정 필요성이 명확하면 다음 flow를 `pgg-performance`로 추천한다.

#### teams off

- `teams off`에서는 단일 에이전트가 task별 테스트 생성, 구현, 실패 분석, 수정, review, token 기록, 조건부 commit을 수행한다.
- 단일 에이전트라도 Review 1: 명세 준수와 Review 2: 코드 품질은 분리해서 기록한다.

#### teams on

- `teams on`이고 환경이 지원하면 메인 에이전트가 모든 코드를 직접 작성하지 않고 각 task마다 fresh subagent를 생성하거나 위임한다.
- 각 subagent는 특정 task, 관련 파일 경로, 관련 Acceptance Criteria, 필요한 검증 단계, version 정보만 받는다.
- 각 subagent는 깨끗한 context로 시작하고 이전 task나 전체 대화 맥락을 불필요하게 받지 않는다.
- subagent 작업 완료 후 메인 에이전트는 Review 1: 명세 준수와 Review 2: 코드 품질을 반드시 수행한다.

### 필수 실행 순서

- 1. 실제 테스트 코드를 생성한다.
- 2. 실제 구현 코드를 작성한다.
- 3. 테스트를 실행한다.
- 4. 실패 로그를 분석한다.
- 5. 수정 후 테스트를 재실행한다.
- 6. project version bump를 적용한다.
- 7. verify를 수행한다.

### task 단위 실행 순서

- 1. task 시작을 기록한다.
- 2. 실제 테스트 코드를 생성한다.
- 3. 실제 구현 코드를 작성한다.
- 4. 테스트를 실행한다.
- 5. 실패 로그를 분석한다.
- 6. 수정 후 재실행한다.
- 7. Review 1: 명세 준수를 수행한다.
- 8. Review 2: 코드 품질을 수행한다.
- 9. token 기록을 완료한다.
- 10. git 저장소이고 pgg git = on이면 task commit을 수행한다.
- 11. task 완료를 보고한다.

### Review 1: 명세 준수

- task 만족 여부를 확인한다.
- Acceptance Criteria 만족 여부를 확인한다.
- 승인된 plan 준수 여부를 확인한다.
- 필요한 테스트 생성 여부를 확인한다.
- 필요한 검증 실행 여부를 확인한다.
- version bump task 수행 여부를 확인한다.
- 실패하면 task를 수정하도록 되돌리고 관련 테스트를 다시 실행한 뒤 다시 review한다.

### Review 2: 코드 품질

- 가독성을 확인한다.
- 중복을 확인한다.
- 에러 처리를 확인한다.
- 네이밍을 확인한다.
- 책임 분리를 확인한다.
- 유지보수성을 확인한다.
- 불필요한 dependency 여부를 확인한다.
- 실패하면 task를 수정하도록 되돌리고 관련 테스트를 다시 실행한 뒤 다시 review한다.

### Project Version Bump

- pgg-add에서 결정되고 pgg-plan에 포함된 targetVersion을 실제 project version에 반영한다.
- npm 라이브러리라면 기본적으로 `package.json` version을 targetVersion으로 수정한다.
- 기존 프로젝트에 다른 version source가 있으면 그 구조를 따른다.
- `state.json`에 projectVersionUpdated, versionSource, currentVersion, targetVersion을 기록한다.
- version bump 검증은 versionSource의 실제 값이 targetVersion과 일치해야 PASS다.

### task별 git commit 규칙

- task 1개가 완료될 때마다 commit을 수행한다. 단, pgg git = on이고 git 저장소가 있을 경우에만 commit한다.
- git 저장소 확인 명령은 `git rev-parse --is-inside-work-tree`이다.
- task commit 조건은 pgg git = on, git 저장소, 해당 task 테스트 통과, 실패 로그 분석과 수정 loop 완료, Review 1 통과, Review 2 통과, 해당 task token 기록 완료다.
- pgg git = off이면 commit하지 않고 완료 메시지에 생략 사유를 기록한다.
- git 저장소가 아니면 commit하지 않고 완료 메시지에 생략 사유를 기록한다.
- commit message 형식은 `{convention}. {version} {message}`이다.
- 예: `feat. 1.3.0 pgg-code task-1 add login validation test`
- 권장 footer: `PGG-Flow: pgg-code`, `PGG-Task: task-1`, `PGG-Verify: passed`, `PGG-Token-Usage: poggn/active/{topic_name}/metrics/token-usage.jsonl`
- push는 하지 않는다.
- task와 무관한 파일을 commit하지 않는다.
- 작업 전 dirty worktree가 있으면 상태를 기록한다.
- commit 실패 시 실패 이유를 완료 메시지에 기록한다.
- git identity 문제로 commit이 불가능한 경우 global config를 변경하지 않는다.

### Token Accounting

- 기록 위치는 `poggn/active/{topic_name}/metrics/token-usage.jsonl`이다.
- token 기록은 task commit 전에 완료되어야 한다.
- commit이 생성되면 token record에 commitSha를 연결해야 한다.
- task별 token 기록 요약을 pgg-code artifact와 completion message에 포함한다.

### pgg-performance 유도 조건

- pgg-plan에 성능 기준이 있으면 pgg-performance를 next flow 후보로 추천한다.
- 성능에 영향을 줄 수 있는 코드가 작성되면 pgg-performance를 추천할 수 있다.
- 대량 데이터 처리, 반복문, DB query, 네트워크 요청, 캐싱, 동시성, 파일 처리, 번들 크기 관련 변경이면 pgg-performance를 추천할 수 있다.
- 성능 회귀 가능성이 있거나 테스트만으로 성능 근거가 부족하면 pgg-performance를 추천할 수 있다.
- 기본 정상 next flow는 pgg-refactor이고, 성능 측정 필요성이 명확하면 pgg-performance를 추천한다.

### 완료 산출물

- 완료된 task 목록을 포함한다.
- task별 테스트 결과를 포함한다.
- task별 실패 로그 분석 요약을 포함한다.
- task별 review 결과를 포함한다.
- task별 token 기록 요약을 포함한다.
- task별 commit SHA를 포함한다.
- commit 생략 사유를 포함한다.
- project version bump 결과를 포함한다.
- 전체 verify 결과를 포함한다.
- pgg-performance 필요 여부를 포함한다.
- 다음 flow 추천을 포함한다.

### 필수 단계

- context refresh와 dirty worktree baseline 기록
- `state.json` 읽기와 승인된 pgg-plan 확인
- task별 테스트 우선 구현 loop
- task별 실패 로그 분석과 수정 후 재실행
- task별 Review 1: 명세 준수
- task별 Review 2: 코드 품질
- task별 token 기록
- 조건부 task commit
- project version bump 적용
- final verify와 docs generation 안정성 확인
- pgg-performance 필요 여부 판단
- completion message 작성

### 승인 Gate

- 승인된 pgg-plan 없이 구현하지 않는다.
- auto off에서는 scope 변경이나 dependency 추가 전 승인을 받는다.
- review 실패 시 완료 처리하지 않고 수정, 재검증, 재review를 수행한다.
- 검증 실패 또는 미완료이면 마지막 문장은 `다음 flow를 실행하세요: pgg-code`이다.

### 검증 요구사항

- typecheck를 실행한다. 저장소에 별도 typecheck script가 없으면 `pnpm build` 또는 실제 package script를 사용한다.
- 관련 테스트를 실행한다.
- docs generation을 실행한다.
- docs generation을 재실행해 안정성을 확인한다.
- project version source의 version이 targetVersion과 일치하는지 확인한다.
- task별 commit은 token 기록 후에만 생성됐는지 확인한다.
- pgg git = off와 git 저장소 없음 조건에서 commit 생략 사유가 기록됐는지 확인한다.
- completion message 마지막 문장이 `다음 flow를 실행하세요: pgg-refactor`, `다음 flow를 실행하세요: pgg-performance`, `다음 flow를 실행하세요: pgg-code` 중 하나인지 확인한다.

### Review 요구사항

- Review 1: 명세 준수는 task, Acceptance Criteria, 승인된 plan, 테스트 생성, 검증 실행, version bump task 수행 여부를 확인한다.
- Review 2: 코드 품질은 가독성, 중복, 에러 처리, 네이밍, 책임 분리, 유지보수성, 불필요한 dependency 여부를 확인한다.
- review 실패 시 task를 수정하도록 되돌리고 관련 테스트를 다시 실행한 뒤 다시 review한다.
- subagent 작업 완료 후에도 두 단계 review는 메인 에이전트가 수행하고 기록한다.

### 완료 메시지 규격

완료 메시지는 완료된 task 목록, task별 테스트 결과, task별 실패 로그 분석 요약, task별 review 결과, task별 token 기록 요약을 포함한다.
완료 메시지는 task별 commit SHA 또는 commit 생략 사유, project version bump 결과, 전체 verify 결과, pgg-performance 필요 여부, 다음 flow 추천을 포함한다.
기본 정상 완료의 마지막 문장은 정확히 `다음 flow를 실행하세요: pgg-refactor`이다.
성능 측정 필요 시 마지막 문장은 정확히 `다음 flow를 실행하세요: pgg-performance`이다.
실패 또는 미완료 시 마지막 문장은 정확히 `다음 flow를 실행하세요: pgg-code`이다.
마지막 문장 뒤에는 아무것도 출력하지 않는다.

### Token Accounting 요구사항

기록 위치는 `poggn/active/{topic_name}/metrics/token-usage.jsonl`이다.
record는 runId, flowId, taskId, filePath, operation, source, tokenCount, tokenizer, isEstimated, charCount, byteCount, lineCount, contentSha256, commitSha, measuredAt을 포함한다.
token 기록은 task commit 전에 완료되어야 한다.
commit이 생성되면 token record에 commitSha를 연결해야 한다.
token 기록 실패 시 task commit을 만들지 않고 실패 사유를 완료 메시지에 기록한다.

### Next Flow Routing

- 기본 정상 완료: `pgg-code` -> `pgg-refactor`.
- 성능 측정 필요: `pgg-code` -> `pgg-performance`.
- 실패 또는 미완료: `pgg-code` -> `pgg-code`.
- 마지막 문장은 `다음 flow를 실행하세요: pgg-refactor`, `다음 flow를 실행하세요: pgg-performance`, `다음 flow를 실행하세요: pgg-code` 중 하나여야 한다.

### 성능 측정 유도 기준

- pgg-plan에 성능 기준이 있으면 pgg-performance를 next flow 후보로 추천한다.
- 성능에 영향을 줄 수 있는 코드가 작성되면 pgg-performance를 next flow 후보로 추천한다.
- 대량 데이터 처리, 반복문, DB query, 네트워크 요청, 캐싱, 동시성, 파일 처리, 번들 크기 관련 변경이면 pgg-performance를 next flow 후보로 추천한다.
- 성능 회귀 가능성이 있으면 pgg-performance를 next flow 후보로 추천한다.
- 테스트만으로 성능 근거가 부족하면 pgg-performance를 next flow 후보로 추천한다.

### POGGN Workspace 요구사항

- `pgg-add`가 시작되면 `topic_name`을 생성한다.
- PGG process artifact는 `poggn/active/{topic_name}` 아래에 저장한다.
- `pgg-qa` PASS 후 process artifact를 `poggn/archive/{topic_name}`으로 이동한다.
- application source file은 실제 project path에 생성하거나 수정한다.
- report, state, plan, QA report, token record, metrics는 active topic directory에 저장한다.

### pgg git mode 요구사항

- `pgg git = off`이면 branch 생성, commit, release branch 전환, working branch 삭제, push를 수행하지 않는다.
- `pgg git = on`이면 `git rev-parse --is-inside-work-tree`로 git 저장소 여부를 확인한다.
- git 저장소가 있으면 task commit 규칙을 적용한다.
- git 저장소가 없으면 task commit을 생략하고 사유를 기록한다.
- push는 하지 않는다.

### Branch Lifecycle 요구사항

- `pgg-add`는 `pgg git = on`이고 git 저장소이면 working branch를 생성하거나 전환한다.
- 기존 branch naming policy가 있으면 사용하고, 없으면 `pgg/working/{topic_name}`을 사용한다.
- `pgg-qa` PASS 후 active artifact를 archive로 이동하고 final QA/archive commit을 생성한다.
- release branch는 기존 정책이 없으면 `release/{topic_name}-v{version}`을 사용한다.
- `pgg-qa` FAIL이면 archive 이동, release branch 전환, working branch 제거, push를 수행하지 않는다.

### Versioning 요구사항

- pgg-add에서 결정되고 pgg-plan에 포함된 targetVersion을 실제 project version에 반영한다.
- npm 라이브러리라면 기본적으로 `package.json` version을 targetVersion으로 수정한다.
- 기존 프로젝트에 다른 version source가 있으면 그 구조를 따른다.
- `state.json`에 projectVersionUpdated, versionSource, currentVersion, targetVersion을 기록한다.
- version format은 `x.x.x`이다.

### Commit Message 요구사항

- task 1개가 완료될 때마다 commit을 수행한다. 단, pgg git = on이고 git 저장소가 있을 경우에만 commit한다.
- commit message 형식은 `{convention}. {version} {message}`이다.
- 예: `feat. 1.3.0 pgg-code task-1 add login validation test`
- 권장 footer는 `PGG-Flow: pgg-code`, `PGG-Task: task-1`, `PGG-Verify: passed`, `PGG-Token-Usage: poggn/active/{topic_name}/metrics/token-usage.jsonl`이다.
- token 기록 후 commit 순서를 지킨다.
- pgg git = off 또는 git 저장소 없음이면 commit하지 않고 생략 사유를 기록한다.
- push는 하지 않는다.

### Archive 요구사항

- `pgg-qa` PASS 전에는 active artifact를 archive로 이동하지 않는다.
- PASS 후 `poggn/active/{topic_name}`을 `poggn/archive/{topic_name}`으로 이동한다.
- archive 상태, QA 결과, version 결과, git 결과를 final state에 남긴다.

### QA 요구사항

- QA는 acceptance criteria, generated docs, tests, version, token accounting, POGGN workspace, git outcome을 검증한다.
- PASS가 아니면 release branch 전환, archive 이동, working branch 제거, push를 수행하지 않는다.
- 실패한 검증 명령과 실패 로그 요약을 completion message에 기록한다.

### 생성 문서 섹션

- pgg-code 목적
- active workspace 사용
- 테스트 우선 실행 순서
- teams on 동작
- subagent 위임 규칙
- clean context 규칙
- Review 1: 명세 준수
- Review 2: 코드 품질
- 실패 분석
- 수정 후 재실행
- project version bump
- task별 token 기록
- task별 git commit 규칙
- pgg git off일 때 commit 생략
- git 저장소가 없을 때 commit 생략 기록
- push 금지
- pgg-performance 유도 조건
- final verify
- completion message 규격
- completionMessageContract
- next flow routing

## Language Contract

- 이 skill이 작성하는 pgg 문서, state/history 문구, review/QA 산출물은 `.pgg/project.json`의 `language` 값을 따른다.
- 이 skill이 생성하거나 수정하는 pgg-managed 코드 주석은 `pgg lang`을 따른다.
- 사용자가 작성한 기존 코드 주석은 해당 task 범위에서 수정하는 경우에만 언어 계약을 적용한다.
