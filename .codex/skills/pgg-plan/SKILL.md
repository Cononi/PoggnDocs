---
name: "pgg-plan"
description: "승인된 요구사항/설계를 상세한 구현 계획으로 전개한다."
---

# Skill: pgg-plan

## Purpose

`pgg-plan`은 승인된 `pgg-add` 요구사항과 설계를 상세한 구현 계획으로 바꾸는 Skill이다.
계획은 프로젝트 맥락을 모르는 주니어 엔지니어도 그대로 따라갈 수 있을 만큼 명확해야 한다.

## 진입 조건

- auto off에서는 `pgg-add` 산출물이 승인된 뒤에만 진행한다.
- 승인되지 않았다면 구현 계획을 생성하지 말고 승인을 요청한다.
- 승인 전에는 구현 task를 생성하지 않는다.
- 반드시 `poggn/active/{topic_name}/state.json`을 읽는다.

## active workspace 사용

- pgg-plan 산출물은 `poggn/active/{topic_name}/pgg-plan/` 아래에 쓴다.
- `plan.md`, `task.md`, `spec/*/*.md`, `reviews/plan.review.md`, `reviews/task.review.md`를 해당 directory 아래에 쓴다.
- token 기록은 `poggn/active/{topic_name}/metrics/token-usage.jsonl`에 남긴다.

## 필수 단계

1. 승인된 `pgg-add` 산출물을 확인한다.
2. `poggn/active/{topic_name}/state.json`을 읽는다.
3. 검증 전략을 수립한다.
4. test plan을 작성한다.
5. 어떤 테스트를 만들지 결정한다.
6. 성공/실패 기준을 정의한다.
7. 경계값, 예외, 회귀, 성능 기준을 정의한다.
8. version bump task를 작성한다.
9. 구현을 2~5분 단위 task로 쪼갠다.

## Version Plan

- pgg-add에서 결정한 currentVersion, targetVersion, bumpType, convention, versionReason, versionSource를 사용한다.
- `update project version` task를 명시적으로 포함한다.
- `package.json`이 versionSource이면 `package.json` version을 targetVersion으로 수정하도록 지시한다.
- `package.json`이 versionSource가 아니면 기존 프로젝트의 version source를 사용한다.
- version source의 version 값이 targetVersion과 일치하는지 검증한다.

## task 규칙

- 각 task는 2~5분 내 완료 가능한 크기여야 한다.
- 각 task는 정확한 파일 경로를 포함한다.
- 각 task는 필요한 경우 완전한 코드 또는 정확한 코드 작성 지시를 포함한다.
- 각 task는 검증 단계를 포함한다.
- 각 task는 예상 결과를 포함한다.
- 각 task는 실패 시 확인할 항목을 포함한다.
- `적절히 구현`, `필요한 로직 추가`, `일반적인 방식으로 처리` 같은 모호한 표현을 쓰지 않는다.

## Output

- 승인된 설계 요약
- topic_name
- active path
- currentVersion, targetVersion, bumpType, convention, versionReason, versionSource
- 검증 전략
- test plan
- 생성할 테스트 목록
- 성공/실패 기준
- 경계값/예외/회귀/성능 기준
- version bump task
- 2~5분 단위 task 목록
- 각 task의 파일 경로, 완전한 코드 또는 코드 작성 지시, 검증 단계, 예상 결과, 실패 시 확인 항목
- pgg-performance 필요 여부

## auto off

- 승인된 pgg-add 산출물을 먼저 확인한다.
- 승인이 있을 때만 상세 계획을 작성한다.
- pgg-code로 넘어가기 전에 승인을 요구한다.
- 설계 승인 미완료이면 pgg-add로 routing한다.

## auto on

- 최적 구현 전략을 추론한다.
- 전체 상세 계획을 자동 생성한다.
- version bump task를 포함한다.
- 가정, 불확실성, 병렬화 가능한 task, 예상 병목, 검증 명령어를 포함한다.

## pgg-performance 유도 조건

- 성능 기준이 요구사항에 포함되면 pgg-performance 후보로 표시한다.
- 응답 시간, 처리량, 메모리 사용량, 번들 크기, DB query 수가 중요하면 pgg-performance 후보로 표시한다.
- 대량 데이터, 반복 처리, 네트워크 요청, 캐싱, 동시성, 파일 처리 변경이 있으면 pgg-performance 후보로 표시한다.
- pgg-code 이후 benchmark가 필요할 수 있으면 pgg-performance 후보로 표시한다.
- 성능 기준이 있다면 측정 대상, 측정 지표, baseline 또는 baseline 측정 방법, 성공/실패 기준, pgg-performance 실행 필요 여부를 기록한다.

