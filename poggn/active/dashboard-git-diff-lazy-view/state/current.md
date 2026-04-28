# Current State

## Topic

dashboard-git-diff-lazy-view

## Current Stage

plan

## Goal

pgg code/refactor flow의 대용량 diff 본문 산출물 저장을 Git 기반 지연 조회 방식으로 전환하고, dashboard는 변경 파일명 중심 목록에서 선택 시 diff를 가져오도록 한다.

## Constraints

- project scope: `current-project`
- archive type: `feat`
- version bump: `minor`
- target version: `3.2.0`
- short name: `dashboard-view`
- working branch: `ai/feat/3.2.0-dashboard-view`
- release branch: `release/3.2.0-dashboard-view`

## User Input Ref

- `proposal.md` 섹션 3 `사용자 입력 질문 기록`

## Proposal Decision

- status: `reviewed`
- score: `94`
- next: `pgg-plan`
- blocking issue: 없음
- primary experts: 프로덕트 매니저, UX/UI 전문가

## Plan Decision

- status: `reviewed`
- score: `95`
- next: `pgg-code`
- blocking issue: 없음
- primary experts: 소프트웨어 아키텍트, 도메인 전문가

## Plan Refs

- `plan.md`
- `task.md`
- `spec/workflow/git-diff-artifact-contract.md`
- `spec/dashboard/lazy-diff-view.md`
- `spec/verification/storage-and-regression.md`
- `reviews/plan.review.md`
- `reviews/task.review.md`

## Scope Summary

- 신규 flow의 `implementation/diffs/*.diff` 본문 기본 생성을 제거하거나 opt-in으로 낮춘다.
- 변경 파일 목록과 Git diff 조회 메타데이터는 `implementation/index.md`, `state/current.md`, dashboard data model에 남긴다.
- dashboard는 변경 파일명 목록을 표시하고 선택 시 local Git diff를 조회해 보여준다.
- 과거 archive `.diff` 파일 일괄 삭제는 제외한다.

## Task Summary

| Task ID | Spec | Summary |
|---|---|---|
| T1 | `spec/workflow/git-diff-artifact-contract.md` | workflow 문서, skill 문서, template의 diff artifact 계약 갱신 |
| T2 | `spec/workflow/git-diff-artifact-contract.md` | `pgg-diff-index.sh`와 template index 생성 방식을 Git metadata 기반으로 갱신 |
| T3 | `spec/dashboard/lazy-diff-view.md` | dashboard model/snapshot에 lazy diff metadata 추가 |
| T4 | `spec/dashboard/lazy-diff-view.md` | live API와 UI의 selected-file Git diff 조회 구현 |
| T5 | `spec/verification/storage-and-regression.md` | tests, generated asset update, token/performance 확인 |

## Related Code Surfaces

- `.codex/add/WOKR-FLOW.md`
- `.codex/add/STATE-CONTRACT.md`
- `.codex/add/IMPLEMENTATION.md`
- `.codex/skills/pgg-code/SKILL.md`
- `.codex/skills/pgg-refactor/SKILL.md`
- `.codex/sh/pgg-diff.sh`
- `.codex/sh/pgg-diff-index.sh`
- `packages/core/src/templates.ts`
- `packages/core/src/index.ts`
- `apps/dashboard/src/features/history/historyModel.ts`
- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
- `apps/dashboard/src/shared/model/dashboard.ts`
- `apps/dashboard/src/shared/utils/dashboard.tsx`
- `apps/dashboard/src/shared/ui/ArtifactDocumentContent.tsx`

## Audit Applicability

- [pgg-token]: required | diff 본문 중복 저장과 dashboard snapshot 용량 절감 효과를 확인해야 한다.
- [pgg-performance]: required | dashboard lazy diff 조회 응답성과 대형 diff 표시 비용을 확인해야 한다.

## Changed Files

