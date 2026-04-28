---
pgg:
  topic: "pgg-token-accounting-and-reactflow-retirement"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-28T03:23:52Z"
  archive_type: "fix"
  project_scope: "current-project"
state:
  summary: "actual LLM token 산정과 React Flow 산출물 제거 계획을 확정한다."
  next: "pgg-code"
---

# Plan

## 목표

- pgg dashboard token summary가 실제 Codex/provider usage metadata와 artifact size estimate를 섞지 않게 한다.
- 새 pgg topic에서 `workflow.reactflow.json`이 생성되지 않게 한다.
- 과거 topic의 workflow JSON 읽기 호환성은 유지한다.

## 접근

1. `packages/core/src/index.ts`의 token aggregation에서 actual LLM token 조건을 `source:"llm"`, `measurement:"actual"`, `estimated:false`, `usageMetadataAvailable:true`로 제한한다.
2. metadata 없는 LLM record와 artifact baseline estimate는 `localEstimatedTokens`로 돌려 actual LLM 합계 과대 표시를 막는다.
3. `workflow.reactflow.json` artifact group을 optional로 바꾸고, 파일이 없어도 topic health가 partial이 되지 않게 한다.
4. `.codex/sh/pgg-new-topic.sh`와 generated template에서 workflow JSON 쓰기를 제거한다.
5. workflow 생성 helper는 trusted script 목록과 generated manifest에서 제거한다.
6. tests fixture와 기대값을 새 token contract에 맞게 갱신한다.

## 검증

- `pnpm test`
- `pnpm build`
- 변경된 helper/template에서 `workflow.reactflow.json` 생성 문자열이 사라졌는지 검색 확인

## Audit Applicability

- `pgg-token`: `required` | token usage 산정 방식 자체 변경이다.
- `pgg-performance`: `not_required` | 성능 계약 변경이 아니다.

## Git Publish Message

- title: fix: 3.0.5.token accounting trim
- why: 실제 Codex usage metadata가 없는 산출물 추정치를 actual LLM token으로 표시하지 않고, 더 이상 사용하지 않는 React Flow workflow 산출물 생성을 중단해야 한다.
- footer: Refs: pgg-token-accounting-and-reactflow-retirement
