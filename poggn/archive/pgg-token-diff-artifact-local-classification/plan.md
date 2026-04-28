---
pgg:
  topic: "pgg-token-diff-artifact-local-classification"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-28T03:08:20Z"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "3.0.4"
  short_name: "token-classification"
  working_branch: "ai/fix/3.0.4-token-classification"
  release_branch: "release/3.0.4-token-classification"
  project_scope: "current-project"
---

# Plan

## 목표

diff artifact를 LLM token baseline에서 제외하고 local command output token으로 계산한다.

## Active Specs

- `S1`: `spec/token/diff-artifact-local-token.md`
- `S2`: `spec/dashboard/diff-token-summary.md`
- `S3`: `spec/pgg/generated-project-propagation.md`

## 단계

1. core snapshot에서 `.diff`와 `implementation/diffs/*` artifact를 local token artifact로 분류한다.
2. LLM artifact baseline과 LLM record fallback은 diff artifact를 제외한다.
3. local token total은 diff artifact baseline과 local source record를 합산한다.
4. dashboard Timeline도 같은 분류로 완료 flow별 LLM/local token을 표시한다.
5. core/dashboard regression test와 dist build를 갱신한다.

## 검증

- `pnpm --filter @pgg/core test`
- `pnpm test:dashboard`
- `pnpm --filter @pgg/dashboard build`

## Audit Applicability

- `pgg-token`: `required` | token source classification semantics를 수정하는 topic이다.
- `pgg-performance`: `not_required` | file classification 분기 추가이며 별도 성능 민감 path는 없다.
