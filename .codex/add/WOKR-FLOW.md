# Work Flow

pgg는 core workflow와 필요할 때만 여는 optional audit로 delivery를 분리한다.

## 절대 원칙

- auto mode가 `off`이면 미확정 요구사항은 선택지와 직접 입력으로 남긴다.
- `pgg teams`가 `on`이면 `.codex/add/AGENT-ROUTING.toml`에 정의된 stage별 2-agent 자동 orchestration을 사용하고, `off`이면 단일 에이전트 흐름을 사용한다.
- `pgg teams` 상태는 `.codex/config.toml`의 `[features].multi_agent`와 동기화하며, token budget 기본값은 `max_threads=4`, `max_depth=1`이다.
- sub-agent handoff는 `state/current.md` 또는 `.codex/sh/pgg-state-pack.sh <topic|topic_dir>` 출력으로 제한하고 전체 문서 bundle을 기본값으로 넘기지 않는다.
- 현재 프로젝트 내부 문서 생성, 확인, 기록 절차는 stage 안에서 자동 처리하고, 외부 경로나 전역 상태를 건드리는 작업은 자동 처리하지 않는다.
- pgg가 생성·관리하는 `.codex/sh/*.sh` helper만 workflow 내부 trusted script로 보고 추가 허락 없이 실행한다.
- TTY 선택형 인터랙션은 방향키와 Enter 기반 공통 메뉴를 사용한다.
- interactive 변경 명령은 변경 경로 또는 no-op/cancel 상태를 출력한 뒤 종료한다.
- 구현 전에는 `proposal.md`, `plan.md`, `task.md`를 기준으로 범위와 완료 조건을 확인한다.
- 모든 작업은 `poggn/active/<topic>` 문서를 따라 진행한다.
- 모든 pgg-* flow 문서, state/history 문구, commit message, pgg가 생성하거나 수정하는 코드 주석은 `pgg lang`을 따르며, 사용자가 작성한 기존 주석은 범위 밖에서 일괄 번역하지 않는다.
- 모든 flow는 같은 상태 모델을 따른다: 시작 전은 start evidence 없음, 진행 중은 `stage-started` 또는 `stage-progress`, 추가 진행은 완료 후 unresolved `requirements-added`/revision, 완료는 stage 필수 산출물/review/verification/commit 또는 release 처리가 완전히 끝난 `stage-commit` 또는 verified/final `stage-completed`/archive/later-flow evidence다.
- active topic 진행 중 사용자가 새 요구사항 또는 수정사항을 추가하면, 해당 stage 작업을 시작하기 전에 `state/history.ndjson`에 `requirements-added` event를 append해 dashboard workflow가 즉시 `추가 진행` 상태를 계산할 수 있게 한다.
- 작업 중간 산출물 정리나 검증 전 상태는 `stage-progress`로만 기록하고, `stage-completed`는 검증이 끝난 최종 완료 시점에만 `source:"verified"` 계열 evidence로 남긴다.
- `pgg git=on`인 stage는 `.codex/sh/pgg-stage-commit.sh`가 남기는 `stage-commit` evidence를 완료 기준으로 삼아 `추가 진행` 상태를 해소한다.
- optional audit flow는 실제 실행 evidence가 있을 때만 dashboard에 표시되며, `Audit Applicability`의 `required` 값은 표시 evidence가 아니다.
- dashboard timeline은 workflow progress가 `완료`로 계산된 flow만 표시하며, `stage-started`, `stage-progress`, partial artifact, updatedAt fallback을 완료 이력으로 취급하지 않는다.
- 각 flow 작업과 파일 생성/수정/삭제 token usage는 필요 시 `state/token-usage.ndjson`에 append-only로 기록하고, `llm`과 `local`, actual과 estimated를 구분한다.
- proposal 단계에서 `archive_type`, `version_bump`, `target_version`, branch naming, `project_scope`를 확정하고, `archive_type`는 change category, `version_bump`는 semver impact로 구분해 다음 stage와 archive helper가 같은 값을 사용하게 한다.
- 대상 프로젝트 검증은 선언된 current-project verification command contract만 사용하고, framework 명령을 추론 실행하지 않는다.
- QA를 통과한 topic만 archive로 이동한다.
- 각 단계는 필요한 전문가 평가를 포함한다.

### Multi-Agent Routing

- 모든 core workflow와 optional audit는 아래 2개 primary agent만 자동 사용한다.
- `pgg-add`: 프로덕트 매니저, UX/UI 전문가
- `pgg-plan`: 소프트웨어 아키텍트, 도메인 전문가
- `pgg-code`: 시니어 백엔드 엔지니어, 테크 리드
- `pgg-refactor`: 소프트웨어 아키텍트, 코드 리뷰어
- `pgg-qa`: QA/테스트 엔지니어, SRE/운영 엔지니어
- `pgg-token`: 테크 리드, 코드 리뷰어
- `pgg-performance`: QA/테스트 엔지니어, SRE/운영 엔지니어
- `project-generalist`, `docs-researcher`는 support agent이며 parent가 명시적으로 필요하다고 판단할 때만 사용한다.

