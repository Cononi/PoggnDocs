---
pgg:
  topic: "pgg-workflow-token-commit-contract"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 97
  updated_at: "2026-04-28T00:47:54Z"
  auto_mode: "on"
reactflow:
  node_id: "plan"
  node_type: "doc"
  label: "plan.md"
state:
  summary: "workflow process scaling, token measurement, token clips, task-row commit, pgg lang, init/update 전파를 spec으로 분해한다."
  next: "pgg-code"
---

# Plan

## 1. 목표

- 모바일 Workflow Progress process가 세로 stack으로 바뀌지 않고 형태를 유지하며 동적으로 축소되게 한다.
- token usage를 `LLM actual`과 `Local` source로 분리하고, 요금 계산용 actual 기준을 Codex response usage metadata로 한정한다.
- dashboard에서 LLM과 Local token을 결합 문구가 아닌 별도 clip으로 표시한다.
- `pgg-code`가 `task.md`의 `T1...N` 행 1개 완료마다 task-scoped commit을 남기게 한다.
- task commit message를 작업 내용 제목, dependencies body, 완료 조건 body, 완료 조건 기반 footer 구조로 맞춘다.
- 모든 pgg-* flow 문서와 pgg 생성/수정 코드 주석이 pgg lang을 따르게 한다.
- source template와 현재 workspace generated asset이 같은 계약을 유지해 `pgg init`/`pgg update`에도 전파되게 한다.

## 2. Audit Applicability

- [pgg-token]: [required] | token 측정 정확도, source 분리, actual/unavailable/estimated 계약을 직접 변경하는 topic이다.
- [pgg-performance]: [not_required] | 모바일 workflow process scaling은 UI layout 계약이며 별도 성능 민감 runtime path나 선언된 performance verification contract는 없다.

## 3. Spec 분해

| Spec ID | path | 목적 | 구현 핵심 |
|---|---|---|---|
| S1 | `spec/dashboard/mobile-workflow-process-scaling.md` | 모바일 Workflow Progress process가 형태를 유지하며 scale down되는 UI 계약을 정의한다. | `HistoryWorkspace.tsx` process track responsive behavior, overlap/clipping 방지, Playwright/screenshot 검증 |
| S2 | `spec/token/accurate-token-measurement-ledger.md` | LLM actual과 Local token source를 요금 지표로 안전하게 분리하는 ledger 계약을 정의한다. | `packages/core/src/index.ts` token parser/summarizer, `measurement` semantics, ledger tests |
| S3 | `spec/dashboard/token-source-clips.md` | dashboard token 표시를 LLM clip과 Local clip으로 분리한다. | `HistoryWorkspace.tsx`, locale key, title 결합 문구 제거, chip formatting 통일 |
| S4 | `spec/git/task-row-commit-governance.md` | `pgg-code`가 `task.md`의 `T1...N` 행마다 commit을 남기는 계약을 정의한다. | `pgg-stage-commit.sh`, `pgg-code` skill, templates, git publish tests |
| S5 | `spec/i18n/pgg-lang-documentation-and-comments.md` | pgg-* 문서와 pgg 생성/수정 코드 주석이 pgg lang을 따르는 계약을 정의한다. | skill/docs/templates/readme contract, language tests, review/QA checklist |
| S6 | `spec/pgg/init-update-propagation.md` | 새 계약을 `pgg init`/`pgg update` generated asset에 전파한다. | `packages/core/src/templates.ts`, `readme.ts`, dist, generated files, update regression |

## 4. 구현 순서

1. S2에서 token ledger actual/unavailable/estimated 의미를 먼저 고정한다.
2. S3에서 dashboard token clip UI를 S2의 source별 summary에 맞춘다.
3. S1에서 Workflow Progress 모바일 process 형태 유지와 scale down을 구현한다.
4. S4에서 task-row commit helper와 skill/template 계약을 구현한다.
5. S5에서 pgg lang 문서/주석 계약을 skills, WOKR/STATE, generated docs에 반영한다.
6. S6에서 source template, generated workspace files, dist, README, tests를 동기화한다.

## 5. 검증 전략

- token ledger 검증: LLM actual, LLM unavailable, Local estimated record를 fixture로 만들어 source별 합계가 섞이지 않는지 확인한다.
- dashboard token UI 검증: Workflow Progress title에 결합 token 문구가 사라지고 LLM/Local clip이 별도로 표시되는지 확인한다.
- 모바일 process 검증: 375px/768px/desktop viewport에서 step이 세로 stack으로 바뀌지 않고 node/connector/text가 겹치지 않는지 확인한다.
- task commit 검증: T1/T2 fixture에서 각 task 행마다 별도 commit 또는 defer evidence가 남고, body/footer 구조가 맞는지 확인한다.
- pgg lang 검증: ko/en fixture에서 generated pgg 문서와 pgg 생성/수정 주석 지침이 language 설정을 따르는지 확인한다.
- update 전파 검증: update path 실행 후 source template와 workspace generated asset이 같은 계약을 유지하는지 확인한다.

## 6. 리스크와 가드레일

- 모바일 process를 transform으로 축소하면 layout height와 hit target이 어긋날 수 있다. S1에서 visual scale과 layout box 계산을 함께 acceptance로 둔다.
- LLM usage metadata가 없는 값을 actual로 처리하면 요금 지표가 틀어진다. S2에서 `unavailable`은 actual 합계에서 제외한다.
- Local token-equivalent 값이 요금처럼 보이면 사용자가 비용을 오해한다. S3에서 Local label과 source별 chip을 분리한다.
- task-row commit이 기존 `{archive_type}: {version}.summary` 제목 제한과 충돌할 수 있다. S4에서 task 작업 내용을 summary source로 쓰되 기존 제목 검증을 유지한다.
- pgg lang 주석 계약을 기존 사용자 코드 전체에 적용하면 불필요한 churn이 생긴다. S5에서 pgg가 생성/수정하는 주석으로 범위를 제한한다.
- generated helper만 수정하고 source template를 놓치면 update 이후 되돌아간다. S6에서 source와 generated asset을 같이 acceptance로 둔다.

## 7. 완료 기준

- 6개 spec이 proposal 요구사항을 누락 없이 덮고 서로 충돌하지 않는다.
- `task.md`가 spec 경계별 T1...T6 작업과 완료 기준을 제공한다.
- `reviews/plan.review.md`와 `reviews/task.review.md`가 전문가 attribution과 blocking 여부를 남긴다.
- `state/current.md`가 다음 단계 handoff용 최소 문맥으로 plan/task/spec 요약과 audit applicability를 유지한다.
