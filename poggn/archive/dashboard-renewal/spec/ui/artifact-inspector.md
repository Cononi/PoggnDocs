---
pgg:
  topic: "dashboard-renewal"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-21T15:55:16Z"
reactflow:
  node_id: "spec-artifact-inspector"
  node_type: "doc"
  label: "spec/ui/artifact-inspector.md"
state:
  summary: "topic artifact inspector panel과 detail modal 동작을 정의한다."
  next: "task.md 승인"
---

# Artifact Inspector Spec

## Goal

- topic card 또는 workflow node에서 drill-down한 artifact를 읽기 전용 inspector panel과 modal에서 일관되게 보여주는 계약을 정의한다.

## Artifact Groups

- lifecycle docs: `proposal.md`, `plan.md`, `task.md`, `state/current.md`
- review docs: `reviews/proposal.review.md`, `reviews/plan.review.md`, `reviews/task.review.md`, `reviews/code.review.md`, `reviews/refactor.review.md`, `reviews/qa.review.md`
- implementation docs: `implementation/index.md`, `implementation/diffs/*.diff`
- qa docs: `qa/report.md`, `qa/test-plan.md`, `qa/test-result.md`, `qa/review.md`
- release docs: `version.json`, `workflow.reactflow.json`, `state/history.ndjson`

## Inspector Rules

- inspector는 선택된 topic의 artifact group summary와 현재 선택 artifact detail을 함께 보여준다.
- group summary는 존재 여부, 최신 updatedAt, 개수, 대표 상태를 보여준다.
- detail content는 markdown, diff, plain text를 구분해 표시해야 한다.
- `version.json` 또는 publish metadata가 없는 archive topic도 partial 상태로 처리해야 한다.

## Detail Interaction

- topic card에서 바로 대표 artifact를 열 수 있어야 한다.
- workflow node 선택과 inspector selection은 같은 detail payload를 공유할 수 있어야 한다.
- 긴 문서는 scrollable panel 또는 modal로 보여주고 raw path를 함께 표시한다.
- detail이 없는 경우 unavailable 메시지와 source path만 보여준다.

## UI Boundaries

- inspector는 파일 편집기를 대체하지 않는다.
- markdown 렌더링은 원문 보존과 가독성의 균형을 우선한다.
- diff viewer는 추가/삭제 구분이 가능해야 하지만 git blame나 inline edit는 범위에서 제외한다.

## Non-Requirements

- WYSIWYG 문서 편집
- arbitrary local file browse
- full git history viewer
