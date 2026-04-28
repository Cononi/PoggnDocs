---
name: "pgg-qa"
description: "구현 결과를 검증하고 QA 산출물을 남긴 뒤 archive 여부를 결정한다."
---

# Skill: pgg-qa

## Purpose

`qa/report.md`에 테스트 계획, 결과, 전문가 평가, audit applicability 판단, 최종 판정을 함께 기록하고 통과 시 archive한다.

## Teams Mode

- `pgg teams`가 `on`이면 `.codex/sh/pgg-state-pack.sh <topic|topic_dir>`로 최소 handoff를 만든 뒤 아래 2개 primary agent를 자동 orchestration한다.
- `pgg teams`가 `off`이면 같은 문서 계약을 유지하되 단일 에이전트 흐름으로 진행한다.
- pgg가 생성·관리하는 `.codex/sh/*.sh` helper만 workflow 내부 trusted script로 보고 추가 허락 없이 실행한다.

## Stage Events

- stage 시작 시 `state/history.ndjson`에 `{"stage":"qa","event":"stage-started","source":"pgg-qa"}`를 남긴다.
- 테스트 준비, evidence 정리, 검증 중 상태는 `stage-progress`로만 남긴다.
- 사용자 추가 요구가 있으면 QA 작업 전에 `requirements-added`를 남긴다.
- QA report pass, required audit 확인, archive/release outcome 처리가 끝난 뒤에만 final completion evidence를 남긴다.
- QA fail, release blocked, publish blocked는 Done completed가 아니라 실패/차단 evidence로 남긴다.

## Expert Roster

- QA/테스트 엔지니어: 테스트 설계와 실행 증거
- SRE / 운영 엔지니어: 런타임과 운영 위험 검토

## Rules

- 실패한 topic은 archive하지 않는다
- 현재 프로젝트 내부 QA 기록과 archive bookkeeping은 자동 처리한다
- 현재 프로젝트 밖 경로나 시스템을 건드리는 작업은 자동 처리하지 않는다
- 테스트 근거와 전문가 attribution이 있는 review note를 `qa/report.md`에 남긴다
- 실패 시 필요한 최소 이전 단계로만 회귀한다
- pass면 `.codex/sh/pgg-archive.sh <topic|topic_dir>`를 실행하고 archive version을 기록하며, `pgg git=on`이면 `release/<target-version>-<short-name>` publish와 ai branch cleanup 기록까지 이어간다
- `pgg git=on`이면 QA 산출물 뒤 변경이 남을 때 archive helper가 publish 전에 `qa completion` commit을 먼저 남기고, publish commit source는 `qa/report.md` 또는 `state/current.md`의 `## Git Publish Message`를 사용한다
- `pgg git=off`이면 QA completion commit과 release branch publish를 시도하지 않고 QA report, archive version ledger, archive 이동 evidence를 final completion evidence로 사용한다
- `Audit Applicability`를 읽고 `required` audit만 blocking report로 판단한다
- 대상 프로젝트 검증은 선언된 current-project verification contract가 있을 때만 실행하고, 없으면 `manual verification required`를 기록한다
- 전체 문서 복사보다 `state/current.md`와 필요한 문서 ref를 우선한다.

## Common Skill Definition

- Skill ID: `pgg-qa`
- Skill Name: PGG QA
- Purpose: 구현 결과를 검증하고 PASS인 경우 archive/release 절차를 수행한다.
- Target Agent: 최종 검증, release readiness, archive 결정을 수행하는 AI 개발 에이전트.

### Trigger Conditions

- `pgg-refactor` PASS 후 또는 검증 준비가 완료된 후 실행한다.

### Inputs

- implementation diff
- tests
- generated docs
- version state
- token records
- git state

### Outputs

- QA report
- PASS/FAIL decision
- archive state
- release branch decision
- completion message

### Absolute Rules

- PASS 전 archive, release branch 전환, working branch 제거, push를 하지 않는다.
- 실패한 검증을 숨기지 않는다.

### Anti-Patterns

- 테스트 실패 무시
- generated Markdown 직접 patch
- QA FAIL인데 release 진행

### Mode-Specific Behavior

#### auto off

- `auto off`에서는 사용자 중심으로 실행한다.
- 불명확한 요구사항은 질문으로 확인한다.
- 승인 gate를 통과하기 전에는 다음 flow로 조용히 진행하지 않는다.

#### auto on

- `auto on`에서는 자율적으로 최적 답안을 추론할 수 있다.
- 가정, 불확실성, 선택 이유를 산출물에 기록한다.
- blocking question은 꼭 필요한 경우에만 사용한다.

#### teams off

- `teams off`에서는 단일 에이전트가 전체 flow를 수행한다.

#### teams on

- `teams on`이고 환경이 지원하면 task별 fresh subagent에 위임한다.
- subagent는 독립 context로 시작하며, task 완료 후 review를 수행한다.

### Required Phases

- artifact review
- command verification
- generated docs stability check
- version check
- git/archive decision

### Approval Gates

