---
name: "pgg-performance"
description: "필요한 topic에서만 optional performance audit를 수행하고 결과를 기록한다."
---

# Skill: pgg-performance

## Purpose

`pgg-performance`는 AI가 성능 측정이 필요하다고 판단한 경우 실행되는 성능 검증 Skill이다.
산출물은 `poggn/active/{topic_name}/pgg-performance/` 아래에 저장하고, 측정 기준 정의, benchmark 또는 성능 테스트 실행, 결과 기록, 다음 flow 결정을 수행한다.

## Teams Mode

- `pgg teams`가 `on`이면 `.codex/sh/pgg-state-pack.sh <topic|topic_dir>`로 최소 handoff를 만든 뒤 아래 2개 primary agent를 자동 orchestration한다.
- `pgg teams`가 `off`이면 같은 문서 계약을 유지하되 단일 에이전트 흐름으로 진행한다.
- pgg가 생성·관리하는 `.codex/sh/*.sh` helper만 workflow 내부 trusted script로 보고 추가 허락 없이 실행한다.

## Expert Roster

- QA/테스트 엔지니어: 성능 측정 범위와 증거
- SRE / 운영 엔지니어: 런타임 한계, 복구력, 확장성 검토

## 기본 flow와의 관계

- 기본 flow: `pgg-add` -> `pgg-plan` -> `pgg-code` -> `pgg-refactor` -> `pgg-qa`
- `pgg-performance`는 기본 flow에 항상 포함되지 않는다.
- AI 판단에 따라 `pgg-code` 이후 또는 `pgg-refactor` 이후에 실행될 수 있다.
- `pgg-performanc`는 compatibility alias로만 인식하고 새 산출물과 next flow는 `pgg-performance`를 사용한다.

## 실행 조건

- 사용자가 성능, 속도, 최적화, 응답 시간, 처리량, 메모리 사용량을 언급
- `pgg-plan`에서 성능 기준이 정의됨
- `pgg-code`에서 성능에 영향을 줄 수 있는 코드 작성
- `pgg-refactor`에서 성능 개선이 목적 중 하나임
- 대량 데이터, 반복문, DB query, 네트워크 요청, 캐싱, 동시성, 파일 처리, 번들 크기 관련 변경
- `pgg-qa`에서 성능 근거 부족 판단

## 필수 단계

1. 성능 측정 필요성 판단
2. 측정 대상 정의
3. 측정 지표 정의
4. baseline 확인
5. 측정 방법 선택
6. 성능 테스트 또는 benchmark 실행
7. 결과 비교
8. 성능 기준 통과 여부 판단
9. token 기록
10. 다음 flow 추천

## Output

- 성능 측정 필요성 판단 결과, 측정 대상, 측정 지표, baseline, 측정 방법
- 실행한 명령어와 benchmark 또는 성능 테스트 결과
- 기준 통과 여부와 성능 회귀 여부
- 생성/수정된 파일, token 기록, 다음 flow 추천

## Rules

- 모든 topic의 기본 stage가 아니라 optional audit로 취급한다
- 성능 민감 경로, 명시된 성능 목표, 선언된 verification contract가 있을 때만 `required`로 올린다
- 각 성능 항목은 측정 전에 applicability를 먼저 판단한다
- applicable 항목은 baseline, target, actual result, measurement method를 함께 기록한다
- `not_applicable` 항목은 수치를 지어내지 않고 제외 근거를 남긴다
- audit를 실제로 실행한 경우에만 `pgg-performance/report.md`를 만든다
- verification contract가 없으면 `manual verification required` 원칙을 유지한다
- 실제 측정 없이 성능이 좋아졌다고 말하지 않는다
- 측정 불가 상황을 숨기지 않는다
- 임의의 성능 수치를 만들어내지 않는다
- benchmark 조건 없이 결과만 보고하지 않는다
- 측정값, 제외 근거, 결론을 `pgg-performance/report.md`에 함께 남긴다

## Completion Message

