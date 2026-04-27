---
pgg:
  topic: "pgg-project-settings-and-git-onboarding"
  stage: "plan"
  status: "reviewed"
  skill: "pgg-plan"
  score: 96
  updated_at: "2026-04-27T06:08:10Z"
  archive_type: "feat"
  project_scope: "current-project"
---

# Spec S5: Verification And Regression Contract

## Objective

CLI init/help, project manifest migration, git onboarding deferred completion, dashboard settings 이동이 회귀 없이 검증되도록 테스트와 수동 확인 계약을 정의한다.

## Requirements

- CLI help locale 출력 테스트를 추가한다.
- non-TTY init flag path와 interactive helper의 pure logic을 테스트 가능하게 분리한다.
- manifest normalize/migration 테스트에 git setup status와 민감 정보 미저장을 포함한다.
- git remote URL parser는 GitHub/GitLab HTTPS/SSH URL fixture로 테스트한다.
- deferred completion은 init/git setup service 단위 테스트로 검증한다.
- dashboard model/locale/store 변경은 타입 검사와 component-level smoke test 또는 build로 검증한다.
- 실제 provider login, repo 생성, push는 네트워크와 credentials가 필요하므로 자동 테스트에서는 adapter mock으로 검증하고 수동 verification 항목으로 분리한다.

## Acceptance Criteria

- `pnpm build`가 통과한다.
- 관련 CLI/core 테스트 또는 신규 regression script가 통과한다.
- dashboard build/type check가 settings 이동과 locale 누락을 잡는다.
- git setup deferred path는 repository를 만들거나 remote를 바꾸지 않고도 검증된다.
- 실제 provider push는 manual verification required로 명확히 남긴다.

## Verification Commands

- `pnpm build`
- `pnpm test`

## Manual Verification

- GitHub/GitLab 실제 login, repository 생성, push는 credential과 network가 필요하므로 QA에서 별도 manual verification 항목으로 남긴다.
- dashboard live mode에서 git setup modal이 실제 core/API action과 연결되는지는 local live server로 확인한다.
