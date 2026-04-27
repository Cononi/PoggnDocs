---
pgg:
  topic: "pgg-username-dashboard-workflow-refinement"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-27T13:14:00Z"
  archive_type: "feat"
  project_scope: "current-project"
---

# Spec: Workflow Overview Token Surface

## Scope

Project Workflow overview에서 Recent Activity를 제거하고 Workflow Progress heading/helper/token total을 표시한다.

## Requirements

- `HistoryWorkspace.tsx` overview 영역의 `Recent Activity` panel을 제거한다.
- Workflow Progress title은 LLM 실사용 token과 Local 추정 token을 분리해 포함한다.
  - ko: `Workflow Progress (LLM 실사용 : xxx / Local : xxx)`
  - en: `Workflow Progress (LLM actual: xxx / Local: xxx)`
  - 실제 LLM usage evidence가 없으면 LLM 값은 `기록 없음`/`not recorded`로 표시하고 Local 값과 합산하지 않는다.
- Workflow Progress 밑 helper text를 추가한다.
  - ko copy는 사용자 표현을 보존하되 오탈자는 i18n에서 자연스럽게 다듬을 수 있다.
  - 의미: workflow를 누르면 상세 내용을 볼 수 있다.
- Workflow step click 상세 dialog 동작은 유지한다.
- Task Summary의 Creator/Assignee는 global username을 사용한다.

## Token Accounting

- Token categories:
  - `llmActualTokens`: Codex LLM/API usage evidence 또는 `token/report.md`의 LLM actual 측정값만 사용한다.
  - `localEstimatedTokens`: local file/workflow text를 deterministic fallback으로 계산한 추정값만 사용한다.
  - 두 값은 신규/기존 모든 project topic snapshot에서 별도 field로 유지하며 서로 합산해 단일 "총 사용 토큰"처럼 표시하지 않는다.
- LLM actual source priority:
  1. 실제 Codex usage evidence가 topic/stage/file에 있으면 사용한다.
  2. `token/report.md`에 LLM actual 측정값이 있으면 사용한다.
  3. 없으면 `null`로 유지하고 UI에는 `기록 없음`/`not recorded`로 표시한다.
- Local fallback estimate:
  - `estimatedTokens = ceil(characterCount / 4)`
  - characterCount는 UTF-16 string length가 아니라 file content code point length를 사용한다.
  - binary/reference image는 token 계산 대상에서 제외하고 asset size만 별도 metadata로 둔다.
- Aggregation:
  - file LLM token = 해당 file에 매핑된 LLM actual evidence, 없으면 `null`
  - file Local token = 해당 topic file content local estimate
  - flow LLM token = flow에 매핑된 file/stage LLM actual evidence 합계, 전부 없으면 `null`
  - flow Local token = flow에 매핑된 files + flow history event summaries + commit messages local estimate
  - topic LLM token = visible flow LLM actual 합계, 전부 없으면 `null`
  - topic Local token = visible flow Local totals 합계
- UI와 dashboard model은 exact/estimated source를 구분할 수 있는 metadata를 보존해야 한다.

## Acceptance Criteria

- topic LLM actual token과 Local estimated token이 workflow overview heading에 분리 표시된다.
- flow/file LLM actual token과 Local estimated token이 timeline spec에서 사용할 수 있는 model로 제공된다.
- fallback estimate는 동일 input에 대해 항상 같은 값을 반환한다.
- Recent Activity panel은 overview 화면에서 사라진다.
