---
pgg:
  topic: "pgg-agent-role-schema-compat"
  stage: "proposal"
  status: "draft"
  skill: "pgg-add"
  score: 92
  updated_at: "2026-04-27T00:46:10Z"
  auto_mode: "on"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "2.3.2"
  short_name: "agent-compat"
  working_branch: "ai/fix/2.3.2-agent-compat"
  release_branch: "release/2.3.2-agent-compat"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "Codex agent role TOML schema mismatch warning을 제거한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

Codex agent role schema compatibility fix

## 2. 변경 분류

- archive_type: `fix`
- version_bump: `patch`
- target_version: `2.3.2`
- short_name: `agent-compat`
- working_branch: `ai/fix/2.3.2-agent-compat`
- release_branch: `release/2.3.2-agent-compat`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- `$pgg-add` 실행 중 Codex가 `.codex/agents/*.toml` agent role definition을 읽지 못하고 무시한다는 경고가 발생했다.
- 대표 오류:
  - `.codex/agents/code-reviewer.toml`: unknown field `category`
  - `.codex/agents/docs-researcher.toml`: unknown field `category`
  - `.codex/agents/domain-expert.toml`: unknown field `category`
  - `.codex/agents/main.toml`: unknown field `activation`
  - `.codex/agents/product-manager.toml`: unknown field `category`
  - `.codex/agents/project-generalist.toml`: unknown field `category`
  - `.codex/agents/qa-test-engineer.toml`: unknown field `category`
  - `.codex/agents/senior-backend-engineer.toml`: unknown field `category`
  - `.codex/agents/software-architect.toml`: unknown field `category`
  - `.codex/agents/tech-lead.toml`: unknown field `category`
  - `.codex/agents/ux-ui-expert.toml`: unknown field `category`

## 4. 문제 정의

현재 `.codex/agents` role definition TOML이 Codex가 실제로 deserialize하는 schema보다 넓은 필드를 포함한다. 그 결과 Codex는 agent role file을 malformed로 판단하고 해당 role definition을 무시한다.

이 문제는 `pgg teams=on` 전환 시 자동 orchestration의 전제인 local role registry를 신뢰할 수 없게 만들고, `pgg teams=off` 상태에서도 매 실행마다 경고를 발생시켜 workflow 진단을 어렵게 한다.

## 5. 목표

- Codex가 `.codex/agents/*.toml`과 `.codex/agents/main.toml`을 malformed로 무시하지 않게 한다.
- pgg의 2-agent routing 의미는 `.codex/add/EXPERT-ROUTING.md`, `.codex/add/WOKR-FLOW.md`, 또는 Codex가 허용하는 TOML 필드 안에 보존한다.
- `pgg teams=off`의 현재 동작은 유지하고, teams mode 전환 시에도 agent budget `max_threads=4`, `max_depth=1` 계약을 깨지 않는다.
- 수정 범위는 current-project 내부의 `.codex/agents` 및 필요한 pgg 문서/managed metadata로 제한한다.

## 6. 비목표

- 전역 Codex 설정이나 사용자 홈 디렉터리 설정을 수정하지 않는다.
- Codex agent role schema 자체를 확장한다고 가정하지 않는다.
- proposal 단계에서 실제 TOML 수정은 수행하지 않는다.

## 7. 제안 범위

- `.codex/agents/main.toml`에서 현재 Codex deserializer가 거부하는 top-level field를 확인하고 허용 schema에 맞게 제거하거나 허용 필드로 이전한다.
- 개별 role TOML에서 `category`처럼 거부되는 필드를 제거하고, primary/support 구분은 routing source of truth 문서 또는 허용된 설명 필드로 보존한다.
- 필요하면 `.pgg/project.json` managed file checksum 갱신을 후속 구현/QA 범위에 포함한다.
- 검증은 Codex가 같은 warning을 더 이상 출력하지 않는지 확인하는 수동 재실행 evidence와, 가능한 경우 local helper/gate evidence를 남기는 방식으로 진행한다.

## 8. 성공 기준

- 동일한 `$pgg-add` 시작 경로에서 `Ignoring malformed agent role definition` 경고가 재현되지 않는다.
- `pgg-add` primary agent 계약은 Product Manager, UX/UI Expert 2개로 문서상 유지된다.
- 모든 core/optional flow의 primary agent가 2개를 초과하지 않는다.
- current-project 밖 파일 변경이 없다.

## 9. Audit Applicability

- [pgg-token]: not_required | 큰 문서/컨텍스트 구조 변경이 아니라 agent schema compatibility fix다.
- [pgg-performance]: not_required | 런타임 성능 경로가 아니라 local workflow configuration warning 제거다.

## 10. Git Publish Message

- title: fix: 2.3.2.agent role schema compat
- why: Codex가 local agent role TOML을 malformed로 무시하지 않도록 unsupported field 정리를 계획한다. pgg teams routing 문서 계약은 유지하면서 실행 경고와 agent registry 불일치를 제거한다.
- footer: Refs: pgg-agent-role-schema-compat
