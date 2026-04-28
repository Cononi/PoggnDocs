---
pgg:
  topic: "pgg-verify-skill"
  stage: "plan"
  status: "approved"
  skill: "pgg-plan"
  score: 90
  updated_at: "2026-04-28T03:47:40Z"
  archive_type: "chore"
  version_bump: "patch"
  target_version: "pending"
  short_name: "verify-skill"
  project_scope: "current-project"
state:
  summary: "pgg-verify skill 추가 계획"
  next: "pgg-code"
---

# Plan

## 목표

요청된 검증 checklist를 Codex skill로 사용할 수 있게 `.codex/skills/pgg-verify/SKILL.md`에 절차와 보고 기준을 정의한다.

## 접근

- 기존 pgg skill의 frontmatter와 문체를 따른다.
- 검증 skill은 구현 변경을 주도하지 않고 evidence 기반 판정을 남기는 역할로 제한한다.
- 테스트 명령은 current-project verification contract를 우선하고, 없으면 manual verification required를 기록한다.

## 산출물

- `.codex/skills/pgg-verify/SKILL.md`
- `poggn/active/pgg-verify-skill/spec/verification/pgg-verify-skill-contract.md`
- `poggn/active/pgg-verify-skill/implementation/index.md`
- `poggn/active/pgg-verify-skill/implementation/diffs/001_CREATE__codex_skills_pgg-verify_SKILL_md.diff`

## Audit Applicability

- `pgg-token`: `not_required` | token 산정 로직 변경이 아니다.
- `pgg-performance`: `not_required` | 성능 민감 코드 변경이 아니다.
