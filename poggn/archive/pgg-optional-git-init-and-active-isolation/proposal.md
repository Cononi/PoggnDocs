---
pgg:
  topic: "pgg-optional-git-init-and-active-isolation"
  stage: "proposal"
  status: "reviewed"
  skill: "pgg-add"
  score: 95
  updated_at: "2026-04-28T04:40:12Z"
  auto_mode: "on"
  archive_type: "feat"
  version_bump: "minor"
  target_version: "3.1.0"
  short_name: "optional-isolation"
  working_branch: "ai/feat/3.1.0-optional-isolation"
  release_branch: "release/3.1.0-optional-isolation"
  project_scope: "current-project"
state:
  summary: "pgg init과 dashboard project add에서 git을 선택 사항으로 분리하고, 다중 active topic의 격리 진행 규칙을 확정한다."
  next: "pgg-plan"
---

# Proposal

## 1. 제목

pgg-optional-git-init-and-active-isolation

## 2. 변경 분류

- archive_type: `feat`
- version_bump: `minor`
- target_version: `3.1.0`
- short_name: `optional-isolation`
- working_branch: `ai/feat/3.1.0-optional-isolation`
- release_branch: `release/3.1.0-optional-isolation`
- project_scope: `current-project`

## 3. 사용자 입력 질문 기록

- `pgg init update에 설정 방향성과 pgg-* flow 수정 사항 입니다.`
- `pgg init 시 git을 사용하지 않고 그냥 사용하도록 할 수도 있어야 합니다. 현재 시스템은 git 의존도가 너무 강하게 결합되어 있습니다.`
- `dashboard에서 프로젝트 추가 할때도 git init이 강제가 아니여야 합니다. git을 사용할지 안할지부터 선택지가 있어야 합니다.`
- `dashboard에서 프로젝트 추가할때 모달에서 한번에 입력을 받는게 아니라 https://v7.mui.com/material-ui/react-stepper/에 Linear방식을 채택해서 입력 후 확인하면 다음 스탭 화면으로 넘어가는 식으로 해야 합니다.`
- `active가 만약 여러개일때 각자 진행하게 되면 checkout을 통해 해당 branch로 작업하고 active여러개가 나중에 한개로 합쳐지는 조건으로 처리해야할 거같습니다. 안그러면 충돌문제가 발생합니다.`
- `active가 여러개인데 git이 미적용이라면 서로 관여하지 않는선에서 작업되도록 해야 합니다.`

## 4. 왜 하는가

- 현재 manifest와 core 타입은 `git.mode`를 `on|off`로 갖고 있지만, init/onboarding/active topic 운영 규칙 곳곳이 git repository와 branch를 기본 전제로 해석될 수 있다. [packages/core/src/index.ts](/config/workspace/poggn-ai/packages/core/src/index.ts:52) [packages/core/src/index.ts](/config/workspace/poggn-ai/packages/core/src/index.ts:1223)
- CLI init은 feature 선택으로 git mode를 정하지만, git을 쓰지 않는 사용자의 "그냥 pgg만 사용" 경로를 주요 성공 경로로 검증하고 문서화해야 한다. [packages/cli/src/index.ts](/config/workspace/poggn-ai/packages/cli/src/index.ts:389) [packages/cli/src/index.ts](/config/workspace/poggn-ai/packages/cli/src/index.ts:612)
- dashboard project add는 `gitMode`를 보낼 수 있으나 현재 UI가 한 모달 안에서 root, 언어, git setup path, mode, category를 동시에 받는다. 사용자는 먼저 git 사용 여부를 선택하고, 그 결과에 따라 다음 step의 입력만 보길 기대한다. [apps/dashboard/src/app/DashboardApp.tsx](/config/workspace/poggn-ai/apps/dashboard/src/app/DashboardApp.tsx:947) [apps/dashboard/src/app/DashboardApp.tsx](/config/workspace/poggn-ai/apps/dashboard/src/app/DashboardApp.tsx:1280)
- dashboard core init API는 `gitMode` 기본값을 `off`로 둘 수 있으므로, UI와 flow 계약이 이를 명확히 드러내면 git init 강제 없이 프로젝트 등록이 가능하다. [packages/core/src/index.ts](/config/workspace/poggn-ai/packages/core/src/index.ts:2173)
- 다중 active topic은 git mode가 켜져 있을 때 branch isolation을 강하게 적용해야 한다. 반대로 git mode가 꺼져 있으면 branch checkout이 불가능하므로 topic별 changed path ownership과 conflict preflight로 서로 관여하지 않는 범위를 보장해야 한다.

