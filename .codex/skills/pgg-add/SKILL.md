---
name: "pgg-add"
description: "구현 전 요구사항을 발견하고 명세화한다."
---

# Skill: pgg-add

## Core Contract

- pgg-add는 요구사항을 발견하고 명세화하는 Skill이며, 코드를 작성하는 Skill이 아니다.
- 이 flow에서는 구현 코드, 테스트 코드, 마이그레이션, 설정 변경을 작성하지 않는다.
- 필수 단계는 요구 사항 수집, 기능 목적 정의, Acceptance Criteria 초안 작성, topic_name 생성, POGGN active workspace 생성, version 결정, pgg git on일 경우 working branch 생성이다.

## 코드 작성 금지

- 애플리케이션 소스코드를 생성하거나 수정하지 않는다.
- 테스트, migration, runtime 설정, 구현 patch를 만들지 않는다.
- 생성 가능한 파일은 active topic directory 아래의 PGG process artifact로 제한한다.

## topic_name 생성

- 사용자 요청과 기능 목적을 기준으로 topic_name을 만든다.
- 사람이 이해 가능한 lowercase kebab-case slug를 사용한다.
- 공백은 hyphen으로 바꾼다.
- 충돌 시 runId 또는 timestamp를 추가한다.
- 예: `login-flow`, `auth-session-refresh`, `checkout-payment-validation`

## POGGN active workspace 생성

- pgg-add가 시작되면 `poggn/active/{topic_name}`을 생성한다.
- 권장 파일: `state.json`, `pgg-add/requirements.md`, `pgg-add/acceptance-criteria.md`, `metrics/token-usage.jsonl`
- PGG process artifact는 반드시 active topic directory 하위에 저장한다.
- 애플리케이션 소스코드는 실제 project path에 남지만 pgg-add는 생성하거나 수정하지 않는다.

## version 결정

- currentVersion은 기존 version source에서 읽는다. npm library는 기본적으로 `package.json` version을 사용한다.
- targetVersion은 x.x.x semver로 결정한다.
- major: breaking change, 기존 시스템 기능의 완전한 변경, public behavior의 큰 변경.
- minor: 기능 추가, 기능 삭제, 새로운 flow 추가, 비파괴적 기능 확장.
- patch: bug fix, 문서 수정, 테스트 수정, 동작 보존 refactor, 비파괴적 성능 개선, chore.
- currentVersion, targetVersion, bumpType, convention, reason, versionSource를 출력한다.

## pgg git mode

- `pgg git = off`이면 branch 생성, commit, push를 하지 않는다.
- `pgg git = on`이면 git repository인지 확인한다.
- git repository가 아니면 git 작업을 생략하고 사유를 기록한다.
- git repository이면 기존 branch naming policy를 사용하고, 없으면 `pgg/working/{topic_name}` working branch를 생성하거나 전환한다.
- `state.json`에는 pggGit, isGitRepository, baseBranch, workingBranch, topicName, currentVersion, targetVersion, bumpType, convention, activePath, archivePath를 기록한다.

## auto off 동작

- 구현 코드를 한 줄도 작성하지 않는다.
- 설계 출력이나 코드 작성 전에 반드시 소크라테스식 질문을 한다.
- 한 번에 최대 5개의 질문만 한다.
- 사용자 목표, 최소 동작, 실패 시 동작, 보안 제약, 데이터 저장 필요 여부, 권한 요구사항, 성공 조건, 제외 범위, 변경 규모, version bump 판단 근거를 드러낸다.
- 설계 출력은 작은 단위로 나누고 다음 단위로 넘어가기 전에 승인을 요구한다.

## auto on 동작

- 가능한 요구사항, 기능 목적, Acceptance Criteria 초안, topic_name, version bump를 자동 추론한다.
- 가정, 불확실성, 선택 이유를 포함한다.
- 정말 필요한 경우가 아니라면 blocking question을 하지 않는다.

## 소크라테스식 질문

1. 이 기능의 최소 동작은 무엇인가요?
2. 실패했을 때 사용자에게 어떤 일이 발생해야 하나요?
3. 이 기능이 절대 하면 안 되는 행동은 무엇인가요?
4. 어떤 데이터 저장, 인증, 권한, 보안 요구사항이 있나요?
5. 이 변경은 기존 동작을 깨뜨리나요, 기능 추가인가요, 버그 수정인가요?

## 승인 게이트

- auto off에서는 요구사항/명세 단위가 승인되기 전 pgg-plan으로 진행하지 않는다.
- 요구사항 불충분 또는 승인 미완료이면 pgg-add로 다시 routing한다.

## 필수 출력 섹션

