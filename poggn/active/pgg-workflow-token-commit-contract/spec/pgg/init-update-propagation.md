---
pgg:
  topic: "pgg-workflow-token-commit-contract"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 97
  updated_at: "2026-04-28T00:47:54Z"
reactflow:
  node_id: "spec-pgg-init-update-propagation"
  node_type: "spec"
  label: "spec/pgg/init-update-propagation.md"
state:
  summary: "새 workflow/token/commit/lang 계약을 pgg init/update generated asset에 전파하는 계약"
  next: "pgg-code"
---

# Spec: init/update 전파

## 목적

이번 topic의 workflow process, token, task commit, pgg lang 계약이 현재 workspace 파일만이 아니라 `pgg init`과 `pgg update`로 생성되는 후속 프로젝트에도 적용되게 한다.

## 현재 동작

- 현재 workspace에는 `.codex/add/*`, `.codex/skills/pgg-*`, `.codex/sh/*.sh`가 존재한다.
- 실제 배포 source는 `packages/core/src/templates.ts`, `packages/core/src/readme.ts`, `packages/core/src/workflow-contract.ts`와 dist output 및 tests에 반영되어야 한다.
- generated asset과 checked-in helper가 어긋나면 후속 프로젝트에서 같은 계약을 받지 못한다.

## 요구사항

1. source template와 현재 workspace generated files를 함께 갱신한다.
2. `pgg init` 또는 `pgg update` 후 생성되는 `.codex/add/*`, `.codex/skills/pgg-*`, `.codex/sh/*.sh`, README/AGENTS 문서가 같은 계약을 설명해야 한다.
3. dashboard model/UI 변경은 source와 dist/build output이 일치해야 한다.
4. core package dist output이 관리되는 repo 정책이면 source 변경 후 build output도 갱신한다.
5. regression test는 source template, generated helper behavior, dashboard token/process UI contract 중 핵심 경로를 포함한다.
6. current-project verification contract가 manual이면 QA에서 임의 framework command를 공식 검증으로 추론하지 않는다.

## 구현 기준

- 주요 대상: `packages/core/src/templates.ts`, `packages/core/src/readme.ts`, `packages/core/src/workflow-contract.ts`, `packages/core/dist/*`, `.codex/add/*`, `.codex/skills/pgg-*`, `.codex/sh/*.sh`, `README.md`, dashboard source.
- `node packages/cli/dist/index.js update` 또는 동등 update path를 검증 후보로 둔다.
- `pnpm --filter @pgg/core test`, `pnpm --filter @pgg/dashboard build`를 regression 후보로 둔다.
- 변경 파일은 `implementation/index.md`와 `implementation/diffs/*.diff`에 task id별로 기록한다.

## 수용 기준

- 현재 workspace generated assets와 source templates가 같은 workflow/token/commit/lang 계약을 담는다.
- update path 실행 후 계약이 되돌아가지 않는다.
- tests 또는 build가 통과하고, manual verification contract 상태가 state/QA에 남는다.

## 제외

- 다른 repository에 대한 즉시 update 실행.
- release publish 또는 archive 작업.
