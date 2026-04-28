---
pgg:
  topic: "pgg-framework-full-replacement"
  stage: "plan"
  status: "draft"
  skill: "pgg-plan"
  updated_at: "2026-04-28T12:30:59Z"
---

# Spec: Source of Truth Core

## 목적

PGG flow 정의를 TypeScript Skill Framework로 전면 이전하고, generated Markdown과 legacy compatibility layer가 이 source of truth를 따르게 한다.

## 대상 파일

- `packages/core/src/skill-framework/types.ts`
- `packages/core/src/skill-framework/contracts.ts`
- `packages/core/src/skill-framework/registry.ts`
- `packages/core/src/skill-framework/index.ts`
- `packages/core/src/workflow-contract.ts`
- `packages/core/src/index.ts`

## 요구사항

1. 모든 target flow는 `PggSkillDefinition`으로 표현한다.
2. required common fields는 registry validation과 tests로 검증한다.
3. legacy `workflow-contract.ts`는 compatibility/deprecated layer로 제한한다.
4. public API는 신규 registry와 validation helper를 export한다.

## 검증

- `pnpm --filter @pgg/core build`
- `pnpm test:core`
- `rg -n "skill-framework/index\\.js" packages/core/src`