- 성능 측정 필요성 판단 결과, 측정 대상, 측정 지표, baseline, 측정 방법, 실행한 명령어를 포함한다.
- benchmark 또는 성능 테스트 결과, 기준 통과 여부, 성능 회귀 여부, 생성/수정된 파일, token 기록, 다음 flow 추천을 포함한다.
- pgg-code 이후 호출되었고 성능 기준 통과 시 마지막 문장: `다음 flow를 실행하세요: pgg-refactor`
- pgg-refactor 이후 호출되었거나 QA 근거 확보 완료 시 마지막 문장: `다음 flow를 실행하세요: pgg-qa`
- 구현 수정 필요 시 마지막 문장: `다음 flow를 실행하세요: pgg-code`
- 전체 문서 복사보다 `state/current.md`와 필요한 문서 ref를 우선한다.

## 공통 Skill 정의

- Skill ID: `pgg-performance`
- Skill 이름: pgg-performance
- 목적: `pgg-performance`는 AI가 성능 측정이 필요하다고 판단한 경우 실행되는 성능 검증 Skill이다. 구현 또는 리팩토링 결과가 성능에 영향을 줄 수 있을 때 측정 기준을 정의하고, 가능한 benchmark 또는 성능 테스트를 실행하고, 결과를 기록하고, 다음 flow를 결정한다.
- 대상 에이전트: 성능 측정 필요성, 측정 대상, 지표, baseline, benchmark 명령, 결과 비교, 회귀 여부, 다음 flow를 근거 기반으로 기록하는 AI 개발 에이전트. 산출물은 `poggn/active/{topic_name}/pgg-performance/` 아래에 남긴다.

### Trigger 조건

- 사용자가 성능, 속도, 최적화, 응답 시간, 처리량, 메모리 사용량을 언급하면 실행을 검토한다.
- `pgg-plan`에서 성능 기준이 정의되면 실행을 검토한다.
- `pgg-code`에서 성능에 영향을 줄 수 있는 코드가 작성되면 실행을 검토한다.
- `pgg-refactor`에서 성능 개선이 목적 중 하나이면 실행을 검토한다.
- 대량 데이터, 반복문, DB query, 네트워크 요청, 캐싱, 동시성, 파일 처리, 번들 크기 관련 변경이면 실행을 검토한다.
- `pgg-qa`에서 성능 근거 부족으로 판단하면 실행한다.

### 입력

- `pgg-plan` 성능 기준 또는 성능 기준 부재 사유
- `pgg-code` 또는 `pgg-refactor` 변경 evidence
- baseline 또는 baseline 측정 방법
- 실행 가능한 benchmark, 성능 테스트, 또는 측정 불가 사유
- 현재 mode, pgg git mode, topic state

### 출력

- `poggn/active/{topic_name}/pgg-performance/report.md`
- 성능 측정 필요성 판단 결과
- 측정 대상, 측정 지표, baseline, 측정 방법
- 실행한 명령어와 benchmark 또는 성능 테스트 결과
- 기준 통과 여부와 성능 회귀 여부
- 생성/수정된 파일, token 기록, 다음 flow 추천

### 절대 규칙

- 실제 측정 없이 성능이 좋아졌다고 말하지 않는다.
- 측정 불가 상황을 숨기지 않는다.
- 임의의 성능 수치를 만들어내지 않는다.
- benchmark 조건 없이 결과만 보고하지 않는다.
- 특정 프로젝트에 과적합된 성능 기준을 일반 규칙처럼 작성하지 않는다.
- generated Markdown은 TypeScript Skill 정의와 generator에서만 갱신하고 직접 patch하지 않는다.

### 금지 패턴

- 측정 없이 PASS 처리
- baseline 없이 개선율 보고
- single noisy run만 근거로 결론
- 측정 불가 사유 없이 benchmark 생략
- 기능 QA 대신 성능 flow 사용

### Mode-Specific Behavior

#### auto off

- 성능 측정 필요성을 설명한다.
- 비용이 큰 benchmark나 장시간 테스트가 필요하면 사용자 승인을 요청한다.
- 이미 `pgg-plan`에서 승인된 성능 기준이 있으면 그 기준에 따라 진행한다.
- 측정 불가 상황은 명확히 보고한다.

#### auto on

