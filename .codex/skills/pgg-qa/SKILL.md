---
name: "pgg-qa"
description: "source of truth, generated docs, workflow completeness, release readiness를 검증하는 최종 검증 Skill."
---

# Skill: pgg-qa

## Purpose

`pgg-qa`는 PGG Skill Framework의 최종 검증 Skill이다.
TypeScript Skill 정의, generated Markdown, workflow 완전성, POGGN workspace 규칙, versioning, git lifecycle, completion message, token accounting, 기술 검증, archive/release readiness를 검증한다.
최종 판정은 반드시 PASS 또는 FAIL이다.

## Teams Mode

- `pgg teams`가 `on`이고 환경이 지원하면 QA/테스트 엔지니어와 SRE/운영 엔지니어 primary agent를 사용한다.
- `pgg teams`가 `off`이면 단일 에이전트가 전체 QA matrix를 수행한다.
- 최종 PASS 또는 FAIL 판정은 메인 에이전트가 책임진다.

## 필수 검증 영역

- Source of Truth
- Skill Framework
- POGGN Workspace
- Versioning
- Git Mode / Branch Lifecycle
- Commit Message Convention
- Completion Message Contract
- Token Accounting
- pgg-add
- pgg-plan
- pgg-code
- pgg-code Task Commits
- pgg-refactor
- pgg-performance
- pgg-qa
- Generated Docs
- Technical Checks
- Archive / Release / Push

## Source of Truth

- TypeScript Skill 정의가 source of truth다.
- generated Markdown은 generator 결과여야 한다.
- QA 통과를 위해 generated Markdown을 직접 수정하지 않는다.
- generator를 두 번 실행해 두 번째 실행이 안정적인지 확인한다.

## 기술 검증

- 실제 `package.json` scripts를 기준으로 검증한다.
- typecheck, lint, test, snapshot test, docs generation, build는 실행하거나 unavailable 사유를 명시한다.
- 이 저장소에서는 `pnpm build`가 TypeScript build/typecheck를 담당하고 `node packages/cli/dist/index.js update`가 managed Skill Markdown을 갱신한다.

## Rules

- pgg-qa는 생략하면 안 된다.
- PASS 전 archive 이동, release branch 전환, working branch 삭제, push를 하지 않는다.
- FAIL이면 `poggn/active/{topic_name}`을 유지하고 실패한 flow-id로 routing한다.
- PASS이면 `poggn/active/{topic_name}`을 `poggn/archive/{topic_name}`으로 이동하되 기존 archive를 덮어쓰지 않는다.
- pgg git off이면 branch, commit, release branch, working branch deletion, push를 모두 생략하고 사유를 기록한다.
- pgg git on이면 repository 상태, task commit, final QA/archive commit, release branch, working branch deletion, remote, push 결과를 검증한다.
- 최종 report artifact는 archive 전 `poggn/active/{topic_name}/pgg-qa/` 아래에 저장한다.

## Completion Message

- 실행한 명령어, 변경된 TS Skill 정의 파일, 변경된 generated Markdown 파일, 변경된 테스트/snapshot 파일, 변경된 POGGN artifact, 남은 위험, 남은 불확실성, 최종 판정을 포함한다.
- QA PASS 마지막 문장: `다음 flow를 실행하세요: pgg-add`
- QA FAIL 마지막 문장: `다음 flow를 실행하세요: <실패한 flow-id>`
- 마지막 문장 뒤에는 아무 문장도 출력하지 않는다.

## 공통 Skill 정의

- Skill ID: `pgg-qa`
- Skill 이름: PGG QA
- 목적: `pgg-qa`는 PGG Skill Framework의 최종 검증 Skill이다. 단순 테스트 실행이 아니라 TypeScript Skill 정의, generated Markdown, POGGN workspace, version, git lifecycle, completion message, token accounting, 각 flow의 전달 가능성을 검증하고 최종 판정을 PASS 또는 FAIL로 선언한다. QA PASS인 경우에만 archive/release/push 절차를 수행한다.
- 대상 에이전트: 최종 검증, release readiness, archive 결정, 실패 시 수정 flow routing을 수행하는 AI 개발 에이전트. QA/테스트 엔지니어 관점과 SRE/운영 엔지니어 관점을 함께 사용해 evidence 기반 판정을 내린다.

### Trigger 조건

