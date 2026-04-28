---
pgg:
  topic: "pgg-framework-full-replacement"
  stage: "plan"
  status: "draft"
  skill: "pgg-plan"
  updated_at: "2026-04-28T12:30:59Z"
---

# Task Plan

## T1 Source of Truth Registry

- Size: 2~5분
- Files:
  - `packages/core/src/skill-framework/types.ts`
  - `packages/core/src/skill-framework/contracts.ts`
  - `packages/core/src/skill-framework/registry.ts`
  - `packages/core/src/skill-framework/index.ts`
- Instructions:
  - 모든 core flow `pgg-add`, `pgg-plan`, `pgg-code`, `pgg-refactor`, `pgg-qa`와 conditional helper `pgg-performance`를 TypeScript Skill 정의로 표현한다.
  - 각 정의는 purpose, trigger, input, output, mode별 동작, 절대 규칙, 금지 패턴, 필수 단계, verification, POGGN workspace, pgg git mode, versioning, commit message, token accounting, completion message, next flow routing을 포함한다.
  - `pgg-performanc`는 compatibility alias로만 유지한다.
- Verification:
  - `pnpm --filter @pgg/core build`
  - `pnpm test:core`
- Expected:
  - registry validation errors가 없다.
- Failure checks:
  - required field 누락
  - alias가 canonical flow로 resolve되지 않음
  - 한국어/영어 localized arrays 누락

## T2 Legacy Adapter Classification

- Size: 2~5분
- Files:
  - `packages/core/src/workflow-contract.ts`
  - `packages/core/src/index.ts`
  - `packages/core/src/readme.ts`
  - `packages/core/src/templates.ts`
- Instructions:
  - 신규 코드 import는 `./skill-framework/index.js`를 사용한다.
  - `workflow-contract.ts`는 deprecated compatibility layer로 남기고 source of truth로 사용하지 않는다.
  - public export에서 신규 core registry/types/contracts를 노출한다.
- Verification:
  - `rg -n "workflow-contract\\.js|skill-framework/index\\.js" packages/core/src`
  - `pnpm --filter @pgg/core build`
- Expected:
  - `readme.ts`, `templates.ts`, `index.ts`가 신규 core를 사용한다.
- Failure checks:
  - generator가 legacy constants를 직접 source of truth로 사용
  - public export에서 신규 registry 미노출

## T3 Generated Markdown Renderer

- Size: 2~5분
- Files:
  - `packages/core/src/templates.ts`
  - `packages/core/dist/templates.js`
  - `packages/core/dist/templates.js.map`
- Instructions:
  - Skill 정의의 모든 common field를 generated Markdown에 렌더링한다.
  - ko language에서는 설명 heading과 section label을 한국어로 렌더링한다.
  - code identifier, command, file path는 영어를 유지할 수 있다.
  - `pgg-add`만 compact 렌더링으로 필수 field가 빠지는 구조를 금지한다.
- Verification:
  - `node packages/cli/dist/index.js update`
  - `node packages/cli/dist/index.js update`
  - `rg -n "## 공통 Skill 정의|### 검증 요구사항|### QA 요구사항|### 완료 메시지 규격" .codex/skills/pgg-*.md`
- Expected:
  - 첫 실행은 필요한 docs 변경, 두 번째 실행은 `unchanged`.
- Failure checks:
  - generated docs 직접 patch 필요
  - 영어-only heading이 한국어 문서에 남음
  - `pgg-add`에 QA/verification/generated sections 누락

## T4 Managed Skill Docs Regeneration

- Size: 2~5분
- Files:
  - `.codex/skills/pgg-add/SKILL.md`
  - `.codex/skills/pgg-plan/SKILL.md`
  - `.codex/skills/pgg-code/SKILL.md`
  - `.codex/skills/pgg-refactor/SKILL.md`
  - `.codex/skills/pgg-performance/SKILL.md`
  - `.codex/skills/pgg-qa/SKILL.md`
  - `.pgg/project.json`
- Instructions:
  - TypeScript generator를 실행해서 managed Skill Markdown을 갱신한다.
  - Markdown을 직접 수정하지 않는다.
  - `.pgg/project.json` managed file checksum이 갱신되도록 둔다.
