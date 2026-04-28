---
pgg:
  topic: "pgg-token-accounting-and-reactflow-retirement"
  stage: "review"
  status: "reviewed"
  skill: "pgg-code"
  score: 96
  updated_at: "2026-04-28T03:35:40Z"
---

# Code Review

## 전문가 메모

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 시니어 백엔드 엔지니어 | 96 | token summary가 `usageMetadataAvailable:true` actual record만 LLM actual로 집계하도록 수정되어 Codex 서버 usage와 artifact estimate가 분리됐다. | 없음 |
| 테크 리드 | 96 | `workflow.reactflow.json`은 legacy read만 유지하고 신규 생성, 필수 health 조건, generated helper surface에서 제거되어 토큰 낭비 경로가 닫혔다. | 없음 |

## 검토 결과

- `pgg-code` 과다 집계 원인은 실제 서버 usage metadata가 없는 record와 파일 크기 추정치가 `llmActualTokens`에 섞인 데 있었다.
- metadata 없는 LLM record와 unrecorded artifact baseline은 local estimate로 이동해 dashboard total은 유지하되 actual LLM 의미를 좁혔다.
- React Flow helper와 생성 템플릿 제거 후에도 기존 `workflow.reactflow.json` parser는 남겨 과거 archive 호환성을 유지했다.
- blocking issue 없음.
