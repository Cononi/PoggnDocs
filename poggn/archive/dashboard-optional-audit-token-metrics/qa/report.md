---
pgg:
  topic: "dashboard-optional-audit-token-metrics"
  stage: "qa"
  status: "done"
  skill: "pgg-qa"
  score: 96
  updated_at: "2026-04-28T00:44:00Z"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "2.9.0"
  short_name: "dashboard-metrics"
  project_scope: "current-project"
reactflow:
  node_id: "qa-report"
  node_type: "qa"
  label: "qa/report.md"
state:
  summary: "dashboard optional audit visibility, completed-only timeline, token ledger ingestion, and generated asset propagation verified."
  next: "archive"
---

# QA Report

## Scope

- dashboard Overview optional audit visibility gating
- dashboard timeline completion-only flow display
- pgg token usage ledger schema, parser, source separation, and dashboard summary ingestion
- init/update generated workflow assets and state-pack handoff contract
- required `pgg-token` audit completion

## Test Results

| ID | Check | Result | Evidence |
|---|---|---|---|
| QA-001 | Core regression suite | pass | `pnpm --filter @pgg/core test`: 54 pass, 0 fail |
| QA-002 | Dashboard production build | pass | `pnpm --filter @pgg/dashboard build`: build completed; Vite large chunk warning only |
| QA-003 | Required token audit | pass | `token/report.md` decision pass and `reviews/token.review.md` approved |
| QA-004 | Token ledger parse and summary | pass | `state/token-usage.ndjson`: 8 records, 6 `llm`, 2 `local`, 1,074 local estimated tokens |
| QA-005 | Workflow graph validity | pass | `workflow.reactflow.json` parsed successfully |
| QA-006 | QA gate | pass | `./.codex/sh/pgg-gate.sh pgg-qa dashboard-optional-audit-token-metrics`: `{"gate":"pass","stage":"pgg-qa"}` |
| QA-007 | State-pack handoff | pass | `.codex/sh/pgg-state-pack.sh dashboard-optional-audit-token-metrics` reports current stage `token`, next action `pgg-qa`, token usage 8 records |

## Acceptance Review

| Requirement | Result | Evidence |
|---|---|---|
| `pgg-token`/`pgg-performance` Overview 표시가 실제 실행 evidence 기반이다. | pass | `historyModel.ts` optional audit evidence helper and implementation diff `007`/refactor diff `021` |
| Timeline은 workflow progress가 완료인 flow만 표시한다. | pass | `buildTimelineRows`/bounds implementation diff `007`; no partial artifact completion fallback remains |
| Token usage는 `llm`/`local`, actual/estimated/unavailable을 분리한다. | pass | `state/token-usage.ndjson` 8 records and dashboard/core model changes |
| Flow/file artifact token attribution을 dashboard 지표로 사용할 수 있다. | pass | `packages/core/src/index.ts`, dashboard shared model, and `dashboard-token-usage.test.mjs` |
| `pgg init`/`pgg update` 생성 자산에 계약이 전파된다. | pass | `templates.ts`, `workflow-contract.ts`, managed docs/skills changes, core regression suite |
| Optional performance audit는 required가 아니다. | pass | Audit Applicability marks `pgg-performance: not_required`; no performance report is required for QA |

## Verification Notes

- The dashboard build warning about a large JavaScript chunk is non-blocking and pre-existing for this dashboard bundle shape.
- Provider LLM usage metadata remains unavailable; ledger records avoid copying prompts or file bodies and preserve attribution by artifact path.
- Existing dirty baseline paths `.pgg/project.json` and `변경.md` remain outside this QA decision.

## Expert Review

| Expert | Score | Assessment | Blocking Issues |
|---|---:|---|---|
| QA/테스트 엔지니어 | 96 | Regression tests, dashboard build, QA gate, token audit, JSON parsing, and state-pack handoff all pass. | 없음 |
| SRE / 운영 엔지니어 | 96 | Required audit evidence exists, workflow completion evidence is explicit, and archive helper can proceed with baseline dirty paths isolated. | 없음 |

## Audit Applicability

- `pgg-token`: `required` | workflow 자산, state handoff, generated 문서 구조, token usage 기록 계약을 함께 바꾸는 topic이며 `token/report.md`가 pass다.
- `pgg-performance`: `not_required` | dashboard 표시 조건과 token metrics 계약이 핵심이며 별도 성능 민감 runtime path나 선언된 performance verification contract는 없다.

## Git Publish Message

- title: feat: 2.9.0.audit token 지표
- why: dashboard가 optional audit flow를 실제 실행 evidence가 있을 때만 보여 주고, timeline은 완료된 workflow progress만 표시해야 하며, 각 flow와 file artifact의 llm/local token usage를 후속 프로젝트까지 기록할 수 있어야 한다.
- footer: Refs: dashboard-optional-audit-token-metrics

## Decision

pass
