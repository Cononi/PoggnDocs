---
pgg:
  topic: "dashboard-workflow-timing-sync"
  stage: "add"
  status: "approved"
  skill: "pgg-add"
  updated_at: "2026-04-28T14:16:49Z"
  archive_type: "fix"
  project_scope: "current-project"
---

# Requirements

## 사용자 요청

현재 PGG workflow 진행 방식이 너무 많은 시간을 소비한다.
또한 workflow와 dashboard가 완전히 동기화되지 않아, 어떤 flow는 이미 시작되었는데 dashboard에서는 시작 전으로 표시되고, 시작 또는 완료가 기록되었는데도 제대로 된 시간 측정이 되지 않으며, dashboard가 맞는 flow를 가리키지 않는다.

## 기능 목적

PGG workflow의 실제 event evidence와 dashboard의 workflow 상태, 경과 시간, next/current flow 표시가 같은 source-of-truth를 사용하게 만든다.
사용자는 dashboard만 보아도 각 flow가 시작 전인지, 진행 중인지, 추가 진행이 필요한지, 완료되었는지와 실제 측정 시간이 무엇을 기준으로 계산되었는지 이해할 수 있어야 한다.

## 포함 범위

- `state/history.ndjson`, `state/current.md`, topic artifact, archive evidence가 dashboard workflow 상태로 변환되는 규칙을 재점검한다.
- `stage-started`, `stage-progress`, `stage-completed`, `stage-commit`, `requirements-added`, archive/later-flow evidence가 flow별 상태에 반영되는지 확인한다.
- flow가 시작되었는데 시작 전으로 표시되는 원인을 찾아 시작 evidence와 dashboard current/progress model을 동기화한다.
- flow 시작, 진행, 완료, 추가 진행 상태의 duration 계산 기준을 명확히 하고 dashboard가 같은 기준을 사용하게 한다.
- next flow 또는 current flow 추천이 실제 workflow 상태와 어긋나는 경우를 fixture로 재현하고 수정 대상으로 분리한다.
- workflow가 너무 많은 시간을 소비하는 원인이 불필요한 반복 flow, 잘못된 completion detection, optional audit 오인, generated snapshot 재생성 비용 중 무엇인지 pgg-plan에서 측정 가능한 task로 나눈다.
- regression test 또는 snapshot test로 시작 전, 진행 중, 완료, 추가 진행, wrong-flow routing, duration 계산을 검증한다.

## 제외 범위

- pgg-add 단계에서는 dashboard 구현 코드, 테스트 코드, generated Markdown, runtime 설정을 수정하지 않는다.
- 기존 archive topic의 append-only history를 destructive하게 재작성하지 않는다.
- dashboard 전체 redesign이나 unrelated visual polish는 포함하지 않는다.
- 새로운 core flow를 추가하지 않는다.
- `pgg-performance` 실행 여부는 pgg-plan에서 측정 범위와 비용 대비 효과를 확정한다.

## 가정

- language는 `.pgg/project.json`의 `ko`를 따른다.
- auto mode는 `.pgg/project.json`의 `on`을 따른다.
- teams mode는 `.codex/config.toml`의 `multi_agent = false`에 따라 `teams off`다.
- version source는 `poggn/version-history.ndjson` 최신 archive version이며 currentVersion은 `4.0.1`이다.
- 이번 변경은 dashboard/workflow 동기화와 시간 측정 버그 수정이므로 targetVersion은 `4.0.2`다.
- pgg git mode는 현재 repository의 branch lifecycle 관례에 따라 `on`으로 기록한다.

## 리스크

- dashboard가 core analyzer 결과와 public snapshot을 함께 소비하면 한쪽만 수정했을 때 불일치가 남을 수 있다.
- duration 기준을 명확히 하지 않으면 stage-started부터 완료까지의 wall-clock 시간과 실제 active work time이 혼동될 수 있다.
- optional audit flow가 실제 실행 evidence 없이 표시되면 wrong-flow 문제가 재발할 수 있다.
- completion evidence를 너무 느슨하게 해석하면 시작된 flow가 완료로 오인되고, 너무 엄격하게 해석하면 완료된 flow가 시작 전 또는 진행 중으로 남을 수 있다.
- workflow 시간 단축 요구를 구현 속도 최적화와 상태 모델 수정으로 분리하지 않으면 검증 기준이 흐려질 수 있다.

## pgg-performance 후보

- candidate_required: 사용자가 workflow 시간 소비를 명시했으므로 pgg-plan에서 workflow cycle time과 duration 계산 검증을 별도 측정 task로 둘지 결정해야 한다.
