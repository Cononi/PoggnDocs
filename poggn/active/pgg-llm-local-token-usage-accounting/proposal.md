---
pgg:
  topic: "pgg-llm-local-token-usage-accounting"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 94
  updated_at: "2026-04-28T01:55:28Z"
  auto_mode: "on"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "3.0.1"
  short_name: "llm-accounting"
  working_branch: "ai/fix/3.0.1-llm-accounting"
  release_branch: "release/3.0.1-llm-accounting"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "LLM 생성 산출물 토큰과 local 처리 토큰의 집계 차이를 dashboard와 handoff에서 명확히 드러낸다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

pgg-llm-local-token-usage-accounting

## 2. 변경 분류

- archive_type: `fix`
- version_bump: `patch`
- target_version: `3.0.1`
- short_name: `llm-accounting`
- working_branch: `ai/fix/3.0.1-llm-accounting`
- release_branch: `release/3.0.1-llm-accounting`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- llm 실사용과 local 사용 항목이 있는데 llm은 실제로 만들어주는 내용에 토큰인데 전혀 쌓이지 가 않습니다.
- local 사용은 shell이나 git diff같은 명령어로 사용자 환경에서 만들어낸 사용량인데 불구하고 확연한 차이를 보이지 않습니다.

## 4. 문제 정의

현재 token usage ledger는 `source: "llm"` record가 provider usage metadata를 갖지 못하면 `measurement: "unavailable"`와 `total_tokens: 0`으로 남는다. dashboard는 `usage_metadata_available: true`인 `llm actual` record만 `LLM 실사용`에 합산하므로, 실제로 LLM이 생성한 proposal, plan, implementation, review, report 산출물이 있어도 LLM 사용량이 계속 미기록처럼 보인다.

반대로 local token은 shell, git diff, state-pack, parser, file size measurement처럼 사용자 환경에서 실행된 local 처리 비용이어야 한다. 그러나 dashboard가 ledger가 없거나 충분하지 않은 경우 topic 파일 전체의 token estimate를 local fallback으로 보여 주면, LLM이 만든 문서 산출물과 local command 산출물이 구분되지 않아 두 항목의 의미 차이가 흐려진다.

## 5. 범위

- LLM usage metadata가 없는 `source: "llm"` record도 artifact path가 있으면 해당 산출물의 실제 내용 token estimate를 LLM 생성 산출물 토큰으로 집계한다.
- `usage_metadata_available: true`인 provider actual record는 기존처럼 우선한다.
- local usage는 `source: "local"` ledger record만 합산하며, shell/git diff/state-pack/parser 같은 local evidence와 분리한다.
- topic/file 단위 token summary가 LLM 생성 산출물 토큰과 local 처리 토큰을 동시에 보여 주도록 core snapshot 집계를 수정한다.
- dashboard와 state-pack/handoff summary에서 LLM이 0으로 고정되어 보이는 문제를 줄인다.
- 기존 ledger schema의 append-only 구조와 `llm | local`, `actual | estimated | unavailable` 구분은 유지한다.

## 6. 제외 범위

- 외부 provider billing API 연동.
- prompt 전문, response 전문, 파일 본문 전체를 token ledger에 저장하는 방식.
- provider별 가격표 또는 금액 환산 UI.
- 모든 shell/git command를 자동 계측하는 전역 command wrapper.
- dashboard 전체 정보 구조 재설계.

## 7. 제약 사항

- `state/token-usage.ndjson` record는 prompt나 파일 전문을 복사하지 않고 artifact ref 중심으로 유지한다.
- provider actual usage metadata가 있으면 그 값을 LLM actual 집계의 최우선 근거로 쓴다.
- provider metadata가 없을 때의 LLM 값은 artifact content 기반 산출물 token estimate이며, local command token으로 섞지 않는다.
- local usage는 local record가 있을 때만 증가해야 하며, LLM artifact fallback 때문에 같이 증가하면 안 된다.
- 변경은 current-project 내부의 core snapshot, dashboard model, pgg state-pack/template 계약에 한정한다.

## 8. 기준안

| 항목 | 기준안 | 상태 |
|---|---|---|
| LLM metadata actual | provider usage metadata가 있으면 ledger total을 LLM 실사용에 합산 | resolved |
| LLM artifact fallback | metadata가 없고 artifact path가 있으면 산출물 내용 token estimate를 LLM 생성 토큰으로 합산 | resolved |
| Local isolation | `source: "local"` ledger record만 local 사용량에 합산 | resolved |
| File attribution | file row는 해당 file artifact record 기준으로 LLM/local 값을 분리 표시 | resolved |
| State-pack summary | handoff summary도 raw zero total 대신 LLM/local 차이를 보여 주도록 조정 | resolved |

## 9. 성공 기준

- `source: "llm"`, `measurement: "unavailable"`, `total_tokens: 0`, `artifact_path`가 있는 record는 dashboard snapshot에서 해당 artifact content token estimate를 LLM 값으로 반영한다.
- 위 LLM fallback은 local 사용량을 증가시키지 않는다.
- `source: "local"` record는 local 사용량으로만 집계된다.
- provider actual metadata가 있는 LLM record는 기존처럼 ledger total을 우선 집계한다.
- topic summary와 file summary에서 LLM/local 값이 서로 다른 출처로 계산됨을 테스트로 고정한다.
- state-pack token usage summary가 LLM record의 zero total만 보고 LLM 사용량을 0으로 출력하지 않는다.

## 10. Audit Applicability

- `pgg-token`: `required` | token usage ledger 해석과 dashboard token summary semantics를 바꾸는 topic이다.
- `pgg-performance`: `not_required` | 집계 로직과 표시 semantics 수정이며 별도 성능 민감 path나 performance contract는 없다.

## 11. Git Publish Message

- title: fix: 3.0.1.llm token 집계
- why: LLM이 만든 산출물이 provider usage metadata 부재 때문에 계속 0으로 보이고 local 처리 토큰과 구분되지 않아, artifact 기반 LLM 생성 토큰 fallback과 local ledger 분리 집계가 필요하다.
- footer: Refs: pgg-llm-local-token-usage-accounting

## 12. 전문가 평가 요약

- 프로덕트 매니저: 사용자가 보는 `LLM 실사용`과 `local 사용`은 비용 성격이 다르므로, provider metadata 부재를 이유로 LLM 산출물을 0으로 처리하면 제품 지표의 신뢰가 깨진다.
- UX/UI 전문가: dashboard chip과 file row는 두 값의 차이를 빠르게 읽는 표면이다. LLM 산출물 fallback과 local ledger-only 합산을 분리하면 사용자는 어떤 비용이 모델 생성이고 어떤 비용이 local 처리인지 더 명확히 판단할 수 있다.

## 13. 다음 단계

`pgg-plan`에서 token ledger fallback semantics, file/topic aggregation, state-pack summary propagation, regression test spec으로 나눠 계획과 task를 작성한다.