- Verification:
  - `node packages/cli/dist/index.js update`
  - `git diff -- .codex/skills .pgg/project.json`
- Expected:
  - generated docs diff가 TS generator 변경과 일치한다.
- Failure checks:
  - Markdown 직접 수정 흔적
  - managed file checksum 불일치

## T5 Public API and CLI Routing

- Size: 2~5분
- Files:
  - `packages/core/src/index.ts`
  - `packages/cli/src/index.ts`
  - `packages/core/dist/index.js`
  - `packages/core/dist/index.d.ts`
- Instructions:
  - public exports가 신규 Skill Framework 정의와 validation helper를 노출하도록 유지한다.
  - CLI `init`, `update`, `status`, `dashboard`가 신규 generator/core path를 사용하게 한다.
- Verification:
  - `pnpm build`
  - `node packages/cli/dist/index.js update`
  - `node packages/cli/dist/index.js status --cwd /config/workspace/poggn-ai`
- Expected:
  - CLI command가 build된 dist에서 정상 실행된다.
- Failure checks:
  - CLI가 legacy workflow contract만 참조
  - dist output 미갱신

## T6 Dashboard Workflow Model Compatibility

- Size: 2~5분
- Files:
  - `apps/dashboard/src/features/history/historyModel.ts`
  - `apps/dashboard/src/shared/model/dashboard.ts`
  - `apps/dashboard/public/dashboard-data.json`
  - `scripts/dashboard-history-model.test.mjs`
- Instructions:
  - dashboard timeline/status/token attribution이 신규 flow completion evidence와 token ledger를 읽을 수 있게 유지한다.
  - optional audit flow는 실제 evidence가 있을 때만 표시한다.
- Verification:
  - `pnpm test:dashboard`
  - `pnpm build:dashboard`
- Expected:
  - dashboard history model tests 3개 이상 pass.
- Failure checks:
  - partial artifact가 완료 이력으로 표시됨
  - token source attribution 누락
  - Vite build failure

## T7 Version and Release Metadata

- Size: 2~5분
- Files:
  - `poggn/active/pgg-framework-full-replacement/state.json`
  - `poggn/active/pgg-framework-full-replacement/proposal.md`
  - `poggn/active/pgg-framework-full-replacement/state/current.md`
  - `poggn/version-history.ndjson`
- Instructions:
  - topic metadata에 `target_version: 4.0.0`, `version_bump: major`, `archive_type: feat`를 유지한다.
  - `poggn/version-history.ndjson`는 pgg-code에서 직접 append하지 않고 pgg-qa archive 단계에서 append한다.
  - package.json은 versionSource가 아니므로 이 task에서 package version bump를 지시하지 않는다.
- Verification:
  - `pnpm verify:version-history`
  - `node -e "JSON.parse(require('fs').readFileSync('poggn/active/pgg-framework-full-replacement/state.json','utf8'))"`
- Expected:
  - active state가 targetVersion `4.0.0`을 유지한다.
- Failure checks:
  - package.json과 ledger versionSource 혼동
  - QA 전 version-history append

## T8 Token Accounting Contract

- Size: 2~5분
- Files:
  - `packages/core/src/skill-framework/types.ts`
  - `packages/core/src/skill-framework/contracts.ts`
  - `packages/core/test/skill-generation.test.mjs`
  - `poggn/active/pgg-framework-full-replacement/metrics/token-usage.jsonl`
- Instructions:
  - token record schema가 runId, flowId, taskId, filePath, operation, source, tokenCount, tokenizer, isEstimated, charCount, byteCount, lineCount, contentSha256, commitSha, measuredAt을 포함하는지 검증한다.
  - pgg-code task commit 전 token 기록 순서를 generated docs에 포함한다.
- Verification:
  - `pnpm test:core`
  - `node -e "require('fs').readFileSync('poggn/active/pgg-framework-full-replacement/metrics/token-usage.jsonl','utf8').trim().split('\\n').forEach(JSON.parse)"`
- Expected:
  - JSONL parse success.
