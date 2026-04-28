---
pgg:
  topic: "pgg-verify-skill"
  stage: "task"
  status: "approved"
  skill: "pgg-plan"
  score: 90
  updated_at: "2026-04-28T04:07:16Z"
  archive_type: "chore"
  version_bump: "patch"
  target_version: "pending"
  short_name: "verify-skill"
  project_scope: "current-project"
state:
  summary: "pgg-verify skill 구현 task"
  next: "pgg-code"
---

# Task

## Task 목록

| Task ID | Status | Description | Dependencies | Completion Criteria |
|---|---|---|---|---|
| T1 | done | pgg-verify skill 파일을 생성한다. | proposal, plan | `.codex/skills/pgg-verify/SKILL.md`가 존재하고 요청된 검증 항목을 포함한다. |
| T2 | done | skill 계약과 구현 기록을 남긴다. | T1 | spec, implementation index, diff 기록이 생성된다. |
| T3 | done | pgg-verify를 generated standalone skill로 등록한다. | T1,T2 | init/update 생성 계약, dist 산출물, 회귀 테스트가 `pgg-verify`를 포함한다. |

## Audit Applicability

- `pgg-token`: `not_required` | token 산정 로직 변경이 아니다.
- `pgg-performance`: `not_required` | 성능 민감 코드 변경이 아니다.
