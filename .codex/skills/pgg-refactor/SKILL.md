---
name: "pgg-refactor"
description: "동작 변경 없이 코드 구조를 개선한다."
---

# Skill: pgg-refactor

## Purpose

`pgg-refactor`는 기능 변경 없이 코드 구조를 개선하는 Skill이다.
before / after 동작은 반드시 동일해야 한다. 동작이 바뀌면 refactor가 아니다.
pgg-refactor 산출물은 `poggn/active/{topic_name}/pgg-refactor/` 아래에 저장한다.

## 기본 flow 위치

- 기본 flow: `pgg-add` -> `pgg-plan` -> `pgg-code` -> `pgg-refactor` -> `pgg-qa`
- pgg-code 정상 완료 후 기본 next flow는 `pgg-refactor`이다.
- pgg-refactor 정상 완료 후 기본 next flow는 `pgg-qa`이다.

## 절대 규칙

- 동작 변경 금지.
- before / after 결과는 동일해야 한다.
- 새로운 feature를 추가하지 않는다.
- Acceptance Criteria를 변경하지 않는다.
- verification은 필수다.
- 동작이 바뀌면 완료하지 않고 pgg-refactor 또는 pgg-code로 되돌린다.
- generated Markdown은 TypeScript Skill 정의와 generator에서만 갱신하고 직접 patch하지 않는다.

## 필수 개선 범주

- 구조 개선
- 중복 제거
- 성능 개선 또는 성능 영향 여부
- 가독성 분리
- 책임 분리

## 필수 workflow

1. 현재 동작을 캡처하거나 정의한다.
2. 가능하다면 refactor 전 기존 테스트를 실행한다.
3. refactoring만 수행한다.
4. refactor 후 동일한 테스트를 다시 실행한다.
5. before / after 동작을 비교한다.
6. diff를 확인하여 feature change가 없는지 검토한다.
7. token을 기록한다.
8. verification 결과를 보고한다.

## before / after 동일성

- 현재 동작은 관찰 가능한 입력, 출력, 오류, generated output, CLI/API 결과로 정의한다.
- before와 after는 가능한 한 동일한 명령과 동일한 fixture로 비교한다.
- 테스트가 부족하면 부족한 근거를 명시하고 수동 비교 또는 snapshot 비교를 보강한다.
- 비교 결과가 달라지면 refactor를 완료하지 않는다.

## diff inspection

- diff에 feature 추가가 없는지 확인한다.
- Acceptance Criteria가 변경되지 않았는지 확인한다.
- public API break 여부를 확인한다.
- generated Markdown을 직접 수정하지 않았는지 확인한다.
- unrelated cleanup이 섞이지 않았는지 확인한다.
- diff report 파일은 `poggn/active/{topic_name}/pgg-refactor/` 아래에 저장한다.

## pgg-performance 유도 조건

- 성능 개선이 refactor 목적 중 하나이면 pgg-performance를 추천한다.
- 알고리즘, 반복문, DB query, 캐싱, 동시성, 파일 처리, 번들 크기 관련 변경이면 pgg-performance를 추천한다.
- before / after 성능 비교가 필요하면 pgg-performance를 추천한다.
- pgg-qa에서 성능 근거 부족 가능성이 있으면 pgg-performance를 추천한다.

## Token Accounting

- 기록 위치는 `poggn/active/{topic_name}/metrics/token-usage.jsonl`이다.
- refactor 산출물과 실제 refactor 변경사항의 token count를 기록한다.
- before / after 비교 파일 또는 diff report 파일이 생성되면 해당 파일도 기록한다.
- commit이 생성되면 token record에 commitSha를 연결한다.

## Commit 규칙

- pgg git = on이고 git 저장소이면 refactor 산출물과 실제 refactor 변경사항을 commit할 수 있다.
- commit message 형식은 `{convention}. {version} {message}`이다.
- 예: `refactor. 1.3.1 simplify login validation structure`
- verification, before / after 비교, diff inspection, token 기록 후 commit한다.
- pgg git = off이면 commit하지 않는다.
- push는 하지 않는다.

## Completion Message

