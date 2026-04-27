---
pgg:
  topic: "pgg-username-dashboard-workflow-refinement"
  stage: "refactor"
  status: "reviewed"
  skill: "pgg-refactor"
  score: 95
  updated_at: "2026-04-27T14:52:14Z"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "2.8.0"
  short_name: "username-dashboard-refinement"
  project_scope: "current-project"
---

# Refactor Review

## 전문가 메모

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 소프트웨어 아키텍트 | 95 | timeline 파일 메타 파생 로직을 `historyModel`로 공통화해 단일 책임이 강화되었고, UI/모델 간 중복이 제거돼 계약 변경 포인트가 줄었다. | 없음 |
| 코드 리뷰어 | 95 | `file` 변경 유형/로컬 토큰 추정치 계산을 한 곳에서 관리함으로써 가독성이 개선되고, 예외 케이스(값 미존재) 처리도 기존 동작을 유지하며 단순해졌다. | 없음 |

## 결정

- refactor status: `reviewed`
- overall score: `95`
- blocking issue: `none`
- next: `pgg-qa`

## 변경 핵심

- `apps/dashboard/src/features/history/historyModel.ts`
  - `inferFileChangeKind()` 추가
  - `fileEstimatedLocalTokens()` 추가
  - `buildTimelineRows()`에서 기존 중복 분기 제거 후 공통 헬퍼 사용
- `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
  - 공통 헬퍼 사용으로 중복 로직 제거
  - 로컬 토큰 총계 계산도 `fileEstimatedLocalTokens`로 정규화

## 검증

- 정적 컴파일/테스트 실행은 이 단계에서 추가하지 않음
- 변경은 순수 순수 파생 값 계산 경로에 국한되어 기존 UI/타임라인 동작 인터페이스는 유지됨

## 리스크

- `historyModel` 공개 API에 두 개의 새 함수가 추가되어 downstream에서의 사용 범위 증가 가능성은 낮으나, 동일 의미로 중복 계산한 외부 사용처는 추후 점진 정리 권장
