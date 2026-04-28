---
pgg:
  topic: "pgg-workflow-token-commit-contract"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 97
  updated_at: "2026-04-28T00:47:54Z"
reactflow:
  node_id: "spec-git-task-row-commit-governance"
  node_type: "spec"
  label: "spec/git/task-row-commit-governance.md"
state:
  summary: "pgg-code가 task.md Task 목록의 T1...N 행마다 commit을 남기는 계약"
  next: "pgg-code"
---

# Spec: Task 행 단위 Commit Governance

## 목적

`pgg-code`가 `task.md`의 Task 목록에서 `Task ID`가 `T1...N`인 각 행을 독립 완료 단위로 보고, 행 하나가 완료될 때마다 task-scoped commit을 남기게 한다.

## 현재 동작

- `.codex/skills/pgg-code/SKILL.md`는 `plan.md`의 task 단위를 기본 commit cadence로 본다고 설명한다.
- `.codex/sh/pgg-stage-commit.sh`는 summary/why/footer 인자를 받아 `{archive_type}: {target_version}.{summary}` 제목과 `Why`, `Changes`, footer body를 만든다.
- 사용자는 task 표의 행 단위와 commit message 구조를 더 엄격히 요구한다.

## 요구사항

1. `pgg-code`는 `task.md`의 `## 작업 목록` 또는 동등 Task 목록 표에서 `Task ID`가 `T1...N`인 행을 commit 단위로 사용한다.
2. 한 task 행이 완료되면 `.codex/sh/pgg-stage-commit.sh` 또는 동등 helper로 commit 처리를 시도한다.
3. 여러 task 행의 변경을 하나의 commit으로 묶지 않는다.
4. task commit 제목의 summary 부분은 해당 행의 `작업 요약` 또는 pgg lang에 맞는 task content에서 온다.
5. commit body 최상단에는 `Dependencies` 또는 pgg lang canonical label의 dependencies section이 온다.
6. dependencies 아래에는 해당 task 행의 완료 조건 section이 온다.
7. commit footer에는 완료 조건에 명시된 각 task 내용을 기입한다.
8. 변경이 없거나 guardrail로 commit할 수 없으면 no-op/deferred evidence를 `state/history.ndjson` 또는 implementation 기록에 남긴다.
9. helper와 skill 문서, generated template, tests가 같은 task-row commit 계약을 설명해야 한다.

## 구현 기준

- 주요 대상: `.codex/skills/pgg-code/SKILL.md`, `.codex/sh/pgg-stage-commit.sh`, `packages/core/src/templates.ts`, `packages/core/test/git-publish.test.mjs`, 필요 시 `.codex/add/WOKR-FLOW.md`.
- stage commit helper는 task id, dependencies, completion criteria를 받을 수 있는 interface를 추가하거나 기존 인자 위에 안전한 encoding contract를 정의한다.
- commit message는 현재 project `pgg lang`을 검증한다.
- 제목 50자 이하, 명령형 금지, 마침표 금지, archive_type/target_version prefix 같은 기존 governance와 충돌하지 않아야 한다.
- `state/history.ndjson` stage-commit event에는 task id와 task row source를 남긴다.

## 수용 기준

- `task.md`에 T1, T2가 있으면 pgg-code 완료 과정에서 각 task별 commit 또는 defer evidence가 별도로 남는다.
- commit title summary가 task 작업 내용과 일치한다.
- commit body 순서가 dependencies section 다음 completion criteria section이다.
- footer가 완료 조건에 명시된 task 내용을 포함한다.
- 기존 dirty baseline, branch recovery, git mode off, invalid language guardrail이 유지된다.

## 제외

- pgg-plan 단계에서 실제 commit 생성.
- task 표가 없는 legacy topic의 자동 변환.