## 5. 무엇을 할 것인가

- `pgg init`과 `pgg update`가 git repository를 필수 전제로 삼지 않도록 CLI, core manifest normalization, generated docs, helper guardrail을 점검하고 `git mode=off`의 정상 경로를 명시한다.
- dashboard 프로젝트 추가 흐름을 MUI Material `Stepper`의 Linear 방식으로 재구성한다. step은 최소 `프로젝트 경로 확인 -> 기본 설정 -> git 사용 여부 및 설정 -> 카테고리/확인` 순서를 따른다.
- dashboard project add에서 첫 단계 또는 초기 설정 단계에 `git 사용 안 함`과 `git 사용` 선택지를 둔다. `git 사용 안 함`이면 `git init`, remote setup, branch prefix 입력을 숨기고 `gitMode: "off"`로 등록한다.
- `git 사용`을 선택한 경우에만 local git init, 기존 remote 확인, defer setup 같은 세부 step을 보여주고 `runProjectGitOnboarding`을 호출한다.
- active topic이 여러 개이고 `git mode=on`이면 각 topic은 자신의 `working_branch`에서만 구현/검증되도록 checkout recovery, branch mismatch guard, publish merge 조건을 명확히 한다.
- active topic이 여러 개이고 `git mode=off`이면 branch 격리 대신 topic별 file ownership, dirty baseline, changed path 충돌 감지, stage 시작 전 preflight를 적용해 서로의 범위를 침범하지 않게 한다.
- pgg-* flow 문서와 helper는 git mode별로 completion evidence를 분리한다. `git mode=on`은 commit/branch evidence를 사용하고, `git mode=off`는 stage artifact/history/changed files evidence로 완료를 판단한다.

## 6. 범위

### 포함

- CLI `pgg init`, `pgg update`, `pgg git` 경로의 git optional contract 정리
- dashboard project add dialog의 Linear Stepper 전환
- dashboard init request의 `gitMode: "off"` 주요 경로 검증
- `git mode=off`에서 `.git` 미존재 프로젝트를 정상 지원하는 core/helper/test 보강
- 다중 active topic의 git-on branch isolation 규칙
- 다중 active topic의 git-off changed path ownership/preflight 규칙
- WOKR-FLOW, STATE-CONTRACT, pgg-* skill, generated template, dashboard locale/test 갱신

### 제외

- 여러 active branch를 자동 squash/merge/rebase하는 고급 git 편집 기능
- 원격 저장소 생성/권한/인증 UX의 전체 재설계
- git이 꺼진 프로젝트에서 commit을 강제로 에뮬레이션하는 기능
- dashboard 외부의 별도 데스크톱 앱 또는 브라우저 확장

## 7. 제약 사항

- project scope는 `current-project`로 유지한다.
- `git mode=off`는 degraded mode가 아니라 공식 정상 모드여야 한다.
- `git mode=off`에서는 git 명령을 실패할 때까지 호출하지 말고, 사전에 mode와 `.git` 존재 여부로 분기한다.
- `git mode=on`에서 다중 active topic은 topic `working_branch` 불일치 시 구현을 계속하지 않고 checkout recovery 또는 명확한 blocker를 남긴다.
- `git mode=off`에서 다중 active topic은 같은 path를 동시에 수정하려는 경우 stage 시작 전 blocker로 표시한다.
- dashboard Stepper는 한 화면에 모든 입력을 나열하지 않고, 현재 step에 필요한 입력과 확인 액션만 보여준다.
- MUI Stepper 적용은 현재 dashboard의 MUI 기반 디자인과 locale 구조를 유지한다.

