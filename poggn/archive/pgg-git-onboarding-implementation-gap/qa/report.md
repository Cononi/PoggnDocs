---
pgg:
  topic: "pgg-git-onboarding-implementation-gap"
  stage: "qa"
  status: "done"
  skill: "pgg-qa"
  score: 96
  updated_at: "2026-04-27T11:55:00Z"
  archive_type: "fix"
  project_scope: "current-project"
reactflow:
  node_id: "qa-pgg-git-onboarding-implementation-gap"
  node_type: "qa"
  label: "qa/report.md"
state:
  summary: "git onboarding gap remediation QA passed with manual provider verification separated"
  next: "archive"
---

# QA Report: Git Onboarding Implementation Gap

## Test Plan

- Verify the declared current-project contract with `pnpm build`.
- Verify core regression coverage with `pnpm test`.
- Verify workflow readiness with `.codex/sh/pgg-gate.sh pgg-qa pgg-git-onboarding-implementation-gap`.
- Separate provider credential and remote push checks as manual verification because they require real GitHub/GitLab accounts, network state, and repository permissions.

## Automatic Verification Results

| check | result | evidence |
|---|---:|---|
| `pnpm build` | pass | dashboard, core, and CLI builds completed; dashboard emitted a non-blocking chunk-size warning |
| `pnpm test` | pass | 49 tests passed, 0 failed |
| core mock runner coverage | pass | local, fast path, setup path, confirmation block, auth failure early return, and secret non-persistence are covered by core tests |
| dashboard compile safety | pass | build validates setup request model, locale keys, API mutation wiring, and Stepper state |
| `pgg-gate pgg-qa` | pass | `{"gate":"pass","stage":"pgg-qa"}` |

## Manual Verification Results

| check | result | reason |
|---|---:|---|
| GitHub HTTPS token login and push | manual verification required | no test credential or sandbox repository was provided |
| GitHub SSH auth and push | manual verification required | local SSH identity and remote authorization are environment-specific |
| GitLab HTTPS/SSH path | manual verification required | no GitLab test project or credential was provided |
| real repository creation | manual verification required | repository creation must use an approved sandbox account |
| destructive command confirmation | manual verification required | confirmation UX should be checked against a real terminal/dashboard session before mutating a remote |

## Audit Applicability

- `pgg-token`: `not_required` | workflow handoff structure was not changed, and token values are intentionally not stored in manifest/result snapshots.
- `pgg-performance`: `not_required` | git onboarding is a user-driven setup path, not a performance-sensitive runtime path.

## Expert Review

- QA/테스트 엔지니어: 96 | 자동 검증 계약을 충족했고 provider credential 의존 검증은 환경 제약으로 분리했다.
- SRE / 운영 엔지니어: 96 | remote mutation은 confirmation과 manual credential boundary를 유지하며, push/remote failure는 retryable 상태로 남길 수 있다.
- overall score: 96

## Decision

Pass. The topic is eligible for archive because required automatic verification passed, required audits are not applicable, and provider credential checks are documented as manual verification required rather than failed QA.

## Git Publish Message

- title: fix: 2.6.1.git 온보딩 실행 흐름 보완
- why: CLI와 dashboard git setup 경로가 deferred placeholder에서 실제 onboarding 실행 흐름으로 이어져야 한다
- footer: Refs: pgg-git-onboarding-implementation-gap
