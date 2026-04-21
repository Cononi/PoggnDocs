---
pgg:
  topic: "dashboard-renewal"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-21T15:55:16Z"
reactflow:
  node_id: "spec-dashboard-topic-artifact-snapshot"
  node_type: "doc"
  label: "spec/infra/dashboard-topic-artifact-snapshot.md"
state:
  summary: "recent archive 포맷을 반영한 topic/artifact snapshot 계약을 정의한다."
  next: "task.md 승인"
---

# Dashboard Topic Artifact Snapshot Spec

## Goal

- 최근 archive topic 폴더의 반복 구조를 project/topic/artifact projection으로 정규화해 dashboard가 직접 파일 시스템을 탐색하지 않아도 필요한 메타데이터를 읽을 수 있게 한다.

## Source Rules

- analyzer는 `poggn/active/<topic>`과 `poggn/archive/<topic>`를 읽되 current-project 범위만 다룬다.
- topic summary의 1순위 근거는 `state/current.md`다.
- artifact 존재 여부와 detail payload는 `proposal.md`, `plan.md`, `task.md`, `state/current.md`, `reviews/*`, `spec/*/*.md`, `implementation/*`, `qa/*`, `version.json`, `workflow.reactflow.json`, `state/history.ndjson`를 기준으로 계산한다.
- client는 snapshot 외에 로컬 파일 직접 접근을 시도하지 않는다.

## Topic Projection

- active topic projection은 `name`, `stage`, `goal`, `nextAction`, `score`, `blockingIssues`, `status`, `workflow`, `artifactSummary`, `updatedAt`을 최소 필드로 가진다.
- archive topic projection은 active projection 필드에 더해 `archiveType`, `version`, `archivedAt`, `qaStatus`, `artifactCompleteness`를 포함해야 한다.
- `archiveType`은 proposal frontmatter 또는 version metadata에서 복원한다.

## Artifact Summary Contract

- artifact summary는 group 단위로 `count`, `missingRequired`, `latestUpdatedAt`, `primaryRef`를 가진다.
- required group은 lifecycle docs, review docs, workflow다.
- optional group은 implementation, qa, release metadata다.
- missing required artifact가 있으면 topic health는 `partial` 이상으로 표시해야 한다.

## Detail Payload Contract

- artifact detail payload는 `kind`, `title`, `sourcePath`, `content`, `contentType`, `updatedAt`을 가진다.
- markdown과 diff는 raw text를 그대로 보존한다.
- 큰 파일은 추후 최적화 대상이더라도 현재는 최근 topic 기준 읽기 가능한 범위의 payload를 제공한다.

## Ordering Rules

- active topic은 `state/current.md`의 stage와 updated 시각 기준으로 운영 우선순위를 계산할 수 있어야 한다.
- archive topic은 `archivedAt` 내림차순으로 정렬 가능해야 한다.
- project card의 recent archive 요약은 상위 N개 archive topic projection에서 계산한다.

## Non-Requirements

- archive topic 자동 복구
- 원격 저장소 동기화
- 대용량 artifact chunk streaming
