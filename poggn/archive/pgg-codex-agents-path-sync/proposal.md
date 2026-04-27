---
pgg:
  topic: "pgg-codex-agents-path-sync"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 91
  updated_at: "2026-04-26T15:11:15Z"
  auto_mode: "on"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "2.3.1"
  short_name: "codex-sync"
  working_branch: "ai/fix/2.3.1-codex-sync"
  release_branch: "release/2.3.1-codex-sync"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "Codex agent routing 파일을 .codex/agents 기준으로 생성하고 갱신하도록 pgg init/update 계약을 수정한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

Codex agents 경로를 .codex/agents로 정렬

## 2. 변경 분류

- archive_type: `fix`
- version_bump: `patch`
- target_version: `2.3.1`
- short_name: `codex-sync`
- working_branch: `ai/fix/2.3.1-codex-sync`
- release_branch: `release/2.3.1-codex-sync`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- "$pgg-add agents 폴더는 제가 알기로 .codex안에 있어야하는걸로 아는데요. pgg init, update도 수정해야겠지요?"

## 4. 문제 정의

현재 pgg가 Codex multi-agent routing 파일을 루트 `agents/` 아래에 생성하고 관리한다. 사용자의 기대와 Codex 전용 설정 구조를 기준으로는 agent 설정도 `.codex/agents/` 아래에 있어야 한다.

확인된 현재 상태:

- `packages/core/src/templates.ts`의 `buildGeneratedFiles()`가 `agentTemplates()`를 통해 `agents/main.toml` 및 `agents/*.toml`을 생성한다.
- `packages/core/test/skill-generation.test.mjs`가 `AGENTS_MAIN_PATH = "agents/main.toml"` 및 manifest 경로 `agents/*.toml`을 기대한다.
- `.codex/add/WOKR-FLOW.md`, `.codex/add/STATE-CONTRACT.md`, `.codex/add/EXPERT-ROUTING.md`, `.codex/sh/pgg-state-pack.sh` 출력이 `agents/main.toml`을 routing 기준으로 언급한다.
- 현재 `.pgg/project.json`의 managedFiles도 루트 `agents/` 경로를 관리 파일로 보유한다.

## 5. 제안 범위

이번 topic은 current-project 안에서 Codex agent 설정 경로를 `.codex/agents/`로 일관되게 전환한다.

포함:

- `pgg init`이 신규 프로젝트에 `.codex/agents/main.toml` 및 `.codex/agents/*.toml`을 생성하도록 템플릿 경로를 변경한다.
- `pgg update`가 기존 프로젝트의 managed file manifest를 `.codex/agents/*` 기준으로 갱신하도록 한다.
- `.codex/add/*` 문서와 생성되는 skill 문서에서 routing 참조를 `.codex/agents/main.toml`로 맞춘다.
- `.codex/sh/pgg-state-pack.sh`와 해당 생성 템플릿이 `agent_routing_ref: .codex/agents/main.toml`을 출력하도록 한다.
- 기존 루트 `agents/` 관리 파일의 migration 또는 cleanup 정책을 plan 단계에서 명확히 정한다.
- 관련 테스트가 `.codex/agents/*`를 기대하도록 갱신된다.

제외:

- Codex 자체의 agent schema 변경
- teams mode의 2-agent routing matrix 변경
- pgg workflow stage 모델 변경
- 프로젝트 밖 전역 Codex 설정 변경

## 6. 성공 기준

- `pgg init` 산출물에 루트 `agents/`가 아닌 `.codex/agents/`가 포함된다.
- `pgg update` 후 `.pgg/project.json`의 managedFiles가 `.codex/agents/main.toml` 및 `.codex/agents/*.toml`을 추적한다.
- state-pack과 문서의 routing reference가 모두 `.codex/agents/main.toml`로 일치한다.
- 기존 루트 `agents/` 파일이 managed file로 남아 경로가 이중화되지 않는다.
- 관련 core 테스트가 경로 변경을 검증한다.

## 7. 리스크와 결정 필요사항

- 기존 사용자의 루트 `agents/` 폴더가 pgg-managed 파일만 포함하는 경우 제거 또는 archive 가능한지 plan에서 결정해야 한다.
- 루트 `agents/`에 사용자 커스텀 파일이 섞여 있으면 자동 삭제하지 않고 conflict 또는 migration note로 남겨야 한다.
- `.pgg/project.json` checksum 갱신은 `updateProject()` 동작과 함께 검증해야 한다.

## 8. Audit Applicability

- [pgg-token]: required | workflow 자산과 state handoff 경로 계약을 바꾸는 변경이다.
- [pgg-performance]: not_required | 런타임 성능 경로가 아니라 생성/갱신 파일 경로 계약 변경이다.

## Git Publish Message

- title: fix: 2.3.1.Codex agents 경로 정렬
- why: Codex agent routing 파일이 루트 agents/에 생성되어 Codex 전용 설정 구조와 맞지 않는다. init/update 템플릿, managed manifest, 문서, state-pack 출력, 테스트 기준을 .codex/agents/로 맞춰 경로 이중화와 handoff 혼선을 줄인다.
- footer: Refs: pgg-codex-agents-path-sync
