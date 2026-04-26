---
pgg:
  topic: "dashboard-workflow-tab-status-release-fix"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-24T23:52:49Z"
---

# S1. Workflow Tab Reference

## 목적

`add-img/9.png`를 History workflow tab visual의 기준으로 고정한다.

## 요구사항

- selected tab은 rounded top tab으로 보이고 content panel과 같은 surface로 이어져야 한다.
- selected tab의 bottom border, underline, 선택 색상 줄은 보이지 않아야 한다.
- selected tab의 left/right border는 panel top border segment와 끊김 없이 연결되어야 한다.
- panel top border는 selected tab 바로 아래 구간에서는 보이지 않고, selected tab 바깥 구간에서는 유지되어야 한다.
- inactive tab은 border/background box 없이 text control로 보여야 한다.
- focus outline은 keyboard 접근성을 위해 유지하되 selected bottom line처럼 보이면 안 된다.

## 구현 경계

- 대상 파일: `apps/dashboard/src/features/history/HistoryWorkspace.tsx`
- 주요 후보: `HISTORY_TAB_*`, `buildHistoryTabBounds`, tab `ButtonBase` sx, panel `::before`/`::after`
- `add-img/9.png` 파일 자체는 수정하지 않는다.

## Acceptance

- Overview, Timeline, Relations 각각 selected 상태에서 같은 shape를 유지한다.
- selected tab bottom에는 1px/2px line, underline, shadow seam이 보이지 않는다.
- inactive tab은 hover/focus 전에는 box로 보이지 않는다.
- desktop/mobile에서 tab text가 overflow되지 않는다.
