---
pgg:
  topic: "dashboard-workflow-progress-sync"
  stage: "add"
  status: "approved"
  skill: "pgg-add"
  updated_at: "2026-04-28T13:21:25Z"
  archive_type: "fix"
  project_scope: "current-project"
---

# Requirements

## 사용자 요청

현재 `history.ndjson`에 생성되는 flow evidence와 dashboard project overview의 workflow progress 상태가 서로 동기화되지 않는 것으로 보인다.
또한 신규 PGG Skill Framework로 바뀐 의도와 dashboard가 표현하는 workflow 의미가 다르다.

## 기능 목적

dashboard project overview가 신규 PGG Skill Framework의 상태 계약을 기준으로 workflow progress를 계산하고 표시하게 만든다.
`state/history.ndjson` event, core status model, dashboard overview 표시가 같은 flow 상태 의미를 공유해야 한다.

## 포함 범위

- `state/history.ndjson` event 의미와 dashboard workflow progress 계산 규칙의 불일치 원인을 확인한다.
- `stage-started`, `stage-progress`, `requirements-added`, verified `stage-completed`, `stage-commit`, archive/later-flow evidence가 dashboard에서 같은 상태로 해석되는지 확인한다.
- 신규 PGG Skill Framework에서 의도한 core workflow와 optional audit 표시 규칙이 dashboard project overview에 반영되는지 확인한다.
- project overview의 workflow progress 상태와 topic detail/history timeline 사이의 상태 문구와 계산 기준을 맞춘다.
- regression test 또는 snapshot test로 history event와 overview progress 동기화를 검증한다.

## 제외 범위

- pgg-add 단계에서는 dashboard 구현 코드, 테스트 코드, generated docs를 수정하지 않는다.
- dashboard의 전체 시각 디자인 변경은 포함하지 않는다.
- 신규 workflow stage를 추가하지 않는다.
- `history.ndjson` append-only 원칙을 깨는 migration이나 기존 archive artifact 재작성은 기본 범위가 아니다.

## 가정

- version source는 `poggn/version-history.ndjson`의 최신 archive version이며 currentVersion은 `4.0.0`이다.
- 이번 변경은 사용자-facing dashboard 상태 표시 버그 수정이므로 targetVersion은 `4.0.1`이다.
- 신규 시스템 의도는 `.codex/add/STATE-CONTRACT.md`와 `.codex/add/WOKR-FLOW.md`의 상태 evidence 규칙이다.

## 리스크

- dashboard가 core snapshot과 public snapshot 양쪽에서 데이터를 소비하므로 한쪽만 수정하면 불일치가 남을 수 있다.
- legacy archive topic의 오래된 history event 형태를 모두 새 의미로 해석할 때 regression이 생길 수 있다.
- optional audit flow는 실제 실행 evidence가 있을 때만 표시해야 하므로 `required` applicability와 표시 여부를 혼동하면 다시 mismatch가 생긴다.

## pgg-performance 후보

- not_required: 상태 계산과 UI 의미 동기화 버그 수정이며 성능 요구사항이 없다.
