---
pgg:
  topic: "dashboard-poggn-branding-cleanup"
  stage: "task"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-23T00:44:14Z"
reactflow:
  node_id: "task"
  node_type: "task"
  label: "task.md"
state:
  summary: "dashboard 브랜딩 정리 구현을 shell, title source, sync, verification 작업으로 분해한다."
  next: "pgg-code"
---

# Task

| ID | Title | Spec Ref | Status | Notes |
|---|---|---|---|---|
| T-001 | dashboard shell header에서 `POGGN` 워드마크, `✨` brand mark, launcher 제거 기준을 구현한다 | `spec/ui/dashboard-brand-shell.md` | done | `DashboardShellChrome.tsx`에서 desktop launcher를 제거하고 brand mark를 emoji로 교체했으며 compact/desktop spacing을 재조정 |
| T-002 | 브라우저 title과 locale fallback title을 `POGGN`으로 통일한다 | `spec/ui/dashboard-title-surfaces.md` | done | `apps/dashboard/index.html`과 `apps/dashboard/src/shared/locale/dashboardLocale.ts`의 기본 title/fallback 문자열을 `POGGN`으로 맞춤 |
| T-003 | current-project dashboard title source를 `POGGN`으로 동기화한다 | `spec/ui/dashboard-title-surfaces.md`, `spec/infra/dashboard-branding-source-sync.md` | done | `.pgg/project.json`의 dashboard title을 `POGGN`으로 변경해 runtime header binding과 search source를 동일한 이름으로 정리 |
| T-004 | static snapshot 또는 generated data surface가 필요한 경우 기존 dirty 변경을 보존하는 방식으로 브랜드 문자열을 동기화한다 | `spec/infra/dashboard-branding-source-sync.md` | done | `apps/dashboard/public/dashboard-data.json`이 전체 삭제 상태의 dirty 파일이라 안전하지 않아 no-op로 유지하고 implementation/state에 근거를 기록 |
| T-005 | 변경 후 live/static 표면과 수동 검증 결과를 기록한다 | `spec/ui/dashboard-brand-shell.md`, `spec/ui/dashboard-title-surfaces.md`, `spec/infra/dashboard-branding-source-sync.md` | done | `pnpm build`를 통과했고 verification contract 미선언 상태는 그대로 `manual verification required`로 유지 |

## Audit Applicability

- `pgg-token`: `not_required` | 구현은 UI 브랜딩과 title source 정리에 한정되며 token audit 대상 구조 변경이 없다
- `pgg-performance`: `not_required` | 성능 민감 구현이나 verification contract 변경이 아니며 build 검증만 수행했다
