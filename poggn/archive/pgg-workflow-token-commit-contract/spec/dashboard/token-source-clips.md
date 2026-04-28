---
pgg:
  topic: "pgg-workflow-token-commit-contract"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 97
  updated_at: "2026-04-28T00:47:54Z"
reactflow:
  node_id: "spec-dashboard-token-source-clips"
  node_type: "spec"
  label: "spec/dashboard/token-source-clips.md"
state:
  summary: "dashboard token 표시를 LLM clip과 Local clip으로 분리하는 UI 계약"
  next: "pgg-code"
---

# Spec: Token Source Clip 표시

## 목적

Workflow Progress와 timeline/file preview에서 token 값을 `LLM`과 `Local` 별도 clip으로 표시해 요금성 actual 지표와 local processing 지표를 혼동하지 않게 한다.

## 현재 동작

- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`의 title은 `workflowProgressTitleWithSplitTokens`로 `Workflow Progress (LLM 실사용 : {llm} / Local : {local})` 형식의 결합 문장을 만든다.
- timeline row와 file preview는 이미 chip 두 개를 쓰지만 label/값 의미가 source measurement와 충분히 분리되어 있지 않다.
- `apps/dashboard/src/shared/locale/dashboardLocale.ts`에는 결합 title 문구가 남아 있다.

## 요구사항

1. Workflow Progress heading에서 token 값은 title 문자열 안에 결합하지 않는다.
2. LLM token과 Local token은 별도의 `Chip` 또는 동등한 clip UI로 표시한다.
3. LLM actual 값이 없으면 `기록 없음`을 숫자 `0`처럼 보이지 않게 표시한다.
4. Local 값은 Local source 합계 또는 fallback estimate임을 label에서 드러낸다.
5. timeline row, file preview, artifact/token summary도 동일한 clip label과 formatting helper를 사용한다.
6. 한국어/영어 locale 모두 결합 문구 대신 source별 label을 제공한다.
7. clip은 모바일 폭에서 wrapping되더라도 title이나 process track을 밀어 겹치게 만들지 않는다.

## 구현 기준

- 주요 대상: `apps/dashboard/src/features/history/HistoryWorkspace.tsx`, `apps/dashboard/src/shared/locale/dashboardLocale.ts`.
- `workflowProgressTitleWithSplitTokens`는 제거하거나 더 이상 사용하지 않는다.
- source별 clip label은 `llmActualTokens`, `localEstimatedTokens` 또는 더 명확한 locale key를 사용한다.
- `formatTokenValue(null)`은 LLM actual unavailable 상태로 표시하고 요금 지표로 오해되는 `0`을 반환하지 않는다.
- title은 순수 section title로 두고, token clips는 제목 옆 또는 아래의 compact row에 둔다.

## 수용 기준

- UI 문자열에 `(LLM 실사용 : 기록 없음 / Local : 0)` 형태가 나타나지 않는다.
- LLM과 Local은 독립 chip으로 렌더링된다.
- 모바일에서 chip wrap 후에도 Workflow Progress process 영역과 겹치지 않는다.
- locale snapshot 또는 테스트가 한국어/영어 key를 모두 갱신한다.

## 제외

- token 가격 계산 UI.
- provider/model별 상세 drilldown.
