---
pgg:
  topic: "dashboard-optional-audit-token-metrics"
  stage: "token"
  status: "done"
  skill: "pgg-token"
  score: 94
  updated_at: "2026-04-28T00:31:00Z"
reactflow:
  node_id: "token-report"
  node_type: "audit"
  label: "token/report.md"
state:
  summary: "token ledger coverage, source separation, and workflow asset token-cost contributors audited."
  next: "pgg-qa"
---

# Token Audit Report

## Decision

pass

## Scope

- pgg workflow/generated assets changed by this topic
- `state/token-usage.ndjson` ledger coverage and dashboard summary readiness
- state-pack handoff size and repeated document/template contributors

## Measurements

| Metric | Result |
|---|---:|
| Pre-audit ledger records | 4 |
| Pre-audit `llm` records | 4 |
| Pre-audit `local` records | 0 |
| Pre-audit `measurement: unavailable` records | 4 |
| Pre-audit actual token total | 0 |
| `state/token-usage.ndjson` size | 1,429 bytes / estimated 358 local tokens |
| `.codex/sh/pgg-state-pack.sh` output | 2,861 bytes / estimated 716 local tokens |
| `packages/core/src/templates.ts` | 4,004 lines / estimated 47,294 local tokens |
| `state/current.md` | 179 lines / estimated 2,475 local tokens |
| `implementation/index.md` | 54 lines / estimated 1,390 local tokens |

## Findings

- Provider usage metadata is unavailable, so LLM usage remains recorded as `measurement: unavailable`; no prompt or file body was copied into the ledger.
- Source separation is structurally present: records can distinguish `llm` and `local`, but the implementation-stage ledger only contains `llm` unavailable records.
- Dashboard summary can ingest the ledger because records include `stage`, `flow`, `artifact_path`, `source`, `measurement`, and `total_tokens`.
- The largest pgg workflow token-cost contributor is generated template propagation in `packages/core/src/templates.ts`; the next relevant repeated-cost contributor is `state/current.md` handoff content.
- The state-pack handoff is compact at 2,861 bytes and uses refs instead of copying full implementation/spec bodies.

## Optimization Actions

| Action | Evidence | Result |
|---|---|---|
| Keep optional audit visibility evidence-based instead of static. | Static optional flows would add irrelevant workflow context for every topic. | Implemented in workflow/dashboard contract; no additional optimization required. |
| Prefer state-pack refs over full document handoff. | State-pack output is 2,861 bytes while tracked workflow/template files total far more. | Current handoff remains compact and suitable for next stage. |
| Preserve ledger records without prompt/file bodies. | Ledger is 1,429 bytes for 4 records and carries attribution by path only. | Token audit confirms the storage contract avoids duplicated content. |
| Add token-stage local estimate records. | The audit has measurable local byte/token estimates for ledger and handoff. | `state/token-usage.ndjson` was extended with local estimated audit records. |

## Required Follow-Up

- Future stages should append local estimated records for generated docs/handoff helpers when provider usage metadata is unavailable.
- Refactor-stage artifact updates should receive ledger entries in future automation; current ledger covers the main implementation artifacts but not every generated/built diff row.
- No performance audit is required from this token review.

## Review

- 테크 리드: pass, token-cost contributors and trade-offs are identified.
- 코드 리뷰어: pass, ledger avoids full prompt/file copies and keeps dashboard ingestion fields available.
