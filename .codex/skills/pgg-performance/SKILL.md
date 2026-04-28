---
name: "pgg-performance"
description: "필요한 topic에서만 optional performance audit를 수행하고 결과를 기록한다."
---

# Skill: pgg-performance

## Purpose

성능 민감 topic에 대해서만 optional audit를 수행하고, 실제 audit가 열렸을 때만 적용 가능한 성능 항목의 결과와 제외 근거를 `performance/report.md`에 기록한다.

## Teams Mode

- `pgg teams`가 `on`이면 `.codex/sh/pgg-state-pack.sh <topic|topic_dir>`로 최소 handoff를 만든 뒤 아래 2개 primary agent를 자동 orchestration한다.
- `pgg teams`가 `off`이면 같은 문서 계약을 유지하되 단일 에이전트 흐름으로 진행한다.
- pgg가 생성·관리하는 `.codex/sh/*.sh` helper만 workflow 내부 trusted script로 보고 추가 허락 없이 실행한다.

## Expert Roster

- QA/테스트 엔지니어: 성능 측정 범위와 증거
- SRE / 운영 엔지니어: 런타임 한계, 복구력, 확장성 검토

## Rules

- 모든 topic의 기본 stage가 아니라 optional audit로 취급한다
- 성능 민감 경로, 명시된 성능 목표, 선언된 verification contract가 있을 때만 `required`로 올린다
- 각 성능 항목은 측정 전에 applicability를 먼저 판단한다
- applicable 항목은 baseline, target, actual result, measurement method를 함께 기록한다
- `not_applicable` 항목은 수치를 지어내지 않고 제외 근거를 남긴다
- audit를 실제로 실행한 경우에만 `performance/report.md`를 만든다
- verification contract가 없으면 `manual verification required` 원칙을 유지한다
- 측정값, 제외 근거, 결론을 `performance/report.md`에 함께 남긴다
- 전체 문서 복사보다 `state/current.md`와 필요한 문서 ref를 우선한다.

## Common Skill Definition

- Skill ID: `pgg-performance`
- Skill Name: PGG Performance
- Purpose: 성능 측정이 필요한 topic에서만 baseline과 결과를 비교한다.
- Target Agent: 성능 기준, 측정 명령, 결과 해석을 기록하는 AI 개발 에이전트.

### Trigger Conditions

- 성능 요구사항, 성능 회귀 가능성, 측정 요청이 있을 때만 실행한다.

### Inputs

- performance criteria
- measurement commands
- baseline
- current implementation

### Outputs

- performance report
- baseline comparison
- risk decision

### Absolute Rules

- 근거 없는 성능 개선 주장을 하지 않는다.
- 측정 명령과 환경을 기록한다.

### Anti-Patterns

- 측정 없이 PASS 처리
- single noisy run만 근거로 결론
- 기능 QA 대신 성능 flow 사용

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

- criteria check
- baseline capture
- measurement
- comparison
- recommendation

### Approval Gates

- 측정 비용이 크거나 external resource가 필요하면 실행 전 승인받는다.

### Verification Requirements

- 측정 재현 명령, 결과, 해석을 report에 포함한다.

### Review Requirements

- 측정 신뢰도, baseline 적합성, 기능 영향 여부를 review한다.

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

- PASS이면 원래 pending flow로 복귀하거나 `pgg-qa`를 추천한다.

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
