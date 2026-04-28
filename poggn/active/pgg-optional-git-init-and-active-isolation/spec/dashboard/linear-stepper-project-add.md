---
pgg:
  topic: "pgg-optional-git-init-and-active-isolation"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-28T04:44:32Z"
state:
  summary: "dashboard project add 모달을 Linear Stepper 입력 흐름으로 전환한다."
  next: "pgg-code"
---

# Spec S2: dashboard Linear Stepper project add

## 목적

dashboard에서 프로젝트 추가 시 모든 입력을 한 화면에 받지 않고, MUI Material Linear Stepper 방식으로 경로 확인부터 git 선택과 최종 등록까지 순차적으로 진행하게 한다.

## 현재 동작

- `DashboardApp.tsx`는 Stepper를 import하고 project add dialog에 Stepper를 표시한다.
- 현재 Stepper는 상태 표시 성격이며, root dir, username, language, git setup path, auto/teams/git mode, category가 같은 입력 패널에 동시에 렌더링된다.
- `handleCreateProject`는 `projectInitGitMode === "on"`일 때만 `gitSetup`을 만든다.

## 요구사항

1. project add dialog는 active step state를 가져야 한다.
2. Stepper는 Linear 흐름으로 동작하며, 사용자는 현재 step의 입력을 확인한 뒤 다음 step으로 이동한다.
3. 최소 step은 `폴더 확인`, `기본 설정`, `Git 선택`, `카테고리 및 확인`으로 구성한다. username 미설정 상태는 별도 step 또는 폴더 확인 직후 blocking step으로 유지한다.
4. `Git 선택` step에서 `git 사용 안 함`과 `git 사용`을 명확히 선택할 수 있어야 한다.
5. 기본 선택은 `git 사용 안 함`이다.
6. `git 사용 안 함`이면 git setup path, local init, remote setup 관련 입력을 숨기고 최종 request에 `gitMode: "off"`와 `gitSetup: undefined`를 보낸다.
7. `git 사용`이면 local/defer/remote setup 입력을 보여주고 선택값에 따라 `gitSetup` request를 만든다.
8. 폴더 확인이 끝나기 전에는 기본 설정과 git 선택으로 넘어갈 수 없어야 한다.
9. live mode, username configured, rootDir, inspection 상태에 맞는 disabled/back/next/save 조건을 둔다.
10. ko/en locale에 step label, git 선택 설명, confirm summary 문구를 추가한다.

## 구현 대상

- `apps/dashboard/src/app/DashboardApp.tsx`
- `apps/dashboard/src/shared/locale/dashboardLocale.ts`
- `apps/dashboard/src/shared/model/dashboard.ts`
- 필요한 경우 dashboard utility/test fixture

## 수용 기준

- project add dialog가 step별 입력 화면을 렌더링하고 한 화면에 모든 설정을 동시에 노출하지 않는다.
- `git 사용 안 함` 선택 후 save하면 request에 `gitMode: "off"`가 들어가고 `gitSetup`은 없다.
- `git 사용` 선택 후 local/defer 선택에 따라 기존 request contract가 유지된다.
- Stepper back/next/cancel/save 상태가 keyboard/mouse 조작에서 예측 가능하게 동작한다.
- dashboard build가 성공한다.

## 제외

- 프로젝트 추가를 별도 route/page로 분리
- 원격 provider 상세 설정 전체 재설계
- dashboard 외부 CLI interactive UX 변경