- `pgg-refactor` PASS 후 최종 검증이 필요할 때 실행한다.
- `pgg-code`, `pgg-refactor`, `pgg-performance` 산출물이 준비되었고 archive/release 가능 여부를 결정해야 할 때 실행한다.
- 신규 Skill Framework migration처럼 source of truth와 generated docs 안정성을 검증해야 하는 작업에서는 생략하지 않는다.

### 입력

- `poggn/active/{topic_name}` topic workspace
- `poggn/active/{topic_name}/state.json` 또는 동등 state/current 문서
- pgg-add, pgg-plan, pgg-code, pgg-refactor, pgg-performance 산출물
- TypeScript Skill 정의 파일과 generator 파일
- generated Markdown 파일과 generator 실행 결과
- implementation diff, test 결과, build 결과, docs generation 결과
- version state: currentVersion, targetVersion, bumpType, convention, reason, versionSource
- token records: `poggn/active/{topic_name}/metrics/token-usage.jsonl`
- git state: pgg git mode, git repository 여부, branch, commit, remote

### 출력

- `poggn/active/{topic_name}/pgg-qa/report.md` 최종 QA report
- PASS 또는 FAIL 최종 판정
- 실행한 명령어와 각 명령의 결과 evidence
- 변경된 TS Skill 정의 파일, generated Markdown 파일, 테스트/snapshot 파일, POGGN artifact 목록
- FAIL인 경우 수정해야 할 TS 정의 파일과 이유
- PASS인 경우 archive 결과와 release branch/push 결과 또는 생략 사유
- completion message. QA PASS 마지막 문장은 `다음 flow를 실행하세요: pgg-add`이고, QA FAIL 마지막 문장은 `다음 flow를 실행하세요: <실패한 flow-id>`이다.

### 절대 규칙

- `pgg-qa`는 생략하면 안 된다.
- generated Markdown을 직접 수정해서 통과시키면 안 된다.
- 모든 문서 변경은 TypeScript Skill 정의 또는 generator 변경에서 시작해야 한다.
- QA는 단순 테스트 실행이 아니라 Skill 전달 가능성까지 검증한다.
- FAIL이면 수정해야 할 TS 정의 파일과 이유를 명시한다.
- 최종 판정은 반드시 PASS 또는 FAIL이다.
- QA FAIL이면 archive 이동, release branch 전환, working branch 삭제, push를 수행하지 않는다.
- archive 대상 경로가 이미 존재하면 덮어쓰지 않고 FAIL 또는 BLOCKED로 기록한다.

### 금지 패턴

- 테스트 성공만 보고 Skill 전달 가능성을 검증하지 않음
- generated Markdown 직접 patch
- TS 정의와 generated Markdown 불일치를 무시
- QA FAIL인데 archive/release/push 진행
- remote가 없는데 push 성공으로 기록
- token accounting이나 completion message contract 누락을 경고만 하고 PASS 처리
- `적절히 구현`, `필요한 로직 추가`, `일반적인 방식으로 처리` 같은 모호한 표현을 허용

### Mode-Specific Behavior

#### auto off

- `auto off`에서는 destructive 또는 release-facing 작업 전에 사용자 승인 상태를 확인한다.
- 승인이 없으면 archive 이동, release branch 전환, working branch 삭제, push를 수행하지 않는다.
- 불명확한 FAIL 원인은 추측으로 PASS 처리하지 않고 질문 또는 FAIL evidence로 남긴다.

#### auto on

- `auto on`에서는 repository evidence로 합리적인 검증 순서를 자율적으로 정한다.
- 가정, 불확실성, 선택 이유, 실행하지 못한 검증과 사유를 QA report에 기록한다.
- blocking question은 archive/release 안전성 또는 source-of-truth 판정이 불가능할 때만 사용한다.

#### teams off

- `teams off`에서는 단일 에이전트가 전체 QA matrix, command verification, release decision을 수행한다.

#### teams on

- `teams on`이고 환경이 지원하면 QA/테스트 엔지니어와 SRE/운영 엔지니어 primary agent를 사용한다.
- QA/테스트 엔지니어는 test evidence, generated docs stability, acceptance coverage를 검토한다.
- SRE/운영 엔지니어는 git lifecycle, release branch, push safety, rollback 위험을 검토한다.
- 메인 에이전트는 두 검토 결과를 합쳐 PASS/FAIL을 선언한다.

### Source of Truth 검증

