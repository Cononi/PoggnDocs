---
pgg:
  topic: "dashboard-workflow-tab-status-release-fix"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-24T23:52:49Z"
---

# S6. Workflow Tab Status Acceptance

## 목적

후속 구현과 QA에서 확인할 acceptance evidence를 정의한다.

## Required Checks

- `add-img/9.png` 기준 selected tab bottom line 제거 확인
- inactive tab unboxed 확인
- panel top line이 selected tab 바깥에서만 이어지는지 확인
- `stage-started`/`stage-progress` event가 `진행 중`으로 계산되는지 확인
- `requirements-added`가 `추가 진행`으로 계산되는지 확인
- full completion evidence 전에는 flow가 `완료`로 계산되지 않는지 확인
- Done completed가 QA pass + archive/version/release evidence에만 연결되는지 확인
- QA fail/release blocked/publish blocked가 completed와 분리되는지 확인
- source-level i18n/status/count regression 확인

## Verification Boundary

- current-project verification contract는 `manual verification required`다.
- 공식 QA는 declared command 없이 framework command를 추론하지 않는다.
- 구현 단계에서 가능한 경우 dashboard build, screenshot, pixel check, source search를 evidence 후보로 남긴다.

## Pass Criteria

- pgg gate가 stage별로 통과한다.
- plan/task/spec/review 문서가 모두 존재한다.
- source-level acceptance와 visual acceptance evidence가 QA report에 남는다.
- unresolved blocker가 없으면 archive 후보가 된다.
