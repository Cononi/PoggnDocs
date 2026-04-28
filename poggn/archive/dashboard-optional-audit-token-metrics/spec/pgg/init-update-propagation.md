---
pgg:
  topic: "dashboard-optional-audit-token-metrics"
  stage: "plan"
  status: "approved"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-27T23:32:03Z"
spec:
  id: "S4"
  title: "Init Update Propagation"
---

# S4. Init Update Propagation

## Scope

optional audit visibility와 token usage ledger 계약은 현재 프로젝트뿐 아니라 `pgg init` 또는 `pgg update`로 생성되는 후속 프로젝트에도 적용되어야 한다.

## Source Boundaries

- `.codex/add/WOKR-FLOW.md`
- `.codex/add/STATE-CONTRACT.md`
- `.codex/add/IMPLEMENTATION.md`
- `.codex/add/REVIEW-RUBRIC.md`
- `.codex/skills/pgg-*`
- `.codex/sh/*.sh`
- `packages/core/src/templates.ts`
- `packages/core/src/index.ts`
- `packages/core/src/workflow-contract.ts`
- generated `packages/core/dist/*` if this repository tracks built output for the changed source

## Requirements

- WOKR workflow 문서는 optional audit가 실제로 열린 경우에만 flow/report/evidence를 남긴다는 규칙을 유지하고, dashboard visibility가 실행 evidence 기반임을 명시한다.
- STATE contract는 `state/token-usage.ndjson` 또는 동등 ledger가 최소 컨텍스트에는 summary/ref로 전달되어야 함을 정의한다.
- IMPLEMENTATION contract는 파일 생성/수정/삭제 시 token usage record를 남기는 기준을 설명한다.
- REVIEW rubric은 token report가 ledger coverage와 source separation을 확인하도록 확장한다.
- skill 문서는 각 stage 시작/진행/완료 event와 token usage 기록 시점을 혼동하지 않게 정렬한다.
- helper/template는 새 topic 생성, state pack, archive/update 경로에서 ledger ref를 보존해야 한다.
- `pgg update`는 기존 topic ledger를 덮어쓰지 않고 새 contract/template만 갱신해야 한다.

## Acceptance Criteria

- 새로 init된 프로젝트의 AGENTS/WOKR/STATE/SKILL 문서에 optional audit visibility와 token ledger 계약이 포함된다.
- update된 프로젝트에서 기존 `state/token-usage.ndjson` records가 보존된다.
- pgg-state-pack 출력은 전체 ledger를 복사하지 않고 token usage summary/ref를 제공한다.
- generated template과 current-project managed docs가 같은 규칙을 말한다.
- dist output이 source와 함께 관리되는 경우 build output도 일치한다.
