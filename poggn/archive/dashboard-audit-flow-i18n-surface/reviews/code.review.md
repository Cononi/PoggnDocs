---
pgg:
  topic: "dashboard-audit-flow-i18n-surface"
  stage: "review"
  status: "reviewed"
  skill: "pgg-code"
  score: 95
  updated_at: "2026-04-27T04:55:08Z"
---

# code.review

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 시니어 백엔드 엔지니어 | 95 | workflow model에 `token` optional flow를 추가하고 `pgg-token`/`pgg-performance` alias, history event evidence, workflow node evidence를 같은 정규화 경로로 처리했다. | 없음 |
| 테크 리드 | 95 | dashboard 표시 문자열을 locale dictionary로 이동하고, pgg helper/template language selection을 manifest 기반으로 정렬해 raw metadata와 presentation i18n 경계를 유지했다. | 없음 |

## Decision

approved

## Verification

- `pnpm --filter @pgg/dashboard build`: pass
- `pnpm --filter @pgg/core build`: pass
- `pnpm --filter @pgg/core test`: pass, 41 tests

## Notes

- mandatory implementation criteria 기준에서 중복 locale mapping은 helper function으로 제한했고, raw enum/stage 값은 저장 레이어에서 번역하지 않았다.
- `pgg-token` applicability가 required이므로 다음 flow 전에 token audit report가 필요하다.
