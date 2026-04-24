# S2. Revision Status Model

## 목적

이미 시작되었거나 검토된 workflow stage에 추가 요구사항이 들어온 상황을 `추가 진행` 상태로 분리하고, 완료 직전 상태를 `마무리 중`으로 표현한다.

## 대상

- `apps/dashboard/src/features/history/historyModel.ts`
- 필요 시 `apps/dashboard/src/shared/model/dashboard.ts`

## Status Contract

- 사용자-facing status는 최소 아래 다섯 가지를 표현할 수 있어야 한다.
  - `시작 전`
  - `생성 중`
  - `마무리 중`
  - `완료`
  - `추가 진행`
- `추가 진행`은 stage 자체가 새로 생기는 것이 아니라 기존 stage의 transient revision/update status다.
- `마무리 중`은 active stage가 finishing/finalizing telemetry를 가진 완료 직전 상태다.
- revision/update status 후보 event:
  - `proposal-updated`
  - `plan-updated`
  - `task-updated`
  - `stage-revised`
  - `stage-updated`
  - `requirements-added`
  - `stage-finishing`
  - `stage-finalizing`
- revision status는 이미 started/reviewed/completed evidence가 있는 flow에 추가 user input 또는 update telemetry가 들어온 경우에만 사용한다.
- not-started future flow에는 revision status를 붙이지 않는다.

## Visual Mapping Contract

- `완료`: green, check icon, solid connector
- `생성 중`: blue or cyan, active pulse, generated/current icon
- `마무리 중`: amber accent, active pulse, finishing icon
- `추가 진행`: purple accent, update badge or revised pulse
- `시작 전`: muted gray, dot icon, dotted connector

## Detail Contract

- log modal은 finishing/update status의 근거 event와 timestamp를 표시해야 한다.
- caption은 `마무리 중`, `추가 진행`, 또는 locale equivalent를 표시할 수 있어야 한다.
- count/legend에 revision status가 포함되는 경우 completed/current/pending과 혼동되지 않아야 한다.

## 금지

- revision/update status를 pgg core workflow stage로 추가하지 않는다.
- finishing/update status를 completed로 계산하지 않는다.
- finishing/update status를 generated/current status와 같은 색으로 표시하지 않는다.

## Acceptance

- 이번 topic처럼 완료 후 새 요구사항이 들어오면 대상 flow를 `추가 진행`으로 표시할 수 있다.
- finishing/update status는 `생성 중`, `완료`, `시작 전`과 색/문구/아이콘 또는 badge로 구분된다.
- revision event는 log modal에서 source로 확인할 수 있다.
