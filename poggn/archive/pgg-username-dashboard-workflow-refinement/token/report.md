---
pgg:
  topic: "pgg-username-dashboard-workflow-refinement"
  stage: "token"
  status: "reviewed"
  skill: "pgg-token"
  score: 94
  updated_at: "2026-04-27T14:56:20Z"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "2.8.0"
  short_name: "username-dashboard-refinement"
  project_scope: "current-project"
---

# Token Audit Report

## Audit Applicability

- `pgg-token`: `required`
- 근거: token usage가 dashboard 데이터로 노출되며 flow/file 단위 산정 근거가 변경됨

## Method

- `packages/core/src/index.ts`의 topic 파일 생성/읽기 로직에서 `tokenEstimate`, `localEstimatedTokens`, `llmActualTokens` 채널 확인
- `apps/dashboard/src/features/history/historyModel.ts`의 timeline/flow/file 집계 로직 확인
- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`의 렌더 라우팅 및 표시 경로 확인
- `spec/qa/token-and-reference-regression.md`의 계약(`llmActualTokens` vs `localEstimatedTokens`) 위반 여부 점검

## Findings

- `localEstimatedTokens`는 텍스트 파일 콘텐츠 기반 `estimateTokensFromText` 산출값(`tokenEstimate`)을 기본값으로 사용한다.
  - source: `packages/core/src/index.ts`
- `llmActualTokens`는 현재 snapshot 기본값이 `null`이며, Codex 사용 증거 또는 `token/report.md`의 별도 실제측정값이 있을 때만 대체되어야 한다는 계약을 준수한다.
- `historyModel`의 `buildTimelineRows`는 per-flow/file 수준에서 `llmActualTokens`와 `localEstimatedTokens`를 분리 집계하고, 합산도 분리한다.
- split 계약의 재사용을 위해 `inferFileChangeKind`, `fileEstimatedLocalTokens` 헬퍼가 정규화되어 중복 로직이 감소했다.

## Optimization / 영향

- 계산 비용: 현재 변경은 집계 로직의 helper 공유로 오버헤드가 감소할 여지가 있음.
- 운영 리스크: 외부 LLM 실제 토큰 증거가 아직 없는 경우 `llmActualTokens`가 `null`로 남아 모니터링 정확도는 보수적으로 유지된다.

## 결론

- status: `pass`
- 이유: split token 계약을 위반하지 않고, local/LLM 채널이 모델·UI에서 분리되어 노출된다.
