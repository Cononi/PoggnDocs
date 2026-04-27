---
pgg:
  topic: "pgg-codex-subagent-schema-and-lang-sync"
  stage: "qa"
  status: "done"
  skill: "pgg-qa"
  score: 99
  updated_at: "2026-04-27T04:32:02Z"
---

# QA Report

## Absolute Premise

- "정말 이것이 작동되는 것이 맞나요? 당신이 작동되는게 맞는지 증명해보세요"

## Test Plan

- Codex custom agent 생성물이 공식 standalone schema 필드만 사용하는지 확인한다.
- pgg routing metadata가 `.codex/agents/*.toml` load path 밖의 managed manifest로 보존되는지 확인한다.
- `pgg init`, `pgg update`, `pgg lang` 경로에서 generated agent/routing 문서가 project language를 따르는지 회귀 테스트로 확인한다.
- 현재 workspace의 generated agent files를 migration한 뒤 malformed field warning 원인이 제거됐는지 확인한다.
- archive 전 필수 gate와 프로젝트 검증 명령을 실행한다.

## Execution Results

- `./.codex/sh/pgg-gate.sh pgg-qa pgg-codex-subagent-schema-and-lang-sync`
  - 통과. proposal, plan, task, spec, implementation, review 산출물이 QA 진입 조건을 만족한다.
- `pnpm build`
  - 통과. core package와 dashboard build가 완료됐다. dashboard chunk size warning은 기존 번들 크기 안내이며 이번 schema/lang 변경의 실패 조건이 아니다.
- `pnpm test`
  - 통과. `node --test` 기준 41개 테스트가 모두 pass했다.
- `node packages/cli/dist/index.js update --cwd /config/workspace/poggn-ai`
  - 통과. 현재 workspace generated assets가 새 template 기준으로 갱신됐다.
- `packages/core/test/skill-generation.test.mjs`
  - 통과. `.codex/agents/main.toml` 미생성, `.codex/agents/*.toml`의 unsupported field 제거, `.codex/add/AGENT-ROUTING.toml` 생성, project language 전환 반영을 검증한다.

## Test Evidence

- Codex agent schema: generated role files use `name`, `description`, `developer_instructions`; unsupported `category`, `purpose`, `when_to_use`, `permissions`, `tools`, `handoff`, `escalation`, `activation` fields are not emitted.
- Routing preservation: pgg-specific flow routing metadata is generated at `.codex/add/AGENT-ROUTING.toml`, not under `.codex/agents/`.
- Current asset migration: `.codex/agents/main.toml` was removed and current `.codex/agents/*.toml` files were regenerated without malformed-field warning sources.
- Language sync: regression tests cover Korean and English generated text after project language changes.
- Stage helper regression: deleted ignored candidate paths and ignored topic artifacts are covered by the current test suite.

## Audit Applicability

- [pgg-token]: [not_required] | 이 topic은 schema와 generated document language 동기화 수정이며 token handoff 크기나 예산 전략을 바꾸지 않는다.
- [pgg-performance]: [not_required] | 런타임 성능 경로가 아니라 template generation, migration, validation test 범위다.

## Expert Notes

| Expert | Score | Core Judgment | Evidence Checked | Blocking Issue |
|---|---:|---|---|---|
| QA/테스트 엔지니어 | 99 | malformed agent role warning의 직접 원인과 language sync 회귀가 자동 테스트와 현재 workspace migration으로 모두 검증됐다. | `pnpm test` 41/41 pass, `skill-generation.test.mjs`, current `.codex/agents/*.toml`, `.codex/add/AGENT-ROUTING.toml`을 확인했다. | 없음 |
| SRE / 운영 엔지니어 | 98 | archive 전 gate, build, test, stage helper 회귀가 통과했고 publish metadata가 project language `ko` 규칙을 만족한다. | `pgg-qa` gate, `pnpm build`, `pnpm test`, `pgg-stage-commit.sh` 회귀 테스트, QA publish message를 확인했다. | 없음 |
| 코드 리뷰어 | 98 | routing metadata를 Codex agent schema 밖으로 분리하면서 기존 pgg orchestration 정보는 보존됐다. | `templates.ts`, generated `.codex/add/AGENT-ROUTING.toml`, generated agent role files, implementation diffs를 확인했다. | 없음 |

## Decision

- pass

## Archive Verification

- archive_type: `fix`
- version record: `2.3.3`
- release branch: `release/2.3.3-codex-sync`
- archive allowed: yes

## Git Publish Message

- title: fix: 2.3.3.Codex agent schema 정합성
- why: Codex custom agent 파일과 pgg routing 문서가 공식 schema와 프로젝트 언어 설정을 따르도록 생성 규칙과 검증을 정리했습니다.
- footer: Refs: pgg-codex-subagent-schema-and-lang-sync