## commit 규칙

- `pgg git = on`이고 git repository이면 pgg-plan 산출물을 commit할 수 있다.
- commit message 형식은 `{convention}. {version} {message}`이다.
- 예: `feat. 1.3.0 add pgg implementation plan for login-flow`
- `pgg git = off`이면 commit하지 않는다.

## Completion Message

- 정상 완료 추천 next flow는 `pgg-code`이다.
- 설계 승인 미완료 추천 next flow는 `pgg-add`이다.
- 계획 불충분 추천 next flow는 `pgg-plan`이다.
- 마지막 문장은 반드시 `다음 flow를 실행하세요: pgg-code`, `다음 flow를 실행하세요: pgg-add`, `다음 flow를 실행하세요: pgg-plan` 중 하나여야 한다.

## Expert Roster

- 소프트웨어 아키텍트: 구현 전략, spec 경계, 시스템 영향
- 도메인 전문가: domain constraint와 용어 정합성

## 공통 Skill 정의

- Skill ID: `pgg-plan`
- Skill 이름: PGG Plan
- 목적: `pgg-plan`은 승인된 요구사항과 설계를 상세한 구현 계획으로 바꾸는 Skill이다. 산출물은 junior engineer가 프로젝트 맥락 없이도 그대로 따라갈 수 있을 만큼 정확한 파일 경로, 완전한 코드 또는 코드 작성 지시, 검증 단계, 예상 결과, 실패 시 확인 항목을 포함해야 한다.
- 대상 에이전트: 승인된 pgg-add 산출물을 읽고 구현 전략, 검증 전략, test plan, version bump task, 2~5분 단위 task를 설계하는 AI 개발 에이전트.

### Trigger 조건

- `pgg-add` 산출물이 승인된 뒤에만 실행한다.
- `auto off`에서 pgg-add 승인이 없으면 구현 계획을 생성하지 않고 승인을 요청한다.
- 승인 전에는 구현 task를 생성하지 않는다.

### 입력

- `poggn/active/{topic_name}/state.json`
- 승인된 `pgg-add` 산출물과 acceptance criteria
- repository discovery 결과와 기존 project verification contract
- pgg-add에서 결정한 currentVersion, targetVersion, bumpType, convention, versionReason, versionSource
- `auto` mode, `teams` mode, `pgg git` mode

### 출력

- `poggn/active/{topic_name}/pgg-plan/plan.md`
- `poggn/active/{topic_name}/pgg-plan/task.md`
- `poggn/active/{topic_name}/pgg-plan/spec/*/*.md`
- `poggn/active/{topic_name}/pgg-plan/reviews/plan.review.md`
- `poggn/active/{topic_name}/pgg-plan/reviews/task.review.md`
- 승인된 설계 요약, topic_name, active path, version metadata, 검증 전략, test plan, 생성할 테스트 목록, 성공/실패 기준, 경계값/예외/회귀/성능 기준
- version bump task와 2~5분 단위 task 목록
- `poggn/active/{topic_name}/metrics/token-usage.jsonl` token 기록

### 절대 규칙

- `poggn/active/{topic_name}/state.json`을 반드시 읽는다.
- pgg-plan 산출물은 `poggn/active/{topic_name}/pgg-plan/` 아래에 저장한다.
- `auto off`에서는 승인된 pgg-add 산출물이 없으면 계획과 task를 생성하지 않는다.
- 구현 코드를 실제 project file에 적용하지 않는다.
- 각 task는 2~5분 내 완료 가능한 크기, 정확한 파일 경로, 필요한 경우 완전한 코드, 검증 단계, 예상 결과, 실패 시 확인 항목을 포함한다.
- `적절히 구현`, `필요한 로직 추가`, `일반적인 방식으로 처리` 같은 모호한 표현을 쓰지 않는다.
- pgg-add에서 결정한 version 정보를 사용하고 project version을 targetVersion으로 올리는 명시적 task를 포함한다.
- 성능 기준이 있으면 측정 대상, 지표, baseline 또는 baseline 측정 방법, 성공/실패 기준, pgg-performance 실행 필요 여부를 포함한다.

