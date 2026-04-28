---
pgg:
  topic: "pgg-framework-full-replacement"
  stage: "plan"
  status: "draft"
  skill: "pgg-plan"
  updated_at: "2026-04-28T12:30:59Z"
---

# Spec: Git Lifecycle

## 목적

pgg git mode, branch lifecycle, commit message convention, release push 조건을 신규 Skill Framework 계약에 맞춘다.

## 대상 파일

- `.codex/sh/pgg-new-topic.sh`
- `.codex/sh/pgg-stage-commit.sh`
- `.codex/sh/pgg-archive.sh`
- `.codex/sh/pgg-git-publish.sh`
- `packages/core/test/git-publish.test.mjs`

## 요구사항

1. pgg git off이면 branch/commit/release/push를 수행하지 않는다.
2. pgg git on + git repository이면 governed working branch를 사용한다.
3. pgg-code task commit은 token record 이후에만 수행한다.
4. pgg-qa PASS 후에만 archive/release/push를 허용한다.
5. remote가 없으면 push를 생략하고 이유를 기록한다.

## 검증

- `pnpm test:core`
- `git status --short --branch`
