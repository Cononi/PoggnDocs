---
pgg:
  topic: "dashboard-project-main-selector-version-sync"
  stage: "qa"
  status: "blocked"
  skill: "pgg-qa"
  score: 88
  updated_at: "2026-04-23T22:25:24Z"
state:
  summary: "project main parity, selector affordance, path visibility, archive-based version sync 변경에 대한 QA 결과를 기록한다."
  next: "return to pgg-refactor"
---

# QA Report

## Test Plan

- `Project` 메인 workspace가 `add-img/main.png` 기준으로 재정렬된 상태에서 build 가능한지 확인한다.
- `Select Project` affordance가 전체 card/button surface로 유지되고 project path가 잘리지 않는지 검토한다.
- project version source가 archive latest 기준으로 계산되도록 바뀐 흐름이 regression 없이 build/test를 유지하는지 확인한다.
- implementation, refactor, qa gate 결과를 확인해 archive 진입 가능 상태인지 판단한다.
- current-project verification contract가 없으므로 `manual verification required`가 정확히 기록되는지 확인한다.
- git mode가 `on`인 상태에서 branch/remote preflight가 archive 준비 조건을 충족하는지 확인한다.

## Audit Applicability

- [pgg-token]: [not_required] | token 비용 검토보다 main parity와 version/source 정합성 QA가 중심이다
- [pgg-performance]: [not_required] | 성능 측정보다 workflow artifact 정합성과 build 안정성 확인이 중심이다

## Execution Results

- `pnpm build`
  - pass. `apps/dashboard`, `packages/core`, `packages/cli` build가 모두 완료됐다.
- `bash ./.codex/sh/pgg-gate.sh pgg-code dashboard-project-main-selector-version-sync`
  - pass. implementation stage artifacts가 gate 기준을 충족했다.
- `bash ./.codex/sh/pgg-gate.sh pgg-refactor dashboard-project-main-selector-version-sync`
  - pass. 현재 topic이 refactor stage로 진입할 최소 implementation artifacts는 충족했다.
- `bash ./.codex/sh/pgg-gate.sh pgg-qa dashboard-project-main-selector-version-sync`
  - fail. `reviews/refactor.review.md is missing`로 QA gate가 막혔다.
- current-project verification contract
  - `manual verification required`. `.pgg/project.json` 기준 `verification.mode=manual`, `manualReason=verification contract not declared`다.
- git preflight
  - pass. current branch는 `ai/fix/0.15.1-dashboard-sync`이고 remote `origin`이 설정돼 있다.

## Test Evidence

- build: `pnpm build`
- implementation gate: `{"gate":"pass","stage":"pgg-code"}`
- refactor entry gate: `{"gate":"pass","stage":"pgg-refactor"}`
- qa gate: `{"gate":"fail","stage":"pgg-qa","reason":"reviews/refactor.review.md is missing"}`
- verification status: `.pgg/project.json`의 `verification.mode=manual`, `manualReason=verification contract not declared`
- git branch: `git branch --show-current` => `ai/fix/0.15.1-dashboard-sync`
- git remote: `git remote get-url origin` => `https://github.com/Cononi/PoggnDocs.git`

## Expert Notes

| Expert | Score | Core Judgment | Evidence Checked | Blocking Issue |
|---|---:|---|---|---|
| QA/테스트 엔지니어 | 88 | build와 implementation evidence는 안정적이지만 required refactor review artifact가 없어 QA pass를 줄 수 없다. | `pnpm build`, `pgg-code/pgg-refactor/pgg-qa gate`, `state/current.md`를 확인했다. | `reviews/refactor.review.md` 누락 |
| 코드 리뷰어 | 87 | version source, selector affordance, project main surface 변경 자체는 범위에 맞지만 refactor 단계 기록이 없어 최종 workflow completeness가 부족하다. | `reviews/code.review.md`, `implementation/index.md`, `state/history.ndjson`, QA gate 결과를 확인했다. | `reviews/refactor.review.md` 누락 |
| SRE / 운영 엔지니어 | 90 | branch/remote와 manual verification 상태는 정상이지만 QA gate fail 상태에서 archive helper를 실행하면 workflow contract를 깨게 된다. | `.pgg/project.json`, `git branch --show-current`, `git remote get-url origin`, QA gate 결과를 확인했다. | `reviews/refactor.review.md` 누락 |

## Decision

- fail

## Git Publish Message

- title: fix: project main sync
- why: Project 메인 표면을 기준 이미지에 다시 맞추고 selector/path/version 표시를 archive lifecycle 기준으로 바로잡아야 사용자가 신뢰할 수 있는 dashboard가 된다.
- footer: Refs: dashboard-project-main-selector-version-sync

## Notes

- minimum rollback stage는 `pgg-refactor`다. `reviews/refactor.review.md`와 refactor stage 기록을 만든 뒤 `pgg-qa`를 다시 실행해야 한다.
- QA gate가 fail이므로 `.codex/sh/pgg-archive.sh dashboard-project-main-selector-version-sync`는 실행하지 않았다.
- UI 상호작용의 실제 화면 검증은 current-project verification contract가 없어 계속 `manual verification required`로 남는다.