- Failure checks:
  - source 구분 누락
  - commitSha 필드 누락

## T9 Git Lifecycle and Commit Convention

- Size: 2~5분
- Files:
  - `.codex/sh/pgg-new-topic.sh`
  - `.codex/sh/pgg-stage-commit.sh`
  - `.codex/sh/pgg-archive.sh`
  - `.codex/sh/pgg-git-publish.sh`
  - `packages/core/test/git-publish.test.mjs`
- Instructions:
  - pgg git off에서는 branch/commit/release/push를 모두 생략한다.
  - pgg git on + git repository에서는 working branch, task commit, QA archive commit, release branch, push 규칙을 검증한다.
  - commit message는 `{convention}. {version} {message}` 또는 기존 helper가 강제하는 governed format과 충돌하지 않게 정리한다.
- Verification:
  - `pnpm test:core`
- Expected:
  - git helper tests pass.
- Failure checks:
  - pgg git off에서 commit 발생
  - remote 없음인데 push success 기록
  - dirty worktree guard 실패

## T10 Completion Message and QA Matrix

- Size: 2~5분
- Files:
  - `packages/core/src/skill-framework/registry.ts`
  - `.codex/skills/pgg-qa/SKILL.md`
  - `packages/core/test/skill-generation.test.mjs`
- Instructions:
  - 모든 flow completion message 마지막 문장 규칙을 generated docs와 tests에 고정한다.
  - pgg-qa matrix에 Source of Truth, Skill Framework, Legacy Replacement, Public API / CLI Compatibility, Korean Generated Docs, POGGN Workspace, Versioning, Git Mode / Branch Lifecycle, Commit Message Convention, Completion Message Contract, Token Accounting, 각 flow, Generated Docs, Technical Checks, Archive / Release / Push를 포함한다.
- Verification:
  - `pnpm test:core`
  - `rg -n "다음 flow를 실행하세요" .codex/skills/pgg-*.md`
- Expected:
  - 모든 flow가 허용된 next flow를 문서화한다.
- Failure checks:
  - 마지막 문장 뒤 추가 문장 허용
  - QA FAIL인데 archive/release/push 허용

## T11 Full Technical Verification

- Size: 2~5분
- Files:
  - no source file ownership; command evidence only
- Instructions:
  - 최종 검증 명령을 모두 실행하고 pgg-code report에 결과를 기록한다.
- Verification:
  - `pnpm build`
  - `pnpm build:readme`
  - `pnpm build:dashboard`
  - `pnpm test`
  - `pnpm test:core`
  - `pnpm test:dashboard`
  - `pnpm verify:version-history`
- Expected:
  - 모든 명령 PASS. 별도 lint/snapshot script는 `not_available`로 기록한다.
- Failure checks:
  - Vite build failure
  - docs generation instability
  - test failure logs 미분석

## T12 pgg-plan Artifact Review and Handoff

- Size: 2~5분
- Files:
  - `poggn/active/pgg-framework-full-replacement/pgg-plan/plan.md`
  - `poggn/active/pgg-framework-full-replacement/pgg-plan/task.md`
  - `poggn/active/pgg-framework-full-replacement/pgg-plan/reviews/plan.review.md`
  - `poggn/active/pgg-framework-full-replacement/pgg-plan/reviews/task.review.md`
  - `poggn/active/pgg-framework-full-replacement/state/current.md`
- Instructions:
  - plan/task/spec/review가 active workspace 아래에 있고 AC1~AC9가 task 또는 verification에 연결되는지 확인한다.
  - pgg-code handoff에 changed files, verification commands, version metadata, token ledger path를 포함한다.
- Verification:
  - `find poggn/active/pgg-framework-full-replacement/pgg-plan -maxdepth 3 -type f | sort`
  - `node -e "JSON.parse(require('fs').readFileSync('poggn/active/pgg-framework-full-replacement/state.json','utf8'))"`
- Expected:
  - pgg-code가 바로 실행 가능한 handoff가 존재한다.
- Failure checks:
  - 파일 경로 누락
  - task가 2~5분보다 큼
  - AC traceability 누락
