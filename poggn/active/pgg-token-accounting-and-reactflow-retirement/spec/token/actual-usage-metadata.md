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
  summary: "actual LLM token 집계 조건을 provider usage metadata 기반으로 제한한다."
  next: "pgg-code"
---

# Spec S1: Actual Usage Metadata

## 요구사항

1. actual LLM token은 `source:"llm"`, `measurement:"actual"`, `estimated:false`, `usage_metadata_available:true` record만 합산한다.
2. `measurement:"unavailable"` record는 actual LLM token으로 합산하지 않는다.
3. `usage_metadata_available:false` record는 `measurement:"actual"`이어도 actual LLM token으로 합산하지 않는다.
4. artifact file size 기반 추정치는 actual LLM token fallback이 아니라 local estimated token으로 집계한다.
5. diff artifact는 기존처럼 local estimated token으로 유지한다.

## 수용 기준

- Codex 서버가 내려준 usage metadata가 없는 값은 `llmActualTokens`에 반영되지 않는다.
- ledger record count와 record 목록은 유지되어 audit trail을 잃지 않는다.
- dashboard topic total은 actual LLM token과 local estimated token의 합으로 계산된다.
