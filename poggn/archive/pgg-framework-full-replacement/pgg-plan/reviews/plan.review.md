---
pgg:
  topic: "pgg-framework-full-replacement"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  updated_at: "2026-04-28T12:30:59Z"
---

# Plan Review

## Software Architect 관점

- 전면 교체 범위를 core, generator, generated docs, CLI/public export, dashboard model, git lifecycle, QA matrix로 분리했다.
- source-of-truth 전환과 legacy compatibility layer를 별도 task로 분리해 blast radius를 낮췄다.
- generated docs 안정성은 generator 2회 실행으로 검증한다.

## Domain Expert 관점

- PGG domain 용어인 flow, active/archive, pgg git, token accounting, completion contract, next flow routing이 각 spec에 보존되어 있다.
- package.json version과 POGGN release ledger versionSource 차이를 명시해 version 혼동 위험을 줄였다.

## Blocking Issues

- 없음.

## Approval

- pgg-code handoff 가능.
