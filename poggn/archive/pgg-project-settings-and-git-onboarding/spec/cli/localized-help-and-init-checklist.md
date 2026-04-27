---
pgg:
  topic: "pgg-project-settings-and-git-onboarding"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-27T06:08:10Z"
  archive_type: "feat"
  project_scope: "current-project"
---

# Spec S1: CLI Localized Help And Init Checklist

## Objective

`pgg` CLI가 사용자가 이해할 수 있는 설명을 lang에 맞춰 제공하고, `pgg init`에서 project별 `lang`, `auto`, `teams`, `git` 초기 값을 명시적으로 고르게 한다.

## Requirements

- `pgg` 또는 help 출력은 command list만 보여 주지 않고 각 기능의 목적을 한국어/영어로 설명한다.
- help 설명은 초기화 전에는 기본 언어 또는 명시 flag를 사용하고, 초기화 후에는 `.pgg/project.json`의 `language`를 우선한다.
- `pgg init`은 AI 환경 선택 뒤 language 선택을 먼저 진행한다.
- language 선택 뒤 `auto`, `teams`, `git`을 다중 선택 checklist로 제공한다.
- checklist 항목에는 짧은 설명과 기본 추천 상태가 있어야 한다.
- non-TTY 환경에서는 checklist를 요구하지 않고 명시 flag가 없으면 설명 가능한 오류를 반환한다.
- 기존 flag 기반 init은 계속 동작해야 한다.

## Acceptance Criteria

- `pgg` help에서 `lang`, `auto`, `teams`, `git`, 인증/연동 기능 설명이 lang별로 보인다.
- interactive init에서 사용자가 language와 기능 toggle을 한 번에 이해하고 선택할 수 있다.
- `--lang`, `--auto`, `--teams`, `--git` flags는 interactive 없이 manifest에 반영된다.
- 취소 시점이 git setup 이전이면 init은 명확한 cancelled/no-op 결과를 반환한다.

## Implementation Notes

- `packages/cli/src/index.ts`의 `choose()`와 별도로 다중 선택 helper를 추가한다.
- help 문구는 CLI source 안의 locale dictionary 또는 core shared locale로 분리한다.
- `pgg init`의 provider 선택, language 선택, checklist 선택 순서를 고정한다.
