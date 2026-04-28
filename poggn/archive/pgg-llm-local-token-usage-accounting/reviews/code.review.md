---
pgg:
  topic: "pgg-llm-local-token-usage-accounting"
  stage: "review"
  status: "reviewed"
  score: 96
  updated_at: "2026-04-28T02:04:11Z"
---

# code.review

## 전문가 메모

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 시니어 백엔드 엔지니어 | 96 | core 집계는 direct LLM token과 artifact fallback을 분리하고, 같은 artifact에 direct record가 있으면 fallback을 중복 합산하지 않는다. local은 `source: "local"` record만 합산해 요구사항을 충족한다. | 없음 |
| 테크 리드 | 96 | dashboard snapshot, state-pack helper, generated template, dist 산출물, regression test가 같은 semantics로 정렬되었다. 기존 ledger schema 변경 없이 호환성을 유지했다. | 없음 |

## 검토 결과

approved

## Verification

- `pnpm --filter @pgg/core test`: pass, 55 tests.
- `pnpm --filter @pgg/dashboard build`: pass, Vite chunk-size warning only.
- `.codex/sh/pgg-state-pack.sh dashboard-optional-audit-token-metrics`: pass, token_usage_llm_total `1167`, token_usage_local_total `1074`, unavailable records `6`.

## Blocking Issues

없음