### 금지 패턴

- 승인되지 않은 pgg-add 산출물을 근거로 task 생성
- `state.json`을 읽지 않고 version이나 approval 상태 추정
- root `plan.md`/`task.md`만 생성하고 `pgg-plan/` 산출물을 누락
- 2~5분보다 큰 task 또는 파일 경로 없는 task
- 검증 단계, 예상 결과, 실패 시 확인 항목 없는 task
- version bump task 누락
- 성능 민감 변경인데 pgg-performance 후보 판단 누락

### Mode-Specific Behavior

#### auto off

- 승인된 pgg-add 산출물을 먼저 확인한다.
- 승인되지 않았다면 계획이나 구현 task를 만들지 않고 승인 요청으로 멈춘다.
- 상세 검증 전략, test plan, 생성할 테스트, 성공/실패 기준, 경계값/예외/회귀/성능 기준, version bump task, 2~5분 task를 작성한다.
- 구현 단계로 넘어가기 전에 승인을 요구한다.
- 정상 완료 시 마지막 문장은 `다음 flow를 실행하세요: pgg-code`이고, 설계 승인 미완료 시 `다음 flow를 실행하세요: pgg-add`이다.

#### auto on

- 최적 구현 전략을 추론한다.
- 전체 상세 계획을 자동 생성한다.
- version bump task를 포함한다.
- 가정, 불확실성, 병렬화 가능한 task, 예상 병목, 검증 명령어를 포함한다.

#### teams off

- `teams off`에서는 단일 에이전트가 승인 확인, 계획 작성, task review를 수행한다.

#### teams on

- `teams on`이고 환경이 지원하면 software architect와 domain expert 관점의 bounded review를 task별 fresh subagent에 위임할 수 있다.
- subagent는 구현하지 않고 task 명확성, spec 경계, domain constraint, 검증 기준만 review한다.

### 필수 단계

- 1. 승인된 pgg-add 산출물을 확인한다.
- 2. `poggn/active/{topic_name}/state.json`을 읽는다.
- 3. 검증 전략을 수립한다.
- 4. test plan을 작성한다.
- 5. 어떤 테스트를 만들지 결정한다.
- 6. 성공/실패 기준을 정의한다.
- 7. 경계값, 예외, 회귀, 성능 기준을 정의한다.
- 8. version bump task를 작성한다.
- 9. 구현을 2~5분 단위 task로 쪼갠다.

### Version Plan

- pgg-add가 결정한 currentVersion, targetVersion, bumpType, convention, versionReason, versionSource를 그대로 사용한다.
- package.json이 versionSource이면 `package.json`의 version을 targetVersion으로 수정하는 task를 포함한다.
- package.json이 versionSource가 아니면 기존 프로젝트의 versionSource 파일을 사용한다.
- version bump task 검증은 version source의 version 값이 targetVersion과 일치하는지 확인한다.

### Task 작성 규칙

- 각 task는 2~5분 내 완료 가능한 단일 변경이어야 한다.
- 각 task는 파일 경로를 정확히 적는다.
- 필요한 경우 붙여 넣을 수 있는 완전한 코드 또는 코드 작성 지시를 포함한다.
- 각 task는 검증 단계, 예상 결과, 실패 시 확인할 항목을 포함한다.
- 모호한 표현인 `적절히 구현`, `필요한 로직 추가`, `일반적인 방식으로 처리`를 사용하지 않는다.

### pgg-performance 유도 조건

- 성능 기준이 요구사항에 포함되면 pgg-performance 후보로 표시한다.
- 응답 시간, 처리량, 메모리 사용량, 번들 크기, DB query 수가 중요하면 pgg-performance 후보로 표시한다.
- 대량 데이터, 반복 처리, 네트워크 요청, 캐싱, 동시성, 파일 처리 변경이 있으면 pgg-performance 후보로 표시한다.
- pgg-code 이후 benchmark가 필요할 수 있으면 pgg-performance 후보로 표시한다.
- 성능 기준이 있으면 측정 대상, 측정 지표, baseline 또는 baseline 측정 방법, 성공/실패 기준, pgg-performance 실행 필요 여부를 기록한다.

### Commit 규칙

