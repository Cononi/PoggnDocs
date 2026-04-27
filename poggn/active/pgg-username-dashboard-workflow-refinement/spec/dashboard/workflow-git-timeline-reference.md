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

# Spec: Workflow Git And Timeline Reference

## Scope

Workflow tab timeline/git UI를 `add-img/git.png`, `add-img/timeline.png` reference 기준으로 정렬한다. 색감은 현재 dashboard 색감을 유지한다.

## Reference Assets

- `add-img/git.png`: git commit panel reference, PNG 1536x1024
- `add-img/timeline.png`: timeline table/tree reference, PNG 1536x1024

## Data Requirements

- Timeline row는 flow 단위다.
- Timeline row 순서는 최신 flow가 위에 오도록 timestamp 내림차순으로 정렬한다.
- Flow title에는 flow LLM actual token과 Local estimated token을 분리 표시한다.
- File row에는 file명 위에 `LLM`과 `Local` token label을 먼저 표시하고, 그 아래 file path/name을 표시한다.
- Git commit 내용은 실제 evidence와 일치해야 한다.
- Commit source priority:
  1. `state/history.ndjson`의 `stage-commit` evidence
  2. `git/publish.json`
  3. implementation/refactor/qa report의 commit evidence field
  4. 없음이면 fake commit을 만들지 않고 empty state 표시
- Commit UI에 표시하는 `hash`, `title`, `author`, `time`은 source payload와 동일해야 한다.
- author가 없고 global username이 있으면 author fallback으로 global username을 사용할 수 있으나, fallback임을 model에서 구분해야 한다.

## Visual Requirements

- Reference와 같은 정보 밀도, column grouping, compact spacing을 목표로 한다.
- 현재 dashboard의 navy/cyan/blue accent tone과 8px 이하 radius 기준을 유지한다.
- Timeline의 flow 연결선은 overview workflow progress처럼 각 flow node를 끊기지 않는 rail로 이어야 한다.
- 완료 check node와 완료 rail은 overview workflow progress의 completed 색상 token(`success.main`/`success.light`)을 사용한다.
- 완료 rail은 check 원을 관통해 보이면 안 되며, 원 내부는 불투명 배경으로 선과 시각적으로 분리한다.
- table/header/body column width는 mobile에서 single-column stack으로 무너지되 text overlap이 없어야 한다.
- long file path와 commit title은 `overflowWrap: anywhere` 또는 equivalent로 깨지지 않아야 한다.

## Acceptance Criteria

- `add-img/git.png` 기준 git panel checklist:
  - commit list/card grouping
  - hash/title/author/time visibility
  - action affordance position
  - compact panel rhythm
- `add-img/timeline.png` 기준 timeline checklist:
  - flow row grouping
  - overview flow와 같은 연속 rail 연결
  - completed check 색상은 overview completed 색상과 일치
  - completed rail does not visually pass through check circles
  - timeline rows are sorted newest first
  - files and commits side-by-side on desktop
  - file tree/detail affordance
  - flow/file token labels are split into LLM actual and Local estimated
  - file token labels appear above the file path/name
- No synthetic commit text is displayed as real evidence.
