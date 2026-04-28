# Repository Guidelines

## Project Identity

- PGG는 범용 AI 에이전트에게 체계적이고 재사용 가능한 소프트웨어 개발 workflow를 가르치는 Skill Framework다.
- PGG는 손으로 작성하는 Markdown 문서 저장소가 아니다.
- 각 PGG flow는 TypeScript Skill 정의로 표현해야 한다.
- 현재 migration은 기존 PGG 시스템의 작은 업데이트가 아니라 전면 재구축이다.

## Source of Truth

- TypeScript Skill 정의가 source of truth다.
- generated Markdown 문서는 손으로 수정하지 않는다.
- 먼저 TypeScript Skill 정의를 수정한다.
- 그 다음 저장소의 기존 documentation generator를 실행한다.
- generated Markdown이 변경되면 generator에서 나온 변경인지 확인한다.

## Detailed Guide

- migration policy, POGGN workspace, git mode, branching, versioning, commit message, token accounting, generated docs, required checks는 `.codex/add/REPOSITORY-GUIDELINES.md`를 읽는다.
- 이 파일은 짧게 유지한다. 장기 운영 정책은 `.codex/add/REPOSITORY-GUIDELINES.md`에 두고 TypeScript에서 생성한다.

## Non-Negotiable Rules

- 이후 Codex 작업은 신규 TypeScript Skill 정의를 기준으로 수행한다.
- 기존 PGG 구현은 신규 Skill Framework에서 명시적으로 재사용하지 않는 한 legacy로 취급한다.
- generated Markdown을 직접 수정하지 않는다.
- 작업이 명시적으로 요구하지 않으면 PGG Skill 정의 본문을 수정하지 않는다.
- 신규 Skill Framework, generated docs, tests, pgg-qa가 통과하기 전 legacy 파일을 삭제하지 않는다.
- public package export와 CLI entry point는 가능하면 신규 core로 routing해 보존한다.

## Target Skills

- pgg-add
- pgg-plan
- pgg-code
- pgg-refactor
- pgg-performance
- pgg-qa

## Generated Docs

- generated Markdown은 기본 한국어다.
- code identifier는 영어를 유지할 수 있다.
- generated Markdown을 patch하지 말고 TypeScript Skill 정의, generator, test를 수정한다.

## Required Checks

`package.json`의 실제 script를 사용한다: `pnpm build`, `pnpm build:readme`, `pnpm build:dashboard`, `pnpm test`, `pnpm test:core`, `pnpm test:dashboard`, `pnpm verify:version-history`.
