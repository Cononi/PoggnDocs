---
pgg:
  topic: "dashboard-audit-flow-i18n-surface"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-27T04:43:54Z"
  archive_type: "feat"
  project_scope: "current-project"
reactflow:
  node_id: "spec-pgg-language-generated-doc"
  node_type: "spec"
  label: "spec/pgg-language/generated-doc-language-contract.md"
state:
  summary: "pgg lang 기반 generated docs/helper 기록 언어 계약"
---

# Spec: Generated Document Language Contract

## Problem

pgg workflow 문서, helper message, commit/publish source text가 일부 위치에서 한국어 또는 영어로 고정되면 `pgg lang` 전환 후에도 산출물 언어가 섞인다. 사용자는 모든 pgg 기능의 flow 기록 문서와 내용이 pgg lang 설정을 따라야 한다고 요구했다.

## Requirements

1. pgg generated 문서와 helper-generated 기록은 `.pgg/project.json`의 `language`를 source-of-truth로 삼아야 한다.
2. `language=ko`이면 새로 생성되는 workflow 문서, state 요약, audit report template, helper summary는 한국어를 사용해야 한다.
3. `language=en`이면 새로 생성되는 workflow 문서, state 요약, audit report template, helper summary는 영어를 사용해야 한다.
4. commit/publish message source는 기존 Git Publish Message Contract와 동일하게 pgg lang을 따라야 한다.
5. language-dependent template은 `packages/core/src/templates.ts` 또는 trusted helper에서 한 곳의 계약으로 관리되어야 한다.
6. 상태 enum, archive type, stage id, event id 같은 machine-readable 값은 번역하지 않는다.

## Acceptance Criteria

- pgg language가 ko인 fixture에서 새 산출물의 사용자-facing 문구가 한국어로 생성된다.
- pgg language가 en인 fixture에서 새 산출물의 사용자-facing 문구가 영어로 생성된다.
- raw metadata 값은 ko/en 전환 후에도 stable id로 유지된다.
- dashboard는 raw metadata를 locale dictionary로 표시한다.

## Non-goals

- 기존 archive 문서 전체를 재번역하지 않는다.
- machine-readable key 이름을 언어별로 바꾸지 않는다.