- `packages/core/src/skill-framework/registry.ts`에 pgg-qa TS Skill 정의가 존재하는지 확인한다.
- generated Markdown은 `node packages/cli/dist/index.js update` 또는 저장소 generator에서 생성한다.
- generated Markdown 변경 diff가 TS 정의 또는 generator 변경에서 나온 결과인지 확인한다.
- generator를 두 번 실행해 두 번째 실행에서 추가 변경이 없는지 확인한다.

### 최종 QA Report 형식

- `| Area | Pass/Fail | Evidence |` table을 사용한다.
- Area row는 Source of Truth, Skill Framework, POGGN Workspace, Versioning, Git Mode / Branch Lifecycle, Commit Message Convention, Completion Message Contract, Token Accounting, pgg-add, pgg-plan, pgg-code, pgg-code Task Commits, pgg-refactor, pgg-performance, pgg-qa, Generated Docs, Technical Checks, Archive / Release / Push를 포함한다.
- table 뒤에는 실행한 명령어, 변경된 TS Skill 정의 파일, 변경된 generated Markdown 파일, 변경된 테스트/snapshot 파일, 변경된 POGGN artifact, 남은 위험, 남은 불확실성, 최종 판정: PASS 또는 FAIL을 기록한다.

### 기술 검증 명령

- `pnpm build`: TypeScript build와 typecheck 역할을 수행한다.
- `pnpm build:readme`: core build 후 generated README를 갱신한다.
- `node packages/cli/dist/index.js update`: managed Skill Markdown과 `.codex` generated docs를 갱신한다.
- `pnpm build:dashboard`: dashboard build를 수행한다.
- `pnpm test`, `pnpm test:core`, `pnpm test:dashboard`: core/dashboard test를 실행한다.
- `pnpm verify:version-history`: version history 보존을 검증한다.
- package.json에 별도 lint 또는 snapshot script가 없으면 `not_available`로 기록하고 사유를 남긴다.

### PASS/FAIL 기준

- 모든 필수 영역이 Pass이고 실패한 명령이 없으며 archive/release/push 조건 또는 생략 사유가 명확하면 PASS이다.
- 하나라도 필수 영역이 Fail이면 최종 판정은 FAIL이다.
- 검증을 실행하지 못했는데 대체 evidence나 명확한 `not_available` 사유가 없으면 FAIL이다.
- FAIL이면 archive/release/push를 수행하지 않고 next flow를 실패한 flow-id로 지정한다.

### 필수 단계

- 1. Source of Truth 검증: TS Skill 정의 존재, generated Markdown 생성 여부, 직접 수정 흔적, generator 2회 실행 안정성 확인
- 2. Skill Framework 검증: PGG 설명, 독립 Skill, 목적/trigger/input/output/단계/금지사항/mode별 동작, 범용 AI 에이전트 실행 가능성 확인
- 3. Flow completeness 검증: pgg-add, pgg-plan, pgg-code, pgg-refactor, pgg-performance, pgg-qa 각각의 필수 계약 확인
- 4. POGGN Workspace 검증: active path, process artifact 위치, PASS archive, FAIL active 유지, archive overwrite 방지 확인
- 5. Version 검증: currentVersion, targetVersion, bumpType, convention, reason, versionSource, project version bump 확인
- 6. Git Mode / Branch Lifecycle 검증: pgg git off 생략 기록, pgg git on branch/commit/release/push 규칙 확인
- 7. Completion Message Contract 검증: 모든 flow 완료 메시지 schema와 마지막 문장 규칙 확인
- 8. Token Accounting 검증: JSONL schema, exact/estimated, source 분리, commitSha, active topic 저장 위치 확인
- 9. Generated Documentation 검증: 한국어 문서, section coverage, mode/approval/verification/workspace/git/version/branch/commit/token/completion 내용 확인
- 10. 기술 검증: package.json의 실제 scripts 기준 build, docs generation, dashboard build, tests, version-history verification 실행
- 11. PASS/FAIL 결정 및 report 작성
- 12. PASS인 경우에만 archive/release/push 절차 수행

### 승인 Gate

- QA PASS 전에는 archive 이동, final QA/archive commit, release branch 전환, working branch 삭제, push를 승인하지 않는다.
- `pgg git = on`, git repository, QA PASS, archive 성공, release branch 준비, remote 존재 조건을 모두 만족할 때만 push를 허용한다.
- remote가 없으면 push를 생략하고 사유를 report에 기록한다.
- QA FAIL이면 실패한 flow-id를 next flow로 지정하고 release-facing 작업을 중단한다.

