---
pgg:
  topic: "dashboard-git-diff-lazy-view"
  stage: "performance"
  status: "done"
  skill: "pgg-performance"
  updated_at: "2026-04-28T06:26:37Z"
  archive_type: "feat"
  project_scope: "current-project"
---

# Performance Audit Report

## Decision

pass

## Scope

- 대상: dashboard lazy diff 조회 경로의 Git diff detail 생성 비용
- 제외: 브라우저 렌더링 FPS, 네트워크 latency. current-project verification contract가 manual이고 자동 브라우저 성능 목표가 선언되지 않았다.

## Measurements

| Scenario | Baseline | Target | Actual | Result |
|---|---:|---:|---:|---|
| lazy diff detail 조회 40건 | eager snapshot diff body 저장 | 평균 100ms 이하 | 평균 13.31ms | pass |
| lazy diff detail 조회 40건 | eager snapshot diff body 저장 | 최대 250ms 이하 | 최대 22.86ms | pass |
| lazy diff detail 전체 조회 | eager snapshot diff body 저장 | 1초 이하 | 532.54ms | pass |
| lazy diff content payload | snapshot 저장 | 필요한 시점에만 생성 | 6,711 bytes returned | pass |

## Measurement Method

- `packages/core/dist/index.js`의 `readTopicGitDiffDetail()`을 `implementation/index.md`의 lazy diff metadata 40개 전체에 대해 순차 호출했다.
- 각 호출은 local Git command로 diff를 조회했고, 총 시간, 평균 시간, 최대 시간을 `node:perf_hooks`로 측정했다.
- 결과: 40건 중 2건은 available diff, 38건은 empty fallback이었다.

## Verification

| Command | Result |
|---|---|
| `pnpm --filter @pgg/core test` | pass, 61 tests |
| `node scripts/dashboard-history-model.test.mjs` | pass, 3 tests |

## Expert Notes

- QA/테스트 엔지니어: lazy 조회 path는 regression test와 측정 스크립트 모두에서 정상 동작했다.
- SRE: 조회 비용은 local Git 실행 비용에 묶이며 현재 규모에서는 평균/최대 기준 모두 목표 안에 있다. 대형 diff에서는 UI virtualized rendering 또는 line cap 정책을 별도 topic으로 검토할 수 있다.