- AI가 성능 측정 필요성을 판단한다.
- 합리적인 범위의 성능 측정을 자동으로 수행한다.
- 측정 불가 시 이유를 명시한다.
- 임의의 숫자를 만들어내지 않는다.

#### teams off

- `teams off`에서는 단일 에이전트가 같은 성능 검증 계약을 수행한다.

#### teams on

- `teams on`이면 QA/테스트 엔지니어 관점으로 측정 설계를 검토하고 SRE/운영 엔지니어 관점으로 런타임 위험을 검토한다.

### 기본 flow와의 관계

- 기본 flow는 `pgg-add` -> `pgg-plan` -> `pgg-code` -> `pgg-refactor` -> `pgg-qa`이다.
- `pgg-performance`는 기본 flow에 항상 포함되지 않는 조건부 helper flow다.
- AI 판단에 따라 `pgg-code` 이후 또는 `pgg-refactor` 이후에 실행될 수 있다.
- `pgg-performanc`는 compatibility alias로만 인식하고 새 산출물과 next flow는 `pgg-performance`를 사용한다.

### 측정 지표 예시

- 응답 시간, 처리량, 메모리 사용량, CPU 사용량, DB query 수, 렌더링 시간, 번들 크기, cold start 시간, 반복 처리 시간을 사용할 수 있다.
- 지표는 변경의 성능 위험과 직접 연결되어야 하며, 일반 규칙처럼 고정 threshold를 만들지 않는다.

### 필수 단계

- 1. 성능 측정 필요성 판단
- 2. 측정 대상 정의
- 3. 측정 지표 정의
- 4. baseline 확인
- 5. 측정 방법 선택
- 6. 성능 테스트 또는 benchmark 실행
- 7. 결과 비교
- 8. 성능 기준 통과 여부 판단
- 9. token 기록
- 10. 다음 flow 추천

### 승인 Gate

- auto off에서 비용이 큰 benchmark, 장시간 테스트, 외부 resource 사용이 필요하면 실행 전 사용자 승인을 받는다.
- 이미 승인된 성능 기준이 있으면 별도 scope 변경 없이 그 기준에 따라 진행한다.
- 측정 불가이면 임의 PASS가 아니라 측정 불가 사유와 남은 위험을 report에 기록한다.

### 검증 요구사항

- typecheck를 실행한다. 저장소에 별도 typecheck script가 없으면 `pnpm build` 또는 실제 package script를 사용한다.
- 관련 benchmark 또는 성능 테스트를 실행한다.
- 측정 명령, 환경, 입력 데이터, 반복 횟수 또는 조건을 기록한다.
- baseline과 actual result를 비교한다.
- docs generation을 실행하고 재실행해 안정성을 확인한다.
- 측정 불가 항목은 사유를 기록하고 임의 수치를 만들지 않았는지 확인한다.

### Review 요구사항

- 성능 측정 필요성 판단이 trigger 조건과 연결되는지 review한다.
- 측정 대상, 지표, baseline, 측정 방법이 재현 가능한지 review한다.
- 결과 비교가 benchmark 조건과 함께 기록됐는지 review한다.
- 성능 기준 통과 여부와 회귀 여부가 실제 결과에 근거하는지 review한다.
- 측정 불가 사유와 다음 flow 추천이 타당한지 review한다.

### 완료 메시지 규격

완료 시 `# PGG Flow 완료 보고서` 형식의 구조화된 completion message를 출력한다.
완료 메시지는 성능 측정 필요성 판단 결과, 측정 대상, 측정 지표, baseline, 측정 방법, 실행한 명령어를 포함한다.
benchmark 또는 성능 테스트 결과, 기준 통과 여부, 성능 회귀 여부, 생성/수정된 파일, token 기록, 다음 flow 추천을 포함한다.
`pgg-code` 이후 호출되었고 성능 기준 통과 시 마지막 문장은 정확히 `다음 flow를 실행하세요: pgg-refactor`이다.
`pgg-refactor` 이후 호출되었고 성능 기준 통과 시 마지막 문장은 정확히 `다음 flow를 실행하세요: pgg-qa`이다.
성능 기준 실패 + 구현 수정 필요 시 마지막 문장은 정확히 `다음 flow를 실행하세요: pgg-code`이다.
성능 기준 실패 + 구조 개선 필요 시 마지막 문장은 정확히 `다음 flow를 실행하세요: pgg-refactor`이다.
QA에서 성능 근거 부족으로 호출되었고 근거 확보 완료 시 마지막 문장은 정확히 `다음 flow를 실행하세요: pgg-qa`이다.
공통 완료 문장 형식은 `다음 flow를 실행하세요: <next-flow-id>`이다.
마지막 문장은 `다음 flow를 실행하세요: pgg-refactor`, `다음 flow를 실행하세요: pgg-qa`, `다음 flow를 실행하세요: pgg-code` 중 하나여야 한다.
마지막 문장 뒤에는 아무것도 출력하지 않는다.

