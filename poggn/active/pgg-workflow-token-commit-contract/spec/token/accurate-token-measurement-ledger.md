---
pgg:
  topic: "pgg-workflow-token-commit-contract"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 97
  updated_at: "2026-04-28T00:47:54Z"
reactflow:
  node_id: "spec-token-accurate-token-measurement-ledger"
  node_type: "spec"
  label: "spec/token/accurate-token-measurement-ledger.md"
state:
  summary: "LLM actual과 Local token source를 요금 지표로 안전하게 분리하는 ledger 계약"
  next: "pgg-code"
---

# Spec: 정확한 Token 측정 Ledger

## 목적

각 pgg workflow에서 token usage를 요금 계산 지표로 사용할 수 있게 `llm`과 `local` source, `actual`/`estimated`/`unavailable` measurement를 엄격히 분리한다.

## 현재 동작

- `packages/core/src/index.ts`는 `state/token-usage.ndjson`를 읽어 `llmActualTokens`와 `localEstimatedTokens`를 집계한다.
- 현재 ledger schema에는 `source`, `measurement`, `estimated`, `provider`, `model`, token fields가 있으나, 실제 기록 주체와 요금용 actual 인정 기준이 더 명확해야 한다.
- ledger fallback은 local file text estimate를 사용하므로 LLM actual과 local estimate가 사용자에게 같은 의미로 보일 수 있다.

## 용어

- LLM actual: Codex response usage metadata에서 제공된 실제 token 값이다. 요금 계산용 actual 합계에 포함할 수 있다.
- LLM unavailable: LLM 작업이 있었지만 Codex response usage metadata를 얻지 못한 상태다. 요금용 actual 합계에 포함하지 않는다.
- Local: shell 실행, CLI 실행, local parser/generator/helper, file scan, build output 처리처럼 Codex 응답이 아닌 사용자 시스템 실행에서 만들어진 token 또는 token-equivalent processing 값이다.
- Estimated: byte/line/text 기반 추정값이다. 요금용 actual 값으로 표기하지 않는다.

## 요구사항

1. `source: "llm"` record는 Codex response usage metadata가 있을 때만 `measurement: "actual"`, `estimated: false`가 될 수 있다.
2. usage metadata가 없는 LLM record는 `measurement: "unavailable"`로 남기고 `total_tokens`가 있더라도 요금용 actual 합계에 포함하지 않는다.
3. `source: "local"` record는 shell/CLI/local helper 실행에서 발생한 token-equivalent processing 값만 포함한다.
4. Local record가 추정치이면 `measurement: "estimated"`와 `estimated: true`를 명시한다.
5. ledger record는 stage, flow, event, task, artifact path, operation, source, measurement, provider/model, token fields, notes를 유지한다.
6. topic/file summary는 LLM actual과 Local을 별도 합계로 제공하고, source가 다른 값을 단일 total 의미로 강조하지 않는다.
7. parser는 잘못된 record를 무시하되, QA/token audit에서 malformed record count 또는 parse failure를 검증할 수 있어야 한다.
8. `pgg-token` audit는 이번 topic에서 required이며 ledger coverage와 source 분리를 검증해야 한다.

## 구현 기준

- 주요 대상: `packages/core/src/index.ts`, `apps/dashboard/src/shared/model/dashboard.ts`, `packages/core/test/dashboard-token-usage.test.mjs`.
- `sumActualLlmTokenRecords`는 `source=llm`, `measurement=actual`, `estimated=false`, usage metadata 기반 record만 집계해야 한다.
- `sumLocalTokenRecords`는 `source=local`만 집계하고 LLM unavailable을 local로 fallback하지 않는다.
- `TopicTokenUsage.total`의 의미가 source 혼합 총량이면 UI에서 요금 지표로 쓰지 않도록 model 또는 display contract를 보강한다.
- token audit report는 LLM actual unavailable과 Local estimated를 구분해 남긴다.

## 수용 기준

- LLM actual record 1개와 LLM unavailable record 1개가 있을 때 actual 합계는 actual record만 반영한다.
- Local estimated record는 Local clip/summary에만 반영되고 LLM actual 합계에 들어가지 않는다.
- ledger가 없는 topic은 기존 local estimate fallback을 유지하되 LLM actual은 `null` 또는 unavailable으로 유지한다.
- dashboard snapshot/test가 source별 합계와 record count를 검증한다.

## 제외

- 외부 billing API 연동.
- provider별 가격표 또는 금액 환산.
