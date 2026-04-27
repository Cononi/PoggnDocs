---
pgg:
  topic: "dashboard-audit-flow-i18n-surface"
  stage: "token"
  status: "reviewed"
  skill: "pgg-token"
  score: 94
  updated_at: "2026-04-27T05:35:50Z"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "2.4.0"
  short_name: "dashboard-surface"
  project_scope: "current-project"
reactflow:
  node_id: "token-report"
  node_type: "audit"
  label: "token/report.md"
state:
  summary: "workflow/generated asset 변경의 token 비용 기여 요인을 점검한다."
---

# Token Audit Report

## Applicability

- result: `required`
- reason: workflow 자산, state handoff, generated 문서 언어 계약과 dashboard projection을 함께 점검해야 한다.

## Measurements

| Item | Measured Size | Token Risk | Notes |
|---|---:|---|---|
| topic planning/state/review/spec docs | 752 lines | medium | proposal, plan, task, specs, reviews, state가 모두 존재한다. |
| implementation diffs | 749 lines | medium | diff ref 중심 기록이라 전체 source 복사보다 비용이 낮다. |
| `pgg-state-pack.sh` handoff output | 40 lines / 2332 bytes | low | 다음 flow에 필요한 metadata와 refs만 전달한다. |
| `state/current.md` | 137 lines / 7861 bytes | medium | 변경 파일 table이 길어졌지만 full document bundle보다는 작다. |
| `workflow.reactflow.json` | 6374 bytes | medium | dashboard flow projection evidence라 유지 가치가 있다. |

## Cost Contributors

- `state/current.md`의 `Changed Files` table은 topic이 진행될수록 가장 빠르게 증가한다.
- implementation diff는 10개 파일로 분리되어 필요한 변경만 선택적으로 읽을 수 있다.
- generated source와 dist output diff가 모두 기록되어 core template 변경 검증 비용이 늘어난다.
- `workflow.reactflow.json`은 UI projection evidence지만 다음 단계 handoff에는 전문보다 ref가 적합하다.

## Optimization Actions

| Action | Status | Evidence |
|---|---|---|
| 다음 단계 handoff는 `state/current.md` 전문보다 `pgg-state-pack.sh` output을 우선한다. | applied | state-pack output 40 lines / 2332 bytes |
| source 전체 복사 대신 `implementation/diffs/*.diff` ref를 유지한다. | applied | diff files split by changed path |
| review 전문은 `state/current.md`에 복사하지 않고 decision/score/blocking summary만 유지한다. | applied | `state/current.md` Review Summary |
| `workflow.reactflow.json` 전문은 dashboard evidence로 두고 handoff에서는 path ref만 전달한다. | applied | state-pack refs list |

## Recommendations

- 이후 `pgg-code`/`pgg-refactor`가 더 늘어나는 topic에서는 `Changed Files` table을 완료 stage별 archive summary로 압축할 수 있는지 별도 topic에서 검토한다.
- source와 dist가 함께 바뀌는 core template 변경은 diff를 둘 다 남기되, review에는 source diff를 우선 읽고 dist diff는 build artifact 검증 근거로만 다룬다.
- optional audit flow 표시 검증은 fixture와 assertion 중심으로 유지하고 screenshot/full snapshot 전문을 handoff에 넣지 않는다.

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 테크 리드 | 94 | state-pack 중심 handoff가 40 lines로 유지되어 전체 topic 문서와 diff 1501 lines를 직접 넘기는 비용을 피하고 있다. | 없음 |
| 코드 리뷰어 | 94 | diff ref와 review summary 중심 기록이 지켜졌고, 현재 token 비용은 Changed Files table 증가가 주요 관리 대상이다. | 없음 |

## Decision

pass