- refactor 대상을 포함한다.
- 변경 전 동작 정의를 포함한다.
- 변경 후 동작 보존 근거를 포함한다.
- 구조 개선, 중복 제거, 성능 개선 또는 성능 영향 여부, 가독성 개선, 책임 분리 내용을 포함한다.
- 실행한 테스트, before / after 비교 결과, diff inspection 결과, token 기록, pgg-performance 필요 여부, 다음 flow 추천을 포함한다.
- 정상 완료의 마지막 문장은 정확히 `다음 flow를 실행하세요: pgg-qa`이다.
- 성능 재측정 필요 시 마지막 문장은 정확히 `다음 flow를 실행하세요: pgg-performance`이다.
- refactor 실패 또는 동작 변경 발생 시 마지막 문장은 정확히 `다음 flow를 실행하세요: pgg-refactor`이다.
- 구현 수정 필요 시 마지막 문장은 정확히 `다음 flow를 실행하세요: pgg-code`이다.
- 마지막 문장 뒤에는 아무것도 출력하지 않는다.

## Expert Roster

- 소프트웨어 아키텍트: 구조 경계와 단순화 판단
- 코드 리뷰어: 회귀와 hidden behavior change 검토

## 공통 Skill 정의

- Skill ID: `pgg-refactor`
- Skill 이름: PGG Refactor
- 목적: `pgg-refactor`는 기능 변경 없이 코드 구조를 개선하는 Skill이다. 동작 변경 없이 구조 개선, 중복 제거, 성능 영향 검토, 가독성 분리, 책임 분리를 수행하고 before / after 결과가 동일함을 증명한다.
- 대상 에이전트: `pgg-code` PASS 결과를 기준으로 실제 project path를 리팩터링하되 Acceptance Criteria와 public behavior를 바꾸지 않는 AI 개발 에이전트. refactor 산출물을 `poggn/active/{topic_name}/pgg-refactor/` 아래에 남기고 verification, before / after 비교, diff inspection, token accounting을 닫힌 loop로 완료한다.

### Trigger 조건

- 기본 flow 위치는 `pgg-add` -> `pgg-plan` -> `pgg-code` -> `pgg-refactor` -> `pgg-qa`이다.
- `pgg-code`가 정상 완료된 뒤 기본 next flow로 실행한다.
- `pgg-code` 산출물, 현재 tests, Acceptance Criteria, version metadata, pggGit 상태를 확인한 뒤 시작한다.
- 동작 변경이나 feature 추가가 필요하면 refactor를 진행하지 않고 `pgg-code`로 되돌린다.

### 입력

- `poggn/active/{topic_name}/state.json`
- `poggn/active/{topic_name}/pgg-code/` 아래의 구현 결과, 테스트 결과, 실패 로그 분석, review 결과, verify 결과
- `poggn/active/{topic_name}/pgg-plan/` 아래의 승인된 Acceptance Criteria와 검증 전략
- 작업 전 테스트 명령, 현재 동작 정의, before baseline, git diff
- public API constraints, generated docs provenance, 사용자 변경사항이 포함된 dirty worktree baseline

### 출력

- `poggn/active/{topic_name}/pgg-refactor/` 아래의 refactor report, before / after 비교 결과, diff inspection 결과, verification 결과
- refactor 대상과 변경 전 동작 정의
- 변경 후 동작 보존 근거
- 구조 개선, 중복 제거, 성능 개선 또는 성능 영향 여부, 가독성 개선, 책임 분리 내용
- 실행한 테스트와 before / after 동일성 결과
- `poggn/active/{topic_name}/metrics/token-usage.jsonl`의 refactor token record
- pgg-performance 필요 여부와 다음 flow 추천

### 절대 규칙

- 동작 변경 금지.
- before / after 결과는 동일해야 한다.
- 새로운 feature를 추가하지 않는다.
- Acceptance Criteria를 변경하지 않는다.
- verification은 필수다.
- 동작이 바뀌면 refactor가 아니다.
- generated Markdown은 TypeScript Skill 정의와 generator에서만 갱신하고 직접 patch하지 않는다.
- refactor 산출물은 `poggn/active/{topic_name}/pgg-refactor/` 아래에 저장한다.
- 기존 사용자 변경사항을 덮어쓰지 않고 refactor와 무관한 파일을 commit하지 않는다.