| CRUD | Path | Note |
|---|---|---|
| CREATE | `poggn/active/dashboard-git-diff-lazy-view/proposal.md` | proposal 작성 |
| CREATE | `poggn/active/dashboard-git-diff-lazy-view/reviews/proposal.review.md` | 전문가 review 작성 |
| CREATE | `poggn/active/dashboard-git-diff-lazy-view/state/current.md` | 다음 단계 handoff 작성 |
| CREATE | `poggn/active/dashboard-git-diff-lazy-view/state/history.ndjson` | stage event evidence |
| CREATE | `poggn/active/dashboard-git-diff-lazy-view/state/dirty-worktree-baseline.txt` | topic 시작 전 dirty baseline 기록 |
| CREATE | `poggn/active/dashboard-git-diff-lazy-view/plan.md` | plan 작성 |
| CREATE | `poggn/active/dashboard-git-diff-lazy-view/task.md` | task 작성 |
| CREATE | `poggn/active/dashboard-git-diff-lazy-view/spec/workflow/git-diff-artifact-contract.md` | workflow diff 계약 spec 작성 |
| CREATE | `poggn/active/dashboard-git-diff-lazy-view/spec/dashboard/lazy-diff-view.md` | dashboard lazy diff spec 작성 |
| CREATE | `poggn/active/dashboard-git-diff-lazy-view/spec/verification/storage-and-regression.md` | 검증 spec 작성 |
| CREATE | `poggn/active/dashboard-git-diff-lazy-view/reviews/plan.review.md` | plan review 작성 |
| CREATE | `poggn/active/dashboard-git-diff-lazy-view/reviews/task.review.md` | task review 작성 |
| UPDATE | `AGENTS.md` | diff artifact 계약 갱신 |
| UPDATE | `poggn/AGENTS.md` | diff artifact 계약 갱신 |
| UPDATE | `.codex/add/WOKR-FLOW.md` | code flow diff artifact 계약 갱신 |
| UPDATE | `.codex/add/STATE-CONTRACT.md` | Changed Files Git metadata 계약 갱신 |
| UPDATE | `.codex/add/IMPLEMENTATION.md` | implementation artifact 계약 갱신 |
| UPDATE | `.codex/skills/pgg-code/SKILL.md` | pgg-code Git diff metadata 계약 갱신 |
| UPDATE | `.codex/skills/pgg-refactor/SKILL.md` | refactor completion evidence 계약 갱신 |
| UPDATE | `.codex/sh/pgg-diff-index.sh` | Git metadata 기반 implementation index 생성 |
| UPDATE | `packages/core/src/templates.ts` | generated workflow/helper/skill template 갱신 |
| UPDATE | `packages/core/src/index.ts` | dashboard snapshot과 Git diff detail 생성 |
| UPDATE | `apps/dashboard/vite.config.ts` | live Git diff API 추가 |
| UPDATE | `apps/dashboard/src/shared/api/dashboard.ts` | lazy diff client API 추가 |
| UPDATE | `apps/dashboard/src/shared/model/dashboard.ts` | lazy diff metadata type 추가 |
| UPDATE | `apps/dashboard/src/shared/utils/dashboard.tsx` | workflow node source 표시 갱신 |
| UPDATE | `apps/dashboard/src/features/history/historyModel.ts` | code flow timestamp/file filtering 갱신 |
| UPDATE | `apps/dashboard/src/features/history/HistoryWorkspace.tsx` | 파일 선택 시 lazy diff 조회 UI 추가 |
| UPDATE | `apps/dashboard/src/shared/ui/ArtifactDocumentContent.tsx` | unavailable/loading fallback 표시 지원 |
| UPDATE | `packages/core/test/dashboard-token-usage.test.mjs` | lazy diff token regression 추가 |
| UPDATE | `scripts/dashboard-history-model.test.mjs` | lazy diff history model regression 추가 |
| UPDATE | `apps/dashboard/public/dashboard-data.json` | generated dashboard snapshot 갱신 |

## Dirty Worktree Baseline

- `변경.md`

## Git Publish Message

- title: feat: 3.2.0.Git 기반 diff 지연 조회
- why: pgg code flow의 diff 본문 중복 저장을 줄이고 dashboard가 변경 파일 선택 시 Git에서 필요한 diff만 조회하도록 전환한다.
- footer: Refs: dashboard-git-diff-lazy-view
