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
- Timeline row 순서는 실제 pgg workflow 순서(`Add -> Plan -> Code -> Refactor -> Token -> Performance -> QA -> Done`)를 따른다.
- Flow title에는 flow LLM actual token과 Local estimated token을 분리 표시한다.
- File row에는 file명 위에 `LLM`과 `Local` token label을 먼저 표시하고, 그 아래 file path/name을 표시한다.
- Timeline card의 생성 파일 목록은 flow당 최대 3개만 직접 표시한다.
- Timeline card의 생성 파일 row는 preview modal을 열지 않는다.
- 우측 file tree의 file row를 클릭하면 modal로 file content를 볼 수 있어야 하며 modal에는 해당 file의 LLM actual token과 Local estimated token을 표시한다.
- Timeline에 표시되는 시간은 file mtime이 아니라 해당 flow의 completion evidence(`stage-commit`, verified `stage-completed`, trusted node completion, release completion)를 우선 사용한다.
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
- Timeline의 flow 연결선은 overview workflow progress처럼 개별 row 선분이 아니라 단일 수직 rail로 각 flow node를 끊기지 않게 이어야 한다.
- 완료 check node와 완료 rail은 overview workflow progress의 completed 색상 token(`success.main`/`success.light`)을 사용한다.
- 완료 check node의 배경/테두리/그림자 처리는 overview completed node와 같은 스타일을 사용한다.
- 완료 rail은 check 원을 관통해 보이면 안 되며, 현재 원의 외곽 ring 하단에서 시작해 다음 원의 외곽 ring 상단에 딱 맞게 닿아야 한다.
- Timeline header의 filter, show more, collapse action button은 제거한다.
- 우측 file tree는 folder row 자체를 클릭해 접고 펼칠 수 있어야 한다.
- Timeline card의 `모든 파일 보기` action은 timeline card 내용을 더 펼치지 않고, 우측 file tree를 해당 flow에서 생성/수정한 file 목록으로 전환한다.
- 우측 file tree는 초기 상태에서 topic 전체 file을 보여준다.
- 우측 file tree가 flow file 목록 또는 검색 결과로 좁혀진 경우 검색창 옆에 reset button을 표시하고, 기존 table/list icon button은 표시하지 않는다.
- 우측 file tree file row에는 LLM/Local token chip을 표시하지 않는다. token은 timeline card file row와 file content modal에서만 표시한다.
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
  - overview flow와 같은 단일 연속 rail 연결
  - completed check 색상은 overview completed 색상과 일치
  - completed check visual treatment matches the overview completed node
  - completed rail touches the circle outer ring exactly without overshooting or leaving a gap
  - timeline rows follow the actual pgg workflow order
  - displayed timeline time comes from flow completion evidence
  - no filter/show more/collapse buttons in the timeline header
  - right file tree folders expand/collapse on folder row click
  - timeline file action changes the right file tree to selected flow files
  - timeline card generated files are capped at 3 rows per flow
  - initial right file tree shows all topic files
  - reset button restores the all-topic file tree and clears search/flow filtering
  - no table/list icon buttons next to file search
  - clicking a right file tree file opens a modal with file content and LLM/Local token usage
  - clicking a generated file in the timeline card does not open preview
  - right file tree rows do not show LLM/Local token chips
  - files and commits side-by-side on desktop
  - file tree/detail affordance
  - flow/file token labels are split into LLM actual and Local estimated
  - file token labels appear above the file path/name
- No synthetic commit text is displayed as real evidence.
