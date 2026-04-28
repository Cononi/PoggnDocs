---
pgg:
  topic: "pgg-verify-skill"
  stage: "plan"
  status: "approved"
  skill: "pgg-plan"
  score: 90
  updated_at: "2026-04-28T03:47:40Z"
  archive_type: "chore"
  project_scope: "current-project"
---

# pgg-verify Skill Contract

## Acceptance Criteria

### AC1. 테스트 실행 및 통과 확인

Given 구현 결과 검증을 요청받았을 때
When `pgg-verify` skill이 실행되면
Then unit test, integration test, 실패 케이스 테스트의 실행 결과 또는 미실행 사유를 기록해야 한다.

### AC2. Acceptance Criteria 검증

Given spec 또는 task에 Given / When / Then 기준이 있을 때
When 검증 matrix를 만들면
Then 각 기준의 실제 동작 evidence와 요구사항 일치 여부를 기록해야 한다.

### AC3. 경계값과 예외 케이스 검증

Given 입력 또는 응답 경계가 있는 변경일 때
When 검증을 수행하면
Then null / empty, 최대값 / 최소값, 잘못된 입력, 실패 응답을 확인하거나 제외 근거를 기록해야 한다.

### AC4. 로그 기반 검증

Given 테스트 또는 실행 로그가 있을 때
When 검증 결과를 판정하면
Then 에러, 예상치 못한 warning, retry, timeout 여부를 확인해야 한다.

### AC5. 실제 실행 흐름 검증

Given API 호출, 상태 변화, 데이터 변경이 포함된 변경일 때
When 실제 실행 흐름을 검증하면
Then 호출 흐름, 상태 변화 순서, 데이터 일관성 evidence를 기록해야 한다.

### AC6. 간단 성능 체크

Given 응답 시간이나 반복 호출 위험이 있는 변경일 때
When 간단 성능 체크를 수행하면
Then 비정상 응답 시간 증가와 반복 호출 문제 여부를 기록하고 정밀 검증 필요 시 `pgg-performance`로 분리해야 한다.
