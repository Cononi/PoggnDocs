---
pgg:
  topic: "pgg-optional-git-init-and-active-isolation"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-28T04:44:32Z"
state:
  summary: "pgg workflow와 helper의 git mode별 evidence contract를 정의한다."
  next: "pgg-code"
---

# Spec S3: git mode evidence contract

## 목적

`git mode=on`에서는 commit/branch evidence를 사용하고, `git mode=off`에서는 artifact/history/changed files evidence를 사용하도록 pgg-* flow, helper, generated 문서의 완료 판단을 정렬한다.

## 현재 동작

- WOKR-FLOW는 `pgg git=on`일 때 stage commit과 archive publish를 완료 evidence로 설명한다.
- helper들은 일부 git-off skip 처리를 가지고 있지만, workflow 문서와 gate/status surface가 git-off 정상 완료 경로를 충분히 강조하지 않는다.
- `state/current.md`는 Changed Files와 Git Publish Message를 유지할 수 있으나, git-off completion evidence 기준은 더 명확해야 한다.

## 요구사항

1. `git mode=off`는 workflow degraded mode가 아니라 정상 mode로 문서화한다.
2. `pgg-code`, `pgg-refactor`, `pgg-qa`는 git-off에서 commit 부재를 완료 blocker로 취급하지 않아야 한다.
3. git-off stage completion은 필수 artifact, review, verification result, `state/history.ndjson`의 verified `stage-completed`, `state/current.md`의 Changed Files를 evidence로 사용한다.
4. git-on stage completion은 기존처럼 task/QA commit, branch, publish evidence를 사용한다.
5. gate/helper는 git-off일 때 git command 실패 후 fallback하지 말고 manifest mode로 사전 분기해야 한다.
6. generated templates와 checked-in `.codex/add/*`, `.codex/skills/pgg-*`, `.codex/sh/*`가 같은 contract를 설명해야 한다.
7. `Git Publish Message`는 git-on에서 필수이고, git-off에서는 publish intent 기록 또는 future enablement metadata로만 남길지 정책을 명확히 한다.

## 구현 대상

- `.codex/add/WOKR-FLOW.md`
- `.codex/add/STATE-CONTRACT.md`
- `.codex/skills/pgg-code/SKILL.md`
- `.codex/skills/pgg-refactor/SKILL.md`
- `.codex/skills/pgg-qa/SKILL.md`
- `.codex/skills/pgg-plan/SKILL.md`
- `.codex/sh/pgg-gate.sh`
- `.codex/sh/pgg-stage-commit.sh`
- `.codex/sh/pgg-archive.sh`
- `.codex/sh/pgg-git-publish.sh`
- `packages/core/src/templates.ts`
- 관련 core/helper 테스트

## 수용 기준

- git-off topic은 필수 문서와 verified stage evidence가 있으면 commit 없이도 다음 stage로 진행할 수 있다.
- git-on topic은 기존 commit/branch guardrail을 유지한다.
- gate 결과는 git-off skip과 blocker를 명확히 구분한다.
- generated asset sync 후 checked-in 문서와 template 문구가 일치한다.

## 제외

- git-off에서 synthetic commit을 만드는 기능
- 기존 git-on publish governance 완화
- pgg flow 상태 모델 자체의 4상태 구조 변경