## 8. auto mode 처리

- poggn auto mode: `on`
- auto mode가 `on`이므로 이번 proposal에서는 기본 방향을 확정한다. git은 선택 기능이며, git 없는 프로젝트도 init/update/dashboard 등록/workflow 진행의 정상 경로다.

## 9. 기준안

| 항목 | 기준안 | 상태 |
|---|---|---|
| CLI init 기본 경로 | 명시 입력이 없거나 git을 선택하지 않으면 `gitMode: "off"`로 init을 완료한다. | resolved |
| dashboard add 기본 경로 | Stepper에서 git 사용 여부를 먼저 선택하고, 기본값은 `git 사용 안 함`이다. | resolved |
| dashboard git setup | git 사용을 선택한 경우에만 local/defer/remote setup step을 노출한다. | resolved |
| MUI Stepper 방식 | `https://v7.mui.com/material-ui/react-stepper/`의 Linear stepper 패턴을 사용한다. | resolved |
| active 다중 처리, git on | topic별 `working_branch` checkout을 강제하고 나중에 release/publish 단계에서 합류 조건을 검증한다. | resolved |
| active 다중 처리, git off | topic별 파일 범위와 dirty baseline 충돌 검사를 stage preflight로 사용한다. | resolved |
| 완료 evidence | git on은 commit/branch evidence, git off는 artifact/history/changed files evidence를 사용한다. | resolved |

## 10. 성공 기준

- `.git`이 없는 디렉터리에서도 `pgg init`과 `pgg update`가 git setup 없이 성공한다.
- dashboard에서 프로젝트 추가 시 Linear Stepper가 표시되고, git 사용 여부 선택 전에는 git init/setup이 실행되지 않는다.
- dashboard에서 `git 사용 안 함`으로 프로젝트를 추가하면 manifest/registry/snapshot의 `gitMode`가 `off`로 유지된다.
- dashboard에서 `git 사용`을 선택한 경우에만 git onboarding step이 실행된다.
- active topic이 여러 개일 때 `git mode=on`은 topic별 working branch 불일치를 감지하고, 잘못된 branch에서 작업을 진행하지 않는다.
- active topic이 여러 개일 때 `git mode=off`는 같은 파일을 동시에 수정하는 topic을 stage 시작 전 충돌로 표시한다.
- pgg-code, pgg-refactor, pgg-qa의 완료 조건이 git mode별 evidence 차이를 정확히 반영한다.
- 관련 core/cli/dashboard 테스트와 현재 프로젝트 verification contract 결과가 기록된다.

## 11. 전문가 평가 요약

- 프로덕트 매니저: 이번 변경은 git을 "필수 인프라"가 아니라 "선택 가능한 운영 모드"로 낮추는 제품 방향 전환이다. init과 dashboard 모두 첫 사용 성공률을 높이기 위해 git-off 경로가 주요 흐름이어야 한다.
- UX/UI 전문가: dashboard 프로젝트 추가는 한 모달에 모든 설정을 넣는 방식보다 Linear Stepper가 적합하다. 사용자가 경로 확인, 기본 설정, git 선택, 최종 확인을 순차적으로 끝내면 git init 강제 오해가 줄어든다.

## 12. 다음 단계

`pgg-plan`에서 다음을 분해한다.

- core/CLI init-update git optional contract와 회귀 테스트
- dashboard Linear Stepper project add UX와 locale/test
- pgg-* flow와 helper의 `git mode=on/off` evidence 분기
- 다중 active topic의 branch isolation 및 file ownership preflight