### 검증 요구사항

- TS Skill 정의가 source of truth이며 `packages/core/src/skill-framework/registry.ts` 또는 관련 TS generator 변경에서 문서 변경이 시작되었는지 확인한다.
- generator를 실행해 generated Markdown이 갱신되는지 확인한다.
- generator를 같은 입력으로 두 번 실행해 두 번째 실행에서 추가 diff가 없는지 확인한다.
- 저장소의 실제 `package.json` scripts를 기준으로 `pnpm build`, `pnpm build:readme`, `pnpm build:dashboard`, `pnpm test`, `pnpm test:core`, `pnpm test:dashboard`, `pnpm verify:version-history`를 실행 후보로 삼는다.
- 별도 `typecheck`, `lint`, `snapshot` script가 없으면 package.json 기준으로 `not_available`과 사유를 기록하고, typecheck는 `pnpm build`, docs generation/snapshot 안정성은 `pnpm build:readme`와 generator 2회 실행으로 검증한다.
- 기술 검증 실패 시 명령어, exit code, 핵심 로그, 수정 대상 TS 정의 또는 generator 파일을 report에 기록한다.

### Review 요구사항

- 최종 QA report는 각 검증 영역별 Pass/Fail과 evidence를 포함한다.
- FAIL이면 실패한 영역, 실패한 flow-id, 수정해야 할 TS 정의 파일, 수정 이유를 기록한다.
- PASS이면 archive/release/push 절차가 실제 조건을 만족했는지 또는 생략 사유가 충분한지 review한다.
- 남은 위험과 남은 불확실성을 빈칸으로 두지 말고 `없음` 또는 구체적 항목으로 기록한다.
- 검증 evidence는 파일 경로, 명령어, 생성 결과, diff 안정성, commit SHA 또는 생략 사유처럼 재확인 가능한 형태로 남긴다.

### 완료 메시지 규격

pgg-qa 완료 메시지는 `# PGG Flow 완료 보고서` 형식을 사용한다.
Flow ID, 상태(PASS 또는 FAIL), Mode, Teams Mode, PGG Git, Topic, Version, 실행 요약을 포함한다.
실행한 명령어, 변경된 TS Skill 정의 파일, 변경된 generated Markdown 파일, 변경된 테스트/snapshot 파일, 변경된 POGGN artifact를 포함한다.
최종 QA Report table, archive/release/push 결과, 남은 위험, 남은 불확실성을 포함한다.
공통 schema에서 마지막 문장은 `다음 flow를 실행하세요: <next-flow-id>` 형식을 따른다.
QA PASS이면 마지막 문장은 정확히 `다음 flow를 실행하세요: pgg-add`이다.
QA FAIL이면 마지막 문장은 정확히 `다음 flow를 실행하세요: <실패한 flow-id>`이다.
마지막 문장 뒤에는 아무 문장도 출력하지 않는다.

### Token Accounting 요구사항

모든 pgg-qa 생성/수정 파일의 token count를 `poggn/active/{topic_name}/metrics/token-usage.jsonl`에 기록한다.
record는 runId, flowId, taskId, filePath, operation, source, tokenCount, tokenizer, isEstimated, charCount, byteCount, lineCount, contentSha256, commitSha, measuredAt을 포함한다.
LLM 생성/수정 파일은 `source: llm`, generator 산출물은 `source: generator`, 도구 산출물은 `source: tool`로 구분한다.
token 측정 방식이 exact인지 estimated인지 `isEstimated`와 tokenizer 값으로 기록한다.
task별 commit이 있으면 commitSha를 채우고, commit이 생략되면 null과 생략 사유를 QA report에 기록한다.
token record는 나중에 데이터로 사용할 수 있는 JSONL이어야 하며 generated Markdown과 LLM 생성 파일을 구분해야 한다.

### Next Flow Routing

- QA PASS: archive/release/push 절차를 완료하거나 생략 사유를 기록한 뒤 마지막 문장은 `다음 flow를 실행하세요: pgg-add`이다.
- Source of Truth, generated docs, pgg-qa 정의 실패: `다음 flow를 실행하세요: pgg-qa`.
- pgg-add 검증 실패: `다음 flow를 실행하세요: pgg-add`.
- pgg-plan 검증 실패: `다음 flow를 실행하세요: pgg-plan`.
- pgg-code 또는 task별 commit 검증 실패: `다음 flow를 실행하세요: pgg-code`.
- pgg-refactor 검증 실패: `다음 flow를 실행하세요: pgg-refactor`.
- 성능 근거 또는 pgg-performance 검증 실패: `다음 flow를 실행하세요: pgg-performance`.

