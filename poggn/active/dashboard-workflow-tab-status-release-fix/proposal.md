---
pgg:
  topic: "dashboard-workflow-tab-status-release-fix"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 96
  updated_at: "2026-04-24T23:36:18Z"
  auto_mode: "on"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "2.2.4"
  short_name: "dashboard-fix"
  working_branch: "ai/fix/2.2.4-dashboard-fix"
  release_branch: "release/2.2.4-dashboard-fix"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "Workflow 탭을 add-img/9.png 기준으로 맞추고 flow 상태 evidence와 Done/release 상태 모델을 재점검하는 proposal을 확정한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

dashboard-workflow-tab-status-release-fix

## 2. 변경 분류

- archive_type: `fix`
- version_bump: `patch`
- target_version: `2.2.4`
- short_name: `dashboard-fix`
- working_branch: `ai/fix/2.2.4-dashboard-fix`
- release_branch: `release/2.2.4-dashboard-fix`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- "`$pgg-add 워크플로우 기능과 화면 수정이 필요합니다.`"
- "`워크플로우의 탭에서 디자인이 9.png와 같아야하나 전혀 다릅니다.`"
- "`워크플로우의 플로우 스탭마다 시작 전, 진행 중, 추가 사항, 완료 같은 상태로 바뀌어야 하는데 그러지 않습니다.`"
- "`워크플로우의 스탭이 대시보드의 문제인지, 남기는 절차가 문제인지 확인 필요 합니다.`"
- "`워크플로의 스탭은 pgg-xx가 실행될때 진행 중으로 바뀌어야 합니다.`"
- "`Done만이 release 처리되어 최종 QA가 모두 통과되서 완료되거나 release 처리하지 못하는 상태나 qa실패로인한 실패 바께 없습니다.`"
- "`추가 사항이 있습니다. 모든 플로우는 그 단계가 완벽하게 끝나야만 완료로 처리되야 합니다. 지금은 중간에 완료 처리가 되네요`"

## 4. 왜 하는가

- `add-img/9.png` 기준의 tab shape는 선택된 탭의 상단/좌우 border가 콘텐츠 panel과 하나로 이어지고, 선택 탭 하단에는 분리선이나 선택 underline이 없는 형태다. 현재 `HistoryWorkspace.tsx`의 custom tab은 pseudo mask, shadow, panel top-line segment 계산으로 유사하게 맞추고 있으나 사용자는 실제 화면이 reference와 전혀 다르다고 보고했다.
- workflow step 상태는 전역 계약상 `시작 전`, `진행 중`, `추가 진행`, `완료` 네 상태로 계산되어야 한다. 사용자는 실제 pgg stage 실행 시 `진행 중`으로 바뀌지 않는다고 보고했으므로, dashboard의 상태 계산과 pgg stage 절차의 event 기록을 함께 검증해야 한다.
- pgg workflow의 상태가 dashboard에 반영되려면 `state/history.ndjson`와 `workflow.reactflow.json`에 stage evidence가 남아야 한다. UI가 상태를 계산할 수 있어도 `pgg-add`, `pgg-plan`, `pgg-code`, `pgg-refactor`, `pgg-qa` 시작 시점에 `stage-started` 또는 `stage-progress`가 없으면 `진행 중` 표시가 안정적으로 나올 수 없다.
- `추가 사항`은 기존 완료/진행 흐름에 새 요구가 들어온 transient 상태다. 완료 evidence 이후 unresolved `requirements-added` 또는 revision evidence가 있는 flow만 `추가 진행`으로 보여야 하며, 다른 이전 완료 flow를 `시작 전`으로 되돌리면 안 된다.
- `Done`은 일반 작업 flow가 아니라 release/완료 결과를 나타내는 마지막 상태여야 한다. 최종 QA가 통과하고 archive/version/release evidence가 생긴 경우에만 완료로 보이고, QA 실패 또는 release 처리 불가 상태는 완료가 아니라 실패/차단 상태로 보여야 한다.
- 모든 flow는 해당 stage의 정의된 완료 조건이 전부 끝난 뒤에만 `완료`로 전환되어야 한다. 문서 생성, 일부 review, 중간 progress, 단순 `updatedAt`, `reviewed` frontmatter, workflow node 존재만으로 완료 처리되면 dashboard가 실제 작업보다 앞서 완료를 보여 주는 문제가 반복된다.

## 5. 현재 구현 확인

- `add-img/9.png`
  선택된 Overview 탭은 큰 rounded top tab이며, 탭 하단 border/underline 없이 아래 content surface와 자연스럽게 연결된다. 탭 밖의 content top line은 남아 있으나 선택 탭 바로 아래에는 선이 없어야 한다.
- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
  현재 History tab은 MUI `ButtonBase`와 `HISTORY_TAB_*` geometry constant로 직접 렌더링한다. selected tab은 `borderBottom: 0`, `boxShadow`, `::after` mask, panel `::before`/`::after` top-line segment로 add-img/9 shape를 만들려는 구조다. 실제 reference와 불일치가 있으므로 pixel-level visual acceptance가 필요하다.
- `apps/dashboard/src/features/history/historyModel.ts`
  `WorkflowStatus`는 `completed | current | updating | pending`이며 locale에서는 `완료`, `진행 중`, `추가 진행`, `시작 전`으로 대응된다. 상태 모델 자체는 네 상태를 표현할 수 있으나, 실제 `stage-started`/`stage-progress`가 들어오지 않거나 flow mapping이 틀리면 시작 시 `진행 중`으로 전환되지 않는다.
- `apps/dashboard/src/features/history/historyModel.ts`
  workflow flow에는 `done`이 포함되어 있고 label은 `Done`이다. Done은 `version.json`과 `git/` path pattern에 묶여 있어 release/archive evidence와 연결된다. 다만 QA 실패, release blocked, publish blocked 상태가 Done completed와 명확히 분리되어 렌더링되는지 후속 확인이 필요하다.
- `.codex/add/WOKR-FLOW.md`와 `.codex/add/STATE-CONTRACT.md`
  전역 문서에는 `stage-started`/`stage-progress`는 `진행 중`, unresolved `requirements-added`/revision은 `추가 진행`, `stage-commit` 또는 verified/final `stage-completed`/archive/later-flow evidence는 `완료`라고 기록되어 있다. 이번 topic은 이 문서 계약이 실제 helper/skill 실행 절차와 dashboard runtime에서 모두 지켜지는지 검증해야 한다.
- `.pgg/project.json`
  current-project verification contract는 `manual`이다. 후속 QA는 공식 검증 명령을 임의 추론하지 말고, source review와 필요한 dashboard visual/browser evidence를 별도 evidence로 남겨야 한다.

## 6. 무엇을 할 것인가

- `add-img/9.png`를 탭 visual acceptance 기준으로 고정한다. 선택 tab의 top/side border, bottom gap, panel top line masking, tab과 panel의 border color/thickness, rounded corner, inactive tab의 unboxed 상태를 pixel 기준으로 재조정한다.
- 현재 tab 구현이 reference와 다른 원인을 분리한다. geometry constant 문제인지, panel top-line segment 계산 문제인지, selected tab mask/overflow 문제인지, theme color/alpha 문제인지 확인한다.
- workflow status 문제를 두 축으로 진단한다. 첫째 dashboard가 `state/history.ndjson`, `workflow.reactflow.json`, topic frontmatter, archive/version evidence를 올바른 우선순위로 읽는지 확인한다. 둘째 pgg stage 절차와 helper가 stage 시작/진행/완료/실패 event를 실제로 남기는지 확인한다.
- 모든 `pgg-xx` stage 시작 시 `state/history.ndjson`에 해당 stage의 `stage-started` event가 남도록 절차 또는 helper/spec를 보강한다. 진행 중 중간 산출물은 `stage-progress`로 남기고, 완료 전에는 `stage-completed`를 남기지 않는다.
- 사용자 추가 요구가 들어온 경우 stage 작업 전에 `requirements-added`를 남겨 dashboard가 즉시 `추가 진행`을 계산하게 한다. 해당 추가 진행은 stage commit 또는 verified/final completion evidence로 해소되어야 한다.
- 완료 기준을 엄격히 한다. `reviewed`, `approved`, 산출물 존재, 단순 updatedAt만으로 현재 flow를 완료 처리하지 않고, `stage-commit`, verified/final `stage-completed`, archive, later-flow evidence 같은 신뢰 가능한 evidence를 우선한다.
- stage별 완전 종료 조건을 정의한다. Add는 proposal과 proposal review가 pass되고 handoff state/workflow metadata가 검증되어야 완료, Plan은 plan/task/spec/reviews가 모두 pass되어야 완료, Code는 구현/diff/index/code review와 필요한 task completion evidence가 끝나야 완료, Refactor는 refactor review와 cleanup evidence가 끝나야 완료, QA는 qa report pass와 archive/release outcome 처리가 끝나야 완료로 본다.
- 현재 실행 중인 flow가 일부 산출물을 만들었더라도 final completion evidence가 없으면 `진행 중` 또는 `추가 진행`으로 남긴다. dashboard는 partial artifact evidence를 completion evidence와 분리해야 한다.
- Done flow의 의미를 release outcome으로 한정한다. QA pass + archive/version/release evidence가 있으면 Done completed, QA fail이면 failed, release 처리 불가 또는 publish blocked면 blocked/failed 상태로 표시한다. active topic의 단순 마지막 stage 진행을 Done completed로 보이지 않게 한다.
- dashboard에 실패/차단 release 상태를 표현할 수 있는 최소 status mapping을 설계한다. 사용자-facing flow step 네 상태와 Done release outcome 상태가 충돌하지 않게 범위를 spec에서 확정한다.
- `pgg update/init`으로 생성되는 문서와 helper template에 event evidence 원칙이 유지되는지 확인한다. 전역 생성물에만 문구가 있고 실제 helper에는 event append가 빠진 상태를 허용하지 않는다.
- 후속 plan에서 UI spec, state evidence spec, release outcome spec, QA visual acceptance를 분리한다.

