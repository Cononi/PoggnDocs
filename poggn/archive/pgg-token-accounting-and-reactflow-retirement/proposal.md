---
pgg:
  topic: "pgg-token-accounting-and-reactflow-retirement"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 96
  updated_at: "2026-04-28T03:23:52Z"
  auto_mode: "on"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "3.0.5"
  short_name: "token-retirement"
  working_branch: "ai/fix/3.0.5-token-retirement"
  release_branch: "release/3.0.5-token-retirement"
  project_scope: "current-project"
state:
  summary: "pgg-code 토큰 집계 과다 산정 원인을 수정하고 React Flow workflow 산출물 생성을 중단한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

pgg-token-accounting-and-reactflow-retirement

## 2. 변경 분류

- archive_type: `fix`
- version_bump: `patch`
- target_version: `3.0.5`
- short_name: `token-retirement`
- working_branch: `ai/fix/3.0.5-token-retirement`
- release_branch: `release/3.0.5-token-retirement`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- `1. pgg-code flow에서 토큰을 계산하는 방식이 정확한가요? llm 토큰이 실제 codex 서버에서 내려주는 코드 내용에 비해 과도한 토큰 집계를 하는거 같습니다.`
- `2. react-flow는 더 이상 사용하지 않을거 같습니다. workflow.reactflow.json을 더 이상 만들지 않게해서 토큰 낭비를 줄입니다.`

## 4. 문제 정의

- 현재 dashboard token summary는 `usage_metadata_available:false`인 `measurement:"actual"` LLM record도 실제 서버 토큰처럼 합산한다.
- ledger가 없거나 record가 일부만 있을 때 topic 산출물 파일 크기 기반 추정치를 `llmActualTokens` baseline으로 더해 실제 Codex 서버 usage보다 크게 표시될 수 있다.
- `workflow.reactflow.json`은 더 이상 사용하지 않는 산출물이지만 `pgg-add` helper, generated template, workflow artifact summary에서 필수 파일로 남아 생성과 스냅샷 토큰을 늘린다.

## 5. 목표

- actual LLM token은 Codex/provider usage metadata가 명시적으로 제공된 record만 반영한다.
- metadata가 없는 generated artifact 크기 추정치는 actual LLM token에 섞지 않고 local estimated token으로 취급한다.
- `workflow.reactflow.json` 신규 생성을 중단하고 dashboard artifact completeness에서 필수 workflow doc으로 요구하지 않는다.
- 기존 archive topic의 과거 `workflow.reactflow.json`은 읽을 수 있게 유지하되 새 topic 생성 경로에서는 만들지 않는다.

## 6. 범위

- `.codex/sh/pgg-new-topic.sh`
- `.codex/add/WOKR-FLOW.md`, `.codex/add/SHELL-RULES.md`
- `.codex/skills/pgg-add/SKILL.md`
- `packages/core/src/index.ts`
- `packages/core/src/templates.ts`
- token usage 및 status 관련 테스트
- 현재 topic 산출물

## 7. 제외

- 과거 archive topic에서 이미 생성된 `workflow.reactflow.json` 삭제
- dashboard UI의 token label rename 전체 개편
- Codex 서버 usage metadata를 새로 수집하는 외부 연동

## 8. 성공 기준

- `usage_metadata_available:false` 또는 `measurement:"unavailable"`인 LLM record는 actual LLM 합계에 들어가지 않는다.
- ledger가 없으면 topic markdown artifact 추정치는 `localEstimatedTokens`에 표시되고 `llmActualTokens`는 `null` 또는 실제 metadata 합계만 표시된다.
- 새 topic 생성 helper와 generated template이 `workflow.reactflow.json`을 만들지 않는다.
- dashboard artifact summary가 workflow doc 부재를 partial health로 만들지 않는다.

## 9. Audit Applicability

- `pgg-token`: `required` | token usage 산정 계약과 workflow artifact 제거가 핵심 변경이다.
- `pgg-performance`: `not_required` | 런타임 성능 민감 경로가 아니라 산정/문서 생성 정책 변경이다.

## 10. Git Publish Message

- title: fix: 3.0.5.token accounting trim
- why: 실제 Codex usage metadata가 없는 산출물 추정치를 actual LLM token으로 표시하지 않고, 더 이상 사용하지 않는 React Flow workflow 산출물 생성을 중단해야 한다.
- footer: Refs: pgg-token-accounting-and-reactflow-retirement