### 금지 패턴

- 동작 변경을 refactor로 포장
- 새 feature 추가
- Acceptance Criteria 수정
- before baseline 없이 after만 테스트
- 테스트 실패를 무시하고 구조 개선 완료 처리
- 성능 개선을 주장하지만 before / after 성능 근거를 남기지 않음
- unrelated cleanup이나 public API break를 섞음
- generated Markdown 직접 수정

### Mode-Specific Behavior

#### auto off

- refactor 범위, 현재 동작 정의, 실행할 before / after 테스트를 먼저 제시한다.
- public API 변경, Acceptance Criteria 변경, feature 추가가 필요하면 refactor를 중단하고 사용자 승인을 요청한 뒤 `pgg-code`로 되돌린다.
- 완료 시 refactor 대상, 테스트 결과, diff inspection 결과, token 기록, pgg-performance 필요 여부를 보고한다.

#### auto on

- 승인된 동작 범위 안에서 refactor만 자율적으로 수행한다.
- before baseline과 after result를 비교할 수 없으면 불확실성을 기록하고 가능한 검증을 보강한다.
- 동작 변경 위험이 발견되면 완료하지 않고 `pgg-refactor` 또는 `pgg-code`로 route한다.

#### teams off

- `teams off`에서는 단일 에이전트가 현재 동작 캡처, before 테스트, refactor, after 테스트, 비교, diff inspection, token 기록을 수행한다.
- 단일 에이전트라도 동작 보존 review와 구조 품질 review를 분리해서 기록한다.

#### teams on

- `teams on`이고 환경이 지원하면 소프트웨어 아키텍트와 코드 리뷰어 관점의 bounded review를 fresh subagent에 위임할 수 있다.
- subagent는 feature 추가나 동작 변경을 제안하지 않고 구조 개선, 중복 제거, 책임 분리, 회귀 위험만 review한다.

### 필수 workflow

- 1. 현재 동작을 캡처하거나 정의한다.
- 2. 가능하다면 refactor 전 기존 테스트를 실행한다.
- 3. refactoring만 수행한다.
- 4. refactor 후 동일한 테스트를 다시 실행한다.
- 5. before / after 동작을 비교한다.
- 6. diff를 확인하여 feature change가 없는지 검토한다.
- 7. token을 기록한다.
- 8. verification 결과를 보고한다.

### 필수 개선 범주

- 구조 개선을 검토하고 수행한다.
- 중복 제거를 검토하고 수행한다.
- 성능 개선 또는 성능 영향 여부를 판단한다.
- 가독성 분리를 검토하고 수행한다.
- 책임 분리를 검토하고 수행한다.

### before / after 동일성

- 현재 동작 정의는 관찰 가능한 입력, 출력, 오류, generated output, CLI/API 결과를 포함한다.
- before와 after는 가능한 한 동일한 명령과 동일한 fixture로 비교한다.
- 테스트가 부족하면 부족한 근거를 명시하고 수동 비교 또는 snapshot 비교를 보강한다.
- 비교 결과가 달라지면 refactor를 완료하지 않는다.

### diff inspection

- diff inspection은 feature 추가, Acceptance Criteria 변경, public API break, generated Markdown 직접 수정, unrelated cleanup 여부를 확인한다.
- diff report 파일을 생성하면 `poggn/active/{topic_name}/pgg-refactor/` 아래에 저장한다.
- before / after 비교 파일이나 diff report 파일이 생성되면 token 기록 대상에 포함한다.

### pgg-performance 유도 조건

- 성능 개선이 refactor 목적 중 하나이면 pgg-performance를 next flow 후보로 추천한다.
- 알고리즘, 반복문, DB query, 캐싱, 동시성, 파일 처리, 번들 크기 관련 변경이면 pgg-performance를 추천한다.
- before / after 성능 비교가 필요하면 pgg-performance를 추천한다.
- pgg-qa에서 성능 근거 부족 가능성이 있으면 pgg-performance를 추천한다.

