---
pgg:
  topic: "pgg-codex-agents-path-sync"
  stage: "qa"
  status: "done"
  skill: "pgg-qa"
  score: 95
  updated_at: "2026-04-27T00:39:20Z"
  archive_type: "fix"
  project_scope: "current-project"
---

# QA Report

## Decision

pass

## Scope

Verify the completed `.codex/agents` path migration topic before archive:

- `pgg init` and `pgg update` generate/manage `.codex/agents/*`.
- Prior root `agents/*` managed files retire safely.
- Workflow docs and `pgg-state-pack.sh` reference `.codex/agents/main.toml`.
- Required token audit is present and passed.

## Evidence

| Check | Result | Evidence |
|---|---|---|
| `pgg-gate pgg-qa` | pass | gate returned `{"gate":"pass","stage":"pgg-qa"}` |
| `pnpm build` | pass | implementation and refactor evidence in `state/current.md` |
| `pnpm test` | pass | 39 tests passed in implementation and refactor evidence |
| `node packages/cli/dist/index.js update` | pass | implementation created `.codex/agents/*`; refactor rerun returned unchanged |
| `pgg-state-pack.sh` routing ref | pass | emits `agent_routing_ref: .codex/agents/main.toml` |
| required `pgg-token` audit | pass | `token/report.md` exists and decision is pass |
| workflow/history JSON | pass | JSON/NDJSON parse check passed after token audit |

## Current-Project Verification Contract

manual verification required

Reason: `.pgg/project.json` declares `"verification": {"mode":"manual","commands":[],"manualReason":"verification contract not declared"}`. Per workflow contract, QA does not infer or auto-run additional target-project commands without a declared verification command contract.

## Audit Applicability

- `pgg-token`: `required` | report exists at `token/report.md` and passed.
- `pgg-performance`: `not_required` | no runtime performance-sensitive behavior was introduced.

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| QA/테스트 엔지니어 | 95 | Acceptance criteria are covered by generated update evidence, regression tests, state-pack output, and required token audit. No failed checks remain. | 없음 |
| SRE / 운영 엔지니어 | 95 | Change is workflow/config artifact migration with no runtime service path. Archive is acceptable; release risk is limited to generated file ownership and is covered by tests and manifest evidence. | 없음 |

## Archive Decision

pass

## Git Publish Message

- title: fix: 2.3.1.Codex agents 경로 정렬
- why: Codex agent routing 파일이 루트 agents/에 생성되어 Codex 전용 설정 구조와 맞지 않는다. init/update 템플릿, managed manifest, 문서, state-pack 출력, 테스트 기준을 .codex/agents/로 맞춰 경로 이중화와 handoff 혼선을 줄인다.
- footer: Refs: pgg-codex-agents-path-sync