- topic_name, active path, archive path
- 요구사항 수집 결과, 기능 목적, 포함 범위, 제외 범위, 가정, 리스크
- Acceptance Criteria 초안, 승인 상태
- currentVersion, targetVersion, bumpType, convention, versionReason
- pgg git 상태, working branch 정보
- pgg-performance 필요성 후보

## Acceptance Criteria 초안 작성 규칙

- 관찰 가능한 동작으로 작성한다.
- 정상 경로, 실패 경로, 제외 범위, 보안, 권한, 데이터 저장 기준을 필요에 따라 포함한다.
- 명확한 pass/fail 기준을 포함한다.
- 불확실한 기준은 가정 또는 질문으로 표시한다.

## commit 규칙

- `pgg git = on`이고 git repository이면 초기 POGGN workspace와 pgg-add 산출물을 commit할 수 있다.
- commit message 형식은 `{convention}. {version} {message}`이다.
- 예: `feat. 1.3.0 add pgg requirements for login-flow`
- `pgg git = off`이면 commit하지 않는다.

## pgg-performance 유도

- 요구사항에 성능, 속도, 최적화, 응답 시간, 처리량, 메모리 사용량이 포함되면 성능 요구사항으로 기록한다.
- 이후 pgg-plan 또는 pgg-code에서 pgg-performance 실행 필요성을 판단할 수 있도록 표시한다.

## Expert Roster

- 프로덕트 매니저: 문제 정의, 범위, 성공 기준
- UX/UI 전문가: 사용자 흐름과 상호작용 명확성

## Read

- 사용자 요구사항
- `.codex/add/WOKR-FLOW.md`
- `.codex/add/STATE-CONTRACT.md`
- `.codex/add/EXPERT-ROUTING.md`

## Write/Handoff

- `poggn/active/{topic_name}/state.json`
- `poggn/active/{topic_name}/pgg-add/requirements.md`
- `poggn/active/{topic_name}/pgg-add/acceptance-criteria.md`
- `poggn/active/{topic_name}/metrics/token-usage.jsonl`
- 기존 tooling이 요구하는 경우에만 compatibility 문서인 `proposal.md`, `reviews/proposal.review.md`, `state/current.md`를 함께 기록한다.

## 공통 Skill 정의

- Skill ID: `pgg-add`
- Skill 이름: PGG Add
- 목적: `pgg-add`는 요구사항을 발견하고 명세화하는 Skill이다. 코드를 작성하지 않고 요구사항 수집, 기능 목적 정의, Acceptance Criteria 초안 작성, topic_name 생성, POGGN active workspace 생성, version 결정, pgg git on일 때 working branch 생성을 수행한다.
- 대상 에이전트: 요구사항 발견, 제약 조건 도출, 초기 POGGN workspace/state 생성, version/git mode 결정을 수행하는 AI 개발 에이전트.

### Trigger 조건

- 새 기능, bug fix, 문서/테스트/리팩터링, migration, 성능 요구사항 등 새 PGG topic이 시작될 때 실행한다.
- 사용자 요청이 모호하더라도 구현을 시작하지 않고 요구사항 발견 flow로 진입한다.

### 입력

- 사용자 요청 원문
- 현재 repository 상태와 기존 legacy 분류
- 현재 version source. npm library는 기본적으로 `package.json` version을 사용한다.
- 기존 project/version/git/branch naming policy
- `auto` mode, `teams` mode, `pgg git` mode

### 출력

- `topic_name`
- `poggn/active/{topic_name}` active path
- `poggn/archive/{topic_name}` archive path
- 요구사항 수집 결과, 기능 목적, 포함 범위, 제외 범위, 가정, 리스크
- Acceptance Criteria 초안과 승인 상태
- currentVersion, targetVersion, bumpType, convention, versionReason, versionSource
- pgg git 상태, isGitRepository, baseBranch, workingBranch
- pgg-performance 필요성 후보
- `poggn/active/{topic_name}/metrics/token-usage.jsonl` token 기록

### 절대 규칙

- 구현 코드를 작성하면 안 된다.
- `auto off`에서는 사용자 승인 없이 다음 단계로 진행하면 안 된다.
- `auto off`에서는 설계 출력이나 코드 작성 전에 반드시 질문해야 한다.
- 단순히 `뭘 만들까요?`라고 묻지 않는다.
- 소크라테스식 질문으로 숨겨진 요구사항과 제약 조건을 끌어낸다.
- 설계 문서는 작은 단위로 나누어 보여주고, 각 단위마다 승인받은 뒤 다음 단계로 넘어간다.
- generated Markdown은 직접 수정하지 않고 TypeScript Skill 정의와 generator를 수정한다.

### 금지 패턴

- 구현 코드, 테스트 코드, migration, 설정 변경 작성
- 모호한 요청을 임의 확정하고 `pgg-plan`으로 이동
- 한 번에 많은 질문을 던지거나 단순히 `뭘 만들까요?`라고 질문
- topic 없이 PGG process artifact를 흩뿌리기
- version 결정 없이 산출물 완료 처리
- `pgg git = off`인데 branch/commit/push 수행
- `pgg git = on`이지만 git repository 여부나 branch naming policy를 확인하지 않음