### 완료 산출물

- refactor 대상을 포함한다.
- 변경 전 동작 정의를 포함한다.
- 변경 후 동작 보존 근거를 포함한다.
- 구조 개선, 중복 제거, 성능 개선 또는 성능 영향 여부, 가독성 개선, 책임 분리 내용을 포함한다.
- 실행한 테스트, before / after 비교 결과, diff inspection 결과를 포함한다.
- token 기록, pgg-performance 필요 여부, 다음 flow 추천을 포함한다.

### 필수 단계

- state와 pgg-code 산출물 확인
- refactor 대상과 현재 동작 정의
- 가능한 refactor 전 테스트 실행
- 동작 보존 refactoring 수행
- 동일 테스트 재실행
- before / after 비교
- feature change 금지 diff inspection
- token 기록
- final verify와 pgg-performance 필요 여부 판단
- completion message 작성

### 승인 Gate

- auto off에서는 refactor 범위와 before / after 검증 방법이 명확해진 뒤 변경한다.
- Acceptance Criteria 변경, public API 변경, feature 추가가 필요하면 refactor를 중단하고 `pgg-code`로 route한다.
- before / after 동일성이 깨지면 완료하지 않고 `pgg-refactor`로 route한다.

### 검증 요구사항

- typecheck를 실행한다. 저장소에 별도 typecheck script가 없으면 `pnpm build` 또는 실제 package script를 사용한다.
- refactor 전 실행한 테스트와 동일한 테스트를 refactor 후 다시 실행한다.
- 관련 테스트를 실행한다.
- docs generation을 실행한다.
- docs generation을 재실행해 안정성을 확인한다.
- before / after 비교 결과가 동일한지 확인한다.
- diff inspection에서 feature change, Acceptance Criteria 변경, generated Markdown 직접 수정이 없는지 확인한다.
- token 기록이 `poggn/active/{topic_name}/metrics/token-usage.jsonl`에 남았는지 확인한다.

### Review 요구사항

- 동작 보존 review는 before / after 결과 동일성, Acceptance Criteria 불변, public API 불변을 확인한다.
- 구조 품질 review는 구조 개선, 중복 제거, 성능 영향, 가독성 분리, 책임 분리, 불필요한 추상화 여부를 확인한다.
- diff inspection review는 feature change 금지, unrelated cleanup 금지, generated Markdown 직접 수정 금지를 확인한다.
- 성능 관련 변경이면 pgg-performance 추천 여부를 review한다.

### 완료 메시지 규격

완료 메시지는 refactor 대상, 변경 전 동작 정의, 변경 후 동작 보존 근거를 포함한다.
완료 메시지는 구조 개선, 중복 제거, 성능 개선 또는 성능 영향 여부, 가독성 개선, 책임 분리 내용을 포함한다.
완료 메시지는 실행한 테스트, before / after 비교 결과, diff inspection 결과, token 기록, pgg-performance 필요 여부, 다음 flow 추천을 포함한다.
정상 완료의 마지막 문장은 정확히 `다음 flow를 실행하세요: pgg-qa`이다.
성능 재측정 필요 시 마지막 문장은 정확히 `다음 flow를 실행하세요: pgg-performance`이다.
refactor 실패 또는 동작 변경 발생 시 마지막 문장은 정확히 `다음 flow를 실행하세요: pgg-refactor`이다.
구현 수정 필요 시 마지막 문장은 정확히 `다음 flow를 실행하세요: pgg-code`이다.
마지막 문장 뒤에는 아무것도 출력하지 않는다.

### Token Accounting 요구사항

기록 위치는 `poggn/active/{topic_name}/metrics/token-usage.jsonl`이다.
record는 runId, flowId, taskId, filePath, operation, source, tokenCount, tokenizer, isEstimated, charCount, byteCount, lineCount, contentSha256, commitSha, measuredAt을 포함한다.
refactor 산출물과 실제 refactor 변경사항의 token count를 기록한다.
before / after 비교 파일 또는 diff report 파일이 생성되면 해당 파일도 기록 대상이다.
commit이 생성되면 token record에 commitSha를 연결한다.

### Next Flow Routing