### Token Accounting 요구사항

기록 위치는 `poggn/active/{topic_name}/metrics/token-usage.jsonl`이다.
성능 측정 결과 파일이나 benchmark 결과 파일이 생성되면 해당 파일도 기록 대상이다.
record는 runId, flowId, taskId, filePath, operation, source, tokenCount, tokenizer, isEstimated, charCount, byteCount, lineCount, contentSha256, commitSha, measuredAt을 포함한다.
token record는 `pgg-performance` report 생성 또는 수정 후 기록한다.
commit이 생성되면 token record에 commitSha를 연결한다.

### Next Flow Routing

- `pgg-code` 이후 호출되었고 성능 기준 통과: `pgg-refactor`.
- `pgg-refactor` 이후 호출되었고 성능 기준 통과: `pgg-qa`.
- 성능 기준 실패 + 구현 수정 필요: `pgg-code`.
- 성능 기준 실패 + 구조 개선 필요: `pgg-refactor`.
- QA에서 성능 근거 부족으로 호출되었고 근거 확보 완료: `pgg-qa`.
- 마지막 문장은 `다음 flow를 실행하세요: pgg-refactor`, `다음 flow를 실행하세요: pgg-qa`, `다음 flow를 실행하세요: pgg-code` 중 하나여야 한다.

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

- `pgg git = off`이면 commit하지 않는다.
- `pgg git = on`이고 git 저장소이면 성능 측정 산출물을 commit할 수 있다.
- git 저장소가 아니면 commit하지 않고 사유를 기록한다.
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

- pgg git = on이고 git 저장소이면 성능 측정 산출물을 commit할 수 있다.
- commit message 형식은 `{convention}. {version} {message}`이다.
- 예: `perf. 1.3.1 measure login-flow performance baseline`
- pgg git = off이면 commit하지 않는다.
- commit에는 성능 측정 산출물과 관련 변경만 포함한다.

### Archive 요구사항

- `pgg-qa` PASS 전에는 active artifact를 archive로 이동하지 않는다.
- PASS 후 `poggn/active/{topic_name}`을 `poggn/archive/{topic_name}`으로 이동한다.
- archive 상태, QA 결과, version 결과, git 결과를 final state에 남긴다.

### QA 요구사항

- QA는 acceptance criteria, generated docs, tests, version, token accounting, POGGN workspace, git outcome을 검증한다.
- PASS가 아니면 release branch 전환, archive 이동, working branch 제거, push를 수행하지 않는다.
- 실패한 검증 명령과 실패 로그 요약을 completion message에 기록한다.

### 생성 문서 섹션

- pgg-performance 목적
- 기본 flow와의 관계
- 실행 조건
- auto off 동작
- auto on 동작
- 성능 측정 필요성 판단
- 측정 대상
- 측정 지표
- baseline
- 측정 방법
- benchmark 실행
- 결과 비교
- 성능 기준 통과 여부
- 금지사항
- completion message 규격
- completionMessageContract
- token accounting 규칙
- commit 규칙
- next flow routing

## Language Contract

- 이 skill이 작성하는 pgg 문서, state/history 문구, review/QA 산출물은 `.pgg/project.json`의 `language` 값을 따른다.
- 이 skill이 생성하거나 수정하는 pgg-managed 코드 주석은 `pgg lang`을 따른다.
- 사용자가 작성한 기존 코드 주석은 해당 task 범위에서 수정하는 경우에만 언어 계약을 적용한다.
