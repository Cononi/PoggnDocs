---
pgg:
  topic: "pgg-optional-git-init-and-active-isolation"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-28T04:44:32Z"
state:
  summary: "CLI/core init-update에서 git-off 정상 경로를 정의한다."
  next: "pgg-code"
---

# Spec S1: git optional init/update

## 목적

`.git`이 없는 프로젝트도 `pgg init`, `pgg update`, dashboard 등록을 정상적으로 완료할 수 있게 core/CLI의 git 의존성을 선택 기능으로 분리한다.

## 현재 동작

- `createProjectManifest`는 `gitMode`가 없으면 `git.mode`를 `off`로 normalize할 수 있다.
- CLI init은 feature 선택에서 git을 고르지 않으면 `gitMode: "off"`를 넘긴다.
- `runProjectGitOnboarding`은 local/setup/fast path에서 실제 git 명령을 실행한다.
- `detectProjectGitConfig`는 `.git` 또는 remote를 발견하면 감지 결과를 git-on 성격으로 보정할 수 있다.

## 요구사항

1. `gitMode: "off"` init/update는 `.git` 디렉터리나 remote가 없어도 성공해야 한다.
2. `gitMode: "off"` init/update는 `git init`, `git remote`, `git branch`, `git status` 같은 git 명령을 필수 경로로 실행하지 않아야 한다.
3. CLI `pgg init`의 비대화형 명시 옵션과 대화형 feature 선택 모두 git-off 선택을 명확히 지원해야 한다.
4. `pgg update`는 git 설정을 새로 강제하거나 `.git` 부재를 오류로 취급하지 않아야 한다.
5. 기존 git-on onboarding, defer, local init, remote setup 테스트는 유지되어야 한다.
6. dashboard core init API는 `gitMode: "off"`일 때 `request.gitSetup`이 없으면 onboarding을 호출하지 않아야 한다.
7. `.git`이 있는 프로젝트에서 사용자가 명시적으로 git-off를 선택한 경우의 정책을 테스트와 문서에 명확히 남겨야 한다.

## 구현 대상

- `packages/core/src/index.ts`
- `packages/cli/src/index.ts`
- `packages/core/src/templates.ts`
- `packages/core/test/git-onboarding.test.mjs`
- `packages/core/test/skill-generation.test.mjs`
- 필요한 경우 CLI 테스트 fixture

## 수용 기준

- `.git` 없는 임시 디렉터리에서 `initializeProject(..., { gitMode: "off" })`와 `updateProject`가 성공한다.
- git-off 경로 테스트에서 mock runner 또는 동등 검증으로 git onboarding 호출이 없음을 확인한다.
- dashboard init request가 `gitMode: "off"`이고 `gitSetup`이 없을 때 manifest와 registry가 `gitMode: "off"`를 유지한다.
- git-on 기존 테스트가 regress하지 않는다.

## 제외

- 원격 저장소 생성 UX 재설계
- git provider 인증 flow 변경
- git-off 프로젝트에 commit 기능을 제공하는 별도 저장소 abstraction
