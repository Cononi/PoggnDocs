---
pgg:
  topic: "pgg-optional-git-init-and-active-isolation"
  stage: "qa"
  status: "done"
  score: 97
  updated_at: "2026-04-28T05:21:40Z"
---

# QA Report

## Scope

- CLI/core `pgg init`/`update`에서 git 없는 프로젝트와 `git.mode=off` 정상 경로를 검증한다.
- dashboard project add Stepper가 단계 입력, git 사용 여부 선택, horizontal responsive Stepper 요구를 충족하는지 검증한다.
- pgg workflow evidence contract가 git-on/git-off completion evidence를 구분하는지 검증한다.
- 여러 active topic의 git-on branch isolation과 git-off changed-path collision blocker를 검증한다.

## Test Plan

| Area | Evidence | Result |
|---|---|---|
| 전체 빌드 | `pnpm build` | pass |
| 전체 테스트 | `pnpm test` | pass, core 60 tests and dashboard 3 tests |
| core git optional | `git-off initialization works without repository setup and preserves explicit off mode` | pass |
| dashboard git-off add | `dashboard project init can register git-off without onboarding` | pass |
| multi-active git-on | `analyzeProjectStatus blocks git-on active topics on branch mismatch` | pass |
| multi-active git-off | `analyzeProjectStatus blocks git-off active topics with changed-path collisions` | pass |
| refactor regression | `pnpm --filter @pgg/core test` within full test | pass |

## Audit Applicability

- `pgg-token`: not_required. 이 topic은 token accounting 변경이 아니라 git optional workflow와 active isolation 기능 변경이다.
- `pgg-performance`: not_required. 성능 민감 경로가 아니라 init/dashboard/status/workflow contract 변경이며, 전체 build/test로 회귀를 확인했다.

## Expert Review

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| QA/테스트 엔지니어 | 97 | 요구사항별 회귀 테스트가 core test에 포함되어 있고, dashboard build와 전체 test가 통과했다. 추가 요구였던 horizontal responsive Stepper도 dashboard build 기준으로 검증됐다. | 없음 |
| SRE / 운영 엔지니어 | 97 | git-on publish/branch helper 회귀 테스트와 git-off non-repository 경로 테스트가 모두 통과했다. 기존 untracked `변경.md`는 baseline 외부 파일로 유지되며 archive helper가 topic-scoped 변경만 처리할 수 있는 상태다. | 없음 |

## Risk Notes

- dashboard Stepper는 build 검증까지 수행했다. 실제 브라우저 시각 검증은 별도 Playwright 계약이 선언되어 있지 않아 수동 확인 대상으로 남긴다.
- release publish는 `pgg-archive.sh`가 `qa/report.md`와 `state/current.md`의 publish metadata를 사용해 처리한다.

## Git Publish Message

- title: feat: 3.1.0.git 선택 흐름
- why: git을 사용하지 않는 프로젝트도 pgg init과 dashboard 등록 및 workflow 진행을 정상 경로로 지원해야 하며, 여러 active topic이 동시에 있을 때 git-on branch 격리와 git-off 파일 범위 격리 규칙이 필요하다.
- footer: Refs: pgg-optional-git-init-and-active-isolation

## Decision

pass
