---
pgg:
  topic: "dashboard-management-refinement"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 95
  updated_at: "2026-04-23T02:24:55Z"
reactflow:
  node_id: "spec-settings-preferences"
  node_type: "doc"
  label: "spec/ui/settings-title-icon-and-preferences.md"
state:
  summary: "settings의 title/icon, preference, save-less interaction 규칙을 정의한다."
  next: "task.md 승인"
---

# Settings Title Icon And Preferences Spec

## Goal

- settings를 page-level save 방식에서 벗어나 field-level apply와 immediate toggle/select 중심 UX로 재구성하고, dashboard title/title icon/language/theme를 `Main` 패널의 일급 설정으로 정의한다.

## Panel Structure

- settings sidebar는 `Main`, `Refresh`, `Git`, `System` 네 패널을 유지한다.
- 각 패널은 현재처럼 한 화면 전체를 차지하되, 스타일은 `add-img/2.png` 방향으로 정렬한다.
- 패널 간 기능 책임은 유지하되 visual density, select field, section grouping은 재구성할 수 있다.

## Main Panel Requirements

- `dashboard title` 입력 필드와 개별 apply 버튼을 제공해야 한다.
- `title icon SVG` 편집 표면과 preview, apply/reset action을 제공해야 한다.
- title 변경은 shell brand text와 browser `document.title`를 함께 갱신해야 한다.
- title icon 변경은 shell brand mark와 favicon-like browser icon surface를 함께 갱신할 수 있어야 한다.
- language toggle(`ko/en`)와 dark mode toggle을 `Main` 패널에서 조작할 수 있어야 한다.
- language는 project metadata 기반 current-project setting으로 취급하고, dark mode는 local UI preference로 취급해도 된다. 단 source-of-truth 차이는 UI copy나 구현에서 혼동되면 안 된다.

## Refresh, Git, System Panel Requirements

- page-level save 버튼은 제거한다.
- toggle/select control은 즉시 반영한다.
- text/number 입력은 각 field 옆 apply 버튼을 사용한다.
- refresh interval은 field-level apply를 사용하고 invalid input guard를 둔다.
- git prefixes는 auto mode가 `off`이면 disabled state와 reason copy를 보여 줘야 한다.
- system toggles는 live mode에서만 mutation 가능하고 static snapshot에서는 read-only explanation을 보여 줘야 한다.

## Styling Requirements

- settings card/section/radius/select 표면은 현재 dashboard tone과 맞아야 하며 기본 MUI select의 이질감을 줄여야 한다.
- field grouping은 dense 하지만 읽기 쉬워야 한다.
- destructive or high-impact setting은 helper copy와 경계 styling으로 일반 토글과 구분해야 한다.
- icon preview와 title preview는 상단 shell branding과 유사한 형태로 보여 주는 것이 좋다.

## Mutation Rules

- title, title icon, refresh interval, git prefixes는 field-level apply 시점에만 mutation을 보낸다.
- language toggle, dark mode toggle, system toggles는 즉시 반영한다.
- mutation 실패 시 해당 field만 rollback하거나 오류를 표시해야 하며, 다른 field draft까지 초기화하지 않는다.
- current-project 범위 밖 설정이나 전역 시스템 설정은 이번 topic에 포함하지 않는다.

## Non-Requirements

- settings 화면 전체를 비-MUI 디자인 시스템으로 교체하는 것
- global save / cancel 버튼을 다시 도입하는 것
- SVG 외의 일반 이미지 포맷 title icon 업로드 지원
