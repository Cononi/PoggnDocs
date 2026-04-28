---
pgg:
  topic: "pgg-verify-skill"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 90
  updated_at: "2026-04-28T04:07:16Z"
  auto_mode: "on"
  archive_type: "chore"
  version_bump: "patch"
  target_version: "3.0.6"
  short_name: "verify-skill"
  working_branch: "ai/chore/3.0.6-verify-skill"
  release_branch: "release/3.0.6-verify-skill"
  project_scope: "current-project"
state:
  summary: "pgg-verify skill을 추가한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

pgg-verify-skill

## 2. 변경 분류

- archive_type: `chore`
- version_bump: `patch`
- target_version: `3.0.6`
- short_name: `verify-skill`
- working_branch: `ai/chore/3.0.6-verify-skill`
- release_branch: `release/3.0.6-verify-skill`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- pgg-verify 스킬만 만들어주세요.
- 테스트 실행 및 통과 확인: unit test, integration test, 실패 케이스 테스트
- Acceptance Criteria 검증: Given / When / Then 기준 검증, 요구사항과 실제 동작 일치 여부 확인
- 경계값 예외 케이스 검증: null / empty, 최대값 / 최소값, 잘못된 입력, 실패 응답
- 로그 기반 검증: 에러 로그, 예상치 못한 warning, retry / timeout 발생 여부
- 실제 실행 흐름 검증: api 호출 흐름, 상태 변화, 데이터 일관성
- 간단한 성능 체크: 응답 시간 이상 여부, 반복 호출 시 문제 없는지

## 4. 범위

- `.codex/skills/pgg-verify/SKILL.md`를 새로 만든다.
- 기존 core workflow, optional audit 정의, 다른 pgg skill은 수정하지 않는다.
- `pgg-token-accounting-and-reactflow-retirement`가 `3.0.5`로 archive된 뒤 이 topic의 publish metadata는 `3.0.6`으로 확정한다.

## 5. 성공 기준

- 새 skill frontmatter에 `name`과 `description`이 있다.
- skill 본문에 요청된 6개 검증 영역이 모두 포함된다.
- skill은 선언된 verification contract가 없을 때 임의 테스트 명령을 추론 실행하지 않도록 지시한다.
