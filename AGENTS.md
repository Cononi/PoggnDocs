# AGENTS.md

## Codex 전용 작업 원칙

- 모든 작업은 `.codex/add/WOKR-FLOW.md`를 따른다.
- 모든 topic은 `poggn/active/<topic>` 안에서만 진행한다.
- 구현 전에는 반드시 `proposal.md`, `plan.md`, `task.md`를 확인한다.
- 구현 단계에서는 `spec/*/*.md` 기준을 위반하지 않는다.
- 다음 단계로 넘길 때는 전체 문맥이 아니라 `state/current.md`만 우선 전달한다.
- `pgg teams`가 `on`이면 stage 시작 전에 `pgg-state-pack.sh`로 최소 컨텍스트를 만들고 `.codex/add/AGENT-ROUTING.toml`의 flow별 2-agent routing 기반 자동 orchestration을 사용한다.
- `pgg teams`가 `on`이면 `.codex/config.toml`의 `[features].multi_agent=true`, `off`이면 `false`로 유지하며, 기본 agent budget은 `max_threads=4`, `max_depth=1`이다.
- Codex sub-agent는 parent가 명시적으로 맡긴 bounded side task만 수행하고, child agent가 다시 agent를 만들지 않는다.
- 각 flow의 primary agent는 정확히 2개이며 support agent는 opt-in으로만 사용한다.
- core workflow(`pgg-add`, `pgg-plan`, `pgg-code`, `pgg-refactor`, `pgg-qa`)와 필요 시 여는 optional audit(`pgg-token`, `pgg-performance`)의 현재 프로젝트 내부 확인/기록/생성 절차는 추가 허락 없이 자동 처리한다.
- proposal 단계에서 `archive_type`, `version_bump`, `target_version`, branch naming, `project_scope`를 확정하고, `archive_type`는 change category/commit convention, `version_bump`는 semver impact로 구분한다.
- pgg가 생성·관리하는 `.codex/sh/*.sh` helper만 workflow 내부 trusted script로 보고 추가 허락 없이 실행한다.
- `pgg git`이 `on`이면 `.codex/sh/pgg-stage-commit.sh`로 task 완료와 QA final completion commit을 남기고, publish commit은 `state/current.md` 또는 `qa/report.md`의 `Git Publish Message` 섹션으로 제목/상세 body/footer를 관리하며 `{convention}: {version}.{commit message}` 형식, `pgg lang` 기반 메시지 언어, 제목 50자 이하, 명령형 금지, 마침표 금지, 로그가 곧 문서 원칙을 지킨다.
- 모든 flow 상태는 `시작 전`, `진행 중`, `추가 진행`, `완료` 4상태로 기록하고 dashboard가 같은 기준으로 표시할 수 있게 stage event evidence를 유지하며, stage 필수 산출물/review/verification/commit 또는 release evidence가 완전히 끝나기 전에는 `완료`로 처리하지 않는다.
- `pgg-token`, `pgg-performance`는 실제 실행 evidence가 있을 때만 dashboard optional audit flow로 표시하고, `Audit Applicability`의 `required` 값만으로 표시하지 않는다.
- dashboard timeline은 workflow progress가 `완료`로 계산된 flow만 표시하며 진행 중/추가 진행/시작 전 flow를 완료 이력으로 취급하지 않는다.
- 각 flow 작업과 파일 생성/수정/삭제 token usage는 필요 시 `state/token-usage.ndjson`에 append-only로 기록하고 `llm`과 `local`, actual과 estimated를 구분한다.
- 대상 프로젝트 검증 명령은 선언된 current-project verification contract가 있을 때만 자동 실행 후보가 되며, 없으면 `manual verification required`로 남긴다.
- 파일 생성/수정/삭제는 `implementation/index.md`와 `implementation/diffs/*.diff`에 기록한다.
- 검증이 통과된 topic은 version 기록 후 `poggn/archive/<topic>`으로 이동한다.
- archive 처리된 topic은 다시 active로 되돌리지 않는다.

## Core Skill Flow

1. `pgg-add`
2. `pgg-plan`
3. `pgg-code`
4. `pgg-refactor`
5. `pgg-qa`

## Optional Audits

- `pgg-token`
- `pgg-performance`

## 금지

- `proposal.md`, `plan.md`, `task.md` 없이 구현하지 않는다.
- auto mode가 `off`일 때 불확실한 요구사항을 임의 확정하지 않는다.
- teams handoff에 전체 문서를 기본값으로 넘기지 않는다.
- flow당 primary agent를 2개 초과로 늘리지 않는다.
- sub-agent에게 즉시 blocking 되는 critical-path 작업을 넘기지 않는다.
- 전체 파일 내용을 불필요하게 다음 단계에 전달하지 않는다.
- diff로 충분한 경우 전체 파일을 복사하지 않는다.