## 7. 범위

### 포함

- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`의 History tab visual 수정
- `add-img/9.png` 기준의 tab/panel border 연결, selected tab bottom line 제거, inactive tab unboxed 처리
- `apps/dashboard/src/features/history/historyModel.ts`의 flow status 계산 검증 및 필요 수정
- dashboard snapshot/parser가 `state/history.ndjson`와 `workflow.reactflow.json` stage evidence를 읽는 경로 검증
- `.codex/sh/*.sh`, `.codex/skills/pgg-*`, `packages/core/src/templates.ts` 중 pgg stage event를 생성/보존해야 하는 부분 검토 및 필요 수정
- `stage-started`, `stage-progress`, `requirements-added`, verified/final `stage-completed`, `stage-commit`, QA fail, release blocked/publish blocked evidence contract 정리
- Done flow를 release outcome 전용으로 제한하는 dashboard 표시와 state source contract
- current-project manual verification 상태에서 visual/source acceptance evidence 기록

### 제외

- pgg core workflow 순서 변경
- archive된 topic을 active로 되돌리는 작업
- 외부 git hosting API 또는 remote release publish 정책 재설계
- dashboard 전체 레이아웃 재설계
- `add-img/9.png` 파일 자체 수정

## 8. 제약 사항

- 사용자-facing flow status는 `시작 전`, `진행 중`, `추가 진행`, `완료` 네 상태 계약을 유지한다.
- `추가 사항` 요청 문구는 기존 전역 계약의 `추가 진행` 상태로 정규화한다.
- pgg internal stage 이름은 유지한다. `Add`는 proposal, `Code`는 implementation을 의미한다.
- 완료 evidence는 너무 이르게 남기지 않는다. 작업 중간 산출물이나 검증 전 상태는 `stage-progress`로만 기록한다.
- Done은 일반 진행 상태가 아니라 최종 release outcome이다. QA 실패 또는 release/publish blocked를 Done completed로 표시하지 않는다.
- current-project verification contract가 manual이므로 후속 QA에서 declared command 없이 임의 framework command를 공식 contract로 실행하지 않는다.
- visual acceptance는 desktop/mobile에서 tab line, selected tab bottom, panel top line이 겹치거나 끊기는지 확인해야 한다.

## 9. auto mode 처리

- poggn auto mode: `on`
- teams mode: `off`
- pgg git mode: `on`
- auto mode가 `on`이므로 이번 proposal에서는 `archive_type=fix`, `version_bump=patch`, `target_version=2.2.4`, `short_name=dashboard-fix`를 확정한다.
- unresolved requirement는 없다. "대시보드의 문제인지, 남기는 절차가 문제인지 확인 필요"는 둘 중 하나로 추정하지 않고, 후속 plan에서 dashboard ingestion과 pgg event 기록 절차를 각각 검증하는 것으로 확정한다.

## 10. 기준안

| 항목 | 기준안 | 상태 |
|---|---|---|
| Tab reference | `add-img/9.png`를 탭 visual acceptance 기준으로 사용 | resolved |
| Selected tab | top/side border는 panel과 연결, bottom line/underline 없음 | resolved |
| Inactive tab | 박스 없이 텍스트 tab으로 보임 | resolved |
| Flow status | `시작 전`, `진행 중`, `추가 진행`, `완료` 4상태 유지 | resolved |
| Stage start | `pgg-xx` 실행 시작 시 해당 flow가 `진행 중`으로 바뀌는 evidence 필요 | resolved |
| Added requirements | 작업 전 `requirements-added` append로 `추가 진행` 표시 | resolved |
| Completion | `stage-commit` 또는 verified/final completion evidence 전에는 완료 처리 금지 | resolved |
| Full-stage completion | 각 flow의 stage별 필수 산출물, review, verification, commit/release evidence가 모두 끝나야 완료 | resolved |
| Partial progress | 문서 일부 생성, 중간 review, updatedAt, node 존재는 완료가 아니라 진행 evidence | resolved |
| Diagnosis | dashboard status calculation과 pgg event recording procedure를 분리 확인 | resolved |
| Done flow | QA pass + archive/version/release evidence만 Done completed | resolved |
| Failure states | QA fail, release/publish blocked는 Done completed가 아닌 실패/차단 상태 | resolved |
| Template propagation | `pgg update/init` 생성물과 helper template에서도 같은 evidence contract 유지 | resolved |

## 11. 성공 기준

- Workflow 탭이 `add-img/9.png`처럼 보인다. 선택 tab 하단에는 border, underline, 색상 줄이 없고 content panel과 한 덩어리로 연결된다.
- 선택 tab 밖 content top border는 유지되며, 선택 tab 바로 아래 영역만 자연스럽게 비어 있다.
- inactive tab은 별도 box/card처럼 보이지 않는다.
- 모든 flow step은 evidence에 따라 `시작 전`, `진행 중`, `추가 진행`, `완료` 중 하나로 표시된다.
- `pgg-add`, `pgg-plan`, `pgg-code`, `pgg-refactor`, `pgg-qa`가 시작되면 해당 flow는 dashboard에서 `진행 중`으로 바뀔 수 있는 event를 갖는다.
- 추가 요구가 들어온 flow는 완료로 고정되지 않고 `추가 진행`으로 보인다.
- 추가 진행이 해소된 뒤 이전 완료 flow들이 `시작 전`으로 되돌아가지 않는다.
- 현재 작업이 검증/commit 전인데 너무 빨리 완료로 표시되지 않는다.
- 모든 flow는 해당 단계가 완벽하게 끝나기 전까지 완료로 표시되지 않는다.
- partial artifact, draft/reviewed frontmatter, workflow node existence, updatedAt fallback은 단독으로 완료 조건이 될 수 없다.
- Add/Plan/Code/Refactor/QA 각각의 완료 조건은 spec에 명시되고 dashboard 상태 계산에서 같은 기준으로 적용된다.
- Done은 최종 QA pass 후 archive/version/release evidence가 있을 때만 완료로 표시된다.
- QA 실패 또는 release 처리 불가/publish blocked 상태는 Done completed로 표시되지 않고 실패 또는 차단 상태로 구분된다.
- 후속 QA는 탭 visual, flow status evidence, Done/release outcome mapping을 각각 증명한다.

## 12. Audit Applicability

- `pgg-token`: `not_required` | handoff token 최적화가 아니라 dashboard tab/status와 pgg evidence contract 정합이 핵심이다.
- `pgg-performance`: `not_required` | UI geometry와 상태 evidence 계산/기록 수정이며 별도 성능 계측이 필요한 데이터 규모 변경은 없다.

## 13. Git Publish Message

- title: fix: 2.2.4.워크플로우 상태 표시
- why: Workflow 탭이 add-img/9.png와 다르게 보이고 pgg stage 시작/추가/완료 evidence가 dashboard 상태로 안정적으로 반영되지 않아, 탭 visual과 flow status 기록/계산 및 Done release outcome 표시를 함께 바로잡아야 한다.
- footer: Refs: dashboard-workflow-tab-status-release-fix

## 14. 전문가 평가 요약

- 프로덕트 매니저: 요청은 기존 dashboard workflow의 신뢰도 회복을 위한 patch다. 사용자는 visual mismatch와 상태 전환 실패를 함께 제기했으므로 UI만 고치거나 문서만 고치는 범위로 줄이면 안 된다.
- UX/UI 전문가: `add-img/9.png`는 탭의 형태, selected bottom line 제거, panel top line 연결을 직접 규정하는 reference다. 구현 단계에서 screenshot/pixel evidence로 tab과 panel의 연결을 확인해야 한다.
- 도메인 전문가: `pgg-xx` 실행 시 `진행 중`으로 바뀌려면 dashboard model뿐 아니라 pgg stage event 기록 절차가 필요하다. Done은 release outcome으로 제한하고 QA fail/release blocked를 완료와 분리해야 workflow 의미가 일관된다.
- 추가 요구 반영: 모든 flow는 stage별 완료 조건이 완전히 끝나야만 완료로 처리한다. 중간 산출물, draft/reviewed metadata, updatedAt, node 존재는 완료 evidence가 아니라 progress evidence로 취급한다.

## 15. 다음 단계

`pgg-plan`에서 tab visual spec, flow status evidence spec, pgg stage event recording spec, Done/release outcome spec, dashboard ingestion spec, QA visual/source acceptance를 분리해 plan/task/spec으로 전개한다.
