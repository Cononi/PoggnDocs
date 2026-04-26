---
pgg:
  topic: "codex-multi-agent-orchestration"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 94
  updated_at: "2026-04-26T07:23:42Z"
  auto_mode: "on"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "2.3.0"
  short_name: "codex-orchestration"
  working_branch: "ai/feat/2.3.0-codex-orchestration"
  release_branch: "release/2.3.0-codex-orchestration"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "Codex multi-agent 설정과 pgg teams 기반 agent orchestration을 proposal로 확정한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

codex-multi-agent-orchestration

## 2. 변경 분류

- archive_type: `feat`
- version_bump: `minor`
- target_version: `2.3.0`
- short_name: `codex-orchestration`
- working_branch: `ai/feat/2.3.0-codex-orchestration`
- release_branch: `release/2.3.0-codex-orchestration`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- `$pgg-add codex가 사용하는 멀티 에이전트(서브 에이전트) 기능이 필요합니다.`
- `config.toml : codex가 사용하는 설정파일로 그외 추가 기능 구현 필요하며 multi_agent는 teams가 on일때 true false 처리하고 에이전트 개수와 깊이는 알아서 최적의 세팅 해주세요. 토큰 최적화로`
- `[features] multi_agent = true`
- `[agents] max_threads = x, max_depth = x`
- `AGENTS.md : 전체 에이전트들을 제어하기 위한 공통 규약 과 제약 입니다.`
- `agents/*.toml : AGNETS.md에 설명한 기능 모두 각 파일이 있어야 합니다. 에이전트 메인 페이지 설정이 필요합니다.`
- `프로덕트 매니저, UX/UI 전문가, 도메인 전문가, 소프트웨어 아키텍트, 시니어 백엔드 엔지니어, QA/테스트 엔지니어, 테크 리드, 코드 리뷰어, QA/테스트 엔지니어, SRE / 운영 엔지니어`
- `각 flow에서 필요한 agents를 2개 사용하도록 만들어야 합니다.`
- `전체 기능과 문서에서 현 기능으로 만들면 필요 없어지는 문서나 수정사항이 잇으면 이 기능을 토대로 변경 해주시기 바랍니다.`
- `에이전트들은 전부 범용으로 어떤 프로젝트에서도 최선책을 보여줘야 합니다. 만약 범용적으로 쓸 수 있는 에이전트가 없다면 추가적으로 범용을 위한 에이전트도 몇개 만들어주시기 바랍니다.`
- `절대적으로 따라야 하는건 codex 가이드 라인에서 권장하거나 가이드에 지침대로 해야 합니다.`

## 4. 문제 정의

현재 pgg 문서는 teams mode와 expert roster를 설명하지만, Codex가 직접 읽을 수 있는 multi-agent configuration, agent role TOML, flow별 2-agent routing contract가 없다. 이 때문에 teams mode가 `on`이어도 Codex sub-agent 기능과 pgg workflow evidence가 하나의 설정 체계로 연결되지 않는다.

## 5. 목표

- Codex 설정 파일을 프로젝트 내부에서 관리하고, `pgg teams=on`이면 `[features].multi_agent=true`, `off`이면 `false`로 동기화한다.
- token 최적화를 위해 기본값은 `max_threads=4`, `max_depth=1`로 제한한다.
- 모든 core flow와 optional audit는 정확히 2개의 primary agent만 사용한다.
- `AGENTS.md`는 전체 agent 공통 규약, 제한, handoff, 중복 작업 금지, close/cleanup 규칙을 갖는다.
- `agents/*.toml`은 범용 프로젝트에서도 재사용 가능한 역할 정의로 구성한다.
- 기존 문서와 generated template에서 중복되거나 3-agent roster로 남은 부분은 새 2-agent routing contract에 맞게 정리한다.

## 6. 제안 범위

### 6.1 Codex config

생성 또는 갱신 대상:

- `.codex/config.toml`

예상 기본값:

```toml
[features]
multi_agent = true

[agents]
max_threads = 4
max_depth = 1
```

규칙:

- 실제 `multi_agent` 값은 `.pgg/project.json`의 `teamsMode`에서 파생한다.
- `teamsMode=on`이면 `multi_agent=true`, `teamsMode=off`이면 `multi_agent=false`다.
- `max_threads=4`는 parent + flow primary 2 agents + one spare review/audit slot을 허용하는 보수적 기본값이다.
- `max_depth=1`은 root Codex만 child agent를 spawn하고 child agent가 다시 agent를 만들지 못하게 해 토큰과 승인 체인을 제한한다.
- plan 단계에서 현재 Codex CLI가 지원하는 config key와 project-local config 우선순위를 공식/primary source로 검증한다. 지원되지 않는 key는 Codex config에 쓰지 않고 pgg-managed metadata로 분리한다.

### 6.2 Agent files

생성 대상:

