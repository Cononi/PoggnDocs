---
pgg:
  topic: "dashboard-language-ux-settings-overhaul"
  stage: "token"
  status: "reviewed"
  skill: "pgg-token"
  score: 96
  updated_at: "2026-04-27T12:34:17Z"
  archive_type: "feat"
  project_scope: "current-project"
reactflow:
  node_id: "token-report-dashboard-language-ux-settings-overhaul"
  node_type: "audit"
  label: "token/report.md"
state:
  summary: "token audit for generated workflow language and handoff scope"
  next: "pgg-qa"
---

# Token Audit Report

## Applicability

- status: `required`
- reason: `pgg lang`에 따라 helper/template이 생성하는 workflow 문서 skeleton이 변경되었고, state handoff와 generated document 범위가 token 비용에 직접 영향을 준다.
- scope: pgg workflow 문서, helper/template output, state handoff, implementation diff artifact.
- out of scope: dashboard runtime UI bundle size, visual QA, external service 비용.

## Measurements

| item | bytes | words | rough token estimate | note |
|---|---:|---:|---:|---|
| `state/current.md` | 14,393 | 1,437 | 약 3.6k | 다음 단계 handoff의 primary source |
| core docs without diffs | 41,532 | not measured | 약 10.4k | proposal, plan, task, implementation/review/refactor 핵심 문서 |
| spec docs | 15,716 | not measured | 약 3.9k | 7개 spec 합계 |
| implementation diff artifacts | 186,070 | 6,350 | 약 46.5k | generated dist/map diff가 가장 큰 비용 요인 |
| full docs + specs + diffs | 243,318 | not measured | 약 60.8k | 전체 복사 시 예상 상한 |
| `pgg-state-pack.sh` output | 3,511 | 237 | 약 0.9k | refs 중심 minimal handoff |

> rough token estimate는 byte/4 기준의 보수적 근사이며, 한국어/코드/JSON 혼합 문서에서는 실제 tokenizer와 차이가 날 수 있다.

## Cost Drivers

- `implementation/diffs/001_UPDATE_pgg_language_document_contract.diff`: 125,676 bytes. `packages/core/dist/templates.js.map` 한 줄 sourcemap diff가 포함되어 token 비용이 과도하다.
- `implementation/diffs/*.diff`: 전체 186,070 bytes. 다음 stage에서 전체 diff를 prompt에 붙이면 core workflow 문서보다 약 3.25배 크다.
- `state/current.md`: 14,393 bytes. 요구사항과 changed files 누적으로 커졌지만, 여전히 전체 docs+diff 대비 약 94.1% 작다.
- `pgg-state-pack.sh`: 3,511 bytes. 전체 docs+diff 대비 약 98.6% 작고, docs/specs만 복사하는 방식 대비 약 93.9% 작다.
- helper/template localization: `.codex/sh/pgg-new-topic.sh`, `packages/core/src/templates.ts`, generated dist template가 같은 언어 분기 텍스트를 중복 보유한다. 이는 source/runtime/template sync를 위한 중복이며, handoff에는 파일 ref만 전달해야 한다.

## Optimization Actions

| action | evidence | expected result |
|---|---|---|
| 다음 stage handoff는 `state/current.md` 또는 `pgg-state-pack.sh` output을 우선 사용 | state-pack 3,511 bytes | 전체 docs+diff 복사 대비 약 98.6% 감소 |
| diff artifact는 filename/ref만 전달하고, 필요한 경우 특정 diff만 열람 | diff 전체 186,070 bytes | generated dist/map diff가 prompt에 직접 포함되는 것을 방지 |
| generated sourcemap diff는 QA/리뷰에서 기본 미포함, build artifact 검증 evidence로만 취급 | `001` diff 125,676 bytes | 가장 큰 단일 token driver 제거 |
| 신규 workflow skeleton은 localized heading만 유지하고 state parser heading은 English machine-readable heading 유지 | `pgg-new-topic.sh`, `templates.ts` 변경 | helper parser 안정성과 handoff compactness 유지 |
| archive/QA로 넘길 때 full context가 아니라 `refs` + verification summary만 전달 | state-pack refs section | 반복 stage마다 누적 문서 재전송 방지 |

## Result After Optimization

- recommended handoff payload: `pgg-state-pack.sh dashboard-language-ux-settings-overhaul`
- measured payload: 3,511 bytes, 237 words
- full context avoided: 243,318 bytes
- estimated reduction: 약 98.6%
- blocking issue: 없음

## Verification

| command | result | note |
|---|---|---|
| `git diff --check` | pass | whitespace/error 없음 |
| `.codex/sh/pgg-gate.sh pgg-qa dashboard-language-ux-settings-overhaul` | pass | QA gate 조건 충족 |
| `.codex/sh/pgg-stage-commit.sh ... token` | not_supported | helper supports `implementation`, `refactor`, `qa` only |

## Expert Review

### 테크 리드

- score: 96
- 판단: language skeleton 변경은 필요한 범위이며, state parser heading을 machine-readable English로 유지한 결정이 token과 reliability 모두에 유리하다.

### 코드 리뷰어

- score: 96
- 판단: 다음 단계에서 diff 본문을 기본 전달하지 않고 ref만 전달하면 generated dist/map diff로 인한 token 낭비를 피할 수 있다.

## Next Recommendation

`pgg-qa`에서는 `state/current.md`, `token/report.md`, QA spec, 필요한 source file만 열람한다. `implementation/diffs/*.diff` 전체 복사는 피하고, 실패가 발생한 영역의 diff만 선택적으로 연다.
