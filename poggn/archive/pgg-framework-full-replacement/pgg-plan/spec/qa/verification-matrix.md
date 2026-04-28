---
pgg:
  topic: "pgg-framework-full-replacement"
  stage: "plan"
  status: "draft"
  skill: "pgg-plan"
  updated_at: "2026-04-28T12:30:59Z"
---

# Spec: QA Verification Matrix

## 목적

pgg-qa가 source of truth, generated docs, public compatibility, POGGN workspace, versioning, git lifecycle, completion contract, token accounting, technical checks, archive/release/push를 evidence 기반으로 판정하게 한다.

## Required Matrix Areas

- Source of Truth
- Skill Framework
- Legacy Replacement
- Public API / CLI Compatibility
- Korean Generated Docs
- POGGN Workspace
- Versioning
- Git Mode / Branch Lifecycle
- Commit Message Convention
- Completion Message Contract
- Token Accounting
- pgg-add
- pgg-plan
- pgg-code
- pgg-code Task Commits
- pgg-refactor
- pgg-performance
- pgg-qa
- Generated Docs
- Technical Checks
- Archive / Release / Push

## 검증 명령

- `pnpm build`
- `pnpm build:readme`
- `pnpm build:dashboard`
- `pnpm test`
- `pnpm test:core`
- `pnpm test:dashboard`
- `pnpm verify:version-history`
- `node packages/cli/dist/index.js update` 두 번

## PASS 기준

모든 required matrix area가 PASS이고 실패한 명령이 없으며 archive/release/push 조건 또는 생략 사유가 명확해야 한다.