### 성능 측정 유도 기준

- 성능 기준, baseline, benchmark, 대량 데이터, 반복문, DB query, 네트워크 요청, 캐싱, 동시성, 파일 처리, 번들 크기 변화가 있으면 pgg-performance evidence를 확인한다.
- 실제 측정 없이 성능 개선을 주장한 경우 FAIL이다.
- 측정 불가이면 이유, 대체 검증, 남은 위험을 report에 기록한다.
- 성능 근거가 부족하면 next flow는 `pgg-performance`이다.

### POGGN Workspace 요구사항

- `pgg-add`가 생성한 `topic_name`과 `poggn/active/{topic_name}` 존재를 확인한다.
- 각 flow process artifact가 active topic directory 하위에 저장되었는지 확인한다.
- `pgg-qa` artifact는 `poggn/active/{topic_name}/pgg-qa/` 하위에 저장한다.
- token record 위치는 `poggn/active/{topic_name}/metrics/token-usage.jsonl`이다.
- QA PASS 후에는 `poggn/active/{topic_name}`을 `poggn/archive/{topic_name}`으로 이동한다.
- QA FAIL이면 active 상태를 유지한다.
- `poggn/archive/{topic_name}`이 이미 있으면 덮어쓰지 않고 FAIL 또는 BLOCKED evidence로 남긴다.

### pgg git mode 요구사항

- `pgg git = off`: branch 생성, commit, release branch 전환, working branch 삭제, push가 모두 생략되었는지 확인하고 생략 사유를 기록한다.
- `pgg git = on`: `git rev-parse --is-inside-work-tree`로 git 저장소 여부를 확인한다.
- `pgg git = on`이고 git 저장소이면 pgg-add working branch 생성/전환, pgg-code task별 commit, pgg-qa final archive commit, release branch, working branch 삭제, push 규칙을 검증한다.
- git 저장소가 아니면 모든 git 작업을 생략하고 사유를 기록한다.
- remote가 없으면 push를 생략하고 사유를 기록한다.

### Branch Lifecycle 요구사항

- pgg-add는 `pgg git = on`이고 git 저장소이면 working branch를 생성/전환해야 한다.
- 기존 branch naming policy가 없으면 working branch는 `pgg/working/{topic_name}`을 사용한다.
- QA PASS 후 active artifact를 archive로 이동하고 final QA/archive commit을 생성한다.
- commit message 형식은 `{convention}. {version} {message}`이고 예시는 `chore. 1.3.0 archive pgg run login-flow`이다.
- 기존 release branch policy가 없으면 `release/{topic_name}-v{version}`을 사용한다.
- release branch는 working branch의 최종 상태를 포함해야 한다.
- release branch 전환 후 working branch를 제거한다.
- QA FAIL이면 archive 이동, release branch 전환, working branch 제거, push를 수행하지 않는다.

### Versioning 요구사항

- pgg-add 산출물을 기준으로 version 결정 evidence를 확인한다.
- version format은 `x.x.x`인지 확인한다.
- currentVersion, targetVersion, bumpType, convention, reason, versionSource가 기록되었는지 확인한다.
- major/minor/patch 기준이 적용되었는지 확인한다.
- pgg-plan에 version bump task가 포함되었는지 확인한다.
- pgg-code에서 project version이 targetVersion으로 반영되었는지 확인한다.
- npm 라이브러리 또는 npm workspace라면 package.json version이 targetVersion과 일치하는지 확인한다.
- 다른 version source가 있으면 기존 프로젝트 정책을 따랐는지 확인한다.

### Commit Message 요구사항

- 모든 PGG commit message는 `{convention}. {version} {message}` 형식을 따른다.
- pgg-code task별 commit도 같은 형식을 따르며 task 목적이 message에 드러나야 한다.
- pgg-code는 task별 commit SHA를 보고해야 한다.
- pgg-code는 push하지 않는다.
- pgg-qa PASS 후 final QA/archive commit message 예시는 `chore. 1.3.0 archive pgg run login-flow`이다.
- pgg git off 또는 git 저장소 없음이면 commit을 만들지 않고 생략 사유를 기록한다.

### Archive 요구사항