### Mode-Specific Behavior

#### auto off

- `auto off`에서는 구현 코드를 한 줄도 작성하지 않는다.
- 먼저 최대 5개의 소크라테스식 질문을 한다.
- 질문은 사용자 목표, 최소 동작, 실패 시 동작, 보안 제약, 데이터 저장 필요 여부, 권한 요구사항, 성공 조건, 제외 범위, 변경 규모, version bump 판단 근거를 드러내야 한다.
- 설계 출력은 작은 단위로 나누고 각 단위마다 승인받기 전 다음 단위로 넘어가지 않는다.
- 승인 전 마지막 문장은 `다음 flow를 실행하세요: pgg-add`로 유지한다.

#### auto on

- `auto on`에서는 가능한 요구사항을 자동 추론한다.
- 기능 목적, Acceptance Criteria 초안, topic_name, version bump를 작성한다.
- 가정, 불확실성, 선택 이유를 명시한다.
- 정말 필요한 경우가 아니라면 blocking question을 하지 않는다.

#### teams off

- `teams off`에서는 단일 에이전트가 요구사항 발견, state 작성, review를 수행한다.

#### teams on

- `teams on`이고 환경이 지원하면 product manager와 UX/UI expert 관점의 bounded review를 task별 fresh subagent에 위임할 수 있다.
- subagent는 구현하지 않고 요구사항, 사용자 흐름, 제약 조건, acceptance criteria만 review한다.

### 필수 단계

- 1. 요구 사항 수집
- 2. 기능 목적 정의
- 3. Acceptance Criteria 초안 작성
- 4. topic_name 생성
- 5. POGGN active workspace 생성
- 6. version 결정
- 7. `pgg git = on`일 경우 working branch 생성 또는 전환

### 소크라테스식 질문

- 한 번에 최대 5개의 질문만 한다.
- 필수 질문 예시: 이 기능의 최소 동작은 무엇인가요?
- 필수 질문 예시: 실패했을 때 사용자에게 어떤 일이 발생해야 하나요?
- 필수 질문 예시: 이 기능이 절대 하면 안 되는 행동은 무엇인가요?
- 필수 질문 예시: 어떤 데이터 저장, 인증, 권한, 보안 요구사항이 있나요?
- 필수 질문 예시: 이 변경은 기존 동작을 깨뜨리나요, 기능 추가인가요, 버그 수정인가요?

### topic_name 생성

- 사용자 요청과 기능 목적을 기준으로 사람이 이해 가능한 slug를 만든다.
- 형식은 lowercase kebab-case다.
- 공백은 hyphen으로 바꾼다.
- 충돌 시 runId 또는 timestamp를 추가한다.
- 예: `login-flow`, `auth-session-refresh`, `checkout-payment-validation`

### POGGN active workspace

- `pgg-add`가 시작되면 `poggn/active/{topic_name}`을 생성한다.
- 권장 파일: `poggn/active/{topic_name}/state.json`
- 권장 파일: `poggn/active/{topic_name}/pgg-add/requirements.md`
- 권장 파일: `poggn/active/{topic_name}/pgg-add/acceptance-criteria.md`
- 권장 파일: `poggn/active/{topic_name}/metrics/token-usage.jsonl`
- PGG process artifact는 반드시 active topic directory 하위에 저장한다.

### Version 결정

- currentVersion은 기존 version source에서 읽는다.
- npm library는 기본적으로 `package.json` version을 사용한다.
- 산출물은 currentVersion, targetVersion, bumpType, convention, reason, versionSource를 포함한다.
- `major`: breaking change, 기존 시스템 기능의 완전한 변경, public behavior의 큰 변경.
- `minor`: 기능 추가, 기능 삭제, 새로운 flow 추가, 비파괴적 기능 확장.
- `patch`: bug fix, 문서/테스트 수정, 동작 보존 refactor, 비파괴적 성능 개선, chore.

### pgg git mode

- `pgg git = off`이면 branch 생성, commit, push를 하지 않고 완료 메시지에 비활성화 상태를 기록한다.
- `pgg git = on`이면 git repository 여부를 확인한다.
- git repository가 아니면 git 작업을 생략하고 사유를 기록한다.
- git repository이면 기존 branch naming policy를 사용하고, 없으면 `pgg/working/{topic_name}` working branch를 생성하거나 전환한다.
- `state.json`에는 pggGit, isGitRepository, baseBranch, workingBranch, topicName, currentVersion, targetVersion, bumpType, convention, activePath, archivePath를 기록한다.

### 필수 출력 섹션

