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

# Spec: Project Add Init Stepper

## Scope

Dashboard project add modal에서 `.pgg/project.json` 또는 `.git`가 없는 폴더를 초기화할 수 있게 한다.

## Requirements

- `registerExistingProject()`의 missing manifest error를 단순 실패로 끝내지 않고 dashboard Stepper path로 이어간다.
- Stepper steps:
  1. folder inspection
  2. username check
  3. pgg init settings
  4. git setup path
  5. category registration
- pgg init settings는 CLI init의 provider/lang/auto/teams/git 의미를 유지한다.
- username이 없으면 Stepper에서 init을 막고 username 설정 action을 제공한다.
- `.git`가 없으면 local git init 또는 deferred path를 제공한다.
- remote setup은 기존 project settings git Stepper의 FAST PATH/SETUP PATH model을 재사용한다.
- category selection은 기존 project add category draft를 유지한다.

## API Requirements

- dashboard live API는 folder inspection endpoint를 제공해야 한다.
- dashboard live API는 project initialization endpoint를 제공해야 한다.
- init endpoint는 username gate를 core와 공유해야 한다.
- successful init 후 registry/category update까지 atomic하게 이어지거나, 실패 시 단계별 error를 반환해야 한다.

## Acceptance Criteria

- 이미 pgg init된 project는 기존처럼 등록된다.
- pgg init되지 않은 project는 modal Stepper에서 init 후 등록된다.
- git init되지 않은 project는 local git init 또는 deferred status로 등록 가능하다.
- static snapshot mode에서는 Stepper mutation controls가 disabled state를 표시한다.
