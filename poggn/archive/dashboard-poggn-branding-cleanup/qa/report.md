---
pgg:
  topic: "dashboard-poggn-branding-cleanup"
  stage: "qa"
  status: "done"
  skill: "pgg-qa"
  score: 94
  updated_at: "2026-04-23T02:06:45Z"
reactflow:
  node_id: "qa-report"
  node_type: "review"
  label: "qa/report.md"
state:
  summary: "dashboard 브랜딩 정리 구현의 QA와 publish blocker 상태를 기록한다."
  next: "pgg-archive"
---

# QA Report

## Scope

- 상단 브랜드 텍스트, mark, desktop launcher 제거가 spec대로 반영됐는지 확인
- HTML title, locale fallback title, current-project dashboard title source가 `POGGN`으로 정렬됐는지 확인
- current-project build가 계속 통과하는지 확인
- 기존 dirty snapshot과 새 unrelated dirty가 governed publish에 주는 영향을 확인

## Results

| ID | Case | Result | Evidence |
|---|---|---|---|
| QA-001 | shell 브랜드 표면 정리 | pass | `apps/dashboard/src/app/DashboardShellChrome.tsx` |
| QA-002 | title surface 동기화 | pass | `apps/dashboard/index.html`, `apps/dashboard/src/shared/locale/dashboardLocale.ts`, `.pgg/project.json` |
| QA-003 | current-project build | pass | `pnpm build` |
| QA-004 | topic-start dirty baseline backfill | pass | `state/dirty-worktree-baseline.txt` |
| QA-005 | governed publish blocker 확인 | pass | `apps/dashboard/public/dashboard-data.json`은 baseline으로 허용 가능하지만 `add-img/`는 새 unrelated dirty로 남아 있다 |

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| QA/테스트 엔지니어 | 94 | 브랜딩 표면과 title sync는 모두 맞고 build도 통과했다. | 없음 |
| 코드 리뷰어 | 94 | desktop 바둑판 launcher 제거, `POGGN` 통일, `✨` mark 교체는 spec과 implementation index에 맞게 정리됐다. | 없음 |
| SRE / 운영 엔지니어 | 93 | 기존 dirty snapshot은 baseline backfill로 분리했지만 `add-img/`는 여전히 새 unrelated dirty라 governed publish에서 blocker가 된다. | 없음 |

## Decision

- pass

## Residual Risks

- `apps/dashboard/public/dashboard-data.json`은 여전히 사용자 dirty 삭제 상태라 이번 topic에서는 건드리지 않았다.
- `add-img/` untracked path는 이 topic 범위 밖 dirty 상태라 archive publish를 바로 시도하면 governed git publish가 차단될 수 있다.
- current-project verification contract는 선언되지 않아 `manual verification required` 상태다.

## Audit Applicability

- `pgg-token`: `not_required` | UI 브랜딩과 title source 정리 범위이며 workflow token 구조 변경이 아니다
- `pgg-performance`: `not_required` | 성능 민감 구현이나 verification contract 변경 범위가 아니다

## Git Publish Message

- title: fix: dashboard branding cleanup
- why: dashboard 상단 브랜드명과 홈 타이틀을 POGGN으로 통일하고 불필요한 장식 아이콘을 제거한다
- footer: Refs: dashboard-poggn-branding-cleanup