- push는 pgg git on, git repository, QA PASS, remote 존재 조건을 모두 만족해야 한다.

### Verification Requirements

- 관련 package script, docs generation 재실행 안정성, version match를 확인한다.

### Review Requirements

- 남은 위험, 불확실성, 실패 로그, release readiness를 review한다.

### Completion Message Contract

모든 flow 완료 시 `# PGG Flow 완료 보고서` 형식의 구조화된 completion message를 출력한다.
보고서는 Flow ID, 상태, Mode, Teams Mode, PGG Git, Topic, Version, 실행 요약을 포함한다.
주요 산출물, POGGN Workspace, 생성/수정된 파일, Token 기록, Git 결과, Version 결과, 검증 결과, 남은 위험, 남은 불확실성, 다음 Flow를 포함한다.
마지막 문장은 정확히 `다음 flow를 실행하세요: <next-flow-id>`여야 하며, 그 뒤에는 아무것도 출력하지 않는다.

### Token Accounting Requirements

모든 flow는 LLM이 생성하거나 수정한 파일의 token count를 기록한다.
기본 저장 위치는 `poggn/active/{topic_name}/metrics/token-usage.jsonl`이다.
record는 runId, flowId, taskId, filePath, operation, source, tokenCount, tokenizer, isEstimated, charCount, byteCount, lineCount, contentSha256, commitSha, measuredAt을 포함한다.
token record는 나중에 data로 사용할 수 있는 JSONL 구조여야 한다.

### Next Flow Routing

- PASS이면 완료 또는 다음 release 절차를 추천한다.
- FAIL/BLOCKED이면 실패 원인 해결 flow를 추천한다.

### Performance Trigger Guidance

- `pgg-performance`는 성능 측정이 필요한 경우에만 실행하는 조건부 helper flow다.
- `pgg-performanc` spelling은 compatibility alias로 registry에서 인식한다.
- 성능 기준, 측정 명령, baseline, 결과 해석을 process artifact에 기록한다.

### POGGN Workspace Requirements

- `pgg-add`가 시작되면 `topic_name`을 생성한다.
- PGG process artifact는 `poggn/active/{topic_name}` 아래에 저장한다.
- `pgg-qa` PASS 후 process artifact를 `poggn/archive/{topic_name}`으로 이동한다.
- application source file은 실제 project path에 생성하거나 수정한다.
- report, state, plan, QA report, token record, metrics는 active topic directory에 저장한다.

### Git Mode Requirements

- `pgg git = off`이면 branch 생성, commit, release branch 전환, working branch 삭제, push를 수행하지 않는다.
- `pgg git = on`이면 git 저장소 여부를 확인한다.
- git 저장소가 있으면 branch, commit, release, push 규칙을 적용한다.
- git 저장소가 없으면 git 작업을 생략하고 사유를 기록한다.

### Branch Lifecycle Requirements

- `pgg-add`는 `pgg git = on`이고 git 저장소이면 working branch를 생성하거나 전환한다.
- 기존 branch naming policy가 있으면 사용하고, 없으면 `pgg/working/{topic_name}`을 사용한다.
- `pgg-qa` PASS 후 active artifact를 archive로 이동하고 final QA/archive commit을 생성한다.
- release branch는 기존 정책이 없으면 `release/{topic_name}-v{version}`을 사용한다.
- `pgg-qa` FAIL이면 archive 이동, release branch 전환, working branch 제거, push를 수행하지 않는다.

### Versioning Requirements

- version format은 `x.x.x`이다.
- `major`는 breaking change, 기존 시스템 기능의 완전한 변경, public behavior의 큰 변경에 사용한다.
- `minor`는 기능 추가, 기능 삭제, 새 flow 추가, 비파괴적 기능 확장에 사용한다.
- `patch`는 bug fix, docs, tests, 동작 보존 refactor, 비파괴적 performance improvement, chore에 사용한다.
- core는 currentVersion, targetVersion, bumpType, convention, versionReason, versionSource, projectVersionUpdated, versionVerification을 표현해야 한다.

### Commit Message Requirements

- 모든 PGG commit message는 `{convention}. {version} {message}` 형식을 따른다.
- 예: `feat. 1.3.0 rebuild pgg skill framework`
- push는 `pgg-qa` PASS 완료 전에는 수행하지 않는다.

### Archive Requirements

- `pgg-qa` PASS 전에는 active artifact를 archive로 이동하지 않는다.
- PASS 후 `poggn/active/{topic_name}`을 `poggn/archive/{topic_name}`으로 이동한다.
- archive 상태, QA 결과, version 결과, git 결과를 final state에 남긴다.

### QA Requirements

- QA는 acceptance criteria, generated docs, tests, version, token accounting, POGGN workspace, git outcome을 검증한다.
- PASS가 아니면 release branch 전환, archive 이동, working branch 제거, push를 수행하지 않는다.
- 실패한 검증 명령과 실패 로그 요약을 completion message에 기록한다.

### Generated Documentation Sections

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