- `agents/main.toml`
- `agents/product-manager.toml`
- `agents/ux-ui-expert.toml`
- `agents/domain-expert.toml`
- `agents/software-architect.toml`
- `agents/senior-backend-engineer.toml`
- `agents/tech-lead.toml`
- `agents/code-reviewer.toml`
- `agents/qa-test-engineer.toml`
- `agents/sre-operations-engineer.toml`
- `agents/project-generalist.toml`
- `agents/docs-researcher.toml`

`agents/main.toml`은 agent index/main page 역할을 하며, flow routing matrix, role 목적, 읽기/쓰기 권한, 종료 기준을 요약한다.

### 6.3 Flow별 2-agent routing

| Flow | Agent 1 | Agent 2 | 목적 |
|---|---|---|---|
| `pgg-add` | Product Manager | UX/UI Expert | 문제 정의, 사용자 흐름, 성공 기준 |
| `pgg-plan` | Software Architect | Domain Expert | 구조 설계, domain constraint, spec 분해 |
| `pgg-code` | Senior Backend Engineer | Tech Lead | 구현 경로, 파일 ownership, integration risk |
| `pgg-refactor` | Software Architect | Code Reviewer | 구조 개선, dead code 제거, 회귀 위험 |
| `pgg-qa` | QA/Test Engineer | SRE/Operations Engineer | test evidence, runtime/release risk |
| `pgg-token` | Tech Lead | Code Reviewer | handoff token, context minimization, duplication |
| `pgg-performance` | QA/Test Engineer | SRE/Operations Engineer | performance evidence, operational risk |

`project-generalist`와 `docs-researcher`는 flow primary agent가 아니라 fallback/support role이다. Codex 공식 문서나 library behavior 확인처럼 범용 specialist가 필요한 경우에만 parent가 명시적으로 사용한다.

### 6.4 AGENTS.md와 문서 정리

갱신 대상:

- `AGENTS.md`
- `.codex/add/WOKR-FLOW.md`
- `.codex/add/STATE-CONTRACT.md`
- `.codex/add/EXPERT-ROUTING.md`
- `.codex/skills/pgg-add/SKILL.md`
- `.codex/skills/pgg-plan/SKILL.md`
- `.codex/skills/pgg-code/SKILL.md`
- `.codex/skills/pgg-refactor/SKILL.md`
- `.codex/skills/pgg-qa/SKILL.md`
- `.codex/skills/pgg-token/SKILL.md`
- `.codex/skills/pgg-performance/SKILL.md`
- `packages/core/src/templates.ts` 및 generated `dist` assets

정리 기준:

- 기존 3-agent roster는 새 2-agent routing matrix로 치환한다.
- flow별 expert 설명은 `EXPERT-ROUTING.md` 또는 `agents/main.toml`을 source of truth로 삼고, skill 문서에는 중복 전체 복사를 피한다.
- `AGENTS.md`에는 모든 agent 공통 규약을 둔다: 최소 context handoff, disjoint ownership, 중복 작업 금지, blocking work는 parent가 처리, agent 결과 review 후 close, destructive command 금지.

## 7. 비범위

- 현재 turn에서는 구현하지 않는다. 이 proposal은 pgg-add 산출물이며 실제 파일 생성/수정은 pgg-plan 이후 수행한다.
- 전역 `~/.codex/config.toml`은 수정하지 않는다.
- Codex CLI 자체를 patch하거나 fork하지 않는다.
- teams mode가 `off`일 때 자동으로 sub-agent를 spawn하지 않는다.

## 8. 성공 기준

- `pgg teams on/off` 상태와 Codex `multi_agent` 설정이 같은 truth에서 동기화된다.
- pgg dashboard와 state evidence가 flow별 2-agent orchestration 상태를 추적할 수 있다.
- 모든 agent TOML은 범용 역할 설명, 권한, 금지사항, output contract를 포함한다.
- token 최적화 기본값은 `max_threads=4`, `max_depth=1`이며, 더 큰 값은 명시 사유 없이 기본값이 되지 않는다.
- core workflow와 optional audit 문서가 서로 다른 roster를 말하지 않는다.

## 9. 위험과 완화

- Codex config schema가 변할 수 있다. plan 단계에서 OpenAI/Codex primary source 또는 local installed Codex behavior를 확인하고 지원되는 key만 구현한다.
- multi-agent는 토큰을 병렬로 소모한다. 기본값을 보수적으로 두고, agent handoff는 `state/current.md`와 `pgg-state-pack.sh` 중심으로 제한한다.
- agent가 서로 같은 파일을 수정하면 충돌 위험이 있다. worker ownership을 flow/task 단위로 명확히 하고 parent가 통합한다.
- `teamsMode=off`에서도 agent config 파일이 존재할 수 있다. 존재와 활성화를 분리하고, off 상태에서는 `multi_agent=false`로 둔다.
