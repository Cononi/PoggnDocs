---
pgg:
  topic: "dashboard-workflow-tab-status-release-fix"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-24T23:52:49Z"
---

# S2. Strict Flow Completion

## 목적

모든 flow는 해당 stage의 완료 조건이 완전히 끝난 뒤에만 `완료`로 표시한다.

## Completion Evidence

- 공통 완료 evidence는 `stage-commit`, verified/final/gate/qa source의 `stage-completed`, archive/later-flow advancement다.
- Add 완료: proposal, proposal review pass, state/current handoff, workflow metadata가 검증되어야 한다.
- Plan 완료: plan, task, spec files, plan review, task review가 모두 pass되어야 한다.
- Code 완료: implementation index, required diffs, code review, task-scoped completion evidence가 있어야 한다.
- Refactor 완료: refactor work/review와 cleanup evidence가 있어야 한다.
- QA 완료: qa report pass와 archive/release outcome 처리가 끝나야 한다.

## Non-Completion Evidence

- artifact 존재
- draft 또는 reviewed frontmatter 단독
- workflow node 존재
- file `updatedAt` 또는 topic `updatedAt`
- 중간 `stage-progress`
- unverified `stage-completed`

위 항목은 progress evidence로만 쓰고 current flow completed로 승격하지 않는다.

## 구현 경계

- 대상 파일: `apps/dashboard/src/features/history/historyModel.ts`
- 주요 후보: `isCompletionEvent`, `flowTimestampBundle`, `flowActiveTimestamp`, `buildWorkflowSteps`, `topicStageIsComplete`

## Acceptance

- 현재 flow가 산출물을 일부 만들었어도 full completion evidence가 없으면 `진행 중`이다.
- 완료 후 새 요구가 들어온 flow는 completion evidence보다 최신 unresolved revision이 있으면 `추가 진행`이다.
- later-flow evidence는 이전 flow completion에만 사용하고 현재 flow 조기 완료로 사용하지 않는다.
