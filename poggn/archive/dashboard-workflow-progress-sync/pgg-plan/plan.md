---
pgg:
  topic: "dashboard-workflow-progress-sync"
  stage: "plan"
  status: "approved"
  skill: "pgg-plan"
  score: 94
  updated_at: "2026-04-28T13:30:51Z"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "4.0.1"
  short_name: "dashboard-progress-sync"
  working_branch: "ai/fix/4.0.1-dashboard-progress-sync"
  release_branch: "release/4.0.1-dashboard-progress-sync"
  project_scope: "current-project"
---

# Plan

## 승인된 설계 요약

`state/history.ndjson` event stream, core status evaluator, dashboard project overview의 workflow progress가 같은 상태 계약을 사용하게 만든다.
신규 PGG Skill Framework의 상태 의미는 `시작 전`, `진행 중`, `추가 진행`, `완료`, `실패/차단`이며, dashboard는 stage index나 legacy proposal status만으로 완료를 추론하지 않는다.

## Topic

- topic_name: `dashboard-workflow-progress-sync`
- active path: `poggn/active/dashboard-workflow-progress-sync`
- archive path: `poggn/archive/dashboard-workflow-progress-sync`

## Version Plan

- currentVersion: `4.0.0`
- targetVersion: `4.0.1`
- bumpType: `patch`
- convention: `fix`
- versionReason: history event와 dashboard workflow progress 계산이 어긋나는 사용자-facing bug fix
- versionSource: `poggn/version-history.ndjson latest archived version`
- package.json version: `0.1.0`, 이번 topic의 release version source가 아니므로 pgg-code는 package.json version을 수정하지 않는다.
- version bump task: pgg-code에서는 version metadata와 archive target을 검증하고, pgg-qa archive 단계에서 `poggn/version-history.ndjson`에 `4.0.1`이 append되는지 검증한다.

## 구현 전략

1. core status evaluator가 신규 Skill Framework stage/status 표현을 인식하게 한다.
2. dashboard workflow model이 `state/history.ndjson`의 completion evidence만 완료로 인정하고, `stage-started`/`stage-progress`만으로 완료 처리하지 않게 한다.
3. optional audit flow는 실제 실행 evidence가 있는 경우에만 보이게 유지한다.
4. project overview가 core snapshot과 dashboard history model에서 같은 상태 의미를 쓰게 snapshot을 재생성한다.
5. core status test와 dashboard history model test를 history fixture 중심으로 보강한다.

## 검증 전략

- unit/model test로 상태 계산 계약을 먼저 고정한다.
- `scripts/dashboard-history-model.test.mjs`에 dashboard workflow progress regression fixture를 추가한다.
- `packages/core/test/status-analysis.test.mjs`에 신규 `pgg-add`/`approved`/history event stage fixture를 추가한다.
- implementation 후 `node --test scripts/dashboard-history-model.test.mjs`, `pnpm test:core`, `pnpm test:dashboard`, `pnpm test`, `pnpm build:dashboard`, `pnpm build`, `pnpm verify:version-history`를 실행한다.
- dashboard snapshot 갱신이 필요한 경우 `node packages/cli/dist/index.js dashboard --snapshot-only`를 실행하고 `apps/dashboard/public/dashboard-data.json` diff가 core snapshot 결과인지 확인한다.

## 생성할 테스트

- `scripts/dashboard-history-model.test.mjs`
  - `stage-started`/`stage-progress`만 있는 previous flow가 완료로 계산되지 않는 테스트
  - verified `stage-completed`가 완료로 계산되는 테스트
  - 완료 후 `requirements-added`가 `updating`으로 계산되는 테스트
  - optional audit `required` 문구만으로 token/performance flow가 표시되지 않는 테스트
- `packages/core/test/status-analysis.test.mjs`
  - `state/current.md`의 Current Stage가 `pgg-add`이고 proposal status가 `approved`인 topic을 `pgg-plan` ready로 분류하는 테스트
  - `Audit Applicability` bullet이 `- [pgg-performance]: required | ...` 형식이어도 parser가 인식하는 테스트
  - required optional audit가 실제 report 없을 때 next workflow로 추천되지만 dashboard 표시 evidence와 혼동되지 않는 테스트

## 성공/실패 기준

- 성공: AC1~AC6가 테스트로 검증되고 dashboard overview와 topic detail workflow progress가 같은 상태 의미를 사용한다.
- 실패: index-based completion 또는 legacy `reviewed`-only proposal gate 때문에 신규 pgg-add topic이 잘못된 상태로 표시된다.

## 경계값/예외/회귀/성능 기준

- 경계값: history event가 없는 topic, only `topic-created`, only `stage-started`, only `stage-progress`, verified `stage-completed`, `stage-commit`, unresolved `requirements-added`.
- 예외: malformed `history.ndjson` line은 기존 parser 동작을 유지하고 topic 전체 계산을 깨뜨리지 않는다.
- 회귀: archived topic은 기존처럼 완료/Done을 유지하되 publish blocked 상태는 blocked로 남긴다.
- optional audit 회귀: `Audit Applicability` required만으로 dashboard workflow step을 표시하지 않는다.
- 성능: not_required. 새 계산은 topic별 history/files 배열을 한 번 순회하는 기존 수준 안에서 유지하고 별도 pgg-performance를 열지 않는다.

## 병렬화 가능성

- T1 core status parser/test와 T2 dashboard history model test는 병렬 작성 가능하다.
- T3 dashboard model 수정은 T2 테스트가 실패하는 것을 확인한 뒤 진행한다.
- T4 snapshot 재생성은 T1~T3 이후에만 수행한다.

## 예상 병목

- legacy archive topic의 오래된 `proposal.md` frontmatter status와 신규 `pgg-add` state 표현을 동시에 보존하는 stage normalization.
- dashboard history model이 index-based progress와 evidence-based completion을 섞고 있어 완료/추가 진행 우선순위가 흔들릴 수 있다.

## Audit Applicability

- [pgg-token]: not_required | token/handoff 구조 변경이 아니라 상태 계산 bug fix다.
- [pgg-performance]: not_required | 성능 목표나 runtime hot path 변경이 없다.