## 전체 실행 흐름

### Core Workflow

1. `pgg-add`
   - topic 생성
   - `proposal.md`, `reviews/proposal.review.md`, `state/current.md`, `workflow.reactflow.json` 생성
   - topic 생성 시점의 dirty worktree path가 있으면 `state/dirty-worktree-baseline.txt`로 baseline을 기록
   - 사용자 입력 질문 기록과 current-project 범위 내부 확인/기록 절차, `archive_type`, `version_bump`, `target_version`, branch naming 확정
2. `pgg-plan`
   - `plan.md`, `task.md`, `spec/*/*.md`, `reviews/plan.review.md`, `reviews/task.review.md` 생성
3. `pgg-code`
   - 코드 구현
   - `pgg git=on`이면 `task.md` Task 목록의 `Task ID`가 `T1...N`인 행 1개 완료마다 `.codex/sh/pgg-stage-commit.sh <topic|topic_dir> implementation <summary> <why> [footer]`로 task-scoped commit을 남긴다. helper에는 `PGG_TASK_ID`, `PGG_TASK_DEPENDENCIES`, `PGG_TASK_COMPLETION_CRITERIA`를 함께 전달하고, commit body는 최상단 `Dependencies`, 그 아래 완료 조건, footer는 완료 조건에 명시된 task 내용으로 구성한다. helper는 필요 시 governed `working_branch` auto-checkout recovery를 먼저 시도하며 topic 시작 전에 기록된 dirty baseline은 unrelated blocker로 보지 않는다
   - `implementation/index.md`, `implementation/diffs/*.diff`, `reviews/code.review.md` 생성
4. `pgg-refactor`
   - 구수행 코드 검사 후 레거시 코드 제거와 구조 개선 수행으로 최적화된 클린코드
   - `pgg git=on`이면 refactor task 완료마다 `.codex/sh/pgg-stage-commit.sh <topic|topic_dir> refactor <summary> <why> [footer]`로 refactor proof commit을 남기고, helper는 필요 시 governed `working_branch` auto-checkout recovery를 먼저 시도하며 topic 시작 전에 기록된 dirty baseline은 unrelated blocker로 보지 않는다
   - `reviews/refactor.review.md` 생성
5. `pgg-qa`
   - `qa/report.md` 생성
   - `qa/report.md`가 pass면 `.codex/sh/pgg-archive.sh <topic|topic_dir>` 실행
   - `pgg git=on`이고 QA 산출물 뒤 변경이 있으면 archive helper가 release publish 전에 `qa completion` commit을 먼저 남긴다
   - archive helper가 `version.json`과 append-only `poggn/version-history.ndjson` ledger를 기록하고, `pgg git=on`이면 필요 시 governed `working_branch` auto-checkout recovery를 거쳐 topic 시작 전에 기록된 dirty baseline을 무시한 상태로 `ai/<archive_type>/<target-version>-<short-name>`에서 `release/<target-version>-<short-name>`으로 승격하는 git publish helper까지 이어진다
   - `pgg git=on`이면 `state/current.md` 또는 `qa/report.md`의 `## Git Publish Message`에서 `- title:`, `- why:`, `- footer:`를 읽고 `{convention}: {version}.{commit message}` 형식, `pgg lang` 기반 메시지 언어, 제목 50자 이하, 명령형 금지, 마침표 금지, 상세 body, 한 커밋 = 하나의 의도 규칙을 검증한다

### Optional Audits

- `pgg-token`
  - workflow 자산, state handoff, helper, generated 문서 구조를 점검할 때만 연다
  - 실행된 경우에만 `token/report.md`를 남기고, `required` applicability일 때만 gate에서 강제한다
  - dashboard에는 실제 token audit 실행 evidence가 있을 때만 flow로 표시한다
- `pgg-performance`
  - 성능 민감 변경 또는 선언된 verification contract가 있을 때만 연다
  - 실행된 경우에만 `performance/report.md`를 남기고, `required` applicability일 때만 gate에서 강제한다
  - dashboard에는 실제 performance audit 실행 evidence가 있을 때만 flow로 표시한다

### Audit Applicability Contract

- `plan.md`, `task.md`, `state/current.md`, `qa/report.md`에는 `Audit Applicability` 섹션을 두고 아래 형식을 맞춘다.
- 형식 예시: `- [pgg-token]: [required|not_required] | <짧은 근거>`
- 형식 예시: `- [pgg-performance]: [required|not_required] | <짧은 근거>`

## 공통 Frontmatter

```md
---
pgg:
  topic: "<topic>"
  stage: "proposal | plan | task | implementation | refactor | token | performance | qa"
  status: "draft | reviewed | approved | blocked | done"
  skill: "pgg-add | pgg-plan | pgg-code | pgg-refactor | pgg-qa | pgg-token | pgg-performance"
  score: 0
  updated_at: "YYYY-MM-DDTHH:mm:ssZ"
  archive_type: "feat | fix | docs | refactor | chore | remove"
  project_scope: "current-project"
---
```
