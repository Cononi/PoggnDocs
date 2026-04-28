---
pgg:
  topic: "pgg-framework-full-replacement"
  stage: "plan"
  status: "draft"
  skill: "pgg-plan"
  updated_at: "2026-04-28T12:30:59Z"
---

# Spec: Public API / CLI Routing

## 목적

public API와 CLI entry가 신규 Skill Framework core를 사용하도록 유지한다.

## 대상 파일

- `packages/core/src/index.ts`
- `packages/cli/src/index.ts`
- `packages/core/dist/index.js`
- `packages/core/dist/index.d.ts`

## 요구사항

1. `@pgg/core` export는 신규 Skill Framework 정의와 validation helper를 포함한다.
2. CLI `init`/`update`는 신규 generator 결과를 사용한다.
3. CLI `status`/`dashboard`는 active/archive topic과 신규 workflow metadata를 읽는다.
4. legacy path는 compatibility 목적으로만 남긴다.

## 검증

- `pnpm build`
- `node packages/cli/dist/index.js update`
- `node packages/cli/dist/index.js status --cwd /config/workspace/poggn-ai`
