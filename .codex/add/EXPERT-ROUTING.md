# EXPERT-ROUTING

## Teams Mode

- `pgg teams=on`: stage 시작 시 아래 전문가 roster를 자동 orchestration한다.
- `pgg teams=off`: 동일한 문서 계약을 유지하되 단일 에이전트 흐름으로 진행한다.
- `.codex/add/AGENT-ROUTING.toml`와 이 문서는 같은 2-agent routing matrix를 유지해야 한다.
- `.codex/config.toml`은 teams mode에 맞춰 `[features].multi_agent`를 동기화하고 `max_threads=4`, `max_depth=1`을 기본값으로 둔다.

## Core Workflow Primary Agents

- `pgg-add`: 프로덕트 매니저, UX/UI 전문가
- `pgg-plan`: 소프트웨어 아키텍트, 도메인 전문가
- `pgg-code`: 시니어 백엔드 엔지니어, 테크 리드
- `pgg-refactor`: 소프트웨어 아키텍트, 코드 리뷰어
- `pgg-qa`: QA/테스트 엔지니어, SRE/운영 엔지니어

## Optional Audit Primary Agents

- `pgg-token`: 테크 리드, 코드 리뷰어
- `pgg-performance`: QA/테스트 엔지니어, SRE/운영 엔지니어

token/performance routing은 모든 topic에 자동 적용되는 기본 stage가 아니라, applicability가 `required`이거나 사용자가 audit를 명시한 경우에만 호출한다.

## Support Agents

- `project-generalist`: 범용 project context가 필요할 때 parent가 명시적으로 호출한다.
- `docs-researcher`: 공식 문서나 primary source 확인이 필요할 때 parent가 명시적으로 호출한다.
