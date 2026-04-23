---
pgg:
  topic: "dashboard-poggn-branding-cleanup"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 95
  updated_at: "2026-04-23T00:41:08Z"
  auto_mode: "on"
  archive_type: "fix"
  version_bump: "patch"
  target_version: "0.10.2"
  short_name: "dashboard-cleanup"
  working_branch: "ai/fix/0.10.2-dashboard-cleanup"
  release_branch: "release/0.10.2-dashboard-cleanup"
  project_scope: "current-project"
reactflow:
  node_id: "proposal"
  node_type: "doc"
  label: "proposal.md"
state:
  summary: "dashboard 상단 브랜드명을 POGGN으로 통일하고 장식 아이콘을 정리하는 UI fix 범위를 proposal로 확정한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

dashboard-poggn-branding-cleanup

## 2. 변경 분류

- archive_type: `fix`
- version_bump: `patch`
- target_version: `0.10.2`
- short_name: `dashboard-cleanup`
- working_branch: `ai/fix/0.10.2-dashboard-cleanup`
- release_branch: `release/0.10.2-dashboard-cleanup`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- "`$pgg-add 네비게이션에 poggn dashboard인데 POGGN으로 바꿔주시고 홈페이지 타이틀도 POGGN, 그리고 옆에 이모티콘좀 예쁜걸로 바꿔주시고 바둑판 모양도 제거해주세요.`"

## 4. 왜 하는가

- 현재 dashboard 상단 셸은 locale fallback, project manifest title, HTML `<title>`, 브랜드 마크가 서로 다른 표면에 흩어져 있어 `pgg dashboard`와 `poggn dashboard`가 혼재한다.
- 사용자가 보는 첫 화면에서 브랜드명이 소문자/복합 명칭으로 노출되고, 3x3 바둑판 런처 아이콘이 실제 제품 정체성과 무관하게 보이면서 헤더가 산만해진다.
- 이번 요청은 새 기능 추가가 아니라 브랜드 표기 일관성과 시각적 집중도를 높이는 UI 정리이므로 `fix`/`patch` 범위가 적절하다.

## 5. 무엇을 할 것인가

- dashboard 상단 navigation 브랜드 텍스트를 `POGGN`으로 통일한다.
- 브라우저/홈페이지 `<title>`도 `POGGN`으로 맞춘다.
- 현재 custom `BrandMark`를 더 간결하고 보기 좋은 단일 emoji mark로 교체한다. 기준안은 `✨` + `POGGN` 조합이다.
- desktop shell의 `AppLauncherMark` 3x3 바둑판 아이콘은 제거한다.
- locale fallback title, 현재 프로젝트 dashboard title source, 정적 snapshot surface가 모두 같은 브랜드명을 쓰도록 정리한다.

## 6. 범위

### 포함

- `apps/dashboard/src/app/DashboardShellChrome.tsx`의 브랜드 텍스트/브랜드 mark/런처 mark 정리
- `apps/dashboard/index.html`의 HTML title을 `POGGN`으로 변경
- `apps/dashboard/src/shared/locale/dashboardLocale.ts`의 fallback title 문자열 정리
- `.pgg/project.json` 및 snapshot title source가 현재 헤더와 같은 브랜드명을 내도록 후속 plan 범위에 포함
- compact shell과 일반 shell 모두에서 브랜드 표면이 자연스럽게 보이도록 기준 고정

### 제외

- dashboard 전체 레이아웃 재설계
- 컬러 테마, 타이포그래피 시스템, 보드 구조 변경
- 프로젝트별 커스텀 title 편집 UX 재설계
- 신규 메뉴, 신규 아이콘 세트, 애니메이션 추가

## 7. 제약 사항

- 구현 범위는 `current-project` 내부 dashboard 표면과 로컬 manifest/snapshot source까지만 다룬다.
- 현재 dirty 상태인 `apps/dashboard/public/dashboard-data.json`은 기존 변경을 덮어쓰지 않도록 주의하면서 반영 범위를 판단해야 한다.
- `auto mode`가 `on`이므로 "예쁜 이모티콘"의 기준안은 proposal에서 선결정한다.
- 바둑판 제거 후 헤더 정보 위계가 깨지지 않도록 desktop/compact shell 모두에서 spacing을 다시 맞춰야 한다.

## 8. auto mode 처리

- poggn auto mode: `on`
- auto mode가 `on`이므로 브랜드명은 `POGGN`, 대표 emoji는 `✨`, 바둑판 아이콘은 완전 제거 기준으로 확정한다.

## 9. 기준안

| 항목 | 기준안 | 상태 |
|---|---|---|
| navigation 브랜드명 | 상단 브랜드 텍스트는 어디서 렌더되든 `POGGN`만 노출한다. | resolved |
| 홈페이지 타이틀 | `apps/dashboard/index.html`의 `<title>`도 `POGGN`으로 맞춘다. | resolved |
| 브랜드 이모지 | 기존 polygon `BrandMark` 대신 `✨`를 사용한다. | resolved |
| 바둑판 모양 | `AppLauncherMark` 3x3 아이콘은 제거하고 별도 대체 아이콘은 두지 않는다. | resolved |
| title source 정합성 | locale fallback, manifest/snapshot title, shell header binding이 같은 이름을 쓰게 정리한다. | resolved |

## 10. 성공 기준

- dashboard 헤더와 브라우저 title에서 `pgg dashboard` 또는 `poggn dashboard`가 더 이상 보이지 않고 `POGGN`만 보인다.
- 상단 브랜드 왼쪽에 현재의 기하학적 mark 대신 단일 emoji가 보인다.
- desktop shell에서 3x3 바둑판 아이콘이 제거되어도 헤더 탐색 구조가 어색하지 않다.
- 후속 `pgg-plan`이 문자열 변경, mark 교체, launcher 제거, snapshot/title source 정리 작업으로 바로 분해될 수 있다.

## 11. 전문가 평가 요약

- 프로덕트 매니저: 요구사항이 브랜드 표면 정리와 장식 제거에 집중되어 있어 `fix` 범위로 분류한 판단이 적절하다.
- UX/UI 전문가: `POGGN` 단일 워드마크와 `✨` 기준안, launcher 제거 조합이 현재 헤더를 가장 간결하게 만든다.
- 도메인 전문가: manifest title, locale fallback, HTML title를 함께 정리해야 실제 dashboard 실행 결과가 일관된다.

## 12. 다음 단계

`pgg-plan`에서 `brand-shell`, `title-source`, `snapshot-sync` 단위로 spec/task를 분리한다.
