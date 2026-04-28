---
pgg:
  topic: "pgg-workflow-token-commit-contract"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 97
  updated_at: "2026-04-28T00:47:54Z"
reactflow:
  node_id: "spec-i18n-pgg-lang-documentation-and-comments"
  node_type: "spec"
  label: "spec/i18n/pgg-lang-documentation-and-comments.md"
state:
  summary: "pgg-* 문서와 pgg 생성/수정 코드 주석이 pgg lang을 따르는 계약"
  next: "pgg-code"
---

# Spec: pgg lang 기반 문서와 주석

## 목적

모든 pgg-* flow 산출 문서와 pgg가 생성하거나 수정하는 코드 주석이 `.pgg/project.json`의 `language` 값, 즉 pgg lang을 따르게 한다.

## 현재 동작

- pgg generated 문서와 commit message 일부는 language 값을 사용한다.
- README, skill, helper, template 일부는 한국어/영어 문자열을 갖고 있으나 pgg flow 전반의 문서와 코드 주석까지 강제하는 계약은 명시적이지 않다.
- 사용자는 코드 주석까지 pgg lang에 맞아야 한다고 요구했다.

## 요구사항

1. `pgg-add`, `pgg-plan`, `pgg-code`, `pgg-refactor`, `pgg-qa`, `pgg-token`, `pgg-performance`가 작성하는 문서는 pgg lang을 따른다.
2. pgg가 새로 생성하는 코드 주석은 pgg lang을 따른다.
3. pgg가 기존 코드 주석을 수정하는 경우, 수정된 주석은 pgg lang을 따른다.
4. 사용자가 직접 작성한 기존 코드 주석을 범위 밖에서 일괄 번역하지 않는다.
5. commit message와 history/state 문구도 pgg lang 계약과 충돌하지 않는다.
6. pgg lang이 `ko`이면 문서 본문과 pgg 생성 주석은 한국어, `en`이면 영어로 작성한다.
7. code review와 QA는 pgg 생성/수정 주석 언어 위반을 검토 항목으로 포함한다.

## 구현 기준

- 주요 대상: `AGENTS.md`, `.codex/add/WOKR-FLOW.md`, `.codex/add/STATE-CONTRACT.md`, `.codex/skills/pgg-*.md`, `packages/core/src/templates.ts`, `packages/core/src/readme.ts`, 관련 tests.
- skill 문서의 Rules 또는 Handoff에 pgg lang 문서/주석 계약을 명시한다.
- templates가 생성하는 한국어/영어 문서는 현재 project language에 맞춰야 한다.
- code comment는 새로 추가하거나 수정하는 pgg-managed code comment에만 적용한다.

## 수용 기준

- pgg lang이 `ko`인 현재 topic 산출물은 한국어로 작성된다.
- pgg lang이 `en`인 fixture/update test에서 generated pgg 문서가 영어로 생성된다.
- pgg-code skill이 구현 중 추가/수정한 주석 언어를 pgg lang에 맞추도록 지시한다.
- QA/checklist가 주석 언어 위반을 검토할 수 있다.

## 제외

- 전체 repository 기존 주석 일괄 번역.
- 사용자 애플리케이션 domain 문구의 자동 번역.