- `pgg git = on`이고 git repository이면 pgg-plan 산출물을 commit할 수 있다.
- commit message 형식은 `{convention}. {version} {message}`이다.
- 예: `feat. 1.3.0 add pgg implementation plan for login-flow`
- `pgg git = off`이면 commit하지 않는다.

### 필수 단계

- 승인된 pgg-add 산출물 확인
- `state.json` 읽기와 version metadata 확인
- 검증 전략 수립
- test plan과 생성할 테스트 목록 작성
- 성공/실패, 경계값, 예외, 회귀, 성능 기준 정의
- version bump task 작성
- 2~5분 단위 task 분해
- approval gate 확인

### 승인 Gate

- `auto off`에서는 pgg-add 승인 전 계획을 생성하지 않는다.
- `auto off`에서는 plan 승인 전 `pgg-code`로 진행하지 않는다.
- 설계 승인 미완료 시 마지막 문장은 `다음 flow를 실행하세요: pgg-add`이다.
- 계획이 불충분하면 마지막 문장은 `다음 flow를 실행하세요: pgg-plan`이다.
- 정상 완료와 계획 승인 완료 시 마지막 문장은 `다음 flow를 실행하세요: pgg-code`이다.

### 검증 요구사항

- 산출물이 `poggn/active/{topic_name}/pgg-plan/` 아래에 있는지 확인한다.
- currentVersion, targetVersion, bumpType, convention, versionReason, versionSource가 plan에 포함되었는지 확인한다.
- version bump task가 있고 versionSource를 targetVersion으로 올리도록 지시하는지 확인한다.
- 모든 acceptance criteria가 task 또는 verification step에 연결되었는지 확인한다.
- 각 task가 파일 경로, 완전한 코드 또는 코드 작성 지시, 검증 단계, 예상 결과, 실패 시 확인 항목을 포함하는지 확인한다.
- 성능 민감 조건이 있으면 pgg-performance 필요 여부와 측정 기준이 포함되었는지 확인한다.
- completion message 마지막 문장이 허용된 next flow 문장인지 확인한다.

### Review 요구사항

- plan review는 구현 전략, dependency, blast radius, version bump 적합성을 검토한다.
- task review는 2~5분 크기, 파일 경로 정확성, 코드 지시 완전성, 검증 가능성을 검토한다.
- test coverage가 acceptance criteria, 경계값, 예외, 회귀, 성능 기준을 충분히 다루는지 검토한다.
- review 문서에는 software architect와 domain expert 관점의 attribution을 남긴다.

### 완료 메시지 규격

모든 flow 완료 시 `# PGG Flow 완료 보고서` 형식의 구조화된 completion message를 출력한다.
보고서는 Flow ID, 상태, Mode, Teams Mode, PGG Git, Topic, Version, 실행 요약을 포함한다.
주요 산출물, POGGN Workspace, 생성/수정된 파일, Token 기록, Git 결과, Version 결과, 검증 결과, 남은 위험, 남은 불확실성, 다음 Flow를 포함한다.
마지막 문장은 정확히 `다음 flow를 실행하세요: <next-flow-id>`여야 하며, 그 뒤에는 아무것도 출력하지 않는다.

### Token Accounting 요구사항

모든 flow는 LLM이 생성하거나 수정한 파일의 token count를 기록한다.
기본 저장 위치는 `poggn/active/{topic_name}/metrics/token-usage.jsonl`이다.
record는 runId, flowId, taskId, filePath, operation, source, tokenCount, tokenizer, isEstimated, charCount, byteCount, lineCount, contentSha256, commitSha, measuredAt을 포함한다.
token record는 나중에 data로 사용할 수 있는 JSONL 구조여야 한다.

### Next Flow Routing

- 정상 완료: `pgg-plan` -> `pgg-code`.
- 설계 승인 미완료: `pgg-plan` -> `pgg-add`.
- 계획 불충분: `pgg-plan` -> `pgg-plan`.
- 마지막 문장은 `다음 flow를 실행하세요: pgg-code`, `다음 flow를 실행하세요: pgg-add`, `다음 flow를 실행하세요: pgg-plan` 중 하나여야 한다.

### 성능 측정 유도 기준

