# EXPERT-ROUTING

## Teams Mode

- `pgg teams=on`: stage 시작 시 아래 전문가 roster를 자동 orchestration한다.
- `pgg teams=off`: 동일한 문서 계약을 유지하되 단일 에이전트 흐름으로 진행한다.
- `.codex/agents/main.toml`과 이 문서는 같은 2-agent routing matrix를 유지해야 한다.
- `.codex/config.toml`은 teams mode에 맞춰 `[features].multi_agent`를 동기화하고 `max_threads=4`, `max_depth=1`을 기본값으로 둔다.

## Core Workflow Primary Agents

- `pgg-add`: Product Manager, UX/UI Expert
- `pgg-plan`: Software Architect, Domain Expert
- `pgg-code`: Senior Backend Engineer, Tech Lead
- `pgg-refactor`: Software Architect, Code Reviewer
- `pgg-qa`: QA/Test Engineer, SRE/Operations Engineer

## Optional Audit Primary Agents

- `pgg-token`: Tech Lead, Code Reviewer
- `pgg-performance`: QA/Test Engineer, SRE/Operations Engineer

token/performance routing은 모든 topic에 자동 적용되는 기본 stage가 아니라, applicability가 `required`이거나 사용자가 audit를 명시한 경우에만 호출한다.

## Support Agents

- `project-generalist`: 범용 project context가 필요할 때 parent가 명시적으로 호출한다.
- `docs-researcher`: 공식 문서나 primary source 확인이 필요할 때 parent가 명시적으로 호출한다.