- QA PASS 전에는 active artifact를 archive로 이동하지 않는다.
- QA PASS이면 `poggn/active/{topic_name}`을 `poggn/archive/{topic_name}`으로 이동한다.
- archive destination이 이미 존재하면 덮어쓰지 않고 FAIL 또는 BLOCKED로 기록한다.
- pgg git on이고 git 저장소이면 archive 이동 후 final QA/archive commit을 만든다.
- release branch를 생성/전환하고 working branch 최종 상태를 포함하는지 확인한다.
- release branch 전환 후 working branch를 제거한다.
- remote가 있으면 release branch를 push하고, remote가 없으면 push 생략 사유를 기록한다.
- QA FAIL이면 archive/release/push 절차를 수행하지 않는다.

### QA 요구사항

- 최종 QA Report는 `| Area | Pass/Fail | Evidence |` table을 포함한다.
- 필수 Area: Source of Truth, Skill Framework, POGGN Workspace, Versioning, Git Mode / Branch Lifecycle, Commit Message Convention, Completion Message Contract, Token Accounting, pgg-add, pgg-plan, pgg-code, pgg-code Task Commits, pgg-refactor, pgg-performance, pgg-qa, Generated Docs, Technical Checks, Archive / Release / Push.
- 추가 필수 항목: 실행한 명령어, 변경된 TS Skill 정의 파일, 변경된 generated Markdown 파일, 변경된 테스트/snapshot 파일, 변경된 POGGN artifact, 남은 위험, 남은 불확실성, 최종 판정 PASS 또는 FAIL.
- Source of Truth 검증은 TS 정의 존재, generated Markdown 생성, 직접 수정 흔적 부재, generator 2회 실행 안정성을 포함한다.
- Skill Framework 검증은 범용 AI 에이전트에게 실행 가능한 workflow로 전달되는지 확인한다.
- pgg-add 검증은 요구사항 수집, 기능 목적, Acceptance Criteria, topic_name, active workspace, version 결정, working branch, 코드 작성 금지, 소크라테스식 질문, 승인 gate, auto mode, completion, token, next flow를 포함한다.
- pgg-plan 검증은 승인된 설계, active workspace, 검증 전략, test plan, 성공/실패 기준, 경계값/예외/회귀/성능 기준, version bump task, 2~5분 task, 정확한 파일 경로, 완전한 코드, verification, pgg-performance routing을 포함한다.
- pgg-code 검증은 실제 테스트 코드, 구현 코드, 테스트 실행, 실패 로그 분석, 수정 후 재실행, project version bump, teams on delegation, clean context, Review 1, Review 2, final verify, task token, task commit, push 금지를 포함한다.
- pgg-refactor 검증은 동작 보존, before / after 동일성, feature change 금지, 구조 개선, 중복 제거, 성능 개선, 가독성 분리, 책임 분리, diff inspection, final verify를 포함한다.
- pgg-performance 검증은 독립 Skill, 측정 필요성 판단 조건, 지표, baseline, 측정 방법, 결과 비교, 측정 없는 개선 주장 금지, 측정 불가 이유 보고, next flow를 포함한다.
- Generated Documentation 검증은 한국어 문서, 필수 section, mode별 동작, 승인 gate, verification, POGGN workspace, pgg git mode, branch lifecycle, versioning, commit message, completion message, token accounting, 모호한 표현 부재를 포함한다.

### 생성 문서 섹션

- pgg-qa 목적
- Source of Truth 검증
- Skill Framework 검증
- POGGN Workspace 검증
- Version 검증
- Git Mode 검증
- Branch Lifecycle 검증
- Commit Message Convention 검증
- Completion Message Contract 검증
- Token Accounting 검증
- pgg-add 검증
- pgg-plan 검증
- pgg-code 검증
- pgg-code task commit 검증
- pgg-refactor 검증
- pgg-performance 검증
- Generated Documentation 검증
- 기술 검증
- QA PASS 후 archive/release/push 절차
- 최종 QA Report 형식
- PASS/FAIL 기준
- completion message 규격
- completionMessageContract
- tokenAccountingRequirements
- next flow routing

## Language Contract

- 이 skill이 작성하는 pgg 문서, state/history 문구, review/QA 산출물은 `.pgg/project.json`의 `language` 값을 따른다.
- 이 skill이 생성하거나 수정하는 pgg-managed 코드 주석은 `pgg lang`을 따른다.
- 사용자가 작성한 기존 코드 주석은 해당 task 범위에서 수정하는 경우에만 언어 계약을 적용한다.