- topic_name, active path, archive path
- 요구사항 수집 결과, 기능 목적, 포함 범위, 제외 범위, 가정, 리스크
- Acceptance Criteria 초안, 승인 상태
- currentVersion, targetVersion, bumpType, convention, versionReason
- pgg git 상태, working branch 정보
- pgg-performance 필요성 후보

### Acceptance Criteria 초안 작성 규칙

- 각 Acceptance Criterion은 관찰 가능한 동작으로 작성한다.
- 정상 경로, 실패 경로, 제외 범위, 보안/권한/데이터 저장 요구사항을 필요한 만큼 분리한다.
- 검증 가능한 pass/fail 기준을 포함한다.
- 불확실한 조건은 가정 또는 질문으로 분리하고 승인 상태를 표시한다.

### Commit 규칙

- `pgg git = on`이고 git repository이면 초기 POGGN workspace와 pgg-add 산출물을 commit할 수 있다.
- commit message 형식은 `{convention}. {version} {message}`이다.
- 예: `feat. 1.3.0 add pgg requirements for login-flow`
- `pgg git = off`이면 commit하지 않는다.

### 필수 단계

- 요구 사항 수집
- 기능 목적 정의
- Acceptance Criteria 초안 작성
- topic_name 생성
- POGGN active workspace 생성
- version 결정
- `pgg git = on`일 경우 working branch 생성 또는 전환
- approval gate 확인

### 승인 Gate

- `auto off`에서는 요구사항 질문 답변과 작은 설계 단위 승인이 완료되기 전 `pgg-plan`으로 진행하지 않는다.
- 정상 완료와 승인 완료 시 마지막 문장은 `다음 flow를 실행하세요: pgg-plan`이다.
- 요구사항 불충분 또는 승인 미완료 시 마지막 문장은 `다음 flow를 실행하세요: pgg-add`이다.

### 검증 요구사항

- `topic_name`이 lowercase kebab-case이고 충돌 시 runId 또는 timestamp가 붙었는지 확인한다.
- `poggn/active/{topic_name}`과 권장 state/requirements/acceptance/token 파일 경로가 산출물에 기록되었는지 확인한다.
- currentVersion이 version source에서 읽혔고 targetVersion, bumpType, convention, reason, versionSource가 기록되었는지 확인한다.
- `pgg git` mode, git repository 여부, baseBranch, workingBranch 판단이 state에 기록되었는지 확인한다.
- completion message 마지막 문장이 허용된 next flow 문장인지 확인한다.

### Review 요구사항

- 질문이 숨겨진 요구사항과 제약 조건을 실제로 드러내는지 review한다.
- 기능 목적, 포함 범위, 제외 범위, 가정, 리스크가 서로 충돌하지 않는지 review한다.
- Acceptance Criteria가 관찰 가능하고 검증 가능한지 review한다.
- version bump와 convention 판단 근거가 요구사항과 일치하는지 review한다.
- pgg-performance 필요성 후보가 성능/속도/최적화/응답 시간/처리량/메모리 요구사항을 놓치지 않았는지 review한다.

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

- 정상 완료와 승인 완료: `pgg-add` -> `pgg-plan`.
- 요구사항 불충분 또는 승인 미완료: `pgg-add` -> `pgg-add`.
- 성능, 속도, 최적화, 응답 시간, 처리량, 메모리 사용량 요구가 있으면 pgg-performance 필요성 후보로 기록하고 이후 `pgg-plan` 또는 `pgg-code`에서 실행 필요성을 판단한다.

### 성능 측정 유도 기준

- `pgg-performance`는 성능 측정이 필요한 경우에만 실행하는 조건부 helper flow다.
- `pgg-performanc` spelling은 compatibility alias로 registry에서 인식한다.
- 성능 기준, 측정 명령, baseline, 결과 해석을 process artifact에 기록한다.

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

- purpose
- targetAgent
- triggerConditions
- inputs
- outputs
- absoluteRules
- antiPatterns
- modeSpecificBehavior
- requiredPhases
- approvalGates
- verificationRequirements
- reviewRequirements
- completionMessageContract
- tokenAccountingRequirements
- nextFlowRouting
- performanceTriggerGuidance
- poggnWorkspaceRequirements
- gitModeRequirements
- branchLifecycleRequirements
- versioningRequirements
- commitMessageRequirements
- archiveRequirements
- qaRequirements

## Language Contract

- 이 skill이 작성하는 pgg 문서, state/history 문구, review/QA 산출물은 `.pgg/project.json`의 `language` 값을 따른다.
- 이 skill이 생성하거나 수정하는 pgg-managed 코드 주석은 `pgg lang`을 따른다.
- 사용자가 작성한 기존 코드 주석은 해당 task 범위에서 수정하는 경우에만 언어 계약을 적용한다.
