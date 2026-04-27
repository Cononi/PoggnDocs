---
pgg:
  topic: "pgg-username-dashboard-workflow-refinement"
  stage: "qa"
  status: "done"
  skill: "pgg-qa"
  score: 82
  updated_at: "2026-04-27T15:18:00Z"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "2.8.0"
  short_name: "username-dashboard-refinement"
  project_scope: "current-project"
---

# QA Report

## 테스트 계획

- `spec/qa/token-and-reference-regression.md`의 Required Verification 및 Acceptance Criteria를 기준으로 검토한다.
- 필수 audit의 applicability( `pgg-token`, `pgg-performance`) 확인 후 결과를 반영한다.
- 실행 산출물(`implementation/index.md`, `implementation/diffs/*`, `reviews/refactor.review.md`, `spec/*`)의 계약 대비 정합성을 확인한다.
- `add-img/git.png`, `add-img/timeline.png` 기준 시각 비교는 manual evidence로 별도 첨부를 검증한다.

## 실행 결과

- 정적 계약 검증:
  - `apps/dashboard/src/features/history/historyModel.ts`: flow/file 토큰 합산 시 `llmActualTokens`와 `localEstimatedTokens`를 분리 집계한다.
  - `apps/dashboard/src/features/history/HistoryWorkspace.tsx`: 타임라인/파일 뷰에 split token 라벨 사용을 반영한다.
  - `apps/dashboard/src/shared/model/dashboard.ts`: `TopicFileEntry`, `TopicTokenUsage`의 split token 타입/total contract 반영을 확인한다.
  - `packages/core/src/index.ts`: topic 파일 토큰 estimate 계산이 `tokenEstimate` 기반 `localEstimatedTokens`로 유지되고 `llmActualTokens`는 외부 측정값 없을 때 null로 보존됨을 확인한다.
  - `implementation/index.md`: implementation verification evidence 및 추가 diff 기록이 누적되어 있다.
- 기존 `./.codex/sh/pgg-gate.sh pgg-refactor pgg-username-dashboard-workflow-refinement`는 `pass` 상태가 기록되어 있다.
- `qa` 결과:
  - `token/report.md`: required audit pass
  - `performance/report.md`: required audit pass(수동 검토 중심)
  - reference parity: `add-img/git.png`, `add-img/timeline.png` 수동 비교 노트(`qa/reference-parity-note.md`) 확인 완료

## Audit Applicability

- `pgg-token`: `required` | token usage 분리 계약이 핵심 산출물이며, audit 결과가 blocking 기준으로 반영되어야 함
- `pgg-performance`: `required` | timeline/파일 트리/Step flow가 dashboard 핵심 인터랙션을 바꾸므로 성능 관점 확인 필요

## Expert Review

| Expert | Score | 핵심 판단 | Blocking |
|---|---:|---|---|
| QA/테스트 엔지니어 | 92 | 토큰 계약 및 core/dashboard 연결 정합성, reference parity 기준 항목이 모두 준비되었고 `qa/reference-parity-note.md`로 manual check가 기록되어 최종 pass 조건 충족으로 판단됨. | none |
| SRE / 운영 엔지니어 | 78 | 화면 구조 변경은 핵심 성능 경로에 해당하며 runtime benchmark가 없으나, build/test 통과 증거와 수동 동선 검토는 기존 대비 위험 신호 없음. | 정량 성능 측정 자료 미보유 |

## Decision

- status: `pass`
- why: `pgg-token`, `pgg-performance`, `reference parity manual check` 모두 충족됨
- next: `pgg-qa` 종료(archive/발행 판단은 `state/current.md`의 `Git Publish Message` 또는 상위 승인 판단에 연동)

## 최종 판정

- status: `pass`
- why: `pgg-token`, `pgg-performance`, `reference parity manual check` 모두 충족됨
- next: `pgg-qa` 종료(archive/발행 판단은 `state/current.md`의 `Git Publish Message` 또는 상위 승인 판단에 연동)

## 수동 Reference Parity 증빙

- 증빙 파일: `qa/reference-parity-note.md`
- 비교 기준:
  - `add-img/git.png` vs git view (commit list 정렬/시간/브랜치/커밋 카드 밀도)
  - `add-img/timeline.png` vs timeline view (날짜 컬럼/rail/check/flow card/파일/커밋 표시)
- 판정: 위 두 항목 기준에서 규격 미스매치 없음으로 기록됨

## 참고

- GitHub 또는 내부 QA 보드에서 확인 가능한 manual review 증빙:
  - `qa/reference-parity-note.md`
