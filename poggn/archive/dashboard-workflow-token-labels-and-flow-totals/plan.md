---
pgg:
  topic: "dashboard-workflow-token-labels-and-flow-totals"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-28T02:23:46Z"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "3.0.2"
  short_name: "dashboard-totals"
  working_branch: "ai/fix/3.0.2-dashboard-totals"
  release_branch: "release/3.0.2-dashboard-totals"
  project_scope: "current-project"
---

# Plan

## 목표

dashboard workflow Overview와 Timeline에서 LLM/local token을 서로 다른 metric으로 표기하고, Overview는 topic 누적치, Timeline은 완료 flow별 측정치를 표시한다.

## Active Specs

- `S1`: `spec/dashboard/token-labels.md`
- `S2`: `spec/token/overview-topic-token-total.md`
- `S3`: `spec/token/timeline-flow-token-summary.md`

## 단계

1. dashboard locale의 LLM/local token label을 `LLM token`, `local token`으로 변경한다.
2. Overview는 기존 topic-level `topic.tokenUsage` 누적 합계를 유지하고 label만 새 semantics에 맞춘다.
3. Timeline row token 합산을 file estimate 기반에서 flow-scoped `topic.tokenUsageRecords` 기반으로 전환한다.
4. flow/stage가 매칭되는 LLM record와 local record를 source별로 분리 합산한다.
5. dashboard history model test로 완료 flow별 token summary를 검증한다.

## 검증

- `pnpm test:dashboard`
- `pnpm --filter @pgg/dashboard build`
- `pnpm --filter @pgg/core test`

## Audit Applicability

- `pgg-token`: `required` | dashboard token metric label과 flow-scoped token summary semantics를 수정하는 topic이다.
- `pgg-performance`: `not_required` | 표시와 집계 범위 수정이며 별도 성능 민감 runtime path는 없다.
