---
pgg:
  topic: "pgg-username-dashboard-workflow-refinement"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-27T13:14:00Z"
  archive_type: "feat"
  project_scope: "current-project"
---

# Spec: Workflow Overview Token Surface

## Scope

Project Workflow overview에서 Recent Activity를 제거하고 Workflow Progress heading/helper/token total을 표시한다.

## Requirements

- `HistoryWorkspace.tsx` overview 영역의 `Recent Activity` panel을 제거한다.
- Workflow Progress title은 total token을 포함한다.
  - ko: `Workflow Progress (총 사용 토큰 : xxx)`
  - en: `Workflow Progress (Total tokens: xxx)`
- Workflow Progress 밑 helper text를 추가한다.
  - ko copy는 사용자 표현을 보존하되 오탈자는 i18n에서 자연스럽게 다듬을 수 있다.
  - 의미: workflow를 누르면 상세 내용을 볼 수 있다.
- Workflow step click 상세 dialog 동작은 유지한다.
- Task Summary의 Creator/Assignee는 global username을 사용한다.

## Token Accounting

- Token source priority:
  1. 실제 Codex usage evidence가 topic/stage/file에 있으면 사용한다.
  2. `token/report.md`에 측정값이 있으면 사용한다.
  3. deterministic fallback estimate를 사용한다.
- Fallback estimate:
  - `estimatedTokens = ceil(characterCount / 4)`
  - characterCount는 UTF-16 string length가 아니라 file content code point length를 사용한다.
  - binary/reference image는 token 계산 대상에서 제외하고 asset size만 별도 metadata로 둔다.
- Aggregation:
  - file token = 해당 topic file content token
  - flow token = flow에 매핑된 files + flow history event summaries + commit messages
  - topic total token = visible flow totals 합계
- UI는 exact/estimated source를 구분할 수 있는 metadata를 보존해야 한다.

## Acceptance Criteria

- topic total token이 workflow overview heading에 표시된다.
- flow/file token이 timeline spec에서 사용할 수 있는 model로 제공된다.
- fallback estimate는 동일 input에 대해 항상 같은 값을 반환한다.
- Recent Activity panel은 overview 화면에서 사라진다.
