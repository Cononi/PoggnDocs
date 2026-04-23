# Current State

## Topic

dashboard-poggn-branding-cleanup

## Current Stage

qa

## Goal

dashboard 브랜딩 정리 구현의 QA를 완료하고 archive 가능 여부를 판단한다.

## Confirmed Scope

- 상단 navigation 브랜드 텍스트를 `POGGN`으로 바꾼다.
- 브라우저 HTML title도 `POGGN`으로 맞춘다.
- `DashboardShellChrome`의 기존 `BrandMark`는 `✨` 기준안으로 교체한다.
- desktop shell의 `AppLauncherMark` 3x3 바둑판 아이콘은 제거한다.
- locale fallback title과 현재 프로젝트의 dashboard title source, 필요한 snapshot surface를 함께 정리한다.
- 변경 범위는 `apps/dashboard`와 current-project 내부 manifest/snapshot source로 제한한다.
- 구현 spec은 `dashboard-brand-shell`, `dashboard-title-surfaces`, `dashboard-branding-source-sync`로 분해한다.
- task는 shell 정리, title 통일, source sync, dirty snapshot 처리, 검증 기록으로 나눈다.
- shell/HTML/locale/manifest 표면은 모두 `POGGN` 기준으로 정리되었다.
- `apps/dashboard/public/dashboard-data.json`은 전체 삭제 상태의 기존 dirty 변경이라 no-op로 유지했고 baseline으로 backfill했다.
- `add-img/`는 topic 범위 밖의 새 unrelated dirty라 governed publish blocker 후보로 남아 있다.
- `pnpm build`가 통과했다.

## Constraints

- project scope: `current-project`
- archive type: `fix`
- version bump: `patch`
- target version: `0.10.2`
- short name: `dashboard-cleanup`
- working branch: `ai/fix/0.10.2-dashboard-cleanup`
- release branch: `release/0.10.2-dashboard-cleanup`
- auto mode: `on`
- teams mode: `off`
- verification contract: `manual verification required`
- topic-start dirty baseline: `.codex/add/WOKR-FLOW.md`, `apps/dashboard/public/dashboard-data.json`
- current unrelated dirty candidate: `add-img/`

## Open Items

- status: ready for `pgg-archive`
- archive publish may block | new unrelated dirty `add-img/` present

## User Question Record

- ref: `proposal.md` -> `## 3. 사용자 입력 질문 기록`

## Audit Applicability

- `pgg-token`: `not_required` | UI 브랜딩과 title source 정리 범위이며 workflow token 구조 변경이 아니다
- `pgg-performance`: `not_required` | 성능 민감 구현이나 verification contract 변경 범위가 아니다

## Active Specs

- `spec/ui/dashboard-brand-shell.md`
- `spec/ui/dashboard-title-surfaces.md`
- `spec/infra/dashboard-branding-source-sync.md`

## Active Tasks

- T-001 done
- T-002 done
- T-003 done
- T-004 done
- T-005 done

## Implementation Index

- ref: `implementation/index.md`

## Verification

- `pnpm build` | pass
- verification contract | `manual verification required`
- governed publish | pending | `add-img/` unrelated dirty review 필요

## Changed Files

| CRUD | path | diff |
|---|---|---|
| CREATE | `poggn/active/dashboard-poggn-branding-cleanup/proposal.md` | 없음 |
| CREATE | `poggn/active/dashboard-poggn-branding-cleanup/plan.md` | 없음 |
| UPDATE | `poggn/active/dashboard-poggn-branding-cleanup/task.md` | 없음 |
| CREATE | `poggn/active/dashboard-poggn-branding-cleanup/implementation/index.md` | 없음 |
| CREATE | `poggn/active/dashboard-poggn-branding-cleanup/spec/ui/dashboard-brand-shell.md` | 없음 |
| CREATE | `poggn/active/dashboard-poggn-branding-cleanup/spec/ui/dashboard-title-surfaces.md` | 없음 |
| CREATE | `poggn/active/dashboard-poggn-branding-cleanup/spec/infra/dashboard-branding-source-sync.md` | 없음 |
| CREATE | `poggn/active/dashboard-poggn-branding-cleanup/reviews/proposal.review.md` | 없음 |
| CREATE | `poggn/active/dashboard-poggn-branding-cleanup/reviews/plan.review.md` | 없음 |
| CREATE | `poggn/active/dashboard-poggn-branding-cleanup/reviews/task.review.md` | 없음 |
| CREATE | `poggn/active/dashboard-poggn-branding-cleanup/reviews/code.review.md` | 없음 |
| UPDATE | `apps/dashboard/src/app/DashboardShellChrome.tsx` | `implementation/diffs/001_UPDATE_apps_dashboard_src_app_DashboardShellChrome_tsx.diff` |
| UPDATE | `apps/dashboard/index.html` | `implementation/diffs/002_UPDATE_apps_dashboard_index_html.diff` |
| UPDATE | `apps/dashboard/src/shared/locale/dashboardLocale.ts` | `implementation/diffs/003_UPDATE_apps_dashboard_src_shared_locale_dashboardLocale_ts.diff` |
| UPDATE | `.pgg/project.json` | `implementation/diffs/004_UPDATE__pgg_project_json.diff` |
| CREATE | `poggn/active/dashboard-poggn-branding-cleanup/state/dirty-worktree-baseline.txt` | 없음 |
| CREATE | `poggn/active/dashboard-poggn-branding-cleanup/qa/report.md` | 없음 |
| UPDATE | `poggn/active/dashboard-poggn-branding-cleanup/state/current.md` | 없음 |
| UPDATE | `poggn/active/dashboard-poggn-branding-cleanup/state/history.ndjson` | 없음 |
| UPDATE | `poggn/active/dashboard-poggn-branding-cleanup/workflow.reactflow.json` | 없음 |

## Last Expert Score

- phase: qa
- score: 94
- blocking issues: 없음

## Git Publish Message

- title: fix: dashboard branding cleanup
- why: dashboard 상단 브랜드명과 홈 타이틀을 POGGN으로 통일하고 불필요한 장식 아이콘을 제거한다
- footer: Refs: dashboard-poggn-branding-cleanup

## Next Action

`pgg-archive`
