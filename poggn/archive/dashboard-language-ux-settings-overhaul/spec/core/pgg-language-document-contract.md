---
pgg:
  topic: "dashboard-language-ux-settings-overhaul"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-27T12:02:00Z"
  archive_type: "feat"
  project_scope: "current-project"
reactflow:
  node_id: "spec-core-pgg-language-document-contract"
  node_type: "spec"
  label: "spec/core/pgg-language-document-contract.md"
state:
  summary: "pgg lang 기반 workflow 문서 생성 언어 계약"
  next: "pgg-code"
---

# Spec: PGG Language Document Contract

## 목적

`pgg lang` 설정은 `poggn` 내부에 새로 생성되는 workflow 문서의 기본 본문 언어를 결정해야 한다. CLI/help 문구만 바뀌는 것이 아니라, proposal/state/review/plan/task/spec/QA/audit 문서 생성 경로가 같은 언어 정책을 따라야 한다.

## 요구사항

1. `.pgg/project.json`의 `language`가 `ko`이면 신규 topic의 workflow 문서는 한국어 본문을 기본값으로 생성한다.
2. `.pgg/project.json`의 `language`가 `en`이면 신규 topic의 workflow 문서는 영어 본문을 기본값으로 생성한다.
3. frontmatter key, 파일명, code identifier, helper command, commit title convention 같은 machine-readable 값은 번역하지 않는다.
4. 사용자 원문 질문 기록은 원문 의미를 훼손하지 않는다. 사용자가 한국어로 입력한 문장은 `pgg lang=en`이어도 사용자 입력 기록 섹션에서는 원문으로 보존할 수 있다.
5. 기존 archive 문서와 기존 active topic 문서를 일괄 번역하지 않는다.
6. helper/template output에 hard-coded 한국어/영어가 섞인 경우 새 topic 생성 이후 문서에서 설정 언어가 우선해야 한다.

## 구현 기준

- `pgg-new-topic.sh`는 proposal/review/state placeholder를 `manifest.language`에 맞춰 생성해야 한다.
- `packages/core/src/templates.ts`의 generated helper와 skill 문구는 language-aware template을 유지해야 한다.
- `pgg lang` 변경 이후 `pgg update` 또는 관련 sync가 language-aware generated asset을 재생성하는 기존 동작을 깨지 않아야 한다.
- commit message 언어 검증은 기존 `pgg-stage-commit.sh`, `pgg-git-publish.sh` 계약을 유지한다.

## 테스트 기준

- core test는 `language=ko`와 `language=en` manifest에서 신규 topic skeleton 문서의 주요 heading/body language를 검증한다.
- machine-readable field가 번역되지 않는지 확인한다.
- 사용자 입력 기록이 임의 번역되지 않는다는 점을 문서 계약으로 남긴다.

## 비범위

- 과거 archive 문서 번역.
- 사용자 입력 원문 자동 번역.
- 다국어 UI locale 확장 beyond `ko|en`.
