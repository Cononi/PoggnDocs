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

# Spec: Global Username

## Scope

전역 username은 사용자 PC에 설치된 pgg 전체에서 공유되는 사용자 식별명이다. 프로젝트별 `.pgg/project.json`에 저장하지 않는다.

## Requirements

- Core는 전역 설정 저장소를 읽고 쓰는 API를 제공해야 한다.
- 저장소는 기존 global registry와 같은 사용자 범위 저장 정책을 따른다.
- username은 Creator, Assignee, Timeline completedBy, dashboard sidebar user card의 기본 표시명으로 사용한다.
- username은 공백만 있는 값을 허용하지 않는다.
- username normalization은 앞뒤 공백 제거만 수행한다. 사용자가 입력한 대소문자와 내부 공백은 보존한다.
- dashboard snapshot은 current global username과 configured 여부를 노출해야 한다.
- project manifest language/auto/teams/git와 username precedence를 섞지 않는다.

## Data Contract

- `globalUser.username`: `string | null`
- `globalUser.configured`: `boolean`
- `globalUser.source`: global pgg user config path 또는 `"missing"`

## Acceptance Criteria

- username이 설정되어 있으면 모든 registered project snapshot에서 같은 값을 읽는다.
- username이 없으면 snapshot은 `null`과 `configured:false`를 반환한다.
- core update API는 invalid username에 대해 명확한 error를 던진다.
- tests cover read missing, update valid, reject empty, preserve display casing.
