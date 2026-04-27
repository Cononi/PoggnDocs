---
pgg:
  topic: "dashboard-mobile-routing"
  stage: "plan"
  status: "approved"
  skill: "pgg-plan"
  score: 94
  updated_at: "2026-04-27T08:48:06Z"
  archive_type: "feat"
  project_scope: "current-project"
---

# Spec: Dashboard I18n Coverage

## Purpose

API/snapshot 데이터가 아닌 모든 dashboard 고정 문구를 locale dictionary에 등록해 ko/en 양쪽에서 동일한 UI 기능을 제공한다.

## Current Boundary

- `apps/dashboard/src/shared/locale/dashboardLocale.ts`는 ko/en dictionary와 stage/status label helper를 제공한다.
- 일부 existing copy는 dictionary를 사용하고 있으나, 새 Speed Dial, Bottom Navigation, route repair, selector delete copy가 추가될 예정이다.

## Rules

- API/snapshot에서 오는 project name, root dir, topic name, file content, stage raw value는 번역하지 않는다.
- Button label, tooltip, aria label, dialog title, helper text, status label, error/fallback copy는 dictionary key를 사용한다.
- ko/en dictionary는 같은 key set을 유지한다.
- 새 UI component props는 `DashboardLocale`를 받아 copy를 주입받는다.
- route repair 또는 invalid URL fallback feedback이 화면에 보이면 i18n key를 사용한다.

## Required Key Areas

- Speed Dial: latest project summary, add project, home, project selector, insights
- Bottom Navigation: home, projects, settings
- Project selector delete: delete action, delete tooltip, confirmation title/body
- Route state: invalid route fallback or restored route messages if surfaced
- Stage blocked: `stage-blocked` label and failure helper

## Acceptance

- No new hard-coded user-facing English/Korean UI copy appears in dashboard TSX files except API data rendering.
- ko/en dictionary keys are symmetrical.
- Existing `resolveDashboardStageLabel` behavior remains compatible with new `stage-blocked` status.
