---
pgg:
  topic: "dashboard-optional-audit-token-metrics"
  stage: "plan"
  status: "approved"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-27T23:32:03Z"
spec:
  id: "S3"
  title: "Token Usage Ledger"
---

# S3. Token Usage Ledger

## Scope

각 pgg flow 작업과 file artifact 생성/수정/삭제마다 token usage를 기록할 수 있는 topic-local ledger를 정의한다.

## Storage Contract

- 기본 후보 경로: `state/token-usage.ndjson`
- append-only record를 사용한다.
- record는 prompt 전문, completion 전문, 전체 파일 내용을 저장하지 않는다.
- artifact 내용은 path/ref로만 연결한다.

## Record Schema

```json
{
  "ts": "2026-04-27T23:32:03Z",
  "stage": "plan",
  "flow": "pgg-plan",
  "event": "file-created",
  "task": "T1",
  "artifact_path": "plan.md",
  "operation": "create",
  "source": "llm",
  "provider": "openai",
  "model": "unknown",
  "input_tokens": 0,
  "output_tokens": 0,
  "total_tokens": 0,
  "estimated": false,
  "measurement": "actual",
  "notes": "usage metadata unavailable"
}
```

## Required Fields

- `ts`
- `stage`
- `flow`
- `event`
- `artifact_path`
- `operation`: `create | update | delete | read | generate | verify | commit | other`
- `source`: `llm | local`
- `total_tokens`
- `estimated`
- `measurement`: `actual | estimated | unavailable`

## Optional Fields

- `task`
- `provider`
- `model`
- `input_tokens`
- `output_tokens`
- `cached_tokens`
- `reasoning_tokens`
- `bytes`
- `line_count`
- `notes`

## Source Rules

- `source: llm`은 LLM request/response usage metadata가 있거나 LLM-generated artifact로 attribution할 수 있을 때 사용한다.
- `source: local`은 local parser, generator, shell helper, snapshot builder, token estimator가 계산한 비용에 사용한다.
- actual provider usage가 없으면 `estimated: true`, `measurement: estimated`로 기록한다.
- 값을 알 수 없지만 record가 필요한 경우 `total_tokens: 0`, `measurement: unavailable`, `estimated: true`를 사용하고 notes에 이유를 남긴다.

## Acceptance Criteria

- flow 작업 단위 token usage를 stage별로 합산할 수 있다.
- file artifact별 create/update/delete token attribution이 가능하다.
- dashboard는 `llm` actual과 `local` estimated를 섞지 않고 따로 표시할 수 있다.
- token ledger가 없어도 기존 topic snapshot은 깨지지 않고 `not recorded`로 표시된다.
- `pgg-token` audit는 ledger 자체의 크기와 주요 contributor를 평가할 수 있다.
