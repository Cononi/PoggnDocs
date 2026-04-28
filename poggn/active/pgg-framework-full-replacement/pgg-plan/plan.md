---
pgg:
  topic: "pgg-framework-full-replacement"
  stage: "plan"
  status: "draft"
  skill: "pgg-plan"
  updated_at: "2026-04-28T12:30:59Z"
  archive_type: "feat"
  version_bump: "major"
  target_version: "4.0.0"
---

# Plan: PGG Framework Full Replacement

## 승인된 설계 요약

기존 PGG workflow, generated docs 구조, CLI/public API routing, dashboard workflow model, git lifecycle, token accounting, QA 계약을 신규 TypeScript Skill Framework 기준으로 전면 교체한다.

## Version Plan

- currentVersion: `3.2.0`
- targetVersion: `4.0.0`
- bumpType: `major`
- convention: `feat`
- versionSource: `poggn/version-history.ndjson latest archived version`
- versionReason: 기존 시스템 기능과 public behavior를 크게 바꾸는 전면 교체 migration이다.
- version bump task: `poggn/version-history.ndjson`가 QA archive 시 `4.0.0` release record를 append하도록 state/proposal/QA metadata를 유지한다.
- package.json 처리: `package.json`은 현재 `0.1.0` workspace package version이며 이번 topic의 release source가 아니므로 pgg-code에서 package version을 무조건 `4.0.0`으로 올리지 않는다. 단, QA는 versionSource와 targetVersion의 일관성을 검증한다.

## 구현 전략

1. 신규 Skill Framework core를 source of truth로 고정한다.
2. legacy `workflow-contract.ts`는 direct source of truth가 아니라 compatibility adapter 또는 deprecated layer로 제한한다.
3. generator는 TypeScript Skill 정의의 모든 필드를 generated Markdown에 렌더링한다.
4. CLI/public export는 신규 core로 routing한다.
5. dashboard model은 신규 workflow/status/token/git/version 정보를 표시할 수 있게 유지한다.
6. generated docs는 generator 실행으로만 갱신하고 직접 patch하지 않는다.
7. tests는 registry completeness, generated docs coverage, CLI update stability, dashboard snapshot/model, git lifecycle, version-history preservation을 고정한다.

## 검증 전략

- Source of Truth: `packages/core/src/skill-framework/registry.ts`, `contracts.ts`, `types.ts`를 기준으로 registry validation을 통과시킨다.
- Generated Docs: `node packages/cli/dist/index.js update`를 두 번 실행하고 두 번째 실행이 `unchanged`인지 확인한다.
- Typecheck/Build: `pnpm build`를 실행한다.
- Core Tests: `pnpm test:core`를 실행해 Skill generation, git lifecycle, version-history, status analysis 회귀를 확인한다.
- Dashboard Tests: `pnpm test:dashboard`, `pnpm build:dashboard`를 실행한다.
- README: `pnpm build:readme`를 실행한다.
- Version History: `pnpm verify:version-history`를 실행한다.
- Full Test: `pnpm test`를 실행한다.

## Test Plan

| Test | Command | Expected |
|---|---|---|
| core build/typecheck | `pnpm --filter @pgg/core build` | TypeScript compile success |
| generated docs update | `node packages/cli/dist/index.js update` | managed docs updated from generator |
| generated docs stability | `node packages/cli/dist/index.js update` | second run `unchanged` |
| root README generation | `pnpm build:readme` | README regenerated from core |
| core regression | `pnpm test:core` | all core tests pass |
| dashboard regression | `pnpm test:dashboard` | all dashboard tests pass |
| dashboard build | `pnpm build:dashboard` | Vite build success |
| workspace regression | `pnpm test` | core + dashboard tests pass |
| workspace build | `pnpm build` | core, cli, dashboard build pass |
| version ledger preservation | `pnpm verify:version-history` | ledger preservation pass |

## 생성할 테스트

- `packages/core/test/skill-generation.test.mjs`: 모든 flow가 required common fields를 갖고 generated Markdown이 한국어 section label과 completion/token/git/version/QA 계약을 포함하는지 검증한다.
- `packages/core/test/version-history.test.mjs`: `pgg update`가 version history ledger를 보존하는지 유지한다.
- `packages/core/test/git-publish.test.mjs`: pgg git on/off, release branch, push, dirty worktree guard를 검증한다.
- `scripts/dashboard-history-model.test.mjs`: dashboard timeline/status/token attribution이 신규 workflow 상태와 호환되는지 검증한다.

## 성공 기준

- 모든 AC가 task 또는 verification step에 연결된다.
- generated Markdown은 한국어 기본 문서이며 직접 patch 없이 generator에서 나온다.
- public export와 CLI update/init/status/dashboard 경로가 신규 core를 사용한다.
- legacy 파일은 keep/replace/deprecated/removable-after-migration으로 분류된다.
- pgg git on/off lifecycle과 branch naming이 검증된다.
- token accounting schema가 generated docs와 tests에 반영된다.
- 기술 검증 명령이 통과한다.

## 실패 기준

- generated Markdown 직접 patch 필요
- 두 번째 docs generation에서 추가 diff 발생
- registry validation 실패
- public export가 legacy source of truth를 직접 사용
- pgg git off에서 branch/commit/push 수행
- pgg-qa FAIL인데 archive/release/push 수행 가능성이 남음
- versionSource와 targetVersion이 불일치

## 경계값 / 예외 / 회귀 / 성능 기준

- 경계값: active topic이 없을 때 status가 빈 summary를 반환해야 한다.
- 예외: pgg git on이지만 git repository가 아니면 git 작업 생략 사유를 기록해야 한다.
- 예외: remote가 없으면 push를 성공으로 기록하지 않아야 한다.
- 회귀: `pgg-performanc` compatibility alias는 `pgg-performance`로 resolve되어야 한다.
- 회귀: 기존 version history ledger는 update/build/test 중 보존되어야 한다.
- 성능: 현재 별도 성능 기준 없음. Vite bundle warning은 build failure가 아니며 pgg-performance는 `not_required`.

## pgg-performance 필요 여부

- `not_required`
- 근거: 요구사항은 구조/계약/문서/generator/test 전면 교체이며 성능 수치 기준이 없다.
- 재평가 조건: dashboard bundle size 최적화, large file processing, repeated generator performance 기준이 추가되면 pgg-performance로 routing한다.

## 병렬화 가능성

- core registry/type 작업과 dashboard model 검토는 파일 ownership이 겹치지 않으면 병렬 가능하다.
- generated docs regeneration은 core build 후 직렬 실행한다.
- final QA command suite는 docs 안정성 확인 후 실행한다.

## 예상 병목

- generated docs와 dist outputs가 source 변경과 계속 동기화되어야 한다.
- ignored `poggn` artifacts는 commit helper에서 force-add 대상이 될 수 있다.
- 기존 dirty worktree가 많아 task commit은 changed path contract와 충돌할 수 있다.
