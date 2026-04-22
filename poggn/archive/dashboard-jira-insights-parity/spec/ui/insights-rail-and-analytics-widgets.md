---
pgg:
  topic: "dashboard-jira-insights-parity"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-22T14:49:28Z"
reactflow:
  node_id: "spec-insights-rail"
  node_type: "doc"
  label: "spec/ui/insights-rail-and-analytics-widgets.md"
state:
  summary: "우측 Backlog Insights rail과 analytics widget stack 구조를 정의한다."
  next: "task.md 승인"
---

# Insights Rail And Analytics Widgets Spec

## Goal

- `Insights.png`의 우측 docked panel을 현재 dashboard에 맞게 재해석해 `Backlog Insights` rail과 widget stack의 구조, 상태, responsive fallback을 정의한다.

## Rail Structure Requirements

- right rail은 desktop에서 기본 open 상태의 docked panel이어야 한다.
- rail 상단은 `Insights` entry point와 `Backlog Insights` 패널 header를 가져야 한다.
- panel header는 collapse, settings/filter, dismiss에 해당하는 utility affordance를 수용할 수 있어야 한다.
- rail body는 vertical widget stack 구조여야 한다.

## Widget Requirements

- rail은 최소 workload breakdown, backlog trend, sprint progress 계열 widget을 수용해야 한다.
- widget은 title, helper copy, summary metric, chart/list content, optional expand affordance를 가질 수 있어야 한다.
- widget은 current snapshot/recent activity projection으로 계산 가능한 범위 안에서만 metric을 보여 준다.
- metric unavailable 상태에서는 zero-state나 fallback copy를 명시해야 한다.

## Data Interpretation Rules

- workload breakdown은 current pgg topic/stage/archive_type projection을 issue-type style breakdown으로 재해석할 수 있어야 한다.
- backlog trend는 recent activity 또는 topic counts 기반의 time-window summary로 표현할 수 있어야 한다.
- sprint progress 계열 widget은 current domain에 sprint 엔티티가 없더라도 active/archive/status summary를 progress-like aggregate로 표현할 수 있어야 한다.
- widget label은 screenshot의 nomenclature를 그대로 복사하기보다 current pgg domain에 맞게 locale에서 조정해야 한다.

## Interaction Rules

- widget header는 collapse/expand interaction을 수용해야 한다.
- right rail 전체를 닫더라도 insights 진입 affordance는 main shell에 남아야 한다.
- widget filtering이 필요할 경우 shell-level source-of-truth와 충돌하지 않아야 한다.
- static snapshot mode에서도 rail은 read-only summary surface로 동작해야 한다.

## Responsive Rules

- tablet에서는 rail이 collapse 가능한 side sheet 또는 overlay panel로 전환될 수 있어야 한다.
- mobile에서는 default hidden + explicit open affordance를 허용한다.
- rail이 축소되더라도 widget 접근 경로가 사라지면 안 된다.

## Non-Requirements

- full BI dashboard 수준의 분석 엔진 추가
- 서버 측 집계 파이프라인 도입
- custom charting framework 교체