- 정상 완료: `pgg-refactor` -> `pgg-qa`.
- 성능 재측정 필요: `pgg-refactor` -> `pgg-performance`.
- refactor 실패 또는 동작 변경 발생: `pgg-refactor` -> `pgg-refactor`.
- 구현 수정 필요: `pgg-refactor` -> `pgg-code`.
- 마지막 문장은 `다음 flow를 실행하세요: pgg-qa`, `다음 flow를 실행하세요: pgg-performance`, `다음 flow를 실행하세요: pgg-refactor`, `다음 flow를 실행하세요: pgg-code` 중 하나여야 한다.

### 성능 측정 유도 기준

- 성능 개선이 refactor 목적 중 하나이면 pgg-performance를 next flow 후보로 추천한다.
- 알고리즘, 반복문, DB query, 캐싱, 동시성, 파일 처리, 번들 크기 관련 변경이면 pgg-performance를 next flow 후보로 추천한다.
- before / after 성능 비교가 필요하면 pgg-performance를 next flow 후보로 추천한다.
- pgg-qa에서 성능 근거 부족 가능성이 있으면 pgg-performance를 next flow 후보로 추천한다.

### POGGN Workspace 요구사항

- `pgg-add`가 시작되면 `topic_name`을 생성한다.
- PGG process artifact는 `poggn/active/{topic_name}` 아래에 저장한다.
- `pgg-qa` PASS 후 process artifact를 `poggn/archive/{topic_name}`으로 이동한다.
- application source file은 실제 project path에 생성하거나 수정한다.
- report, state, plan, QA report, token record, metrics는 active topic directory에 저장한다.

### pgg git mode 요구사항

- `pgg git = off`이면 refactor commit을 만들지 않고 생략 사유를 기록한다.
- `pgg git = on`이면 git 저장소 여부를 확인한다.
- git 저장소이면 refactor 산출물과 실제 refactor 변경사항을 commit할 수 있다.
- commit은 verification, before / after 비교, diff inspection, token 기록이 완료된 뒤에만 생성한다.
- git 저장소가 없으면 commit을 생략하고 사유를 기록한다.
- push는 하지 않는다.

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

- pgg git = on이고 git 저장소이면 refactor 산출물과 실제 refactor 변경사항을 commit할 수 있다.
- commit message 형식은 `{convention}. {version} {message}`이다.
- 예: `refactor. 1.3.1 simplify login validation structure`
- commit에는 refactor와 무관한 파일을 포함하지 않는다.
- verification, before / after 비교, diff inspection, token 기록 후 commit 순서를 지킨다.
- pgg git = off이면 commit하지 않는다.

### Archive 요구사항

- `pgg-qa` PASS 전에는 active artifact를 archive로 이동하지 않는다.
- PASS 후 `poggn/active/{topic_name}`을 `poggn/archive/{topic_name}`으로 이동한다.
- archive 상태, QA 결과, version 결과, git 결과를 final state에 남긴다.

### QA 요구사항

- QA는 acceptance criteria, generated docs, tests, version, token accounting, POGGN workspace, git outcome을 검증한다.
- PASS가 아니면 release branch 전환, archive 이동, working branch 제거, push를 수행하지 않는다.
- 실패한 검증 명령과 실패 로그 요약을 completion message에 기록한다.

### 생성 문서 섹션

- pgg-refactor 목적
- 기본 flow 위치
- 동작 보존
- before / after 동일성
- feature change 금지
- 구조 개선
- 중복 제거
- 성능 개선
- 가독성 분리
- 책임 분리
- diff inspection
- pgg-performance 유도 조건
- final verify
- completion message 규격
- completionMessageContract
- token accounting 규칙
- commit 규칙
- next flow routing

## Language Contract

- 이 skill이 작성하는 pgg 문서, state/history 문구, review/QA 산출물은 `.pgg/project.json`의 `language` 값을 따른다.
- 이 skill이 생성하거나 수정하는 pgg-managed 코드 주석은 `pgg lang`을 따른다.
- 사용자가 작성한 기존 코드 주석은 해당 task 범위에서 수정하는 경우에만 언어 계약을 적용한다.
