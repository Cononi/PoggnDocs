---
pgg:
  topic: "pgg-token-accounting-and-reactflow-retirement"
  stage: "refactor"
  status: "reviewed"
  skill: "pgg-refactor"
  score: 94
  updated_at: "2026-04-28T04:21:31Z"
---

# Refactor Review

## 전문가 메모

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 소프트웨어 아키텍트 | 96 | core token aggregation의 source별 artifact record 검사 중복을 공통 helper로 접어 책임 경계를 유지하면서 반복을 줄였다. | 없음 |
| 코드 리뷰어 | 92 | dashboard history timeline도 같은 구조로 정리되어 actual/local estimate 계약은 유지됐지만, unrelated dirty worktree 때문에 stage-local commit은 deferred 처리됐다. | refactor commit deferred |

## 검토 결과

- `packages/core/src/index.ts`의 `fileHasLlmTokenRecord`와 `fileHasLocalTokenRecord`가 같은 path matching 로직을 반복하지 않도록 `fileHasTokenRecordWithSource`를 도입했다.
- `apps/dashboard/src/features/history/historyModel.ts`도 `fileHasFlowRecordWithSource`를 통해 dashboard timeline token summary의 중복을 제거했다.
- actual LLM token 집계 조건, local estimated token fallback, React Flow legacy read 호환성은 변경하지 않았다.
- blocking issue: unrelated dirty worktree 때문에 `pgg-stage-commit.sh`가 `publish_blocked`를 반환해 refactor completion commit은 아직 남지 않았다.

## Verification

- `pnpm test`: 통과
- `pnpm build`: 통과

## Git Evidence

- helper: `.codex/sh/pgg-stage-commit.sh`
- resultType: `publish_blocked`
- reason: `Unrelated worktree changes are present, so the stage-local commit was deferred.`
- attempted title: `fix: 3.0.5.토큰 record 중복 정리`