- 성능 기준이 요구사항에 포함되면 pgg-performance 후보로 표시한다.
- 응답 시간, 처리량, 메모리 사용량, 번들 크기, DB query 수가 중요하면 pgg-performance 후보로 표시한다.
- 대량 데이터, 반복 처리, 네트워크 요청, 캐싱, 동시성, 파일 처리 변경이 있으면 pgg-performance 후보로 표시한다.
- pgg-code 이후 benchmark가 필요할 수 있으면 pgg-performance 후보로 표시한다.
- 성능 기준이 있다면 측정 대상, 측정 지표, baseline 또는 baseline 측정 방법, 성능 성공/실패 기준, pgg-performance 실행 필요 여부를 포함한다.

### POGGN Workspace 요구사항

- `pgg-add`가 시작되면 `topic_name`을 생성한다.
- PGG process artifact는 `poggn/active/{topic_name}` 아래에 저장한다.
- `pgg-qa` PASS 후 process artifact를 `poggn/archive/{topic_name}`으로 이동한다.
- application source file은 실제 project path에 생성하거나 수정한다.
- report, state, plan, QA report, token record, metrics는 active topic directory에 저장한다.

### pgg git mode 요구사항

- `pgg git = off`이면 branch 생성, commit, release branch 전환, working branch 삭제, push를 수행하지 않는다.
- `pgg git = on`이면 git 저장소 여부를 확인한다.
- git 저장소가 있으면 branch, commit, release, push 규칙을 적용한다.
- git 저장소가 없으면 git 작업을 생략하고 사유를 기록한다.

### Branch Lifecycle 요구사항

- `pgg-add`는 `pgg git = on`이고 git 저장소이면 working branch를 생성하거나 전환한다.
- 기존 branch naming policy가 있으면 사용하고, 없으면 `pgg/working/{topic_name}`을 사용한다.
- `pgg-qa` PASS 후 active artifact를 archive로 이동하고 final QA/archive commit을 생성한다.
- release branch는 기존 정책이 없으면 `release/{topic_name}-v{version}`을 사용한다.
- `pgg-qa` FAIL이면 archive 이동, release branch 전환, working branch 제거, push를 수행하지 않는다.

### Versioning 요구사항

- version format은 `x.x.x`이다.
- `major`는 breaking change, 기존 시스템 기능의 완전한 변경, public behavior의 큰 변경에 사용한다.
- `minor`는 기능 추가, 기능 삭제, 새 flow 추가, 비파괴적 기능 확장에 사용한다.
- `patch`는 bug fix, docs, tests, 동작 보존 refactor, 비파괴적 performance improvement, chore에 사용한다.
- core는 currentVersion, targetVersion, bumpType, convention, versionReason, versionSource, projectVersionUpdated, versionVerification을 표현해야 한다.

### Commit Message 요구사항

- 모든 PGG commit message는 `{convention}. {version} {message}` 형식을 따른다.
- 예: `feat. 1.3.0 rebuild pgg skill framework`
- push는 `pgg-qa` PASS 완료 전에는 수행하지 않는다.

### Archive 요구사항

- `pgg-qa` PASS 전에는 active artifact를 archive로 이동하지 않는다.
- PASS 후 `poggn/active/{topic_name}`을 `poggn/archive/{topic_name}`으로 이동한다.
- archive 상태, QA 결과, version 결과, git 결과를 final state에 남긴다.

### QA 요구사항

- QA는 acceptance criteria, generated docs, tests, version, token accounting, POGGN workspace, git outcome을 검증한다.
- PASS가 아니면 release branch 전환, archive 이동, working branch 제거, push를 수행하지 않는다.
- 실패한 검증 명령과 실패 로그 요약을 completion message에 기록한다.

### 생성 문서 섹션

- pgg-plan 목적
- 승인된 설계 필요 조건
- active workspace 사용
- 검증 전략
- test plan
- 테스트 선택
- 성공/실패 기준
- 경계값/예외/회귀/성능 기준
- version bump task
- 2~5분 task 규칙
- 파일 경로/완전한 코드/검증 단계 요구사항
- pgg-performance 유도 조건
- completion message 규격
- completionMessageContract
- token accounting 규칙
- commit 규칙
- next flow routing

## Language Contract

- 이 skill이 작성하는 pgg 문서, state/history 문구, review/QA 산출물은 `.pgg/project.json`의 `language` 값을 따른다.
- 이 skill이 생성하거나 수정하는 pgg-managed 코드 주석은 `pgg lang`을 따른다.
- 사용자가 작성한 기존 코드 주석은 해당 task 범위에서 수정하는 경우에만 언어 계약을 적용한다.
