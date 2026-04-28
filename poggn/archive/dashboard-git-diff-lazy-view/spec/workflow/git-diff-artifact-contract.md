---
pgg:
  topic: "dashboard-git-diff-lazy-view"
  stage: "spec"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-28T05:30:44Z"
  archive_type: "feat"
  project_scope: "current-project"
---

# Spec: Git Diff Artifact Contract

## 목적

pgg flow가 Git으로 재현 가능한 diff 본문을 topic 파일로 중복 저장하지 않고, 변경 파일 목록과 조회 가능한 Git metadata를 durable evidence로 남기게 한다.

## 요구사항

- 신규 code/refactor flow에서 `implementation/diffs/*.diff` 본문 파일은 기본 필수 산출물이 아니다.
- `implementation/index.md`는 변경 파일 목록의 canonical index다.
- `state/current.md`의 `Changed Files`는 다음 단계 handoff를 위한 최소 변경 목록을 유지한다.
- 각 변경 항목은 최소한 `CRUD`, `path`, `taskRef`, `diffSource`, `gitRef` 또는 `commitRange`, `diffCommand`, `status`를 표현할 수 있어야 한다.
- `pgg git=on`에서 task commit이 있으면 task commit hash가 우선 diff source다.
- task commit이 없고 stage completion commit/range만 있으면 range 기반 diff source를 사용한다.
- `pgg git=off`나 commit 전 상태는 `working-tree` 또는 `cached` status로 표시하고 archive 가능한 durable Git ref로 취급하지 않는다.
- legacy `implementation/diffs/*.diff`가 있는 과거 topic은 삭제하지 않고 fallback으로 읽을 수 있어야 한다.

## 비요구사항

- 과거 archive topic의 `.diff` 파일 일괄 삭제.
- remote Git provider API 연동.
- Git 이력이 없는 파일의 archive 후 diff 복원 보장.

## 수용 기준

- workflow 문서와 skill 문서에 `.diff` 본문 필수 생성 문구가 남지 않는다.
- generated template과 현재 workspace helper가 같은 index contract를 설명한다.
- `pgg-diff-index.sh`가 legacy diff 파일만을 유일한 source로 가정하지 않는다.
- stage completion 전에는 `working-tree` diff가 임시 상태임을 문서화한다.

## 확인 대상

- `.codex/add/WOKR-FLOW.md`
- `.codex/add/STATE-CONTRACT.md`
- `.codex/add/IMPLEMENTATION.md`
- `.codex/skills/pgg-code/SKILL.md`
- `.codex/skills/pgg-refactor/SKILL.md`
- `.codex/sh/pgg-diff-index.sh`
- `packages/core/src/templates.ts`
