---
pgg:
  topic: "pgg-codex-agents-path-sync"
  stage: "review"
  status: "reviewed"
  score: 94
  updated_at: "2026-04-26T15:27:23Z"
---

# code.review

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 시니어 백엔드 엔지니어 | 94 | Template source now owns the `.codex/agents/*` path contract, so `pgg init` and `pgg update` share the same behavior through `syncProject()`. Tests cover new path generation and safe retirement of prior root managed files. | 없음 |
| 테크 리드 | 94 | The implementation keeps the existing routing matrix and teams semantics unchanged while moving only the storage path. Generated docs, state-pack output, manifest sync, and dist output are aligned. | 없음 |

## Decision

pass

## Verification

- `pnpm build`: pass
- `node packages/cli/dist/index.js update`: pass
- `pnpm test`: pass, 39 tests
- `.codex/sh/pgg-state-pack.sh pgg-codex-agents-path-sync`: pass

## Residual Risk

- `.codex/agents/*` is ignored by default and must be staged with force-add during governed commit.
- `pgg-token` remains required because workflow handoff references changed.
