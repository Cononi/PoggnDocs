---
pgg:
  topic: "dashboard-language-ux-settings-overhaul"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-27T12:02:00Z"
  archive_type: "feat"
  project_scope: "current-project"
reactflow:
  node_id: "spec-qa-dashboard-overhaul-verification"
  node_type: "spec"
  label: "spec/qa/dashboard-overhaul-verification.md"
state:
  summary: "dashboard overhaul verification contract"
  next: "pgg-code"
---

# Spec: Dashboard Overhaul Verification

## 자동 검증

1. `pnpm build`가 통과해야 한다.
2. `pnpm test`가 통과해야 한다.
3. core tests는 `pgg lang=ko/en` 신규 topic 문서 언어 계약을 검증해야 한다.
4. workflow status tests는 완료 evidence가 blocked evidence를 해소하는 사례를 검증해야 한다.
5. dashboard build는 settings category panel, SpeedDial action, delete confirmation locale/model compile safety를 검증해야 한다.
6. `pgg-gate.sh pgg-code`, `pgg-gate.sh pgg-refactor`, `pgg-gate.sh pgg-token`, `pgg-gate.sh pgg-qa`가 각 단계에서 통과해야 한다.

## 수동 검증

1. desktop에서 TopNavigation 프로젝트/설정 버튼이 한 줄로 보이는지 확인한다.
2. desktop에서 SpeedDial persistent tooltip과 pgg version 표시를 확인한다.
3. mobile에서 project selector SpeedDial action이 보이고 desktop에서는 보이지 않는지 확인한다.
4. mobile에서 bottom navigation이 사라졌는지 확인한다.
5. mobile에서 workflow progress가 세로로 보이는지 확인한다.
6. Settings category panel에서 category CRUD와 read-only disabled 상태를 확인한다.
7. project add dialog의 input/select 시각 밀도가 맞는지 확인한다.
8. project delete dialog에서 root 삭제 선택 시 두 번째 confirmation이 필요한지 확인한다.
9. Sprint Progress 중복 label이 사라졌는지 확인한다.

## Audit Applicability

- `pgg-token`: `required` | generated workflow 문서 언어와 helper/template output 변경이 있어 token/context audit가 필요하다.
- `pgg-performance`: `not_required` | performance-sensitive runtime path가 아니다.
