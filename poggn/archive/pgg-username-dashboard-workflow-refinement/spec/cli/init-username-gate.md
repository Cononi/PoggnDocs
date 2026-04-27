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

# Spec: CLI Username Gate

## Scope

CLI는 전역 username을 설정하고, username이 없으면 `pgg init`을 진행하지 않는다.

## Requirements

- command parser는 `config`와 `settings` command를 인식해야 한다.
- `pgg config username {이름}`은 전역 username을 저장하고 JSON result를 출력한다.
- `pgg settings` 기본 메뉴는 username 변경을 제공한다.
- `pgg init`은 provider/language 질문 전에 username configured 여부를 검사한다.
- username이 없으면 init은 파일을 생성하지 않고 안내 메시지를 출력한다.
- missing username 안내에는 `pgg config username {이름}`이 포함되어야 한다.
- help text는 `pgg config username {name}`과 `pgg settings`를 ko/en 모두 포함해야 한다.

## Non-Interactive Behavior

- non-TTY에서도 `pgg config username {이름}`은 동작해야 한다.
- non-TTY `pgg init` missing username은 exit code failure와 machine-readable error를 제공해야 한다.
- `--lang ko|en`이 있으면 안내 언어에 반영한다. 없으면 기존 help language resolution을 따른다.

## Acceptance Criteria

- username missing 상태에서 `pgg init --cwd <dir>`은 `.pgg/project.json`을 만들지 않는다.
- username 설정 후 동일 command는 기존 init flow로 들어간다.
- `pgg settings`에서 username 변경 후 dashboard snapshot에 새 이름이 반영된다.
- tests cover config command, settings mutation path, init gate, help output.
